import { 
    SendOtpPayload, 
    RegistrationSendOtpResponse, 
    VerifyOtpPayload, 
    RegistrationVerifyOtpResponse, 
    RegisterProfilePayload, 
    RegistrationProfileResponse 
} from '../types/registration'
import { 
    sendOtpRegistration, 
    verifyOtpRegistration, 
    registerProfile 
} from './queryFns'
import { useMutation } from '@tanstack/react-query'


export const useSendOtpMutation = () => {
    return useMutation<RegistrationSendOtpResponse, Error, SendOtpPayload>({
        mutationFn: (data: SendOtpPayload) => sendOtpRegistration(data)
    })
}

export const useVerifyOtpMutation = () => {
    return useMutation<RegistrationVerifyOtpResponse, Error, VerifyOtpPayload>({
        mutationFn: (data: VerifyOtpPayload) => verifyOtpRegistration(data)
    })
}

export const useRegisterProfileMutation = () => {
    return useMutation<RegistrationProfileResponse, Error, RegisterProfilePayload>({
        mutationFn: (data: RegisterProfilePayload) => registerProfile(data)
    })
}