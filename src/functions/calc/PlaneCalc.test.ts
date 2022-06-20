import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const posis = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0],[0, 10, 0],
]); 
const pg = sf.make.Polygon(posis)

const Pln1 = sf.calc.Plane(pg)

test('Check calculated plane from pg', () => {
    //@ts-ignore
    expect(Pln1).toStrictEqual([
        [5,5,0], [1,0,0], [0,1,0]
    ]);
}); 
