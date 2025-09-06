import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // 1. Read the token
console.log(req.headers);
  const token = req.headers["authorization"];

  // 2. if no token, return the error.
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  // 3. check if token is valid

  try {
    const payload = jwt.verify(token, "B35E118EFF85455C2FDFCCCC38B3A");

    req.userID = payload.userID;

    console.log(payload);
  } catch (e) {
    // 4. return error
    return res.status(401).send("Unauthorized");
  }

  // 4. call the next middleware

next();
};

export default jwtAuth;
