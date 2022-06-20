import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check Lambert setting attribs onto a pgon', () => {
    sf.material.Lambert('Lambert1', [1,0,0])
    sf.material.Set(pg1, 'Lambert1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['Lambert1'])
}); 