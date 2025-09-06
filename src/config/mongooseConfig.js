import "dotenv/config";
import mongoose from "mongoose";

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {

    try{

          await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

            console.log("MongoDB connected successfully using mongoose");
          

    }catch(err){

        console.log(err);

    }

}

