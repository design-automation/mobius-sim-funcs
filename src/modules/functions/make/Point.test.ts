import { SIMFuncs } from '../../../index'

import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]);

const pts = sf.make.Point(posis)

test('Make one pt', () => {
    expect(pts[0]).toBe('pt0');
}); 

test('Make 4 pts in an array', () => {
    const pts2 = sf.query.Get(qEnum._EEntType.POINT, pts);
    expect(pts2).toEqual(pts);
}); 

const posis2 = sf.make.Position([[[2, 3, 5]], [[1, 5, 6], [2, 2, 2]]])
const pts3 = sf.make.Point(posis2)

test('Make 3 pts from posis in a nested array', () => {
    expect(pts3).toEqual([['pt4'], [ 'pt5', 'pt6']]);
}); 

//maybe make an error check case, similar to posis
//code below is currently unmodified
// test('Make an existing position with string -> Error', () => {
//     //expect( () => { sf.make.Polygon([posis[0], posis[1]]); 
//     }).toThrow();
// });
