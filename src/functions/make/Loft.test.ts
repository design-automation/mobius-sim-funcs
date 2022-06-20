import { SIMFuncs } from '../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

import * as Enum from './_enum'

const sf = new SIMFuncs();
const inl = new InlineClass();

const ps1 = sf.make.Position(
    [[0, 0, 0], [10, 0, 0]]
);

const pl1 = sf.make.Polyline(ps1, Enum._EClose.OPEN);
const pl2 = sf.make.Copy(pl1, [0, 10, 0])

const lf1 = sf.make.Loft([pl1, pl2], 1, Enum._ELoftMethod.OPEN_QUADS)
const lf2 = sf.make.Loft([pl1, pl2], 4, Enum._ELoftMethod.OPEN_RIBS)

test('Loft into 1 open quad', () => {
    //@ts-ignore
    expect(lf1).toStrictEqual(['pg0']);
}); 

test('Loft into 5 open ribs', () => {
    //@ts-ignore
    expect(lf2).toStrictEqual(['pl2', 'pl3', 'pl4', 'pl5', 'pl6']);
}); 