import { SIMFuncs } from '../../../index'

import * as Enum from './_enum';

const sf = new SIMFuncs();

const posis1 = sf.make.Position([
    [0, 0, 0]
]); 

const posis2 = sf.make.Position([
    [0,0,10],[0,0,20]
]); 

const dist1 = sf.calc.Distance(posis1, posis2, Enum._EDistanceMethod.PS_PS_DISTANCE)

test('Calculate centroid of 4 posis', () => {
    //@ts-ignore
    expect(dist1).toStrictEqual([10]);
}); 