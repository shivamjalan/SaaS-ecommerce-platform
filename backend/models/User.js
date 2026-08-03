import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ NEW
    role: {
      type: String,
      enum: ["user", "merchant", "superadmin"],
      default: "user",
    },

    store: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Store",
  default: null,
},

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);
export default User;