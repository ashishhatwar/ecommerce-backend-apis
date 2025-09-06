// productID, userID, quantity

export default class CartItemsModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this._id = id;
  }

  // static add(productID, userID, quantity) {
  //   const cartItem = new CartItemsModel(productID, userID, quantity);

  //   cartItem.id = cartItems.length + 1;

  //   cartItems.push(cartItem);

  //   return cartItems;
  // }

  // static get(userID) {
  //   return cartItems.filter((c) => c.userID == userID);
  // }

  static remove(cartItemID, userID) {
    const cartItemIndex = cartItems.findIndex(
      (c) => c.id == cartItemID && c.userID == userID
    );

    if (cartItemIndex == -1) {
      return "item not found in cart";
    } else {
      cartItems.splice(cartItemIndex, 1);
      
    }
  }
}

const cartItems = [
  new CartItemsModel(1, 2, 1, 1),
  new CartItemsModel(2, 3, 9, 2),
];
