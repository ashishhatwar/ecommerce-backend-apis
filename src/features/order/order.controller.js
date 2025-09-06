import OrderRepository from "./order.repository.js";

export default class OrderModel {
    constructor() {
       
        this.orderRepository = new OrderRepository();

    }

    async placeOrder(req, res, next){

        try{
            const userID = req.userID;

            await this.orderRepository.placeOrder(userID);

            res.status(200).send("Order is created");

        }catch(e){

            console.log(e);

            res.status(400).send("Something went wrong");

        }


    }


}