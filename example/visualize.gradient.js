/*
 * VISUALIZE.GRADIENT
 */
const mobius_sim_funcs = require('@design-automation/mobius-sim-funcs');
const Funcs = mobius_sim_funcs.SIMFuncs();
// -------------------------------
function rainbowCubes() {
    // using a loop to generate a grid of cubes 
    for (let i = 0; i < 5; i ++) {
        for (let j = 0; j < 5; j ++) {
            for (let k = 0; k < 5; k ++) {
                const grid = Funcs.pattern.Rectangle([i * 50, j * 50, k * 50], 20);
                const pg = Funcs.make.Polygon(grid);
                const cube = Funcs.make.Extrude(pg, 20, 1, 'quads')      
            }}}
    const allpos = Funcs.query.Get('ps', null);
    const allpgons = Funcs.query.Get('pg', null);
    Funcs.attrib.Push(allpos, ["xyz", 0, "height"], 'pg', 'first'); //push "height" attributes from posis to polygons
    Funcs.visualize.Gradient(allpgons, 'height', [0, 200], 'false_color') //use "height" values to set colours
    return Funcs.io.ExportData(null, 'gi'); // return the export file as a string
}
return rainbowCubes();
