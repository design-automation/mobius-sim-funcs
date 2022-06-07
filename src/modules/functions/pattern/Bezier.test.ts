import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const posis = sf.pattern.Bezier([[0,0,0], [10,0,50], [20,0,0]], 5)

test('Check that bezier has created correct number of posis', () => {
    //@ts-ignore
    expect(posis).toStrictEqual(['ps0', 'ps1', 'ps2', 'ps3', 'ps4']);
}); 

test('Check for error when only one coordinate is input', () => {
    //@ts-ignore
    expect( () => { sf.pattern.Bezier([0,0,0], 5); 
    }).toThrow();
});

