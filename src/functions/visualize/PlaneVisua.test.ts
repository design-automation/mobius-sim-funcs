import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

const sf = new SIMFuncs();
const inl = new InlineClass();

const plnV = sf.visualize.Plane(inl.constants.XY, 1)

test('Check that visualizePlane has created plane polylines', () => {
    //@ts-ignore
    expect(plnV).toStrictEqual(["pl0", "pl1", "pl2", "pl3"])
}); 
