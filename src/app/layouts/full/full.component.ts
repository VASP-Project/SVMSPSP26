import { Component, OnInit, HostListener } from "@angular/core";
import { Router } from "@angular/router";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
//declare var $: any;

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  year: any;

  public config: PerfectScrollbarConfigInterface = {};

  constructor(public router: Router) {
    this.year = new Date().getFullYear();
  }
  public isCollapsed = false;

  public innerWidth: number = 0;
  public defaultSidebar: string = "";
  public showMobileMenu = false;
  public expandLogo = false;
  public sidebartype = "full";

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/starter"]);
    }
    this.defaultSidebar = this.sidebartype;
    this.handleSidebar();
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.sidebartype = "mini-sidebar";
    } else {
      this.sidebartype = this.defaultSidebar;
    }
  }
  onShowMenuChange(showMenu: string) {
    console.log(showMenu);
    if (this.innerWidth < 1170 && (showMenu == "Settings" || showMenu == "Badging" || showMenu == "0" || showMenu == "Concessions Security")) {
      this.showMobileMenu = true;
    }
    else{
      this.showMobileMenu = false;
    }
  }
  onShowSubMenuChange(showSubMenu: string) {
    console.log(showSubMenu);
    if (this.innerWidth < 1170) {
      this.showMobileMenu = false;
    }
  }
  //  addItem($event) {
  //   if (window.innerWidth < 1170 ) {
  //     this.showMobileMenu = false;
  //   }
  // }

  toggleSidebarType() {
    switch (this.sidebartype) {
      case "full":
        this.sidebartype = "mini-sidebar";
        break;

      case "mini-sidebar":
        this.sidebartype = "full";
        break;
      default:
    }
  }
}
