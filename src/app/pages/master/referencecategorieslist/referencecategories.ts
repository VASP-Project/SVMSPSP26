import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class ReferenceCategories
{
    id: number = 0;
    referenceCategory : string;  
    referenceSortOrderId:number;  
    sortOrder:string;
    isSelected:boolean = false;
}

export class ReferenceSortOrders
{
    id:number = 0;
    sortOrder : string;
}
export class ReferenceCategoryList
{
    referenceCategory : string;
    sortOrder:string;

}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: ReferenceCategoryList[];
}