import { CitationAttachments } from './CitationDetails';

export class CorrectiveActions {
    id: number;
    citationId: number;
    //isBadgeConfiscated: number = 0; //Moved to Citation details page
    badgeSuspendedDate: string;
    remedialTrainingAssignedDate: string;
    // typeofRemedialTraining1: string;
    // typeofRemedialTraining2: string;
    // typeofRemedialTraining3: string;
    remedialTrainingCompletionDate: string;
    remedialTrainings: string;
    badgeReactivatedDate: string;
    badgeDeactivatedDate: string;
    additionalNotes: string;
    faa: string="";
    tsa: string="";
    eligible: number = 0;
    dateOfDisclosure: string;
    isCorrectiveActionCompleted: number = 0;
    correctiveActionCompletedDate: string;
    currentCitationStatusId: number;

    CorrectiveActionsAttachments: CitationAttachments[]=[]; 
    strCorrectiveActionsAttachments: string[]=[]; 
    correctiveActionsTrainings: CorrectiveActionsTrainings[] =[];

    isSubmitted:boolean = false;

    badgeRevoked: boolean= false;
    adminFine: boolean= false;
    otherTraining:string;
    remedialTrainingId:number;
    remedialTrainingType:string;
    staffAdminComment:string="";
    staffAdminCommentIssuer:string=""
    notifyAuth:boolean=false;
    fineAmount:string;
    finePaid:boolean = false;
    paymentMethod:number;
   // paymentTypeId:number;
}
export class CorrectiveActionsTrainings {
    id: number;
    correctiveActionId: number;
    typeofRemedialTrainingName: string;
    typeofRemedialTraining: number;
    userId: string;
}