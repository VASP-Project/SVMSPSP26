import { Routes } from "@angular/router";
import { ChangepasswordComponent } from "@app/pages/changepassword/changepassword.component";
import { AuditLogComponent } from "@app/pages/auditlog/auditlog.component";
import { PendingBadgeDataComponent } from "@app/pages/pending-badge-data/pending-badge-data.component";
import { PendingBadgeViewComponent } from "@app/pages/pending-badge-view/pending-badge-view.component";
import { PendingbadgeapplicantsComponent } from "@app/pages/pendingbadgeapplicants/pendingbadgeapplicants.component";
import { AuthGuard } from "@app/_helpers";
import { CanDeactivateGuard } from "@app/_helpers/can-deactivate/can-deactivate.guard";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { CompanylistComponent } from "@app/pages/master/company/companylist.component";
import { BadgeReportSettingsListComponent } from "@app/pages/master/badge-report-settings/badge-report-settings-list.component";
import { BadgeReportSettingsComponent } from "@app/pages/master/badge-report-settings/badge-report-settings.component";
import { CitationreasonsComponent } from "@app/pages/master/citationreasons/citationreasons.component";
import { CitationreasonseditComponent } from "@app/pages/master/citationreasons/citationreasonsedit.component";
import { CompanyeditComponent } from "@app/pages/master/company/companyedit.component";
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
import { UserlistComponent } from "@app/pages/user/userlist.component";
import { UserComponent } from "@app/pages/user/user.component";
import { BadgeverificationComponent } from "@app/pages/pendingbadgeapplicants/badgeverification/badgeverification.component";
import { ReferencecategorieslistComponent } from "@app/pages/master/referencecategorieslist/referencecategorieslist.component";
import { ReferencecategorieseditComponent } from "@app/pages/master/referencecategorieslist/referencecategoriesedit/referencecategoriesedit.component";
import { ReferenceguideeditComponent } from "@app/pages/master/referenceguides/referenceguideedit/referenceguideedit.component";
import { BadgelistingComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelisting.component";
import { BadgelistingeditComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingedit/badgelistingedit.component";
import { BadgelistingauthComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingauth/badgelistingauth.component";
import { BadgeauditdashboardComponent } from "@app/pages/pendingbadgeapplicants/badgeauditdashboard/badgeauditdashboard.component";
import { ActivebadgesComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/activebadges/activebadges.component";
import { BadgeauditexcelComponent } from "@app/pages/pendingbadgeapplicants/badgeauditdashboard/badgeauditexcel/badgeauditexcel.component";
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
import { DetectionmethodaddeditComponent } from "@app/pages/master/incidentdetectionmethod/detectionmethodaddedit/detectionmethodaddedit.component";
import { IncidentdetectionmethodComponent } from "@app/pages/master/incidentdetectionmethod/incidentdetectionmethod.component";
import { IncidentexplosiveslistComponent } from "@app/pages/master/incidentexplosiveslist/incidentexplosiveslist.component";
import { IncidentexplosiveaddeditComponent } from "@app/pages/master/incidentexplosiveslist/incidentexplosiveaddedit/incidentexplosiveaddedit.component";
import { IncidentgunslistComponent } from "@app/pages/master/incidentgunslist/incidentgunslist.component";
import { IncidentgunsaddeditComponent } from "@app/pages/master/incidentgunslist/incidentgunsaddedit/incidentgunsaddedit.component";
import { IncidentindividuallistComponent } from "@app/pages/master/incidentindividuallist/incidentindividuallist.component";
import { IncidentindividualaddeditComponent } from "@app/pages/master/incidentindividuallist/incidentindividualaddedit/incidentindividualaddedit.component";
import { DisablingEditComponent } from "@app/pages/master/disabling-list/disabling-edit/disabling-edit.component";
import { DisablingListComponent } from "@app/pages/master/disabling-list/disabling-list.component";
import { IncendiariesEditComponent } from "@app/pages/master/incendiaries-list/incendiaries-edit/incendiaries-edit.component";
import { IncendiariesListComponent } from "@app/pages/master/incendiaries-list/incendiaries-list.component";
import { SharpObjectEditComponent } from "@app/pages/master/sharp-objects-list/sharp-object-edit/sharp-object-edit.component";
import { SharpObjectsListComponent } from "@app/pages/master/sharp-objects-list/sharp-objects-list.component";
import { SchedulerAddEditComponent } from "@app/pages/scheduler-add-edit/scheduler-add-edit.component";
import { SchedulerListComponent } from "@app/pages/scheduler-add-edit/scheduler-list/scheduler-list.component";
import { BadgedetailsComponent } from "@app/pages/pendingbadgeapplicants/badgedetails/badgedetails/badgedetails.component";
import { ChatBoxComponent } from "@app/pages/master/referenceguides/chat-box/chat-box.component";
import { ConcessionaireSecurityComponent } from "@app/pages/master/concessionaire-security/concessionaire-security.component";
import { CompanyMasterComponent } from "@app/pages/master/concessionaire-item-master/concessionaire-item-master.component";
import { AddeditcompanyMasterComponent } from "@app/pages/master/concessionaire-item-master/addeditconcessionaireitem.component";
import { ConcessionssecurityauditComponent } from "@app/pages/concessionssecurityaudit/concessionssecurityaudit.component";
import { ProhibitedcheckoutlogComponent } from "@app/pages/master/concessionaire-item-master/prohibitedcheckoutlog/prohibitedcheckoutlog.component";
import { ConcessionaireauditlogComponent } from "@app/pages/master/concessionaireauditlog/concessionaireauditlog.component";

//import { BadgelistingeditComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingedit/badgelistingedit.component";
//import { BadgelistingviewComponent } from "@app/pages/pendingbadgeapplicants/badgelisting/badgelistingview/badgelistingview.component";


export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "user", component: UserlistComponent, canActivate: [AuthGuard] },
  { path: "useradd/:method/:id", component: UserComponent, canActivate: [AuthGuard] },
  { path: 'nov', loadChildren: () => import('../../pages/novlist/nov.module').then(m => m.NovModule), canActivate: [AuthGuard] },
  { path: "changepassword", component: ChangepasswordComponent, canActivate: [AuthGuard] },
  //{path:'incidentreportadd',component: IncidentreportaddeditComponent, canDeactivate: [CanDeactivateGuard]},

  /* Event Type */
  { path: "eventtype", component: EventTypeslistComponent, canActivate: [AuthGuard] },
  { path: "eventtypeedit", component: EventTypeseditComponent, canActivate: [AuthGuard] },

  /* Violation Type */
  { path: "violationtype", component: ViolationTypeslistComponent, canActivate: [AuthGuard] },
  { path: "violationtypeedit", component: ViolationTypeseditComponent, canActivate: [AuthGuard] },

  /* Citation Reason */
  { path: "citationreason", component: CitationreasonsComponent, canActivate: [AuthGuard] },
  { path: "citationreasonsedit", component: CitationreasonseditComponent, canActivate: [AuthGuard] },

 
  { path: "company", component: CompanylistComponent, canActivate: [AuthGuard] },
  { path: "companyedit", component: CompanyeditComponent, canActivate: [AuthGuard] },

  { path: "auditlog", component: AuditLogComponent, canActivate: [AuthGuard] },

  { path: "remedialtraining", component: RemedialTraininglistComponent, canActivate: [AuthGuard] },
  { path: "remedialtrainingedit", component: RemedialTrainingeditComponent, canActivate: [AuthGuard] },

  { path: "referenceguides", component: ReferenceguidesComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: "referenceguideedit", component: ReferenceguideeditComponent, canActivate: [AuthGuard]},
  { path: "chatbot", component: ChatBoxComponent, canActivate: [AuthGuard]},

  { path: 'inspection', loadChildren: () => import('../../pages/inspectionrecord/inspectionrecord.module').then(m => m.InspectionrecordModule), canActivate: [AuthGuard] },
  { path: "inspectiontype", component: InspectiontypelistComponent, canActivate: [AuthGuard]},
  { path: "inspectiontypeedit", component: InspectiontypeeditComponent, canActivate:[AuthGuard]},

  { path: "facility", component: FacilitylistComponent, canActivate:[AuthGuard]},
  { path: "facilityedit", component: FacilityeditComponent, canActivate:[AuthGuard]},

  { path: "location", component: LocationlistComponent, canActivate: [AuthGuard]},
  { path: "locationedit", component: LocationeditComponent, canActivate: [AuthGuard]},

  { path: "pendingbadgeapplicants", component: PendingbadgeapplicantsComponent, canActivate: [AuthGuard] },
  { path: "badgereportaddedit", component: BadgeReportSettingsComponent, canActivate: [AuthGuard] },
  { path: "badgereportsettingslist", component: BadgeReportSettingsListComponent, canActivate: [AuthGuard] },
  { path: "pendingbadgeapplicantsview", component: PendingBadgeViewComponent, canActivate: [AuthGuard] },
  { path: "pendingbadgeapplicantsdata", component: PendingBadgeDataComponent, canActivate: [AuthGuard] },

  { path: "referencecategories", component: ReferencecategorieslistComponent, canActivate: [AuthGuard]},
  { path: "referencecategoriesedit", component: ReferencecategorieseditComponent, canActivate: [AuthGuard]},

  { path: "badgeverification", component: BadgeverificationComponent, canActivate: [AuthGuard] },
  { path: "badgedetails", component: BadgedetailsComponent, canActivate: [AuthGuard] },
  { path: "badgelisting", component: BadgelistingComponent, canActivate: [AuthGuard] },
  { path: "badgelistingedit", component: BadgelistingeditComponent, canActivate: [AuthGuard] },
  { path: "badgelistingauth", component: BadgelistingauthComponent, canActivate: [AuthGuard] },
  { path: "badgedashoard", component: BadgeauditdashboardComponent, canActivate: [AuthGuard] },
  { path: "activebadges", component: ActivebadgesComponent, canActivate: [AuthGuard] },
  { path: "badgeauditexcel", component: BadgeauditexcelComponent, canActivate: [AuthGuard] },

  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "inspectiontypemaster", component: InspectiontypemasterComponent, canActivate: [AuthGuard] },
  { path: "inspectionmasteredit", component: InspectionmastereditComponent, canActivate: [AuthGuard] },
  { path: "queryanalyzer", component: QueryanalyzerComponent, canActivate: [AuthGuard] },
  { path: "queryviewer", component: QueryviewerComponent, canActivate: [AuthGuard] },
  { path: "concessionssecurity", component: ConcessionssecurityauditComponent, canActivate: [AuthGuard] },
  { path: "concessionssecurityauditlog", component: ConcessionaireauditlogComponent, canActivate: [AuthGuard] },

  { path: "prohibiteditemmaster", component: CompanyMasterComponent, canActivate: [AuthGuard] },
  { path: "addeditprohibiteditem", component: AddeditcompanyMasterComponent, canActivate: [AuthGuard] },
  { path: "concessionairesecurity", component: ConcessionaireSecurityComponent, canActivate: [AuthGuard] },
  { path: "prohibitedcheckout", component: ProhibitedcheckoutlogComponent, canActivate: [AuthGuard] },
//  { path: "incidentreport", component: IncidentreportComponent, canActivate: [AuthGuard] },
//  { path: "incidentreportadd", component: IncidentreportaddeditComponent, canActivate: [AuthGuard] },

  { path: "map", component: MapComponent, canActivate: [AuthGuard] },

  { path: "testmacro", component: TestMacroComponent, canActivate: [AuthGuard] },
  { path: "testmacrolist", component: TestMacroListComponent, canActivate: [AuthGuard] },

  { path: "scheduler", component: SchedulerAddEditComponent, canActivate: [AuthGuard] },
  { path: "schedulerList", component: SchedulerListComponent, canActivate: [AuthGuard] },

  { path: 'incident', loadChildren: () => import('../../pages/incidentreport/incidentrecord.module').then(m => m.IncidentrecordModule), canActivate: [AuthGuard] },
  { path: "incidenttypelist", component: IncidenttypesComponent, canActivate: [AuthGuard] },
  { path: "incidenttypeaddedit", component: IncidenttypeaddeditComponent, canActivate: [AuthGuard] },
  { path: "detectionmethodlist", component: IncidentdetectionmethodComponent, canActivate:[AuthGuard]},
  { path: "detectionmethodaddedit", component: DetectionmethodaddeditComponent, canActivate: [AuthGuard]},
  { path: "explosivelist", component: IncidentexplosiveslistComponent, canActivate: [AuthGuard]},
  { path: "explosiveaddedit", component: IncidentexplosiveaddeditComponent, canActivate: [AuthGuard]},
  { path: "gunslist", component: IncidentgunslistComponent, canActivate: [AuthGuard]},
  { path: "gunsaddedit", component: IncidentgunsaddeditComponent, canActivate: [AuthGuard]},
  { path: "individuallist", component: IncidentindividuallistComponent, canActivate: [AuthGuard]},
  { path: "individualaddedit", component: IncidentindividualaddeditComponent, canActivate: [AuthGuard]},
  //{ path: "badgelistingview", component: BadgelistingviewComponent, canActivate: [AuthGuard] },
  //{ path: 'nov', loadChildren: () => import('../../pages/master/nov.module').then(m => m.NovModule) },
  // { path: "rtl", component: RtlComponent }

  { path: "sharpObjectList", component: SharpObjectsListComponent, canActivate: [AuthGuard]},
  { path: "sharpObjectEdit", component: SharpObjectEditComponent, canActivate: [AuthGuard]},

  { path: "incendiariesList", component: IncendiariesListComponent, canActivate: [AuthGuard]},
  { path: "incendiariedEdit", component: IncendiariesEditComponent, canActivate: [AuthGuard]},

  { path: "disablingList", component: DisablingListComponent, canActivate: [AuthGuard]},
  { path: "disablingEdit", component: DisablingEditComponent, canActivate: [AuthGuard]},
];
