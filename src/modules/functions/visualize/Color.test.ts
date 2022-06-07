import { SIMFuncs } from '../../../index'
import * as qEnum from '../query/_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

sf.visualize.Color(pgon1, [1,0,0])
const v1 = sf.query.Get(qEnum._EEntType.VERT, null)
const check = sf.attrib.Get(v1, 'rgb')

test('Check that visualizeColor has set rgb attribs on _v', () => {
    //@ts-ignore
    expect(check).toStrictEqual([
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0]
    ]);
}); 

