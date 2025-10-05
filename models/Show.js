import mongoose from "mongoose";

const ShowSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  dateTime: { type: Date, required: true },

  ticketPricing: [
    { category: { type: String, required: true }, price: { type: Number, required: true } }
  ],

  totalSeats: { type: Number, required: true },
  bookedSeats: [{ type: String }],

  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  lockedSeats: [
  {
    seat: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lockedAt: Date
  }
],
}, { timestamps: true });

export default mongoose.model("Show", ShowSchema);
