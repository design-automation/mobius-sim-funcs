import { SIMFuncs } from '../../index'
import * as qEnum from '../query/_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

const e1 = sf.query.Get(qEnum._ENT_TYPE.EDGE, null)
sf.util.Select(e1)
const check = sf.attrib.Get(e1, '_selected')

test('Check that utilSelect has set _selected attribs on _e', () => {
    //@ts-ignore
    expect(check).toStrictEqual(["selected[0]", "selected[1]", "selected[2]", "selected[3]"]);
}); 
