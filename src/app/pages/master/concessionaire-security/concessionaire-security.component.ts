import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConcessionaireService } from './concessionaire-config.service';

import { ToastrService } from 'ngx-toastr';
import { FormDataModel } from './concessionaire.model';

@Component({
  selector: 'app-concessionaire-security',
  templateUrl: './concessionaire-security.component.html',
  styleUrls: ['./concessionaire-security.component.scss']
})
export class ConcessionaireSecurityComponent implements OnInit {
  // Use the model type for strong typing
  formDataModel = new FormDataModel();


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
        EmailId: this.formDataModel.emailId
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

}
