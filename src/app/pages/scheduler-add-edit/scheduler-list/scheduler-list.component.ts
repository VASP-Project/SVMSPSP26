import { Component, OnInit } from '@angular/core';
import { Scheduler } from '../Scheduler';
import { PagingHeader } from '@app/shared/shared.model';
import { Subject } from 'rxjs';
import { SchedulerService } from '../scheduler.service';
type AOA = any[][];
@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})

export class SchedulerListComponent implements OnInit {

  data: AOA = [];
  dtOptions: DataTables.Settings = {};
  pageHeaders: PagingHeader = new PagingHeader();
  dtTrigger: Subject<any> = new Subject();
  dataFromApi = [];
  user: any;
  isSuperAdmin: boolean = false;
  isTsaUser: boolean = false;
  isAWSScheduler: boolean = false;
  isTsaApprover: boolean = false;
  isTsaScheduler:boolean = false;
  scheduler: Scheduler[];
  isAlreadySubmitted: boolean = false;
  isAlreadyVerified: boolean = false;
  isStaffAdmin:boolean = false;

  constructor(private schedulerService: SchedulerService) { }

  ngOnInit(): void {
    
  this.user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (this.user.rolename == "Superadmin") {
    this.isSuperAdmin = true;
  }
  if (this.user.rolename == "StaffAdmin") {
    this.isStaffAdmin = true;
  }
  if (this.user.rolename == "TSA User") {
    this.isTsaUser = true;
  }
  if (this.user.rolename == "StaffAdmin") {
    this.isStaffAdmin = true;
  }
  if (this.user.isTsaApprover == true) {
    this.isTsaApprover = true;
  }
  if (this.user.isTsaScheduler == true) {
    this.isTsaScheduler = true;
  }
    this.GetScheduleDataList();

this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      order: [[0, 'desc']],
  };

  }

  public GetScheduleDataList() {
    // this.spinner.show();
    this.schedulerService.GetScheduleDataList().subscribe((response: Scheduler[]) => {
      // Filter for items where `isSubmitted` is true and format `scheduleStartDate`
      this.scheduler = response
        .filter(x => x.isSubmitted === true)
        .map(item => {
          if (item.scheduleStartDate) {
            const [day, month, year] = item.scheduleStartDate.split('-');
            item.scheduleStartDate = `${month}/${day}/${year}`; // Convert to MM/dd/yyyy format
          }
          return item;
        });

      this.dtTrigger.next();
      // this.spinner.hide();
    });
  }


}
