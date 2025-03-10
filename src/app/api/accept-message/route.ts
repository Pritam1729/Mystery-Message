import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
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

    const userid = user._id;
    const {acceptMessages} = await request.json();


    try{
        const updatedUser = await UserModel.findByIdAndUpdate(userid,{
            isAcceptingMessage:acceptMessages,
        },{
            new:true
        })

        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to acccept message"
                },
                {
                    status : 401
                }
            )
        }
        else {
            return Response.json(
                {
                    success: true,
                    message: "message accepted successfully",
                    updatedUser
                },
                {
                    status : 200
                }
            )
        }

    } catch(error) {
        console.error("failed to update user status to accept");
        return Response.json(
            {
                success: false,
                message: "failed to update user status to acccept message"
            },
            {
                status : 500
            }
        )
    }
}


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

    const userid = user._id;
    const foundUser = await UserModel.findById(userid);

    try {
        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status : 404
                }
            )
        }
    
    
        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage,
                message: "Accepting message"
            },
            {
                status : 200
            }
        )
    } catch(error) {
        console.error("failed to update user status to accept");
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            {
                status : 500
            }
        )
    }
}