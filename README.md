# McDonald’s Menu Ordering App (Next.js + MongoDB + MUI)

A full-stack web application built with **Next.js (App Router)** that supports **role-based login** (Customer vs Manager), a **menu browsing & cart flow**, and a **manager dashboard** for viewing sales stats and managing the menu.

> **Roles**
> - **Customer:** Browse menu, add items to cart, checkout  
> - **Manager:** View manager dashboard + manage menu (add/remove products)

---

## Features

### Customer
- Browse a dynamic product menu (pulled from MongoDB)
- Add items to cart + view cart count badge
- Remove items from cart + calculate total
- Checkout creates an order in MongoDB
- Logout

### Manager
- Manager-only dashboard
- Sales stats: total orders, revenue, items sold
- Sales graph (orders by day)
- Menu management page: add/remove products
- Logout

---

## Tech Stack

- **Frontend:** Next.js (App Router), React
- **UI:** Material UI (MUI), MUI X Charts
- **Backend:** Next.js API Routes (server functions)
- **Database:** MongoDB Atlas
- **Auth (demo-level):** Role stored client-side (sessionStorage)

---

## Project Structure (important folders)

