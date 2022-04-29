"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delaunay = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const d3del = __importStar(require("d3-delaunay"));
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
// ================================================================================================
/**
 * Create a delaunay triangulation of set of positions.
 * \n
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
function Delaunay(__model__, entities) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if ((0, mobius_sim_1.isEmptyArr)(entities)) {
        return [];
    }
    // --- Error Check ---
    const fn_name = 'poly2d.Delaunay';
    let posis_ents_arr;
    if (__model__.debug) {
        posis_ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities1', entities, [_check_ids_1.ID.isIDL1], null);
    }
    else {
        // posis_ents_arr = splitIDs(fn_name, 'entities1', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        posis_ents_arr = (0, mobius_sim_1.idsBreak)(entities);
    }
    // --- Error Check ---
    const posis_map = new Map();
    // posis
    const posis_i = (0, _shared_1._getPosis)(__model__, posis_ents_arr);
    if (posis_i.length === 0) {
        return [];
    }
    // posis
    const d3_tri_coords = [];
    for (const posi_i of posis_i) {
        const xyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_tri_coords.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    // create delaunay triangulation
    const cells_i = _delaunay(__model__, d3_tri_coords, posis_map);
    // return cell pgons
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.PGON, cells_i);
    // return idsMake(cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
exports.Delaunay = Delaunay;
function _delaunay(__model__, d3_tri_coords, posis_map) {
    const new_pgons_i = [];
    const delaunay = d3del.Delaunay.from(d3_tri_coords);
    const delaunay_posis_i = [];
    for (const d3_tri_coord of d3_tri_coords) {
        // TODO use the posis_map!!
        // const deauny_posi_i: number = __model__.modeldata.geom.add.addPosi();
        // __model__.modeldata.attribs.add.setPosiCoords(deauny_posi_i, [point[0], point[1], 0]);
        const delaunay_posi_i = (0, _shared_1._getPosiFromMap)(__model__, d3_tri_coord[0], d3_tri_coord[1], posis_map);
        delaunay_posis_i.push(delaunay_posi_i);
    }
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        const a = delaunay_posis_i[delaunay.triangles[i]];
        const b = delaunay_posis_i[delaunay.triangles[i + 1]];
        const c = delaunay_posis_i[delaunay.triangles[i + 2]];
        new_pgons_i.push(__model__.modeldata.geom.add.addPgon([c, b, a]));
    }
    return new_pgons_i;
}
function _putPosiInMap(arg0, arg1, posi_i, posis_map) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVsYXVuYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL0RlbGF1bmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBVXVDO0FBQ3ZDLG1EQUFxQztBQUVyQyxvREFBbUQ7QUFDbkQsdUNBQWtFO0FBR2xFLG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxRQUFtQjtJQUM1RCxRQUFRLEdBQUcsSUFBQSx3QkFBVyxFQUFDLFFBQVEsQ0FBVSxDQUFDO0lBQzFDLElBQUksSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7S0FBRTtJQUN4QyxzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLENBQUM7SUFDbEMsSUFBSSxjQUE2QixDQUFDO0lBQ2xDLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixjQUFjLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFDL0QsQ0FBQyxlQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFrQixDQUFDO0tBQzNDO1NBQU07UUFDSCw0REFBNEQ7UUFDNUQsaURBQWlEO1FBQ2pELGNBQWMsR0FBRyxJQUFBLHFCQUFRLEVBQUMsUUFBUSxDQUFrQixDQUFDO0tBQ3hEO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sU0FBUyxHQUFjLElBQUksR0FBRyxFQUFFLENBQUM7SUFDdkMsUUFBUTtJQUNSLE1BQU0sT0FBTyxHQUFhLElBQUEsbUJBQVMsRUFBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDL0QsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0tBQUU7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