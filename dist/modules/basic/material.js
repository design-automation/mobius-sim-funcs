/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
import { checkIDs, ID } from '../../_check_ids';
import * as chk from '../../_check_types';
import { EAttribNames, EAttribDataTypeStrs } from '@design-automation/mobius-sim/dist/geo-info/common';
import * as THREE from 'three';
import { EEntType } from '@design-automation/mobius-sim/dist/geo-info/common';
import { idsBreak } from '@design-automation/mobius-sim/dist/geo-info/common_id_funcs';
import { isEmptyArr, arrMakeFlat } from '@design-automation/mobius-sim/dist/util/arrs';
// ================================================================================================
export var _ESide;
(function (_ESide) {
    _ESide["FRONT"] = "front";
    _ESide["BACK"] = "back";
    _ESide["BOTH"] = "both";
})(_ESide || (_ESide = {}));
function _convertSelectESideToNum(select) {
    switch (select) {
        case _ESide.FRONT:
            return THREE.FrontSide;
        case _ESide.BACK:
            return THREE.BackSide;
        default:
            return THREE.DoubleSide;
    }
}
export var _Ecolors;
(function (_Ecolors) {
    _Ecolors["NO_VERT_COLORS"] = "none";
    _Ecolors["VERT_COLORS"] = "apply_rgb";
})(_Ecolors || (_Ecolors = {}));
function _convertSelectEcolorsToNum(select) {
    switch (select) {
        case _Ecolors.NO_VERT_COLORS:
            return 0;
        default:
            return 1;
    }
}
function _clamp01(val) {
    val = (val > 1) ? 1 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
function _clamp0100(val) {
    val = (val > 100) ? 100 : val;
    val = (val < 0) ? 0 : val;
    return val;
}
function _clampArr01(vals) {
    for (let i = 0; i < vals.length; i++) {
        vals[i] = _clamp01(vals[i]);
    }
}
var _ELineMaterialType;
(function (_ELineMaterialType) {
    _ELineMaterialType["BASIC"] = "LineBasicMaterial";
    _ELineMaterialType["DASHED"] = "LineDashedMaterial";
})(_ELineMaterialType || (_ELineMaterialType = {}));
var _EMeshMaterialType;
(function (_EMeshMaterialType) {
    _EMeshMaterialType["BASIC"] = "MeshBasicMaterial";
    _EMeshMaterialType["LAMBERT"] = "MeshLambertMaterial";
    _EMeshMaterialType["PHONG"] = "MeshPhongMaterial";
    _EMeshMaterialType["STANDARD"] = "MeshStandardMaterial";
    _EMeshMaterialType["PHYSICAL"] = "MeshPhysicalMaterial";
})(_EMeshMaterialType || (_EMeshMaterialType = {}));
function _setMaterialModelAttrib(__model__, name, settings_obj) {
    // if the material already exists, then existing settings will be added
    // but new settings will take precedence
    if (__model__.modeldata.attribs.query.hasModelAttrib(name)) {
        const exist_settings_obj = __model__.modeldata.attribs.get.getModelAttribVal(name);
        // check that the existing material is a Basic one
        if (exist_settings_obj['type'] !== _EMeshMaterialType.BASIC) {
            if (settings_obj['type'] !== exist_settings_obj['type']) {
                throw new Error('Error creating material: non-basic material with this name already exists.');
            }
        }
        // copy the settings from the existing material to the new material
        for (const key of Object.keys(exist_settings_obj)) {
            if (settings_obj[key] === undefined) {
                settings_obj[key] = exist_settings_obj[key];
            }
        }
    }
    else {
        __model__.modeldata.attribs.add.addAttrib(EEntType.MOD, name, EAttribDataTypeStrs.DICT);
    }
    // const settings_str: string = JSON.stringify(settings_obj);
    __model__.modeldata.attribs.set.setModelAttribVal(name, settings_obj);
}
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
export function Set(__model__, entities, material) {
    entities = arrMakeFlat(entities);
    if (!isEmptyArr(entities)) {
        // --- Error Check ---
        const fn_name = 'matrial.Set';
        let ents_arr;
        if (__model__.debug) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1, ID.isIDL2], null);
            chk.checkArgs(fn_name, 'material', material, [chk.isStr, chk.isStrL]);
        }
        else {
            ents_arr = idsBreak(entities);
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
        if (material_type === _ELineMaterialType.BASIC || material_type === _ELineMaterialType.DASHED) {
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
function _lineMaterial(__model__, ents_arr, material) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PLINE, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PLINE, EAttribNames.MATERIAL, EAttribDataTypeStrs.STRING);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        const plines_i = __model__.modeldata.geom.nav.navAnyToPline(ent_type, ent_i);
        for (const pline_i of plines_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PLINE, pline_i, EAttribNames.MATERIAL, material);
        }
    }
}
function _meshMaterial(__model__, ents_arr, material) {
    if (!__model__.modeldata.attribs.query.hasEntAttrib(EEntType.PGON, EAttribNames.MATERIAL)) {
        __model__.modeldata.attribs.add.addAttrib(EEntType.PGON, EAttribNames.MATERIAL, EAttribDataTypeStrs.LIST);
    }
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        const pgons_i = __model__.modeldata.geom.nav.navAnyToPgon(ent_type, ent_i);
        for (const pgon_i of pgons_i) {
            __model__.modeldata.attribs.set.setEntAttribVal(EEntType.PGON, pgon_i, EAttribNames.MATERIAL, material);
        }
    }
}
// ================================================================================================
/**
 * Creates a line material and saves it in the model attributes.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineBasicMaterial)
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/LineDashedMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * \n
 * In order to assign a material to polylines in the model, a polyline attribute called 'material'.
 * will be created. The value for each polyline must either be null, or must be a material name.
 * \n
 * For dashed lines, the 'dash_gap_scale' parameter can be set.
 * - If 'dash_gap_scale' is null will result in a continouse line.
 * - If 'dash_gap_scale' is a single number: dash = gap = dash_gap_scale, scale = 1.
 * - If 'dash_gap_scale' is a list of two numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = 1.
 * - If 'dash_gap_scale' is a list of three numbers: dash = dash_gap_scale[0], gap = dash_gap_scale[1], scale = dash_gap_scale[2].
 * \n
 * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms,
 * line widths cannot be rendered. As a result, lines width will always be set to 1.
 * \n
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param dash_gap_scale Size of the dash and gap, and a scale factor. (The gap and scale are optional.)
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
export function LineMat(__model__, name, color, dash_gap_scale, select_vert_colors) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.LineMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
        chk.checkArgs(fn_name, 'dash_gap_scale', dash_gap_scale, [chk.isNull, chk.isNum, chk.isNumL]);
    }
    // --- Error Check ---
    const vert_colors = _convertSelectEcolorsToNum(select_vert_colors);
    _clampArr01(color);
    let settings_obj;
    if (dash_gap_scale === null) {
        settings_obj = {
            // type: _ELineMaterialType.BASIC,
            // color: _getTjsColor(color),
            // vertexColors: vert_colors
            type: _ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: 0,
            gapSize: 0,
            scale: 1
        };
    }
    else {
        dash_gap_scale = Array.isArray(dash_gap_scale) ? dash_gap_scale : [dash_gap_scale];
        const dash = dash_gap_scale[0] === undefined ? 0 : dash_gap_scale[0];
        const gap = dash_gap_scale[1] === undefined ? dash : dash_gap_scale[1];
        const scale = dash_gap_scale[2] === undefined ? 1 : dash_gap_scale[2];
        settings_obj = {
            type: _ELineMaterialType.DASHED,
            color: color,
            vertexColors: vert_colors,
            dashSize: dash,
            gapSize: gap,
            scale: scale
        };
    }
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a basic mesh material and saves it in the model attributes.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)
 * \n
 * The color of the material can either ignore or apply the vertex rgb colors.
 * If 'apply' id selected, then the actual color will be a combination of the material color
 * and the vertex colors, as specified by the a vertex attribute called 'rgb'.
 * In such a case, if material color is set to white, then it will
 * have no effect, and the color will be defined by the vertex [r,g,b] values.
 * \n
 * Additional material properties can be set by calling the functions for the more advanced materials.
 * These include LambertMaterial, PhongMaterial, StandardMaterial, and Physical Material.
 * Each of these more advanced materials allows you to specify certain additional settings.
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'.
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param color The diffuse color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @param select_side Enum, select front, back, or both.
 * @param select_vert_colors Enum, select whether to use vertex colors if they exist.
 * @returns void
 */
