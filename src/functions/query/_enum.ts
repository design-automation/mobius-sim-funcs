export enum _ENT_TYPE {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co'
}
export enum _ENT_TYPEAndMod {
    POSI =   'ps',
    VERT =   '_v',
    EDGE =   '_e',
    WIRE =   '_w',
    POINT =  'pt',
    PLINE =  'pl',
    PGON =   'pg',
    COLL =   'co',
    MOD =    'mo'
}
export enum _EDataType {
    NUMBER =   'number',
    STRING =   'string',
    BOOLEAN = 'boolean',
    LIST =   'list',
    DICT = 'dict'
}
export enum _EEdgeMethod {
    PREV = 'previous',
    NEXT = 'next',
    PREV_NEXT = 'both',
    TOUCH = 'touching'
}
export enum _ESortMethod {
    DESCENDING = 'descending',
    ASCENDING = 'ascending'
}
export enum _ETypeQueryEnum {
    EXISTS = 'exists',
    IS_POSI =   'is_position',
    IS_USED_POSI = 'is_used_posi',
    IS_UNUSED_POSI = 'is_unused_posi',
    IS_VERT =   'is_vertex',
    IS_EDGE =   'is_edge',
    IS_WIRE =   'is_wire',
    IS_POINT =  'is_point',
    IS_PLINE =  'is_polyline',
    IS_PGON =   'is_polygon',
    IS_COLL =   'is_collection',
    IS_OBJ =    'is_object',
    IS_TOPO =   'is_topology',
    IS_POINT_TOPO =   'is_point_topology',
    IS_PLINE_TOPO =   'is_polyline_topology',
    IS_PGON_TOPO =   'is_polygon_topology',
    IS_OPEN =      'is_open',
    IS_CLOSED =    'is_closed',
    IS_HOLE =      'is_hole',
    HAS_HOLES =    'has_holes',
    HAS_NO_HOLES = 'has_no_holes'
}

export enum _EFilterOperator {
    IS_EQUAL =              '==',
    IS_NOT_EQUAL =          '!=',
    IS_GREATER_OR_EQUAL =   '>=',
    IS_LESS_OR_EQUAL =      '<=',
    IS_GREATER =            '>',
    IS_LESS =               '<',
    EQUAL =                 '='
}
