// Manage routes/paths to CartItemsController

// import express

import express from "express";
import CartItemsController from "./cartItems.controller.js";

// Initialize express router

const cartRouter = express.Router(); // the goal of this router is to specify your paths that when this path matches, Please call this controller method

// Intenstiate CartItemsController
const cartItemsController = new CartItemsController();

cartRouter.post("/", (req, res)=>{ cartItemsController.add(req, res) });

cartRouter.get("/", (req, res)=>{cartItemsController.get(req,res)});

cartRouter.delete("/:id", (req, res)=>{cartItemsController.delete(req, res)});

export default cartRouter;
