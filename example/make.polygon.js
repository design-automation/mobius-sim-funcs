/*
 * MAKE.POLYGON
 */
const mobius_sim_funcs = require('@design-automation/mobius-sim-funcs');
const Funcs = mobius_sim_funcs.Funcs();
// -------------------------------
function makePolygon() {
    const rect = Funcs.pattern.Rectangle([0, 0, 0], 20) // make a rectangle
    Funcs.make.Polygon(rect);
    return Funcs.io.ExportData(null, 'gi'); // return the export file as a string
}
return makePolygon();
