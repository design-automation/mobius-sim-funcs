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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fY2hlY2tfaWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUF5RDtBQUN6RCw4REFBc0c7QUFFekYsUUFBQSxFQUFFLEdBQUc7SUFDZCxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ1YsSUFBSSxFQUFFLENBQUM7SUFDUCxNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLEVBQUUsQ0FBQztDQUNaLENBQUM7QUFDRjs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixRQUFRLENBQUMsU0FBa0IsRUFBRSxPQUFlLEVBQUUsUUFBZ0IsRUFBRSxHQUFRLEVBQUUsUUFBa0IsRUFDbkYsU0FBMEIsRUFBRSxZQUFZLEdBQUcsSUFBSTtJQUNwRSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDbkIsTUFBTSxPQUFPLEdBQVcsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDdkY7SUFDRCxzQkFBc0I7SUFDdEIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2QsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNwQyxNQUFNLE9BQU8sR0FBVyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLGdCQUFnQixHQUFHLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDO1NB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