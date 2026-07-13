// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  className: string;
  extralink: boolean;
  submenu: RouteInfo[];
  role:string[];
  permissionCheck?: (user: any) => boolean;
}
