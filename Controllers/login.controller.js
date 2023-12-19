import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../model/register.model.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtServices from "../services/jwt.services.js";
import { REFRESH_SECRECTKEY } from "../config/config.js";
import refreshTokenModel from "../model/refreshToken.model.js";

const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    let access_token, refesh_token;

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("Email or Password is not match!")
        );
      }
      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials("Password is not Valid!")
        );
      }

      // Create JWT TOken
      access_token = JwtServices.sign({ _id: user._id, role: user.role });
      refesh_token = JwtServices.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRECTKEY
      );

      await refreshTokenModel.create({ token: refesh_token });

      res.json({ access_token: access_token, refesh_token: refesh_token });
    } catch (err) {
      console.log("Login Error", err.message);
    }
  },

  async logout(req, res, next) {
    const logoutSchema = Joi.object({
      refesh_token: Joi.string().required(),
    });

    const { error } = logoutSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await refreshTokenModel.deleteOne({ token: req.body.refesh_token });
    } catch (error) {
      return next(error);
    }

    res.json({
      message: "LogOut Successfully...........!",
    });
  },
};

export default loginController;
