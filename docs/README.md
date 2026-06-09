# API R&D

## Requirement
We need an API that provides:
- Product catalog
- Product images
- Product descriptions
- Pricing
- Brands
- Categories
- Search and filtering

The goal is to build core e-commerce features such as product listing, product details, category pages, and search functionality.

## APIs Explored

### 1. Fake Store API

**Pros:**
- Free and easy to use
- Basic e-commerce data

**Cons:**
- Very limited products
- Not focused on beauty products

**Decision:**
Not suitable for a Nykaa-like application.

### 2. DummyJSON Products API

**Pros:**
- More products available
- Search and filtering support
- Good documentation

**Cons:**
- Generic product catalog structure
- Limited beauty products in dataset

**Decision:**
Not closely aligned with Nykaa's domain.

### 3. Makeup API (Selected)

**Why Chosen:**
- Beauty and cosmetics-focused API.
- Provides product images, descriptions, prices, brands, and categories.
- Supports filtering by brand and product type.
- No authentication required.
- Easy integration with Angular/React/MERN applications.

**Pros:**
✅ Realistic cosmetic product data 
✅ Product images available 
✅ Brand and category filtering 
✅ Free and simple to use 

**Cons:**
❌ Limited dataset 
❌ Only beauty products 
❌ No cart, orders, or user management APIs 

**Conclusion:**
The Makeup API was selected because it best matches the requirements of a Nykaa-like application. It provides relevant beauty product data and enough features to implement product listing, search, filtering, and product detail pages efficiently.