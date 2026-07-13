import { NgModel } from "@angular/forms";
import { Locations } from "../master/locations";

export class FromTODate {
  fromDate: string;
  toDate: string;
}
export class IncidentreportDetail {
  id: number;
  incidentRecordNo: number;
  incidentType: number;
  incidentTypeName: string
  additionalType: string;
  location: string;
  locationName: string;
  dateOccurred: string;
  timeOccurred: string;
  newTimeOccurred: string;
  mediaAttention: string;
  evacuation: string;
  evacuationDescription: string;
  tsacheckpointClosure: string;
  associatedNovreport: string;
  associatedInspreport: string;
  associatedOpdreport: string;
  reportingAgency: string;
  reportingAgencyName: string;
  involvedAgency: string;
  involvedAgencyName: string;
  perimeterBreach: string;
  perimeterBreachName: string;
  additionalDetails: string;
  incidentSummary: string;
  notificationList: IncidentNotifications[] = [];
  notificationEdited: string = "";
  locationForIncident: string;
  reportingAgencyIncident: string;
  inciType: string;
  incidentDateTime: string;
  incidentIndividuals: IncidentIndividuals[] = [];
  incidentPassengerInformation: IncidentPassengerInformation[] = [];
  incidentProhibitedItems: IncidentProhibitedItems[] = [];
  incidentFirearmInformation: IncidentFirearmInformation[] = [];
  incidentVehicleInformation: IncidentVehicleInformation[] = [];
  incidentAttachments: IncidentAttachments[] = [];
  incidentHotWash: IncidentHotWash[] = [];
  incidentEvents: IncidentEvents[] = [];
  
  otherLocationTextvalue: string;
  otherIndividualTypevalue: string;
  otherAttachmentTypevalue: string;
  dateReview: string;
  timeReview: string;
  newTimeReview: string;
  airportOfficial: string;
  updateReview: string;
  incidentStatus: string;
  dateApproved: string;
  approvingOfficial: string;
  isIncidentHotwash: string;
  hotwashDate: string;
  otherNotification: string;
  lname: SelectedLocation[] = [];
  otherReportingvalue: string;
  otherInvolvedvalue: string;
  isSubmitted: string;
  createdby: string;
  submittedBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  incidentUpdatedBy: string;
  incidentStatusDisplay: string;
  tsaNotified: boolean = false;
  tsaNotifiedValue: string;
  returnedComment: string;
  incidentFacilityId:number
  incidentFacilityName:string
  incidentDoor: string
  incidentDoorName: string
}

export class IncidentMastersLists {
  id: number = 0;
  incidentLocations: IncidentLocations[] = [];
  incidentAgency: IncidentAgency[] = [];
  detectionMethod: DetectionMethod[] = [];
  incidentAttendeesMaster: IncidentAttendeesMaster[] = [];
  incidentHotwashNameMaster: IncidentHotwashNameMaster[] = [];
  incidentRootCauseMaster: IncidentRootCauseMaster[] = [];
  incidentIndividualTypesMaster: IncidentIndividualTypesMaster[] = [];
  incidentAirlineMaster: IncidentAirlineMaster[] = [];
  incidentAcTypesMaster: IncidentAcTypesMaster[] = [];
  incidentExplosivesMaster: IncidentExplosivesMaster[] = [];
  incidentGunsMaster: IncidentGunsMaster[] = [];
  incidentSharpObjectsMaster: IncidentSharpObjectsMaster[] = [];
  incidentIncendiariesMaster: IncidentIncendiariesMaster[] = [];
  incidentDisablingMaster: IncidentDisablingMaster[] = [];
  incidentAttachmentTypesMaster: IncidentAttachmentTypesMaster[] = [];
  incidentCountryMaster: IncidentCountryMaster[] = [];
  incidentStatesMaster: IncidentStatesMaster[] = [];
  incidentTerminalMaster: IncidentTerminalMaster[] = [];
  incidentPerimeterMaster: IncidentPerimeterMaster[] = [];
  notificationTypes: NotificationTypes[] = [];
  locationsDoor:Locations[] = []
}

