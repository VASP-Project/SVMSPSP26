import { Component, OnInit } from "@angular/core";
import { Disabling } from "../disabling";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { IncendiariesService } from "../../incendiaries-list/incendiaries.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DisablingService } from "../disabling.service";
import { NgForm } from "@angular/forms";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-disabling-edit",
  templateUrl: "./disabling-edit.component.html",
  styleUrls: ["./disabling-edit.component.scss"],
})
export class DisablingEditComponent implements OnInit {
  disabling = new Disabling();
  view: boolean = false;
  oldDisableName: string = "";
  user: any;
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private disablingService: DisablingService, private appURL: AppConfigService,
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
      var disableId: number =
        this.route.snapshot.pathFromRoot[1].queryParams["disableId"];
      this.editDisabling(disableId, isView);
    }
  }

  editDisabling(id, mode) {
    if (mode == "1") this.view = true;
    else this.view = false;
    this.GetDisablingById(id);
  }

  private GetDisablingById(id: number) {
    //this.spinner.show();
    this.disablingService
      .GetDisablingById(id)
      .subscribe((response: Disabling) => {
        this.disabling = response;
        this.disabling.id = id;
        this.oldDisableName = response.disablingName;
        //this.spinner.hide();
      });
  }

  //Add User Submit
  onSubmit(formData: NgForm) {
    var disabledDataData = {
      Id: formData.value.id,
      DisablingName: formData.value.disablingName,
    };
    //this.spinner.show();
    if (
      this.oldDisableName.toUpperCase().trim() !=
      this.disabling.disablingName.toUpperCase().trim()
    ) {
      this.disablingService
        .checkDisablingExists(this.disabling.disablingName)
        .subscribe(
          (response) => {
            if (response) {
              this.toastr.error(
                "Data already exist. Try other Data",
                "Information"
              );
              this.disabling.disablingName = this.oldDisableName;
              //this.spinner.hide();
            } else {
              this.saveDisablingData(disabledDataData, formData);
            }
          },
          (error: any) => {
            this.toastr.error(
              "Data already exist. Try other Data",
              "Information"
            );
            //this.spinner.hide();
          }
        );
    } else {
      this.saveDisablingData(disabledDataData, formData);
    }
  }

  saveDisablingData(sharpObject, formData: NgForm) {
    this.disablingService
      .AddEditDisabling(sharpObject)
      .subscribe((response) => {
        this.toastr.success("Record Saved Successfully");
        formData.reset();
        //this.spinner.hide();
        this.router.navigate(["/admin/disablingList"]);
      });
  }

  //Hide Add form
  hideaddform() {
    this.router.navigate(["/admin/disablingList"]);
  }
}
