import Joi from "joi";
import refreshTokenModel from "../model/refreshToken.model.js";
import { User } from "../model/register.model.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import Jwtservice from "../services/jwt.services.js";
import { REFRESH_SECRECTKEY } from "../config/config.js";
const refreshController = {
  async refresh(req, res, next) {
    // Validation
    const refreshSchema = Joi.object({
      refesh_token: Joi.string().required(),
    });
    // console.log(req.body);
    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // check in Database token
    let Refreshtoken;
    try {
      Refreshtoken = await refreshTokenModel.findOne({
        token: req.body.refesh_token,
      });

      // console.log(Refreshtoken);

      if (!Refreshtoken) {
        return next(
          CustomErrorHandler.unauthorized("Invalid Refresh Token.....!")
        );
      }

      try {
        const { _id } = Jwtservice.verify(
          Refreshtoken.token,
          REFRESH_SECRECTKEY
        );
        const user = await User.findOne({ _id: _id });

        if (!user) {
          await refreshTokenModel.deleteOne({ token: req.body.refesh_token });

          return next(CustomErrorHandler.unauthorized("No User Found.....!"));
        }
      } catch (err) {
        return next(
          CustomErrorHandler.unauthorized("Invalid RefreshToken.....!")
        );
      }

      // database list

      res.json("Refresh Token is Successfully.......!");
    } catch (err) {
      return next(new Error("Something went Wrong....." + err.message));
    }
  },
};
export default refreshController;
