import { SIMFuncs } from '../../index'

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.CLOSE)
const pg = sf.make.Polygon(posis)

const len1 = sf.calc.Length(pl)
const len2 = sf.calc.Length(pg)

test('Check length of closed pline', () => {
    //@ts-ignore
    expect(len1).toStrictEqual(40);
}); 

test('Check length of pgon (Returns a list)', () => {
    //@ts-ignore
    expect(len2).toStrictEqual([40]);
}); 