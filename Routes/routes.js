import { Router } from "express";
import {
  registerController,
  loginController,
  userController,
  refreshController,
} from "../Controllers/index.js";

import userAuth from "../middleware/userAuth.js";

const routes = Router();

routes.post("/register", registerController.register);
routes.post("/login", loginController.login);
routes.post("/logout", loginController.logout);
routes.post("/user", userAuth, userController.me);
routes.post("/refresh", refreshController.refresh);

export default routes;
