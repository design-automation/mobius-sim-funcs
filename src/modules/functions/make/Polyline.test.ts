import { SIMFuncs } from '../../../index'

import * as Enum from './_enum'
import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();
const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],
]);

const pline = sf.make.Polyline(posis, Enum._EClose.OPEN);

test('Make one pline', () => {
    expect(pline).toBe('pl0');
}); 

test('Check if pline posis are correct', () => {
    const posis2 = sf.query.Get(qEnum._EEntType.POSI, pline);
    expect(posis2).toEqual(posis);
}); 

test('Check pline edges', () => {
    const posis2 = sf.query.Get(qEnum._EEntType.EDGE, pline);
    expect(posis2).toEqual(['_e0']);
}); 

test('Check pline same posi error', () => {
    expect( () => { sf.make.Polyline(posis[0], posis[0]); 
    }).toThrow();
});
