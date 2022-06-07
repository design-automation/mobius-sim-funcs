import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as Enum from './_enum'
import * as qEnum from '../query/_enum'

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.make.Position(
    [[0, 0, 0], [10, 0, 0], [0,10,0], [10,10,0]]
);

const check1 = sf.query.Get(qEnum._EEntType.POSI, null)
sf.edit.Delete(posis[1], Enum._EDeleteMethod.DELETE_SELECTED)
const check2 = sf.query.Get(qEnum._EEntType.POSI, null)

test('Check that posi has been deleted', () => {
    //@ts-ignore
    expect(check1).not.toBe(check2);
}); 

sf.edit.Delete(posis[0], Enum._EDeleteMethod.KEEP_SELECTED)
const check3 = sf.query.Get(qEnum._EEntType.POSI, null)

test('Check that only one posi has been kept', () => {
    //@ts-ignore
    expect(check3).not.toEqual('ps0');
}); 