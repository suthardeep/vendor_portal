export const apiPaths = {
  auth: {
    login: "auth/login",
    verifyTokens: "auth/verify-tokens",
    logout: "auth/logout",

    sendOtp: "auth/send-otp",
    verifyOtp: "auth/verify-otp",
  },

  registration:{
    sendOtp:"vendor/email/send-otp" ,
    resendOtp:"vendor/email/resend-otp" ,
    verifyOtp:"vendor/email/verify-otp" ,
  } ,


onboarding:{
  businessDetails:"vendor/business-details" ,
  brandDetails:"vendor/brand-details" ,
  bankDetails:"vendor/bank-details" ,
  submitVerification:"vendor/submit-verification"
} ,
  dashboard: "dashboard",
  media:{
    upload: "media/upload",
    bulkUpload: "media/bulk-upload",
    vendorList: "media/vendor/list",
    vendorFolders: "media/vendor/groups",
    list: "media/list",
    folders: "media/groups",
    deleteMany: "media/delete",
    changeFolder: "media/change-folder",
    fetchByid: "media",
    delete: "media"
  },
    profile:{
    updateProfile:"vendor/profile" ,
    getProfile:"vendor/profile" 
  }

} as const;
