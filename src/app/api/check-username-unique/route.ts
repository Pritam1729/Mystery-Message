import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/Schemas/signupScehema";
import { messageSchema } from "@/Schemas/messageSchema";


const UsernameQueryScehema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    // next js will take care of get and post

    // if(request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "method not allowed"
    //         }, {
    //             status:405
    //         }
    //     )
    // }


    await dbConnect();
    try{
        const {searchParams} = new URL(request.url)
        // becoz it is the syntax so direct initalization is used
        const queryParam = {
            username: searchParams.get('username')
        };
        
        // Ensure username is a string and trim whitespace if it exists
        if (queryParam.username) {
            queryParam.username = queryParam.username.trim();
        }
        
        console.log(queryParam);
        
        // Validate with Zod
        const result = UsernameQueryScehema.safeParse(queryParam);
        
        console.log(result);

        if(!result.success) {
            const usernameErrors = result.error.format()._errors || [];

            return Response.json(
                {
                    success: false,
                    message: "invalid query parameter"
                }, {
                    status:400
                }
            )
        }

        const { username } = result.data


        const existingVerifiedUser = await UserModel.findOne({username,isVerified: true})

        if(existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                }, {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            }, {
                status:200
            }
        )


    } catch(error) {
        console.error("Error Checking username",error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status :  500
            }
        )
    }
}
