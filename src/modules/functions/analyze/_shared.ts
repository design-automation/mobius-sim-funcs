import {
    distance,
    EAttribDataTypeStrs,
    EEntType,
    GIModel,
    isPlane,
    isRay,
    isXYZ,
    TEntTypeIdx,
    TPlane,
    TRay,
    Txy,
    Txyz,
    vecAdd,
    vecAng2,
    vecCross,
    vecDot,
    vecMult,
    vecNorm,
    XAXIS,
    YAXIS,
    ZAXIS,
} from '@design-automation/mobius-sim';
import cytoscape from 'cytoscape';
import * as THREE from 'three';

export function degToRad(deg: number | number[]): number | number[] {
    if (Array.isArray(deg)) {
        return deg.map((a_deg) => degToRad(a_deg)) as number[];
    }
    return deg * (Math.PI / 180);
}
// export function _skyRayDirsTjs(detail: number): THREE.Vector3[] {
//     const hedron_tjs: THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, detail + 2);
//     // calc vectors
//     const vecs: THREE.Vector3[] = [];
//     // THREE JS UPDATE --> EDITED
//     // for (const vec of hedron_tjs.vertices) {
//     //     // vec.applyAxisAngle(YAXIS, Math.PI / 2);
//     //     if (vec.z > -1e-6) {
//     //         vecs.push(vec);
//     //     }
//     // }

