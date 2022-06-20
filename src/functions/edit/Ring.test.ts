import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as qEnum from '../query/_enum';
import * as makEnum from '../make/_enum';
import * as Enum from './_enum'

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const check1 = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl)
sf.edit.Ring(pl, Enum._ERingMethod.CLOSE)
const check2 = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl)

test('Check that edges have increased after using ring close', () => {
    //@ts-ignore
    expect(check2.length).toBeGreaterThan(check1.length)
}); 

//TODO reimplement below when ring close is implemented

// test('Check that edges have decreased after using ring close', () => {
//     sf.edit.Ring(pl, Enum._ERingMethod.OPEN)
//     const check3 = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl)
//     //@ts-ignore
//     expect(check2.length).toBeGreaterThan(check3.length)
// }); 