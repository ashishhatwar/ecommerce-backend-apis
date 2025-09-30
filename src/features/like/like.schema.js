import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types",
  },
  types: {
    type: String,
    enum: ["Product", "Categories"],
  },
})
  .pre("save", (next) => {
    console.log("new like coming in");
    next();
  })
  .post("save", (doc, next) => {
    console.log("new like saved");
    console.log(doc);
    next();
  }).pre("find", (next) => {
      console.log("Retrieving all likes");
      next();
  }).post("find", (doc, next) => {
      console.log("Find is completed");
      console.log(doc);
      next();
  })
