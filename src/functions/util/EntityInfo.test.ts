import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

const info = sf.util.EntityInfo(pgon1)

test('Check EntityInfo output for Pgon', () => {
    //@ts-ignore
    expect(info).toStrictEqual(
    "<h4>Entity Information:</h4>"+
    "<ul><li>Type: <b>Polygon</b></li>"+
    "<ul>"+
    "<li>Attribs: _ts</li>"+
    "<li>Num verts: 4</li>"+
    "<li>Num edges: 4</li>"+
    "<li>Num wires: 1</li>"+
    "</ul></ul>"
    );
}); 

