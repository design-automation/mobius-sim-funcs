import { SIMFuncs } from '../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

//should make test cases for other data types and not just posis

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[0,10,0],[10,10,0]
]); 
const pgons = sf.make.Polygon(posis)

sf.attrib.Add(Enum._ENT_TYPEAndMod.POSI, Enum._EDataType.STRING, 'TestAttr')
sf.attrib.Set(posis, 'TestAttr', 'yes', Enum._ESet.ONE_VALUE)

const attr_check = sf.attrib.Get(posis, 'TestAttr')

test('Add, set and get string attribs with posis', () => {
    //@ts-ignore
    expect(attr_check).toStrictEqual(['yes','yes','yes','yes']);
}); 

sf.attrib.Rename(Enum._ENT_TYPEAndMod.POSI, 'TestAttr', 'NewAttr')
const attr_check2 = sf.attrib.Discover(Enum._ENT_TYPEAndMod.POSI)

test('Rename and discover attribs on posis', () => {
    //@ts-ignore
    expect(attr_check2).toStrictEqual([{'name': 'NewAttr', 'type': 'string'}]);
}); 

const value_check = sf.attrib.Values(Enum._ENT_TYPEAndMod.POSI, 'NewAttr')

test('Get unique values from attribs on posis', () => {
    //@ts-ignore
    expect(value_check).toStrictEqual(['yes']);
}); 

sf.attrib.Delete(Enum._ENT_TYPEAndMod.POSI, 'NewAttr')
const attr_check3 = sf.attrib.Discover(Enum._ENT_TYPEAndMod.POSI)

test('Delete attribs on posis', () => {
    //@ts-ignore
    expect(attr_check3).toStrictEqual([]);
}); 

sf.attrib.Push(posis, ["xyz", 2, "height"], Enum._EAttribPushTarget.PGON, Enum._EPushMethodSel.FIRST)
const attr_check4 = sf.attrib.Discover(Enum._ENT_TYPEAndMod.PGON)

test('Push attribs from posis onto pgons', () => {
    //@ts-ignore
    expect(attr_check4).toStrictEqual([{'name':'height', 'type': 'number'}]);
}); 