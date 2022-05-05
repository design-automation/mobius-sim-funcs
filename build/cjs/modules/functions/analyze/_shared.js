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
exports._cyGetPosisAndElements = exports._cytoscapeGetElements = exports._cytoscapeWeightFn = exports._getUniquePosis = exports._calcExposure = exports._solarRaysIndirectTjs = exports._solarRaysDirectTjs = exports._rayOrisDirsTjs = exports._skyRayDirsTjs = exports.degToRad = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
function degToRad(deg) {
    if (Array.isArray(deg)) {
        return deg.map((a_deg) => degToRad(a_deg));
    }
    return deg * (Math.PI / 180);
}
exports.degToRad = degToRad;
function _skyRayDirsTjs(detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    // calc vectors
    const vecs = [];
    // THREE JS UPDATE --> EDITED
    // for (const vec of hedron_tjs.vertices) {
    //     // vec.applyAxisAngle(YAXIS, Math.PI / 2);
    //     if (vec.z > -1e-6) {
    //         vecs.push(vec);
    //     }
    // }
    let vec = [];
    for (const coord of hedron_tjs.getAttribute("position").array) {
        vec.push(coord);
        if (vec.length === 3) {
            if (vec[2] > -1e-6) {
                vecs.push(new THREE.Vector3(...vec));
            }
            vec = [];
        }
    }
    return vecs;
}
exports._skyRayDirsTjs = _skyRayDirsTjs;
function _rayOrisDirsTjs(__model__, origins, offset) {
    const vectors_tjs = [];
    const is_xyz = (0, mobius_sim_1.isXYZ)(origins[0]);
    const is_ray = (0, mobius_sim_1.isRay)(origins[0]);
    const is_pln = (0, mobius_sim_1.isPlane)(origins[0]);
    for (const origin of origins) {
        let origin_xyz = null;
        let normal_xyz = null;
        if (is_xyz) {
            origin_xyz = origin;
            normal_xyz = [0, 0, 1];
        }
        else if (is_ray) {
            origin_xyz = origin[0];
            normal_xyz = (0, mobius_sim_1.vecNorm)(origin[1]);
        }
        else if (is_pln) {
            origin_xyz = origin[0];
            normal_xyz = (0, mobius_sim_1.vecCross)(origin[1], origin[2]);
        }
        else {
            throw new Error("analyze.Solar: origins arg has invalid values");
        }
        const normal_tjs = new THREE.Vector3(...normal_xyz);
        const origin_offset_xyz = (0, mobius_sim_1.vecAdd)(origin_xyz, (0, mobius_sim_1.vecMult)(normal_xyz, offset));
        const origin_tjs = new THREE.Vector3(...origin_offset_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
exports._rayOrisDirsTjs = _rayOrisDirsTjs;
function _solarRot(day_ang, day, hour_ang, hour, latitude, north) {
    const vec = new THREE.Vector3(0, 0, -1);
    vec.applyAxisAngle(mobius_sim_1.XAXIS, day_ang * day);
    vec.applyAxisAngle(mobius_sim_1.YAXIS, hour_ang * hour);
    vec.applyAxisAngle(mobius_sim_1.XAXIS, latitude);
    vec.applyAxisAngle(mobius_sim_1.ZAXIS, -north);
    return vec;
}
function _solarRaysDirectTjs(latitude, north, detail) {
    const directions = [];
    // set the level of detail
    // const day_step = [182 / 4, 182 / 5, 182 / 6, 182 / 7, 182 / 8, 182 / 9, 182 / 10][detail];
    const day_step = [182 / 3, 182 / 6, 182 / 9, 182 / 12][detail];
    const num_day_steps = Math.round(182 / day_step) + 1;
    // const hour_step = [0.25 * 6, 0.25 * 5, 0.25 * 4, 0.25 * 3, 0.25 * 2, 0.25 * 1, 0.25 * 0.5][detail];
    const hour_step = [0.25 * 6, 0.25 * 4, 0.25 * 1, 0.25 * 0.5][detail];
    // get the angles in radians
    const day_ang_rad = degToRad(47) / 182;
    const hour_ang_rad = (2 * Math.PI) / 24;
    // get the atitude angle in radians
    const latitude_rad = degToRad(latitude);
    // get the angle from y-axis to north vector in radians
    const north_rad = (0, mobius_sim_1.vecAng2)([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // create the vectors
    for (let day_count = 0; day_count < num_day_steps; day_count++) {
        const day = -91 + day_count * day_step;
        const one_day_path = [];
        // get sunrise
        let sunrise = 0;
        let sunset = 0;
        for (let hour = 0; hour < 24; hour = hour + 0.1) {
            const sunrise_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (sunrise_vec.z > -1e-6) {
                sunrise = hour;
                sunset = 24 - hour;
                one_day_path.push(sunrise_vec);
                break;
            }
        }
        // morning sun path, count down from midday
        for (let hour = 12; hour > sunrise; hour = hour - hour_step) {
            const am_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (am_vec.z > -1e-6) {
                one_day_path.splice(1, 0, am_vec);
            }
            else {
                break;
            }
        }
        // afternoon sunpath, count up from midday
        for (let hour = 12 + hour_step; hour < sunset; hour = hour + hour_step) {
            const pm_vec = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (pm_vec.z > -1e-6) {
                one_day_path.push(pm_vec);
            }
            else {
                break;
            }
        }
        // sunset
        const sunset_vec = _solarRot(day_ang_rad, day, hour_ang_rad, sunset, latitude_rad, north_rad);
        one_day_path.push(sunset_vec);
        // add it to the list
        directions.push(one_day_path);
    }
    // console.log("num rays = ", arrMakeFlat(directions).length);
    return directions;
}
exports._solarRaysDirectTjs = _solarRaysDirectTjs;
function _solarRaysIndirectTjs(latitude, north, detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    const solar_offset = Math.cos(degToRad(66.5));
    // get the atitude angle in radians
    const latitude_rad = degToRad(latitude);
    // get the angle from y-axis to north vector in radians
    const north_rad = (0, mobius_sim_1.vecAng2)([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // calc vectors
    const indirect_vecs = [];
    // THREE JS UPDATE --> EDITED
    // for (const vec of hedron_tjs.vertices) {
    //     if (Math.abs(vec.y) > solar_offset) {
    //         vec.applyAxisAngle(XAXIS, latitude_rad);
    //         vec.applyAxisAngle(ZAXIS, -north_rad);
    //         if (vec.z > -1e-6) {
    //             indirect_vecs.push(vec);
    //         }
    //     }
    // }
    let coordList = [];
    for (const coord of hedron_tjs.getAttribute("position").array) {
        coordList.push(coord);
        if (coordList.length === 3) {
            const vec = new THREE.Vector3(...coordList);
            if (Math.abs(vec.y) > solar_offset) {
                vec.applyAxisAngle(mobius_sim_1.XAXIS, latitude_rad);
                vec.applyAxisAngle(mobius_sim_1.ZAXIS, -north_rad);
                if (vec.z > -1e-6) {
                    indirect_vecs.push(vec);
                }
            }
            coordList = [];
        }
    }
    // console.log("num rays = ", indirect_vecs.length);
    return indirect_vecs;
}
exports._solarRaysIndirectTjs = _solarRaysIndirectTjs;
// calc the max solar exposure for a point with no obstructions facing straight up
function _calcMaxExposure(directions_tjs, weighted) {
    if (!weighted) {
        return directions_tjs.length;
    }
    let result = 0;
    const normal_tjs = new THREE.Vector3(0, 0, 1);
    for (const direction_tjs of directions_tjs) {
        // calc the weighted result based on the angle between the dir and normal
        // this applies the cosine weighting rule
        const result_weighted = normal_tjs.dot(direction_tjs);
        if (result_weighted > 0) {
            result = result + result_weighted;
        }
    }
    return result;
}
function _calcExposure(origins_normals_tjs, directions_tjs, mesh_tjs, limits, weighted) {
    const results = [];
    const result_max = _calcMaxExposure(directions_tjs, weighted);
    for (const [origin_tjs, normal_tjs] of origins_normals_tjs) {
        let result = 0;
        for (const direction_tjs of directions_tjs) {
            const dot_normal_direction = normal_tjs.dot(direction_tjs);
            if (dot_normal_direction > 0) {
                const ray_tjs = new THREE.Raycaster(origin_tjs, direction_tjs, limits[0], limits[1]);
                const isects = ray_tjs.intersectObject(mesh_tjs, false);
                if (isects.length === 0) {
                    if (weighted) {
                        // this applies the cosine weighting rule
                        result = result + dot_normal_direction;
                    }
                    else {
                        // this applies no cosine weighting
                        result = result + 1;
                    }
                }
            }
        }
        results.push(result / result_max);
    }
    return results;
}
exports._calcExposure = _calcExposure;
// ================================================================================================
function _getUniquePosis(__model__, ents_arr) {
    if (ents_arr.length === 0) {
        return [];
    }
    const set_posis_i = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    return Array.from(set_posis_i);
}
exports._getUniquePosis = _getUniquePosis;
function _cytoscapeWeightFn(edge) {
    return edge.data("weight");
}
exports._cytoscapeWeightFn = _cytoscapeWeightFn;
function _cytoscapeWeightFn2(edge) {
    const weight = edge.data("weight");
    if (weight < 1) {
        return 1;
    }
    return weight;
}
function _cytoscapeGetElements(__model__, ents_arr, source_posis_i, target_posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(mobius_sim_1.EEntType.EDGE, "weight") === mobius_sim_1.EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i = new Set();
    // posis, starts with cource and target
    const set_posis_i = new Set(source_posis_i);
    for (const target_posi_i of target_posis_i) {
        set_posis_i.add(target_posi_i);
    }
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            set_edges_i.add(edge_i);
        }
        const posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // create elements
    const elements = [];
    for (const posi_i of Array.from(set_posis_i)) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.EDGE, edge_i, "weight");
            }
            else {
                const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = (0, mobius_sim_1.distance)(c0, c1);
            }
            elements.push({
                data: { id: "e" + edge_i, source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i },
            });
        }
    }
    else {
        // undirected
        const map_edges_ab = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id = "e_" + edge_posis_i[0].toString() + "_" + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj["data"]["idx2"] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            }
            else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.EDGE, edge_i, "weight");
                }
                else {
                    const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = (0, mobius_sim_1.distance)(c0, c1);
                }
                const obj = {
                    data: {
                        id: undir_edge_id,
                        source: edge_posis_i[0].toString(),
                        target: edge_posis_i[1].toString(),
                        weight: weight,
                        idx: edge_i,
                        idx2: null,
                    },
                };
                map_edges_ab.set(undir_edge_id, obj);
                elements.push(obj);
            }
        }
    }
    return elements;
}
exports._cytoscapeGetElements = _cytoscapeGetElements;
// ================================================================================================
function _cyGetPosisAndElements(__model__, ents_arr, posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(mobius_sim_1.EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(mobius_sim_1.EEntType.EDGE, "weight") === mobius_sim_1.EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i = new Set();
    // posis, starts with posis_i
    const set_posis_i = new Set(posis_i);
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const n_edges_i = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of n_edges_i) {
            set_edges_i.add(edge_i);
        }
        const n_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of n_posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // all unique posis
    const uniq_posis_i = Array.from(set_posis_i);
    // create elements
    const elements = [];
    for (const posi_i of uniq_posis_i) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.EDGE, edge_i, "weight");
            }
            else {
                // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = 1; // distance(c0, c1);
            }
            elements.push({
                data: { id: "e" + edge_i, source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i },
            });
        }
    }
    else {
        // undirected
        const map_edges_ab = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(mobius_sim_1.EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id = "e_" + edge_posis_i[0].toString() + "_" + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj["data"]["idx2"] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            }
            else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.EDGE, edge_i, "weight");
                }
                else {
                    // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = 1; // distance(c0, c1);
                }
                const obj = {
                    data: {
                        id: undir_edge_id,
                        source: edge_posis_i[0].toString(),
                        target: edge_posis_i[1].toString(),
                        weight: weight,
                        idx: edge_i,
                        idx2: null,
                    },
                };
                map_edges_ab.set(undir_edge_id, obj);
                elements.push(obj);
            }
        }
    }
    return [elements, uniq_posis_i];
}
exports._cyGetPosisAndElements = _cyGetPosisAndElements;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL19zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFxQnVDO0FBRXZDLDZDQUErQjtBQUcvQixTQUFnQixRQUFRLENBQUMsR0FBc0I7SUFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFhLENBQUM7S0FDMUQ7SUFDRCxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUxELDRCQUtDO0FBQ0QsU0FBZ0IsY0FBYyxDQUFDLE1BQWM7SUFDekMsTUFBTSxVQUFVLEdBQThCLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0YsZUFBZTtJQUNmLE1BQU0sSUFBSSxHQUFvQixFQUFFLENBQUM7SUFDakMsNkJBQTZCO0lBQzdCLDJDQUEyQztJQUMzQyxpREFBaUQ7SUFDakQsMkJBQTJCO0lBQzNCLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsSUFBSTtJQUVKLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN2QixLQUFLLE1BQU0sS0FBSyxJQUFrQixVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRTtRQUN6RSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcs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