import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const posis2 = sf.pattern.Rectangle([2.5,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)
const pgon2= sf.make.Polygon(posis2)

const union1 = sf.poly2d.Union([pgon1, pgon2])

test('Check Union has created new pgon from 2 pgons', () => {
    //@ts-ignore
    expect(union1).toStrictEqual(['pg2']);
}); 


//TODO: check types
// test('Check that non-pgon input throws an error', () => {
//     expect( () => { sf.poly2d.Union([posis1, pgon2]); 
//     }).toThrow();
// });
