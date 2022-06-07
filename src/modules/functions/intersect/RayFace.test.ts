import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import { TRay } from '@design-automation/mobius-sim';

const sf = new SIMFuncs();
const inl = new InlineClass();

//@ts-ignore
const ray1 = inl.ray.rayMake([0, -2, -5], [0, 5, 10])

const posis1 = sf.pattern.Rectangle([0,0,0], 4)
const pgon1 = sf.make.Polygon(posis1)

const check = sf.intersect.RayFace(ray1 as TRay, pgon1)

test('Check RayFace intersection with polygon', () => {
    //@ts-ignore
    expect(check).toEqual([
        [0, 0.5, 0]
    ])
}); 

//@ts-ignore
const ray2 = inl.ray.rayMake([20, -2, -5], [0, 5, 10])
const check_no_isect = sf.intersect.RayFace(ray2 as TRay, pgon1)

test('Check RayFace no intersection with polygon (empty list)', () => {
    //@ts-ignore
    expect(check_no_isect).toEqual([])
}); 