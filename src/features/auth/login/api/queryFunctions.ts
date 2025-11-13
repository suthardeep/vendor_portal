import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { LoginPayload, LoginResponse } from "../types/login";


export const login = (data:LoginPayload):Promise<LoginResponse>=>{
    return apiService({
        method:"POST" ,
        data:data ,
        endpoint:apiPaths.auth.login,
     
        
    })
}