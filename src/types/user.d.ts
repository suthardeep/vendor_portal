export interface User {
  aavakUserId: string;
  phone: string; 
  email: string | null;
  fullName: string | null;
  platforms: string[];
  phoneVerified: boolean;
  emailVerified: boolean; 
  isActive: boolean;
  deviceId: string | null;
  fcmToken: string | null;
  hashToken: string;
  createdAt: string;
  updatedAt: string;
}