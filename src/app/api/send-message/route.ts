import { messageSchema } from "@/Schemas/messageSchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    const {username,content} = await request.json();

    try {
        const user = await UserModel.findOne({username})

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User NOt Found"
                }, {
                    status:404
                }
            )
        }

        // is user accepting the messages

        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not Accepting the messages"
                }, {
                    status:403
                }
            )
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        user.message.push(newMessage as Message)

        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message Sent successfully"
            }, {
                status:200
            }
        )

    } catch (error) {

        console.error("Error adding messages")
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            }, {
                status:500
            }
        )
    }
}