import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConcessionaireService } from './concessionaire-config.service';

import { ToastrService } from 'ngx-toastr';
import { ConcessionaireAuditSchedule, FormDataModel } from './concessionaire.model';

@Component({
  selector: 'app-concessionaire-security',
  templateUrl: './concessionaire-security.component.html',
  styleUrls: ['./concessionaire-security.component.scss']
})
export class ConcessionaireSecurityComponent implements OnInit {
  // Use the model type for strong typing
  formDataModel = new FormDataModel();
  auditTimes: ConcessionaireAuditSchedule[] = [];

  constructor(
    private concessionaireService: ConcessionaireService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.getConcessionVariable();
  }

  public getConcessionVariable(): void {
    const id = 1;

    this.concessionaireService.getConcessionVariable().subscribe(
      (response: FormDataModel) => {
        if (response) {
          this.formDataModel = response;
          if (response.auditSchedules && response.auditSchedules.length > 0) {
            this.auditTimes = response.auditSchedules
              .sort((a, b) => a.auditNo - b.auditNo)
              .map((x) => ({
                auditNo: x.auditNo,
                overdueTime: x.overdueTime
                  ? x.overdueTime.substring(0, 5)
                  : "",
                isNextDay: x.isNextDay
              }));
          } else {
            this.auditTimes = [];

            for (let i = 0; i < this.formDataModel.auditCount; i++) {
              this.auditTimes.push({
                auditNo: i + 1,
                overdueTime: "",
                isNextDay: false
              });
            }
          }
        } else {
          this.toastr.warning('No data received from server.', 'Warning');
        }
      },
      (error: any) => {
        console.error('Failed to load configuration', error);
        this.toastr.error('Failed to load configuration', 'Error');
      }
    );
  }

  public onSave(formData: NgForm): void {
    if (formData.valid) {
      const concessionaire = {
        Id: this.formDataModel.id,
        ItemQuantity: this.formDataModel.itemQuantity,
        ItemForCompany :  this.formDataModel.itemForCompany,
        AuditCount : this.formDataModel.auditCount,
        EmailId: this.formDataModel.emailId,
        AuditSchedules: this.auditTimes
      };

      this.saveConcessionaire(concessionaire, formData);
    }
  }

  public saveConcessionaire(concessionaire: any, formData: NgForm): void {
    this.concessionaireService.saveConfig(concessionaire).subscribe(
      (response:any) => {
        console.log(response)
        if (response?.status === 'success') {
        this.toastr.success('Configuration saved successfully!');
        this.getConcessionVariable();
      } else {
        this.toastr.error(response.message || 'Save failed');
      }

       
      },
      (error) => {
        this.toastr.error('Error saving configuration', 'Error');
        console.error('Save error:', error);
      }
    );
  }

  getChangeConcessionVariable(value: number): void {

    const count = Number(value) || 0;

    const existingSchedules = this.auditTimes || [];

    this.auditTimes = Array.from(
      { length: count },
      (_, index) => {

        const existing = existingSchedules.find(
          x => x.auditNo === index + 1
        );

        return {
          auditNo: index + 1,
          overdueTime: existing?.overdueTime || "",
          isNextDay: existing?.isNextDay || false
        };
      }
    );
  }

  getOrdinal(num: number): string {
    if (num % 100 >= 11 && num % 100 <= 13) {
      return "th";
    }

    switch (num % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

}
