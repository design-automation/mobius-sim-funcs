import { SIMFuncs } from '../../index'

import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const posis2 = sf.pattern.Rectangle([0,0,0], 5)

const check1 = sf.query.Invert(Enum._ENT_TYPE.POSI, posis1)
const check2 = sf.query.Get(Enum._ENT_TYPE.POSI, posis2)

test('Check queryInvert with posis', () => {
    //@ts-ignore
    expect(check1).toStrictEqual(check2);
}); 