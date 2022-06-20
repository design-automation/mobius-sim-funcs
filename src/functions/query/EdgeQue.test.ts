import { SIMFuncs } from '../../index'

import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)

const e1 = sf.query.Get(Enum._ENT_TYPE.EDGE, pl1)
const prevnext = sf.query.Edge(e1, Enum._EEdgeMethod.PREV_NEXT)

test('Check queryEdge previous and next with a rectangle polyline', () => {
    //@ts-ignore
    expect(prevnext).toStrictEqual([
        ["_e0", "_e1"],
        ["_e1", "_e2"],
        ["_e2", "_e3"],
        ["_e3", "_e0"]
    ]);
}); 