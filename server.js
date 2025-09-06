import "dotenv/config";

// import express from "express";
import express from "express";
import swagger from "swagger-ui-express";

import ProductRouter from "./src/features/product/product.routes.js";

import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import loggerMiddleware from "./src/middlewares/logger.middlewareUsingWinston.js";
import CartItemsRouter from "./src/features/cart/cartItems.routes.js";
import orderRouter from "./src/features/order/order.routes.js";

// import apiDocs from "./swagger.json" assert {type:'json'};
// import apiDocs from "./swagger.json";

import fs from "fs";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import {connectToMongoDB} from "./src/config/mongodb.js";
import {connectUsingMongoose} from "./src/config/mongooseConfig.js";





const apiDocs = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

// Create server

const server = express();



// server.use(bodyParser.json());

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

server.use("/api/docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);


// for all requests related to product, redirect to product routes
// localhost:3000/api/products
server.use(
  "/api/products",
  // basicAuthorizer
  jwtAuth,
  ProductRouter
);

server.use("/api/orders", jwtAuth, orderRouter);

server.use("/api/users", userRouter);

server.use("/api/cartItems", jwtAuth, CartItemsRouter);

// Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce APIs");
});

// Error handler

server.use((err, req, res, next) => {
  console.log(err);

  if(err instanceof mongoose.Error.ValidationError) {
    res.status(400).send(err.message);
  }

  if (err instanceof ApplicationError) {
    res.status(err.status).send(err.message);
  }

  // server errors
  res.status(500).send("Something went wrong, Please try again later");
});

//Middleware to handle 404 requests

server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at http://localhost:3000/api/docs/"
    );
});

// Specific Port
server.listen(3000, () => {
  console.log("Server is running on port 3000");

  connectUsingMongoose();

  // connectToMongoDB();
});
