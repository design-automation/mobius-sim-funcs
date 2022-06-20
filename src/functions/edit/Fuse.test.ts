import { SIMFuncs } from '../../index'

import * as qEnum from '../query/_enum';

const sf = new SIMFuncs();

const posis1 = sf.make.Position([
    [0, 0, 0],[10, 0, 0],[10, 10, 0]
]); 
const posis2 = sf.make.Position([
    [0, 0, 2],[10, 0, 3],[10, 10, 4]
]); 

const newPosi = sf.edit.Fuse([posis1, posis2], 3)
const check = sf.query.Get(qEnum._ENT_TYPE.POSI, null)

test('Check that new posi has been returned', () => {
    //@ts-ignore
    expect(newPosi).toEqual(['ps6'])
}); 

test('Check that old posis have been removed', () => {
    //@ts-ignore
    expect(check).toEqual(['ps1', 'ps2', 'ps4', 'ps5', 'ps6'])
}); 