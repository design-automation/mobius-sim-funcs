import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check Phong setting attribs onto a pgon', () => {
    sf.material.Phong('Phong1', [1,0,0],[0,1,0], 0.9)
    sf.material.Set(pg1, 'Phong1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['Phong1'])
}); 