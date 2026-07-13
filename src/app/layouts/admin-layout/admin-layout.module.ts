import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from "ng2-charts";
import { ChangepasswordComponent } from "@app/pages/changepassword/changepassword.component";
import { PendingBadgeDataComponent } from "@app/pages/pending-badge-data/pending-badge-data.component";
import { PendingBadgeViewComponent } from "@app/pages/pending-badge-view/pending-badge-view.component";
import { PendingbadgeapplicantsComponent } from "@app/pages/pendingbadgeapplicants/pendingbadgeapplicants.component";
import { CanDeactivateGuard } from "@app/_helpers/can-deactivate/can-deactivate.guard";
import { AuditLogComponent } from "@app/pages/auditlog/auditlog.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BadgeReportSettingsListComponent } from "@app/pages/master/badge-report-settings/badge-report-settings-list.component";
import { BadgeReportSettingsComponent } from "@app/pages/master/badge-report-settings/badge-report-settings.component";
import { CitationreasonsComponent } from "@app/pages/master/citationreasons/citationreasons.component";
import { CitationreasonseditComponent } from "@app/pages/master/citationreasons/citationreasonsedit.component";
import { CompanyeditComponent } from "@app/pages/master/company/companyedit.component";
import { CompanylistComponent } from "@app/pages/master/company/companylist.component";
import { EventTypeslistComponent } from "@app/pages/master/eventtypes/eventtype-list.component";
import { EventTypeseditComponent } from "@app/pages/master/eventtypes/eventtypeedit.component";
import { FacilityeditComponent } from "@app/pages/master/facility/facilityedit.component";
import { FacilitylistComponent } from "@app/pages/master/facility/facilitylist.component";
import { InspectiontypeeditComponent } from "@app/pages/master/inspectiontypes/inspectiontypeedit.component";
import { InspectiontypelistComponent } from "@app/pages/master/inspectiontypes/inspectiontypelist.component";
import { LocationeditComponent } from "@app/pages/master/location/locationedit.component";
import { LocationlistComponent } from "@app/pages/master/location/locationlist.component";
import { ReferenceguidesComponent } from "@app/pages/master/referenceguides/referenceguides.component";
import { RemedialTraininglistComponent } from "@app/pages/master/remedialtraining/remedialtraining-list.component";
import { RemedialTrainingeditComponent } from "@app/pages/master/remedialtraining/remedialtraining.component";
import { ViolationTypeslistComponent } from "@app/pages/master/violationtypes/violationtype-list.component";
import { ViolationTypeseditComponent } from "@app/pages/master/violationtypes/violationtypeedit.component";
import { UserComponent } from "@app/pages/user/user.component";
import { UserlistComponent } from "@app/pages/user/userlist.component";
import { SignaturePadModule } from "angular2-signaturepad";
import { NgSelectModule } from "@ng-select/ng-select";
import { BadgeverificationComponent } from "@app/pages/pendingbadgeapplicants/badgeverification/badgeverification.component";
import { ToastrModule } from "ngx-toastr";
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from "@app/_services/dateformatter";
import { OnlynumberDirective } from "@app/_helpers/onlynumber.directive";
import { ReferencecategorieseditComponent } from "@app/pages/master/referencecategorieslist/referencecategoriesedit/referencecategoriesedit.component";
import { ReferencecategorieslistComponent } from "@app/pages/master/referencecategorieslist/referencecategorieslist.component";
import { ReferenceguideeditComponent } from "@app/pages/master/referenceguides/referenceguideedit/referenceguideedit.component";
import { BadgelistingComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelisting.component";
//import { BadgelistingeditComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingedit/badgelistingedit.component";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BadgelistingeditComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingedit/badgelistingedit.component";
import { BadgelistingauthComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingauth/badgelistingauth.component";
import { ActivebadgesComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/activebadges/activebadges.component";
import { BadgeauditexcelComponent } from "@app/pages/pendingbadgeapplicants/badgeauditdashboard/badgeauditexcel/badgeauditexcel.component";
import { NgxPrintModule } from "ngx-print";
import { ProfileComponent } from "@app/pages/profile/profile.component";
import { InspectiontypemasterComponent } from "@app/pages/master/inspectiontypemaster/inspectiontypemaster.component";
import { InspectionmastereditComponent } from "@app/pages/master/inspectiontypemaster/inspectionmasteredit/inspectionmasteredit.component";
import { QueryanalyzerComponent } from "@app/pages/queryanalyzer/queryanalyzer.component";
import { QueryviewerComponent } from "@app/pages/queryanalyzer/queryviewer/queryviewer.component";
import { IncidentreportComponent } from "@app/pages/incidentreport/incidentreport.component";
import { IncidentreportaddeditComponent } from "@app/pages/incidentreport/incidentreportaddedit/incidentreportaddedit.component";
import { MapComponent } from "@app/pages/map/map.component";
import { TestMacroComponent } from "@app/pages/test-macro/test-macro.component";
import { TestMacroListComponent } from "@app/pages/test-macro/test-macro-list/test-macro-list.component";
import { IncidenttypesComponent } from "@app/pages/master/incidenttypes/incidenttypes.component";
import { IncidenttypeaddeditComponent } from "@app/pages/master/incidenttypes/incidenttypeaddedit/incidenttypeaddedit.component";
import { IncidentdetectionmethodComponent } from "@app/pages/master/incidentdetectionmethod/incidentdetectionmethod.component";
import { DetectionmethodaddeditComponent } from "@app/pages/master/incidentdetectionmethod/detectionmethodaddedit/detectionmethodaddedit.component";
import { IncidentexplosiveslistComponent } from "@app/pages/master/incidentexplosiveslist/incidentexplosiveslist.component";
import { IncidentexplosiveaddeditComponent } from "@app/pages/master/incidentexplosiveslist/incidentexplosiveaddedit/incidentexplosiveaddedit.component";
import { IncidentgunslistComponent } from "@app/pages/master/incidentgunslist/incidentgunslist.component";
import { IncidentgunsaddeditComponent } from "@app/pages/master/incidentgunslist/incidentgunsaddedit/incidentgunsaddedit.component";
import { IncidentindividuallistComponent } from "@app/pages/master/incidentindividuallist/incidentindividuallist.component";
import { IncidentindividualaddeditComponent } from "@app/pages/master/incidentindividuallist/incidentindividualaddedit/incidentindividualaddedit.component";
import { SharpObjectEditComponent } from "@app/pages/master/sharp-objects-list/sharp-object-edit/sharp-object-edit.component";
import { IncendiariesListComponent } from "@app/pages/master/incendiaries-list/incendiaries-list.component";
import { IncendiariesEditComponent } from "@app/pages/master/incendiaries-list/incendiaries-edit/incendiaries-edit.component";
import { DisablingListComponent } from "@app/pages/master/disabling-list/disabling-list.component";
import { DisablingEditComponent } from "@app/pages/master/disabling-list/disabling-edit/disabling-edit.component";
import { SharpObjectsListComponent } from "@app/pages/master/sharp-objects-list/sharp-objects-list.component";
import { SchedulerAddEditComponent } from "@app/pages/scheduler-add-edit/scheduler-add-edit.component";
import { SchedulerListComponent } from "@app/pages/scheduler-add-edit/scheduler-list/scheduler-list.component";
//import { BadgelistingviewComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingview/badgelistingview.component";
//import { BadgelistingviewComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingview/badgelistingview.component";
import { BadgedetailsComponent } from "@app/pages/pendingbadgeapplicants/badgedetails/badgedetails/badgedetails.component";
import { ChatBoxComponent } from "@app/pages/master/referenceguides/chat-box/chat-box.component";
import { ConcessionaireSecurityComponent } from "@app/pages/master/concessionaire-security/concessionaire-security.component";
import { CompanyMasterComponent } from "@app/pages/master/concessionaire-item-master/concessionaire-item-master.component";
import { AddeditcompanyMasterComponent } from "@app/pages/master/concessionaire-item-master/addeditconcessionaireitem.component";
import { ConcessionssecurityauditComponent } from "@app/pages/concessionssecurityaudit/concessionssecurityaudit.component";
import { ProhibitedcheckoutlogComponent } from "@app/pages/master/concessionaire-item-master/prohibitedcheckoutlog/prohibitedcheckoutlog.component";
import { ConcessionaireauditlogComponent } from '../../pages/master/concessionaireauditlog/concessionaireauditlog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ChartsModule,
    DataTablesModule,
    NgxSpinnerModule,
    NgMultiSelectDropDownModule,
    SignaturePadModule,
    NgSelectModule,
    ToastrModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgxPrintModule,

    // BsDatepickerModule.forRoot(),
    // NgBootstrapDatetimeAngularModule
  ],
  providers: [
    DatePipe,
    CanDeactivateGuard,
    {
      provide: NgbDateParserFormatter,
      useClass: CustomDateParserFormatter,
    },
    {
      provide: NgbDateAdapter,
      useClass: CustomAdapter,
    },
  ],

  declarations: [
    DashboardComponent,
    UserComponent,
    UserlistComponent,
    ViolationTypeslistComponent,
    CitationreasonsComponent,
    CompanylistComponent,
    BadgeReportSettingsComponent,
    BadgeReportSettingsListComponent,
    ChangepasswordComponent,
    CompanyeditComponent,
    CitationreasonseditComponent,
    ViolationTypeseditComponent,
    RemedialTraininglistComponent,
    RemedialTrainingeditComponent,
    ReferenceguidesComponent,
    ReferenceguideeditComponent,
    AuditLogComponent,
    EventTypeslistComponent,
    EventTypeseditComponent,
    InspectiontypeeditComponent,
    InspectiontypelistComponent,
    FacilitylistComponent,
    FacilityeditComponent,
    LocationlistComponent,
    LocationeditComponent,
    PendingbadgeapplicantsComponent,
    PendingBadgeViewComponent,
    PendingBadgeDataComponent,
    BadgeverificationComponent,
    BadgedetailsComponent,
    ReferencecategorieseditComponent,
    ReferencecategorieslistComponent,
    BadgelistingComponent,
    BadgelistingeditComponent,
    BadgelistingauthComponent,
    ActivebadgesComponent,
    BadgeauditexcelComponent,
    ProfileComponent,
    InspectiontypemasterComponent,
    InspectionmastereditComponent,
    QueryanalyzerComponent,
    QueryviewerComponent,
    ConcessionssecurityauditComponent,
    // IncidentreportComponent,
    // IncidentreportaddeditComponent,
    MapComponent,
    TestMacroComponent,
    TestMacroListComponent,
    SchedulerAddEditComponent,
    SchedulerListComponent,
    IncidenttypesComponent,
    IncidenttypeaddeditComponent,
    IncidentdetectionmethodComponent,
    DetectionmethodaddeditComponent,
    IncidentexplosiveslistComponent,
    IncidentexplosiveaddeditComponent,
    IncidentgunslistComponent,
    IncidentgunsaddeditComponent,
    IncidentindividuallistComponent,
    IncidentindividualaddeditComponent,
    DetectionmethodaddeditComponent,
    SharpObjectsListComponent,
    SharpObjectEditComponent,
    IncendiariesListComponent,
    IncendiariesEditComponent,
    DisablingListComponent,
    DisablingEditComponent,
    ChatBoxComponent,
    ConcessionaireSecurityComponent,
    CompanyMasterComponent,
    AddeditcompanyMasterComponent,
    ProhibitedcheckoutlogComponent,
    ConcessionaireauditlogComponent
    //BadgelistingviewComponent
    // RtlComponent
  ],
  exports: [],
})
export class AdminLayoutModule {}
