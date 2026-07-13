import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
//import { NovaddeditComponent } from './novaddedit/novaddedit.component';
import { RouterModule, Routes } from '@angular/router';
import { NovlistComponent } from './list/novlist.component';
// import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepicker, NgbModule, NgbTimeAdapter } from "@ng-bootstrap/ng-bootstrap";
import { NovaddeditComponent } from './novaddedit/novaddedit.component';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { SignaturePadModule } from 'angular2-signaturepad';
import { NovViewComponent } from './novview/novview.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select'
// import { DateTimeAdapter, OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MY_CUSTOM_FORMATS } from './CitationDetails';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import { CouComponent } from './cou/cou.component';
import { CouviewComponent } from './couview/couview.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CanDeactivateGuard } from '@app/_helpers/can-deactivate/can-deactivate.guard';
import { DateTimeFormatPipe } from '@app/_helpers/dateformatpipe';
import { OnlynumberDirective } from '@app/_helpers/onlynumber.directive';
import { CustomAdapter, CustomDateParserFormatter } from '@app/_services/dateformatter';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from "ngx-currency";
import { CitationchatbotComponent } from './citationchatbot/citationchatbot.component';

const NovRoutes: Routes = [
  { path: '', component: NovlistComponent },
 // { path: 'v/:id', component: NovaddeditComponent } 
  { path: 'details', component: NovaddeditComponent ,canDeactivate: [CanDeactivateGuard]},
  { path: 'view', component: NovViewComponent },
  { path: 'counseling', component: CouComponent, canDeactivate: [CanDeactivateGuard]},
  { path: 'counselingview', component: CouviewComponent},
  { path: 'chatbot', component: CitationchatbotComponent}
  
];

@NgModule({
  declarations: [ OnlynumberDirective,
    NovlistComponent, 
    NovaddeditComponent, 
    NovViewComponent,DateTimeFormatPipe, CouComponent, CouviewComponent, CitationchatbotComponent],
  imports: [
    CommonModule, NgbModule, WebcamModule,
    RouterModule.forChild(NovRoutes),
    FormsModule,
    SignaturePadModule,
    DataTablesModule,
    NgxSpinnerModule,
    // NgBootstrapDatetimeAngularModule, --rushali
    // BsDatepickerModule.forRoot(),--rushali
    
    // OwlDateTimeModule, 
    // OwlNativeDateTimeModule,
    NgMultiSelectDropDownModule,
    NgSelectModule,
    ToastrModule,
    NgxCurrencyModule
  
  ],
  providers: [DatePipe,CanDeactivateGuard,
    {
      provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
    },
    {
      provide: NgbDateAdapter, useClass: CustomAdapter
    },
    
    // { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
    
  exports:[ OnlynumberDirective]
})
export class NovModule { }
