import { GIMetaData, LONGLAT } from '@design-automation/mobius-sim';

import { __clone__, __merge__, __new__ } from './_model';

export const _parameterTypes = {
    // classes
    newMeta: GIMetaData,

    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    console: '__console__',
    fileName: '__fileName__',

    new: '_model.__new__',
    merge: '_model.__merge__',

    newFn: __new__,
    mergeFn: __merge__,
    cloneFn: __clone__,

    addData: '_model.addGiData',

    preprocess: '_model.__preprocess__',
    postprocess: '_model.__postprocess__',

    setattrib: 'attrib.Set',
    getattrib: 'attrib.Get',
    queryGet: 'query.Get',
    queryFilter: 'query.Filter',

    select: '_model.__select__',

    return: '_output.Return',

    asyncFuncs: [
        'util.ModelCompare',
        'util.ModelMerge',
        'io.Write', 'io.Read',
        'io.Import', 'io.Export',
        'util.HTTPRequest'
    ],

    // longitude latitude in Singapore, NUS
    LONGLAT: LONGLAT,
};
