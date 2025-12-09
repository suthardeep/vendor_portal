export const apiPaths = {
  auth: {
    login: "auth/login",
    verifyTokens: "auth/verify-tokens",
    logout: "auth/logout",

    sendOtp:"auth/send-otp" ,
    verifyOtp:"auth/verify-otp"
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
  careers: "career",
  events: "events",
  highlight: "highlight",
  upload: "upload" ,

  profile:{
    updateProfile:"vendor/profile" ,
    getProfile:"vendor/profile" 
  }




} as const;

