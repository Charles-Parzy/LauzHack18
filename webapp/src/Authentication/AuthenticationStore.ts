/* tslint:disable */
import { computed, observable } from "mobx";
import NotificationRes from 'src/Routing/NotificationRes';

const ACCESS_TOKEN_STORAGE = "access_token";

export default class AuthenticationStore {
    @observable private _token: string = localStorage.getItem(ACCESS_TOKEN_STORAGE) || "";
    @computed get token(): string {
        return this._token;
    }
    set token(token: string) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE, token);
        this._token = token;
        if (!token) {
            return;
        }
    }

    public getNotification(token: string) {
        fetch(`http://localhost:8080/notifications?token=${token}`)
        .then(res => res.json())
        .then(res => new NotificationRes(res.pr_merged, res.new_trophy)) // pr_merged: boolean, new_trophy: string {"none" | "gold" | "silver" | "bronze"}
        .then(res => this.handleNotification(res))
        .catch(err => {
            console.error("Error:", err);
            clearInterval();
        });
    }

    private handleNotification(res: NotificationRes): void {
        console.log(res);
        if (!res.prMerged && res.newTrophy == "none") {
            return;
        }
        this.notif = res;
    }

    @observable private _notif: NotificationRes | undefined;
    @computed get notif(): NotificationRes | undefined { return this._notif; }
    set notif(notif: NotificationRes | undefined) { this._notif = notif; }
}