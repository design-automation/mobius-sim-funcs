import { SIMFuncs } from '../../../index'

import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();

const r_posis = sf.pattern.Rectangle([0, 0, 0],2); 
const hol_posis = sf.pattern.Rectangle([0, 0, 0],1); 

const r_pgon = sf.make.Polygon(r_posis)
const hole = sf.edit.Hole(r_pgon, hol_posis)
const check = sf.query.Get(qEnum._EEntType.PGON, null)

test('Check that editHole has returned a wire', () => {
    //@ts-ignore
    expect(hole).toEqual(['_w1'])
}); 

test('Check that old polygon still exists', () => {
    //@ts-ignore
    expect(check).toEqual(['pg0'])
}); 