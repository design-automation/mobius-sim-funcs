export enum _EEntType {
    POSI = 'ps',
    VERT = '_v',
    EDGE = '_e',
    WIRE = '_w',
    FACE = '_f',
    POINT = 'pt',
    PLINE = 'pl',
    PGON = 'pg',
    COLL = 'co'
}
export enum _EEntTypeAndMod {
    POSI = 'ps',
    VERT = '_v',
    EDGE = '_e',
    WIRE = '_w',
    FACE = '_f',
    POINT = 'pt',
    PLINE = 'pl',
    PGON = 'pg',
    COLL = 'co',
    MOD = 'mo'
}
export enum _EAttribPushTarget {
    POSI = 'ps',
    VERT = '_v',
    EDGE = '_e',
    WIRE = '_w',
    FACE = '_f',
    POINT = 'pt',
    PLINE = 'pl',
    PGON = 'pg',
    COLL = 'co',
    COLLP = 'cop',
    COLLC = 'coc',
    MOD = 'mo'
}
export enum _EDataType {
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    LIST = 'list',
    DICT = 'dict'
}

export enum _ESet {
    ONE_VALUE = "one_value",
    MANY_VALUES = "many_values",
}

export enum _EPushMethodSel {
    FIRST = 'first',
    LAST = 'last',
    AVERAGE = 'average',
    MEDIAN = 'median',
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max'
}
