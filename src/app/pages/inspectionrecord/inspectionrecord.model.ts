import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class DataOutputModel {
  paging: PagingHeader;
  links: LinkInfo[];
  items: InspetionRecordDetail[];
}
export class DataOutputModelForIncident {
  paging: PagingHeader;
  links: LinkInfo[];
  items: InspetionRecordDetail[];
}
export class MobileViewData {
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

export class InspetionRecordDetail {
  id: number;
  inspectionRecordNo: number;
  securityBadgeHolder: string;
  securityBadge: string;
  companyInspected: number = 0;
  companyEscorting: number = 0;
  firstName: string;
  lastName: string;
  badgeHolderDOB: string;
  mvop: string;
  driverLicenseNo: string;
  licenseState: string;
  vehicleState: string;
  vehicleYear: number;
  vehicleModel: string;
  vehicleLicenseNo: string;
  inspectionDate: string;
  inspectionTime: string;
  inspectionDateTime: Date;
  inspectionType: number;
  inspectionFacilityId: number;
  // inspectionLocationId:number;
  inspectionFinding: string;
  inspectionNOV: string;
  // inspectionIncidentReport:string;
  inspectionSummary: string;
  companyName: string;
  status: string;
  statusDisplayName: string;
  currentInspectionStatusId: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  issuedBy: string;
  inspAttachments: InspectionAttachments[] = [];
  //isSubmitted: boolean = false;
  citationId: number;
  inspType: string;
  companyEscort: string;
  inspFacility: string;
  inspLocation: string;
  currentStatus: string = "Draft";
  doorGateNumber: number;
  hours: number;
  minutes: number;
  spaceNumber: number;
  spaceDoor: number;
  inspectionNOVNumber: number;
  doorNamesForEachInspection: string;
  novNo: number;
  novNoMappingForEachInspection: string;
  badgeholderList: InspectionBadgeholder[] = [];
  badgeholderEdited: string = "";
  vehicleList: VehicleInspection[] = [];
  vehicleEdited: string = "";
  companyList: CompanyInformation[] = [];
  companyEdited: string = "";
  individualsInspected: number;
  unAuthData: string;
  isDeviation: string;
  justification: string;
  badge1: string = "";
  name1: string = "";
  badge2: string = "";
  name2: string = "";
  badge3: string = "";
  name3: string = "";
  awsInspList: AwsInspList[] = [];
  isBadgeAutoFilled: boolean = false;
  edtResolution: number | null = null;
  edtAlarm: number | null = null;
  alarmValue: string = "";
  resolutionName: string = "";
}

export class InspectionAttachments {
  public id: number;
  public inspectionId: number;
  public filePath: string = "";
  public tabNo: string = "";
  public thumbnailImage: string = "";
}

export const MY_CUSTOM_FORMATS = {
  parseInput: "MM/DD/YYYY HH:mm",
  fullPickerInput: "MM/DD/YYYY HH:mm",
  datePickerInput: "MM/DD/YYYY",
  timePickerInput: " HH:mm",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY",
};

export class VehicleInspection {
  public id: number;
  public inspectionId: number = 0;
  public vehicleId: number = 0;
  public vehicleState: string = "";
  public vehicleYear: number;
  public vehicleModel: string = "";
  public vehicleLicenseNo: string = "";
  public inedit: boolean = false;
}

export class InspectionBadgeholder {
  id: number;
  inspectionId: number;
  securityBadgeNo: string;
  securityBadgeNo2: string;
  securityBadgeNo3: string;
  firstName: string;
  lastName: string;
  companyId: number;
  cmpName: string;
  companyEscortedId: number;
  companyEscortedName: string;
  companyEscorted: string;
  badgeholderDOB: string;
  mvop: string;
  driverLicenseNo: string;
  licenseState: string;
  public inedit: boolean = false;
  badgeNumber:string;
  company:string;
  birthDate:string;
}

export class CompanyInformation {
  id: number;
  inspectionId: number;
  companyId: number;
  cmpName: string;
  companyFacilitator: string;
  dateOfKnife: string;
  public inedit: boolean = false;
}

export class InspetionRecordDetailStatus {
  id: number;
  inspectionId: number;
  inspectionRecordNo: number;
  securityBadgeHolder: string;
  securityBadge: string;
  companyInspected: number;
  companyEscorting: number;
  firstName: string;
  lastName: string;
  badgeHolderDOB: string;
  mvop: string;
  driverLicenseNo: string;
  licenseState: string;
  vehicleState: string;
  vehicleYear: number;
  vehicleModel: string;
  vehicleLicenseNo: string;
  inspectionDate: string;
  inspectionTime: string;
  inspectionType: number;
  inspectionFacilityId: number;
  // inspectionLocationId:number;
  inspectionFinding: string;
  inspectionNOV: string;
  // inspectionIncidentReport:string;
  inspectionSummary: string;
  companyName: string;
  status: string;
  statusDisplayName: string;
  currentInspectionStatusId: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  issuedBy: string;
  inspAttachments: InspectionAttachments[] = [];
  isSubmitted: boolean = false;
  citationId: number;
  inspType: string;
  companyEscort: string;
  inspFacility: string;
  inspLocation: string;
  currentStatus: string = "Draft";
  doorGateNumber: number;
  hours: number;
  minutes: number;
  spaceNumber: number;
  spaceDoor: number;
  compFacilitator: number;
  dateOfKnife: string;
  inspectionNOVNumber: number;
  doorNamesForEachInspection: string;
  novNo: number;
  novNoMappingForEachInspection: string;
  companyNamesForEachBadgeholder: string;
  companyNamesForEachCompanyInfo: string;
}

export class FromTODate {
  fromDate: string;
  toDate: string;
}
export class AwsInspList {
  id: number;
  inspectionId: number;
  badge1: number;
  badge2: number;
  badge3: number;
  firstNam1: string;
  firstNam2: string;
  firstNam3: string;
  lastName1: string;
  lastName2: string;
  lastName3: string;
}
export class InspectionEdtResolution {
  id: number  ;
  inspectionId: number;
  resolutionName: string;
}
export class InspectionEdtAlarm {
  id: number;
  alramsValue: string;
}