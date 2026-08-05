"use client";

import { memo, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppStore } from "@/lib/store";

const StatCard = memo(function StatCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent>
        <p style={{ color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontSize: 12 }}>
          {title}
        </p>
        <h3 style={{ margin: "8px 0 4px", fontSize: 28 }}>{value}</h3>
        <p style={{ margin: 0, color: "#6b7280" }}>{description}</p>
      </CardContent>
    </Card>
  );
});

export default function DashboardPage() {
  const fetchUsers = useAppStore((state) => state.fetchUsers);
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const users = useAppStore((state) => state.users);
  const products = useAppStore((state) => state.products);

  useEffect(() => {
    void fetchUsers({ limit: 6, skip: 0 });
    void fetchProducts({ limit: 6, skip: 0 });
  }, [fetchProducts, fetchUsers]);

  const handleRefresh = useCallback(() => {
    void fetchUsers({ limit: 6, skip: 0, force: true });
    void fetchProducts({ limit: 6, skip: 0, force: true });
  }, [fetchProducts, fetchUsers]);

  const summaryCards = useMemo(
    () => [
      { title: "Users", value: users.total.toString(), description: "Registered people in the directory" },
      { title: "Products", value: products.total.toString(), description: "Items available for browsing" },
      { title: "Cache", value: "5 min", description: "Zustand cache reduces repeated calls" },
    ],
    [products.total, users.total]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 , color: "#161717"}}>Quick overview</h1>
          <p style={{ margin: "4px 0 0", color: "#161717" }}>Cached lists and pagination keep the experience responsive.</p>
        </div>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
          Refresh data
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {summaryCards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} description={card.description} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        <Card>
          <CardContent>
            <h2 style={{ margin: 0, fontSize: 20 }}>Recent users</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {users.data.slice(0, 4).map((user) => (
                <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{`${user.firstName} ${user.lastName}`}</p>
                    <p style={{ margin: "2px 0 0", color: "#6b7280" }}>{user.email}</p>
                  </div>
                  <Button component={Link} href={`/dashboard/users/${user.id}`} size="small">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 style={{ margin: 0, fontSize: 20 }}>Featured products</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
              {products.data.slice(0, 4).map((product) => (
                <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{product.title}</p>
                    <p style={{ margin: "2px 0 0", color: "#6b7280" }}>{product.category}</p>
                  </div>
                  <Button component={Link} href={`/dashboard/products/${product.id}`} size="small">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
