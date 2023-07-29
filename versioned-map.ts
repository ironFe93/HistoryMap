export class VersionedMap {
    private version: number;
    private currentMap: Map<string, string>;
    private history: Map<number, Map<string, string>>;

    constructor(){
        this.version = 0;
        this.currentMap = new Map();
        this.history = new Map();
    }

    public get(key: string, version?: number){
        if(version){
            const previousVersion = this.history.get(version);
            return previousVersion ? previousVersion.get(key) || null : null;    
        }
        return this.currentMap.get(key) || null;
    }

    public put(key: string, value: string){
        this.history.set(this.version, new Map(this.currentMap));
        this.currentMap.set(key, value);
        this.version++;
        return this.version;
    }

    public erase(key: string){
        if(this.currentMap.has(key)){
            this.history.set(this.version, new Map(this.currentMap));
            this.currentMap.delete(key);
            this.version++;
            return this.version;
        }
        return this.version;
    }

    public getVersion(){
        return this.version;
    };
}