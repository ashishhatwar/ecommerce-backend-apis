import {LikeRepository} from "./like.repository.js";
export class LikeController{


    constructor(){

        this.likeRepository=new LikeRepository();


    }

    async likeItem(req, res, next){

        try{

            const {id, type}=req.body;
            const userID=req.userID;

            if(type!="Product" && type!="Categories"){

                return res.status(400).send("Invalid type");

            }

            if(type=="Product"){

                this.likeRepository.likeProduct(userID, id);

            }else{

                this.likeRepository.likeCategory(userID, id);

            }

            return res.status(400).send("Liked successfully");



        }catch(err){

            console.log(err);

            return res.status(400).send("Something went wrong");


        }

    }


    async getLikes(req, res, next){

            try{

                const {id, type} = req.query;

                console.log(id, type);

                const likes = await this.likeRepository.getLikes(type, id);
                console.log("likes:", likes)

                return res.status(200).send(likes);


        }catch(err){

            console.log(err);

            return res.status(400).send("Something went wrong");


        }

    }

}