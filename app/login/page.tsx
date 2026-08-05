"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, CardContent, Container, TextField } from "@mui/material";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAppStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: "emilys", password: "emilyspass" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://dummyjson.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });

        const data = await response.json();

        if (!response.ok || data?.message) {
          throw new Error("Invalid credentials");
        }
        console.log(data.token)
        setAuth(data.accessToken, {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          accessToken: data.token,
        });
        router.push("/dashboard");
      } catch {
        setError("Invalid credentials. Try the demo account from DummyJSON.");
      } finally {
        setLoading(false);
      }
    },
    [form.password, form.username, router, setAuth]
  );

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
      <Card sx={{ width: "100%", p: 1, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Admin Access
              </p>
              <h1 style={{ margin: "8px 0 4px", fontSize: 32 }}>Study Abroad Dashboard</h1>
              <p style={{ margin: 0, color: "#6b7280" }}>
                Sign in with DummyJSON credentials to access the admin dashboard.
              </p>
            </div>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TextField
                label="Username"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                fullWidth
                required
              />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>
            <p style={{ margin: 0, color: "#6b7280" }}>Demo credentials: emilys / emilyspass</p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
