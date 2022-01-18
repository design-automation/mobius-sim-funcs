"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
// ================================================================================================
/**
 * Deletes a collection without deleting the entities in the collection.
 * \n
 * @param __model__
 * @param coll The collection or list of collections to be deleted.
 * @returns void
 */
function Delete(__model__, coll) {
    coll = (0, mobius_sim_1.arrMakeFlat)(coll);
    // --- Error Check ---
    const fn_name = 'collection.Delete';
    let colls_arrs;
    if (__model__.debug) {
        colls_arrs = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'coll', coll, [_check_ids_1.ID.isIDL1], [mobius_sim_1.EEntType.COLL]);
    }
    else {
        // colls_arrs = splitIDs(fn_name, 'coll', coll, [IDcheckObj.isIDList], [EEntType.COLL]) as TEntTypeIdx[];
        colls_arrs = (0, mobius_sim_1.idsBreak)(coll);
    }
    // --- Error Check ---
    const colls_i = [];
    for (const [ent_type, ent_i] of colls_arrs) {
        colls_i.push(ent_i);
    }
    __model__.modeldata.geom.snapshot.delColls(__model__.modeldata.active_ssid, colls_i);
}
exports.Delete = Delete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2NvbGxlY3Rpb24vRGVsZXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUEyRztBQUUzRyxvREFBbUQ7QUFJbkQsbUdBQW1HO0FBQ25HOzs7Ozs7R0FNRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxTQUFrQixFQUFFLElBQWU7SUFDdEQsSUFBSSxHQUFHLElBQUEsd0JBQVcsRUFBQyxJQUFJLENBQVUsQ0FBQztJQUNsQyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7SUFDcEMsSUFBSSxVQUFVLENBQUM7SUFDZixJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDakIsVUFBVSxHQUFHLElBQUEscUJBQVEsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFrQixDQUFDO0tBQzFHO1NBQU07UUFDSCx5R0FBeUc7UUFDekcsVUFBVSxHQUFHLElBQUEscUJBQVEsRUFBQyxJQUFJLENBQWtCLENBQUM7S0FDaEQ7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQzdCLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUU7UUFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2QjtJQUNELFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekYsQ0FBQztBQWpCRCx3QkFpQkMifQ==