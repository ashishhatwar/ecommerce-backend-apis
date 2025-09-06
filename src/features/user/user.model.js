

export default class UserModel {
  constructor(name, email, password, typeOfUser) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.typeOfUser = typeOfUser;
    
  }


  static getAll() {
    return users;
  }
}

