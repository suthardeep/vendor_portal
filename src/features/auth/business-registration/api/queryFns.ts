import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BankDetailsType, BrandDetailsType, BusinessDetailsType } from "../schemas/registration.schema";
import { addMockFileData } from "../utils/mockFileData";

export const businessRegistration = (data: BusinessDetailsType) => {
    // Add mock file data if enabled
    let processedData = addMockFileData(data);
    
    // If hasGST is false, remove GST-related fields from the payload
    if (!processedData.hasGST) {
        const { gstNumber, gstCertificateId, gstCertificate, ...dataWithoutGST } = processedData;
        processedData = dataWithoutGST as BusinessDetailsType;
        console.log('📦 [API] Excluded GST fields from payload (hasGST = false)');
    }
    
    return apiService({
        method: "POST",
        data: processedData,
        endpoint: apiPaths.onboarding.businessDetails
    });
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

export const bankDetailsRegistration = (data: BankDetailsType) => {
    // Add mock file data if enabled
    const processedData = addMockFileData(data);
    
    return apiService({
        method: "POST",
        data: processedData,
        endpoint: apiPaths.onboarding.bankDetails
    });
}

export const submitVerification = () =>{
    return apiService({
        method:"POST" ,
        endpoint:apiPaths.onboarding.submitVerification ,
        data:{}
    })
}