import * as three from 'three';
import { Txyz } from './consts';
// -------------------------------------------------------------------------------------------------
/**
 * TODO refactor without threejs
 * @param v1 
 * @param v2 
 * @param v3 
 * @param norm 
 * @returns 
 */
export function normal(v1: Txyz, v2: Txyz, v3: Txyz, norm: boolean = false): Txyz {
    const _v1: three.Vector3 = new three.Vector3(...v1);
    const _v2: three.Vector3 = new three.Vector3(...v2);
    const _v3: three.Vector3 = new three.Vector3(...v3);
    const t: three.Triangle = new three.Triangle(_v1, _v2, _v3);
    const _normal: three.Vector3 = new three.Vector3();
    t.getNormal(_normal);
    if (norm) {
        _normal.normalize();
    }
    return _normal.toArray() as Txyz;
}
// -------------------------------------------------------------------------------------------------
/**
 * TODO refactor without threjs
 * @param v1 
 * @param v2 
 * @param v3 
 * @returns 
 */
export function area(v1: Txyz, v2: Txyz, v3: Txyz): number {
    const _v1: three.Vector3 = new three.Vector3(...v1);
    const _v2: three.Vector3 = new three.Vector3(...v2);
    const _v3: three.Vector3 = new three.Vector3(...v3);
    const t: three.Triangle = new three.Triangle(_v1, _v2, _v3);
    return t.getArea();
}
// -------------------------------------------------------------------------------------------------