export function MeshMat(__model__, name, color, opacity, select_side, select_vert_colors) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.MeshMat';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
        chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
    }
    // --- Error Check ---
    const side = _convertSelectESideToNum(select_side);
    const vert_colors = _convertSelectEcolorsToNum(select_vert_colors);
    opacity = _clamp01(opacity);
    const transparent = opacity < 1;
    _clampArr01(color);
    const settings_obj = {
        type: _EMeshMaterialType.BASIC,
        side: side,
        vertexColors: vert_colors,
        opacity: opacity,
        transparent: transparent,
        color: color
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a glass material with an opacity setting. The material will default to a Phong material.
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param opacity The opacity of the glass, between 0 (totally transparent) and 1 (totally opaque).
 * @returns void
 */
export function Glass(__model__, name, opacity) {
    // --- Error Check ---
    const fn_name = 'material.Glass';
    if (__model__.debug) {
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
    }
    // --- Error Check ---
    opacity = _clamp01(opacity);
    const transparent = opacity < 1;
    const settings_obj = {
        type: _EMeshMaterialType.PHONG,
        opacity: opacity,
        transparent: transparent,
        shininess: 90,
        color: [1, 1, 1],
        emissive: [0, 0, 0],
        side: THREE.DoubleSide
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Lambert material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @returns void
 */
export function Lambert(__model__, name, emissive) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Lambert';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    const settings_obj = {
        type: _EMeshMaterialType.LAMBERT,
        emissive: emissive
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Phong material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param specular The specular color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param shininess The shininess, between 0 and 100.
 * @returns void
 */
export function Phong(__model__, name, emissive, specular, shininess) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Phong';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        chk.checkArgs(fn_name, 'specular', specular, [chk.isColor]);
        chk.checkArgs(fn_name, 'shininess', shininess, [chk.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    _clampArr01(specular);
    shininess = Math.floor(_clamp0100(shininess));
    const settings_obj = {
        type: _EMeshMaterialType.PHONG,
        emissive: emissive,
        specular: specular,
        shininess: shininess
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Standard material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function Standard(__model__, name, emissive, roughness, metalness) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Standard';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
        chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    const settings_obj = {
        type: _EMeshMaterialType.STANDARD,
        emissive: emissive,
        roughness: roughness,
        metalness: metalness
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
/**
 * Creates a Physical material and saves it in the model attributes.
 * If a material with the same name already exits, these settings will be added to the existing material.
 * \n
 * [See the threejs docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
 * \n
 * In order to assign a material to polygons in the model, a polygon attribute called 'material'
 * needs to be created. The value for each polygon must either be null, or must be a material name.
 * \n
 * @param name The name of the material.
 * @param emissive The emissive color, as [r, g, b] values between 0 and 1. White is [1, 1, 1].
 * @param roughness The roughness, between 0 (smooth) and 1 (rough).
 * @param metalness The metalness, between 0 (non-metalic) and 1 (metalic).
 * @param reflectivity The reflectivity, between 0 (non-reflective) and 1 (reflective).
 * @returns void
 */
export function Physical(__model__, name, emissive, roughness, metalness, reflectivity) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'material.Physical';
        chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
        chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
        chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
        chk.checkArgs(fn_name, 'reflectivity', reflectivity, [chk.isNum]);
    }
    // --- Error Check ---
    _clampArr01(emissive);
    roughness = _clamp01(roughness);
    metalness = _clamp01(metalness);
    reflectivity = _clamp01(reflectivity);
    const settings_obj = {
        type: _EMeshMaterialType.PHYSICAL,
        emissive: emissive,
        roughness: roughness,
        metalness: metalness,
        reflectivity: reflectivity
    };
    _setMaterialModelAttrib(__model__, name, settings_obj);
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9iYXNpYy9tYXRlcmlhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFaEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQVEsWUFBWSxFQUFFLG1CQUFtQixFQUFVLE1BQU0sb0RBQW9ELENBQUM7QUFDckgsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFPLFFBQVEsRUFBZSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSw2REFBNkQsQ0FBQztBQUN2RixPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRXZGLG1HQUFtRztBQUNuRyxNQUFNLENBQU4sSUFBWSxNQUlYO0FBSkQsV0FBWSxNQUFNO0lBQ2QseUJBQWlCLENBQUE7SUFDakIsdUJBQWUsQ0FBQTtJQUNmLHVCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUpXLE1BQU0sS0FBTixNQUFNLFFBSWpCO0FBQ0QsU0FBUyx3QkFBd0IsQ0FBQyxNQUFjO0lBQzVDLFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyxNQUFNLENBQUMsS0FBSztZQUNiLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUMzQixLQUFLLE1BQU0sQ0FBQyxJQUFJO1lBQ1osT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQzFCO1lBQ0ksT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO0tBQy9CO0FBQ0wsQ0FBQztBQUNELE1BQU0sQ0FBTixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDaEIsbUNBQXlCLENBQUE7SUFDekIscUNBQTJCLENBQUE7QUFDL0IsQ0FBQyxF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