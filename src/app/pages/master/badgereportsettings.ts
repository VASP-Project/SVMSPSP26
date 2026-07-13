import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class BadgeReportEmailSettings
{
    id: number=0;
    email : string;    
    type:string;
}

export class BadgeReportSettings
{
    id: number=0;
    reminderDays: number=0;
    showRecordFor: number=0;
    pickUpDays: number=0;
    sprunMinutes: number=0;
    
}
export class BadgeReportList
{
    
    id: number=0;
    email : string;    
    type:string;   
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: BadgeReportList[];
}