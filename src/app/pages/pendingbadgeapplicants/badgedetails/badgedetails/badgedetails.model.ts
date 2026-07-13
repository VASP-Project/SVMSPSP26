export class BadgeDetails {
    company: string="";
    firstName: string="";
    lastName: string="";
    badgeNumber: string="";
    
    proxNumber: string="";
    badgeStatus: string="";
    badgeColor: string="";
  
    issuanceDate: string="";
    expirationDate: Date;
    escortIcon: Date;
    driversIcon:string = "";
    customSeal:string = "";
    personUniqueId:string = "";
    birthDate:string = "";
    streetAddress:string = "";
    city:string = "";
    state:string = "";
    driversLicenseNo:string = "";
    dlState:string = "";
    emailAddress:string = "";
    mobileNumber:string = "";
    photograph:string = "";
}
export class BadgeData {
    id:number = 0;
    badgeNo:string = "";
    company:string = "";
    badgeDetails: BadgeDetails;
}


 
