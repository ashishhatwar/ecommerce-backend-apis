// Manage routes/paths to ProductController

// import express
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

// Initialize express router

const router = express.Router(); // the goal of this router is to specify your paths that when this path matches, Please call this controller method

// Intenstiate ProductController
const productController = new ProductController();

// all the paths to controller method
// localhost:3000/api/products

// localhost: 3000/api/products/filter?minPrice=10&maxPrice=30&category=category1
router.get("/filter", (req, res) => {
  productController.filterProduct(req, res);
});

router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

router.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

router.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});

router.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});

router.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});




export default router;
