import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as makEnum from '../make/_enum';

const sf = new SIMFuncs();
const inl = new InlineClass();

const posis = sf.pattern.Arc([0,0,0],5,5,inl.constants.PI)

test('Check that arc has created correct number of posis', () => {
    //@ts-ignore
    expect(posis).toStrictEqual(['ps0', 'ps1', 'ps2', 'ps3', 'ps4']);
}); 

test('Check that a line can be made with the posis', () => {
    expect( () => { sf.make.Polyline(posis, makEnum._EClose.OPEN); 
    }).not.toThrow();
});

