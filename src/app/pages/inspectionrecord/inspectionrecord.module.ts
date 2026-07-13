import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InspectionrecordaddeditComponent } from './inspectionrecordaddedit/inspectionrecordaddedit.component';
import { InspectionrecordviewComponent } from './inspectionrecordview/inspectionrecordview.component';
import { InspectionrecordComponent } from './inspectionrecord.component';
import { FormsModule} from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { NgBootstrapDatetimeAngularModule } from 'ng-bootstrap-datetime-angular';
// import { BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
// import { DateTimeAdapter, OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { MY_CUSTOM_FORMATS } from '../novlist/CitationDetails';
import { RouterModule, Routes } from '@angular/router';
import { WebcamModule } from 'ngx-webcam';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NovaddeditComponent } from '../novlist/novaddedit/novaddedit.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate/can-deactivate.guard';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from '@app/_services/dateformatter';
import { NgxPaginationModule } from 'ngx-pagination';

const inspectionRoute: Routes=[
  {path:'',component:InspectionrecordComponent},
  {path:'details',component: InspectionrecordaddeditComponent, canDeactivate: [CanDeactivateGuard]},
  {path:'view',component:InspectionrecordviewComponent}
]

@NgModule({
  declarations: [InspectionrecordComponent, 
    InspectionrecordaddeditComponent, 
    InspectionrecordviewComponent,
    
    ],
  imports: [
    CommonModule, WebcamModule,
    RouterModule.forChild(inspectionRoute),
    FormsModule,SignaturePadModule,
    DataTablesModule,
    NgxSpinnerModule,
    // NgBootstrapDatetimeAngularModule,
    // BsDatepickerModule.forRoot(),
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule, 
    NgxFileDropModule,
    NgMultiSelectDropDownModule,
    ToastrModule,
    NgSelectModule,
    NgbModule,
    NgxPaginationModule   
    // TooltipModule 
    ],

  providers: [DatePipe ,CanDeactivateGuard,
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    {
      provide: NgbDateAdapter, useClass: CustomAdapter
    },
    // { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
    
  ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  

  
    
  //exports:[ OnlynumberDirective]
})
export class InspectionrecordModule { }
