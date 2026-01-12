// src/types/user.types.ts

export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  email_verified: boolean;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface Address {
  id: number;
  user_id: number;
  street: string;
  city: string;
  province: string;
  references?: string;
  is_primary: boolean;
  createdAt?: string;
  updatedAt?: string;
}