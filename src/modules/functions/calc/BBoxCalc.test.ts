import { SIMFuncs } from '../../../index'
import { InlineFuncs } from '@design-automation/mobius-inline-funcs'

import * as maEnum from '../make/_enum'
import * as qEnum from '../query/_enum'
import { TRay } from '@design-automation/mobius-sim';

const sf = new SIMFuncs();
const inl = new InlineFuncs();

const ps = sf.pattern.Arc([0,0,0], 10, 50, inl.PI)
const pl = sf.make.Polyline(ps, maEnum._EClose.OPEN)

//creating a circle of plines

for (let i = 0; i < 8; i++) {
    const ang = (i * (2 * inl.PI)) / 8;
    const rot1 = sf.make.Copy(pl, null);
    //@ts-ignore
    const ray = inl.rayMake([0,0,0], [1,0,0])
    sf.modify.Rotate(rot1, ray as TRay, ang)
}

const all_pl = sf.query.Get(qEnum._EEntType.PLINE, null)
const bbox = sf.calc.BBox(all_pl)

test('Test if bbox around plines can be created', () => {
    expect(bbox).toEqual([
        [0, 0, 0],
        [-10, -9.994862162006878, -9.994862162006878],
        [10, 9.994862162006878, 9.994862162006878],
        [20, 19.989724324013757, 19.989724324013757]
    ]);
}); 
