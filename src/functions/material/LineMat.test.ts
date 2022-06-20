import { SIMFuncs } from '../../index'
import * as makEnum from '../make/_enum'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)

test('Check LineMat setting attribs onto a pline', () => {
    sf.material.LineMat('mat1', [1,0,0], 0.5, Enum._Ecolors.VERT_COLORS)
    sf.material.Set(pl1, 'mat1')
    const attribs = sf.attrib.Get(pl1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual('mat1')
}); 