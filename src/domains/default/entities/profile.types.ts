import type { UserProfile } from '../../../@type/profile';

export interface UserProfileResponse {
  userProfile?: UserProfile[];
  message?: string;
}
