import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserSummary = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  username: string;
  image?: string;
  company?: { name: string };
};

export type ProductSummary = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  thumbnail: string;
  images: string[];
  brand: string;
  stock: number;
  discountPercentage: number;
};

type AuthUser = {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  accessToken?: string;
};

type UsersCacheEntry = {
  data: UserSummary[];
  total: number;
  timestamp: number;
};

type ProductsCacheEntry = {
  data: ProductSummary[];
  total: number;
  timestamp: number;
};
type AppState = {
  auth: {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
  };
  users: {
    data: UserSummary[];
    total: number;
    loading: boolean;
    error: string | null;
    search: string;
    skip: number;
    limit: number;
    cache: Record<string, UsersCacheEntry>;
  };
  products: {
    data: ProductSummary[];
    total: number;
    loading: boolean;
    error: string | null;
    search: string;
    category: string;
    skip: number;
    limit: number;
    cache: Record<string, ProductsCacheEntry>;
  };
  setAuth: (token: string | null, user: AuthUser | null) => void;
  clearAuth: () => void;
  fetchUsers: (options?: { limit?: number; skip?: number; search?: string; force?: boolean }) => Promise<void>;
  fetchSingleUser: (id: number) => Promise<UserSummary | null>;
  fetchProducts: (options?: { limit?: number; skip?: number; search?: string; category?: string; force?: boolean }) => Promise<void>;
  fetchSingleProduct: (id: number) => Promise<ProductSummary | null>;
};

const storage =
  typeof window === "undefined"
    ? ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
    : localStorage;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      auth: {
        token: null,
        user: null,
        isAuthenticated: false,
      },
      users: {
        data: [],
        total: 0,
        loading: false,
        error: null,
        search: "",
        skip: 0,
        limit: 10,
        cache: {},
      },
      products: {
        data: [],
        total: 0,
        loading: false,
        error: null,
        search: "",
        category: "",
        skip: 0,
        limit: 12,
        cache: {},
      },
      setAuth: (token, user) => {
        set((state) => ({
          auth: {
            token,
            user,
            isAuthenticated: Boolean(token),
          },
        }));
      },
      clearAuth: () => {
        set((state) => ({
          auth: {
            token: null,
            user: null,
            isAuthenticated: false,
          },
        }));
      },
      fetchUsers: async (options) => {
        const current = get().users;
        const limit = options?.limit ?? current.limit;
        const skip = options?.skip ?? current.skip;
        const search = options?.search ?? current.search;
        const cacheKey = `${limit}-${skip}-${search}`;
        const cached = current.cache[cacheKey];

        if (!options?.force && cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
          set((state) => ({
            users: {
              ...state.users,
              data: cached.data,
              total: cached.total,
              loading: false,
              error: null,
              search,
              skip,
              limit,
            },
          }));
          return;
        }

        set((state) => ({
          users: {
            ...state.users,
            loading: true,
            error: null,
            search,
            skip,
            limit,
          },
        }));

        try {
          const query = search ? `&q=${encodeURIComponent(search)}` : "";
          const endpoint = search
            ? `https://dummyjson.com/users/search?limit=${limit}&skip=${skip}${query}`
            : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
          const response = await fetch(endpoint);
          const payload = await response.json();
          const data = Array.isArray(payload.users) ? payload.users : Array.isArray(payload) ? payload : [];
          const total = payload.total ?? data.length;
          const cacheEntry = { data, total, timestamp: Date.now() };

          set((state) => ({
            users: {
              ...state.users,
              data,
              total,
              loading: false,
              error: null,
              search,
              skip,
              limit,
              cache: { ...state.users.cache, [cacheKey]: cacheEntry },
            },
          }));
        } catch {
          set((state) => ({
            users: {
              ...state.users,
              loading: false,
              error: "Unable to load users right now.",
            },
          }));
        }
      },
      fetchSingleUser: async (id) => {
        try {
          const response = await fetch(`https://dummyjson.com/users/${id}`);
          const payload = await response.json();
          return payload as UserSummary;
        } catch {
          return null;
        }
      },
      fetchProducts: async (options) => {
        const current = get().products;
        const limit = options?.limit ?? current.limit;
        const skip = options?.skip ?? current.skip;
        const search = options?.search ?? current.search;
        const category = options?.category ?? current.category;
        const cacheKey = `${limit}-${skip}-${search}-${category}`;
        const cached = current.cache[cacheKey];

        if (!options?.force && cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
          set((state) => ({
            products: {
              ...state.products,
              data: cached.data,
              total: cached.total,
              loading: false,
              error: null,
              search,
              category,
              skip,
              limit,
            },
          }));
          return;
        }

        set((state) => ({
          products: {
            ...state.products,
            loading: true,
            error: null,
            search,
            category,
            skip,
            limit,
          },
        }));

        try {
          let endpoint = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
          if (category) {
            endpoint = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
          } else if (search) {
            endpoint = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
          }

          const response = await fetch(endpoint);
          const payload = await response.json();
          const data = Array.isArray(payload.products) ? payload.products : Array.isArray(payload) ? payload : [];
          const total = payload.total ?? data.length;
          const cacheEntry = { data, total, timestamp: Date.now() };

          set((state) => ({
            products: {
              ...state.products,
              data,
              total,
              loading: false,
              error: null,
              search,
              category,
              skip,
              limit,
              cache: { ...state.products.cache, [cacheKey]: cacheEntry },
            },
          }));
        } catch {
          set((state) => ({
            products: {
              ...state.products,
              loading: false,
              error: "Unable to load products right now.",
            },
          }));
        }
      },
      fetchSingleProduct: async (id) => {
        try {
          const response = await fetch(`https://dummyjson.com/products/${id}`);
          const payload = await response.json();
          return payload as ProductSummary;
        } catch {
          return null;
        }
      },
    }),
    {
      name: "study-abroad-store",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        auth: state.auth,
        users: {
          ...state.users,
          cache: state.users.cache,
        },
        products: {
          ...state.products,
          cache: state.products.cache,
        },
      }),
    }
  )
);
