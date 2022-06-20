import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

const info = sf.util.ModelInfo()

test('Check ModelInfo output', () => {
    //@ts-ignore
    expect(info).toStrictEqual(
    "<h4>Model Information:</h4>"+
    "<ul>"+
    "<li><b>Collections</b>: 0 Attribs: name</li>"+
    "<li><b>Polygons</b>: 1 Attribs: _ts</li>"+
    "<li><b>Polylines</b>: 0 Attribs: _ts</li>"+
    "<li><b>Points</b>: 0 Attribs: _ts</li>"+
    "<li><b>Wires</b>: 1</li>"+
    "<li><b>Edges</b>: 4</li>"+
    "<li><b>Vertices</b>: 4 Attribs: rgb, normal</li>"+
    "<li><b>Positions</b>: 4 Attribs: xyz</li>"+
    "</ul>"
    );
}); 

