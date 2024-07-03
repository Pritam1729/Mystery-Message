import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiRenponse';

export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string
): Promise <ApiResponse>{

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail({username,otp:verifyCode}),
          });


        return {
            success:true,message: 'Failed to Send Verification email'
        }
    } catch (emailerror) {
        console.error("Error Sending Verification email",emailerror)
        return {
            success:false,message: 'Failed to Send Verification email'
        }
    }
}