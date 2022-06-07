import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const posis = sf.pattern.Rectangle([0,0,0],5)
// const dela = sf.poly2d.Delaunay(posis)
// 
//TODO check cases when delaunay is implemented

// test('Check that Delaunay has made a polygon', () => {
//     //@ts-ignore
//     expect(dela).toStrictEqual('pg0');
// }); 

test('Check for error when inputting one coordinate', () => {
    //@ts-ignore
    expect( () => { sf.poly2d.Delaunay([0,0,0]); 
    }).toThrow();
});