import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("refreshtokens", refreshTokenSchema);