//     let vec: number[] = [];
//     for (const coord of <Float32Array>hedron_tjs.getAttribute("position").array) {
//         vec.push(coord);
//         if (vec.length === 3) {
//             if (vec[2] > -1e-6) {
//                 vecs.push(new THREE.Vector3(...vec));
//             }
//             vec = [];
//         }
//     }
//     return vecs;
// }
export function _rayOrisDirsTjs(__model__: GIModel, origins: Txyz[] | TRay[] | TPlane[], offset: number): [THREE.Vector3, THREE.Vector3][] {
    const vectors_tjs: [THREE.Vector3, THREE.Vector3][] = [];
    const is_xyz: boolean = isXYZ(origins[0]);
    const is_ray: boolean = isRay(origins[0]);
    const is_pln: boolean = isPlane(origins[0]);
    for (const origin of origins) {
        let origin_xyz: Txyz = null;
        let normal_xyz: Txyz = null;
        if (is_xyz) {
            origin_xyz = origin as Txyz;
            normal_xyz = [0, 0, 1];
        } else if (is_ray) {
            origin_xyz = origin[0] as Txyz;
            normal_xyz = vecNorm(origin[1] as Txyz);
        } else if (is_pln) {
            origin_xyz = origin[0] as Txyz;
            normal_xyz = vecCross(origin[1] as Txyz, origin[2] as Txyz);
        } else {
            throw new Error("Sensor has invalid values");
        }
        const normal_tjs: THREE.Vector3 = new THREE.Vector3(...normal_xyz);
        const origin_offset_xyz: Txyz = vecAdd(origin_xyz, vecMult(normal_xyz, offset));
        const origin_tjs: THREE.Vector3 = new THREE.Vector3(...origin_offset_xyz);
        vectors_tjs.push([origin_tjs, normal_tjs]);
    }
    return vectors_tjs;
}
export function _getSensorRays(
        sensors: TRay[] | TPlane[] | TRay[][] | TPlane[][],
        offset: number): [TRay[], TRay[], boolean] {
    const is_ray: boolean = isRay(sensors[0]);
    const is_pln: boolean = isPlane(sensors[0]);
    if (!is_ray && !is_pln) {
        const sensors_lists = sensors as TRay[][] | TPlane[][];
        const rays_lists: TRay[][] = []; 
        for (const sensors_list of sensors_lists) {
            const rays: TRay[] = _getSensorRaysFromList(sensors_list, offset);
            rays_lists.push(rays);
        }
        return [
            _getSensorRaysFromList(sensors_lists[0], offset),
            _getSensorRaysFromList(sensors_lists[1], offset),
            true
        ];
    }
    const sensors_list = sensors as TRay[] | TPlane[];
    return [_getSensorRaysFromList(sensors_list, offset), [], false];
}
function _getSensorRaysFromList( 
        sensors: TRay[] | TPlane[],
        offset: number): TRay[] {
    const rays: TRay[] = [];
    const is_ray: boolean = isRay(sensors[0]);
    const is_pln: boolean = isPlane(sensors[0]);
    for (const origin of sensors) {
        let origin_xyz: Txyz = null;
        let dir_xyz: Txyz = null;
        if (is_ray) {
            origin_xyz = origin[0] as Txyz;
            dir_xyz = vecNorm(origin[1] as Txyz);
        } else if (is_pln) {
            origin_xyz = origin[0] as Txyz;
            dir_xyz = vecCross(origin[1] as Txyz, origin[2] as Txyz);
        } else {
            throw new Error("Sensor has invalid values");
        }
        const origin_offset_xyz: Txyz = vecAdd(origin_xyz, vecMult(dir_xyz, offset));
        rays.push([origin_offset_xyz, dir_xyz]);
    }
    return rays;
}
// =================================================================================================
function _solarRot(day_ang: number, day: number, hour_ang: number, hour: number, latitude: number, north: number): Txyz {
    const vec: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
    vec.applyAxisAngle(XAXIS, day_ang * day);
    vec.applyAxisAngle(YAXIS, hour_ang * hour);
    vec.applyAxisAngle(XAXIS, latitude);
    vec.applyAxisAngle(ZAXIS, -north);
    return [vec.x, vec.y, vec.z];
}
// =================================================================================================
export function _solarRaysDirect(latitude: number, north: Txy, detail: number): Txyz[][] {
    const dir_vecs: Txyz[][] = [];
    // set the level of detail
    // const day_step = [182 / 4, 182 / 5, 182 / 6, 182 / 7, 182 / 8, 182 / 9, 182 / 10][detail];
    const day_step = [182 / 3, 182 / 6, 182 / 9, 182 / 12][detail];
    const num_day_steps: number = Math.round(182 / day_step) + 1;
    // const hour_step = [0.25 * 6, 0.25 * 5, 0.25 * 4, 0.25 * 3, 0.25 * 2, 0.25 * 1, 0.25 * 0.5][detail];
    const hour_step = [0.25 * 6, 0.25 * 4, 0.25 * 1, 0.25 * 0.5][detail];
    // get the angles in radians
    const day_ang_rad: number = (degToRad(47) as number) / 182;
    const hour_ang_rad: number = (2 * Math.PI) / 24;
    // get the atitude angle in radians
    const latitude_rad: number = degToRad(latitude) as number;
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // create the vectors
    for (let day_count = 0; day_count < num_day_steps; day_count++) {
        const day: number = -91 + day_count * day_step;
        const one_day_path: Txyz[] = [];
        // get sunrise
        let sunrise = 0;
        let sunset = 0;
        for (let hour = 0; hour < 24; hour = hour + 0.1) {
            const sunrise_vec: Txyz = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (sunrise_vec[2] > -1e-6) {
                sunrise = hour;
                sunset = 24 - hour;
                one_day_path.push(sunrise_vec);
                break;
            }
        }
        // morning sun path, count down from midday
        for (let hour = 12; hour > sunrise; hour = hour - hour_step) {
            const am_vec: Txyz = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (am_vec[2] > -1e-6) {
                one_day_path.splice(1, 0, am_vec);
            } else {
                break;
            }
        }
        // afternoon sunpath, count up from midday
        for (let hour = 12 + hour_step; hour < sunset; hour = hour + hour_step) {
            const pm_vec: Txyz = _solarRot(day_ang_rad, day, hour_ang_rad, hour, latitude_rad, north_rad);
            if (pm_vec[2] > -1e-6) {
                one_day_path.push(pm_vec);
            } else {
                break;
            }
        }
        // sunset
        const sunset_vec: Txyz = _solarRot(day_ang_rad, day, hour_ang_rad, sunset, latitude_rad, north_rad);
        one_day_path.push(sunset_vec);
        // add it to the list
        dir_vecs.push(one_day_path);
    }
    // console.log("num rays = ", arrMakeFlat(directions).length);
    return dir_vecs;
}
// =================================================================================================
export function _solarRaysIndirect(latitude: number, north: Txy, detail: number): Txyz[] {
    // TODO this needs updating
    const hedron_tjs: THREE.IcosahedronGeometry = new THREE.IcosahedronGeometry(1, detail + 2);
    const solar_offset = Math.cos(degToRad(66.5) as number);
    // get the atitude angle in radians
    const latitude_rad: number = degToRad(latitude) as number;
    // get the angle from y-axis to north vector in radians
    const north_rad = vecAng2([north[0], north[1], 0], [0, 1, 0], [0, 0, 1]);
    // calc vectors
    const indirect_vecs: Txyz[] = [];
    let coordList: number[] = [];
    for (const coord of <Float32Array>hedron_tjs.getAttribute("position").array) {
        coordList.push(coord);
        if (coordList.length === 3) {
            const vec = new THREE.Vector3(...coordList);
            if (Math.abs(vec.y) > solar_offset) {
                vec.applyAxisAngle(XAXIS, latitude_rad);
                vec.applyAxisAngle(ZAXIS, -north_rad);
                if (vec.z > -1e-6) {
                    indirect_vecs.push( [vec.x, vec.y, vec.z] );
                }
            }
            coordList = [];
        }
    }
    return indirect_vecs;
}
// =================================================================================================
// calc the max solar exposure for a point with no obstructions facing straight up
export function _calcMaxExposure(dir_vecs: Txyz[], weighted: boolean): number {
    if (!weighted) {
        return dir_vecs.length;
    }
    let result = 0;
    for (const dir_vec of dir_vecs) {
        // calc the weighted result based on the angle between the dir and normal
        // this applies the cosine weighting rule
        const result_weighted: number = vecDot(dir_vec, [0,0,1]);
        if (result_weighted > 0) {
            result = result + result_weighted;
        }
    }
    return result;
}
interface TExposure {
    exposure: number[];
}
const EPS = 1e-6;
// // =================================================================================================
export function _calcExposure(
    __model__: GIModel,
    sensor_rays: TRay[],
    dir_vecs: Txyz[],
    radius: [number, number],
    mesh_tjs: THREE.Mesh,
    weighted: boolean,
    generate_lines: boolean
): TExposure {
    // create data structure
    const results = [];
    const result_max: number = _calcMaxExposure(dir_vecs, weighted);
    // create tjs objects (to be resued for each ray)
    const sensor_tjs: THREE.Vector3 = new THREE.Vector3();
    const dir_tjs: THREE.Vector3 = new THREE.Vector3();
    const ray_tjs: THREE.Raycaster = new THREE.Raycaster(sensor_tjs, dir_tjs, radius[0], radius[1]);
    // shoot rays
    for (const [sensor_xyz, sensor_dir] of sensor_rays) {
        // set raycaster origin
        sensor_tjs.x = sensor_xyz[0]; sensor_tjs.y = sensor_xyz[1]; sensor_tjs.z = sensor_xyz[2];
        let result = 0;
        const vis_rays: [Txyz, number][] = [];
        for (const ray_dir of dir_vecs) {
            // check if target is behind sensor
            const dot_ray_sensor: number = vecDot(ray_dir, sensor_dir);
            if (dot_ray_sensor < -EPS) { continue; } 
            // set raycaster direction
            dir_tjs.x = ray_dir[0]; dir_tjs.y = ray_dir[1]; dir_tjs.z = ray_dir[2];
            // shoot raycaster
            const isects: THREE.Intersection[] = ray_tjs.intersectObject(mesh_tjs, false);
            // get the result
            if (isects.length === 0) {
                if (weighted) {
                    // this applies the cosine weighting rule
                    result = result + dot_ray_sensor;
                } else {
                    // this applies no cosine weighting
                    result = result + 1;
                }   
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, 2));
                vis_rays.push([ray_end, 0]);
            } else {
                const ray_end = vecAdd(sensor_xyz, vecMult(ray_dir, isects[0].distance));
                vis_rays.push([ray_end, 1]);
            }
        }
        results.push(result / result_max);
        // generate calculation lines
        if (generate_lines) { _generateLines(__model__, sensor_xyz, vis_rays); }
    }
    return { exposure: results };
}
// =================================================================================================
export function _generateLines(
    __model__: GIModel,
    sensor_xyz: Txyz,
    result_rays: [Txyz, number][]
): void {
    // generate calculation lines
    _initLineCol(__model__);
    // add geom
    const posi0_i: number = _addPosi(__model__, sensor_xyz);
    const plines_i: number[] = [];
    const col_verts_i: [number[], number[]] = [[],[]]; // [white, red]
    for (const [xyz, i] of result_rays) {
        const posi1_i: number = _addPosi(__model__, xyz);
        const pline_i: number = _addLine(__model__, posi0_i, posi1_i);
        plines_i.push(pline_i);
        const verts_i: number[] = __model__.modeldata.geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
        col_verts_i[i].push(verts_i[0]);
        col_verts_i[i].push(verts_i[1]);
    }
    // line colour
    __model__.modeldata.attribs.set.setEntsAttribVal(
        EEntType.PLINE, plines_i, 'material', 'line_mat');
    __model__.modeldata.attribs.set.setEntsAttribVal(
        EEntType.VERT, col_verts_i[0], 'rgb', [0, 0, 1]); // white hit nothing
    __model__.modeldata.attribs.set.setEntsAttribVal(
        EEntType.VERT, col_verts_i[1], 'rgb', [1, 0, 0]); // red hit obstruction
}
// =================================================================================================
export function _initLineCol(
    __model__: GIModel
): void {
    if (__model__.modeldata.attribs.getAttrib(EEntType.MOD, 'line_mat') !== undefined) {
        // assume that everything is already done
        return;
    }
    // create attribs
    __model__.modeldata.attribs.set.setModelAttribVal('line_mat', {
        "type": "LineDashedMaterial",
        "color": [1,1,1],
        "vertexColors": 1,
        "dashSize": 0,
        "gapSize": 0,
        "scale": 1
    });
    __model__.modeldata.attribs.add.addAttrib(
        EEntType.PLINE, 'material', EAttribDataTypeStrs.STRING);
    __model__.modeldata.attribs.add.addAttrib(
        EEntType.VERT, 'rgb', EAttribDataTypeStrs.LIST);
}
export function _addTri(
    __model__: GIModel,
    posi0_i: number,
    posi1_i: number,
    posi2_i: number
): number {
    return __model__.modeldata.geom.add.addPgon([posi0_i, posi1_i, posi2_i])
}
export function _addLine(
    __model__: GIModel,
    posi0_i: number,
    posi1_i: number
): number {
    return __model__.modeldata.geom.add.addPline([posi0_i, posi1_i], false)
}
export function _addPosi(
    __model__: GIModel,
    xyz: Txyz
): number {
    const posi0_i: number = __model__.modeldata.geom.add.addPosi();
    __model__.modeldata.attribs.set.setEntAttribVal(
            EEntType.POSI, posi0_i, 'xyz', xyz);
    return posi0_i;
}
// ================================================================================================
export function _getUniquePosis(__model__: GIModel, ents_arr: TEntTypeIdx[]): number[] {
    if (ents_arr.length === 0) {
        return [];
    }
    const set_posis_i: Set<number> = new Set();
    for (const [ent_type, ent_i] of ents_arr) {
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    return Array.from(set_posis_i);
}
export function _cytoscapeWeightFn(edge: cytoscape.EdgeSingular) {
    return edge.data("weight");
}
function _cytoscapeWeightFn2(edge: cytoscape.EdgeSingular) {
    const weight: number = edge.data("weight");
    if (weight < 1) {
        return 1;
    }
    return weight;
}
export function _cytoscapeGetElements(
    __model__: GIModel,
    ents_arr: TEntTypeIdx[],
    source_posis_i: number[],
    target_posis_i: number[],
    directed: boolean
): any[] {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, "weight") === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with cource and target
    const set_posis_i: Set<number> = new Set(source_posis_i);
    for (const target_posi_i of target_posis_i) {
        set_posis_i.add(target_posi_i);
    }
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of edges_i) {
            set_edges_i.add(edge_i);
        }
        const posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // create elements
    const elements: any[] = [];
    for (const posi_i of Array.from(set_posis_i)) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight") as number;
            } else {
                const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = distance(c0, c1);
            }
            elements.push({
                data: { id: "e" + edge_i, source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i },
            });
        }
    } else {
        // undirected
        const map_edges_ab: Map<string, any> = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id: string = "e_" + edge_posis_i[0].toString() + "_" + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj["data"]["idx2"] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            } else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight") as number;
                } else {
                    const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                    const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
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
export function _cyGetPosisAndElements(
    __model__: GIModel,
    ents_arr: TEntTypeIdx[],
    posis_i: number[],
    directed: boolean
): [cytoscape.ElementDefinition[], number[]] {
    let has_weight_attrib = false;
    if (__model__.modeldata.attribs.query.hasEntAttrib(EEntType.EDGE, "weight")) {
        has_weight_attrib = __model__.modeldata.attribs.query.getAttribDataType(EEntType.EDGE, "weight") === EAttribDataTypeStrs.NUMBER;
    }
    // edges, starts empty
    const set_edges_i: Set<number> = new Set();
    // posis, starts with posis_i
    const set_posis_i: Set<number> = new Set(posis_i);
    // network
    for (const [ent_type, ent_i] of ents_arr) {
        const n_edges_i: number[] = __model__.modeldata.geom.nav.navAnyToEdge(ent_type, ent_i);
        for (const edge_i of n_edges_i) {
            set_edges_i.add(edge_i);
        }
        const n_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(ent_type, ent_i);
        for (const posi_i of n_posis_i) {
            set_posis_i.add(posi_i);
        }
    }
    // all unique posis
    const uniq_posis_i: number[] = Array.from(set_posis_i);
    // create elements
    const elements: cytoscape.ElementDefinition[] = [];
    for (const posi_i of uniq_posis_i) {
        elements.push({ data: { id: posi_i.toString(), idx: posi_i } });
    }
    if (directed) {
        // directed
        for (const edge_i of Array.from(set_edges_i)) {
            const edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            let weight = 1.0;
            if (has_weight_attrib) {
                weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight") as number;
            } else {
                // const c0: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[0]);
                // const c1: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(edge_posis_i[1]);
                weight = 1; // distance(c0, c1);
            }
            elements.push({
                data: { id: "e" + edge_i, source: edge_posis_i[0].toString(), target: edge_posis_i[1].toString(), weight: weight, idx: edge_i },
            });
        }
    } else {
        // undirected
        const map_edges_ab: Map<string, any> = new Map();
        for (const edge_i of Array.from(set_edges_i)) {
            let edge_posis_i: number[] = __model__.modeldata.geom.nav.navAnyToPosi(EEntType.EDGE, edge_i);
            edge_posis_i = edge_posis_i[0] < edge_posis_i[1] ? edge_posis_i : [edge_posis_i[1], edge_posis_i[0]];
            const undir_edge_id: string = "e_" + edge_posis_i[0].toString() + "_" + edge_posis_i[1].toString();
            if (map_edges_ab.has(undir_edge_id)) {
                const obj = map_edges_ab.get(undir_edge_id);
                obj["data"]["idx2"] = edge_i;
                // TODO should we take the average of the two weights? Could be more than two...
            } else {
                let weight = 1.0;
                if (has_weight_attrib) {
                    weight = __model__.modeldata.attribs.get.getEntAttribVal(EEntType.EDGE, edge_i, "weight") as number;
                } else {
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
