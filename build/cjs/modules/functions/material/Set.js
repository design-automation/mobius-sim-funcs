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
exports.Set = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _check_ids_1 = require("../../../_check_ids");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Assign a material to one or more polylines or polygons.
 * \n
 * A material name is assigned to the polygons. The named material must be separately defined as a
 * material in the model attributes. See the `material.LineMat()` or `material.MeshMat()` functions.
 * \n
 * The material name is a sting.
 * \n
 * For polylines, the `material` argument must be a single name.
 * \n
 * For polygons, the `material` argument can accept either be a single name, or a
 * list of two names. If it is a single name, then the same material is assigned to both the
 * front and back of teh polygon. If it is a list of two names, then the first material is assigned
 * to the front, and the second material is assigned to the back.
 * \n
 * @param entities The entities for which to set the material.
 * @param material The name of the material.
 * @returns void
 */
function Set(__model__, entities, material) {
    entities = (0, mobius_sim_1.arrMakeFlat)(entities);
    if (!(0, mobius_sim_1.isEmptyArr)(entities)) {
        // --- Error Check ---
        const fn_name = 'matrial.Set';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1, _check_ids_1.ID.isIDL2], null);
            chk.checkArgs(fn_name, 'material', material, [chk.isStr, chk.isStrL]);
        }
        else {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
        // --- Error Check ---
        let material_dict;
        let is_list = false;
        if (Array.isArray(material)) {
            is_list = true;
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material[0]);
        }
        else {
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material);
        }
        if (!material_dict) {
            throw new Error('Material does not exist: ' + material);
        }
        const material_type = material_dict['type'];
        if (material_type === undefined) {
            throw new Error('Material is not valid: ' + material_dict);
        }
        if (material_type === _enum_1._ELineMaterialType.BASIC || material_type === _enum_1._ELineMaterialType.DASHED) {
            if (is_list) {
                throw new Error('A line can only have a single material: ' + material_dict);
            }
            _lineMaterial(__model__, ents_arr, material);
        }
        else {
            if (is_list) {
                if (material.length > 2) {
                    throw new Error('A maximum of materials can be specified, for the front and back of the polygon : ' + material);
                }
            }
            else {
                material = [material];
            }
            _meshMaterial(__model__, ents_arr, material);
        }
    }
}
exports.Set = Set;
function _lineMaterial(__model__, ents_arr, material) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.PLINE, mobius_sim_1.EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.PLINE, mobius_sim_1.EAttribNames.MATERIAL, mobius_sim_1.EAttribDataTypeStrs.STRING);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        const plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        for (const pline_i of plines_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.PLINE, pline_i, mobius_sim_1.EAttribNames.MATERIAL, material);
        }
    }
}
function _meshMaterial(__model__, ents_arr, material) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.PGON, mobius_sim_1.EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(mobius_sim_1.EEntType.PGON, mobius_sim_1.EAttribNames.MATERIAL, mobius_sim_1.EAttribDataTypeStrs.LIST);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        for (const pgon_i of pgons_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(mobius_sim_1.EEntType.PGON, pgon_i, mobius_sim_1.EAttribNames.MATERIAL, material);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL21hdGVyaWFsL1NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVV1QztBQUV2QyxvREFBbUQ7QUFDbkQsMkRBQTZDO0FBQzdDLG1DQUE2QztBQUk3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQUUsUUFBeUI7SUFDbEYsUUFBUSxHQUFHLElBQUEsd0JBQVcsRUFBQyxRQUFRLENBQVUsQ0FBQztJQUMxQyxJQUFJLENBQUMsSUFBQSx1QkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3ZCLHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7UUFDOUIsSUFBSSxRQUF1QixDQUFDO1FBQzVCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUNqQixRQUFRLEdBQUcsSUFBQSxxQkFBUSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFDeEQsQ0FBQyxlQUFFLENBQUMsSUFBSSxFQUFFLGVBQUUsQ0FBQyxNQUFNLEVBQUUsZUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBa0IsQ0FBQztZQUM1RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN6RTthQUFNO1lBQ0gsUUFBUSxHQUFHLElBQUEscUJBQVEsRUFBQyxRQUFRLENBQWtCLENBQUM7U0FDbEQ7UUFDRCxzQkFBc0I7UUFDdEIsSUFBSSxhQUFxQixDQUFDO1FBQzFCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNwQixJ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