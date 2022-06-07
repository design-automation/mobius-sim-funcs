import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as Enum from './_enum'
import { TPlane } from '@design-automation/mobius-sim';

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 

const pl = sf.make.Polyline(posis, Enum._EClose.CLOSE)
const pg = sf.make.Polygon(posis)
const pln = inl.plane.plnMake([5,5,0], [0,0,1], [5,5,10])

const cut1 = sf.make.Cut(pl, pln as TPlane, Enum._ECutMethod.KEEP_BOTH)
const cut2 = sf.make.Cut(pg, pln as TPlane, Enum._ECutMethod.KEEP_BELOW)

test('Make a Cut with pl and keep_both', () => {
    //@ts-ignore
    expect(cut1).toStrictEqual([['pl1'], ['pl2']]);
}); 

test('Check if original still exists by making another Copy', () => {
    //@ts-ignore
    expect(cut2).toStrictEqual(['pg1']);
}); 