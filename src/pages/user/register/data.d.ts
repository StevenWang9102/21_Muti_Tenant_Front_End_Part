export interface UserRegisterParams {
    email?: string; // wilson.g@gpos.co.nz
    password?: string; // Gwf1987c!
    confirm?: string;
    //mobile: string;
    captcha?: string;
    //prefix: string;
    hostUserId?: string;
  }
export interface UserParams {
  id: string;
  email: string;
  isInactive: boolean;
  tenants: string[];
}