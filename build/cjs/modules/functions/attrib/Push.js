"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._EPushMethodSel = exports.Push = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const underscore_1 = __importDefault(require("underscore"));
const _check_attribs_1 = require("../../../_check_attribs");
const _check_ids_1 = require("../../../_check_ids");
const _shared_1 = require("./_shared");
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
function Push(__model__, entities, attrib, ent_type_sel, method_sel) {
    if (entities !== null) {
        const depth = (0, mobius_sim_1.getArrDepth)(entities);
        if (depth === 0) {
            entities = [entities];
        }
        else if (depth === 2) {
            // @ts-ignore
            entities = underscore_1.default.flatten(entities);
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
            ents_arr = (0, _check_ids_1.checkIDs)(__model__, fn_name, 'entities', entities, [_check_ids_1.ID.isID, _check_ids_1.ID.isIDL1], null);
        }
        [source_attrib_name, source_attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = (0, _check_attribs_1.checkAttribNameIdxKey)(fn_name, target_attrib);
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
        (0, _check_attribs_1.checkAttribName)(fn_name, source_attrib_name);
        (0, _check_attribs_1.checkAttribName)(fn_name, target_attrib_name);
        // get the target ent_type
        target = (0, _shared_1._getAttribPushTarget)(ent_type_sel);
        if (source_ent_type === target) {
            throw new Error('The new attribute is at the same level as the existing attribute.');
        }
    }
    else {
        if (entities !== null && entities !== undefined) {
            ents_arr = (0, mobius_sim_1.idsBreak)(entities);
        }
        [source_attrib_name, source_attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, source_attrib);
        [target_attrib_name, target_attrib_idx_key] = (0, _check_attribs_1.splitAttribNameIdxKey)(fn_name, target_attrib);
        // get the source ent_type and indices
        source_ent_type = ents_arr[0][0];
        for (const ent_arr of ents_arr) {
            indices.push(ent_arr[1]);
        }
        // get the target ent_type
        target = (0, _shared_1._getAttribPushTarget)(ent_type_sel);
    }
    // get the method
    const method = _convertPushMethod(method_sel);
    // do the push
    __model__.modeldata.attribs.push.pushAttribVals(source_ent_type, source_attrib_name, source_attrib_idx_key, indices, target, target_attrib_name, target_attrib_idx_key, method);
}
exports.Push = Push;
var _EPushMethodSel;
(function (_EPushMethodSel) {
    _EPushMethodSel["FIRST"] = "first";
    _EPushMethodSel["LAST"] = "last";
    _EPushMethodSel["AVERAGE"] = "average";
    _EPushMethodSel["MEDIAN"] = "median";
    _EPushMethodSel["SUM"] = "sum";
    _EPushMethodSel["MIN"] = "min";
    _EPushMethodSel["MAX"] = "max";
})(_EPushMethodSel = exports._EPushMethodSel || (exports._EPushMethodSel = {}));
function _convertPushMethod(select) {
    switch (select) {
        case _EPushMethodSel.AVERAGE:
            return mobius_sim_1.EAttribPush.AVERAGE;
        case _EPushMethodSel.MEDIAN:
            return mobius_sim_1.EAttribPush.MEDIAN;
        case _EPushMethodSel.SUM:
            return mobius_sim_1.EAttribPush.SUM;
        case _EPushMethodSel.MIN:
            return mobius_sim_1.EAttribPush.MIN;
        case _EPushMethodSel.MAX:
            return mobius_sim_1.EAttribPush.MAX;
        case _EPushMethodSel.FIRST:
            return mobius_sim_1.EAttribPush.FIRST;
        case _EPushMethodSel.LAST:
            return mobius_sim_1.EAttribPush.LAST;
        default:
            break;
    }
}
// ================================================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hdHRyaWIvUHVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBd0g7QUFDeEgsNERBQWdDO0FBRWhDLDREQUF3RztBQUN4RyxvREFBbUQ7QUFFbkQsdUNBQWlEO0FBSWpELG1HQUFtRztBQUNuRzs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixJQUFJLENBQUMsU0FBa0IsRUFBRSxRQUFtQixFQUNwRCxNQUFxSCxFQUNySCxZQUFnQyxFQUFFLFVBQTJCO0lBQ2pFLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUNuQixNQUFNLEtBQUssR0FBRyxJQUFBLHdCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2IsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFVLENBQUM7U0FDbEM7YUFBTSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDcEIsYUFBYTtZQUNiLFFBQVEsR0FBRyxvQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQVUsQ0FBQztTQUNoRDtLQUNKO0lBQ0Qsc0JBQXNCO0lBQ3RCLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQztJQUU5QixJQUFJLFFBQVEsR0FBa0IsSUFBSSxDQUFDO0lBQ25DLElBQUksa0JBQTBCLENBQUM7SUFDL0IsSUFBSSxxQkFBb0MsQ0FBQztJQUN6QyxJQUFJLGtCQUEwQixDQUFDO0lBQy9CLElBQUkscUJBQW9DLENBQUM7SUFDekMsSUFBSSxlQUF5QixDQUFDO0lBQzlCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUM3QixJQUFJLE1BQXVCLENBQUM7SUFDNUIsSUFBSSxhQUFhLEdBQTRCLElBQUksQ0FBQztJQUNsRCxJQUFJLGFBQWEsR0FBNEIsSUFBSSxDQUFDO0lBQ2xELElBQUksS0FBSyxDQUFDLE9BQU8s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