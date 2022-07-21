import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as makEnum from '../make/_enum';
import { TPlane } from '../../mobius_sim';

const sf = new SIMFuncs();
const inl = new InlineFuncs();

const posis = sf.pattern.Line([0,0,0],5,5,)

test('Check that Line from coordinate has created correct number of posis', () => {
    //@ts-ignore
    expect(posis).toStrictEqual(['ps0', 'ps1', 'ps2', 'ps3', 'ps4']);
}); 

test('Check that a line can be made with the posis', () => {
    expect( () => { sf.make.Polyline(posis, makEnum._EClose.OPEN); 
    }).not.toThrow();
});

const pln1 = inl.plnMake([0,0,0],[1,0,0],[0,1,0])
const posis2 = sf.pattern.Line(pln1 as TPlane,5,5,)

test('Check that Line from plane has created correct number of posis', () => {
    //@ts-ignore
    expect(posis2).toStrictEqual(['ps5', 'ps6', 'ps7', 'ps8', 'ps9']);
}); 
