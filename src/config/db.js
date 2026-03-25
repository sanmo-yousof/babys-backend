import mongoose from "mongoose";

const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to mongoDB");
    }catch(error){
        console.log("Error in mondoDB connection",error)
    };
};

export default connectMongoDB;