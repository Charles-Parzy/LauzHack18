/* tslint:disable */
import { computed, observable } from "mobx";
import { Project } from 'src/GithubProject';

export default class TimelineStore {
    @observable private _followedProjects: Project[] = [];
    @computed get followedProjects(): Project[] {
        return this._followedProjects;
    }
    set followedProjects(followedProjects: Project[]) {
        this._followedProjects = followedProjects;
    }

    @observable private _recommendedProjects: Project[] = [];
    @computed get recommendedProjects(): Project[] {
        return this._recommendedProjects;
    }
    set recommendedProjects(recommendedProjects: Project[]) {
        this._recommendedProjects = recommendedProjects;
    }

    @observable private _waiting: boolean = false;
    @computed get waiting(): boolean { return this._waiting; }
    set waiting(waiting: boolean) { this._waiting = waiting; }
}