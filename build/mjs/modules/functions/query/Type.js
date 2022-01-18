import { EEntType, getArrDepth, idsBreak, isEmptyArr } from '@design-automation/mobius-sim';
import { checkIDs, ID } from '../../../_check_ids';
import { _ETypeQueryEnum } from './_enum';
// ================================================================================================
/**
 * Checks the type of an entity.
 * \n
 * - For is\_used\_posi, returns true if the entity is a posi, and it is used by at least one vertex.
 * - For is\_unused\_posi, it returns the opposite of is\_used\_posi.
 * - For is\_object, returns true if the entity is a point, a polyline, or a polygon.
 * - For is\_topology, returns true if the entity is a vertex, an edge, a wire, or a face.
 * - For is\_point\_topology, is\_polyline\_topology, and is\_polygon\_topology, returns true.
 * if the entity is a topological entity, and it is part of an object of the specified type.
 * - For is\_open, returns true if the entity is a wire or polyline and is open. For is\_closed, it returns the opposite of is\_open.
 * - For is\_hole, returns true if the entity is a wire, and it defines a hole in a face.
 * - For has\_holes, returns true if the entity is a face or polygon, and it has holes.
 * - For has\_no\_holes, it returns the opposite of has\_holes.
 *
 * @param __model__
 * @param entities An entity, or a list of entities.
 * @param type_query_enum Enum, select the conditions to test agains.
 * @returns Boolean or list of boolean in input sequence.
 * @example query.Type([polyline1, polyline2, polygon1], is\_polyline )
 * @example_info Returns a list [true, true, false] if polyline1 and polyline2 are polylines but polygon1 is not a polyline.
 */
export function Type(__model__, entities, type_query_enum) {
    if (isEmptyArr(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Type';
    let ents_arr = null;
    if (__model__.debug) {
        ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null, false);
    }
    else {
        ents_arr = idsBreak(entities);
    }
    // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
function _exists(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
    return __model__.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i);
}
function _isUsedPosi(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
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
function _isObj(__model__, ent_arr) {
    const [ent_type, _] = ent_arr;
    if (ent_type === EEntType.POINT || ent_type === EEntType.PLINE || ent_type === EEntType.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__, ent_arr) {
    const [ent_type, _] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT) {
        const points_i = __model__.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
        if (points_i !== undefined && points_i.length) {
            return true;
        }
    }
    return false;
}
function _isPlineTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        if (plines_i !== undefined && plines_i.length) {
            return true;
        }
    }
    return false;
}
function _isPgonTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.VERT || ent_type === EEntType.EDGE || ent_type === EEntType.WIRE) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i !== undefined && pgons_i.length) {
            return true;
        }
    }
    return false;
}
function _isClosed2(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === EEntType.PGON) {
        return true;
    }
    else if (ent_type !== EEntType.WIRE && ent_type !== EEntType.PLINE) {
        return false;
    }
    let wire_i = ent_i;
    if (ent_type === EEntType.PLINE) {
        wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
    }
    return __model__.modeldata.geom.query.isWireClosed(wire_i);
}
function _isHole(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== EEntType.WIRE) {
        return false;
    }
    const pgon_i = __model__.modeldata.geom.nav.navWireToPgon(ent_i);
    if (pgon_i === undefined) {
        return false;
    }
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(pgon_i);
    return wires_i.indexOf(ent_i) > 0;
}
function _hasNoHoles(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== EEntType.PGON) {
        return false;
    }
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(ent_i);
    return wires_i.length === 1;
}
function _type(__model__, ents_arr, query_ent_type) {
    if (getArrDepth(ents_arr) === 1) {
        const ent_arr = ents_arr;
        const [ent_type, _] = ent_arr;
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
    }
    else {
        return ents_arr.map(ent_arr => _type(__model__, ent_arr, query_ent_type));
    }
}
// TODO IS_PLANAR
// TODO IS_QUAD
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFXLFFBQVEsRUFBRSxVQUFVLEVBQW9CLE1BQU0sK0JBQStCLENBQUM7QUFFdkgsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRzFDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFDLFNBQWtCLEVBQUUsUUFBbUIsRUFBRSxlQUFnQztJQUMxRixJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7SUFDeEMsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQztJQUM3QixJQUFJLFFBQVEsR0FBOEIsSUFBSSxDQUFDO0lBQy9DLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQThCLENBQUM7S0FDakk7U0FBTTtRQUNILFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUE4QixDQUFDO0tBQzlEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE9BQU8sS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUNELFNBQVMsT0FBTyxDQUFDLFNBQWtCLEVBQUUsT0FBb0I7SUFDckQsTUFBTSxJQUFJLEdB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