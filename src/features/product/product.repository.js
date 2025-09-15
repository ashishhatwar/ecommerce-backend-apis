import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { reviewSchema } from "./review.schema.js";
import { productSchema } from "./product.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {

      productData.categories = productData.categories.split(",").map(category => category.trim());

      console.log(productData);

      // 1. Add the product

      const newProduct = new ProductModel(productData);

   const savedProduct = await  newProduct.save();
      

      // 2. update the categories
    return  await CategoryModel.updateMany(
        {_id: {$in: productData.categories}},
        {$push: {products: new ObjectId(savedProduct._id)}}
         
      )

    } catch (e) {
      
      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      // 3. get all the products
      return await collection.find().toArray(); //the find() method returns a cursor and toArray() method returns an array
    } catch (e) {
      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      // 3. get the perticular product
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // product should have min price specified and max category specified
  async filter(minPrice, categories) {
    try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      let filterExpression = {};

      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      // categories = ['cat1', 'cat2']
        categories = JSON.parse(categories.replace(/'/g, '"'));

        console.log(categories);
      if (categories) {
        // filterExpression.category = category;
      
        filterExpression = {$or : [{category:{$in : categories}},filterExpression]}
        
      }

      return await collection.find(filterExpression).project({name:1, price:1, _id:0, ratings: {$slice: 1}}).toArray(); // using project() method to return only name and price and not _id

      // slice() method is used to slice the array and return only the first element of the array by using 1

    } catch (e) {
      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }



  async rate(userID, productID, rating) {
    try {
      
    // 1. Check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        // Find the existing review
        const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user: new ObjectId(userID),
                rating: rating
            });
            newReview.save();
        }

    } catch (e) {
      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }


  async averageProductPricePerCategory() {
    try {
      
      const db = await getDB();

      return await db.collection(this.collection)
      .aggregate([
        
        {

          // stage1: Get average price per category
          $group: { // The $group stage groups the documents by the specified expression and computes the average price for each category
            _id: "$category",
            averagePrice: {
              $avg: "$price",
            },
          },
          

        }

      ]).toArray()

    } catch (e) {
      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

}

export default ProductRepository;
