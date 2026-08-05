"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, Button, Card, CardContent, Chip, useTheme, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppStore } from "@/lib/store";

export default function UserDetailPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const fetchSingleUser = useAppStore((state) => state.fetchSingleUser);
  const [user, setUser] = useState<Awaited<ReturnType<typeof fetchSingleUser>>>(null);

  useEffect(() => {
    void (async () => {
      const result = await fetchSingleUser(id);
      setUser(result);
    })();
  }, [fetchSingleUser, id]);

  if (!user) {
    return (
      <Card>
        <CardContent>
          <p>Loading user...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Button component={Link} href="/dashboard/users" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
        Back to users
      </Button>

      <Card>
        <CardContent>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} sx={{ width: isMobile ? 64 : 96, height: isMobile ? 64 : 96 }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 24 }}>{`${user.firstName} ${user.lastName}`}</h1>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{user.email}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <Chip label={user.gender} color="primary" variant="outlined" />
                <Chip label={user.company?.name ?? "Unknown company"} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>Profile details</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            <div>
              <p style={{ margin: 0, color: "#6b7280" }}>Username</p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{user.username}</p>
            </div>
            <div>
              <p style={{ margin: 0, color: "#6b7280" }}>Phone</p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{user.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
