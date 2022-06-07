import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]);
const cl = sf.make.Copy(posis[0], null);

test('Make a Copy with no vector', () => {
    expect(cl).toBe('ps4');
}); 

test('Check if original still exists by making another Copy', () => {
    const cl2 = sf.make.Copy(posis[0], null);
    expect(cl2).toBe('ps5');
}); 

test('Make a Copy with vector', () => {
    const cl3 = sf.make.Copy(posis[2], [0,0,5]);
    expect(cl3).toBe('ps6');
}); 

