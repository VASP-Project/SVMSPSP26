export class SystemLog{
    id:number;
    userId: string;
    userName: string;
    loginTime: Date;
    logoutTime: Date;
    action:string;
    actionDateTime:Date;
}
export class SystemLogAudit{
    id:number;
    userId: string;
    userName: string;
    action:string;
    actionDateTime:Date;
}