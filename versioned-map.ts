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
    private operations: Operation[];
    private mutex: boolean;

    constructor(){
        this.version = 0;
        this.currentMap = new Map();
        this.operations = [];
        this.mutex = false;
    }

    private rebuildMap(version: number){
        const map = new Map();

        for (let index = 0; index < version; index++) {
            const op = this.operations[index];
            map[op.name](op.params.key, op.params.value);
        }

        return map;
    }

    private async acquireLock(){
        while (this.mutex) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
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

    public async put(key: string, value: string){
        await this.acquireLock();

        try {
            this.mutex = true;
            this.currentMap.set(key, value);
            this.operations.push({ name: 'set', params: { key, value } });
            this.version++;
            return this.version;
        } finally {
            this.mutex = false;
        }        
    }

    public async erase(key: string){
        await this.acquireLock();
        
        try {
            this.mutex = true;

            if(this.currentMap.has(key)){
                this.currentMap.delete(key);
                this.operations.push({ name: 'delete', params: { key } });
                this.version++;
                return this.version;
            }

            return this.version;
        } finally {
            this.mutex = false;
        }
    }

    public getVersion(){
        return this.version;
    };
}