import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productID, userID, quantity) {
    try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

    // const id = await this.getNextCounter(db);
      // 3.   find the document in the collection and either insert or update

      // 4. insert the document into the collection
    const result =   await collection.updateOne(
        { productID: new ObjectId(productID), userID: new ObjectId(userID) },
        {
            // $setOnInsert: {_id: id},
            $inc:{quantity: quantity}},
            // {upsert: true}
 );

 if (result.matchedCount===0) {
   
  const id = await this.getNextCounter(db);

  await collection.insertOne({

    _id: id,
    productID: new ObjectId(productID),
    userID: new ObjectId(userID),
    quantity

  })
}

return result;

    } catch (err) {
      console.log(err);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

async get(userID){

       try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      //  3. get the perticular user products

      return await collection.find({userID: new ObjectId(userID)}).toArray();
      
       }catch(err){

      console.log(err);

      throw new ApplicationError("Something went wrong with database", 500);
    }

}


async delete(userID, cartItemID){

  try {
      // 1. get the database
      const db = await getDB();

      // 2. get the collection
      const collection = db.collection(this.collection);

      //  3. get the perticular user products

   const result =  await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
      
   return result.deletedCount>0;

       }catch(err){

      console.log(err);

      throw new ApplicationError("Something went wrong with database", 500);
    }

}

// async getNextCounter(db){

//   const resultDocument=  await db.collection("counters").findOneAndUpdate(
//         {_id: "cartItemId"}, 
//         {$inc: {value: 1}},
//         {returnDocument: "after"}
//     )

//         console.log(resultDocument);
//         return resultDocument.value.value;

// }

    async getNextCounter(db){

        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value: 1}},
            {returnDocument:'after'}
        )  
        console.log("result document: " +  JSON.stringify(resultDocument));
        console.log("result document: " +  resultDocument.value);
        return resultDocument.value;
    }
}



