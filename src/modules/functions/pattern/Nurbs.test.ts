import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Nurbs(
    [[0, 0, 0], [0, 0, 10], [10,0,0]], 
    2,
    Enum._EClose.OPEN,
    4
)

test('Check number of posis from Nurbs, 3 coordinates, degree 2, open', () => {
    //@ts-ignore
    expect(posis1).toStrictEqual(['ps0', 'ps1', 'ps2', 'ps3',]);
}); 

const posis2 = sf.pattern.Nurbs(
    [[0, 0, 0], [0, 0, 10], [10,0,0], [10,10,0]], 
    3,
    Enum._EClose.CLOSE,
    4
)

test('Check number of posis from Nurbs, 4 coordinates, degree 3, closed', () => {
    //@ts-ignore
    expect(posis2).toStrictEqual(['ps4', 'ps5', 'ps6', 'ps7']);
}); 


test('Check for wrong args (non-list of coords) error', () => {
    //@ts-ignore
    expect( () => {sf.pattern.Nurbs([0,0,0],3,Enum._EClose.OPEN,5)
    }).toThrow();
});

