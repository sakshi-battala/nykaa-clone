# Nykaa Clone

A React + TypeScript + Vite clone of a Nykaa-inspired beauty e-commerce storefront.

## Overview

This project is a frontend clone focused on beauty and cosmetics products. It demonstrates a modern React application with routing, responsive UI, product filtering, cart and wishlist management, and a checkout flow. The design is built with Tailwind CSS and Radix UI primitives to create reusable and accessible components.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Query
- Radix UI primitives
- Lucide Icons
- Recharts (for future dashboard visuals or analytics)

## Functionality

### Product catalog

- Displays a list of makeup products in a grid layout.
- Supports searching by product name or brand.
- Allows filtering by category and brand using dropdown selectors.
- Includes a price range slider to restrict products by maximum cost.
- Supports minimum rating filtering to show higher-rated products only.
- Provides sort options for featured, price ascending, price descending, and name.
- Uses pagination to split the catalog into pages of 12 items.

### Product details

- Opens a dedicated detail page for each product.
- Shows product image, brand, category, price, rating, and full description.
- Allows users to add products to the cart or wishlist from the details view.
- Includes fallback handling when product data is incomplete.

### Cart experience

- Provides a cart drawer for quick access from any page.
- Displays selected items, quantities, and subtotal pricing.
- Includes a full cart page for review, editing quantities, and removing products.
- Supports cart state persistence through the app context.

### Wishlist experience

- Offers a wishlist page for saved favorite items.
- Allows adding and removing products from wishlist.
- Enables quick navigation from wishlist items to product details.

### Checkout

- Includes a checkout page with form fields for user details.
- Designed as a final step in the storefront demo to show checkout flow.
- Prepared for validation and order submission enhancement.

### Responsive design

- Mobile-friendly layout with adaptive grids and navigation.
- Responsive breakpoints for tablets and desktop screens.
- Smooth transitions and UI states for loading, empty states, and filters.

## Makeup API integration

The app fetches product data from the Makeup API endpoint:

- `https://makeup-api.herokuapp.com/api/v1/products.json`

Integration details from `src/services/api.ts`:

- Fetches makeup products from the external API.
- Filters out items without `image_link` or `name` to avoid broken product cards.
- Ensures each product has a valid `price` by setting a default value when missing.
- Uses `AbortController` with a timeout to prevent long waits on slow responses.
- Falls back to `src/services/mockProducts.ts` if the Makeup API is unreachable or returns an error.

## Project structure

- `src/pages/` — route views such as Home, Products, ProductDetails, Cart, Wishlist, Checkout, and OrderSuccess.
- `src/components/` — reusable UI components, including navigation, cards, drawers, footers, and layout sections.
- `src/services/` — API integration, data fetching logic, and fallback mock product data.
- `src/context/` — shared application state, including cart and wishlist providers.
- `src/types/` — TypeScript interfaces and models for products and app state.
- `src/utils/` — helper functions, category data, formatting utilities, and shared logic.

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

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

- The Makeup API is a public API used for cosmetics product data.
- Local mock data is included to make the app resilient when the external API is unavailable.
- This project is intended as a UI clone and does not include actual payment processing or backend order fulfillment.
