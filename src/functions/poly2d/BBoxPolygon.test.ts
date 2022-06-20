import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as Enum from './_enum';

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.pattern.Arc([0,0,0],5,5,inl.constants.PI)
const bbox1 = sf.poly2d.BBoxPolygon(posis, Enum._EBBoxMethod.AABB)
const bbox2 = sf.poly2d.BBoxPolygon(posis, Enum._EBBoxMethod.OBB)

test('Test that AABB 2D BBox was created', () => {
    //@ts-ignore
    expect(bbox1).toStrictEqual('pg0');
}); 

test('Test that OBB 2D BBox was created', () => {
    //@ts-ignore
    expect(bbox2).toStrictEqual('pg1');
}); 