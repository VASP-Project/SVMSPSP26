import {
  Component,
  AfterViewInit,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { ROUTES } from "./menu-items";
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Company } from "@app/pages/master/company";
import { CompanyMasterService } from "@app/pages/master/concessionaire-item-master/company-master.service";
//declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  user: any;
  rolename: string;
  showMenu = "";
  showSubMenu = "";
  isBadgeAudit: boolean = false;
  isPicheckout : boolean =false;
  isAuditor: boolean = false;
  companyId: number = 0;
  companies: Company[];
  public sidebarnavItems: RouteInfo[] = [];
  isCompanyExist: boolean = false;
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newItemEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMenuChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showSubMenuChange: EventEmitter<string> =
    new EventEmitter<string>();

  // this is for the open close
  addExpandClass(element: string) {
    this.newItemEvent.emit("true");
    if (element === this.showMenu) {
      this.showMenu = "0";
    } else {
      this.showMenu = element;
    }
    this.showMenuChange.emit(this.showMenu);
  }

  handleNotify() {
    this.notify.emit(!this.showClass);
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private companyMasterService: CompanyMasterService,
  ) {}

  // End open close
  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.isBadgeAudit = this.user.isBadgeAudit;
    this.rolename = this.user.rolename;
    this.isPicheckout = this.user.isPicheckout 
     this.isAuditor = this.user.isAuditor

    this.sidebarnavItems = ROUTES.filter((sidebarnavItem) => sidebarnavItem);
    this.sidebarnavItems.forEach((element) => {
      if (element.title == "Badging") {
        element.submenu.forEach((elementsubmenu) => {
          if (elementsubmenu.title == "Badge Accountability Audit") {
            elementsubmenu.extralink = this.isBadgeAudit;
          }
        });
      }

      if( this.user.rolename == "Concessionaire User" || this.user.rolename == "AuthSigner"){
          this.GetCompanyList(this.user.id)
      }
      
      if(this.user.rolename == "Concessionaire User"){
        
        if (element.title == "Concessions Security") {
        element.submenu.forEach((elementsubmenu) => {
          if (elementsubmenu.title == "Prohibited Item Log") {
            elementsubmenu.extralink = this.isAuditor;
          }
          if (elementsubmenu.title == "Prohibited Item CheckOut") {
            elementsubmenu.extralink = this.isPicheckout;
          }
          if (elementsubmenu.title == "Prohibited Item Audit") {
            elementsubmenu.extralink = this.isAuditor;
          }
        });
      }}
    });

    //Get user form local storage
  }

//   ngOnInit() {
//   this.user = JSON.parse(sessionStorage.getItem("currentUser"));
//   this.rolename = this.user.rolename;
//   this.isBadgeAudit = this.user.isBadgeAudit;

//   this.sidebarnavItems = ROUTES.map((menuItem) => {
//     const filteredSubmenu = (menuItem.submenu || []).filter((subItem) => {
//       const hasRole = subItem.role.includes(this.rolename);
//       const passCheck =
//         typeof subItem.permissionCheck === "function"
//           ? subItem.permissionCheck(this.user)
//           : true;
//       return hasRole && passCheck;
//     });

//     return {
//       ...menuItem,
//       submenu: filteredSubmenu,
//     };
//   }).filter((menuItem) => {
//     // Show main menu only if user has role and at least one visible submenu or no submenu at all
//     const hasRole = menuItem.role.includes(this.rolename);
//     return hasRole && (menuItem.submenu?.length > 0 || !menuItem.submenu);
//   });
// }

 public GetCompanyList(userId: string) {
  this.companyMasterService
    .getAllCompaniesList(userId)
    .subscribe((response: Company[]) => {
      this.companies = response;

      const hasNonConcessionaire = this.companies.some(
        (c) => c.isConcessionaire === true
      );

      // Set flag to hide menu if any company is not concessionaire
      if (!hasNonConcessionaire) {
        this.sidebarnavItems = this.sidebarnavItems.filter(
          (item) => item.title !== "Concessions Security"
        );
      }
    });
}

  hasPermission(roles: string[]) {
    if (roles.indexOf(this.rolename) > -1) {
      return true;
    }
    return false;
  }

  hasBadgeAuditPermission() {
    if (this.isBadgeAudit) {
      return true;
    }
    return false;
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = "0";
    } else {
      this.showSubMenu = element;
    }
    this.showSubMenuChange.emit(this.showSubMenu);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