export class IncidentRecordDetailStatus {
  id: number;
  incidentId: number;
  incidentRecordNo: number;
  incidentType: string;
  additionalType: string;
  location: string;
  locationName: string;
  dateOccurred: string;
  timeOccurred: string;
  newTimeOccurred: string;
  mediaAttention: boolean;
  evacuation: boolean;
  evacuationDescription: string;
  tsacheckpointClosure: string;
  associatedNovReport: string;
  associatedInspReport: string;
  associatedOpdReport: string;
  reportingAgency: string;
  reportingAgencyName: string;
  involvedAgency: string;
  involvedAgencyName: string;
  perimeterBreach: string;
  perimeterBreachName: string;
  additionalDetails: string;
  incidentSummary: string;
  notificationList: IncidentNotifications[] = [];
  notificationEdited: string = "";
  locationForIncident: string;
  reportingAgencyIncident: string;
  inciType: string;
  incidentDateTime: string;
  incidentIndividuals: IncidentIndividuals[] = [];
  incidentPassengerInformation: IncidentPassengerInformation[] = [];
  incidentProhibitedItems: IncidentProhibitedItems[] = [];
  incidentFirearmInformation: IncidentFirearmInformation[] = [];
  incidentVehicleInformation: IncidentVehicleInformation[] = [];
  incidentAttachments: IncidentAttachments[] = [];
  incidentHotWash: IncidentHotWash[] = [];
  incidentEvents: IncidentEvents[] = [];
  
  otherLocationTextvalue: string;
  otherIndividualTypevalue: string;
  otherAttachmentTypevalue: string;
  dateReview: string;
  timeReview: string;
  airportOfficial: string;
  updateReview: string;
  incidentStatus: string;
  dateApproved: string;
  approvingOfficial: string;
  isIncidentHotwash: string;
  hotwashDate: string;
  otherNotification: string;
  lname: SelectedLocation[] = [];
  otherReportingvalue: string;
  otherInvolvedvalue: string;
  isSubmitted: string;
  createdby: string;
  submittedBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  incidentUpdatedBy: string;
  inspectionFacilityId:number
  incidentFacilityName:string
  incidentDoor: string
  incidentDoorName: string
}

export class IncidentTypes {
  id: number;
  incidentType: string;
}
export class IncidentLocations {
  id: number;
  incidentLocation: string;
  xcoordinate: number;
  ycoordinate: number;
}
export class IncidentAgency {
  id: number;
  reportingAgency: string;
}
export class NotificationTypes {
  id: number;
  notificationName: string;
}
export class IncidentNotifications {
  id: number = 0;
  incidentId: number = 0;
  notificationTypeId: number;
  officialNotified: string;
  notifiedDate: string;
  notifiedTime: string;
  newTime: string;
  newDate: string;
  notifiedBy: string;
  inedit: boolean = false;
  notificationName: string;
}

export class IncidentEvents {
  id: number = 0;
  incidentId: number = 0;
  eventTypeId: number;
  eventTypeName: string;
  eventDate: string;
  eventTime: string;
  newTime: string;
  newDate: string;
  userId: string;
  inedit: boolean = false;
  eventDetails: string;
  userName: string;  
}

