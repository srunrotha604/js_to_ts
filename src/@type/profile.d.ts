export interface MessageResponse {
  message?: string;
}

export interface UserProfile {
  userCode?: string;
  profileImage?: string;
  displayName?: string;
  policyName?: string;
  email?: string;
  email1?: string;
  email2?: string;
  phone1?: string;
  phone2?: string;
  website1?: string;
  website2?: string;
  otherContact?: string;
  address1?: string;
  address2?: string;
}

export interface UserProfileResponse {
  userProfile?: UserProfile[];
  message?: string;
}
