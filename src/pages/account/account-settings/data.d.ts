export interface CurrentUser {
  id?: string;
  email?: string;
  isInactive?: boolean;
  avatar?: string;
  tenants?: string[];
}
export interface HandleCurrentUserParams {
  id?: string;
  email?: string;
  password?: string;
  //Update a host user's email
  newEmail?: string;
  VerificationCode?: string;
  //Update a host user's password
  token?: string;
  currentPassword?: string;
  newPassword?: string;
}