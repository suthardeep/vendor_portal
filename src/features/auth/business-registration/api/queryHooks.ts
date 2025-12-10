import { bankDetailsRegistration, brandDetailRegistration, businessRegistration, submitVerification } from "./queryFns";
import { useMutation } from "@tanstack/react-query";
import { BankDetailsType, BrandDetailsType, BusinessDetailsType } from "../schemas/registration.schema";




export const useBusinessRegistrationMutation = () =>{
    return useMutation({
        mutationFn:(data:BusinessDetailsType) => businessRegistration(data)
    })
}


export const useBrandDetailsRegistration = () =>{
    return useMutation({
        mutationFn:(data:BrandDetailsType) => brandDetailRegistration(data)
    })
}



export const useBankDetailsRegistration = () =>{
    return useMutation({
        mutationFn :(data:BankDetailsType)=>bankDetailsRegistration(data)
    })
}



export const useSubmitVerification = () =>{
    return useMutation({
        mutationFn : ()=> submitVerification()
    })
}