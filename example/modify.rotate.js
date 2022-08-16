/*
 * MODIFY.ROTATE
 */
const mobius_sim_funcs = require('@design-automation/mobius-sim-funcs');
const Funcs = mobius_sim_funcs.SIMFuncs();
// -------------------------------
function makeStair() {
    for (let i = 0; i < 20; i ++) {
        const grid = Funcs.pattern.Rectangle([35, 0, i * 5], [50, 10]);
        const pg = Funcs.make.Polygon(grid);
        const edges = Funcs.query.Get('_e', pg);
        const cn = Funcs.calc.Centroid(edges[1], 'ps_average');
        Funcs.modify.Scale(edges[1], cn, 2.9)
        Funcs.modify.Rotate(pg, [0, 0, 1] , (3.14159765359 / 8) * i )
    }
    return Funcs.io.ExportData(null, 'gi'); // return the export file as a string
}
return makeStair();
