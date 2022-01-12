import { EAttribPush, EEntType, getArrDepth, GIModel, idsBreak, TEntTypeIdx, TId } from '@design-automation/mobius-sim';
import uscore from 'underscore';

import { checkAttribName, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
import { _EAttribPushTarget } from './_enum';
import { _getAttribPushTarget } from './_shared';



// ================================================================================================
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * \n
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export function Push(__model__: GIModel, entities: TId|TId[],
        attrib: string|[string, number|string]|[string, number|string, string]|[string, number|string, string, number|string],
        ent_type_sel: _EAttribPushTarget, method_sel: _EPushMethodSel): void {
    if (entities !== null) {
        const depth = getArrDepth(entities);
        if (depth === 0) {
            entities = [entities] as TId[];
        } else if (depth === 2) {
            // @ts-ignore
            entities = uscore.flatten(entities) as TId[];
        }
    }
    // --- Error Check ---
    const fn_name = 'attrib.Push';

    let ents_arr: TEntTypeIdx[] = null;
    let source_attrib_name: string;
    let source_attrib_idx_key: number|string;
    let target_attrib_name: string;
    let target_attrib_idx_key: number|string;
    let source_ent_type: EEntType;
    const indices: number[] = [];
    let target: EEntType|string;
    let source_attrib: [string, number|string] = null;
    let target_attrib: [string, number|string] = null;
    if (Array.isArray(attrib)) {
        // set source attrib
        source_attrib = [
            attrib[0] as string,
            (attrib.length > 1 ? attrib[1] : null) as number|string
        ];
        // set target attrib
        target_attrib = [
            (attrib.length > 2 ? attrib[2] : attrib[0]) as string,
            (attrib.length > 3 ? attrib[3] : null) as number|string
        ];
    } else {
        source_attrib = [attrib, null];
        target_attrib = [attrib, null];
    }

    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null) as TEntTypeIdx[];
        }
        [source_attrib_name, source_attrib_idx_key] = checkAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = checkAttribNameIdxKey(fn_name, target_attrib);
        // --- Error Check ---
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            if (ent_arr[0] !== source_ent_type) {
                throw new Error('The entities must all be of the same type.');
            }
            indices.push(ent_arr[1]);
        }
        // check the names
        checkAttribName(fn_name, source_attrib_name);
        checkAttribName(fn_name, target_attrib_name);
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
        if (source_ent_type === target) {
            throw new Error('The new attribute is at the same level as the existing attribute.');
        }
    } else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities) as TEntTypeIdx[];
        }
        [source_attrib_name, source_attrib_idx_key] = splitAttribNameIdxKey(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = splitAttribNameIdxKey(fn_name, target_attrib);
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            indices.push(ent_arr[1]);
        }
        // get the target ent_type
        target = _getAttribPushTarget(ent_type_sel);
    }
    // get the method
    const method: EAttribPush = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices,
                                         target,          target_attrib_name, target_attrib_idx_key, method);
}
export enum _EPushMethodSel {
    FIRST = 'first',
    LAST = 'last',
    AVERAGE = 'average',
    MEDIAN = 'median',
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max'
}
function _convertPushMethod(select: _EPushMethodSel): EAttribPush {
    switch (select) {
        case _EPushMethodSel.AVERAGE:
            return EAttribPush.AVERAGE;
        case _EPushMethodSel.MEDIAN:
            return EAttribPush.MEDIAN;
        case _EPushMethodSel.SUM:
            return EAttribPush.SUM;
        case _EPushMethodSel.MIN:
            return EAttribPush.MIN;
        case _EPushMethodSel.MAX:
            return EAttribPush.MAX;
        case _EPushMethodSel.FIRST:
            return EAttribPush.FIRST;
        case _EPushMethodSel.LAST:
            return EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
