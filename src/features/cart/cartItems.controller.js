import CartItemsModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class CartItemsController {


  constructor() {

    this.cartItemsRepository = new CartItemsRepository();

  }


  async add(req, res) {

    try{
    const { productID, quantity } = req.body;

    const userID = req.userID;

    const newCartItem = new CartItemsModel(productID, userID, quantity);

    const createdRecord = await this.cartItemsRepository.add(
      newCartItem.productID,
      newCartItem.userID,
      newCartItem.quantity
    );

    return res.status(201).json({ message: "Cart Item added successfully", data: createdRecord });
  }catch(e){
    
   console.log(e);
  
   return res.status(400).send("Something went wrong");
  }
  
  }

  async get(req, res) {

    try{
    const userID = req.userID;

    const cartItems = await this.cartItemsRepository.get(userID);

    res.status(200).send(cartItems);

    }catch(e){
     
    console.log(e);
  
    return res.status(400).send("Something went wrong");
      
    }
  
  
  }

  async delete(req, res) {

    const userID = req.userID;

    const cartItemID = req.params.id;


    const isDeleted = await this.cartItemsRepository.delete(userID, cartItemID);

    if (!isDeleted) {
      return res.status(404).send("Item not found in cart");
    } else {
      return res.status(200).send("Product removed from cart successfully");
    }
  }
}
