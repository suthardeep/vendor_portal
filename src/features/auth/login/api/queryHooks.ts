import { SendOtpPayload, SendOtpResponse, VerifyOtpPayload, LoginResponse } from '../types/login'
import { sendOtp, verifyOtp } from './queryFunctions'
import { useMutation } from '@tanstack/react-query'


export const useSendOtpMutation = () => {
    return useMutation<SendOtpResponse, Error, SendOtpPayload>({
        mutationFn: (data: SendOtpPayload) => sendOtp(data)
    })
}

export const useVerifyOtpMutation = () => {
    return useMutation<LoginResponse, Error, VerifyOtpPayload>({
        mutationFn: (data: VerifyOtpPayload) => verifyOtp(data)
    })
}