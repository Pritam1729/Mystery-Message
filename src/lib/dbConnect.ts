import mongoose from "mongoose";

type ConectionObject = {
    isConnected?:number
}

const connection: ConectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected to Database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{});

        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Sucessfully")
    } catch (error) {

        console.log("Database Connection Failed",error)

        process.exit()
    }
}


export default dbConnect;