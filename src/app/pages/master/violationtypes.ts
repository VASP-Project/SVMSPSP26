import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class ViolationTypes
{
    id: number=0;
    violationType : string;  
    status: boolean;
 
}

// export class ViolationTypesTemp
// {
//     id: number=0;
//     violationType : string;  
//     reason: string;
//     dateTemp: string;
// }
export class ViolationTypeList
{
    id: number=0;
    violationType : string;   
   status: boolean;
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: ViolationTypeList[];
}