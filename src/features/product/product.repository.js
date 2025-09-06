import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(newProduct) {
    try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      // 3. insert the document into the collection
      await collection.insertOne(newProduct);

      return newProduct;
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

      // if (maxPrice) {
      //   filterExpression.price = {
      //     ...filterExpression.price,
      //     $lte: parseFloat(maxPrice),
      //   };
      // }

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

  //   async rate(userID, productID, rating) {
  //     try {
  //       const db = await getDB();

  //       const collection = db.collection(this.collection);

  //       //1. Find the product
  //       const product = await collection.findOne({
  //         _id: new ObjectId(productID),
  //       });
  //       // 2. Find the rating

  //       const userRating = product?.ratings?.find((r) => r.userID == userID);
  //       if (userRating) {
  //         // 3. Update the rating

  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productID),
  //             "ratings.userID": new ObjectId(userID),
  //           },
  //           {
  //             $set: { "ratings.$.rating": rating },
  //           }
  //         );
  //       } else {
  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productID),
  //           },
  //           {
  //             $push: { ratings: { userID: new ObjectId(userID), rating } },
  //           }
  //         );
  //       }
  //     } catch (e) {
  //       console.log(e);

  //       throw new ApplicationError("Something went wrong with database", 500);
  //     }
  //   }

  async rate(userID, productID, rating) {
    try {
      const db = await getDB();

      const collection = db.collection(this.collection);

      //   these two operations atomic operations as in these two will work together. So either both of these will execute or none of them will execute
      //1. Removes existing entry

      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );

      //2. Add new entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $push: { ratings: { userID: new ObjectId(userID), rating } }, //push adds a new element to the array where as pull removes the element from the array
        }
      );
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
