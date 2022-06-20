import { SIMFuncs } from '../../index'

import * as qEnum from '../query/_enum';
import * as makEnum from '../make/_enum';
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0]
]); 

const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const check1 = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl)
const check2 = sf.edit.Divide(pl,5,Enum._EDivisorMethod.BY_NUMBER)

test('Check that edges have increased after dividing pline by number', () => {
    //@ts-ignore
    expect(check2.length).toBeGreaterThan(check1.length)
    //@ts-ignore
    expect(check2).toStrictEqual(['_e0', '_e1', '_e2', '_e3', '_e4']);
}); 