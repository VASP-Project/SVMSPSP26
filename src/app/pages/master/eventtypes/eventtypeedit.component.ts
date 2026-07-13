import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViolationTypes } from '../violationtypes';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventTypeList, EventTypes } from '../eventtypes';
import { EventTypesService } from './eventtype.service';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
    templateUrl: './eventtypeedit.component.html',
    styleUrls: ['./eventtype.component.css']
})
export class EventTypeseditComponent implements OnInit {
    eventtype = new EventTypes();
    view: boolean = false;
    oldEventName:string="";
    user:any;
    queryParam: QueryStringParameters = new QueryStringParameters();
    eventTypeList : EventTypeList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC

    constructor(private toastr: ToastrService, private spinner: NgxSpinnerService,  private appURL: AppConfigService,
        private eventTypesService: EventTypesService,
        private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
                //Get user form local storage
       this.user = JSON.parse(sessionStorage.getItem("currentUser"));
       if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
        if (!this.user.passwordReseted) {
          //this.spinner.hide();
          this.router.navigate(['admin/changepassword']);
        }
      }    
        var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
        if (isEdit == "1") {
            var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
            var id: number = this.route.snapshot.pathFromRoot[1].queryParams['id'];
            this.editEventTypes(id, isView)
        }
    }


    editEventTypes(id, mode) {
        if (mode == "1")
            this.view = true;
        else
            this.view = false;
        this.GetEventTypeById(id);
    }


    private GetEventTypeById(id: number) {
        //this.spinner.show();
        this.eventTypesService.GetEventTypeById(id).subscribe((response: EventTypes) => {
            this.eventtype = response
            this.eventtype.id = id;
            this.oldEventName = response.type;
            //this.spinner.hide();

        });

    }


    //Add User Submit
    onSubmit(formData: NgForm) {
        var eventtype = {
            Id: formData.value.id,
            Type: formData.value.type

        };
        //this.spinner.show();
        if(this.oldEventName.toUpperCase().trim() != this.eventtype.type.toUpperCase().trim())
        {
          this.eventTypesService.CheckTypeExists(this.eventtype.type).subscribe((response) => {
            if (response) {
              this.toastr.error('Event type already exist. Try other Event type', 'Information');
              this.eventtype.type = this.oldEventName;
              //this.spinner.hide();
            }
            else
            {
              this.saveType(eventtype, formData);
            }       
          }, (error:any)=> {
            this.toastr.error('Event type already exist. Try other Event type', 'Information');
            //this.spinner.hide();
          });
        } 
        else
        {
          this.saveType(eventtype, formData);
        }  
    }


    saveType(eventtype, formData: NgForm) {
        this.eventTypesService.AddEditEventTypes(eventtype).subscribe((response) => {
            this.toastr.success('Record Saved Successfully');
            formData.reset();
            //this.spinner.hide();
            this.router.navigate(['/admin/eventtype']);
        });
    }


    //Hide Add form 
    hideaddform() {
        this.router.navigate(['/admin/eventtype']);
    }
}
