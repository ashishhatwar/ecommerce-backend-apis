import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userID) {
    const client = await getClient();
    // the session object in mongoDB represennts a logical transaction context, allowing you to group multiple operations into a single transaction
    const session = client.startSession();

    try {
      const db = await getDB();

      session.startTransaction();

      //1. Get cartitems and calculate total Amount
      const items = await this.getTotalAmount(userID, session);

      const FinaltotalAmount = items.reduce((total, item) => {
        return total + item.totalAmount;
      }, 0);

      console.log(FinaltotalAmount);

      //2. Create an order record.

      const newOrder = new OrderModel(
        new ObjectId(userID),
        FinaltotalAmount,
        new Date()
      );

      await db.collection(this.collection).insertOne(newOrder, { session });

      //3. Reduce the stock

      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      //4. Clear the cart items
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userID),
        },
        { session }
      );

      session.commitTransaction(); //its basically then updates the database. All the operations in the transaction have been completed and database is now in integrated state
      session.endSession();
      return;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userID, session) {
    try {
      const db = getDB();

      const items = await db
        .collection("cartItems")
        .aggregate(
          [
            //1. Get cart items for the user

            {
              // Filters the documents to pass only the documents that match the specified condition to the next pipeline stage.
              $match: { userID: new ObjectId(userID) },
            },

            {
              //2. Get the products from the products collection based on the products id in the cartItems collections

              $lookup: {
                from: "products",
                localField: "productID",
                foreignField: "_id",
                as: "productInfo",
              },
              // it will do is for every cart item, it will attach this as a nested object that this is the product this card item has
            },
            //3. Unwind the product info
            {
              $unwind: "$productInfo",
            },
            //4. Calculate total amount for each cartItems
            {
              $addFields: {
                totalAmount: {
                  $multiply: ["$productInfo.price", "$quantity"],
                },
              },
            },
          ],
          { session }
        )
        .toArray();

      // console.log(items);

      return items;
    } catch (err) {
      console.log(err);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
