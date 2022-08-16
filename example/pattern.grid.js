/*
 * PATTERN.GRID
 */
const mobius_sim_funcs = require('@design-automation/mobius-sim-funcs');
const Funcs = mobius_sim_funcs.SIMFuncs();
// -------------------------------
function makeGrid() {
    Funcs.pattern.Grid([0, 0, 0], 20, 10, 'quads') // make a grid
    return Funcs.io.ExportData(null, 'gi'); // return the export file as a string
}
return makeGrid();