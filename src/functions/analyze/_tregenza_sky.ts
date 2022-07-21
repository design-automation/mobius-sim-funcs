import {
    Txyz
} from '@design-automation/mobius-sim';
import { degToRad } from './_shared';
// -------------------------------------------------------------------------------------------------
// https://www.researchgate.net/publication/245385073_Subdivision_of_the_sky_hemisphere_for_luminance_measurements
// https://drajmarsh.bitbucket.io/cie-sky.html
// The Reinhart/Tregenza subdivision of the sky dome are based on
// integer subdivisions of each of the original 145 patches.
// 2 deg, 48 bands, 5220 points
// 3 deg, 32 bands, 2320 points
// 4 deg, 24 bands, 1303 points (andrew marsh calculates 1305, not sure why)
// 6 deg, 16 bands, 580 points
// 12 deg, 8 bands, 145 points
export function tregenzaSky(detail: number): Txyz[] {
    const alt_inc: number = [12, 6, 4, 3, 2][detail];
    const repeat: number = [1, 2, 3, 4, 6][detail];
    const divs: number[] = [30, 30, 24, 24, 18, 12, 6];
    let alt: number = alt_inc / 2;
    const vecs: Txyz[] = [];
    // create the dome
    for (let i = 0; i < repeat * 7; i++) {
        const num_points: number = divs[Math.floor(i / repeat)] * repeat;
        _skyRayDirsTjsCircle(num_points, alt, vecs);
        alt += alt_inc;
    }
    // add some points to the apex, following the Reinhart subdivision method
    if (detail === 0) {
        vecs.push([0,0,1]);
        return vecs;
    }
    if (detail === 1) {
        _skyRayDirsTjsCircle(4, 87, vecs);
        return vecs;
    }
    if (detail === 2) {
        _skyRayDirsTjsCircle(6, 86, vecs);
        vecs.push([0,0,1]);
        return vecs;
    }
    if (detail === 3) {
        _skyRayDirsTjsCircle(8, 85.5, vecs);
        _skyRayDirsTjsCircle(8, 88.5, vecs);
        return vecs;
    }
    if (detail === 4) {
        _skyRayDirsTjsCircle(12, 85, vecs);
        _skyRayDirsTjsCircle(12, 87, vecs);
        _skyRayDirsTjsCircle(12, 89, vecs);
        return vecs;
    }

}
// -------------------------------------------------------------------------------------------------
// altitude in degrees, 0 is on ground 90 is apex
function _skyRayDirsTjsCircle(num_points: number, alt: number, vecs: Txyz[]): void {
    alt = (90 - alt) * (Math.PI / 180);
    const rad: number = Math.sin(alt);
    const z: number = Math.cos(alt);
    const ang_inc: number = (2 * Math.PI) / num_points;
    const ang_start: number = ang_inc / 2;
    for (let i = 0; i < num_points; i++) {
        const x: number = rad * Math.sin(ang_start + (ang_inc * i));
        const y: number = rad * Math.cos(ang_start + (ang_inc * i));
        vecs.push([x, y, z]);
    }
}
// -------------------------------------------------------------------------------------------------