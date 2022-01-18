"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const _enum_1 = require("./_enum");
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
function Type(__model__, entities, type_query_enum) {
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'query.Type';
    let ents_arr = null;
    if (__model__.debug) {
        ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null, false);
    }
    else {
        ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    return _type(__model__, ents_arr, type_query_enum);
}
exports.Type = Type;
function _exists(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
    return __model__.modeldata.geom.snapshot.hasEnt(ssid, ent_type, ent_i);
}
function _isUsedPosi(__model__, ent_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== mobius_sim_1.EEntType.POSI) {
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
    if (ent_type === mobius_sim_1.EEntType.POINT || ent_type === mobius_sim_1.EEntType.PLINE || ent_type === mobius_sim_1.EEntType.PGON) {
        return true;
    }
    return false;
}
function _isTopo(__model__, ent_arr) {
    const [ent_type, _] = ent_arr;
    if (ent_type === mobius_sim_1.EEntType.VERT || ent_type === mobius_sim_1.EEntType.EDGE || ent_type === mobius_sim_1.EEntType.WIRE) {
        return true;
    }
    return false;
}
function _isPointTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === mobius_sim_1.EEntType.VERT) {
        const points_i = __model__.modeldata.geom.nav.navAnyToPoint(ent_type, ent_i);
        if (points_i !== undefined && points_i.length) {
            return true;
        }
    }
    return false;
}
function _isPlineTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === mobius_sim_1.EEntType.VERT || ent_type === mobius_sim_1.EEntType.EDGE || ent_type === mobius_sim_1.EEntType.WIRE) {
        const plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        if (plines_i !== undefined && plines_i.length) {
            return true;
        }
    }
    return false;
}
function _isPgonTopo(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === mobius_sim_1.EEntType.VERT || ent_type === mobius_sim_1.EEntType.EDGE || ent_type === mobius_sim_1.EEntType.WIRE) {
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        if (pgons_i !== undefined && pgons_i.length) {
            return true;
        }
    }
    return false;
}
function _isClosed2(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type === mobius_sim_1.EEntType.PGON) {
        return true;
    }
    else if (ent_type !== mobius_sim_1.EEntType.WIRE && ent_type !== mobius_sim_1.EEntType.PLINE) {
        return false;
    }
    let wire_i = ent_i;
    if (ent_type === mobius_sim_1.EEntType.PLINE) {
        wire_i = __model__.modeldata.geom.nav.navPlineToWire(ent_i);
    }
    return __model__.modeldata.geom.query.isWireClosed(wire_i);
}
function _isHole(__model__, ent_arr) {
    const [ent_type, ent_i] = ent_arr;
    if (ent_type !== mobius_sim_1.EEntType.WIRE) {
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
    if (ent_type !== mobius_sim_1.EEntType.PGON) {
        return false;
    }
    const wires_i = __model__.modeldata.geom.nav.navPgonToWire(ent_i);
    return wires_i.length === 1;
}
function _type(__model__, ents_arr, query_ent_type) {
    if ((0, mobius_sim_1.getArrDepth)(ents_arr) === 1) {
        const ent_arr = ents_arr;
        const [ent_type, _] = ent_arr;
        switch (query_ent_type) {
            case _enum_1._ETypeQueryEnum.EXISTS:
                return _exists(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_POSI:
                return ent_type === mobius_sim_1.EEntType.POSI;
            case _enum_1._ETypeQueryEnum.IS_USED_POSI:
                return _isUsedPosi(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_UNUSED_POSI:
                return !_isUsedPosi(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_VERT:
                return ent_type === mobius_sim_1.EEntType.VERT;
            case _enum_1._ETypeQueryEnum.IS_EDGE:
                return ent_type === mobius_sim_1.EEntType.EDGE;
            case _enum_1._ETypeQueryEnum.IS_WIRE:
                return ent_type === mobius_sim_1.EEntType.WIRE;
            case _enum_1._ETypeQueryEnum.IS_POINT:
                return ent_type === mobius_sim_1.EEntType.POINT;
            case _enum_1._ETypeQueryEnum.IS_PLINE:
                return ent_type === mobius_sim_1.EEntType.PLINE;
            case _enum_1._ETypeQueryEnum.IS_PGON:
                return ent_type === mobius_sim_1.EEntType.PGON;
            case _enum_1._ETypeQueryEnum.IS_COLL:
                return ent_type === mobius_sim_1.EEntType.COLL;
            case _enum_1._ETypeQueryEnum.IS_OBJ:
                return _isObj(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_TOPO:
                return _isTopo(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_POINT_TOPO:
                return _isPointTopo(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_PLINE_TOPO:
                return _isPlineTopo(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_PGON_TOPO:
                return _isPgonTopo(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_OPEN:
                return !_isClosed2(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_CLOSED:
                return _isClosed2(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.IS_HOLE:
                return _isHole(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.HAS_HOLES:
                return !_hasNoHoles(__model__, ent_arr);
            case _enum_1._ETypeQueryEnum.HAS_NO_HOLES:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUF1SDtBQUV2SCxvREFBbUQ7QUFDbkQsbUNBQTBDO0FBRzFDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxTQUFnQixJQUFJLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUFFLGVBQWdDO0lBQzFGLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDO0lBQzdCLElBQUksUUFBUSxHQUE4QixJQUFJLENBQUM7SUFDL0MsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBOEIsQ0FBQztLQUNqSTtTQUFNO1FBQ0gsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQThCLENBQUM7S0FDOUQ7SUFDRCxzQkFBc0I7SUFDdEIsT0FBTyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBWkQsb0JBWUM7QUFDRCxTQUFTLE9BQU8sQ0FBQyxTQUFrQixFQUFFLE9BQW9CO0lBQ3JELE1BQU0sSUFBSSxHQUFXLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0lBQ3JELE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQWdCLE9BQU8sQ0FBQztJQUMvQyxPQUFPLFNBQVMs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