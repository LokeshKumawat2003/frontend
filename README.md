# Study Abroad Frontend Assessment

This project is a responsive Next.js dashboard built for the frontend technical assessment. It uses MUI for UI, Zustand for state management, and DummyJSON for mocked authentication, users, and products data.

## Features

- Admin login flow with DummyJSON credentials
- Protected dashboard routes
- Responsive users list with search and pagination
- Responsive products catalog with search, category filtering, and pagination
- Zustand-powered state with a lightweight cache and local persistence
- Detail pages for both users and products

## Why Zustand was chosen

Zustand was used because it is lightweight, easy to set up, and fits a small-to-medium app well. It avoids the boilerplate of Redux while still supporting async actions and shared state in a clean way.

## Caching strategy

The store caches paginated user and product results for five minutes and persists them locally in the browser. This reduces repeated API calls and keeps navigation responsive without introducing a heavier caching layer.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## Demo login

- Username: kminchelle
- Password: 0lelplR

## Environment notes

No environment variables are required for this assessment. The app uses the public DummyJSON endpoints directly.
