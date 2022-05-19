import { GIModel, idsBreak, isEmptyArr, TEntTypeIdx, TId, Txyz } from '@design-automation/mobius-sim';

import { checkIDs, ID } from '../../../_check_ids';
import { getCenterOfMass, getCentroid } from '../_common';
import { _ECentroidMethod } from './_enum';



// ================================================================================================
/**
 * Calculates the centroid of an entity.
 * \n
 * If 'ps\_average' is selected, the centroid is the average of the positions that make up that entity.
 * \n
 * If 'center\_of\_mass' is selected, the centroid is the centre of mass of the faces that make up that entity.
 * Note that only faces are deemed to have mass.
 * \n
 * Given a list of entities, a list of centroids will be returned.
 * \n
 * Given a list of positions, a single centroid that is the average of all those positions will be returned.
 *
 * @param __model__
 * @param entities Single or list of entities. (Can be any type of entities.)
 * @param method Enum, the method for calculating the centroid.
 * @returns A centroid [x, y, z] or a list of centroids.
 * @example centroid1 = calc.Centroid (polygon1)
 */
export function Centroid(__model__: GIModel, entities: TId|TId[], method: _ECentroidMethod): Txyz|Txyz[] {
    if (isEmptyArr(entities)) { return []; }
    // --- Error Check ---
    const fn_name = 'calc.Centroid';
    let ents_arrs: TEntTypeIdx|TEntTypeIdx[];
    if (__model__.debug) {
        ents_arrs = checkIDs(__model__, fn_name, 'entities', entities,
        [ID.isID, ID.isIDL1], null) as TEntTypeIdx|TEntTypeIdx[];
    } else {
        ents_arrs = idsBreak(entities) as TEntTypeIdx|TEntTypeIdx[];
    }
    // --- Error Check ---
    switch (method) {
        case _ECentroidMethod.PS_AVERAGE:
            return getCentroid(__model__, ents_arrs);
        case _ECentroidMethod.CENTER_OF_MASS:
            return getCenterOfMass(__model__, ents_arrs);
        default:
            break;
    }
}

