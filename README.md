# Nykaa Clone

A React + TypeScript + Vite clone of a Nykaa-style e-commerce storefront focused on beauty and cosmetics.

## Overview

This project is a frontend demo built with:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Radix UI primitives
- React Query

It includes pages for home, products, product details, wishlist, cart, and checkout.

## Makeup API

The product data is fetched from the Makeup API:

- `https://makeup-api.herokuapp.com/api/v1/products.json`

The app uses `src/services/api.ts` to request product data. It filters out products without an image or name, normalizes missing prices to `9.99`, and gracefully falls back to local mock data when the Makeup API is unreachable.

### API behavior

- Fetches a list of makeup products from the Makeup API
- Filters out invalid items that are missing `image_link` or `name`
- Sets a default price for products without a price
- Uses `src/services/mockProducts.ts` as a fallback when the external API fails

## Features

- Product catalog with search, category and brand filters
- Price range filtering, rating filtering, and sort options
- Product detail pages with item previews and pricing
- Cart drawer plus a dedicated cart page for item management
- Wishlist support for saved products
- Checkout form with validation-ready fields
- Responsive layout for desktop and mobile
- API fallback to local mock data when the Makeup API is unavailable

## Project structure

- `src/pages/` — top-level route screens like Home, Products, Cart, Wishlist, and Checkout
- `src/components/` — reusable UI pieces such as cards, navbar, footer, and cart drawer
- `src/services/` — data loading, external Makeup API integration, and mock fallback data
- `src/context/` — shared application state and cart/wishlist logic
- `src/types/` — TypeScript interfaces for products and app data
- `src/utils/` — helper utilities, category lists, and formatting helpers

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- The Makeup API is a public, open API for cosmetics product data.
- Local mock data is provided to ensure the app still works if the external API is unavailable.
- The app is intended as a UI clone and does not include payment processing.
