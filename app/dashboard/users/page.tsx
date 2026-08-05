"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAppStore } from "@/lib/store";

export default function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fetchUsers = useAppStore((state) => state.fetchUsers);
  const users = useAppStore((state) => state.users);
  const [search, setSearch] = useState(users.search);

  const page = useMemo(() => Math.floor(users.skip / users.limit), [users.limit, users.skip]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(users.total / users.limit)), [users.limit, users.total]);

  useEffect(() => {
    void fetchUsers({ limit: users.limit, skip: users.skip, search: users.search });
  }, [fetchUsers, users.limit, users.search, users.skip]);

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void fetchUsers({ limit: users.limit, skip: 0, search, force: true });
    },
    [fetchUsers, search, users.limit]
  );

  const handlePageChange = useCallback(
    (direction: number) => {
      const nextSkip = Math.max(0, users.skip + direction * users.limit);
      void fetchUsers({ limit: users.limit, skip: nextSkip, search: users.search, force: true });
    },
    [fetchUsers, users.limit, users.search, users.skip]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24 }}>Users directory</h1>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>Search and browse up to ten users at a time using API-side pagination.</p>
            </div>
            <form onSubmit={handleSearch} style={{ minWidth: isMobile ? "100%" : 320, flex: isMobile ? "1 1 100%" : undefined }}>
              <TextField label="Search users" fullWidth value={search} onChange={(event) => setSearch(event.target.value)} />
            </form>
          </div>
        </CardContent>
      </Card>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.data.map((user) => (
            <Card key={user.id}>
              <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 16 }}>{`${user.firstName} ${user.lastName}`}</h2>
                  <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{user.email}</p>
                  <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{user.company?.name ?? "—"}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button component={Link} href={`/dashboard/users/${user.id}`} size="small" variant="outlined">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.data.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.company?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Button component={Link} href={`/dashboard/users/${user.id}`} size="small">
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ margin: 0, color: "#6b7280" }}>Page {page + 1} of {totalPages}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => handlePageChange(-1)} disabled={users.skip === 0}>
            Previous
          </Button>
          <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => handlePageChange(1)} disabled={users.skip + users.limit >= users.total}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
