import { ENT_TYPE, getArrDepth, Sim, idsBreak, isEmptyArr, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { _ETypeQueryEnum } from './_enum';


// ================================================================================================
/**
 * Checks the type of an entity. \n
 * - For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one
 *   vertex.
 * - For is\_unused\_posi, it returns the opposite of is\_used\_posi.
 * - For is\_object, returns true if the entity is a point, a polyline, or a polygon.
 * - For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
 * - For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true if the
 *   entity is a topological entity, and it is part of an object of the specified type.
 * - For is\_open, returns true if the entity is a wire or polyline and is open. 
 * - For is\_closed, it returns the opposite of is\_open.
 * - For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
 * - For has\_holes, returns true if the entity is a face or polygon, and it has holes.
 * - For has\_no\_holes, it returns the opposite of has\_holes.
 *
 * @param __model__
 * @param entities An entity, or a list of entities.
 * @param type_query_enum Enum, select the conditions to test against: `'exists', 'is_position',
    'is_used_posi', 'is_unused_posi', 'is_vertex', 'is_edge', 'is_wire', 'is_point',
    'is_polyline', 'is_polygon', 'is_collection', 'is_object', 'is_topology',
    'is_point_topology', 'is_polyline_topology', 'is_polygon_topology', 'is_open',
    'is_closed', 'is_hole', 'has_holes'` or `'has_no_holes'`.
 * @returns Boolean or list of booleans in input sequence.
 * @example `query.Type([polyline1, polyline2, polygon1], is_polyline)`
 * @example_info Returns a list `[true, true, false]` if polyline1 and polyline2 are polylines but
 * polygon1 is not a polyline.
 */
export function Type(__model__: Sim, entities: string|string[], type_query_enum: _ETypeQueryEnum): boolean|boolean[] {
    if (isEmptyArr(entities)) { return []; }
    // // --- Error Check ---
    // const fn_name = 'query.Type';
    // let ents_arr: string|string[] = null;
    // if (this.debug) {
    //     ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null, false) as string|string[];
    // } else {
    //     ents_arr = idsBreak(entities) as string|string[];
    // }
    // // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
function _exists(__model__: Sim, ent_arr: string): boolean {
    const ssid: number = __model__.modeldata.active_ssid;
    const [ent_type, ent_i]: string = ent_arr;
    return __model__.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i);
}
function _isUsedPosi(__model__: Sim, ent_arr: string): boolean {
    const ssid: number = __model__.modeldata.active_ssid;
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type !== ENT_TYPE.POSI) {
        return false;
    }
    return !this.modeldata.snapshot.isPosiUnused(ssid, ent_i);
    // const verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(index);
    // if (verts_i === undefined) {
    //     return false;
    // }
    // return verts_i.length > 0;
}
function _isObj(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, _]: string = ent_arr;
    if (ent_type === ENT_TYPE.POINT || ent_type === ENT_TYPE.PLINE || ent_type === ENT_TYPE.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, _]: string = ent_arr;
    if (ent_type === ENT_TYPE.VERT || ent_type === ENT_TYPE.EDGE || ent_type === ENT_TYPE.WIRE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type === ENT_TYPE.VERT) {
        const points_i: number[] = __model__.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
        if (points_i !== undefined && points_i.length) { return true; }
    }
    return false;
}
function _isPlineTopo(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type === ENT_TYPE.VERT || ent_type === ENT_TYPE.EDGE || ent_type === ENT_TYPE.WIRE) {
        const plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        if (plines_i !== undefined && plines_i.length) { return true; }
    }
    return false;
}
function _isPgonTopo(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type === ENT_TYPE.VERT || ent_type === ENT_TYPE.EDGE || ent_type === ENT_TYPE.WIRE) {
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i !== undefined && pgons_i.length) { return true; }
    }
    return false;
}
function _isClosed2(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type === ENT_TYPE.PGON) {
        return true;
    } else if (ent_type !== ENT_TYPE.WIRE && ent_type !== ENT_TYPE.PLINE) {
        return false;
    }
    let wire_i: number = ent_i;
    if (ent_type === ENT_TYPE.PLINE) {
        wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
    }
    return __model__.modeldata.geom.query.isWireClosed(wire_i) as boolean;
}
function _isHole(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type !== ENT_TYPE.WIRE) {
        return false;
    }
    const pgon_i: number = __model__.modeldata.geom.nav.navWireToPgon(ent_i);
    if (pgon_i === undefined) {
        return false;
    }
    const wires_i: number[] = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
    return wires_i.indexOf(ent_i) > 0;
}
function _hasNoHoles(__model__: Sim, ent_arr: string): boolean {
    const [ent_type, ent_i]: string = ent_arr;
    if (ent_type !== ENT_TYPE.PGON) {
        return false;
    }
    const wires_i: number[] = __model__.modeldata.geom.nav.navPgonToWire(ent_i);
    return wires_i.length === 1;
}
function _type(__model__: Sim, ents_arr: string|string[], query_ent_type: _ETypeQueryEnum): boolean|boolean[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: string = ents_arr as string;
        const [ent_type, _]: string = ent_arr;
        switch (query_ent_type) {
            case _ETypeQueryEnum.EXISTS:
                return _exists(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POSI:
                return ent_type === ENT_TYPE.POSI;
            case _ETypeQueryEnum.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_VERT:
                return ent_type === ENT_TYPE.VERT;
            case _ETypeQueryEnum.IS_EDGE:
                return ent_type === ENT_TYPE.EDGE;
            case _ETypeQueryEnum.IS_WIRE:
                return ent_type === ENT_TYPE.WIRE;
            case _ETypeQueryEnum.IS_POINT:
                return ent_type === ENT_TYPE.POINT;
            case _ETypeQueryEnum.IS_PLINE:
                return ent_type === ENT_TYPE.PLINE;
            case _ETypeQueryEnum.IS_PGON:
                return ent_type === ENT_TYPE.PGON;
            case _ETypeQueryEnum.IS_COLL:
                return ent_type === ENT_TYPE.COLL;
            case _ETypeQueryEnum.IS_OBJ:
                return _isObj(__model__, ent_arr);
            case _ETypeQueryEnum.IS_TOPO:
                return _isTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POINT_TOPO:
                return _isPointTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PLINE_TOPO:
                return _isPlineTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_PGON_TOPO:
                return _isPgonTopo(__model__, ent_arr);
            case _ETypeQueryEnum.IS_OPEN:
                return !_isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_CLOSED:
                return _isClosed2(__model__, ent_arr);
            case _ETypeQueryEnum.IS_HOLE:
                return _isHole(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_HOLES:
                return !_hasNoHoles(__model__, ent_arr);
            case _ETypeQueryEnum.HAS_NO_HOLES:
                return _hasNoHoles(__model__, ent_arr);
            default:
                break;
        }
    } else {
        return (ents_arr as string[]).map(ent_arr => _type(__model__, ent_arr, query_ent_type)) as boolean[];
    }

}
// TODO IS_PLANAR
// TODO IS_QUAD
