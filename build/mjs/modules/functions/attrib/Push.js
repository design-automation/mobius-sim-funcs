import { EAttribPush, getArrDepth, idsBreak } from '@design-automation/mobius-sim';
import uscore from 'underscore';
import { checkAttribName, checkAttribNameIdxKey, splitAttribNameIdxKey } from '../../../_check_attribs';
import { checkIDs, ID } from '../../../_check_ids';
import { _EPushMethodSel } from './_enum';
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
export function Push(__model__, entities, attrib, ent_type_sel, method_sel) {
    if (entities !== null) {
        const depth = getArrDepth(entities);
        if (depth === 0) {
            entities = [entities];
        }
        else if (depth === 2) {
            // @ts-ignore
            entities = uscore.flatten(entities);
        }
    }
    // --- Error Check ---
    const fn_name = 'attrib.Push';
    let ents_arr = null;
    let source_attrib_name;
    let source_attrib_idx_key;
    let target_attrib_name;
    let target_attrib_idx_key;
    let source_ent_type;
    const indices = [];
    let target;
    let source_attrib = null;
    let target_attrib = null;
    if (Array.isArray(attrib)) {
        // set source attrib
        source_attrib = [
            attrib[0],
            (attrib.length > 1 ? attrib[1] : null)
        ];
        // set target attrib
        target_attrib = [
            (attrib.length > 2 ? attrib[2] : attrib[0]),
            (attrib.length > 3 ? attrib[3] : null)
        ];
    }
    else {
        source_attrib = [attrib, null];
        target_attrib = [attrib, null];
    }
    if (__model__.debug) {
        if (entities !== null && entities !== undefined) {
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities, [ID.isID, ID.isIDL1], null);
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
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = idsBreak(entities);
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
    const method = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices, target, target_attrib_name, target_attrib_idx_key, method);
}
function _convertPushMethod(select) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hdHRyaWIvUHVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFZLFdBQVcsRUFBVyxRQUFRLEVBQW9CLE1BQU0sK0JBQStCLENBQUM7QUFDeEgsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBRWhDLE9BQU8sRUFBRSxlQUFlLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBc0IsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUlqRCxtR0FBbUc7QUFDbkc7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBQyxTQUFrQixFQUFFLFFBQW1CLEVBQ3BELE1BQXFILEVBQ3JILFlBQWdDLEVBQUUsVUFBMkI7SUFDakUsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDYixRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQVUsQ0FBQztTQUNsQzthQUFNLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNwQixhQUFhO1lBQ2IsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFVLENBQUM7U0FDaEQ7S0FDSjtJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7SUFFOUIsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztJQUNuQyxJQUFJLGtCQUEwQixDQUFDO0lBQy9CLElB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