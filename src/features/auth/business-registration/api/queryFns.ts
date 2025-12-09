import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BankDetailsType, BrandDetailsType, BusinessDetailsType } from "../schemas/registration.schema";





export const businessRegistration = (data:BusinessDetailsType) =>{
    return apiService({
        method:"POST" ,
        data:data  ,
        endpoint:apiPaths.onboarding.businessDetails
    })

}

export const brandDetailRegistration = (data:BrandDetailsType) =>{

    const payload = {
        brands: data
    };
    return apiService({
        method:"POST" ,
        data:payload ,
        endpoint:apiPaths.onboarding.brandDetails
    })
}

export const bankDetailsRegistration = (data:BankDetailsType) =>{
    return apiService({
        method:"POST" ,
        data:data ,
        endpoint:apiPaths.onboarding.bankDetails
    })
}

export const submitVerification = () =>{
    return apiService({
        method:"POST" ,
        endpoint:apiPaths.onboarding.submitVerification ,
        data:{}
    })
}