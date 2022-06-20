import { SIMFuncs } from '../../index'
import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([[0, 2, 30], [10, 1, 0], [10, 4, 0], [0, 0, 0]]); 
const pl1 = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const pl2 = sf.make.Polyline([posis[1], posis[2]], makEnum._EClose.OPEN)

const check = sf.query.Type([pl1, pl2, posis[0]], Enum._ETypeQueryEnum.IS_PLINE)

test('Check queryType with a list of posis and pl', () => {
    //@ts-ignore
    expect(check).toStrictEqual( [true, true, false]);
});
