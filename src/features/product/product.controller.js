import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class ProductController {


  constructor() {

    this.productRepository = new ProductRepository();

  }

 async getAllProducts(req, res) {

  try{

const products = await this.productRepository.getAll();
    res.status(200).send(products);

  }catch(e){

console.log(e);
return res.status(400).send("Something went wrong");

  }
  }

 async addProduct(req, res) {
    try {
      const { name, desc, price, category, sizes } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(","),
      );

      const createdRecord = await this.productRepository.add(newProduct);

      // console.log(createdRecord);
      res.status(201).send(createdRecord);
    } catch (e) {
      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

 async rateProduct(req, res) {
    
  try{

    const userID = req.userID;
    const productID = req.body.productID;
    const rating = req.body.rating;
    const error = await this.productRepository.rate(userID, productID, rating);

    console.log(error);

    if (error) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Product rated successfully");
    }
  }catch(e){

console.log(e);
return res.status(400).send("Something went wrong");
  }
  }

 async getOneProduct(req, res) {

try{

const id = req.params.id;

    const product = await this.productRepository.get(id);

    if (!product) {
      res.status(404).send("Product not found");
    } else {
      return res.status(200).send(product);
    }

  }catch(e){

console.log(e);
return res.status(400).send("Something went wrong");

  }


  }

async  filterProduct(req, res) {

  try{

    const minPrice = req.query.minPrice;
    // const maxPrice = req.query.maxPrice;
    const categories = req.query.categories;

    console.log(minPrice, categories);

    const filteredProducts = await this.productRepository.filter(minPrice,categories);

    return res.status(200).send(filteredProducts);
  }catch(e){

console.log(e);
return res.status(400).send("Something went wrong");
  }
  
  }

  async averagePrice(req, res, next){

    try{

      const result = await this.productRepository.averageProductPricePerCategory()

      res.status(200).send(result);

    }catch(e){
      console.log(e);
      return res.status(400).send("Something went wrong");
    }


  }

}
