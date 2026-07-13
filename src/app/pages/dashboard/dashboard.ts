export class DashboardDates{
    fromDate: string = ""
    toDate: string = ""
}
export class InspectionDashBoard {
    id: number = 0;
    inspectionCategory:string="";
    requirementHours:string="";
    inspectionDisplayNameWithCompany: InspectionDisplayNameWithCompany[];
    isVisible:boolean = false;
    completedHours:number = 0;
    completedMinutes:number = 0;
    completedActiveCount:number = 0;
}
export class InspectionDisplayNameWithCompany {
    displayName:string = "";
    inspectionCompanys:InspectionCompany[];
    isComVisible:boolean = false;
    calculatedHours:number = 0;
    calculatedMinutes:number = 0;
    calculatedActiveCount:number = 0;
}
export class InspectionCompany{
    companyName: string ="";
    hours:number = 0;
    minutes:number = 0;
    showCompData:boolean = false; 
    activeCount:number = 0;
}
export class InspectionSearch
{
    fromDateInsp: string = ""
    toDateInsp: string = ""
     
}