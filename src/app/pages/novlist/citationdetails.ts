import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class CitationDetails {
     id: number;
     novNo: number;
     type: string;
     caseStatus: string;
     violatorFirstName: string = "";
     violatorLastName: string = "";
     violatorBirthDate: string;
     violationDate: string;
     violationTypeId: number;
     violationType: string;
     opdPoliceReport: string;
     citationResonId: number;
     citationReason: string;
     summaryOfViolation: string;
     address: string;
     city: string;
     state: string;
     zip: string;
     driversLicenseNo: string;
     licenseState: string;
     securityBadgeNo: string;
     companyId: number;
     companyName: string;
     mvopPermitNo: string;
     vehicleLicenseNo: string;
     vehicleState: string;
     vehicleYear: number;
     vehicleMakeModel: string;
     witnessName: string;
     witnessBadgeNo: string;
     novNotes: string;
     offenderSignature: string;
     capturedImage: string;
     currentCitationStatusId: number;
     citationAttachments: CitationAttachments[] = [];
     strCitationAttachments: string[] = [];
     isCompanyCitation: boolean = false;
     eventList: CitationEvents[] = [];
     deletedEventIds: number[] = [];
     companyLogo: string;
     userId: string;
     status: string;
     statusDisplayName: string;
     currentStatus : string ="Draft";
     createdBy: string;
     createdDate: string;
     updatedBy: string;
     updatedDate: string;
     isSubmitted: boolean = false;
     //PA- added new
     isBadgeConfiscated: boolean = false;
     issuedBy: string;
     eventEdited: string = "";
     InspectionRecordNo: number;
     email: string="";
     remedialTrainingAssignedDate:string = "";
     isDueDate:boolean = false;
     phone: string="";
     countryCode:string = "";
     violationTime:string = "";
     iscctvAvailable:string 
     isBadgeAutoFilled:boolean = false;
     //licenseExpirationDate:string;
    isProhibitedCitation:boolean = false
    auditCompanyId:number;
    prohibitedAuditId:number;
    personUniqueId:string;
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

export class CitationAttachments {
     public id: number;
     public citationId: number;
     public filePath: string = '';
     public createdBy: string = '';
     public updatedBy: string = '';
     public tabNo: string = '';
     public thumbnailImage: string = '';

}

export class CitationEvents {
     public id: number = 0;
     public citationId: number = 0;
     public eventTypeId: number = 0;
     public eventTypeName: string = "";
     public eventDate: string ;
     public eventTime: string ;
     public userId: string = '';
     public userName: string = "";
     public eventDetails: string = '';
     public eventTimeObj: any;
     public inedit: boolean = false;
     public newEventTime: string ;

}
export class EventTimeObj {
     public hour: number = 0;
     public minute: number = 0;
     public second: number = 0;
}
export class CitationDetailStatus {
     id: number;
     novNo: number;
     citationId: number;
     citationStatusId: number;
     caseStatus: string;
     statusDisplayName: string;

     createdBy: string;
     createdDate: string;
     updatedBy: string;
     updatedDate: string;

     violatorFirstName: string = "";
     violatorLastName: string = "";
     violatorBirthDate: string;
     violationDate: string;
     violationTypeId: number;
     violationType: string ="0";
     opdPoliceReport: string;
     citationResonId: number=0
     citationReason: string;
     summaryOfViolation: string;
     address: string;
     city: string;
     state: string;
     zip: string;
     driversLicenseNo: string;
     licenseState: string;
     securityBadgeNo: string;
     companyId: number;
     companyName: string;
     mvopPermitNo: string;
     vehicleLicenseNo: string;
     vehicleState: string;
     vehicleYear: number;
     vehicleMakeModel: string;
     witnessName: string;
     witnessBadgeNo: string;
     novNotes: string;

     isBadgeConfiscated: number = 0;
     badgeSuspendedDate: string;
     badgeReactivatedDate: string;
     badgeDeactivatedDate: string;
     remedialTrainingAssignedDate: string;
     remedialTrainingCompletionDate: string;
     remedialTraining: string;
     remedialTrainingTypeName: string
     additionalNotes: string;
     faa: string ="0";
     tsa: string="0";
     eligible: number = 0;
     dateOfDisclosure: string;
     isCorrectiveActionCompleted: number = 0;
     correctiveActionCompletedDate: string;
     otherTraining: string;
     adminFine: string;
     eventStatus: string;
     Type:string;
     issuedBy: string;
     email: string;
     phone: string;
     countryCode:string = "";
}

export class GraphModel {
     january: number = 0
     february: number = 0
     march: number = 0
     april: number = 0
     may: number = 0
     june: number = 0
     july: number = 0
     august: number = 0
     september: number = 0
     october: number = 0
     november: number = 0
     december: number = 0
     companyName:string
     violationTypeId: number = 0
     citationResonId: number = 0;
}

export class MonthlyCitationDetails {
     violationType: string
     citationReason: string
     citationResonId: number = 0
     citationCount: number = 0
     openCitationCount: number = 0
     submittedCitationCount: number = 0
     returnedToIssuerCitationCount: number = 0
     inprocessCitationCount: number = 0
     returnedToASCitationCount: number = 0
     pendingCitationCount: number = 0
     closedCitationCount: number = 0
}

export class CitationDetailsTableLabels {
     columnName: string
}

export class CitationSearch
{
     fromDate: string = ""
     toDate: string = ""
     violatorFirstName: string = "";
     violatorLastName: string = "";
     violatorBirthDate: string = "";
     companyId: number=0
     userId: string = ""
}
export class DataOutputModel {
     paging: PagingHeader;
     links: LinkInfo[];
     items: CitationDetails[];
   }
export class MobileViewData {
     UserId: number = 0;
     CompanyId: number = 0;
     FirstName: string = "";
     LastName: string = "";
     DOB: string = "";
     FromDate: string = "";
     ToDate: string = "";
     maxPageSize: number = 0;
     searchQuery: string = "";
     pageNumber: number = 0;
     pageSize: number = 0;
     orderBy: string = "id";
     orderDir: string = "desc";
     selectedValue: string = "All";
   }
export class CitationStateMaster{
     id:number;
     stateName:string;
}
export class PaymentMethod{
     id:number;
     paymentType:string
}
export class recentCitationMaster{
     id:number;
     securityBadgeNo:string;
     novNo:number;
     violationTypeId:number;
     violationType:string;
     citationResonId:number;
     citationReason:string;
     createdDate:string;
     type:string;
}    

