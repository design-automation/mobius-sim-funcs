import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.pattern.Rectangle([0,0,0],5)
const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const OffCham = sf.poly2d.OffsetRound(pl, 2, 2, Enum._EOffsetRound.ROUND_END)

test('Check that OffsetRound has created polygons with RoundEnd', () => {
    //@ts-ignore
    expect(OffCham).toStrictEqual(['pg0']);
}); 

test('Check for posis input error', () => {
    expect( () => { sf.poly2d.OffsetRound(posis, 2, 2,Enum._EOffsetRound.ROUND_END); 
    }).toThrow();
});

