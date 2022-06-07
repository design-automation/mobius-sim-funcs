import { SIMFuncs } from '../../../index'

import * as eEnum from '../edit/_enum'

const sf = new SIMFuncs();

const r = sf.pattern.Rectangle([0,0,0], 50)

const pg = sf.make.Polygon(r)
const d = sf.edit.Divide(pg, 2, eEnum._EDivisorMethod.BY_NUMBER)
sf.modify.Move('ps2', [50,0,0])

const a1 = sf.calc.Area(pg)

sf.modify.Remesh(pg)

const a2 = sf.calc.Area(pg)

//Below numbers based on 30/5/2022 mobius calculations

test('Check for inital area', () => {
    expect(a1).toEqual(3750);
}); 

test('Check for modified area', () => {
    expect(a2).toEqual(3125);
}); 

