import { SIMFuncs } from '../../index'

import * as qEnum from '../query/_enum';
import * as makEnum from '../make/_enum';
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.make.Position([
    [0, 0, 0], [0, 10, 0], [10, 10, 0], [10, 0, 0]
]); 
const posis2 = sf.make.Position([
    [0, 0, 0], [10, 0, 3], [10, 10, 4], [0, 10, 5]
]); 
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)
const pl2 = sf.make.Polyline(posis2, makEnum._EClose.CLOSE)

const check_v1 = sf.query.Get(qEnum._ENT_TYPE.VERT, null);
const check_ps1 = sf.query.Get(qEnum._ENT_TYPE.POSI, null);
//Initial weld
const weld1 = sf.edit.Weld([check_v1[0], check_v1[4]], Enum._EWeldMethod.MAKE_WELD)

const check_v2 = sf.query.Get(qEnum._ENT_TYPE.VERT, null);
const check_ps2 = sf.query.Get(qEnum._ENT_TYPE.POSI, null);
//Breaking weld 
const weld3 = sf.edit.Weld(check_v2, Enum._EWeldMethod.BREAK_WELD)

const check_v3 = sf.query.Get(qEnum._ENT_TYPE.VERT, null);
const check_ps3 = sf.query.Get(qEnum._ENT_TYPE.POSI, null);


test('Check that make weld has removed old posis and made a new one', () => {
    //@ts-ignore
    expect(check_ps1.length).not.toEqual(check_ps2.length)
    //@ts-ignore
    expect(check_ps2).toEqual(['ps1', 'ps2', 'ps3', 'ps5', 'ps6', 'ps7', 'ps8'])
}); 

test('Check that break weld has made a new posi', () => {
    //@ts-ignore
    expect(check_ps3.length).toEqual(check_ps2.length + 1)
}); 