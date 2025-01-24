import mongoose from "mongoose";

const DB_NAME = "DataStacks"

export const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Mongo Db connected. DB Host:", connectionInstance.connection.host);
    } catch (error) {
        console.error("connection error: ", error)
        process.exit(1)
    }
}