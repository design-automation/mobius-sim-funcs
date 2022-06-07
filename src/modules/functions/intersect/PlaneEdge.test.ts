import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import { TPlane } from '@design-automation/mobius-sim';

const sf = new SIMFuncs();
const inl = new InlineClass();

const pln1 = inl.plane.plnMake([0,0,0], [0,0,1], [0,1,0])
const posis1 = sf.pattern.Rectangle([0,0,0], 4)
const pgon1 = sf.make.Polygon(posis1)

const check = sf.intersect.PlaneEdge(pln1 as TPlane, pgon1)

test('Check PlaneEdge intersection with polygon', () => {
    //@ts-ignore
    expect(check).toEqual([
        [0, -2, 0],
        [0, 2, 0]
    ])
}); 

const pln2 = inl.plane.plnMake([10, 10, 0], [0, 0, 1], [0, 1, 0])
const check_no_isect = sf.intersect.PlaneEdge(pln2 as TPlane, pgon1)

test('Check PlaneEdge no intersection with polygon (empty list)', () => {
    //@ts-ignore
    expect(check_no_isect).toEqual([])
}); 