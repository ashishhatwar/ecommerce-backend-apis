# ecommerce-backend-apis
E-commerce Backend APIs with Express, MongoDB &amp; Mongoose | Includes User Auth, Products, Cart, Orders, Middleware, and Swagger API Docs

# 🛒 E-commerce Backend APIs

This is a **RESTful API backend** for an E-commerce application built using **Node.js, Express.js, MongoDB, and Mongoose**.  
It includes modules for **User Authentication, Product Management, Cart, and Orders** with middleware support and Swagger API documentation.

---

## 🚀 Features
-  User Authentication (JWT-based)
-  Product CRUD Operations
-  Cart Items Management
-  Order Management
-  Middleware (Auth, File Upload, Logging)
-  Centralized Error Handling
-  Swagger API Documentation
-  Environment-based Configuration

---

## 🛠️ Tech Stack
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for Authentication
- **bcrypt** for Password Hashing
- **dotenv** for Config
- **Swagger** for API Docs
- **Winston** for Logging

---

## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-backend-apis.git
   cd ecommerce-backend-apis
2. Install dependencies
   npm install

3. Create a .env file in the root directory:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
4. Start the server:
   npm start
5. npm run dev

##Project Structure

src/
│── config/              # DB & Mongoose Config
│── error-handler/       # Centralized Error Handling
│── features/
│   ├── cart/            # Cart APIs (controller, model, repo, schema, routes)
│   ├── order/           # Order APIs
│   ├── product/         # Product APIs
│   └── user/            # User APIs
│── middlewares/         # Auth, JWT, File Upload, Logging
│── uploads/             # File uploads
│── swagger.json         # API Documentation
│── server.js            # App Entry Point



