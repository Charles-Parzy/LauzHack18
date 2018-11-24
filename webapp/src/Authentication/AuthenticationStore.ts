/* tslint:disable */
import { computed, observable } from "mobx";

export default class AuthenticationStore {
    @observable private _session: string;
    @computed get session(): string {
        return this._session;
    }
    set session(session: string) {
        this._session = session;
    }
}