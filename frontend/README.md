<<<<<<< HEAD
# Java Spring Boot E-Commerce Web Frontend

A modern, responsive e-commerce web application frontend custom-engineered for your Java Spring Boot backend located at `D:\Download\demo\demo`.

## Features

- **Modern Glassmorphism UI**: High-contrast, dark & light theme modes, smooth micro-interactions, responsive grid layout.
- **Direct Java Spring Boot API Mapping**: Pre-wired to connect to your backend endpoints:
  - `POST /api/auth/login` & `/api/auth/register` (JWT Token Auth)
  - `GET /api/products` (Supports pagination, search, category filtering & sorting)
  - `GET /api/categories`
  - `POST /api/cart-items`
  - `POST /api/checkout/{customerId}`
- **Offline / Mock Mode Fallback**: Automatically switches to rich mock catalog data when your Java Spring Boot application is stopped, allowing instant UI testing anytime.
- **Live Status Indicator**: Top bar pill shows active connection status (`Spring Backend Connected` vs `Mock Data Mode`).

---

## File Overview

- [`index.html`](file:///C:/Users/hamna.bano/.gemini/antigravity/scratch/ecommerce-frontend/index.html): Main Single Page Application structure with navbar, search, sidebar filters, product grid, cart drawer, auth modal, and checkout modal.
- [`styles.css`](file:///C:/Users/hamna.bano/.gemini/antigravity/scratch/ecommerce-frontend/styles.css): Complete design system with CSS custom variables, dark/light themes, animations, glassmorphism cards, and slide-over drawers.
- [`api-service.js`](file:///C:/Users/hamna.bano/.gemini/antigravity/scratch/ecommerce-frontend/api-service.js): REST client configured for your Java Spring Boot controllers, JWT handling, and fallback logic.
- [`app.js`](file:///C:/Users/hamna.bano/.gemini/antigravity/scratch/ecommerce-frontend/app.js): Application state manager handling search, filters, shopping cart, authentication flow, checkout, and UI events.

---

## How to Run

1. Open [`index.html`](file:///C:/Users/hamna.bano/.gemini/antigravity/scratch/ecommerce-frontend/index.html) directly in any modern web browser (Double-click or drag-and-drop into Chrome / Edge / Firefox).
2. Start your Java Spring Boot backend at `D:\Download\demo\demo` (`mvnw spring-boot:run` or via IntelliJ / Eclipse).
3. Ensure CORS in your Spring Boot `SecurityConfig.java` allows incoming requests:
   ```java
   configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5500", "null", "*"));
   ```
4. Click the **Connection Status Pill** in the top navigation bar anytime to change the Java API Base URL (`http://localhost:8080/api`) or toggle Mock Data mode.
=======
patience
ill do it
>>>>>>> 5f2ec83692efc71d2f0e9d2b0de9b6d3e6f26c90
