import { LinkInfo, PagingHeader } from "@app/shared/shared.model";

export class Locations
{
    id : number = 0;
    location : string;
    facilityId : number;
    facilityName : string;
    inIncident : boolean;
    xCoordinate : string;
    yCoordinate : string;  
    locationPhotos : LocationPhotos[] = []; 
     companyId: number;
    companyName:string;
    inSchedule : boolean;
}

export class LocationsList
{
    id : number = 0;
    location : string;
    facilityId : number;
    facilityName : string;
    inIncident : boolean;
    xCoordinate : string;
    yCoordinate : string;
    
     companyId: number;
    companyName:string;
}

export class LocationPhotos {
    public id: number;
    public locationId: number;
    public filePath: string = '';    
    public thumbnailImage: string = '';

}
export class LocationList
{
  
    location : string;
    facilityId : number;
    facilityName : string; 
    locationPhotos : LocationPhotos[] = [];
    
}

export class DataOutputModel {
    paging: PagingHeader;
    links: LinkInfo[];
    items: LocationList[];
}