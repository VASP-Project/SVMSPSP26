import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class Facilities
{
    id: number=0;
    facilityName : string;    
}

export class FacilitiesList
{
    
    facilityName : string;    
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: FacilitiesList[];
}