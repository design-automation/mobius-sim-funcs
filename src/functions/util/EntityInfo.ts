import { arrMakeFlat, EAttribNames, ENT_TYPE, Sim, idsBreak, string, string } from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';


// ================================================================================================
/**
 * Returns a html string representation of one or more entities in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param entities One or more objects or collections.
 * @returns Text that summarises what is in the model, click print to see this text.

 */
export function EntityInfo(__model__: Sim, entities: string|string[]): string {
    entities = arrMakeFlat(entities) as string[];
    // // --- Error Check ---
    // const fn_name = 'util.EntityInfo';
    // let ents_arr: string[];
    // if (this.debug) {
    //     ents_arr = checkIDs(__model__, fn_name, 'coll', entities,
    //         [ID.isID, ID.isIDL1],
    //         [ENT_TYPE.COLL, ENT_TYPE.PGON, ENT_TYPE.PLINE, ENT_TYPE.POINT]) as string[];
    // } else {
    //     ents_arr = idsBreak(entities) as string[];
    // }
    // // --- Error Check ---
    let result = '<h4>Entity Information:</h4>';
    for (const ent_arr of ents_arr) {
        const [ent_type, ent_i] = ent_arr;
        switch (ent_type) {
            case ENT_TYPE.COLL:
                result += _collInfo(__model__, ent_i);
                break;
            case ENT_TYPE.PGON:
                result += _pgonInfo(__model__, ent_i);
                break;
            case ENT_TYPE.PLINE:
                result += _plineInfo(__model__, ent_i);
                break;
            case ENT_TYPE.POINT:
                result += _pointInfo(__model__, ent_i);
                break;
            default:
                break;
        }
    }
    return result;
}
function _getAttribs(__model__: Sim, ent_type: ENT_TYPE, ent_i: number): string[] {
    const names: string[] = __model__.modeldata.attribs.getAttribNames(ent_type);
    const attribs_with_vals = [];
    for (const name of names) {
        const val = __model__.modeldata.attribs.get.getEntAttribVal(ent_type, ent_i, name);
        if (val !== undefined) {
            attribs_with_vals.push(name);
        }
    }
    return attribs_with_vals;
}
function _getColls(__model__: Sim, ent_type: ENT_TYPE, ent_i: number): string[] {
    const ssid: number = __model__.modeldata.active_ssid;
    let colls_i: number[] = [];
    if (ent_type === ENT_TYPE.COLL) {
        const parent: number = __model__.modeldata.geom.snapshot.getCollParent(ssid, ent_i);
        if (parent !== -1) { colls_i = [parent]; }
    } else {
        colls_i = __model__.modeldata.geom.nav.navAnyToColl(ent_type, ent_i);
    }
    const colls_names = [];
    for (const coll_i of colls_i) {
        let coll_name = 'No name';
        if (__model__.modeldata.attribs.query.hasEntAttrib(ENT_TYPE.COLL, EAttribNames.COLL_NAME)) {
            coll_name = __model__.modeldata.attribs.get.getEntAttribVal(ENT_TYPE.COLL, coll_i, EAttribNames.COLL_NAME) as string;
        }
        colls_names.push(coll_name);
    }
    return colls_names;
}
function _pointInfo(__model__: Sim, point_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, ENT_TYPE.POINT, point_i);
    const colls_names = _getColls(__model__, ENT_TYPE.POINT, point_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Point</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _plineInfo(__model__: Sim, pline_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, ENT_TYPE.PLINE, pline_i);
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(ENT_TYPE.PLINE, pline_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(ENT_TYPE.PLINE, pline_i).length;
    const colls_names = _getColls(__model__, ENT_TYPE.PLINE, pline_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polyline</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _pgonInfo(__model__: Sim, pgon_i: number): string {
    let info = '';
    // get the data
    const attribs: string[] = _getAttribs(__model__, ENT_TYPE.PGON, pgon_i);
    const num_verts: number = __model__.modeldata.geom.nav.navAnyToVert(ENT_TYPE.PGON, pgon_i).length;
    const num_edges: number = __model__.modeldata.geom.nav.navAnyToEdge(ENT_TYPE.PGON, pgon_i).length;
    const num_wires: number = __model__.modeldata.geom.nav.navAnyToWire(ENT_TYPE.PGON, pgon_i).length;
    const colls_i: number[] = __model__.modeldata.geom.nav.navPgonToColl(pgon_i);
    const colls_names = _getColls(__model__, ENT_TYPE.PGON, pgon_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Polygon</b></li>';
    info += '<ul>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_verts) { info += '<li>Num verts: ' + num_verts + '</li>'; }
    if (num_edges) { info += '<li>Num edges: ' + num_edges + '</li>'; }
    if (num_wires) { info += '<li>Num wires: ' + num_wires + '</li>'; }
    if (colls_i.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_i.length > 1) {
        info += '<li>In ' + colls_i.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
function _collInfo(__model__: Sim, coll_i: number): string {
    const ssid: number = __model__.modeldata.active_ssid;
    let info = '';
    // get the data
    let coll_name = 'None';
    if (__model__.modeldata.attribs.query.hasEntAttrib(ENT_TYPE.COLL, EAttribNames.COLL_NAME)) {
        coll_name = __model__.modeldata.attribs.get.getEntAttribVal(ENT_TYPE.COLL, coll_i, EAttribNames.COLL_NAME) as string;
    }
    const attribs: string[] = _getAttribs(__model__, ENT_TYPE.COLL, coll_i);
    const num_pgons: number = __model__.modeldata.geom.nav.navCollToPgon(coll_i).length;
    const num_plines: number = __model__.modeldata.geom.nav.navCollToPline(coll_i).length;
    const num_points: number = __model__.modeldata.geom.nav.navCollToPoint(coll_i).length;
    const colls_names = _getColls(__model__, ENT_TYPE.COLL, coll_i);
    // make str
    info += '<ul>';
    info += '<li>Type: <b>Collection</b></li>';
    info += '<ul>';
    info += '<li>Name: <b>' + coll_name + '</b></li>';
    if (attribs.length !== 0) { info += '<li>Attribs: ' + attribs.join(', ') + '</li>'; }
    if (num_pgons) { info += '<li>Num pgons: ' + num_pgons + '</li>'; }
    if (num_plines) { info += '<li>Num plines: ' + num_plines + '</li>'; }
    if (num_points) { info += '<li>Num points: ' + num_points + '</li>'; }
    if (colls_names.length === 1) {
        info += '<li>In collection: ' + colls_names[0] + '</li>';
    } else if (colls_names.length > 1) {
        info += '<li>In ' + colls_names.length + ' collections: ' + colls_names.join(', ') + '</li>';
    }
    const children: number[] = __model__.modeldata.geom.snapshot.getCollChildren(ssid, coll_i);
    if (children.length > 0) {
        info += '<li>Child collections: </li>';
        for (const child of children) {
            info += _collInfo(__model__, child);
        }
    }
    info += '</ul>';
    info += '</ul>';
    return info;
}
