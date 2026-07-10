# Mini ERP System

A small fullstack ERP-style web application for managing products, inventory, suppliers and stock values.

## Overview

This project is a mini ERP system built as a fullstack application.  
It provides an inventory management dashboard where users can create, view, edit and delete products. It also includes stock booking, search and filter functionality.

The goal of this project is to demonstrate practical fullstack development, REST API usage, database integration and ERP-related business processes such as product, stock and supplier management.

## Features

- Product overview
- Add new products
- Edit existing products
- Delete products
- Stock booking with +1, +10 and -1
- Protection against negative stock values
- Search by article number, product name or supplier
- Filter by category
- Filter by stock status
- Inventory stock calculation
- Total warehouse value calculation
- Supplier information
- MongoDB persistence
- REST API integration
- Responsive dashboard UI

## Tech Stack

### Frontend

- React
- JavaScript
- CSS
- Vite

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv

## Project Structure

```txt
mini-erp-system/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   │   └── Product.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
API Endpoints
Get all products
GET /api/products
Add a new product
POST /api/products

Example body:

{
  "articleNumber": "MAT-1003",
  "name": "Keyboard",
  "category": "IT-Hardware",
  "stock": 30,
  "price": 49.99,
  "supplier": "Office Supplier GmbH"
}
Update a product
PUT /api/products/:id
Update product stock
PATCH /api/products/:id/stock

Example body:

{
  "quantityChange": 10
}
Delete a product
DELETE /api/products/:id
Environment Variables

Create a .env file inside the server folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000

The .env file is ignored by Git and should not be committed.

Getting Started
1. Clone the repository
git clone https://github.com/MEHMET24092000/mini-erp-system.git
cd mini-erp-system
2. Install and start the backend
cd server
npm install
npm run dev

The backend runs on:

http://localhost:5000
3. Install and start the frontend

Open a second terminal:

cd client
npm install
npm run dev

The frontend runs on:

http://localhost:5173
Future Improvements
Purchase order management
Goods receipt process
Supplier management
User authentication
Dashboard charts
Role-based access
Deployment of frontend and backend
Author

Tunc Mehmet
GitHub: MEHMET24092000