import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency:{
    type:Number,
    required:true,
  },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "PENDING"],
    default: "PENDING",
  },
  stripePaymentIntentId:{
    type:String,
    required:true,
  },createdAt:{
    type:Date,
    default:Date.now,
  }

},{timestamps:true});

export default mongoose.model("Payment", PaymentSchema);
