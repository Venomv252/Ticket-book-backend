import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

try{await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
console.log("MongoDb connected successfully");
}catch(error){
    console.error("Mongodb connection failed:",error.message);
    process.exit(1);
}

app.listen(PORT,() =>{
    console.log(`server is running at ${PORT}`)
});

app.use("/api/payments",paymentRoutes);