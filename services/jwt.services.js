import jwt from "jsonwebtoken";
import { JWT_SECRECTKEY } from "../config/config.js";

class JwtServices {
  static sign(payload, expiry = "1d", secret = JWT_SECRECTKEY) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  static verify(token, secret = JWT_SECRECTKEY) {
    return jwt.verify(token, secret);
  }
}

export default JwtServices;
