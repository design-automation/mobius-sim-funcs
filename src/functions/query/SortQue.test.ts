import { SIMFuncs } from '../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis = sf.make.Position([[0, 2, 30], [10, 1, 0], [10, 4, 0], [0, 0, 0]]); 

const check = sf.query.Sort(posis, 'xyz', Enum._ESortMethod.DESCENDING)

test('Check querySort with Descending xyz values on posis', () => {
    //@ts-ignore
    expect(check).toStrictEqual( ["ps2", "ps1", "ps0", "ps3"]);
});
