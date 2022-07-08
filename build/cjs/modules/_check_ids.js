"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIDs = exports.ID = void 0;
const _check_types_1 = require("./_check_types");
const mobius_sim_1 = require("@design-automation/mobius-sim");
exports.ID = {
    isNull: -1,
    isID: 0,
    isIDL1: 1,
    isIDL2: 2,
    isIDL3: 3,
    isIDL4: 4,
};
/**
 *
 * @param __model__
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param id_types
 * @param ent_types
 * @param check_exists
 */
function checkIDs(__model__, fn_name, arg_name, arg, id_types, ent_types, check_exists = true) {
    if (arg === undefined) {
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" is undefined.' + '<br>');
    }
    // check for null case
    if (arg === null) {
        if (id_types.indexOf(exports.ID.isNull) === -1) {
            const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
            throw new Error(err_msg + 'The argument "' + arg_name + '" cannot be null.<br>');
        }
        else {
            return null;
        }
    }
    // check list depths
    const arg_depth = (0, mobius_sim_1.getArrDepth)(arg);
    if (id_types.indexOf(arg_depth) === -1) {
        const max_depth = Math.max(...id_types);
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        if (max_depth === 0 && arg_depth > 0) {
            throw new Error(err_msg +
                'The argument "' + arg_name + '" has the wrong structure. ' +
                'A single entity ID is expected. ' +
                'However, the argument is a list of depth ' + arg_depth + '. ');
        }
        throw new Error(err_msg +
            'The argument "' + arg_name + '" has the wrong structure. ' +
            'The maximum depth of the list structure is ' + max_depth + '. ' +
            'However, the argument is a list of depth ' + arg_depth + '. ');
    }
    // create a set of allowable entity types
    let ent_types_set;
    if (ent_types === null) {
        ent_types_set = new Set([
            mobius_sim_1.EEntType.POSI,
            mobius_sim_1.EEntType.VERT,
            mobius_sim_1.EEntType.TRI,
            mobius_sim_1.EEntType.EDGE,
            mobius_sim_1.EEntType.WIRE,
            mobius_sim_1.EEntType.POINT,
            mobius_sim_1.EEntType.PLINE,
            mobius_sim_1.EEntType.PGON,
            mobius_sim_1.EEntType.COLL
        ]);
    }
    else {
        ent_types_set = new Set(ent_types);
    }
    // check the IDs
    let ents;
    try {
        ents = _checkIdsAreValid(__model__, arg, ent_types_set, check_exists, 0, arg_depth);
    }
    catch (err) {
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" contains bad IDs:' + err.message + '<br>');
    }
    // return the ents
    return ents; // returns TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][]; depends on which passes
}
exports.checkIDs = checkIDs;
/**
 *
 * @param __model__
 * @param arg
 * @param ent_types_set
 * @param check_exists
 */
function _checkIdsAreValid(__model__, arg, ent_types_set, check_exists, curr_depth, req_depth) {
    if (!Array.isArray(arg)) {
        // check array is homogeneous
        if (curr_depth !== req_depth) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is in a list that has an inconsistent depth. ' +
                'For this entity, the depth of the list is ' + curr_depth + ', while previous entities were in lists with a depth of ' + req_depth + '.' +
                '</li></ul>');
        }
        let ent_arr;
        try {
            ent_arr = (0, mobius_sim_1.idsBreak)(arg); // split
        }
        catch (err) {
            throw new Error('<ul><li>The entity ID "' + arg + '" is not a valid Entity ID.</li></ul>'); // check valid id
        }
        // check entity exists
        if (check_exists && !__model__.modeldata.geom.snapshot.hasEnt(__model__.modeldata.active_ssid, ent_arr[0], ent_arr[1])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" has been deleted.</li></ul>'); // check id exists
        }
        // check entity type
        if (!ent_types_set.has(ent_arr[0])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is not one of the perimtted types.</li></ul>');
        }
        // return the ent array
        return ent_arr;
    }
    else {
        return arg.map(a_arg => _checkIdsAreValid(__model__, a_arg, ent_types_set, check_exists, curr_depth + 1, req_depth));
    }
}
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param id_types
 * @param ent_types
 */
function _errorMsg(fn_name, arg_name, arg, id_types, ent_types) {
    let err_msg = 'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
        '<ul>' +
        '<li>Function name: "' + fn_name + '" </li>' +
        '<li>Parameter name: "' + arg_name + '" </li>' +
        '<li>Argument value: ' + JSON.stringify(arg) + ' </li>' +
        '<li>Argument value data type: ' + (0, _check_types_1.getDataTypeStrFromValue)(arg) + ' </li>' +
        '</ul>' +
        'The "' + arg_name + '" parameter accepts geometric entity IDs in the following structures:' +
        '<ul>';
    for (const id_type of id_types) {
        err_msg += '<li>' + _getDataTypeStrFromIDType(id_type) + ' </li>';
    }
    err_msg +=
        '</ul>' +
            'The entity IDs can be of the following types:' +
            '<ul>';
    for (const ent_type of ent_types) {
        err_msg +=
            '<li>' +
                _getIDTypeStr(ent_type) +
                '</li>';
    }
    err_msg += '</ul>';
    return err_msg;
}
/**
 *
 * @param check_fn
 */
function _getDataTypeStrFromIDType(id_type) {
    switch (id_type) {
        case exports.ID.isID:
            return 'an entity ID';
        case exports.ID.isIDL1:
            return 'a list of entity IDs (with a depth of 1)';
        case exports.ID.isIDL2:
            return 'a nested list of entity IDs (with a depth of 2)';
        case exports.ID.isIDL3:
            return 'a nested list of entity IDs (with a depth of 3)';
        case exports.ID.isNull:
            return 'a null value';
        default:
            return 'sorry... arg type not found';
    }
}
/**
 *
 * @param ent_type
 */
function _getIDTypeStr(ent_type) {
    switch (ent_type) {
        case mobius_sim_1.EEntType.POSI:
            return 'positions (ps)';
        case mobius_sim_1.EEntType.VERT:
            return 'vertices (_v)';
        case mobius_sim_1.EEntType.EDGE:
            return 'edges (_e)';
        case mobius_sim_1.EEntType.WIRE:
            return 'wires (_w)';
        case mobius_sim_1.EEntType.POINT:
            return 'points (pt)';
        case mobius_sim_1.EEntType.PLINE:
            return 'polylines (pl)';
        case mobius_sim_1.EEntType.PGON:
            return 'polgons (pg)';
        case mobius_sim_1.EEntType.COLL:
            return 'collections (co)';
        case null:
            return 'a null value';
        default:
            return 'Internal error... entitiy type not found';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL19jaGVja19pZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQXlEO0FBQ3pELDhEQUFzRztBQUV6RixRQUFBLEVBQUUsR0FBRztJQUNkLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDVixJQUFJLEVBQUUsQ0FBQztJQUNQLE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRSxDQUFDO0NBQ1osQ0FBQztBQUNGOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxTQUFrQixFQUFFLE9BQWUsRUFBRSxRQUFnQixFQUFFLEdBQVEsRUFBRSxRQUFrQixFQUNuRixTQUEwQixFQUFFLFlBQVksR0FBRyxJQUFJO0lBQ3BFLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNuQixNQUFNLE9BQU8sR0FBVyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLGdCQUFnQixHQUFHLFFBQVEsR0FBRyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsQ0FBQztLQUN2RjtJQUNELHNCQUFzQjtJQUN0QixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDZCxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUFXLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxHQUFHLHVCQUF1QixD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