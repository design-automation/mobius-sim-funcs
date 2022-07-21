import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

const sf = new SIMFuncs();
const inl = new InlineFuncs();

test('Check Rectangle, coord origin and int size', () => {
    const Rectangle1 = sf.pattern.Rectangle([0,0,0], 10)
    //@ts-ignore
    expect(Rectangle1).toStrictEqual(["ps0", "ps1", "ps2", "ps3"]);
}); 

test('Check Rectangle, pln origin and list size', () => {
    const Rectangle2 = sf.pattern.Rectangle(inl.XY, [10,20])
    //@ts-ignore
    expect(Rectangle2).toStrictEqual(["ps4", "ps5", "ps6", "ps7"]);
}); 


