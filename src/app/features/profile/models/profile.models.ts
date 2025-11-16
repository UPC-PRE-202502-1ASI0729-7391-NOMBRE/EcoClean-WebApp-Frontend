import { UserResponse } from '../../iam/models/iam.models';

export interface ProfileResponse {
  user: UserResponse;
  avatarUrl: string | null;
  bio: string | null;
  occupation: string | null;
  addressReference: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  updatedAt: string | null;
}

export interface UpdateProfileRequest {
  avatarUrl: string | null;
  bio: string | null;
  occupation: string | null;
  addressReference: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
}
