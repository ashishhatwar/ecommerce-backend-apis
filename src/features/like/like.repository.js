import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import {likeSchema} from "./like.schema.js";
import {User} from "../user/user.schema.js";


const { ObjectId } = mongoose.Types;


const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository{


   async getLikes(type, id){
        const result = await LikeModel.find({
            likeable: new ObjectId(id),
            types:type
        }).populate('user')
        .populate({path:'likeable', model: type})
    
    
        return result
        
    }

    async likeProduct(userId, productId){

        try{  

            const newLike = new LikeModel({

                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types: "Product"

            })

            await newLike.save();

        }catch(e){

     console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);

        }


    }

    async likeCategory(userId, categoryId){


          try{  

            const newLike = new LikeModel({

                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: "Categories"

            })

            await newLike.save();

        }catch(e){

     console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);

        }

    }


}