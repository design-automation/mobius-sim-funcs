import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis = sf.pattern.Interpolate(
    [[0,0,0],[10,0,50],[20,0,0]], 
    Enum._ECurveCatRomType.CATMULLROM,
    0.3, 
    Enum._EClose.CLOSE, 
    5
)

test('Check that Interpolate has created correct number of posis', () => {
    //@ts-ignore
    expect(posis).toStrictEqual(['ps0', 'ps1', 'ps2', 'ps3', 'ps4']);
}); 

test('Check for wrong args error', () => {
    //@ts-ignore
    expect( () => {sf.pattern.Interpolate([0,0,0],Enum._ECurveCatRomType.CENTRIPETAL,5,Enum._EClose.CLOSE,5)
    }).toThrow();
});

