import { SIMFuncs } from '../../../index'
import { InlineFuncs } from '@design-automation/mobius-inline-funcs' 

const sf = new SIMFuncs();
const inl = new InlineFuncs();

const ray1 = inl.rayMake([0,0,0], [1,0,0], 1)
const rayV = sf.visualize.Ray(ray1, 1)

test('Check that visualizeRay has created ray polylines', () => {
    //@ts-ignore
    expect(rayV).toStrictEqual(["pl0", "pl1", "pl2"])
}); 
