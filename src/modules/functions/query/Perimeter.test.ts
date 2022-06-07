import { SIMFuncs } from '../../../index'

import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)


test('Check Perimeter with edges of pgon', () => {
    const peri1 = sf.query.Perimeter(Enum._EEntType.EDGE, pgon1)
    //@ts-ignore
    expect(peri1).toStrictEqual(['_e0', '_e1', '_e2', '_e3']);
}); 