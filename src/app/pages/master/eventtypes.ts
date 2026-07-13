import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class EventTypes
{
    id: number=0;
    type : string;    
}
export class EventTypeList
{
    type : string;   
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: EventTypeList[];
}