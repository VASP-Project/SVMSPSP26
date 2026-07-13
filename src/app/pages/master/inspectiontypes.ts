import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class InspectionTypes
{
    id: number;
    inspectionType : string;    
    displayName : string;
    requirementHours : string;
}
export class InspectionTypesView
{
    id: number;
    inspectionType : string;    
    displayName : string;
    requirementHours : string;
    statusText : string;
}
export class InspectionList
{
    
    inspectionType : string;
    displayName : string; 
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: InspectionList[];
}