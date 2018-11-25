export default class User {
    private _name: string;
    private _avatarUrl: string;
    private _topics: string[];
    private _languages: string[];
    private _trophies: number[];

    constructor(name: string, avatarUrl: string, topics: string[], languages: string[], trophies: number[]) {
        this._name = name;
        this._avatarUrl = avatarUrl;
        this._topics = topics;
        this._languages = languages;
        this._trophies = trophies;
    }

    public get name(): string { return this._name; }
    public get avatarUrl(): string { return this._avatarUrl; }
    public get topics(): string[] { return this._topics; }
    public get languages(): string[] { return this._languages; }
    public get trophies(): number[] { return this._trophies; }
}