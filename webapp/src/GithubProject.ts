export class Project {
    private _user: string;
    private _name: string;
    private _description: string;
    private _tags: string[];
    private _issues: Issue[];
    private _followed: boolean;

    constructor(user: string, name: string, description: string, tags: string[], issues: Issue[], followed:boolean) {
        this._user = user;
        this._name = name;
        this._description = description;
        this._tags = tags;
        this._issues = issues;
        this._followed = followed;
    }


    get user(): string {
        return this._user;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get followed(): boolean {
        return this._followed;
    }

    printTags(): string {
        return this._tags.join(", ");
    }

    getTitle() {
        return this._user + "/" + this._name
    }

    get issues(): Issue[] {
        return this._issues;
    }

    url(): string {
        return `https://github.com/${this._user}/${this._name}`;
    }

}


export class Issue {
    private _id: string;
    private _title: string;


    constructor(id: string, title: string) {
        this._id = id;
        this._title = title;
    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    url(user: string, name: string) {
        return `https://github.com/${user}/${name}/issues/${this._id}`
    }
}