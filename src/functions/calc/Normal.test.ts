import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();
const inl = new InlineFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.CLOSE)
const pg = sf.make.Polygon(posis)

const Norm1 = sf.calc.Normal(pl, 1)

test('Check normal of pline', () => {
    //@ts-ignore
    expect(Norm1).toStrictEqual([0,0,1]);
}); 

sf.modify.Rotate(pg, inl.YZ, inl.PI)
const Norm2 = sf.calc.Normal(pg, 1)

test('Check normal of rotated pgon', () => {
    //@ts-ignore
    expect(Norm2[2]).toStrictEqual(-1);
}); 