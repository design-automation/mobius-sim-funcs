"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports._polyhedron = exports.Polyhedron = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const THREE = __importStar(require("three"));
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Creates positions in a polyhedron pattern.
 * \n
 * The five regular polyhedrons can be generated:
 * - Tetrahedron (4 triangular faces)
 * - Cube (4 square faces)
 * - Octahedron (8 triangular faces)
 * - Icosahedron (20 triangular faces)
 * - Dodecahedron (12 pentagon faces)
 * \n
 * The `origin` parameter specifies the centre of the polyhedron for which positions will be
 * generated. The origin can be specified as either a |coordinate| or a |plane|. If a coordinate
 * is given, then a plane will be automatically generated, aligned with the global XY plane.
 * \n
 * The positions will be generated for a polyhedron aligned with the origin XY plane.
 * So if the origin plane is rotated, then the polyhedron will also be rotated.
 * \n
 * The `radius` parameter specifies the size of the polyhedron.
 * All positions that are generated are projected onto the surface of a sphere,
 * with the specified `radius`.
 * \n
 * The faces of the regular polyhedron can be further subdivided by specifying the level of
 * `detail`. (When subdivided, it will no longer be regular polyhedrons.)
 * \n
 * For tetrahedrons, octahedrons, and icosahedrons, the `detail` subdivides as follows:
 * - Detail = 0: No subdivision
 * - Detail = 1: Each triangle edge is subdivided into two edges.
 * - Detail = 2: Each triangle edge is subdivided into three edges.
 * - etc
 * \n
 * Cubes and dodecahedrons do not have triangular faces. So in these cases, the first level of
 * `detail` converts each non-triangular face into triangles by adding a position at the centre of
 * the face. The `detail` subdivides as follows:
 * - Detail= 0: No subdivision.
 * - Detail = 1: Convert non-triangular faces into triangles.
 * - Detail = 2: Each triangle edge is subdivided into two edges.
 * - Detail = 3: Each triangle edge is subdivided into three edges.
 * - etc
 * \n
 * The positions can either be returned as a flat list or as nested lists.
 * The nested lists represent the faces of the polyhedron.
 * However, note that only the positions are returned.
 * If you want to have polygon faces, you need to generate polygons from the positions.
 * \n
 * For example, calling the function with `detail = 0` and `method = 'flat_tetra'`,
 * will result in the following positions:
 * ```
 * posis = ["ps0", "ps1", "ps2", "ps3"]
 * ```
 * If you change the method to `method = 'face_tetra'`, then you will get the following nested lists.
 * ```
 * posis = [
 *     ["ps2", "ps1", "ps0"],
 *     ["ps0", "ps3", "ps2"],
 *     ["ps1", "ps3", "ps0"],
 *     ["ps2", "ps3", "ps1"]
 * ]
 * ```
 * Notice that the number of positions is the same in both cases
 * (i.e. in both cases there are 4 positions: 'ps0', 'ps1', 'ps2', 'ps3').
 * When `face_tetra` is selected selected, the positions are organised into 4 lists,
 * representing the 4 faces of the tetrahedron.
 * \n
 * The nested lists can be passed to the `make.Polygon` function in order to generated polygonal faces.
 * Here is an example:
 * \n
 * ```
 * posis = pattern.Polyhedron(XY, 10, 0, 'face_tetra')
 * pgons = make.Polygon(posis)
 * ```
 * \n
 * ![Tetrahedron with triangular faces](assets/typedoc-json/docMDimgs/polyhedron_tetra.png)
 * \n
 * @param __model__
 * @param origin A |coordinate| or a |plane|, specifying the origin of the polyhedron.
 * If a coordinate is given, then the plane is assumed to be aligned with the global XY plane.
 * @param radius The radius of the polyhedron.
 * @param detail The level of detail for the polyhedron.
 * @param method Enum: The Type of polyhedron to generate.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Polyhedron(XY, 20, 0, 'face_tetra')`
 * @example_info Creates positions in a regular tetrahedron pattern, with a radius of 20. The
 * positions are returned as nested lists, where each list contains the positions for one face.
 */
function Polyhedron(__model__, origin, radius, detail, method) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'pattern.Polyhedron';
        chk.checkArgs(fn_name, 'origin', origin, [chk.isXYZ, chk.isPln]);
        chk.checkArgs(fn_name, 'radius', radius, [chk.isNum]);
        chk.checkArgs(fn_name, 'detail', detail, [chk.isInt]);
        if (detail > 6) {
            throw new Error('pattern.Polyhedron: The "detail" argument is too high, the maximum is 6.');
        }
    }
    // --- Error Check ---
    // create the matrix one time
    let matrix = null;
    const origin_is_plane = (0, mobius_sim_1.getArrDepth)(origin) === 2;
    if (origin_is_plane) {
        matrix = (0, mobius_sim_1.xfromSourceTargetMatrix)(mobius_sim_1.XYPLANE, origin);
    }
    else {
        matrix = new THREE.Matrix4();
        matrix.makeTranslation(...origin);
    }
    // make polyhedron posis
    const posis_i = _polyhedron(__model__, matrix, radius, detail, method);
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.POSI, posis_i);
}
exports.Polyhedron = Polyhedron;
// create the polyhedron
function _polyhedron(__model__, matrix, radius, detail, method) {
    // create the posis
    let xyzs;
    let faces;
    switch (method) {
        case _enum_1._EPolyhedronMethod.FLAT_TETRA:
        case _enum_1._EPolyhedronMethod.FACE_TETRA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronTetra(), radius, detail);
            break;
        case _enum_1._EPolyhedronMethod.FLAT_CUBE:
        case _enum_1._EPolyhedronMethod.FACE_CUBE:
            [xyzs, faces] = _polyhedronCreate(_polyhedronCube(), radius, detail);
            break;
        case _enum_1._EPolyhedronMethod.FLAT_OCTA:
        case _enum_1._EPolyhedronMethod.FACE_OCTA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronOcta(), radius, detail);
            break;
        case _enum_1._EPolyhedronMethod.FLAT_ICOSA:
        case _enum_1._EPolyhedronMethod.FACE_ICOSA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronIcosa(), radius, detail);
            break;
        case _enum_1._EPolyhedronMethod.FLAT_DODECA:
        case _enum_1._EPolyhedronMethod.FACE_DODECA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronDodeca(), radius, detail);
            break;
        default:
            throw new Error('pattern.Polyhedron: method not recognised.');
    }
    // make posis
    const posis_i = [];
    for (const xyz of xyzs) {
        const posi_i = __model__.modeldata.geom.add.addPosi();
        const xyz_xform = (0, mobius_sim_1.multMatrix)(xyz, matrix);
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz_xform);
        posis_i.push(posi_i);
    }
    // if the method is flat, then we are done, return the posis
    switch (method) {
        case _enum_1._EPolyhedronMethod.FLAT_TETRA:
        case _enum_1._EPolyhedronMethod.FLAT_CUBE:
        case _enum_1._EPolyhedronMethod.FLAT_OCTA:
        case _enum_1._EPolyhedronMethod.FLAT_ICOSA:
        case _enum_1._EPolyhedronMethod.FLAT_DODECA:
            return posis_i;
    }
    // if we want faces, then make lists of posis for each face
    const faces_posis_i = [];
    for (const face of faces) {
        const face_posis_i = [];
        for (const i of face) {
            face_posis_i.push(posis_i[i]);
        }
        faces_posis_i.push(face_posis_i);
    }
    return faces_posis_i;
}
exports._polyhedron = _polyhedron;
// Create a tetrahedron
function _polyhedronTetra() {
    // copied from threejs
    const xyzs = [
        [1, 1, 1],
        [-1, -1, 1],
        [-1, 1, -1],
        [1, -1, -1]
    ];
    const faces = [
        [2, 1, 0],
        [0, 3, 2],
        [1, 3, 0],
        [2, 3, 1]
    ];
    return [xyzs, faces];
}
// Create a cube
function _polyhedronCube() {
    const xyzs = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    const faces = [
        [0, 1, 2, 3],
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [7, 6, 5, 4]
    ];
    return [xyzs, faces];
}
// Create a Octahedron
function _polyhedronOcta() {
    // copied from threejs
    const xyzs = [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0],
        [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    const faces = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5],
        [0, 5, 2], [1, 2, 5], [1, 5, 3],
        [1, 3, 4], [1, 4, 2]
    ];
    return [xyzs, faces];
}
// Create a Icosahedron
function _polyhedronIcosa() {
    // copied from threejs
    const t = (1 + Math.sqrt(5)) / 2;
    const xyzs = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0],
        [1, -t, 0], [0, -1, t], [0, 1, t],
        [0, -1, -t], [0, 1, -t], [t, 0, -1],
        [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];
    const faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    return [xyzs, faces];
}
// Create a Dodecahedron
function _polyhedronDodeca() {
    // copied from threejs
    const t = (1 + Math.sqrt(5)) / 2;
    const r = 1 / t;
    const xyzs = [
        // (±1, ±1, ±1)
        [-1, -1, -1], [-1, -1, 1],
        [-1, 1, -1], [-1, 1, 1],
        [1, -1, -1], [1, -1, 1],
        [1, 1, -1], [1, 1, 1],
        // (0, ±1/φ, ±φ)
        [0, -r, -t], [0, -r, t],
        [0, r, -t], [0, r, t],
        // (±1/φ, ±φ, 0)
        [-r, -t, 0], [-r, t, 0],
        [r, -t, 0], [r, t, 0],
        // (±φ, 0, ±1/φ)
        [-t, 0, -r], [t, 0, -r],
        [-t, 0, r], [t, 0, r]
    ];
    const faces = [
        // [3, 11, 7], [3, 7, 15], [3, 15, 13],
        // [7, 19, 17], [7, 17, 6], [7, 6, 15],
        // [17, 4, 8], [17, 8, 10], [17, 10, 6],
        // [8, 0, 16], [8, 16, 2], [8, 2, 10],
        // [0, 12, 1], [0, 1, 18], [0, 18, 16],
        // [6, 10, 2], [6, 2, 13], [6, 13, 15],
        // [2, 16, 18], [2, 18, 3], [2, 3, 13],
        // [18, 1, 9], [18, 9, 11], [18, 11, 3],
        // [4, 14, 12], [4, 12, 0], [4, 0, 8],
        // [11, 9, 5], [11, 5, 19], [11, 19, 7],
        // [19, 5, 14], [19, 14, 4], [19, 4, 17],
        // [1, 12, 14], [1, 14, 5], [1, 5, 9]
        [3, 11, 7, 15, 13],
        [7, 19, 17, 6, 15],
        [17, 4, 8, 10, 6],
        [8, 0, 16, 2, 10],
        [0, 12, 1, 18, 16],
        [6, 10, 2, 13, 15],
        [2, 16, 18, 3, 13],
        [18, 1, 9, 11, 3],
        [4, 14, 12, 0, 8],
        [11, 9, 5, 19, 7],
        [19, 5, 14, 4, 17],
        [1, 12, 14, 5, 9]
    ];
    return [xyzs, faces];
}
// Subdivide and apply radius
function _polyhedronCreate(xyzs_faces, radius, detail) {
    const xyzs = xyzs_faces[0];
    const faces = xyzs_faces[1];
    // subdiv
    const [new_xyzs, new_faces] = _polyhedronSubDdiv(xyzs, faces, detail);
    // apply radius
    _polyhedronApplyRadiusXyzs(new_xyzs, radius);
    // return
    return [new_xyzs, new_faces];
}
// Subdiv all faces
function _polyhedronSubDdiv(xyzs, faces, detail) {
    if (detail === 0) {
        return [xyzs, faces];
    }
    const new_faces = [];
    for (const face of faces) {
        if (face.length > 3) {
            const mid = [0, 0, 0];
            for (const xyz_i of face) {
                mid[0] = mid[0] + xyzs[xyz_i][0];
                mid[1] = mid[1] + xyzs[xyz_i][1];
                mid[2] = mid[2] + xyzs[xyz_i][2];
            }
            mid[0] = mid[0] / face.length;
            mid[1] = mid[1] / face.length;
            mid[2] = mid[2] / face.length;
            const mid_i = xyzs.push(mid) - 1;
            for (let i = 0; i < face.length; i++) {
                const tri_face = [mid_i, face[i], face[(i + 1) % face.length]];
                const subdiv_faces = _polyhedronSubDdivTriFace(xyzs, tri_face, detail - 1);
                subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
            }
        }
        else {
            const subdiv_faces = _polyhedronSubDdivTriFace(xyzs, face, detail);
            subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
        }
    }
    // merge xyzs
    const new_xyzs = _polyhedronMergeXyzs(xyzs, new_faces);
    // return
    return [new_xyzs, new_faces];
}
// Subdivide one face
function _polyhedronSubDdivTriFace(xyzs, face, detail) {
    const a = xyzs[face[0]];
    const b = xyzs[face[1]];
    const c = xyzs[face[2]];
    const cols = detail + 1;
    // we use this multidimensional array as a data structure for creating the subdivision
    const xyzs_i = [];
    // construct all of the xyzs for this subdivision
    for (let i = 0; i <= cols; i++) {
        xyzs_i[i] = [];
        const aj = _polyhedronLerp(a, c, i / cols);
        const bj = _polyhedronLerp(b, c, i / cols);
        const rows = cols - i;
        for (let j = 0; j <= rows; j++) {
            let xyz_i;
            if (j === 0 && i === cols) {
                xyz_i = xyzs.push(aj) - 1;
            }
            else {
                xyz_i = xyzs.push(_polyhedronLerp(aj, bj, j / rows)) - 1;
            }
            xyzs_i[i][j] = xyz_i;
        }
    }
    // construct all of the tri faces
    const new_faces = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < 2 * (cols - i) - 1; j++) {
            const new_face = [];
            const k = Math.floor(j / 2);
            if (j % 2 === 0) {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
                new_face.push(xyzs_i[i][k]);
            }
            else {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
            }
            new_faces.push(new_face);
        }
    }
    return new_faces;
}
function _polyhedronMergeXyzs(xyzs, faces) {
    // iterate over the xyzs
    const xyz_i_old_new_map = new Map();
    const new_xyzs = [];
    for (let i = 0; i < xyzs.length; i++) {
        if (!xyz_i_old_new_map.has(i)) {
            const new_i = new_xyzs.push(xyzs[i]) - 1;
            xyz_i_old_new_map.set(i, new_i);
            for (let j = i + 1; j < xyzs.length; j++) {
                const dist_sq = Math.abs(xyzs[i][0] - xyzs[j][0]) +
                    Math.abs(xyzs[i][1] - xyzs[j][1]) +
                    Math.abs(xyzs[i][2] - xyzs[j][2]);
                if (dist_sq < 1e-6) {
                    xyz_i_old_new_map.set(j, new_i);
                }
            }
        }
    }
    // update indexes
    for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
            face[i] = xyz_i_old_new_map.get(face[i]);
        }
    }
    // return
    return new_xyzs;
}
function _polyhedronApplyRadiusXyzs(xyzs, radius) {
    // iterate over the xyzs and apply the radius to each xyz
    for (const xyz of xyzs) {
        const scale = radius / Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1] + xyz[2] * xyz[2]);
        xyz[0] = xyz[0] * scale;
        xyz[1] = xyz[1] * scale;
        xyz[2] = xyz[2] * scale;
    }
}
function _polyhedronLerp(a, b, alpha) {
    // interpolate between two points
    return [
        a[0] + (b[0] - a[0]) * alpha,
        a[1] + (b[1] - a[1]) * alpha,
        a[2] + (b[2] - a[2]) * alpha
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seWhlZHJvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wYXR0ZXJuL1BvbHloZWRyb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQVd1QztBQUN2Qyw2Q0FBK0I7QUFFL0IsMkRBQTZDO0FBQzdDLG1DQUE2QztBQUk3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUZHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLFNBQWtCLEVBQUUsTUFBcUIsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUM1RixNQUEwQjtJQUM5QixzQkFBc0I7SUFDdEIsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1NBQy9GO0tBQ0o7SUFDRCxzQkFBc0I7SUFDdEIsNkJBQTZCO0lBQzdCLElBQUksTUFBTSxHQUFrQixJ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R0FBRyxDQUFDLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQVc7UUFDakIsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDLENBQUM7SUFDRixNQUFNLEtBQUssR0FBZTtRQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUN6RCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUMxRCxDQUFDO0lBQ0YsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCLFNBQVMsaUJBQWlCO0lBQ3RCLHNCQUFzQjtJQUN0QixNQUFNLENBQUMsR0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxHQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIsTUFBTSxJQUFJLEdBQVc7UUFDakIsZUFBZTtRQUNmLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLGdCQUFnQjtRQUNoQixDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLGdCQUFnQjtRQUNoQixDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLGdCQUFnQjtRQUNoQixDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3pCLENBQUM7SUFDRixNQUFNLEtBQUssR0FBZTtRQUN0Qix1Q0FBdUM7UUFDdkMsdUNB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