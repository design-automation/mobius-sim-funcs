import { SIMFuncs } from '../../index'

import * as eEnum from '../edit/_enum'


const sf = new SIMFuncs();

const r = sf.pattern.Rectangle([0,0,0], 50)

const pg = sf.make.Polygon(r)
const d = sf.edit.Divide(pg, 2, eEnum._EDivisorMethod.BY_NUMBER)
sf.modify.Move('ps2', [50,0,0])

const a1 = sf.calc.Area(pg)

sf.modify.Remesh(pg)

const a2 = sf.calc.Area(pg)

test('Check if remeshed area is smaller', () => {
    expect(a2).toBeLessThan(a1);
}); 

