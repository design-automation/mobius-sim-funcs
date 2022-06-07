import { SIMFuncs } from '../../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check Physical setting attribs onto a pgon', () => {
    sf.material.Physical('Physical1', [1,0,0], 0.5, 0.2, 0.5)
    sf.material.Set(pg1, 'Physical1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['Physical1'])
}); 