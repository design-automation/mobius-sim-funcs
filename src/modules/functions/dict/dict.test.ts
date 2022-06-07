import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const dict1 = {}


test('Check dictAdd with lists', () => {
    sf.dict.Add(dict1, ['key1', 'key2'], [true, 'yes'])
    //@ts-ignore
    expect(dict1).toStrictEqual({'key1': true, 'key2': 'yes'});
}); 

test('Check dictRemove after add', () => {
    sf.dict.Add(dict1, ['key1', 'key2'], [true, 'yes'])
    sf.dict.Remove(dict1, 'key1')
    //@ts-ignore
    expect(dict1).toStrictEqual({'key2': 'yes'});
}); 

test('Check dictReplace after add and remove', () => {
    sf.dict.Add(dict1, ['key1', 'key2'], [true, 'yes'])
    sf.dict.Remove(dict1, 'key1')
    sf.dict.Replace(dict1, 'key2', 'newKey')
    //@ts-ignore
    expect(dict1).toStrictEqual({'newKey': 'yes'});
}); 

