"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, CardContent, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppStore } from "@/lib/store";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const fetchSingleProduct = useAppStore((state) => state.fetchSingleProduct);
  const [product, setProduct] = useState<Awaited<ReturnType<typeof fetchSingleProduct>>>(null);

  useEffect(() => {
    void (async () => {
      const result = await fetchSingleProduct(id);
      setProduct(result);
    })();
  }, [fetchSingleProduct, id]);

  if (!product) {
    return (
      <Card>
        <CardContent>
          <p>Loading product...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Button component={Link} href="/dashboard/products" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
        Back to products
      </Button>

      <Card>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, color: "#000" }}>{product.title}</h1>
              <p style={{ margin: "8px 0 0", color: "#6b7280" }}>{product.description}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
              <div>
                <p style={{ margin: 0, color: "#6b7280" }}>Price</p>
                <p style={{ margin: "4px 0 0", fontWeight: 700 }}>${product.price}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#6b7280" }}>Category</p>
                <p style={{ margin: "4px 0 0", fontWeight: 700 }}>{product.category}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#6b7280" }}>Brand</p>
                <p style={{ margin: "4px 0 0", fontWeight: 700 }}>{product.brand}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#6b7280" }}>Stock</p>
                <p style={{ margin: "4px 0 0", fontWeight: 700 }}>{product.stock}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Chip label={`Rating ${product.rating}/5`} color="primary" />
              <Chip label={`Discount ${product.discountPercentage}%`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
