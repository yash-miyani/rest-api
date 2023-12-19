import Joi from "joi";
import { User } from "../model/register.model.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtServices from "../services/jwt.services.js";
import { REFRESH_SECRECTKEY } from "../config/config.js";
import refreshTokenModel from "../model/refreshToken.model.js";

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      repeat_password: Joi.ref("password"),
      role: Joi.string(),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, email, password, role } = req.body;

    // already email exits=es
    try {
      const exist = await User.exists({ email: email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("Email already Exites....")
        );
      }
    } catch (err) {
      console.log(err);
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const Details = new User({
      name,
      email,
      password: hashPassword,
      role,
    });

    // jwt token
    let access_token;
    let refesh_token;

    // save Data
    const insert = await Details.save();

    access_token = JwtServices.sign({ _id: insert._id, role: insert.role });

    refesh_token = JwtServices.sign(
      { _id: insert._id, role: insert.role },
      "1y",
      REFRESH_SECRECTKEY
    );

    if (insert.acknowledged) {
      console.log("Insert Success");
    }

    res.send({ access_token: access_token, refesh_token: refesh_token });
  },
};

export default registerController;
