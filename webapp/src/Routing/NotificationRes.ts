type newTrophyType = "none" | "gold" | "silver" | "bronze";

export default class NotificationRes {
    private _prMerged: boolean;
    private _newTrophy: newTrophyType;

    constructor(prMerged: boolean, newTrophy: newTrophyType) {
        this._prMerged = prMerged;
        this._newTrophy = newTrophy;
    }

    public get prMerged(): boolean { return this._prMerged; }
    public get newTrophy(): newTrophyType { return this._newTrophy; }
}