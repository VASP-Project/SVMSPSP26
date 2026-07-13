export class AuditCompanysViewModel {
        auditId: number =0;
        auditName: string="";
        auditType: string="";
        auditFromDate: Date | string | null;
        auditToDate: Date | string | null;
        companyName: string="";
        totalBadges: number=0;
        totalAccountable: number=0;
        totalUnAccountable: number=0;
        totalPercentageUnAccountable: number=0;
        isSubmitted:boolean;
        submittedBy:string = "";
        submittedDate:Date | string | null;
        authsignerComment:string = "";
        auditStatus:string = "";
    }


    export class BadgeHolderColorCountViewModel {
        accountableBadgeColor: string;
        accountableBadgeCount: number;
        unAccountableBadgeColor: string;
        unAccountableBadgeCount: number;
        total: number;
        percentUnaccountable: number;
    }

    export class BadgeHolderSeraCountViewModel {
        accountableBadgeColor: string;
        accountableBadgeCount: number;
        unAccountableBadgeColor: string;
        unAccountableBadgeCount: number;
        total: number;
        percentUnaccountable: number;
    }

    export class BadgeHolderCountViewModel {
        badgeHolderColorCount: BadgeHolderColorCountViewModel[]=[];
        badgeHolderSeraCount: BadgeHolderSeraCountViewModel[]=[];

    }