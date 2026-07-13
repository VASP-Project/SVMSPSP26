import internal from "stream";

export class PendingBadgeApplicants
{    
    id: number = 0;
    companyName: string;
    lastName: string;
    firstName: string;
    activeDate: string;
    clearanceDate: string;
    badgekey:string;
    denyDate:string;
    hideButtons: boolean;
}

export class SecurityClearanceStatus
{    
    id: number = 0;
    companyName: string;
    lastName: string;
    firstName: string;
    fingerprintDate: string;
    clearanceDate: string;
    notificationDate: string;
    badgekey:string;
    denyDate:string;
    notifyBy:string;
    denyBy:string;
    reminderMailSent: boolean;
}

export class SecurityClearanceAuditLog
{
    id: number = 0;
    notifyOrDenyDates: string;
    notifyOrDenyByNames: string;
    notifyOrDeny: string   
}

// export class BadgeVerification
// {
//     id: number = 0;
//     company: string;
//     firstName: string;
//     lastName: string;
//     badgeNumber: string;
//     status: string;
//     badgeColor: string;
//     expirationDate: string;
//     escort: string;
//     badgeNo: number;
//     accessLevel: string;
//     badgeIcon: string;
//     sealColor: string;
// }

export class BadgeVerificationAudit{
    id: number = 0;
    userid: string;
    checkingDate: string;
    enteredBadgeNo: string;
    firtName: string;
    lastName: string;
}

export class AccessCategory {
    AccessCategoryId: number;
    AccessCategoryName: string;
}

export class BadgeVerification {
    Id: number = 0; // If you need this on frontend
    
    Company: string;
    FirstName: string;
    LastName: string;
    BadgeNumber: string;
    ProxNumber: string;
    Status: string;
    BadgeColor: string;
    IssuanceDate: string;
    ExpirationDate: string;
    AccessLevel: AccessCategory[] = []; // list of access categories
    EscortIcon: string;
    DriversIcon: string;
    CustomSeal: string;
    PersonUniqueId: string;
    BirthDate: string;
    StreetAddress: string;
    City: string;
    State: string;
    DriversLicenseNo: string;
    DlState: string;
    EmailAddress: string;
    MobileNumber: string;
    Photograph: string;

    // extra fields you had in your original class
    BadgeNo: number;
    BadgeIcon: string;
    SealColor: string;
}

