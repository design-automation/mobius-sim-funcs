import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Linear(
    [[0, 0, 0], [0, 0, 10]], 
    Enum._EClose.OPEN,
    3
)

test('Check number of posis from Linear, 2 coordinates, open', () => {
    //@ts-ignore
    expect(posis1).toStrictEqual(['ps0', 'ps1', 'ps2']);
}); 

const posis2 = sf.pattern.Linear(
    [[0, 0, 0], [0, 0, 10], [10, 10, 15]], 
    Enum._EClose.CLOSE,
    3
)

test('Check number of posis from Linear, 3 coordinates, closed', () => {
    //@ts-ignore
    expect(posis2).toStrictEqual(['ps3', 'ps4', 'ps5', 'ps6', 'ps7', 'ps8']);
}); 


test('Check for wrong args error', () => {
    //@ts-ignore
    expect( () => {sf.pattern.Linear([0,0,0],Enum._ECurveCatRomType.CENTRIPETAL,2)
    }).toThrow();
});

