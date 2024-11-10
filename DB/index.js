import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("connection error",error);
        process.exit(1);
    }
}

