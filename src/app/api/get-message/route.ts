import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, {
                status:401
            }
        )
    }

    const userid = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: {id:userid}},
            { $unwind: "$message"},
            { $sort: {'message.createdAt':-1}},
            { $group: {_id: '$_id',message: {$push: '$message'}}}
        ])

        if(!user || user.length == 0) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                }, {
                    status:401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].message
            }, {
                status:200
            }
        )
    } catch (error) {
        console.error("An unexpected Error occured: ",error)
        return Response.json(
            {
                success: false,
                message: "No Message Found"
            }, {
                status:500
            }
        )
    }

    
} 