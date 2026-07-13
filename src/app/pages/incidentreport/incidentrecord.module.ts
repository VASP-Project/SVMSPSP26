import { RouterModule, Routes } from "@angular/router";
import { IncidentreportComponent } from "./incidentreport.component";
import { IncidentreportaddeditComponent } from "./incidentreportaddedit/incidentreportaddedit.component";
import { CanDeactivateGuard } from "@app/_helpers/can-deactivate/can-deactivate.guard";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { WebcamModule } from "ngx-webcam";
import { FormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxFileDropModule } from "ngx-file-drop";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ToastrModule } from "ngx-toastr";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CustomAdapter, CustomDateParserFormatter } from "@app/_services/dateformatter";
import { IncidentviewComponent } from './incidentview/incidentview.component';
import { AuthGuard } from "@app/_helpers";

const incidentRoute: Routes=[
    {path:'',component:IncidentreportComponent},
    {path:'incidentreportadd',component: IncidentreportaddeditComponent, canDeactivate: [CanDeactivateGuard]},
    {path:'incidentreportview',component: IncidentviewComponent,canActivate: [AuthGuard] },
  ]

  @NgModule({
    declarations: [IncidentreportComponent, 
        IncidentreportaddeditComponent, IncidentviewComponent, 
      
      
      ],
    imports: [
      CommonModule, WebcamModule,
      RouterModule.forChild(incidentRoute),
      FormsModule,
      DataTablesModule,
      NgxSpinnerModule,
      
      NgxFileDropModule,
      NgMultiSelectDropDownModule,
      ToastrModule,
      NgSelectModule,
      NgbModule,
      
      // TooltipModule 
      ],
  
    providers: [DatePipe ,CanDeactivateGuard,
      {
        provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
      },
      {
        provide: NgbDateAdapter, useClass: CustomAdapter
      },
     
    ],
  
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    
  
    
      
    
  })
  export class IncidentrecordModule { }