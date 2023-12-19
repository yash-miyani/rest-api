import express from "express";
import { APP_PORT, DB_URL } from "./config/config.js";
import routes from "./Routes/routes.js";
import errorHandler from "./middleware/errorHandler.js";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect(DB_URL);

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

const PORT = APP_PORT || 4500;
app.listen(PORT, () => {
  console.log(`Port Running ${PORT}`);
});
