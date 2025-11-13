import { User } from "@/types/user"

interface LoginPayload{
    email:string ,
    password:string
}


interface LoginResponse{
    user:User ,
    token:string
}