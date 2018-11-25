export class Project {
    private _fullname: string;
    private _owner: string;
    private _repo: string;
    private _url: string;
    private _description: string;
    private _tags: string[];
    private _issues: Issue[];

    constructor(fullname: string, owner: string, repo: string, url:string, description: string, tags: string[], issues: Issue[]) {
        this._fullname = fullname;
        this._owner = owner;
        this._repo = repo;
        this._url = url;
        this._description = description;
        this._tags = tags;
        this._issues = issues;
    }

    get fullname(): string {
        return this._fullname;
    }

    get owner(): string {
        return this._owner;
    }

    get repo(): string {
        return this._repo;
    }

    get description(): string {
        return this._description;
    }

    get tags(): string[] {
        return this._tags;
    }

    static fromJson(json: any): Project {
        return new Project(json.full_name, json.owner, json.name, json.url, json.description, json.topics, json.issues.map(Issue.fromJson));
    }

    get issues(): Issue[] {
        return this._issues;
    }

    get url(): string {
        return this._url;
    }

}


export class Issue {
    private _title: string;
    private _url: string;
    private _subtext: string;


    constructor(title: string, url: string, subtext: string) {
        this._title = title;
        this._url = url;
        this._subtext = subtext;
    }

    static fromJson(json: any): Issue {
        return new Issue(json.title, json.url, `#${json.number} created ${json.created.substr(0, 10)} by ${json.user}`);
    }


    get title(): string {
        return this._title;
    }

    get url(): string {
        return this._url;
    }

    get subtext(): string {
        return this._subtext;
    }
}