export class IncidentIndividuals {
  public id: number;
  public incidentId: number;
  public individualType: number;
  public individualTypeName: string;
  public lastName: string;
  public firstName: string;
  public middleName: string;
  public nickName: string;
  public birthDate: string;
  public gender: string;
  public streetAddress: string;
  public apartment: string;
  public city: string;
  public state: string;
  public zip: string;
  public alternateAddress: string;
  public altApartment: string;
  public altCity: string;
  public altState: string;
  public altZip: string;
  public country: number;
  public countryName: string;
  public primaryPhone: string;
  public altPhone: string;
  public altEmail: string;
  public dl: string;
  public dlissuingState: number;
  public dlissuingStateName: string;
  public dlexpiringDate: string;
  public otherTypeId: string;
  public otherId: string;
  public expirationDate: string;
  public detainedbyLeo: string;
  public arrestedbyLeo: string;
  public arrestedDisposition: string;
  public flyCleared: string;
  public referralIssue: string;
  public additionalInformation: string;
  public inedit: boolean = false;
  public otherIndividualTypevalue: string;
}
export class IncidentPassengerInformation {
  id: number;
  incidentId: number;
  incidentInvolve: string;
  airline: number;
  acType: number;
  flight: string;
  destination: string;
  terminal: number;
  gate: string;
  isFlightDelayed: string;
  delayedTime: string;
  isMissedFlight: string;
  scheduledDepartureTime: string;
  actualDepartureTime: string;
  inedit: boolean = false;
  airlineName: string;
  acTypeName: string;
  terminalName: string;
}
export class DetectionMethod {
  id: number;
  detectionMethod: string;
}
export class IncidentProhibitedItems {
  id: number;
  incidentId: number;
  explosives: number;
  guns: number;
  sharpObjects: number;
  incendiaries: number;
  disabling: number;
  detectionMethod: string;
  detectionMethodName: string;
  itemDescription: string;
  isPhotoTaken: string;
  isPhotoAttach: string;
  explosivesName: string;
  gunsName: string;
  sharpObjectsName: string;
  incendiariesName: string;
  disablingName: string;
  inedit: boolean = false;
}
export class IncidentFirearmInformation {
  id: number;
  incidentId: number;
  isFirearmLoaded: string;
  make: string;
  model: string;
  caliber: string;
  locationDiscovered: string;
  inedit: boolean = false;
}
export class IncidentVehicleInformation {
  id: number = 0;
  incidentId: number;
  type: string;
  makeVehicle: string;
  modelVehicle: string;
  color: string;
  year: string;
  licenseState: number;
  license: string;
  isPhotoTaken: string;
  isPhotoAttach: string;
  licenseStateName: string;
  inedit: boolean = false;
}
export class IncidentAttachments {
  id: number;
  incidentId: number;
  type: number;
  isCctvretained: string;
  isCctvretainedValue: string;
  retainedCctvinfo: string;
  typeName: string;
  inedit: boolean = false;
  otherAttachmentTypevalue: string;
  fileName: string;
  thumbnailImage: string = "";
  uniqueName: string;
}
export class files {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
export class IncidentAttachmentFiles {
  public id: number;
  public incidentId: number;
  public incidentAttachmentId: number;
  public filePath: string = "";
  public createdBy: string = "";
  public updatedBy: string = "";
  public thumbnailImage: string = "";
}
export class IncidentAttendeesMaster {
  id: number;
  attendeesName: string;
}
export class IncidentHotwashNameMaster {
  id: number;
  hotwashTopicName: string;
}
export class IncidentRootCauseMaster {
  id: number;
  rootCauseName: string;
}
export class IncidentHotWash {
  id: number;
  incidentId: number;
  isIncidentHotwash: string;
  hotwashDate: string;
  newHotwashDate: string;
  attendees: string;
  additionalInfo: string;
  attendeesName: string;
  hotwashTopic: string;
  hotwashTopicName: string;
  rootCause: string;
  rootCauseName: string;
  inedit: boolean = false;
}
export class SelectedAttendees {
  id: number;
  attendesName: string;
}
export class SelectedHotwashTopic {
  id: number;
  topicName: string;
}
export class SelectedRootCause {
  id: number;
  rootName: string;
}
export class SelectedDetectionMethod {
  id: number;
  detectionMethod: string;
}
export class SelectedLocation {
  id: number;
  locationName: string;
}
export class SelectedRepoAgency {
  id: number;
  repoName: string;
}
export class SelectedInvolvedAgency {
  id: number;
  involvedName: string;
}
export class SelectedLocationDoor {
  id: number;
  locationDoor: string;
}
export class IncidentReviews {
  id: number;
  incidentId: number;
  incidentStatus: string;
  dateApproved: string;
  approvingOfficial: string;
}
export class IncidentHotwashAdditionalInfo {
  id: number;
  incidentId: number;
  additionalInfo: string;
}
export class IncidentIndividualTypesMaster {
  id: number;
  individualTypeName: string;
}
export class IncidentAirlineMaster {
  id: number;
  airlineName: string;
}
export class IncidentAcTypesMaster {
  id: number;
  actypeName: string;
}
export class IncidentExplosivesMaster {
  id: number;
  explosiveTypeName: string;
}
export class IncidentGunsMaster {
  id: number;
  gunTypeName: string;
}
export class IncidentSharpObjectsMaster {
  id: number;
  sharpObjectName: string;
}
export class IncidentIncendiariesMaster {
  id: number;
  incendiarieName: string;
}
export class IncidentDisablingMaster {
  id: number;
  disablingName: string;
}
export class IncidentAttachmentTypesMaster {
  id: number;
  attachmentTypeName: string;
}
export class IncidentCountryMaster {
  id: number;
  country: string;
}
export class IncidentStatesMaster {
  id: number;
  state: string;
}
export class IncidentTerminalMaster {
  id: number;
  terminalName: string;
}
export class IncidentPerimeterMaster {
  id: number;
  categoryId: number;
  categoryName: String;
  catDesc: string;
}
export class IncidentSelectedPerimeter {
  id: number;
  selectedcat: string;
}
