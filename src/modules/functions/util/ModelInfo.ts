import { EEntType, GIModel } from '@design-automation/mobius-sim';


// ================================================================================================
/**
 * Returns a html string representation of the contents of this model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelInfo(__model__: GIModel): string {
    let info = '<h4>Model Information:</h4>';
    info += '<ul>';
    // model attribs
    const model_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.MOD);
    if (model_attribs.length !== 0) { info += '<li>Model attribs: ' + model_attribs.join(', ') + '</li>'; }
    // collections
    const num_colls: number = __model__.modeldata.geom.query.numEnts(EEntType.COLL);
    const coll_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.COLL);
    info += '<li>';
    info += '<b>Collections</b>: ' + num_colls; // + ' (Deleted: ' + num_del_colls + ') ';
    if (coll_attribs.length !== 0) { info += 'Attribs: ' + coll_attribs.join(', '); }
    info += '</li>';
    // pgons
    const num_pgons: number = __model__.modeldata.geom.query.numEnts(EEntType.PGON);
    const pgon_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PGON);
    info += '<li>';
    info += '<b>Polygons</b>: ' + num_pgons; // + ' (Deleted: ' + num_del_pgons + ') ';
    if (pgon_attribs.length !== 0) { info += 'Attribs: ' + pgon_attribs.join(', '); }
    info += '</li>';
    // plines
    const num_plines: number = __model__.modeldata.geom.query.numEnts(EEntType.PLINE);
    const pline_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.PLINE);
    info += '<li>';
    info += '<b>Polylines</b>: ' + num_plines; // + ' (Deleted: ' + num_del_plines + ') ';
    if (pline_attribs.length !== 0) { info += 'Attribs: ' + pline_attribs.join(', '); }
    info += '</li>';
    // points
    const num_points: number = __model__.modeldata.geom.query.numEnts(EEntType.POINT);
    const point_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POINT);
    info += '<li>';
    info += '<b>Points</b>: ' + num_points; // + ' (Deleted: ' + num_del_points + ') ';
    if (point_attribs.length !== 0) { info += 'Attribs: ' + point_attribs.join(', '); }
    info += '</li>';
    // wires
    const num_wires: number = __model__.modeldata.geom.query.numEnts(EEntType.WIRE);
    const wire_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.WIRE);
    info += '<li>';
    info += '<b>Wires</b>: ' + num_wires; // + ' (Deleted: ' + num_del_wires + ') ';
    if (wire_attribs.length !== 0) { info += 'Attribs: ' + wire_attribs.join(', '); }
    info += '</li>';
    // edges
    const num_edges: number = __model__.modeldata.geom.query.numEnts(EEntType.EDGE);
    const edge_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.EDGE);
    info += '<li>';
    info += '<b>Edges</b>: ' + num_edges; // + ' (Deleted: ' + num_del_edges + ') ';
    if (edge_attribs.length !== 0) { info += 'Attribs: ' + edge_attribs.join(', '); }
    info += '</li>';
    // verts
    const num_verts: number = __model__.modeldata.geom.query.numEnts(EEntType.VERT);
    const vert_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.VERT);
    info += '<li>';
    info += '<b>Vertices</b>: ' + num_verts; // + ' (Deleted: ' + num_del_verts + ') ';
    if (vert_attribs.length !== 0) { info += 'Attribs: ' + vert_attribs.join(', '); }
    info += '</li>';
    // posis
    const num_posis: number = __model__.modeldata.geom.query.numEnts(EEntType.POSI);
    const posi_attribs: string[] = __model__.modeldata.attribs.getAttribNames(EEntType.POSI);
    info += '<li>';
    info += '<b>Positions</b>: ' + num_posis; // + ' (Deleted: ' + num_del_posis + ') ';
    if (posi_attribs.length !== 0) { info += 'Attribs: ' + posi_attribs.join(', '); }
    info += '</li>';
    // end
    info += '</ul>';
    // return the string
    return info;
}
