import mongoose from "mongoose";

// Everything in mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection. 
// Models in mongoose are fancy constructors compiled from schemas. An instance of a model is called a documents from the unerlying MongoDB database.
export const userSchema = new mongoose.Schema({

    name:String,
    email:{type:String, unique:true, 
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password:{type: String, 
// using custom validator
        validate: {

                validator: function(value) {
// This function validates a password and checks if it is 8–12 characters long, 
// contains at least one special symbol (@$!%*?&), and only uses allowed characters
                   
                    return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);

                }, message: "password shoulbe be 8-12 characters long and contain at least one special symbol (@$!%*?&)"

        }

    },
    typeOfUser:{type:String, enum:["Customer","Seller","Admin"]}

}, { versionKey: false } );