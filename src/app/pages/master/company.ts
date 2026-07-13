import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class Company
{
    id: number=0;
    companyName : string; 
    companyLogo : string;    
    isConcessionaire : boolean
}

export class LineChartModel {
    dataCount: number = 0
    companyName:string
}

export class LineChartLabelModel {
    columnName: string
}
export class CompanyList
{
    
    companyName : string;   
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: CompanyList[];
}