import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Incendiaries } from "../incendiaries";
import { IncendiariesService } from "../incendiaries.service";
import { NgForm } from "@angular/forms";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-incendiaries-edit",
  templateUrl: "./incendiaries-edit.component.html",
  styleUrls: ["./incendiaries-edit.component.scss"],
})
export class IncendiariesEditComponent implements OnInit {
  incendiaries = new Incendiaries();
  view: boolean = false;
  oldInsName: string = "";
  user: any;
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private incendiariesService: IncendiariesService, private appURL: AppConfigService,
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
      var incendId: number =
        this.route.snapshot.pathFromRoot[1].queryParams["incendId"];
      this.editIndendiaries(incendId, isView);
    }
  }

  editIndendiaries(id, mode) {
    if (mode == "1") this.view = true;
    else this.view = false;
    this.GetIncendiariesById(id);
  }

  private GetIncendiariesById(id: number) {
    //this.spinner.show();
    this.incendiariesService
      .GetIncendiariesById(id)
      .subscribe((response: Incendiaries) => {
        this.incendiaries = response;
        this.incendiaries.id = id;
        this.oldInsName = response.incendiarieName;
        //this.spinner.hide();
      });
  }

  //Add User Submit
  onSubmit(formData: NgForm) {
    var InsData = {
      Id: formData.value.id,
      IncendiarieName: formData.value.incendiarieName,
    };
    //this.spinner.show();
    if (
      this.oldInsName.toUpperCase().trim() !=
      this.incendiaries.incendiarieName.toUpperCase().trim()
    ) {
      this.incendiariesService
        .checkIncendiariesExists(this.incendiaries.incendiarieName)
        .subscribe(
          (response) => {
            if (response) {
              this.toastr.error(
                "Data already exist. Try other Data",
                "Information"
              );
              this.incendiaries.incendiarieName = this.oldInsName;
              //this.spinner.hide();
            } else {
              this.saveInsData(InsData, formData);
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
      this.saveInsData(InsData, formData);
    }
  }

  saveInsData(sharpObject, formData: NgForm) {
    this.incendiariesService
      .AddEditIncendiaries(sharpObject)
      .subscribe((response) => {
        this.toastr.success("Record Saved Successfully");
        formData.reset();
        //this.spinner.hide();
        this.router.navigate(["/admin/incendiariesList"]);
      });
  }

  //Hide Add form
  hideaddform() {
    this.router.navigate(["/admin/incendiariesList"]);
  }
}
