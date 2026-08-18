import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

// concessionaire.ts
export class FormDataModel {
  id: number;
  itemQuantity: number | null;
  itemForCompany: number | null;
  auditCount: number | null;
  emailId:string | null;
  auditSchedules: ConcessionaireAuditSchedule[];
}

// company-item.model.ts
export class CompanyItemModel {
  id: number;
  description: string;
  quantity: string;
  photos: File[];
}

export class DataOutputModel {
  paging: PagingHeader;
  links: LinkInfo[];
  items: ProhibitedDetails[];
}

export class ProhibitedDetails {
  
  approvedBy:string;
  approvedDate :string;
  id: number = 0;
  companyId: number;
  companyName: string;
  filePath: string;
  description: string = '';
  quantityApproved: number ;
  shortDescription: string
  submittedDate:string;
  thumbnailImage: string = "";
  originalImage : string = "";
  uniqueName: string;
  status: string;
  submittedBy: string;
  statusDisplay: string;
  quantityAllowed: number 
  quantityUsein:number 
  newQuantityAllowed:number ;
  comment:string;
  showlabelApprove:boolean
  showlabelReject:boolean
  showlabel:boolean
  newStatus:string
  discardQuantity:number
  showForDiscard:boolean
  discardApproved:number
  checkoutDate:string
  returnTime:string
  location:string
  locationId:number
  mgmtValidation:string
  employeeBadge:string
  checkoutTime:string
  showEditQty:boolean
  itemId:string
  removalComment:string
  updatedBy:string
  updateDate:string
  thumbnailImageByte: string
  fileList: FileList[] = [];
   thumbnailUrl?: any;
   originalurl?: any;
}
export class FileList {
  fileName: string;
  mimeType: string;
  fileBytes: any; // base64 from API  
}


export class ProhibitedItemCheckOut {
  id?: number;
  companyId?: number;
  companyName?: string;
  status?: string;
  location?: string;
  checkoutDate?: string;
  checkoutTime?: string;
  returnTime?: string;
  shortDescription?: string;
  submittedBy?: string;
  submittedDate?: Date;
  updatedBy?: string;
  updatedDate?: Date;
  badgeNo?: string;
  filePath:string
  thumbnailImage: string = "";
  returnDateTime:string
  badgeName?:string
  itemId:string
  prohibitedItemId:number
  locationId:number
  firstName:string;
  lastName:string;
}

export class Item {
  shortDescription: string;
  filePath: string;
  thumbnailImage: string;
  description: string;
  quantityAllowed: string;
  newQuantityAllowed:number ;
  location:string
  locationId:number
  
}

export class ShortDescItem {
  shortDescription: string;
  filePath: string;
  thumbnailImage: string;
  description: string;
  quantityAllowed: string;
  newQuantityAllowed:number ;
  location:string
  locationId:number
  status:string
  itemId:string
  prohibitedItemId:number
}

export class ProhibitedCheckOutLog{
  id: number = 0;
  companyId: number;
  companyName: string;
  filePath: string;
  description: string = '';
  shortDescription: string
  submittedDate:string;
  thumbnailImage: string = "";
  uniqueName: string;
  status: string;
  submittedBy: string;
  statusDisplay: string;
  quantityAllowed: number 
  quantityUsein:number 
  comment:string;
  discardQuantity:number
  showForDiscard:boolean
  discardApproved:number
  
}

export class ProhibitedAuditSummary {
  id: number;
  companyId?: number;
  companyName?: string;
  location?: string;
  dailyAuditCount?: number;
  completedAuditCount?: number;
  violation?: boolean;
  toShow?: boolean;
  status?: string;
  isCompleted?: boolean;
  auditNo:number;
  createdDateTime?: string; // Use ISO string for date (e.g., "2025-06-30T10:00:00")
  auditedDateTime?: string;
  auditSubmittedBy?:string
  showCitationButton?:boolean
  citationNo?:number
  dailyAuditId?:number
  isCompletedAudit?:boolean;
  comment?:string;
  thumbnailUrl?:any;
  locationId?:number;
  thumbnailImage?:string;
  prohibitedItemId ?:number;
  
}

export class ProhibitedItemAudit {
  // From ProhibitedItemForAudit
  auditNo: number;
  dailyAuditId: number;
  auditStatus: string;

  // From ProhibitedItemViewModel
  prohibitedItemId: number;
  filePath?: string;
  companyId?: number;
  companyName?: string;
  description?: string;
  quantityAllowed?: number;
  quantityUsein?: number;
  status?: string;
  statusDisplay?: string;
  submittedDate?: string; // ISO date string
  submittedBy?: string;
  approvedBy?: string;
  approvedDate?: string; // ISO date string
  shortDescription?: string;
  comment?: string;
  discardQuantity?: number;
  discardApproved?: number;
  location?: string;
  locationId?: number;
  itemId?: string;
  removalComment?: string;
  thumbnailImage?: string;
  checkOutLocationName?: string;
  auditComment?:string
  thumbnailUrl?: any;
  
}
export class ProhibitedDetailsStatus {
  
  approvedBy:string;
  approvedDate :string;
  id: number = 0;
  companyId: number;
  companyName: string;
  filePath: string;
  description: string = '';
  quantityApproved: number ;
  shortDescription: string
  submittedDate:string;
  thumbnailImage: string = "";
  originalImage : string = "";
  uniqueName: string;
  status: string;
  submittedBy: string;
  statusDisplay: string;
  quantityAllowed: number 
  quantityUsein:number 
  newQuantityAllowed:number ;
  comment:string;
  showlabelApprove:boolean
  showlabelReject:boolean
  showlabel:boolean
  newStatus:string
  discardQuantity:number
  showForDiscard:boolean
  discardApproved:number
  checkoutDate:string
  returnTime:string
  location:string
  locationId:number
  mgmtValidation:string
  employeeBadge:string
  checkoutTime:string
  showEditQty:boolean
  itemId:string
  removalComment:string
  updatedBy:string
  updateDate:string
  prohibitedItemDetailsId:number
}

export class ProhibitedItemForAudit {
  id: number = 0;
  prohibitedItemId?: number;
  dailyAuditId?: number;
  auditNo?: number;
  status?: string;
  auditedOn?: string;
  isSubmitted?: boolean;
  thumbnailUrl: any;
}

export class ConcessionaireAuditSchedule
{
    auditNo :number;
    overdueTime :string;
    isNextDay: boolean
}