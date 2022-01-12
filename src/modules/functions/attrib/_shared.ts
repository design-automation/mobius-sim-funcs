/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { EEntType } from '@design-automation/mobius-sim';

import { _EAttribPushTarget, _EEntType, _EEntTypeAndMod } from './_enum';


// ================================================================================================

export function _getEntTypeFromStr(ent_type_str: _EEntType | _EEntTypeAndMod): EEntType {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
export function _getAttribPushTarget(ent_type_str: _EAttribPushTarget): EEntType | string {
    switch (ent_type_str) {
        case _EAttribPushTarget.POSI:
            return EEntType.POSI;
        case _EAttribPushTarget.VERT:
            return EEntType.VERT;
        case _EAttribPushTarget.EDGE:
            return EEntType.EDGE;
        case _EAttribPushTarget.WIRE:
            return EEntType.WIRE;
        case _EAttribPushTarget.POINT:
            return EEntType.POINT;
        case _EAttribPushTarget.PLINE:
            return EEntType.PLINE;
        case _EAttribPushTarget.PGON:
            return EEntType.PGON;
        case _EAttribPushTarget.COLL:
            return EEntType.COLL;
        case _EAttribPushTarget.COLLC:
            return 'coll_children';
        case _EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _EAttribPushTarget.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
