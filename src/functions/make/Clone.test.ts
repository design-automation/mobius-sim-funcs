import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]);
const cl = sf.make.Clone(posis[0]);

test('Make a clone', () => {
    expect(cl).toBe('ps4');
}); 

test('Check if original was deleted by trying to make another clone', () => {
    //@ts-ignore
    expect( () => { sf.make.Clone(posis[0])
    }).toThrow();
}); 

