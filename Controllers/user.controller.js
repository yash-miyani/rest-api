import { User } from "../model/register.model.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({
        _id: req.user._id,
      }).select("-createdAt -updatedAt -__v");

      res.json(user);

      if (!user) {
        return next(CustomErrorHandler.notFound("404 User not found"));
      }
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
