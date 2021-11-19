/*
 * MAKE.POLYGON
 *
 */

const mobius_sim_funcs = require('../build/mobius-sim-funcs.module');
const Funcs = mobius_sim_funcs.Funcs;
const Model = mobius_sim_funcs.Model;
// -------------------------------

function makePolygon() {
    const model = new Model(); // create a new model
    const rect = Funcs.pattern.Rectangle(model, [0, 0, 0], 20) // make a rectangle
    Funcs.make.Polygon(model, rect);
    return Funcs.io.ExportFile(model, null, Funcs.io._EIOExportDataFormat.GI); // return the export file as a string
}

return makePolygon();
