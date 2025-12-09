import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths"; // Assumed to exist and contain registration paths
import { 
    SendOtpPayload, 
    RegistrationSendOtpResponse, 
    VerifyOtpPayload, 
    RegistrationVerifyOtpResponse, 
    RegisterProfilePayload, 
    RegistrationProfileResponse 
} from "../types/registration";



export const sendOtpRegistration = (data: SendOtpPayload): Promise<RegistrationSendOtpResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.registration.sendOtp, 
    });
}



export const verifyOtpRegistration = (data: VerifyOtpPayload): Promise<RegistrationVerifyOtpResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.registration.verifyOtp,
    });
}



export const registerProfile = (data: RegisterProfilePayload): Promise<RegistrationProfileResponse> => {
    return apiService({
        method: "POST",
        data: data,
        endpoint: apiPaths.profile.updateProfile,
    });
}