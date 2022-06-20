import { SIMFuncs } from '../../index'
import * as qEnum from '../query/_enum'
import * as aEnum from '../attrib/_enum'
import * as Enum from './_enum'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)
const posis2 = sf.pattern.Rectangle([0,0,10], 5)
const pgon2 = sf.make.Polygon(posis2)

sf.attrib.Push([posis1, posis2], ['xyz', 2, 'height'], aEnum._EAttribPushTarget.PGON, aEnum._EPushMethodSel.FIRST)
sf.visualize.Gradient([pgon1, pgon2], 'height', 10, Enum._EColorRampMethod.BUPU)
const v1 = sf.query.Get(qEnum._ENT_TYPE.VERT, null)
const check = sf.attrib.Get(v1, 'rgb')

test('Check that visualizeGradient has set rgb attribs on _v of 2 polygons based on BuPu', () => {
    //@ts-ignore
    expect(check).toStrictEqual([
        [0.9686274509803922, 0.9882352941176471, 0.9921568627450981],
        [0.9686274509803922, 0.9882352941176471, 0.9921568627450981],
        [0.9686274509803922, 0.9882352941176471, 0.9921568627450981],
        [0.9686274509803922, 0.9882352941176471, 0.9921568627450981],
        [0.30196078431372547, 0, 0.29411764705882354],
        [0.30196078431372547, 0, 0.29411764705882354],
        [0.30196078431372547, 0, 0.29411764705882354],
        [0.30196078431372547, 0, 0.29411764705882354]
    ]);
}); 