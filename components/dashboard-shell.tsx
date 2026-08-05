"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import {
  AppBar,
  Avatar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppStore } from "@/lib/store";

type DashboardShellProps = {
  title: string;
  description: string;
  showHeader?: boolean;
  children: ReactNode;
};

export function DashboardShell({ title, description, children, showHeader = true }: DashboardShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 240;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppStore((state) => state.auth.user);

  const navItems = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", icon: <DashboardIcon /> },
      { label: "Users", href: "/dashboard/users", icon: <PeopleIcon /> },
      { label: "Products", href: "/dashboard/products", icon: <Inventory2Icon /> },
    ],
    []
  );

  const handleLogout = () => {
    useAppStore.getState().clearAuth();
    router.push("/login");
  };

  const drawer = (
    <div style={{ width: drawerWidth, height: "100%", background: "#fff", borderRight: "1px solid #e5e7eb" }}>
      <div style={{ padding: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
        <div>
          <p style={{ margin: 0, fontWeight: 700 }}>Study Abroad</p>
          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
            {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Admin"}
          </p>
        </div>
      </div>
      <List>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <div style={{ padding: 16, marginTop: "auto" }}>
        <Button fullWidth variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}>
          {drawer}
        </Drawer>
      )}

      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", marginLeft: isMobile ? 0 : `${drawerWidth}px` }}>
        {showHeader !== false && (
          <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
              width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
              ml: isMobile ? 0 : `${drawerWidth}px`,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "rgba(255,255,255,0.95)",
              color: "#000",
            }}
          >
            <Toolbar sx={{ gap: 1 }}>
              {isMobile ? (
                <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              ) : null}
              <div>
                <h1 style={{ margin: 0, fontSize: 20, color: "#000" }}>{title}</h1>
                <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{description}</p>
              </div>
            </Toolbar>
          </AppBar>
        )}
        <div style={{ padding: isMobile ? 16 : 32, boxSizing: "border-box", maxWidth: "100%" }}>{children}</div>
      </main>
    </div>
  );
}
