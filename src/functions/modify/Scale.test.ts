import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as qEnum from '../query/_enum';
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const posis_cp = sf.make.Copy(posis, null)

const pl = sf.make.Polyline(posis, makEnum._EClose.CLOSE)

const init_e = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl)

sf.modify.Scale(pl, inl.constants.XY, 3);


test('Check if Scaled ps are still the same', () => {
    const posis2 = sf.query.Get(qEnum._ENT_TYPE.EDGE, pl);
    expect(posis2).toEqual(init_e);
}); 

test('Check if ps xyz have been changed', () => {
    const curr_posi_xyz = sf.attrib.Get(sf.query.Get(qEnum._ENT_TYPE.POSI, pl),"xyz")
    expect(curr_posi_xyz).not.toEqual(sf.attrib.Get(posis_cp, "xyz"));
}); 