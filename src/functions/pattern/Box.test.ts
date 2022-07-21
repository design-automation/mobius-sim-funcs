import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 
import * as Enum from './_enum'

const sf = new SIMFuncs();
const inl = new InlineFuncs();

test('Check box flat', () => {
    const box1 = sf.pattern.Box(inl.XY, [10,20,30], [2,3,2], Enum._EBoxMethod.FLAT)
    //@ts-ignore
    expect(box1).toStrictEqual(["ps0", "ps1", "ps2", "ps3", "ps4", "ps5", "ps6", "ps7", "ps8", "ps9", "ps10", "ps11"]);
}); 



test('Check box columns', () => {
    const box2 = sf.pattern.Box(inl.XY, [10,20,30], [2,3,2], Enum._EBoxMethod.COLUMNS)
    //@ts-ignore
    expect(box2).toStrictEqual([
        ["ps12", "ps14", "ps16", "ps18", "ps20", "ps22"],
        ["ps13", "ps15", "ps17", "ps19", "ps21", "ps23"]
    ]);
}); 

test('Check box rows', () => {
    const box3 = sf.pattern.Box(inl.XY, [10,20,30], [2,3,2], Enum._EBoxMethod.ROWS)
    //@ts-ignore
    expect(box3).toStrictEqual([
        ["ps24", "ps25", "ps30", "ps31"],
        ["ps26", "ps27", "ps32", "ps33"],   
        ["ps28", "ps29", "ps34", "ps35"]
    ]);
}); 

test('Check box layers', () => {
    const box4 = sf.pattern.Box(inl.XY, [10,20,30], [2,3,2], Enum._EBoxMethod.LAYERS)
    //@ts-ignore
    expect(box4).toStrictEqual([
        ["ps36", "ps37", "ps38", "ps39", "ps40", "ps41"],
        ["ps42", "ps43", "ps44", "ps45", "ps46", "ps47"]
    ]);
}); 

test('Check box quads', () => {
    const box5 = sf.pattern.Box(inl.XY, [10,20,30], [2,3,2], Enum._EBoxMethod.QUADS)
    //@ts-ignore
    expect(box5).toStrictEqual([
        ["ps48", "ps50", "ps51", "ps49"],
        ["ps50", "ps52", "ps53", "ps51"],        
        ["ps48", "ps49", "ps55", "ps54"],        
        ["ps49", "ps51", "ps57", "ps55"],        
        ["ps51", "ps53", "ps59", "ps57"],       
        ["ps53", "ps52", "ps58", "ps59"],        
        ["ps52", "ps50", "ps56", "ps58"],        
        ["ps50", "ps48", "ps54", "ps56"],       
        ["ps54", "ps55", "ps57", "ps56"],       
        ["ps56", "ps57", "ps59", "ps58"]
    ]);
}); 


