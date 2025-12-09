import { RegistrationFormData } from "../schemas/registration.schema";

// Assuming a User type exists globally, similar to the login feature
interface User {
  fullName: string;
  email: string;
  emailVerified: boolean;
  // Add other necessary user fields here
}

export interface RegistrationState extends RegistrationFormData {
  isEmailVerified: boolean;
}

export interface OTPState {
  isOpen: boolean;
  value: string;
  error: string;
  isLoading: boolean;
}

// --- API Types: Payloads ---

export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RegisterProfilePayload {
  fullName: string;
  acceptedTC: boolean;
}


export interface RegistrationSendOtpData {
    email: string;
    expiresIn: number;
}

export interface RegistrationVerifyOtpData {
    verified: boolean;
}

export interface RegistrationProfileData {
    profileId: string;
    user: User; 
}



export interface RegistrationSendOtpResponse {
  statusCode: number;
  message: string;
  data: RegistrationSendOtpData | null;
}

export interface RegistrationVerifyOtpResponse {
  statusCode: number;
  message: string;
  data: RegistrationVerifyOtpData | null;
}

export interface RegistrationProfileResponse {
  statusCode: number;
  message: string;
  data: RegistrationProfileData | null;
}