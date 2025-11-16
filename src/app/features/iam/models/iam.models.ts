export type RoleName = 'CITIZEN' | 'OPERATOR' | 'MUNICIPAL_OFFICER' | 'ADMIN';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  dni: string;
  phoneNumber: string;
  department: string;
  province: string;
  district: string;
  municipalityId: string | null;
  roles: RoleName[];
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  dni: string;
  phoneNumber: string;
  department: string;
  province: string;
  district: string;
}
