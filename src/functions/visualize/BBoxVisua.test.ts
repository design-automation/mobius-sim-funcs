import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as maEnum from '../make/_enum'
import * as qEnum from '../query/_enum'
import { TRay } from '../../mobius_sim';

const sf = new SIMFuncs();
const inl = new InlineFuncs();

const ps = sf.pattern.Arc([0,0,0], 10, 50, inl.PI)
const pl = sf.make.Polyline(ps, maEnum._EClose.OPEN)

//creating a circle of plines

for (let i = 1; i < 8; i++) {
    const ang = (i * (2 * inl.PI)) / 8;
    const rot1 = sf.make.Copy(pl, null);
    //@ts-ignore
    const ray = inl.rayMake([0,0,0], [1,0,0])
    sf.modify.Rotate(rot1, ray as TRay, ang)
}

const all_pl = sf.query.Get(qEnum._ENT_TYPE.PLINE, null)
const bbox1 = sf.calc.BBox(all_pl)
const bbox_v = sf.visualize.BBox(bbox1)

test('Test if bbox around plines can be visualized', () => {
    expect(bbox_v).toEqual(
        ['pl8', 'pl9', 'pl10', 'pl11', 'pl12', 'pl13', 'pl14', 'pl15', 'pl16', 'pl17', 'pl18', 'pl19']
    );
}); 