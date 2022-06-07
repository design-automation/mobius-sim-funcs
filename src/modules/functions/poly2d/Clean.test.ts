import { SIMFuncs } from '../../../index'

import * as makEnum from '../make/_enum';
import * as qEnum from '../query/_enum'

const sf = new SIMFuncs();

const posis1 = sf.make.Position(
    [[0, 1, 0], [1, 0, 0], [4,0,0], [10,0,0]], 
)

const pl1 = sf.make.Polyline(posis1, makEnum._EClose.OPEN)

const v1 = sf.query.Get(qEnum._EEntType.VERT, pl1)
const check = sf.poly2d.Clean(pl1, 0.5)
const v2 = sf.query.Get(qEnum._EEntType.VERT, check)

test('Check Clean with a polyline and 0.5 tolerance', () => {
    //@ts-ignore
    expect(v2.length).toBeLessThan(v1.length);
}); 

