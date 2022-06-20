import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check Standard setting attribs onto a pgon', () => {
    sf.material.Standard('Standard1', [1,0,0], 0.5, 0.2)
    sf.material.Set(pg1, 'Standard1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['Standard1'])
}); 