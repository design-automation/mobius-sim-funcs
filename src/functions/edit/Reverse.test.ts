import { SIMFuncs } from '../../index'

const sf = new SIMFuncs();

const r_posis = sf.pattern.Rectangle([0, 0, 0],2); 
const r_pgon = sf.make.Polygon(r_posis)

const check1 = sf.calc.Normal(r_pgon, 1)

sf.edit.Reverse(r_pgon)

const check2 = sf.calc.Normal(r_pgon, 1)

test('Check that reverse has flipped the normal', () => {
    //@ts-ignore
    expect(check1[2]).toEqual(-check2[2])
}); 