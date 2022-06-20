import { SIMFuncs } from '../../index'

import * as Enum from './_enum'

const sf = new SIMFuncs();

const rect1 = sf.pattern.Rectangle([0,0,0], 5)
const rect2 = sf.pattern.Rectangle([0,0,0], 1)

const rectpl = sf.make.Polyline(rect1, Enum._EClose.CLOSE)
const rectpgon = sf.make.Polygon(rect2)

const sweep1 = sf.make.Sweep(rectpl, rectpgon, 1, Enum._EExtrudeMethod.RIBS)
const sweep2 = sf.make.Sweep(rectpgon, rectpl, 1, Enum._EExtrudeMethod.RIBS)
const sweep3 = sf.make.Sweep(rectpl, rectpgon, 1, Enum._EExtrudeMethod.QUADS)

//TODO: Update examples for sweep when sweep is fixed/updated

test('Make a sweep with pl as base, pgon as xsect and ribs', () => {
    //@ts-ignore
    expect(sweep1).toStrictEqual(['pl1', 'pl2', 'pl3', 'pl4']);
}); 

test('Make a sweep with pg as base, pl as xsect and ribs', () => {
    //@ts-ignore
    expect(sweep2).toStrictEqual(['pl5', 'pl6', 'pl7', 'pl8']);
}); 

test('Make a sweep with pl as base, pg as xsect and quad', () => {
    //@ts-ignore
    expect(sweep3).toStrictEqual(['pg1', 'pg2', 'pg3', 'pg4', 'pg5', 'pg6', 'pg7', 'pg8', 'pg9', 'pg10', 'pg11', 'pg12', 'pg13', 'pg14', 'pg15', 'pg16']);
}); 

