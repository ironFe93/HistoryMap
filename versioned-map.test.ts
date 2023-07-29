import { VersionedMap } from './versioned-map';

describe('VersionedMap', function(){

    it('should initialize a versioned map', function(){
        const vmap = new VersionedMap();
        expect(vmap.getVersion()).toEqual(0);
    });

    it('should put an element into the versioned map and increase version number', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        expect(vmap.getVersion()).toEqual(1);
    });

    it('should get an element from the versioned map', function(){
        const vmap = new VersionedMap();
        vmap.put('A', 'Chris');
        expect(vmap.getVersion()).toEqual(1);
    });
})
