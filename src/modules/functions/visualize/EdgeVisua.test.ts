import { SIMFuncs } from '../../../index'
import * as qEnum from '../query/_enum'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

sf.visualize.Edge(pgon1, Enum._EEdgeMethod.HIDDEN)
const e1 = sf.query.Get(qEnum._EEntType.EDGE, null)
const check = sf.attrib.Get(e1, 'visibility')

test('Check that visualizeEdge has set visibility attribs on _e', () => {
    //@ts-ignore
    expect(check).toStrictEqual(["hidden", "hidden", "hidden", "hidden"]);
}); 

