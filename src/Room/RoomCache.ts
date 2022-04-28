export { }

declare global {
    interface Room {
        Cache(): _roomCache;
        _cache: _roomCache;
    }

}

Room.prototype.Cache = function () {
    if (this._cache == undefined) {
        this._cache = new _roomCache();
    }
    return this._cache;
}

export class _roomCache {
    _cache: { [Name: string]: any } = {}
    Set(name: string, val: any): void {
        this._cache[name] = val;
    }
    Get<Type>(name: string): Type | null {
        if (this._cache[name] != undefined) {
            return this._cache[name] as Type;
        }
        return null;
    }
}
