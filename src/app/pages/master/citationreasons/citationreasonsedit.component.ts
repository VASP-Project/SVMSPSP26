import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CitationReasonsService } from "../CitationReasons/citationreasons.service";
import { CitationReasons } from "../citationreasons";
import { NgForm } from "@angular/forms";
import { ViolationTypes } from "../violationtypes";
import { ViolationTypesService } from "../../master/violationtypes/violationtype.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-citationreasonsedit",
  templateUrl: "./citationreasonsedit.component.html",
  styleUrls: ["./citationreasons.component.scss"]
})
export class CitationreasonseditComponent implements OnInit {
  Citation = new CitationReasons();
  view: boolean = false;
  oldReasonName: string = "";
  oldVType: number = 0;
  allViolationTypes: ViolationTypes[];
  user: any;
  constructor(
    private CitationReasonsService: CitationReasonsService,
    private spinner: NgxSpinnerService,
    private ViolationTypesService: ViolationTypesService,
    private router: Router,
    private route: ActivatedRoute, private appURL: AppConfigService,
    private toastr: ToastrService
  ) { }

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
      var citatitionId: number = this.route.snapshot.pathFromRoot[1]
        .queryParams["citatitionId"];
      this.editCitationReasons(citatitionId, isView);
    }
    this.GetViolationTypeList();
  }

  editCitationReasons(id, mode) {
    if (mode == "1") {
      this.view = true;
    } else this.view = false;
    this.GetCitationReasonsById(id);
  }

  private GetCitationReasonsById(id: number) {
    //this.spinner.show();

    this.CitationReasonsService.GetCitationReasonsById(id).subscribe(
      (response: CitationReasons) => {
        this.Citation = response;
        this.oldReasonName = response.reason;
        this.oldVType = response.violationTypeId;
        this.Citation.id = id;
        //this.spinner.hide();
      }
    );
  }

  onSubmit(formData: NgForm) {
    var citationReason = {
      Id: formData.value.id,
      Reason: formData.value.CitationReason,
      ViolationTypeId: formData.value.violationTypeId
    };
    //this.spinner.show();
    if (this.oldReasonName.toUpperCase().trim() != this.Citation.reason.toUpperCase().trim() || this.oldVType != this.Citation.violationTypeId) {
      this.CitationReasonsService.CheckReasonExists(this.Citation.reason, this.Citation.violationTypeId).subscribe((response) => {
        if (response) {
          this.toastr.error('Violation type and Reason already exist. Try other combination', 'Information');
          this.Citation.reason = this.oldReasonName;
          this.Citation.violationTypeId = this.oldVType;
          //this.spinner.hide();
        }
        else {
          this.saveReason(citationReason, formData);
        }
      }, (error:any)=> {
        this.toastr.error('Violation type and Reason not saved', 'Information');
        //this.spinner.hide();
      });
    }
    else {
      this.saveReason(citationReason, formData);
    }
    //this.saveReason(citationReason, formData);
  }


  saveReason(citationReason, formData: NgForm) {
    this.CitationReasonsService.AddEditCitationReasons(
      citationReason
    ).subscribe(response => {
      this.toastr.success("Record Saved Successfully");
      formData.reset();
      //this.spinner.hide();
      this.router.navigate(["/admin/citationreason"]);
    });
  }

  hideaddform() {
    this.router.navigate(["/admin/citationreason"]);
  }

  public GetViolationTypeList() {
    //this.spinner.show();

    this.ViolationTypesService.GetViolationTypeList().subscribe(
      (response: ViolationTypes[]) => {
        this.allViolationTypes = response.filter(x => x.status === true);
        //this.spinner.hide();
      },
      (error:any)=> {
        //this.spinner.hide();

        // console.log("error list");
      }
    );
  }
}
