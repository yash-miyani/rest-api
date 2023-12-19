import JwtServices from "../services/jwt.services.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  //Token Validation
  if (!authHeader) {
    return next(CustomErrorHandler.unauthorized("Not authorization"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const { _id, role } = await JwtServices.verify(token);
    const user = {
      _id,
      role,
    };

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
};

export default userAuth;
