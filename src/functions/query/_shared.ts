import { ENT_TYPE } from '../../mobius_sim';

import { _ENT_TYPE, _ENT_TYPEAndMod } from './_enum';


// ================================================================================================

export function _getEntTypeFromStr(ent_type_str: _ENT_TYPE|_ENT_TYPEAndMod|ENT_TYPE): ENT_TYPE {
    switch (ent_type_str) {
        case _ENT_TYPEAndMod.POSI:
            return ENT_TYPE.POSI;
        case _ENT_TYPEAndMod.VERT:
            return ENT_TYPE.VERT;
        case _ENT_TYPEAndMod.EDGE:
            return ENT_TYPE.EDGE;
        case _ENT_TYPEAndMod.WIRE:
            return ENT_TYPE.WIRE;
        case _ENT_TYPEAndMod.POINT:
            return ENT_TYPE.POINT;
        case _ENT_TYPEAndMod.PLINE:
            return ENT_TYPE.PLINE;
        case _ENT_TYPEAndMod.PGON:
            return ENT_TYPE.PGON;
        case _ENT_TYPEAndMod.COLL:
            return ENT_TYPE.COLL;
        case _ENT_TYPEAndMod.MOD:
            return ENT_TYPE.MOD;
        default:
            break;
    }
}

