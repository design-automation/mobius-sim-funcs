import * as three from 'three';
import { vecNorm, vecCross } from './calcVectors';
import { TPlane, TRay, Txyz } from './consts';
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param xyz 
 * @param m 
 * @returns 
 */
export function multMatrix(xyz: Txyz, m: three.Matrix4): Txyz {
    const v2: three.Vector3 = new three.Vector3(...xyz as Txyz);
    v2.applyMatrix4(m);
    return v2.toArray() as Txyz;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param plane 
 * @returns 
 */
export function mirrorMatrix(plane: TPlane): three.Matrix4 {
    const origin: Txyz = plane[0];
    const normal: Txyz = vecCross(plane[1], plane[2]);
    // plane normal
    const [a, b, c]: number[] = vecNorm(normal);
    // rotation matrix
    const matrix_mirror: three.Matrix4 = new three.Matrix4();
    matrix_mirror.set(
        1 - (2 * a * a), -2 * a * b, -2 * a * c, 0,
        -2 * a * b, 1 - (2 * b * b), -2 * b * c, 0,
        -2 * a * c, -2 * b * c, 1 - (2 * c * c), 0,
        0, 0, 0, 1
    );
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_mirror_move: three.Matrix4 = matrix_trn2.multiply(matrix_mirror.multiply(matrix_trn1));
    // do the xform
    return move_mirror_move;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param ray 
 * @param angle 
 * @returns 
 */
export function rotateMatrix(ray: TRay, angle: number): three.Matrix4 {
    const origin: Txyz = ray[0];
    const axis: Txyz = vecNorm(ray[1]);
    // rotation matrix
    const matrix_rot: three.Matrix4 = new three.Matrix4();
    matrix_rot.makeRotationAxis(new three.Vector3(...axis), angle);
    // translation matrix
    const matrix_trn1: three.Matrix4 = new three.Matrix4();
    matrix_trn1.makeTranslation(-origin[0], -origin[1], -origin[2]);
    const matrix_trn2: three.Matrix4 = new three.Matrix4();
    matrix_trn2.makeTranslation(origin[0], origin[1], origin[2]);
    // final matrix
    const move_rot_move: three.Matrix4 = matrix_trn2.multiply(matrix_rot.multiply(matrix_trn1));
    // do the xform
    return move_rot_move;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param plane 
 * @param factor 
 * @returns 
 */
export function scaleMatrix(plane: TPlane, factor: Txyz): three.Matrix4 {
    // scale matrix
    const matrix_scale: three.Matrix4 = new three.Matrix4();
    matrix_scale.makeScale(factor[0], factor[1], factor[2]);
    // xform matrix
    const matrix_xform1: three.Matrix4 = xformMatrix(plane, true);
    const matrix_xform2: three.Matrix4 = xformMatrix(plane, false);
    // final matrix
    const xform_scale_xform: three.Matrix4 = matrix_xform2.multiply(matrix_scale.multiply(matrix_xform1));
    // do the xform
    return xform_scale_xform;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param source_plane 
 * @param target_plane 
 * @returns 
 */
export function xfromSourceTargetMatrix(source_plane: TPlane, target_plane: TPlane): three.Matrix4 {
    // matrix to xform from source to gcs, then from gcs to target
    const matrix_source_to_gcs: three.Matrix4 = xformMatrix(source_plane, true);
    const matrix_gcs_to_target: three.Matrix4 = xformMatrix(target_plane, false);
    // final matrix
    const xform: three.Matrix4 = matrix_gcs_to_target.multiply(matrix_source_to_gcs);
    // return the matrix
    return xform;
}
// -------------------------------------------------------------------------------------------------
/**
 * 
 * @param plane 
 * @param neg 
 * @returns 
 */
export function xformMatrix(plane: TPlane, neg: boolean): three.Matrix4 {
    const o: three.Vector3 = new three.Vector3(...plane[0]);
    const x: three.Vector3 = new three.Vector3(...plane[1]);
    const y: three.Vector3 = new three.Vector3(...plane[2]);
    const z: three.Vector3 = new three.Vector3(...vecCross(plane[1], plane[2]));
    if (neg) {
        o.negate();
    }
    // origin translate matrix
    const m1: three.Matrix4 = new three.Matrix4();
    m1.setPosition(o);
    // xfrom matrix
    const m2: three.Matrix4 = new three.Matrix4();
    m2.makeBasis(x, y, z);
    // combine two matrices
    const m3: three.Matrix4 = new three.Matrix4();
    if (neg) {
        const m2x = (new three.Matrix4()).copy( m2 ).invert();
        // first translate to origin, then xform, so m2 x m1
        m3.multiplyMatrices(m2x, m1);
    } else {
        // first xform, then translate to origin, so m1 x m2
        m3.multiplyMatrices(m1, m2);
    }
    // return the combined matrix
    return m3;
}
// -------------------------------------------------------------------------------------------------