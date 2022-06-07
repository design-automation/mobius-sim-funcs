import { SIMFuncs } from '../../../index'

import * as Enum from './_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pgon = sf.make.Polygon(posis)

const cent1 = sf.calc.Centroid(posis, Enum._ECentroidMethod.PS_AVERAGE)
const cent2 = sf.calc.Centroid(pgon, Enum._ECentroidMethod.CENTER_OF_MASS)

test('Calculate centroid of 4 posis', () => {
    //@ts-ignore
    expect(cent1).toStrictEqual([5,5,0]);
}); 

test('Calculate centroid of a pgon', () => {
    //@ts-ignore
    expect(cent2).toStrictEqual([5,5,0]);
}); 