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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seWhlZHJvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9wYXR0ZXJuL1BvbHloZWRyb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFXdUM7QUFDdkMsNkNBQStCO0FBRS9CLDJEQUE2QztBQUM3QyxtQ0FBNkM7QUFJN0MsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1GRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxTQUFrQixFQUFFLE1BQXFCLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFDNUYsTUFBMEI7SUFDOUIsc0JBQXNCO0lBQ3RCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixNQUFNLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQztRQUNyQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNqRSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsMEVBQTBFLENBQUMsQ0FBQztTQUMvRjtLQUNKO0lBQ0Qsc0JBQXNCO0lBQ3RCLDZCQUE2QjtJQUM3QixJQUFJLE1BQU0sR0FB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QUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sSUFBSSxHQUFXO1FBQ2pCLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN4QyxDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQWU7UUFDdEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDekQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDMUQsQ0FBQztJQUNGLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUNELHdCQUF3QjtBQUN4QixTQUFTLGlCQUFpQjtJQUN0QixzQkFBc0I7SUFDdEIsTUFBTSxDQUFDLEdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxNQUFNLENBQUMsR0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sSUFBSSxHQUFXO1FBQ2pCLGVBQWU7UUFDZixDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixnQkFBZ0I7UUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixnQkFBZ0I7UUFDaEIsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixnQkFBZ0I7UUFDaEIsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN6QixDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQWU7UUFDdEIsdUNBQXVDO1FBQ3ZD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