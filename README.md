# Mini ERP System

A small fullstack ERP-style web application for managing products, inventory, suppliers and stock values.

## Overview

This project is a mini ERP system built as a fullstack application.  
It provides a simple inventory management dashboard where users can view products, add new items and delete existing entries.

The goal of this project is to demonstrate practical fullstack development, REST API usage, frontend state management and basic ERP-related business processes such as product and stock management.

## Features

- Product overview
- Add new products
- Delete products
- Inventory stock calculation
- Total warehouse value calculation
- Supplier information
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
- CORS

## Project Structure

```txt
mini-erp-system/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── index.js
│   └── package.json
├── README.md
└── .gitignore
## API Endpoints

### Get all products

```txt
GET /api/products
```

### Add a new product

```txt
POST /api/products
```

Example body:

```json
{
  "articleNumber": "MAT-1003",
  "name": "Keyboard",
  "category": "IT-Hardware",
  "stock": 30,
  "price": 49.99,
  "supplier": "Office Supplier GmbH"
}
```

### Delete a product

```txt
DELETE /api/products/:id
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MEHMET24092000/mini-erp-system.git
cd mini-erp-system
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```txt
http://localhost:5000
```

### 3. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on:

```txt
http://localhost:5173
```

## Future Improvements

- MongoDB database integration
- Edit product functionality
- Purchase order management
- Goods receipt process
- User authentication
- Dashboard charts
- Search and filter functions

## Author

Tunc Mehmet  
GitHub: [MEHMET24092000](https://github.com/MEHMET24092000)