import { SIMFuncs } from '../../../index'
import { InlineClass } from '@design-automation/mobius-inline-funcs' 

const sf = new SIMFuncs();
const inl = new InlineClass();

const ps1 = sf.make.Position(
    [[0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0], [0, 20, 0], [10, 20, 0]]
);
const pgon1 = sf.make.Polygon(inl.list.listSlice(ps1, 0, 5));
const pgon2 = sf.make.Polygon(
    //@ts-ignore
    inl.list.listRev( inl.list.listSlice(ps1, 2) )
    );
//@ts-ignore
const pgon3 = sf.make.Polygon(inl.list.listSlice(ps1, 2));

const jn1 = sf.make.Join([pgon1, pgon2])
const jn2 = sf.make.Join([pgon1, pgon3])


test('Join into 1 pg', () => {
    //@ts-ignore
    expect(jn1).toStrictEqual(['pg3']);
}); 

test('Join unshared pgons into 2 pgs', () => {
    //@ts-ignore
    expect(jn2).toStrictEqual(['pg4', 'pg5']);
}); 