import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: false,
      required: true,
    },
    image: {
      type: String,
      unique: false,
      required: true,
    },
    phone: {
      type: String,
      unique: false,
      required: true,
    },
    some: {
      type: String,
      unique: false,
      required: true,
    },
    cap: {
      type: String,
      unique: false,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
