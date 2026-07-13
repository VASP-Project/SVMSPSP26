export class PagingHeader {
    totalItems: number = 0;
    pageNumber: number = 0;
    pageSize: number = 0;
    totalPages: number = 0;
}

export interface LinkInfo {
    pageNumber: number;
    pageSize: number;
    rel: string;
    method: string;
}

export class QueryStringParameters {
    maxPageSize: number = 0;
    searchQuery: string = "";
    pageNumber: number = 0;
    pageSize: number = 0;
    orderBy: string =  'id'
    orderDir: string =  'desc'
    selectedValue:string = 'All'
}