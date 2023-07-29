interface Operation {
    name: string,
    params: { 
        key: string,
        value?: string
    }
}
export class VersionedMap {
    private version: number;
    private currentMap: Map<string, string>;
    private history: Operation[];

    constructor(){
        this.version = 0;
        this.currentMap = new Map();
        this.history = [];
    }

    private rebuildMap(version: number){
        const map = new VersionedMap();

        for (let index = 0; index < version; index++) {
            const op = this.history[index];
            map[op.name](op.params.key, op.params.value);
        }

        return map;
    }

    public get(key: string, version?: number){
        if(version && version < this.version){
            const previousVersion = this.rebuildMap(version);
            return previousVersion ? previousVersion.get(key) || null : null;    
        }

        if(version && version > this.version){
            return null;
        }

        return this.currentMap.get(key) || null;
    }

    public put(key: string, value: string){
        this.history.push({ name: 'put', params: { key, value } });
        this.currentMap.set(key, value);
        this.version++;
        return this.version;
    }

    public erase(key: string){
        if(this.currentMap.has(key)){
            this.history.push({ name: 'erase', params: { key } });
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