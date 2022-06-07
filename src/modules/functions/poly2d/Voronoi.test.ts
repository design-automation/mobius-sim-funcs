import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const posis2 = sf.pattern.Rectangle([0,0,0], 20)
const pgon1 = sf.make.Polygon(posis2)
const vnoi = sf.poly2d.Voronoi(pgon1, posis1)

test('Check Voronoi with one pgon and 4 posis creates 4 new pgons', () => {
    //@ts-ignore
    expect(vnoi).toStrictEqual(['pg1', 'pg2', 'pg3', 'pg4']);
}); 