import { Component, OnInit } from "@angular/core";
import { SharpObjects, SharpObjectsList } from "./sharpObjects";
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { SharpObjectsService } from "./sharpObject.service";
import { Subject } from "rxjs";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-sharp-objects-list",
  templateUrl: "./sharp-objects-list.component.html",
  styleUrls: ["./sharp-objects-list.component.scss"],
})
export class SharpObjectsListComponent implements OnInit {
  sharpObjects: SharpObjects[];
  user: any;
  dtOptions: DataTables.Settings = {};
  sharpObjectsList: SharpObjectsList[];
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sharpObjectsService: SharpObjectsService,
    private appURL: AppConfigService,
    private router: Router,
  ) {}

  ngOnInit() {
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (
      this.appURL.getLoginMethod() != "Azure" &&
      this.appURL.getLoginMethod() != "Okta"
    ) {
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(["admin/changepassword"]);
      }
    }
    this.GetSharpObjectList();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
    };
  }

  public GetSharpObjectList() {
    //this.spinner.show();
    this.sharpObjectsService
      .GetSharpObjectList()
      .subscribe((response: SharpObjectsList[]) => {
        this.sharpObjects = response;
        this.dtTrigger.next();
        //this.spinner.hide();
        this.HighlightSharp();
      });
  }

  viewSharpObjects(id: number) {
    let navigationExtras: any = {
      queryParams: {
        sharpObjectsId: id,
        isEdit: 1,
        isView: 1,
      },
    };
    this.router.navigate(["/admin/sharpObjectEdit"], navigationExtras);
  }

  DeleteSharpObjactsById(id) {
    var ans = confirm("Are you sure you want to delete this Sharp Object?");
    if (ans == true) {
      //this.spinner.show();
      this.sharpObjectsService
        .DeleteSharpObjactsById(id)
        .subscribe((response: Response) => {
          if (response.statusText == "Fail") {
            this.toastr.success(
              "There was some error deleting the record. Please try again later",
            );
          } else if (response.statusText === "Exists") {
            this.toastr.error(
              "Sharp Object not deleted. It is attached to a Incident record",
            );
          } else {
            this.toastr.success("Sharp Object deleted successfully");
          }
          //this.spinner.hide();
          $("#dt1").DataTable().destroy();
          this.GetSharpObjectList();
        });
    }
  }

  HighlightSharp() {
    const editedRowId = sessionStorage.getItem("SharpObjRowId");

    if (editedRowId) {
      setTimeout(() => {
        const row = document.getElementById("row-" + editedRowId);

        if (row) {
          row.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          row.classList.add("highlight-row");

          setTimeout(() => {
            row.classList.remove("highlight-row");
          }, 3000);
        }
        sessionStorage.removeItem("SharpObjRowId");
      }, 300);
    }
  }

  saveSharpObjRow(id: number): void {
    sessionStorage.setItem("SharpObjRowId", id.toString());
  }
}
