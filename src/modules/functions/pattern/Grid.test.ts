import { SIMFuncs } from '../../../index'
import { InlineFuncs } from '@design-automation/mobius-inline-funcs' 
import * as Enum from './_enum'

const sf = new SIMFuncs();
const inl = new InlineFuncs();

test('Check Grid flat', () => {
    const grid1 = sf.pattern.Grid(inl.XY, [10,20], [2,3], Enum._EGridMethod.FLAT)
    //@ts-ignore
    expect(grid1).toStrictEqual(["ps0", "ps1", "ps2", "ps3", "ps4", "ps5"]);
}); 

test('Check Grid columns', () => {
    const grid2 = sf.pattern.Grid(inl.XY, [10,20], [2,3], Enum._EGridMethod.COLUMNS)
    //@ts-ignore
    expect(grid2).toStrictEqual([
        ["ps6", "ps8", "ps10"],
        ["ps7", "ps9", "ps11"]
    ]);
}); 

test('Check Grid rows', () => {
    const grid3 = sf.pattern.Grid(inl.XY, [10,20], [2,3], Enum._EGridMethod.ROWS)
    //@ts-ignore
    expect(grid3).toStrictEqual([
        ["ps12", "ps13"],
        ["ps14", "ps15"],        
        ["ps16", "ps17"]
    ]);
}); 

test('Check Grid quads', () => {
    const grid4 = sf.pattern.Grid(inl.XY, [10,20], [2,3], Enum._EGridMethod.QUADS)
    //@ts-ignore
    expect(grid4).toStrictEqual([
        ["ps18", "ps19", "ps21", "ps20"],
        ["ps20", "ps21", "ps23", "ps22"]
    ]);
}); 