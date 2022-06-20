import { SIMFuncs } from '../../index'

import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]);
const pgon = sf.make.Polygon(posis);
const pl = sf.make.Polyline(posis, Enum._EClose.CLOSE)

const ext1 = sf.make.Extrude(posis, 4, 1, Enum._EExtrudeMethod.QUADS)
const ext2 = sf.make.Extrude(pl, 3, 1, Enum._EExtrudeMethod.QUADS)
const ext3 = sf.make.Extrude(pgon, 2, 1, Enum._EExtrudeMethod.QUADS)
const ext4 = sf.make.Extrude(pgon, 2, 1, Enum._EExtrudeMethod.RIBS)
const ext5 = sf.make.Extrude(pgon, 2, 1, Enum._EExtrudeMethod.STRINGERS)

test('Extrude ps into pl', () => {
    //@ts-ignore
    expect(ext1).toStrictEqual(['pl1', 'pl2', 'pl3', 'pl4']);
}); 

test('Extrude pl into pg', () => {
    //@ts-ignore
    expect(ext2).toStrictEqual(['pg1', 'pg2', 'pg3', 'pg4']);
}); 

test('Extrude pg with quad', () => {
    //@ts-ignore
    expect(ext3).toStrictEqual(['pg5', 'pg6', 'pg7', 'pg8', 'pg9']);
}); 

test('Extrude pg with ribs', () => {
    //@ts-ignore
    expect(ext4).toStrictEqual(['pl5', 'pl6']);
}); 

test('Extrude pg with stringers', () => {
    //@ts-ignore
    expect(ext5).toStrictEqual(['pl7', 'pl8', 'pl9', 'pl10']);
}); 


