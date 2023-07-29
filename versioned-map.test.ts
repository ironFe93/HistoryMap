import { VersionedMap } from './versioned-map';

describe('VersionedMap', function(){

    it('should initialize a versioned map', function(){
        const vmap = new VersionedMap();
        expect(vmap.getVersion()).toBe(0);
    });

    it('should put an element into the versioned map and return increased version number', function(){
        const vmap = new VersionedMap();
        const version = vmap.put('A', 'Chris');
        expect(version).toBe(1);
    });

    it('should get an element from the versioned map', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        expect(vmap.get('A')).toBe('Chris');
    });

    it('should return null if key is not present in versioned map', function(){
        const vmap = new VersionedMap();
        expect(vmap.get('X')).toBe(null);
    });

    it('should erase an element from the map and increase version number', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        const version = vmap.erase('A');
        expect(vmap.get('A')).toBe(null);
        expect(version).toBe(2);
        
    });

    it('should not increase version number when erasing a nonexistant key', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        const version = vmap.erase('B');
        expect(version).toBe(1)
    });

    it('should be idempotent when erasing the same key numerous times ', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        vmap.erase('A');
        const version = vmap.erase('A');
        expect(version).toBe(2)
    });

    it('should get an element from a previous version of the versioned map', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        vmap.erase('A');
        expect(vmap.get('A', 1)).toBe('Chris');
    });

    it('should return null when getting a non existant key from a previous version of the map', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        vmap.erase('A');
        expect(vmap.get('B', 1)).toBe(null);
    });

    it('should return null when getting any key from a non existant version of the map', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        expect(vmap.get('A', 4)).toBe(null);
    });

})
