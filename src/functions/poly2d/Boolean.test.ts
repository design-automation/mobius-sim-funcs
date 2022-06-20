import { SIMFuncs } from '../../index' 

import * as makEnum from '../make/_enum';
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const posis2 = sf.pattern.Rectangle([2.5,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)
const pgon2= sf.make.Polygon(posis2)

const pl1 = sf.make.Polyline(posis1, makEnum._EClose.OPEN)

const bool1 = sf.poly2d.Boolean(pl1, pgon2, Enum._EBooleanMethod.INTERSECT)
const bool2 = sf.poly2d.Boolean(pgon1, pgon2, Enum._EBooleanMethod.DIFFERENCE)

test('Check boolean with pline and pgon', () => {
    //@ts-ignore
    expect(bool1).toStrictEqual(['pl1']);
}); 

test('Check boolean with 2 pgons', () => {
    //@ts-ignore
    expect(bool2).toStrictEqual(['pg2']);
}); 
