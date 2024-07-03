import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username,code} = await request.json();

        const decodedusername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedusername});

        if(!user) {
            return Response.json({
                success : true,
                message : "user not found"
            },
            {
                status : 500
            }
        )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExperied = new Date(user.verifyCodeExpiry) > new Date();
        
        if(isCodeValid && isCodeNotExperied) {
            user.isVerified = true;
            await user.save()

            return Response.json(
                {
                    success : true,
                    message: "Account Verified Successfully"
                },
                {
                    status : 200
                }
            )
        } else if (!isCodeNotExperied) {
            return Response.json(
                {
                    success : false,
                    message: "Verification code has Expired, please sign-up again to get a new code"
                },
                {
                    status : 400
                }
            )
        } else {
            return Response.json(
                {
                    success : false,
                    message: "Incorrect verification code"
                },
                {
                    status : 400
                }
            )
        }

    } catch(error) {
        console.error("Error verifying user",error);
        return Response.json(
            {
                sucess: false,
                message: "Error Verifying user"
            }, {
                status: 500
            }
        )
    }
}