/*
 * MODIFY.OFFSET
 */
const mobius_sim_funcs = require('@design-automation/mobius-sim-funcs');
const Funcs = mobius_sim_funcs.Funcs();
// -------------------------------
function modifyOffset() {
    // creating posis in a 3D arrangement
    const a = Funcs.make.Position([5, 0, 10]) 
    const b = Funcs.make.Position([17, 2, 11]) 
    const c = Funcs.make.Position([8, 6, 18]) 
    const d = Funcs.make.Position([11, 0, 22]) 
    const pgon1 = Funcs.make.Polygon([a,b,d,c]) // creating a pgon
    const pgon2 = Funcs.make.copy(pgon1, null)
    Funcs.modify.Offset(pgon2, 3)
    return Funcs.io.ExportData(null, 'gi'); // return the export file as a string
}
return modifyOffset();
