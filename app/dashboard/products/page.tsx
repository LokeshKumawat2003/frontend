
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  type SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAppStore } from "@/lib/store";

const categories = ["", "smartphones", "laptops", "fragrances", "skincare", "groceries", "home-decoration"];

export default function ProductsPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const fetchProducts = useAppStore((state) => state.fetchProducts);
  const products = useAppStore((state) => state.products);
  const [search, setSearch] = useState(products.search);
  const [category, setCategory] = useState(products.category);

  const page = useMemo(() => Math.floor(products.skip / products.limit), [products.limit, products.skip]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(products.total / products.limit)), [products.limit, products.total]);

  useEffect(() => {
    void fetchProducts({ limit: products.limit, skip: products.skip, search: products.search, category: products.category });
  }, [category, fetchProducts, products.category, products.limit, products.search, products.skip]);

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void fetchProducts({ limit: products.limit, skip: 0, search, category, force: true });
    },
    [category, fetchProducts, products.limit, search]
  );

  const handlePageChange = useCallback(
    (direction: number) => {
      const nextSkip = Math.max(0, products.skip + direction * products.limit);
      void fetchProducts({ limit: products.limit, skip: nextSkip, search: products.search, category: products.category, force: true });
    },
    [fetchProducts, products.category, products.limit, products.search, products.skip]
  );

  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const nextCategory = event.target.value;
      setCategory(nextCategory);
      void fetchProducts({ limit: products.limit, skip: 0, search, category: nextCategory, force: true });
    },
    [fetchProducts, products.limit, search]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Paper sx={{ p: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Products catalog</h1>
            <p style={{ margin: "4px 0 0", color: "#6b7280" }}>Search, filter, and paginate products from DummyJSON.</p>
          </div>
          <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: isSm ? "stretch" : "flex-end", flexWrap: "wrap" }}>
            <form onSubmit={handleSearch} style={{ flex: isSm ? "1 1 100%" : 1, minWidth: 240 }}>
              <TextField label="Search products" fullWidth value={search} onChange={(event) => setSearch(event.target.value)} />
            </form>
            <FormControl sx={{ minWidth: isSm ? "100%" : 220 }}>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={category} onChange={handleCategoryChange}>
                {categories.map((option) => (
                  <MenuItem key={option || "all"} value={option}>
                    {option ? option : "All categories"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </Paper>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isSm ? 1 : isMd ? 2 : 3}, minmax(0, 1fr))`, gap: 16 }}>
        {products.data.map((product) => (
          <Card key={product.id} sx={{ height: "100%" }}>
            <CardMedia component="img" image={product.thumbnail} alt={product.title} sx={{ objectFit: "cover", height: isSm ? 140 : 180 }} />
            <CardContent>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{product.title}</h2>
              <p style={{ margin: 0, color: "#6b7280", minHeight: 48 }}>{product.description}</p>
              <p style={{ margin: "8px 0 0", fontWeight: 700 }}>${product.price}</p>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>Category: {product.category}</p>
              <p style={{ margin: "4px 0 0", color: "#6b7280" }}>Rating: {product.rating}/5</p>
            </CardContent>
            <CardActions>
              <Button component={Link} href={`/dashboard/products/${product.id}`} size="small">
                View details
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ margin: 0, color: "#6b7280" }}>Page {page + 1} of {totalPages}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => handlePageChange(-1)} disabled={products.skip === 0}>
            Previous
          </Button>
          <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => handlePageChange(1)} disabled={products.skip + products.limit >= products.total}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
