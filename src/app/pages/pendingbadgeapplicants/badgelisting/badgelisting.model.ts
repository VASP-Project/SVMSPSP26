import { PagingHeader, LinkInfo } from "@app/shared/shared.model";
export class FromTODate
{
    fromDate: string
    toDate: string
    unaccountableDate:string
}

export class SelectedCompanies{
    id:number= 0
    companyName:string=""
}
    


// export class BadgeListing
// {
//     id:number
//     auditType:string
//     auditName:string
//     auditPercent:number
//     auditDescription:string
//     companyId: number=0
//     companyName: string=''
// }

export class BadgeAuditDetails {
    id: number=0;
    auditName: string="";
    auditType: string="";
    auditDescription: string="";
    auditFromDate: Date;
    auditToDate: Date;
    selectedCompanies: string="";
    selectedCompaniesNames: string="";
    auditPercent: string="";
    totalBadges: number=0;
    totalAccountable: number=0;
    totalUnaccountable: number=0;
    totalPercentUnaccountable: number=0;
    status: string="";
    createdOn: Date;
    launchOn: Date;
    authsignerComment:string = "";
}
 


export const MY_CUSTOM_FORMATS = {
    parseInput: 'MM/DD/YYYY HH:mm',
    fullPickerInput: 'MM/DD/YYYY HH:mm',
    datePickerInput: 'MM/DD/YYYY',
    timePickerInput: ' HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

export class BadgeAuditCompanyEmployee {
    id: number = 0;
    auditId: number = 0;
    companyName: string="";
    firstName: string="";
    lastName: string="";
    badgeNumber: number=0;
    badgeColor: string="";
    issuanceDate: string="";
    expirationDate: string="";
    issuedKey: number=0;
    escortIcon: string="";
    accessLevel: string="";
    lastAudit: string="";
    accountable: boolean;
    deactivatedReason: string ="";
    badgeRecovered: boolean =false;
    empStatus: number =0;
    unaccountableDate: Date;
    comment: string="";
    isSubmitted:boolean = false;
    submittedBy:string = "";
    submittedDate:Date;
    status:string = "";
    refreshStatus:string = "";
  }

  export class BadgeAuditDetailsList{
   
    auditName: string="";
    auditType: string="";
    auditFromDate: Date;
    auditToDate: Date;
    status: string="";
    authsignerComment:string = "";
    companyStatus:string = "";

    

  }
 
  export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: BadgeAuditDetailsList[];
}

export class BadgeAuditCompanyEmployeeList {
    id: number=0;
    company: string="";
    firstName: string="";
    lastName: string="";
    badgeNumber: number=0;
    badgeColor: string="";
    issuanceDate: string="";
    expirationDate: string="";
    issuedKey: number=0;
    lastAudit: string="";
    accountable: boolean;
    deactivatedReason: string="";
    badgeRecovered: boolean =false;
    customSeal:string =""
    escortIcon:string=""  
    accessLevel: string="";
    empStatus:number = 0;  
    isSubmitted:boolean = false;
    submittedBy:string = "";
    submittedDate:Date;
    status:string = "";
    refreshStatus:string = "";
  }

  export class DataOutputModelemp {
    paging: PagingHeader;
    links: LinkInfo[];
    items: BadgeAuditCompanyEmployeeList[];
}

export class AuthSignerCountViewModel {
  accountableConfirmed: number;
  unaccountableConfirmed: number;
  totalConfirmed: number;
  percentUnaccountable: number;
  pending :number;
  issued:number;
  deactivated:number;
  active:number;
  totalIssued:number;
}
export class AuditCompanies {
  id:number;
  auditId:number;
  compId:string;
  isSubmitted:boolean = false;
  authsignerId:string = "";
  totalBadges:number;
  totalAccountable:number;
  totalUnaccountable:number;
  acknowledge:boolean = false;
  acknowledgeDate:Date
  ssiPopup:boolean = false;
  authSignerComment:string = "";
}