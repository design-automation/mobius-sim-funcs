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
export function tregenzaSky(detail) {
    const alt_inc = [12, 6, 4, 3, 2][detail];
    const repeat = [1, 2, 3, 4, 6][detail];
    const divs = [30, 30, 24, 24, 18, 12, 6];
    let alt = alt_inc / 2;
    const vecs = [];
    // create the dome
    for (let i = 0; i < repeat * 7; i++) {
        const num_points = divs[Math.floor(i / repeat)] * repeat;
        _skyRayDirsTjsCircle(num_points, alt, vecs);
        alt += alt_inc;
    }
    // add some points to the apex, following the Reinhart subdivision method
    if (detail === 0) {
        vecs.push([0, 0, 1]);
        return vecs;
    }
    if (detail === 1) {
        _skyRayDirsTjsCircle(4, 87, vecs);
        return vecs;
    }
    if (detail === 2) {
        _skyRayDirsTjsCircle(6, 86, vecs);
        vecs.push([0, 0, 1]);
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
function _skyRayDirsTjsCircle(num_points, alt, vecs) {
    alt = (90 - alt) * (Math.PI / 180);
    const rad = Math.sin(alt);
    const z = Math.cos(alt);
    const ang_inc = (2 * Math.PI) / num_points;
    const ang_start = ang_inc / 2;
    for (let i = 0; i < num_points; i++) {
        const x = rad * Math.sin(ang_start + (ang_inc * i));
        const y = rad * Math.cos(ang_start + (ang_inc * i));
        vecs.push([x, y, z]);
    }
}
// -------------------------------------------------------------------------------------------------
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3RyZWdlbnphX3NreS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hbmFseXplL190cmVnZW56YV9za3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsb0dBQW9HO0FBQ3BHLGtIQUFrSDtBQUNsSCw4Q0FBOEM7QUFDOUMsaUVBQWlFO0FBQ2pFLDREQUE0RDtBQUM1RCwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLDRFQUE0RTtBQUM1RSw4QkFBOEI7QUFDOUIsOEJBQThCO0FBQzlCLE1BQU0sVUFBVSxXQUFXLENBQUMsTUFBYztJQUN0QyxNQUFNLE9BQU8sR0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxNQUFNLElBQUksR0FBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELElBQUksR0FBRyxHQUFXLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFDO0lBQ3hCLGtCQUFrQjtJQUNsQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDakUsb0JBQW9CLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFB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