import { Component, OnInit } from "@angular/core";
import { SharpObjects } from "../sharpObjects";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { SharpObjectsService } from "../sharpObject.service";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-sharp-object-edit",
  templateUrl: "./sharp-object-edit.component.html",
  styleUrls: ["./sharp-object-edit.component.scss"],
})
export class SharpObjectEditComponent implements OnInit {
  sharpObjects = new SharpObjects();
  view: boolean = false;
  oldsharpObjectName: string = "";
  user: any;
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sharpObjectsService: SharpObjectsService, private appURL: AppConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams["isEdit"];
    if (isEdit == "1") {
      var isView = this.route.snapshot.pathFromRoot[1].queryParams["isView"];
      var sharpObjectsId: number =
        this.route.snapshot.pathFromRoot[1].queryParams["sharpObjectsId"];
      this.editsharpObjects(sharpObjectsId, isView);
    }
  }

  editsharpObjects(id, mode) {
    if (mode == "1") this.view = true;
    else this.view = false;
    this.GetSharpObjectsById(id);
  }

  private GetSharpObjectsById(id: number) {
    //this.spinner.show();
    this.sharpObjectsService
      .GetSharpObjectsById(id)
      .subscribe((response: SharpObjects) => {
        this.sharpObjects = response;
        this.sharpObjects.id = id;
        this.oldsharpObjectName = response.sharpObjectName;
        //this.spinner.hide();
      });
  }

  //Add User Submit
  onSubmit(formData: NgForm) {
    var sObject = {
      Id: formData.value.id,
      SharpObjectName: formData.value.sharpObjectName,
    };
    //this.spinner.show();
    if (
      this.oldsharpObjectName.toUpperCase().trim() !=
      this.sharpObjects.sharpObjectName.toUpperCase().trim()
    ) {
      this.sharpObjectsService
        .checkSharpObjectsExists(this.sharpObjects.sharpObjectName)
        .subscribe(
          (response) => {
            if (response) {
              this.toastr.error(
                "Sharp Object already exist. Try other Sharp Object",
                "Information"
              );
              this.sharpObjects.sharpObjectName = this.oldsharpObjectName;
              //this.spinner.hide();
            } else {
              this.saveSObj(sObject, formData);
            }
          },
          (error: any) => {
            this.toastr.error(
              "Sharp Object already exist. Try other Sharp Object",
              "Information"
            );
            //this.spinner.hide();
          }
        );
    } else {
      this.saveSObj(sObject, formData);
    }
  }

  saveSObj(sharpObject, formData: NgForm) {
    this.sharpObjectsService
      .AddEditSharpObject(sharpObject)
      .subscribe((response) => {
        this.toastr.success("Record Saved Successfully");
        formData.reset();
        //this.spinner.hide();
        this.router.navigate(["/admin/sharpObjectList"]);
      });
  }

  //Hide Add form
  hideaddform() {
    this.router.navigate(["/admin/sharpObjectList"]);
  }
}
