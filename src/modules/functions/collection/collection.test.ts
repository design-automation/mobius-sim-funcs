import { SIMFuncs } from '../../../index'

import * as makEnum from '../make/_enum';
import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();

const check1 = sf.query.Get(qEnum._EEntType.COLL, null)
const col1 = sf.collection.Create(null, "Collect1")
const check2 = sf.query.Get(qEnum._EEntType.COLL, null)

test('Check col creation', () => {
    //@ts-ignore
    expect(check1).not.toStrictEqual(check2);
}); 

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.CLOSE)

test('Check that entities can be added and removed from col without error', () => {
    expect( () => { 
        sf.collection.Add(col1, pl) 
        sf.collection.Remove(col1, pl) 
    }).not.toThrow();
});

test('Check col get', () => {
    //@ts-ignore
    expect(sf.collection.Get("Collect1")).toStrictEqual('co0');
}); 

test('Check col deletion', () => {
    sf.collection.Delete(col1)
    const check_del = sf.query.Get(qEnum._EEntType.COLL, null)
    //@ts-ignore
    expect(check_del).toStrictEqual([]);
}); 


