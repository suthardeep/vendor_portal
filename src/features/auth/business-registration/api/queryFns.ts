import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BankDetailsType, BrandDetailsType, BusinessDetailsType } from "../schemas/registration.schema";
import { addMockFileData } from "../utils/mockFileData";

export const businessRegistration = (data: BusinessDetailsType) => {
    const processedData = addMockFileData(data);
    
    const payload: any = {
        businessDetails: {
            name: processedData.businessName,
            addressLine1: processedData.addressLine1,
            addressLine2: processedData.addressLine2,
            pinCode: processedData.pinCode,
            city: processedData.city,
            state: processedData.state,
            panCard: processedData.panCard,
            registrationCertificate: processedData.registrationCertificate,
        },
        authorisedPersonDetails: {
            name: processedData.authorisedPersonName,
            mobileNumber: processedData.authorisedPersonPhoneNumber,
            email: processedData.authorisedPersonEmail,
            panCard: processedData.authorisedPersonPanCard,
            aadharCard: processedData.authorisedPersonAadharCard,
        },
    };
    
    if (processedData.hasGST) {
        payload.gstNumber = processedData.gstNumber;
        payload.gstCertificate = processedData.gstCertificate;
        payload.selfDeclared = false;
    } else {
        payload.selfDeclared = processedData.selfDeclared;
        console.log('📦 [API] Excluded GST fields from payload (hasGST = false)');
    }
    
    return apiService({
        method: "POST",
        data: payload,
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
