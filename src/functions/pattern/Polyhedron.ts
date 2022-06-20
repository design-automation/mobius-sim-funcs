import {
    ENT_TYPE,
    getArrDepth,
    Sim,
    idsMakeFromIdxs,
    multMatrix,
    string,
    TPlane,
    Txyz,
    xfromSourceTargetMatrix,
    XYPLANE,
} from '../../mobius_sim';
import * as THREE from 'three';

import * as chk from '../../_check_types';
import { _EPolyhedronMethod } from './_enum';



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
 * - Detail = 0: No subdivision.
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
 * @param radius A number. The radius of the polyhedron.
 * @param detail An integer. The level of detail for the polyhedron.
 * @param method Enum, the Type of polyhedron to generate: `'flat_tetra', 'flat_cube', 'flat_octa',
    'flat_icosa', 'flat_dodeca', 'face_tetra', 'face_cube', 'face_octa', 'face_icosa'` or `'face_dodeca'`.
 * @returns Entities, a list of positions.
 * @example `posis = pattern.Polyhedron(XY, 20, 0, 'face_tetra')`
 * @example_info Creates positions in a regular tetrahedron pattern, with a radius of 20. The 
 * positions are returned as nested lists, where each list contains the positions for one face.
 */
export function Polyhedron(__model__: Sim, origin: Txyz | TPlane, radius: number, detail: number,
        method: _EPolyhedronMethod): string[]|string[][] {
    // --- Error Check ---
    if (this.debug) {
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
    let matrix: THREE.Matrix4 = null;
    const origin_is_plane = getArrDepth(origin) === 2;
    if (origin_is_plane) {
        matrix = xfromSourceTargetMatrix(XYPLANE, origin as TPlane);
    } else {
        matrix = new THREE.Matrix4();
        matrix.makeTranslation(...origin as Txyz);
    }
    // make polyhedron posis
    const posis_i: number[]|number[][] = _polyhedron(__model__, matrix, radius, detail, method);
    return idsMakeFromIdxs(ENT_TYPE.POSI, posis_i) as string[][];
}
// create the polyhedron
export function _polyhedron(__model__: Sim, matrix: THREE.Matrix4, radius: number, detail: number,
    method: _EPolyhedronMethod): number[]|number[][] {
    // create the posis
    let xyzs: Txyz[];
    let faces: number[][];
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FACE_TETRA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronTetra(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_CUBE:
        case _EPolyhedronMethod.FACE_CUBE:
            [xyzs, faces] = _polyhedronCreate(_polyhedronCube(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FACE_OCTA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronOcta(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FACE_ICOSA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronIcosa(), radius, detail);
            break;
        case _EPolyhedronMethod.FLAT_DODECA:
        case _EPolyhedronMethod.FACE_DODECA:
            [xyzs, faces] = _polyhedronCreate(_polyhedronDodeca(), radius, detail);
            break;
        default:
            throw new Error('pattern.Polyhedron: method not recognised.');
    }
    // make posis
    const posis_i: number[] = [];
    for (const xyz of xyzs) {
        const posi_i: number = __model__.modeldata.geom.add.addPosi();
        const xyz_xform: Txyz = multMatrix(xyz, matrix);
        __model__.modeldata.attribs.posis.setPosiCoords(posi_i, xyz_xform);
        posis_i.push(posi_i);
    }
    // if the method is flat, then we are done, return the posis
    switch (method) {
        case _EPolyhedronMethod.FLAT_TETRA:
        case _EPolyhedronMethod.FLAT_CUBE:
        case _EPolyhedronMethod.FLAT_OCTA:
        case _EPolyhedronMethod.FLAT_ICOSA:
        case _EPolyhedronMethod.FLAT_DODECA:
            return posis_i;
    }
    // if we want faces, then make lists of posis for each face
    const faces_posis_i: number[][] = [];
    for (const face of faces) {
        const face_posis_i: number[] = [];
        for (const i of face) {
            face_posis_i.push(posis_i[i]);
        }
        faces_posis_i.push(face_posis_i);
    }
    return faces_posis_i;
}
// Create a tetrahedron
function _polyhedronTetra(): [Txyz[], number[][]] {
    // copied from threejs
    const xyzs: Txyz[] = [
        [1, 1, 1],
        [- 1, - 1, 1],
        [- 1, 1, - 1],
        [1, - 1, - 1]
    ];
    const faces: number[][] = [
        [2, 1, 0],
        [0, 3, 2],
        [1, 3, 0],
        [2, 3, 1]
    ];
    return [xyzs, faces];
}
// Create a cube
function _polyhedronCube(): [Txyz[], number[][]] {
    const xyzs: Txyz[] = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1,  1], [1, -1,  1], [1, 1,  1], [-1, 1,  1],
    ];
    const faces: number[][] = [
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
function _polyhedronOcta(): [Txyz[], number[][]] {
    // copied from threejs
    const xyzs: Txyz[] = [
        [1, 0, 0], [- 1, 0, 0], [0, 1, 0],
        [0, - 1, 0], [0, 0, 1], [0, 0, - 1]
    ];
    const faces: number[][] = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5],
        [0, 5, 2], [1, 2, 5], [1, 5, 3],
        [1, 3, 4], [1, 4, 2]
    ];
    return [xyzs, faces];
}
// Create a Icosahedron
function _polyhedronIcosa(): [Txyz[], number[][]] {
    // copied from threejs
    const t = (1 + Math.sqrt(5)) / 2;
    const xyzs: Txyz[] = [
        [- 1, t, 0], [1, t, 0], [- 1, - t, 0],
        [1, - t, 0], [0, - 1, t], [0, 1, t],
        [0, - 1, - t], [0, 1, - t], [t, 0, - 1],
        [t, 0, 1], [- t, 0, - 1], [- t, 0, 1]
    ];
    const faces: number[][] = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    return [xyzs, faces];
}
// Create a Dodecahedron
function _polyhedronDodeca(): [Txyz[], number[][]] {
    // copied from threejs
    const t: number = (1 + Math.sqrt(5)) / 2;
    const r: number = 1 / t;
    const xyzs: Txyz[] = [
        // (±1, ±1, ±1)
        [- 1, - 1, - 1], [- 1, - 1, 1],
        [- 1, 1, - 1], [- 1, 1, 1],
        [1, - 1, - 1], [1, - 1, 1],
        [1, 1, - 1], [1, 1, 1],
        // (0, ±1/φ, ±φ)
        [0, - r, - t], [0, - r, t],
        [0, r, - t], [0, r, t],
        // (±1/φ, ±φ, 0)
        [- r, - t, 0], [- r, t, 0],
        [r, - t, 0], [r, t, 0],
        // (±φ, 0, ±1/φ)
        [- t, 0, - r], [t, 0, - r],
        [- t, 0, r], [t, 0, r]
    ];
    const faces: number[][] = [
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
function _polyhedronCreate(xyzs_faces: [Txyz[], number[][]], radius: number, detail: number): [Txyz[], number[][]] {
    const xyzs: Txyz[] = xyzs_faces[0];
    const faces: number[][] = xyzs_faces[1];
    // subdiv
    const [new_xyzs, new_faces]: [Txyz[], number[][]]  = _polyhedronSubDdiv(xyzs, faces, detail);
    // apply radius
    _polyhedronApplyRadiusXyzs(new_xyzs, radius);
    // return
    return [new_xyzs, new_faces];
}
// Subdiv all faces
function _polyhedronSubDdiv(xyzs: Txyz[], faces: number[][], detail: number): [Txyz[], number[][]] {
    if (detail === 0) { return [xyzs, faces]; }
    const new_faces: number[][] = [];
    for (const face of faces) {
        if (face.length > 3) {
            const mid: Txyz = [0, 0, 0];
            for (const xyz_i of face) {
                mid[0] = mid[0] + xyzs[xyz_i][0];
                mid[1] = mid[1] + xyzs[xyz_i][1];
                mid[2] = mid[2] + xyzs[xyz_i][2];
            }
            mid[0] = mid[0] / face.length;
            mid[1] = mid[1] / face.length;
            mid[2] = mid[2] / face.length;
            const mid_i: number = xyzs.push(mid) - 1;
            for (let i = 0; i < face.length; i++) {
                const tri_face: number[] = [mid_i, face[i], face[(i + 1) % face.length]];
                const subdiv_faces: number[][] = _polyhedronSubDdivTriFace(xyzs, tri_face, detail - 1);
                subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
            }
        } else {
            const subdiv_faces: number[][] = _polyhedronSubDdivTriFace(xyzs, face, detail);
            subdiv_faces.map(subdiv_face => new_faces.push(subdiv_face));
        }
    }
    // merge xyzs
    const new_xyzs: Txyz[] = _polyhedronMergeXyzs(xyzs, new_faces);
    // return
    return [new_xyzs, new_faces];
}
// Subdivide one face
function _polyhedronSubDdivTriFace(xyzs: Txyz[], face: number[], detail: number): number[][] {
    const a: Txyz = xyzs[face[0]];
    const b: Txyz = xyzs[face[1]];
    const c: Txyz = xyzs[face[2]];
    const cols = detail + 1;
    // we use this multidimensional array as a data structure for creating the subdivision
    const xyzs_i: number[][] = [];
    // construct all of the xyzs for this subdivision
    for (let i = 0; i <= cols; i++) {
        xyzs_i[i] = [];
        const aj = _polyhedronLerp(a, c, i / cols);
        const bj = _polyhedronLerp(b, c, i / cols);
        const rows = cols - i;
        for (let j = 0; j <= rows; j++) {
            let xyz_i: number;
            if (j === 0 && i === cols) {
                xyz_i = xyzs.push(aj) - 1;
            } else {
                xyz_i = xyzs.push(_polyhedronLerp(aj, bj, j / rows)) - 1;
            }
            xyzs_i[i][j] = xyz_i;
        }
    }
    // construct all of the tri faces
    const new_faces: number[][] = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < 2 * (cols - i) - 1; j++) {
            const new_face: number[] = [];
            const k = Math.floor(j / 2);
            if (j % 2 === 0) {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
                new_face.push(xyzs_i[i][k]);
            } else {
                new_face.push(xyzs_i[i][k + 1]);
                new_face.push(xyzs_i[i + 1][k + 1]);
                new_face.push(xyzs_i[i + 1][k]);
            }
            new_faces.push(new_face);
        }
    }
    return new_faces;
}
function _polyhedronMergeXyzs(xyzs: Txyz[], faces: number[][]): Txyz[] {
    // iterate over the xyzs
    const xyz_i_old_new_map: Map<number, number> = new Map();
    const new_xyzs: Txyz[] = [];
    for (let i = 0; i < xyzs.length; i++) {
        if (!xyz_i_old_new_map.has(i)) {
            const new_i: number = new_xyzs.push(xyzs[i]) - 1;
            xyz_i_old_new_map.set(i, new_i);
            for (let j = i + 1; j < xyzs.length; j++) {
                const dist_sq: number =
                    Math.abs(xyzs[i][0] - xyzs[j][0]) +
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
function _polyhedronApplyRadiusXyzs(xyzs: Txyz[], radius: number): void {
    // iterate over the xyzs and apply the radius to each xyz
    for (const xyz of xyzs) {
        const scale: number =
            radius / Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1] + xyz[2] * xyz[2]);
        xyz[0] = xyz[0] * scale;
        xyz[1] = xyz[1] * scale;
        xyz[2] = xyz[2] * scale;
    }
}
function _polyhedronLerp(a: Txyz, b: Txyz, alpha: number): Txyz {
    // interpolate between two points
    return [
        a[0] + (b[0] - a[0]) * alpha,
        a[1] + (b[1] - a[1]) * alpha,
        a[2] + (b[2] - a[2]) * alpha
    ];
}
