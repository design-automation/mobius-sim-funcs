/*
 * PATTERN.GRID
 *
 */

const mobius_sim_funcs = require('mobius-sim-funcs');
const Funcs = mobius_sim_funcs.Funcs;
const Model = mobius_sim_funcs.Model;

// -------------------------------
function makeGrid() {
    const model = new Model(); // create a new model
    Funcs.pattern.Grid(model, [0, 0, 0], 20, 10, Funcs.pattern._EGridMethod.QUADS) // make a grid
    return Funcs.io.ExportFile(model, null, Funcs.io._EIOExportDataFormat.GI); // return the export file as a string
}

return makeGrid();