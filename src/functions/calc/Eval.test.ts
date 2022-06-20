import { SIMFuncs } from '../../index'

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pl = sf.make.Polyline(posis, makEnum._EClose.CLOSE)

const eval1 = sf.calc.Eval(pl, 0.5)
const eval2 = sf.calc.Eval(pl, 0.75)

test('Check eval of closed pline', () => {
    //@ts-ignore
    expect(eval1).toStrictEqual([10,10,0]);
    //@ts-ignores
    expect(eval2).toStrictEqual([0,10,0]);
}); 