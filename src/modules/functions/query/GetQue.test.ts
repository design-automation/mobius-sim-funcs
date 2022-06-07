import { SIMFuncs } from '../../../index'

import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)

const v1 = sf.query.Get(Enum._EEntType.VERT, null)

test('Check queryGet with polylines and vertices', () => {
    //@ts-ignore
    expect(v1).toStrictEqual(['_v0', '_v1', '_v2', '_v3']);
}); 