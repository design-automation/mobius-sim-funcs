import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const pg = sf.make.Polygon(posis)

const ray1 = sf.calc.Ray(pl)
const ray2 = sf.calc.Ray(pg)

test('Check ray from pline with 3 edges', () => {
    //@ts-ignore
    expect(ray1).toStrictEqual([
        [[0,0,0],[10,0,0]],
        [[10,0,0],[0,10,0]],
        [[10,10,0],[-10,0,0]]
    ]);
}); 

test('Check ray from pgon', () => {
    //@ts-ignore
    expect(ray2).toStrictEqual([
        [5,5,0],[0,0,1]
    ]);
}); 