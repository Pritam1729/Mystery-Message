import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request:Request) {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that make you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.' "

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return NextResponse.json({
            success : true,
            message : text
        },
        {
            status : 200
        })

    } catch (error) {
        console.error("An unexpected error occured");
        return NextResponse.json(
            {
                success : true,
                message : "Something went wrong" 
            },
            {
                status : 404
            }
        )
        // throw error;
    }
}



