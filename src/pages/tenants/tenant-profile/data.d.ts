import jsonpatch from 'fast-json-patch';

export interface TenantApplicationProfile {
    id : string;
    hostUser: HostUser;
    hostUserId: string;
    legalName: number;
    tradingName: string;
    shortName: string;
    phone: string;
    email: number;
    gstNumber: number;
    address: string;
    isApproved: boolean;
    userFirstName: string;
    userMiddleName: string;
    userLastName: string;
    createdTime: string;
    note: string;
    jsonpatchOperation?: jsonpatch.Operation[];
}

export interface HostUser {
  id: string,
  email: string,
  isInactive: boolean;
  tenants: string [];
}

/* "id": "64f3d493-627d-4931-8773-ae7a734e6319",
"hostUser": {
    "id": "ab4426f6-f252-4006-bcd3-6a34a0ec4515",
    "email": "wilson.g@gpos.co.nz",
    "isInactive": false,
    "tenants": []
},
"hostUserId": "ab4426f6-f252-4006-bcd3-6a34a0ec4515",
"userFirstName": "wilson2",
"userMiddleName": null,
"userLastName": "wilson2",
"shortName": "wilson2",
"legalName": "wilson2",
"tradingName": "wilson2",
"phone": "123456789",
"email": "wilson2@gpos.co.nz",
"address": "wilson2",
"gstNumber": "wilson2",
"note": null,
"createdTime": "2020-07-07T02:04:11.3086598+12:00",
"isApproved": null */

export interface AdvancedOperation1 {
  key: string;
  type: string;
  name: string;
  status: string;
  updatedAt: string;
  memo: string;
}

export interface AdvancedOperation2 {
  key: string;
  type: string;
  name: string;
  status: string;
  updatedAt: string;
  memo: string;
}

export interface AdvancedOperation3 {
  key: string;
  type: string;
  name: string;
  status: string;
  updatedAt: string;
  memo: string;
}

export interface AdvancedProfileData {
  tenantProfile: Partial<TenantApplicationProfile>;
  advancedOperation1: AdvancedOperation1[];
  advancedOperation2: AdvancedOperation2[];
  advancedOperation3: AdvancedOperation3[];
}
