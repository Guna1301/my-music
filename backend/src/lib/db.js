import mongoose from "mongoose"

export const connectDB = async() =>{
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`connected to mongodb ${con.connection.host}`)
    } catch (error) {
        console.log('error connecting to database',error)
        process.exit(1); // 1 is failure 0 is success
        
    }
}