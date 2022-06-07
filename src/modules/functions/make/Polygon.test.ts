import { SIMFuncs } from '../../../index'

import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();
const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]);
const pgon = sf.make.Polygon(posis);

test('Make one pgon', () => {
    expect(pgon).toBe('pg0');
}); 

test('Check if pgon posis are correct', () => {
    const posis2 = sf.query.Get(qEnum._EEntType.POSI, pgon);
    expect(posis2).toEqual(posis);
}); 

test('Check pgon edges', () => {
    const posis2 = sf.query.Get(qEnum._EEntType.EDGE, pgon);
    expect(posis2).toEqual(['_e0', '_e1', '_e2', '_e3']);
}); 

test('Check pgon 2 inputs error', () => {
    expect( () => { sf.make.Polygon([posis[0], posis[1]]); 
    }).toThrow();
});

