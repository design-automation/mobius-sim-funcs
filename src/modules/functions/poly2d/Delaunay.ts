import {
    arrMakeFlat,
    EEntType,
    GIModel,
    idsBreak,
    idsMakeFromIdxs,
    isEmptyArr,
    TEntTypeIdx,
    TId,
    Txyz,
} from '@design-automation/mobius-sim';
import * as d3del from 'd3-delaunay';

import { checkIDs, ID } from '../../../_check_ids';
import { _getPosiFromMap, _getPosis, TPosisMap } from './_shared';


// ================================================================================================
/**
 * Create a delaunay triangulation of set of positions.
 * \n
 * @param __model__
 * @param entities A list of positions, or entities from which positions can be extracted.
 * @returns A list of new polygons.
 */
export function Delaunay(__model__: GIModel, entities: TId|TId[]): TId[] {
    entities = arrMakeFlat(entities) as TId[];
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'poly2d.Delaunay';
    let posis_ents_arr: TEntTypeIdx[];
    if (__model__.debug) {
        posis_ents_arr = checkIDs(__model__, fn_name, 'entities1', entities,
            [ID.isIDL1], null) as TEntTypeIdx[];
    } else {
        // posis_ents_arr = splitIDs(fn_name, 'entities1', entities,
        // [IDcheckObj.isIDList], null) as TEntTypeIdx[];
        posis_ents_arr = idsBreak(entities) as TEntTypeIdx[];
    }
    // --- Error Check ---
    const posis_map: TPosisMap = new Map();
    // posis
    const posis_i: number[] = _getPosis(__model__, posis_ents_arr);
    if (posis_i.length === 0) { return []; }
    // posis
    const d3_tri_coords: [number, number][] = [];
    for (const posi_i of posis_i) {
        const xyz: Txyz = __model__.modeldata.attribs.posis.getPosiCoords(posi_i);
        d3_tri_coords.push([xyz[0], xyz[1]]);
        _putPosiInMap(xyz[0], xyz[1], posi_i, posis_map);
    }
    // create delaunay triangulation
    const cells_i: number[] = _delaunay(__model__, d3_tri_coords, posis_map);
    // return cell pgons
    return idsMakeFromIdxs(EEntType.PGON, cells_i) as TId[];
    // return idsMake(cells_i.map( cell_i => [EEntType.PGON, cell_i] as TEntTypeIdx )) as TId[];
}
function _delaunay(__model__: GIModel, d3_tri_coords: [number, number][], posis_map: TPosisMap): number[] {
    const new_pgons_i: number[] = [];
    const delaunay = d3del.Delaunay.from(d3_tri_coords);
    const delaunay_posis_i: number[] = [];
    for (const d3_tri_coord of d3_tri_coords) {
        // TODO use the posis_map!!
        // const deauny_posi_i: number = __model__.modeldata.geom.add.addPosi();
        // __model__.modeldata.attribs.add.setPosiCoords(deauny_posi_i, [point[0], point[1], 0]);
        const delaunay_posi_i: number = _getPosiFromMap(__model__, d3_tri_coord[0], d3_tri_coord[1], posis_map);
        delaunay_posis_i.push(delaunay_posi_i);
    }
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
        const a: number = delaunay_posis_i[delaunay.triangles[i]];
        const b: number = delaunay_posis_i[delaunay.triangles[i + 1]];
        const c: number = delaunay_posis_i[delaunay.triangles[i + 2]];
        new_pgons_i.push(__model__.modeldata.geom.add.addPgon([c, b, a]));
    }
    return new_pgons_i;
}
function _putPosiInMap(arg0: number, arg1: number, posi_i: number, posis_map: TPosisMap) {
    throw new Error('Function not implemented.');
}

