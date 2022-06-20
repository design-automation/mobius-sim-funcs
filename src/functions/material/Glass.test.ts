import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check Glass setting attribs onto a pgon', () => {
    sf.material.Glass('glass1',0.8)
    sf.material.Set(pg1, 'glass1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['glass1'])
}); 