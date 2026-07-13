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
