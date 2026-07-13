import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class RemedialTraining
{
    id: number=0;
    remedialTrainingType : string;    
    isUsed:boolean;
    isActive:boolean;
}
export class RemeTrainingList
{
    
    remedialTrainingType : string;    
    isUsed:boolean;
    isActive:boolean;
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: RemeTrainingList[];
}