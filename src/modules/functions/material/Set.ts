import {
    arrMakeFlat,
    EAttribDataTypeStrs,
    EAttribNames,
    EEntType,
    GIModel,
    idsBreak,
    isEmptyArr,
    TEntTypeIdx,
    TId,
} from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import * as chk from '../../../_check_types';
import { _ELineMaterialType } from './_enum';



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
export function Set(__model__: GIModel, entities: TId|TId[], material: string|string[]): void {
    entities = arrMakeFlat(entities) as TId[];
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'matrial.Set';
        let ents_arr: TEntTypeIdx[];
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as TEntTypeIdx[];
            chk.checkArgs(fn_name, 'material', material, [chk.isStr, chk.isStrL]);
        } else {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        // --- Error Check ---
        let material_dict: object;
        let is_list = false;
        if (Array.isArray(material)) {
            is_list = true;
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material[0] as string) as object;
        } else {
            material_dict = __model__.modeldata.attribs.get.getModelAttribVal(material as string) as object;
        }
        if (!material_dict) {
            throw new Error('Material does not exist: ' + material);
        }
        const material_type = material_dict['type'];
        if (material_type === undefined) {
            throw new Error('Material is not valid: ' + material_dict);
        }
        if (material_type === _ELineMaterialType.BASIC || material_type === _ELineMaterialType.DASHED) {
            if (is_list) {
                throw new Error('A line can only have a single material: ' + material_dict);
            }
            _lineMaterial(__model__, ents_arr, material as string);
        } else {
            if (is_list) {
                if (material.length > 2) {
                    throw new Error('A maximum of materials can be specified, for the front and back of the polygon : ' + material);
                }
            } else {
                material = [material as string];
            }
            _meshMaterial(__model__, ents_arr, material as string[]);
        }
    }
}
function _lineMaterial(__model__: GIModel, ents_arr: TEntTypeIdx[], material: string): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PLINE, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PLINE, EAttribNames.MATERIAL, EAttribDataTypeStrs.STRING);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        const plines_i: number[] = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        for (const pline_i of plines_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.MATERIAL, material);
        }
    }
}
function _meshMaterial(__model__: GIModel, ents_arr: TEntTypeIdx[], material: string[]): void {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PGON, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PGON, EAttribNames.MATERIAL, EAttribDataTypeStrs.LIST);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i]: [number, number] = ent_arr as TEntTypeIdx;
        const pgons_i: number[] = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        for (const pgon_i of pgons_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.MATERIAL, material);
        }
    }
}
