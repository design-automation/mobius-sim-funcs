import { SIMFuncs } from '../../index'

import * as makEnum from '../make/_enum';
import * as qEnum from '../query/_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const posis2 = sf.pattern.Rectangle([2.5,0,0], 5)
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)
const pl2 = sf.make.Polyline(posis2, makEnum._EClose.CLOSE)

const v1 = sf.query.Get(qEnum._ENT_TYPE.VERT, null)
const stitch1 = sf.poly2d.Stitch([pl1, pl2], 2)
const v2 = sf.query.Get(qEnum._ENT_TYPE.VERT, null)

test('Check stitch is list of both plines', () => {
    //@ts-ignore
    expect(stitch1).toStrictEqual(['pl2', 'pl3']);
}); 

test('Check stitch has increased vertexes', () => {
    //@ts-ignore
    expect(v2.length).toBeGreaterThan(v1.length);
}); 
