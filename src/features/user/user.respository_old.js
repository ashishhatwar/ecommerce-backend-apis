/* 
The repository module in a Node.js application is primarily designed to serve as an abstraction layer over the data access code.
This means that instead of having database-related code scattered throughout the application, it is centralized within the repository. 
*/

import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
class UserRepository{

  constructor(){

    this.collection = "users";

  }

async signUp(newUser) {
    try{
    // 1. Get the database

    const db = getDB();

    // 2. Get the collection

    const collection = db.collection(this.collection);


    // 3. Insert the document into the collection

    await collection.insertOne(newUser);

     return newUser;
    }catch(e){

      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }

   
  }

  async findByEmail(email) {
    try{
    // 1. Get the database

    const db = getDB();

    // 2. Get the collection

    const collection = db.collection(this.collection);

    

    // 3. Find the documens 

    return await collection.findOne({email});

    
    }catch(e){

      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }

   
  }


}


export default UserRepository