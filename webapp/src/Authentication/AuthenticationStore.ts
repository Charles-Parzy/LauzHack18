/* tslint:disable */
import { computed, observable } from "mobx";

const ACCESS_TOKEN_STORAGE = "access_token";

export default class AuthenticationStore {
    @observable private _token: string = localStorage.getItem(ACCESS_TOKEN_STORAGE) || "";
    @computed get token(): string {
        return this._token;
    }
    set token(token: string) {
        localStorage.setItem(ACCESS_TOKEN_STORAGE, token);
        this._token = token;
    }
}