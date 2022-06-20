import { ENT_TYPE } from "src/mobius_sim";
// -------------------------------------------------------------------------------------------------
/**
 * Given an entity type, returns a string.
 * Used for error messages
 * @param ent_type_str
 */
 export function getEntTypeStr(ent_type_str: ENT_TYPE): string {
    switch (ent_type_str) {
        case ENT_TYPE.POSI:
            return 'positions';
        case ENT_TYPE.VERT:
            return 'vertices';
        case ENT_TYPE.TRI:
            return 'triangles';
        case ENT_TYPE.EDGE:
            return 'edges';
        case ENT_TYPE.WIRE:
            return 'wires';
        case ENT_TYPE.POINT:
            return 'points';
        case ENT_TYPE.PLINE:
            return 'polylines';
        case ENT_TYPE.PGON:
            return 'polygons';
        case ENT_TYPE.COLL:
            return 'collections';
    }
}
// -------------------------------------------------------------------------------------------------