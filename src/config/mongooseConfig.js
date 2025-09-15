import "dotenv/config";
import mongoose from "mongoose";
import {categorySchema} from "../features/product/category.schema.js";

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {

    try{

          await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

            console.log("MongoDB connected successfully using mongoose");

            addCategories();
          

    }catch(err){

        console.log(err);

    }

}



async function addCategories() {
    
    const CategoryModel = mongoose.model('Category', categorySchema);
    const categories = await CategoryModel.find();

    if(!categories || categories.length == 0) {

        await CategoryModel.insertMany([{name:'books'}, {name: 'Clothing'}, {name: 'Electronics'}]);

    }

    console.log("categories added successfully");


}
