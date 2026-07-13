export class DataResult{
    data:string = "";
    errormsg:string = "";
}

export class CitationDetails {
    id: number = 0;
    novNo: number = 0;
    type: string = "";
    caseStatus: string = "";
    violatorFirstName: string = "";
    violatorLastName: string = "";
    violatorBirthDate: string ;
    violationDate: string;
    violationTypeId: number = 0;
    violationType: string = "";
    opdPoliceReport: string = "";
    citationResonId: number = 0;
    citationReason: string ;
    summaryOfViolation: string ;
    address: string = "";
    city: string = "";
    state: string = "";
    zip: string = "";
    driversLicenseNo: string = "";
    licenseState: string= "";
    securityBadgeNo: string= "";
    companyId: number = 0;
    companyName: string= "";
    mvopPermitNo: string= "";
    vehicleLicenseNo: string= "";
    vehicleState: string= "";
    vehicleYear: number = 0;
    vehicleMakeModel: string= "";
    witnessName: string= "";
    witnessBadgeNo: string= "";
    novNotes: string= "";
    offenderSignature: string= "";
    capturedImage: string= "";
    currentCitationStatusId: number = 0;
    
    strCitationAttachments: string[] = [];
    isCompanyCitation: boolean = false;
    
    deletedEventIds: number[] = [];
    companyLogo: string= "";
    userId: string= "";
    status: string= "";
    statusDisplayName: string= "";
    currentStatus : string ="Draft";
    createdBy: string= "";
    createdDate: string= "";
    updatedBy: string= "";
    updatedDate: string= "";
    isSubmitted: boolean = false;
    //PA- added new
    isBadgeConfiscated: boolean = false;
    issuedBy: string= "";
    eventEdited: string = "";
    InspectionRecordNo: number = 0;
    email: string= "";
    remedialTrainingAssignedDate:string = "";
    isDueDate:boolean = false;
}