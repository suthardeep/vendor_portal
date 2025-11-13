import z from 'zod'


export const loginSchema = z.object({
    email:z.email({message:"Invalid Email Address"}) ,
    password:z.string()
               .min(8 , 'Password must be at least 8 characters')
               .max(12 , 'Password must be less than 12 character')



})