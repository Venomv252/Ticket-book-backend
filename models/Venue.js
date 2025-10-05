import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Venue name is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  screens: [
    {
      name: { type: String, required: true }, // e.g., Screen 1, Audi 2
      totalSeats: { type: Number, required: true },
      seatLayout: [
        {
          row: { type: String },     // A, B, C...
          seats: [{ type: String }], // ["A1","A2","A3"]
        }
      ],
    }
  ],
}, { timestamps: true });

export default mongoose.model("Venue", VenueSchema);
