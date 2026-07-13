import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Role, UserList } from '../pages/user/user';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { changePasswordModel } from '../pages/changepassword/changepassword.model';
import { AppConfigService } from './appconfigservice ';



@Injectable({ providedIn: 'root' })
export class UserService {
    gnBaseURL;
    constructor(private http: HttpClient, appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();      
    }

    getAll() {
        return this.http.get<User[]>(this.gnBaseURL +"users");
    }

    GetAllRolesList() {
        return this.http.get<Role[]>(this.gnBaseURL +"Account/GetAllRolesList");
    }

    changePassword(ChangePassword: changePasswordModel) {
        return this.http.post<any>(this.gnBaseURL +"Account/ChangePassword", ChangePassword);
    }

    register(user) {
        var formData = new FormData();
        formData.append("model", JSON.stringify(user));
        return this.http.post(this.gnBaseURL +"Account/RegisterUser", formData);
    }

    editUser(user: User) {
        return this.http.post<User>(this.gnBaseURL +"Account/UpdateUser", user);
    }


    GetUserList() {
        return this.http.get<UserList[]>(this.gnBaseURL +"Account/GetAllUsers");
    }

    getUserById(id: string) {
        return this.http.get<any>(this.gnBaseURL +"Account/GetUserById?id=" + id);
    }

    DeleteUserByid(id: string) {
        return this.http.get(this.gnBaseURL +"Account/DeleteUserById?id=" + id);
    }

    activateUserByid(id: string) {
        return this.http.get(this.gnBaseURL +"Account/activateUserById?id=" + id);
    }
}