import { SIMFuncs } from '../../../index'

import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 

const f1 = sf.query.Filter(posis, 'xyz', Enum._EFilterOperator.IS_EQUAL, [0,0,0])

test('Check queryFilter is equal with posi xyz', () => {
    //@ts-ignore
    expect(f1).toStrictEqual(['ps0']);
}); 