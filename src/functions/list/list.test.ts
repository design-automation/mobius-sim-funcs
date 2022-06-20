import { SIMFuncs } from '../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const lst1 = []
sf.list.Add(lst1, 5, Enum._EAddMethod.TO_END)
sf.list.Add(lst1, 2, Enum._EAddMethod.TO_START)

test('Check listAdd start and end', () => {
    //@ts-ignore
    expect(lst1).toEqual([2, 5])
}); 

test('Check listRemove index', () => {
    sf.list.Remove(lst1, 1, Enum._ERemoveMethod.REMOVE_INDEX)
    //@ts-ignore
    expect(lst1).toEqual([2])
}); 

const lst2 = [10, 20, 30, 40, 50]

test('Check listSplice', () => {
    sf.list.Splice(lst2, 1, 3, [2.2, 3.3])
    //@ts-ignore
    expect(lst2).toEqual([10, 2.2, 3.3, 50])
}); 

const lst3 = [10, 20, 30, 40, 50]

test('Check listSort reverse', () => {
    sf.list.Sort(lst3, Enum._ESortMethod.REV)
    //@ts-ignore
    expect(lst3).toEqual([50,40,30,20,10])
}); 

const lst4 = [10, 20, 30, 40, 50]

test('Check listReplace index', () => {
    sf.list.Replace(lst4, 30, 90, Enum._EReplaceMethod.REPLACE_FIRST_VALUE)
    //@ts-ignore
    expect(lst4).toEqual([10, 20, 90, 40, 50])
}); 