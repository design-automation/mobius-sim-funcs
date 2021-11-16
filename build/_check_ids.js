import { getDataTypeStrFromValue } from './_check_types';
import { EEntType, idsBreak, getArrDepth } from '@design-automation/mobius-sim';
export const ID = {
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
export function checkIDs(__model__, fn_name, arg_name, arg, id_types, ent_types, check_exists = true) {
    if (arg === undefined) {
        const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" is undefined.' + '<br>');
    }
    // check for null case
    if (arg === null) {
        if (id_types.indexOf(ID.isNull) === -1) {
            const err_msg = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
            throw new Error(err_msg + 'The argument "' + arg_name + '" cannot be null.<br>');
        }
        else {
            return null;
        }
    }
    // check list depths
    const arg_depth = getArrDepth(arg);
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
            EEntType.POSI,
            EEntType.VERT,
            EEntType.TRI,
            EEntType.EDGE,
            EEntType.WIRE,
            EEntType.POINT,
            EEntType.PLINE,
            EEntType.PGON,
            EEntType.COLL
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
            ent_arr = idsBreak(arg); // split
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
        '<li>Argument value data type: ' + getDataTypeStrFromValue(arg) + ' </li>' +
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
        case ID.isID:
            return 'an entity ID';
        case ID.isIDL1:
            return 'a list of entity IDs (with a depth of 1)';
        case ID.isIDL2:
            return 'a nested list of entity IDs (with a depth of 2)';
        case ID.isIDL3:
            return 'a nested list of entity IDs (with a depth of 3)';
        case ID.isNull:
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
        case EEntType.POSI:
            return 'positions (ps)';
        case EEntType.VERT:
            return 'vertices (_v)';
        case EEntType.EDGE:
            return 'edges (_e)';
        case EEntType.WIRE:
            return 'wires (_w)';
        case EEntType.POINT:
            return 'points (pt)';
        case EEntType.PLINE:
            return 'polylines (pl)';
        case EEntType.PGON:
            return 'polgons (pg)';
        case EEntType.COLL:
            return 'collections (co)';
        case null:
            return 'a null value';
        default:
            return 'Internal error... entitiy type not found';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2lkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9fY2hlY2tfaWRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBVyxRQUFRLEVBQWUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRXRHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRztJQUNkLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDVixJQUFJLEVBQUUsQ0FBQztJQUNQLE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7SUFDVCxNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRSxDQUFDO0NBQ1osQ0FBQztBQUNGOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUMsU0FBa0IsRUFBRSxPQUFlLEVBQUUsUUFBZ0IsRUFBRSxHQUFRLEVBQUUsUUFBa0IsRUFDbkYsU0FBMEIsRUFBRSxZQUFZLEdBQUcsSUFBSTtJQUNwRSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDbkIsTUFBTSxPQUFPLEdBQVcsU0FBUyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDdkY7SUFDRCxzQkFBc0I7SUFDdEIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2QsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNwQyxNQUFNLE9BQU8sR0FBVyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNB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