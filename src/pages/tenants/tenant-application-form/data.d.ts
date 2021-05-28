import jsonpatch from 'fast-json-patch';

export interface TenantApplicationForm {
    id : string;
    legalName: number;
    tradingName: string;
    shortName: string;
    Phone: string;
    Email: number;
    GstNumber: number;
    Address: string;
    isService: boolean;
    UserFirstName: boolean;
    UserLastName: string;
    jsonpatchOperation?: jsonpatch.Operation[];
}

/* address: "wilson1"
createdTime: "2020-07-07T01:34:00.635209+12:00"
email: "wilson1@gpos.co.nz"
gstNumber: "wilson1"
hostUser: {id: "ab4426f6-f252-4006-bcd3-6a34a0ec4515", email: "wilson.g@gpos.co.nz", isInactive: false,…}
email: "wilson.g@gpos.co.nz"
id: "ab4426f6-f252-4006-bcd3-6a34a0ec4515"
isInactive: false
tenants: []
hostUserId: "ab4426f6-f252-4006-bcd3-6a34a0ec4515"
id: "aa74c24f-99b0-4403-9d7d-7fcf3ba175fc"
isApproved: null
legalName: "wilson1"
note: null
phone: "123456789"
shortName: "wilson1"
tradingName: "wilson1"
userFirstName: "wilson1"
userLastName: "wilson1"
userMiddleName: null */