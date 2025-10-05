import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter event description"],
    trim: true,
  },
  language: {
    type: String,
    required: [true, "Please Mention the language of Event"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "please tell the duration of event"],
  },
  cast: {
    type: [String],
    required: [true, "please tell cast of event sepertaed by commas"],
    
  },
  crew: {
    type: [String],
    
  },
  genre: {
    type: String,
    trim: true,
  },
  posterImage: {
    type: String,
    trim: true,
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
  },
  showTimings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Show" }],

},{timestamps:true});


export default mongoose.model("Events",EventSchema);