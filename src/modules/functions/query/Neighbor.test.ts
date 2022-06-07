import { SIMFuncs } from '../../../index'

import * as Enum from './_enum'
import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pl1 = sf.make.Polyline(posis1, makEnum._EClose.CLOSE)
//Make a polyline that shares the same vertex as the first
const pl2 = sf.make.Polyline([posis1[1],posis1[3]], makEnum._EClose.OPEN)

const neigh = sf.query.Neighbor(Enum._EEntType.EDGE,pl1)

test('Check neighbor with edges and plines', () => {
    //@ts-ignore
    expect(neigh).toStrictEqual(
        ["_e4"]
    );
}); 
