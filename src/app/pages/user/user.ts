import { Company } from "@app/pages/master/company";
import { PagingHeader, LinkInfo } from "@app/shared/shared.model";


export class User {
    id: string = "";
    email: string='';
    password: string = "";
    adUserName:string='';
    firstName: string='';
    lastName: string='';
    address: string='';
    companyId: number=0;
    companyName: string='';
    roleId: string=''
    rolename: string=''
    token?: string='';
    isADAuthenticated: boolean = false;
    isActive: boolean = true;
    company: Company[] = [];
    // isTSA:boolean=false; 
    newPassword:string="xxzzxx" //Dummy password 
    isBadgeAudit: boolean = false;
    isUserAuthenticated: boolean = false;
    userAuthenticationEmail:boolean = false;
    userAuthenticationSms: boolean = false;
    userAuthenticationBoth: boolean = false;
    userAuthenticationType: number ;
    phoneNumber: string = "";
    countryCode:string = "";
    isTsaApprover: boolean = false;
    isTsaScheduler:boolean = false;
    isAuditor:boolean;
    isPicheckout: boolean ;
    // isPIAuditPrivilege: boolean = false;
}

export class DummyUser {
    id: number=0;
    username: string='';
    password: string='';
    firstName: string='';
    lastName: string='';
    token?: string='';
    rolename: string=''
}

export class UserList {
    id: string = "";
    email: string='';
    firstName: string='';
    lastName: string='';
    address: string='';
    company: number=0;
    rolename: string=''
    isActive: boolean = false
    isADAuthenticated: boolean = false
}
export class Role {
    id: number =0;
    displayName: string ='';
    name: string=''
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: UserList[];
}


