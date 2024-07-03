import {z} from 'zod';


export const signInScehema = z.object({
    identifier: z.string(),
    password:z.string(),
    
})
