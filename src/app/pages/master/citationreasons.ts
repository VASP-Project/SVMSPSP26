import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class CitationReasons
{
    id: number=0;
    reason : string;    
    violationTypeId : number;
    violationType : string;
    status : boolean;
}
export class CitationReasonList
{
    
    reason : string;    
    violationType : string; 
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: CitationReasonList[];
}



