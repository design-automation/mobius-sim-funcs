import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const polydron1 = sf.pattern.Polyhedron([0,0,0],3,0,Enum._EPolyhedronMethod.FACE_TETRA)

test('Check posis from Polyhedron, 3 coordinates, degree 0, face tetra', () => {
    //@ts-ignore
    expect(polydron1).toStrictEqual([
        ["ps2", "ps1", "ps0"],
        ["ps0", "ps3", "ps2"],
        ["ps1", "ps3", "ps0"],
        ["ps2", "ps3", "ps1"]
    ]);
}); 

const polydron2 = sf.pattern.Polyhedron([0,0,0],3,0,Enum._EPolyhedronMethod.FLAT_TETRA)

test('Check posis from Polyhedron, 3 coordinates, degree 0, flat tetra', () => {
    //@ts-ignore
    expect(polydron2).toStrictEqual(
        ["ps4", "ps5", "ps6", "ps7"]
    );
}); 

test('Check that the expected amounts of pgons can be made from face polyhedron', () => {
    //@ts-ignore
    expect(sf.make.Polygon(polydron1)).toStrictEqual(
        ["pg0", "pg1", "pg2", "pg3"]
    );
}); 