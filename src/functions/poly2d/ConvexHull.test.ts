import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis = sf.pattern.Rectangle([0,0,0],5)
const chull = sf.poly2d.ConvexHull(posis)

test('Check that ConvexHull has made a polygon', () => {
    //@ts-ignore
    expect(chull).toStrictEqual('pg0');
}); 

test('Check for error when inputting one coordinate', () => {
    //@ts-ignore
    expect( () => { sf.poly2d.ConvexHull([0,0,0]); 
    }).toThrow();
});