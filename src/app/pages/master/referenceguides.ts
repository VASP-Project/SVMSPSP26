import { ReferenceCategories } from './referencecategorieslist/referencecategories';
export class ReferenceGuides {
    id: number = 0;
    createdBy: string;
    createdDate: string;
    comments: string = "";
    files: fileInfoModel[];
     fileName:string;
    viewStaffAdmin: boolean;
    viewAuthsigner: boolean;
    viewIssuer: boolean;
    viewTSAUser: boolean;
    viewSecurity:boolean;
    rolename: string;
    referenceCategory:string;
    referenceColName: string;
    referenceCategoryId:number;
    viewTenant:boolean;
    //public thumbnailImage: string = '';
}

export class Refcat{
categoryName:string;
referencelist:ReferenceGuides[]=[];
isSelected:boolean = true;
}


export class fileInfoModel {
    attachmenttype: string;
    filename: string;
    filetype: string;
    fileid: string;
    file: string;
    filetitle: string;
}

export class linkModel {
    id: number = 0;
    name: string;
}