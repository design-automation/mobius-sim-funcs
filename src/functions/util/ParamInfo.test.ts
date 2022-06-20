import { SIMFuncs } from '../../index'
import { ParamInfo } from './ParamInfo';

const sf = new SIMFuncs();

test('Check Paraminfo', () => {
    const pinfo = ParamInfo(sf.__model__, {"CHECK1_":10})
    //@ts-ignore
    expect(pinfo).toStrictEqual(
    "{\"CHECK1_\":10}"
    );
}); 
