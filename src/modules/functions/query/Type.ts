import { EEntType, getArrDepth, GIModel, idsBreak, isEmptyArr, TEntTypeIdx, TId } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../_check_ids';
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
 * @param type_query_enum Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is\_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but
 * polygon1 is not a polyline.
 */
export function Type(__model__: GIModel, entities: TId|TId[], type_query_enum: _ETypeQueryEnum): boolean|boolean[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'query.Type';
    let ents_arr: TEntTypeIdx|TEntTypeIdx[] = null;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null, false) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arr = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
function _exists(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const ssid: number = __model__.modeldata.active_ssid;
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    return __model__.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i);
}
function _isUsedPosi(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const ssid: number = __model__.modeldata.active_ssid;
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.POSI) {
        return false;
    }
    return !this.modeldata.snapshot.isPosiUnused(ssid, ent_i);
    // const verts_i: number[] = __model__.modeldata.geom.nav.navPosiToVert(index);
    // if (verts_i === undefined) {
    //     return false;
    // }
    // return verts_i.length > 0;
}
function _isObj(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, _]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.POINT || ent_type === EEntType.PLINE || ent_type === EEntType.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, _]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT) {
        const points_i: number[] = __model__.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
        if (points_i !== undefined && points_i.length) { return true; }
    }
    return false;
}
function _isPlineTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        if (plines_i !== undefined && plines_i.length) { return true; }
    }
    return false;
}
function _isPgonTopo(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i !== undefined && pgons_i.length) { return true; }
    }
    return false;
}
function _isClosed2(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type === EEntType.PGON) {
        return true;
    } else if (ent_type !== EEntType.WIRE && ent_type !== EEntType.PLINE) {
        return false;
    }
    let wire_i: number = ent_i;
    if (ent_type === EEntType.PLINE) {
        wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
    }
    return __model__.modeldata.geom.query.isWireClosed(wire_i) as boolean;
}
function _isHole(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.WIRE) {
        return false;
    }
    const pgon_i: number = __model__.modeldata.geom.nav.navWireToPgon(ent_i);
    if (pgon_i === undefined) {
        return false;
    }
    const wires_i: number[] = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
    return wires_i.indexOf(ent_i) > 0;
}
function _hasNoHoles(__model__: GIModel, ent_arr: TEntTypeIdx): boolean {
    const [ent_type, ent_i]: TEntTypeIdx = ent_arr;
    if (ent_type !== EEntType.PGON) {
        return false;
    }
    const wires_i: number[] = __model__.modeldata.geom.nav.navPgonToWire(ent_i);
    return wires_i.length === 1;
}
function _type(__model__: GIModel, ents_arr: TEntTypeIdx|TEntTypeIdx[], query_ent_type: _ETypeQueryEnum): boolean|boolean[] {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr: TEntTypeIdx = ents_arr as TEntTypeIdx;
        const [ent_type, _]: TEntTypeIdx = ent_arr;
        switch (query_ent_type) {
            case _ETypeQueryEnum.EXISTS:
                return _exists(__model__, ent_arr);
            case _ETypeQueryEnum.IS_POSI:
                return ent_type === EEntType.POSI;
            case _ETypeQueryEnum.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _ETypeQueryEnum.IS_VERT:
                return ent_type === EEntType.VERT;
            case _ETypeQueryEnum.IS_EDGE:
                return ent_type === EEntType.EDGE;
            case _ETypeQueryEnum.IS_WIRE:
                return ent_type === EEntType.WIRE;
            case _ETypeQueryEnum.IS_POINT:
                return ent_type === EEntType.POINT;
            case _ETypeQueryEnum.IS_PLINE:
                return ent_type === EEntType.PLINE;
            case _ETypeQueryEnum.IS_PGON:
                return ent_type === EEntType.PGON;
            case _ETypeQueryEnum.IS_COLL:
                return ent_type === EEntType.COLL;
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
        return (ents_arr as TEntTypeIdx[]).map(ent_arr => _type(__model__, ent_arr, query_ent_type)) as boolean[];
    }

}
// TODO IS_PLANAR
// TODO IS_QUAD
