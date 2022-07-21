import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const pg = sf.make.Polygon(posis)

const Vec1 = sf.calc.Vector(pl)
const Vec2 = sf.calc.Vector(pg)

test('Check Vec from pline with 3 edges', () => {
    //@ts-ignore
    expect(Vec1).toStrictEqual([
        [10,0,0],
        [0,10,0],
        [-10,0,0]
    ]);
}); 

test('Check Vec from pgon with 4 edges', () => {
    //@ts-ignore
    expect(Vec2).toStrictEqual([
        [10,0,0],
        [0,10,0],
        [-10,0,0],
        [0,-10,0]
    ]);
}); 