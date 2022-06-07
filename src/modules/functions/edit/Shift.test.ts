import { SIMFuncs } from '../../../index'

import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();

const r_posis = sf.pattern.Rectangle([0, 0, 0],2); 

const r_pgon = sf.make.Polygon(r_posis);
const check1 = sf.query.Get(qEnum._EEntType.EDGE, null);
sf.edit.Shift(r_pgon, 2);
const check2 = sf.query.Get(qEnum._EEntType.EDGE, null);

test('Check that shift has shifted edges', () => {
    //@ts-ignore
    expect(check2).not.toEqual(check1)
}); 
