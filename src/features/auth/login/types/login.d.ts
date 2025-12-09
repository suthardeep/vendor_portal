import { User } from "@/types/user";

export type LoginStep = "INPUT_MOBILE" | "INPUT_OTP";



export interface LoginResponseData {
  access_token: string; 
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

export interface SendOtpPayload {
  phone: string; 
}

export interface SendOtpData {
  phone: string;
  isNewUser: boolean;
  expiresIn: number;
}

export interface SendOtpResponse {
  statusCode: number;
  message: string;
  data: SendOtpData | null;
}

export interface VerifyOtpPayload {
  phone: string; 
  otp: string;
}

export interface LoginState {
  step: LoginStep;
  isLoading: boolean;
  isResending: boolean;
  phone: string;
  otp: string;
}