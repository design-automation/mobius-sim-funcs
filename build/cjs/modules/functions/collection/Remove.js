"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Remove = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
// ================================================================================================
/**
 * Removes entities from a collection.
 * \n
 * @param __model__
 * @param coll The collection to be updated.
 * @param entities Points, polylines, polygons, and collections to add. Or null to empty the collection.
 * @returns void
 */
function Remove(__model__, coll, entities) {
    // --- Error Check ---
    const fn_name = 'collection.Remove';
    let ents_arr = null;
    let coll_arr;
    if (__model__.debug) {
        if (entities !== null) {
            entities = (0, mobius_sim_1.arrMakeFlat)(entities);
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.POINT, mobius_sim_1.EEntType.PLINE, mobius_sim_1.EEntType.PGON, mobius_sim_1.EEntType.COLL]);
        }
        coll_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', coll, [_check_ids_1.ID.isID], [mobius_sim_1.EEntType.COLL]);
    }
    else {
        if (entities !== null) {
            entities = (0, mobius_sim_1.arrMakeFlat)(entities);
            // ents_arr = splitIDs(fn_name, 'entities', entities,
            //     [IDcheckObj.isID, IDcheckObj.isIDList],
            //     [EEntType.POINT, EEntType.PLINE, EEntType.PGON, EEntType.COLL]) as TEntTypeIdx[];
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
        // coll_arr = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isID], [EEntType.COLL]) as TEntTypeIdx;
        coll_arr = (0, mobius_sim_1.idsBreak)(coll);
    }
    // --- Error Check ---
    if (ents_arr === null) {
        _collectionEmpty(__model__, coll_arr[1]);
    }
    else {
        _collectionRemove(__model__, coll_arr[1], ents_arr);
    }
}
exports.Remove = Remove;
function _collectionRemove(__model__, coll_i, ents_arr) {
    const ssid = __model__.modeldata.active_ssid;
    const points_i = [];
    const plines_i = [];
    const pgons_i = [];
    const colls_i = [];
    for (const [ent_type, ent_i] of ents_arr) {
        switch (ent_type) {
            case mobius_sim_1.EEntType.POINT:
                points_i.push(ent_i);
                break;
            case mobius_sim_1.EEntType.PLINE:
                plines_i.push(ent_i);
                break;
            case mobius_sim_1.EEntType.PGON:
                pgons_i.push(ent_i);
                break;
            case mobius_sim_1.EEntType.COLL:
                colls_i.push(ent_i);
                break;
            default:
                throw new Error('Error removing entities from a collection. \
                A collection can only contain points, polylines, polygons, and other collections.');
        }
    }
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
function _collectionEmpty(__model__, coll_i) {
    const ssid = this.modeldata.active_ssid;
    const points_i = __model__.modeldata.geom.nav.navCollToPoint(coll_i);
    const plines_i = __model__.modeldata.geom.nav.navCollToPline(coll_i);
    const pgons_i = __model__.modeldata.geom.nav.navCollToPgon(coll_i);
    const colls_i = __model__.modeldata.geom.nav.navCollToCollChildren(coll_i);
    __model__.modeldata.geom.snapshot.remCollPoints(ssid, coll_i, points_i);
    __model__.modeldata.geom.snapshot.remCollPlines(ssid, coll_i, plines_i);
    __model__.modeldata.geom.snapshot.remCollPgons(ssid, coll_i, pgons_i);
    __model__.modeldata.geom.snapshot.remCollChildren(ssid, coll_i, colls_i);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2NvbGxlY3Rpb24vUmVtb3ZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUEyRztBQUUzRyxvREFBbUQ7QUFJbkQsbUdBQW1HO0FBQ25HOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixNQUFNLENBQUMsU0FBa0IsRUFBRSxJQUFTLEVBQUUsUUFBbUI7SUFDckUsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDO0lBQ3BDLElBQUksUUFBUSxHQUFrQixJQUFJLENBQUM7SUFDbkMsSUFBSSxRQUFRLENBQUM7SUFDYixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFVLENBQUM7WUFDMUMsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ3hELENBQUMsZUFBRSxDQUFDLElBQUksRUFBRSxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQ3BCLENBQUMscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxLQUFLLEVBQUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBa0IsQ0FBQztTQUN4RjtRQUNELFFBQVEsR0FBRyxJQUFBLHFCQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBZ0IsQ0FBQztLQUNwRztTQUFNO1FBQ0gsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1lBQ25CLFFBQVEsR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFB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