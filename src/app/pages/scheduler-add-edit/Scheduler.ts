export class Scheduler {
  id: number = 0;
  apsNumber: number;
  points: number;
  category: string;
  weeklyHours: number = 0;
  scheduleStartDate: string;
  newScheduleStartDate: string;
  shiftStartTime: number;
  shiftCloseTime: number;
  isMoreThanOneShift: string;
  numberOfShifts: string;
  isRunAll: boolean = false;
  thisShift: string;
  isSpecificDoor: string;
  isVerified: boolean = false;
  verifiedText: string = "";
  isSubmitted: boolean = false;
  submittedBy: string;
  submittedDate: Date;
  approvedBy: string;
  approvedDate: string;
}
export class SchedulerSlotInfo {

  scheduleDate: string;

  shift: string;

  startTime: string;

  endTime: string;

  facilityId: number;

  locationId: number;

  doorName: string;
  slotId: string;
  inspectionId: number;;
}

export class ScheduleItem {
    slotId: string;
    facilityId: number;
    locationId: number;
    scheduleDate: string;

    shift: string;
    duration: string;
    startTime: string;
    endTime: string;
    door: string;

    inspectionId: number | null;
    inspectionStatus?: string;
}
export class ScheduleDisplayRow {
  slotId: string;
  facilityId: number;
  locationId: number;
  scheduleDate: string;
  shift: string;
  duration: string;
  startTime: string;
  endTime: string;
  door: string;
  inspectionId: string | null;
  inspectionStatus?: string;
}
