import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { 
    SendOtpPayload, 
    SendOtpResponse, 
    VerifyOtpPayload, 
    LoginResponse 
} from "../types/login";


export const sendOtp = (data: SendOtpPayload): Promise<SendOtpResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.auth.sendOtp, 
    });
}


export const verifyOtp = (data: VerifyOtpPayload): Promise<LoginResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.auth.verifyOtp,
    });
}