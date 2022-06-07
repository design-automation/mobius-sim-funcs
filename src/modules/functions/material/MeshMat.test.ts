import { SIMFuncs } from '../../../index'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pg1 = sf.make.Polygon(posis1)

test('Check MeshMat setting attribs onto a pgon', () => {
    sf.material.MeshMat('MeshMat1', [1,0,0], 0.5, Enum._ESide.BOTH, Enum._Ecolors.VERT_COLORS)
    sf.material.Set(pg1, 'MeshMat1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['MeshMat1'])
}); 

test('Check setting Lambert onto the same name as meshmat', () => {
    sf.material.Lambert('MeshMat1', [1,0,0])
    sf.material.Set(pg1, 'MeshMat1')
    const attribs = sf.attrib.Get(pg1, 'material')
    //@ts-ignore
    expect(attribs).toStrictEqual(['MeshMat1'])
}); 