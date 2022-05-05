import { distance, EAttribDataTypeStrs, EEntType, isPlane, isRay, isXYZ, vecAdd, vecAng2, vecCross, vecMult, vecNorm, XAXIS, YAXIS, ZAXIS, } from '@design-automation/mobius-sim';
import * as THREE from 'three';
export function degToRad(deg) {
    if (Array.isArray(deg)) {
        return deg.map((a_deg) => degToRad(a_deg));
    }
    return deg * (Math.PI / 180);
}
export function _skyRayDirsTjs(detail) {
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
export function _rayOrisDirsTjs(__model__, origins, offset) {
    const vectors_tjs = [];
    const is_xyz = isXYZ(origins[0]);
    const is_ray = isRay(origins[0]);
    const is_pln = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz = null;
        let normal_xyz = null;
        if (is_xyz) {
            origin_xyz = origin;
            normal_xyz = [0, 0, 1];
        }
        else if (is_ray) {
            origin_xyz = origin[0];
            normal_xyz = vecNorm(origin[1]);
        }
        else if (is_pln) {
            origin_xyz = origin[0];
            normal_xyz = vecCross(origin[1], origin[2]);
        }
        else {
            throw new Error("analyze.Solar: origins arg has invalid values");
        }
        const normal_tjs = new THREE.Vector3(...normal_xyz);
        const origin_offset_xyz = vecAdd(origin_xyz, vecMult(normal_xyz, offset));
        const origin_tjs = new THREE.Vector3(...origin_offset_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
function _solarRot(day_ang, day, hour_ang, hour, latitude, north) {
    const vec = new THREE.Vector3(0, 0, -1);
    vec.applyAxisAngle(XAXIS, day_ang * day);
    vec.applyAxisAngle(YAXIS, hour_ang * hour);
    vec.applyAxisAngle(XAXIS, latitude);
    vec.applyAxisAngle(ZAXIS, -north);
    return vec;
}
export function _solarRaysDirectTjs(latitude, north, detail) {
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
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
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
export function _solarRaysIndirectTjs(latitude, north, detail) {
    const hedron_tjs = new THREE.IcosahedronGeometry(1, detail + 2);
    const solar_offset = Math.cos(degToRad(66.5));
    // get the atitude angle in radians
    const latitude_rad = degToRad(latitude);
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
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
                vec.applyAxisAngle(XAXIS, latitude_rad);
                vec.applyAxisAngle(ZAXIS, -north_rad);
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
export function _calcExposure(origins_normals_tjs, directions_tjs, mesh_tjs, limits, weighted) {
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
// ================================================================================================
export function _getUniquePosis(__model__, ents_arr) {
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
export function _cytoscapeWeightFn(edge) {
    return edge.data("weight");
}
function _cytoscapeWeightFn2(edge) {
    const weight = edge.data("weight");
    if (weight < 1) {
        return 1;
    }
    return weight;
}
export function _cytoscapeGetElements(__model__, ents_arr, source_posis_i, target_posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, "weight") === EAttribDataTypeStrs.NUMBER;
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
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight");
            }
            else {
                const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = distance(c0, c1);
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
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight");
                }
                else {
                    const c0 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    const c1 = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                    weight = distance(c0, c1);
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
// ================================================================================================
export function _cyGetPosisAndElements(__model__, ents_arr, posis_i, directed) {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, "weight") === EAttribDataTypeStrs.NUMBER;
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
            const edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight");
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
            let edge_posis_i = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
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
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL19zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixtQkFBbUIsRUFDbkIsUUFBUSxFQUVSLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQU1MLE1BQU0sRUFDTixPQUFPLEVBQ1AsUUFBUSxFQUNSLE9BQU8sRUFDUCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLEdBQ1IsTUFBTSwrQkFBK0IsQ0FBQztBQUV2QyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcvQixNQUFNLFVBQVUsUUFBUSxDQUFDLEdBQXNCO0lBQzNDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBYSxDQUFDO0tBQzFEO0lBQ0QsT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFDRCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQWM7SUFDekMsTUFBTSxVQUFVLEdBQThCLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0YsZUFBZTtJQUNmLE1BQU0sSUFBSSxHQUFvQixFQUFFLENBQUM7SUFDakMsNkJBQTZCO0lBQzdCLDJDQUEyQztJQUMzQyxpREFBaUQ7SUFDakQsMkJBQTJCO0lBQzNCLDBCQUEwQjtJQUMxQixRQUFRO0lBQ1IsSUFBSTtJQUVKLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztJQUN2QixLQUFLLE1BQU0sS0FBSyxJQUFrQixVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRTtRQUN6RSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDWjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNELE1BQU0sVUFBVSxlQUFlLENBQUMsU0FBa0IsRUFBRSxPQUFtQyxFQUFFLE1BQWM7SUFDbkcsTUFBTSxXQUFXLEdBQXFDLEVBQUUsQ0FBQztJQUN6RCxNQUFNLE1BQU0sR0FBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sTUFBTSxHQUFZLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixJQUFJLFVBQVUsR0FBUyxJQUFJLENBQUM7UUFDNUIsSUFBSSxVQUFVLEdBQVMsSUFBSSxDQUFDO1FBQzVCLElBQUksTUFBTSxFQUFFO1lBQ1IsVUFBVSxHQUFHLE1BQWMsQ0FBQztZQUM1QixVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzFCO2FBQU0sSUFBSSxNQUFNLEVBQUU7WUFDZixVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBUyxDQUFDO1lBQy9CLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLE1BQU0sRUFBRTtZQUNmLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFTLENBQUM7WUFDL0IsVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBUyxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUNwRTtRQUNELE1BQU0sVUFBVSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUNuRSxNQUFNLGlCQUFpQixHQUFTLE1BQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLE1BQU0sVUFBVSxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3ZCLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxPQUFlLEVBQUUsR0FBVyxFQUFFLFFBQWdCLEVBQUUsSUFBWSxFQUFFLFFBQWdCLEVBQUUsS0FBYTtJQUM1RyxNQUFNLEdBQUcsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDekMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzNDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBQ0QsTUFBTSxVQUFVLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsS0FBVSxFQUFFLE1BQWM7SUFDNUUsTUFBTSxVQUFVLEdBQXNCLEVBQUUsQ0FBQztJQUN6QywwQkFBMEI7SUFDMUIsNkZBQTZGO0lBQzdGLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELE1BQU0sYUFBYSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3RCxzR0FBc0c7SUFDdEcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckUsNEJBQTRCO0lBQzVCLE1BQU0sV0FBVyxHQUFZLFFBQVEsQ0FBQyxFQUFFLENBQVksR0FBRyxHQUFHLENBQUM7SUFDM0QsTUFBTSxZQUFZLEdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoRCxtQ0FBbUM7SUFDbkMsTUFBTSxZQUFZLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBVyxDQUFDO0lBQzFELHVEQUF1RDtJQUN2RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxxQkFBcUI7SUFDckIsS0FBSyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUUsU0FBUyxHQUFHLGFBQWEsRUFBRSxTQUFTLEVBQUUsRUFBRTtRQUM1RCxNQUFNLEdBQUcsR0FBVyxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQy9DLE1BQU0sWUFBWSxHQUFvQixFQUFFLENBQUM7UUFDekMsY0FBYztRQUNkLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDZixLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxFQUFFO1lBQzdDLE1BQU0sV0FBVyxHQUFrQixTQUFTLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1RyxJQUFJLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZCLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQy9CLE1BQU07YUFDVDtTQUNKO1FBQ0QsMkNBQTJDO1FBQzNDLEtBQUssSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxPQUFPLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLEVBQUU7WUFDekQsTUFBTSxNQUFNLEdBQWtCLFNBQVMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDbEIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNO2dCQUNILE1BQU07YUFDVDtTQUNKO1FBQ0QsMENBQTBDO1FBQzFDLEtBQUssSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRSxJQUFJLEdBQUcsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsU0FBUyxFQUFFO1lBQ3BFLE1BQU0sTUFBTSxHQUFrQixTQUFTLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN2RyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xCLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDN0I7aUJBQU07Z0JBQ0gsTUFBTTthQUNUO1NBQ0o7UUFDRCxTQUFTO1FBQ1QsTUFBTSxVQUFVLEdBQWtCLFNBQVMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdHLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUIscUJBQXFCO1FBQ3JCLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDakM7SUFDRCw4REFBOEQ7SUFDOUQsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQztBQUNELE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxRQUFnQixFQUFFLEtBQVUsRUFBRSxNQUFjO0lBQzlFLE1BQU0sVUFBVSxHQUE4QixJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBVyxDQUFDLENBQUM7SUFDeEQsbUNBQW1DO0lBQ25DLE1BQU0sWUFBWSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQVcsQ0FBQztJQUMxRCx1REFBdUQ7SUFDdkQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsZUFBZTtJQUNmLE1BQU0sYUFBYSxHQUFvQixFQUFFLENBQUM7SUFFMUMsNkJBQTZCO0lBQzdCLDJDQUEyQztJQUMzQyw0Q0FBNEM7SUFDNUMsbURBQW1EO0lBQ25ELGlEQUFpRDtJQUNqRCwrQkFBK0I7SUFDL0IsdUNBQXVDO0lBQ3ZDLFlBQVk7SUFDWixRQUFRO0lBQ1IsSUFBSTtJQUNKLElBQUksU0FBUyxHQUFhLEVBQUUsQ0FBQztJQUM3QixLQUFLLE1BQU0sS0FBSyxJQUFrQixVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRTtRQUN6RSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7WUFDNUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLEVBQUU7Z0JBQ2hDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN4QyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7b0JBQ2YsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDM0I7YUFDSjtZQUNELFNBQVMsR0FBRyxFQUFFLENBQUM7U0FDbEI7S0FDSjtJQUVELG9EQUFvRDtJQUNwRCxPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBQ0Qsa0ZBQWtGO0FBQ2xGLFNBQVMsZ0JBQWdCLENBQUMsY0FBK0IsRUFBRSxRQUFpQjtJQUN4RSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ1gsT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxVQUFVLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdELEtBQUssTUFBTSxhQUFhLElBQUksY0FBYyxFQUFFO1FBQ3hDLHlFQUF5RTtRQUN6RSx5Q0FBeUM7UUFDekMsTUFBTSxlQUFlLEdBQVcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RCxJQUFJLGVBQWUsR0FBRyxDQUFDLEVBQUU7WUFDckIsTUFBTSxHQUFHLE1BQU0sR0FBRyxlQUFlLENBQUM7U0FDckM7S0FDSjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDRCxNQUFNLFVBQVUsYUFBYSxDQUN6QixtQkFBcUQsRUFDckQsY0FBK0IsRUFDL0IsUUFBb0IsRUFDcEIsTUFBd0IsRUFDeEIsUUFBaUI7SUFFakIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLE1BQU0sVUFBVSxHQUFXLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0RSxLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLElBQUksbUJBQW1CLEVBQUU7UUFDeEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsS0FBSyxNQUFNLGFBQWEsSUFBSSxjQUFjLEVBQUU7WUFDeEMsTUFBTSxvQkFBb0IsR0FBVyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ25FLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxFQUFFO2dCQUMxQixNQUFNLE9BQU8sR0FBb0IsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RyxNQUFNLE1BQU0sR0FBeUIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzlFLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQ3JCLElBQUksUUFBUSxFQUFFO3dCQUNWLHlDQUF5Qzt3QkFDekMsTUFBTSxHQUFHLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ0gsbUNBQW1DO3dCQUNuQyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztxQkFDdkI7aUJBQ0o7YUFDSjtTQUNKO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBQ0QsbUdBQW1HO0FBRW5HLE1BQU0sVUFBVSxlQUFlLENBQUMsU0FBa0IsRUFBRSxRQUF1QjtJQUN2RSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFDRCxNQUFNLFdBQVcsR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksUUFBUSxFQUFFO1FBQ3RDLE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JGLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7S0FDSjtJQUNELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBQ0QsTUFBTSxVQUFVLGtCQUFrQixDQUFDLElBQTRCO0lBQzNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBQ0QsU0FBUyxtQkFBbUIsQ0FBQyxJQUE0QjtJQUNyRCxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNaLE9BQU8sQ0FBQyxDQUFDO0tBQ1o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBQ0QsTUFBTSxVQUFVLHFCQUFxQixDQUNqQyxTQUFrQixFQUNsQixRQUF1QixFQUN2QixjQUF3QixFQUN4QixjQUF3QixFQUN4QixRQUFpQjtJQUVqQixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRTtRQUN6RSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7S0FDbkk7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxXQUFXLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0MsdUNBQXVDO0lBQ3ZDLE1BQU0sV0FBVyxHQUFnQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN6RCxLQUFLLE1BQU0sYUFBYSxJQUFJLGNBQWMsRUFBRTtRQUN4QyxXQUFXLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ2xDO0lBQ0QsVUFBVTtJQUNWLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxRQUFRLEVBQUU7UUFDdEMsTUFBTSxPQUFPLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckYsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtRQUNELE1BQU0sT0FBTyxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JGLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzFCLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7S0FDSjtJQUNELGtCQUFrQjtJQUNsQixNQUFNLFFBQVEsR0FBVSxFQUFFLENBQUM7SUFDM0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQzFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDbkU7SUFDRCxJQUFJLFFBQVEsRUFBRTtRQUNWLFdBQVc7UUFDWCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDMUMsTUFBTSxZQUFZLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hHLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFJLGlCQUFpQixFQUFFO2dCQUNuQixNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQVcsQ0FBQzthQUN2RztpQkFBTTtnQkFDSCxNQUFNLEVBQUUsR0FBUyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixNQUFNLEVBQUUsR0FBUyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixNQUFNLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUM3QjtZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTthQUNsSSxDQUFDLENBQUM7U0FDTjtLQUNKO1NBQU07UUFDSCxhQUFhO1FBQ2IsTUFBTSxZQUFZLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDakQsS0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzFDLElBQUksWUFBWSxHQUFhLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5RixZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRyxNQUFNLGFBQWEsR0FBVyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkcsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNqQyxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM1QyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUM3QixnRkFBZ0Y7YUFDbkY7aUJBQU07Z0JBQ0gsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNqQixJQUFJLGlCQUFpQixFQUFFO29CQUNuQixNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQVcsQ0FBQztpQkFDdkc7cUJBQU07b0JBQ0gsTUFBTSxFQUFFLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEYsTUFBTSxFQUFFLEdBQVMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEYsTUFBTSxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQzdCO2dCQUNELE1BQU0sR0FBRyxHQUFHO29CQUNSLElBQUksRUFBRTt3QkFDRixFQUFFLEVBQUUsYUFBYTt3QkFDakIsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQ2xDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO3dCQUNsQyxNQUFNLEVBQUUsTUFBTTt3QkFDZCxHQUFHLEVBQUUsTUFBTTt3QkFDWCxJQUFJLEVBQUUsSUFBSTtxQkFDYjtpQkFDSixDQUFDO2dCQUNGLFlBQVksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0o7S0FDSjtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFDRCxtR0FBbUc7QUFDbkcsTUFBTSxVQUFVLHNCQUFzQixDQUNsQyxTQUFrQixFQUNsQixRQUF1QixFQUN2QixPQUFpQixFQUNqQixRQUFpQjtJQUVqQixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM5QixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRTtRQUN6RSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7S0FDbkk7SUFDRCxzQkFBc0I7SUFDdEIsTUFBTSxXQUFXLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0MsNkJBQTZCO0lBQzdCLE1BQU0sV0FBVyxHQUFnQixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxVQUFVO0lBQ1YsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUN0QyxNQUFNLFNBQVMsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RixLQUFLLE1BQU0sTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUM1QixXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsTUFBTSxTQUFTLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsS0FBSyxNQUFNLE1BQU0sSUFBSSxTQUFTLEVBQUU7WUFDNUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjtLQUNKO0lBQ0QsbUJBQW1CO0lBQ25CLE1BQU0sWUFBWSxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdkQsa0JBQWtCO0lBQ2xCLE1BQU0sUUFBUSxHQUFrQyxFQUFFLENBQUM7SUFDbkQsS0FBSyxNQUFNLE1BQU0sSUFBSSxZQUFZLEVBQUU7UUFDL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNuRTtJQUNELElBQUksUUFBUSxFQUFFO1FBQ1YsV0FBVztRQUNYLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMxQyxNQUFNLFlBQVksR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDaEcsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLElBQUksaUJBQWlCLEVBQUU7Z0JBQ25CLE1BQU0sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBVyxDQUFDO2FBQ3ZHO2lCQUFNO2dCQUNILHFGQUFxRjtnQkFDckYscUZBQXFGO2dCQUNyRixNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0JBQW9CO2FBQ25DO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDVixJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO2FBQ2xJLENBQUMsQ0FBQztTQUNOO0tBQ0o7U0FBTTtRQUNILGFBQWE7UUFDYixNQUFNLFlBQVksR0FBcUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNqRCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxZQUFZLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlGLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLE1BQU0sYUFBYSxHQUFXLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuRyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2pDLE1BQU0sR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQzVDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQzdCLGdGQUFnRjthQUNuRjtpQkFBTTtnQkFDSCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLElBQUksaUJBQWlCLEVBQUU7b0JBQ25CLE1BQU0sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBVyxDQUFDO2lCQUN2RztxQkFBTTtvQkFDSCxxRkFBcUY7b0JBQ3JGLHFGQUFxRjtvQkFDckYsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtpQkFDbkM7Z0JBQ0QsTUFBTSxHQUFHLEdBQUc7b0JBQ1IsSUFBSSxFQUFFO3dCQUNGLEVBQUUsRUFBRSxhQUFhO3dCQUNqQixNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTt3QkFDbEMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQ2xDLE1BQU0sRUFBRSxNQUFNO3dCQUNkLEdBQUcsRUFBRSxNQUFNO3dCQUNYLElBQUksRUFBRSxJQUFJO3FCQUNiO2lCQUNKLENBQUM7Z0JBQ0YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7U0FDSjtLQUNKO0lBQ0QsT0FBTyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwQyxDQUFDIn0=