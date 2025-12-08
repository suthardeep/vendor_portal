import { RegistrationFormData } from "../schemas/registration.schema";

export interface RegistrationState extends RegistrationFormData {
  isEmailVerified: boolean;
}

export interface OTPState {
  isOpen: boolean;
  value: string;
  error: string;
  isLoading: boolean;
}