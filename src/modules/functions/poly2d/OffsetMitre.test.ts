import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis = sf.pattern.Rectangle([0,0,0],5)
const pl = sf.make.Polyline(posis, makEnum._EClose.OPEN)
const OffCham = sf.poly2d.OffsetMitre(pl, 2, 2, Enum._EOffset.SQUARE_END)

test('Check that OffsetMitre has created polygons with SquareEnd', () => {
    //@ts-ignore
    expect(OffCham).toStrictEqual(['pg0']);
}); 

test('Check for posis input error', () => {
    expect( () => { sf.poly2d.OffsetMitre(posis, 2, 2,Enum._EOffset.BUTT_END); 
    }).toThrow();
});

