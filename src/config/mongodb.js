
import {MongoClient} from "mongodb";

let client;

export const connectToMongoDB = () => {

MongoClient.connect( process.env.DB_URL) //passing the url
.then((clientInstance) => {//this is a promise so we are using then and in the client it will with this 
// client we are receiving the instance of client using which we can call other functions usint which we can perform all other operations
        client = clientInstance;
        console.log("Connected to MongoDB successfully");

        createCounter(client.db());

        createIndexes(client.db());
}).catch((err) => {
        console.log("Error while connecting to MongoDB", err);
})



}

export const getClient = ()=>{
        
        return client;

}

export const getDB =()=>{

return client.db();

}


const createCounter = async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}

// creating index on the basis of price
const createIndexes = async(db) =>{

        try{
        await db.collection("products").createIndex({price:1});

        // creating compound index on the basis of name and category. 1 i.e. in ascending order and -1 i.e. in descending order
        await db.collection("products").createIndex({name:1, category:-1});

        // creating text based index on the basis of description field

        await db.collection("products").createIndex({desc:"text"});


        }catch(e){
                console.log(e);
        }

        console.log("Indexes created successfully");

}





