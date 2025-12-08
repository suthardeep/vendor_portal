export type LoginStep = "INPUT_MOBILE" | "INPUT_OTP";

export interface LoginState {
  step: LoginStep;
  isLoading: boolean;
  isResending: boolean;
  mobileNumber: string;
  otp: string;
}