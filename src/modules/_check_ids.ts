import { getDataTypeStrFromValue } from './_check_types';
import { GIModel, EEntType, TEntTypeIdx, idsBreak, getArrDepth } from '@design-automation/mobius-sim';

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
export function checkIDs(__model__: GIModel, fn_name: string, arg_name: string, arg: any, id_types: number[],
                         ent_types: EEntType[]|null, check_exists = true): TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][] {
    if (arg === undefined) {
        const err_msg: string = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
        throw new Error(err_msg + 'The argument "' + arg_name + '" is undefined.' + '<br>');
    }
    // check for null case
    if (arg === null) {
        if (id_types.indexOf(ID.isNull) === -1) {
            const err_msg: string = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
            throw new Error(err_msg + 'The argument "' + arg_name + '" cannot be null.<br>');
        } else {
            return null;
        }
    }
    // check list depths
    const arg_depth: number = getArrDepth(arg);
    if (id_types.indexOf(arg_depth) === -1) {
        const max_depth: number = Math.max( ...id_types );
        const err_msg: string = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
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
    // if null, then ent_types is all ents
    if (ent_types === null) {
        ent_types = [
            EEntType.POSI,
            EEntType.VERT,
            EEntType.TRI,
            EEntType.EDGE,
            EEntType.WIRE,
            EEntType.POINT,
            EEntType.PLINE,
            EEntType.PGON,
            EEntType.COLL];
    }
    // create a set of allowable entity types
    const ent_types_set: Set<number> = new Set(ent_types);
    // check the IDs
    let ents: TEntTypeIdx|TEntTypeIdx[]|TEntTypeIdx[][];
    try {
        ents = _checkIdsAreValid(__model__, arg, ent_types_set, check_exists, 0, arg_depth);
    } catch (err) {
        const err_msg: string = _errorMsg(fn_name, arg_name, arg, id_types, ent_types);
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
function _checkIdsAreValid(__model__: GIModel, arg: any, ent_types_set: Set<number>, check_exists: boolean, curr_depth: number, req_depth: number):
    TEntTypeIdx | TEntTypeIdx[] | TEntTypeIdx[][] {
    if (!Array.isArray(arg)) {
        // check array is homogeneous
        if (curr_depth !== req_depth) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is in a list that has an inconsistent depth. ' +
                'For this entity, the depth of the list is ' + curr_depth + ', while previous entities were in lists with a depth of ' + req_depth + '.' +
                '</li></ul>');
        }
        // check entity exists
        if (!check_exists) {
            // in thise case we dont want to throw an error for entities that do not exist
            // we will check later and return true or false to the user
            const _ent_type_str: string = arg.slice(0, 2);
            // TODO
            const _ent_type: number = 
                ['ps','_v','_t','_e','_w','pt','pl','pg','co','mo'].indexOf(_ent_type_str);
            if (_ent_type === -1) {
                throw new Error('<ul><li>The entity ID "' + arg + '" is invalid.</li></ul>');
            }
            const _ent_i: number = parseInt(arg.slice(2));
            return [_ent_type, _ent_i] as TEntTypeIdx;
        }
        // check the entity exists
        let ent_arr: TEntTypeIdx;
        try {
            ent_arr = idsBreak(arg) as TEntTypeIdx; // split
        } catch (err) {
            throw new Error('<ul><li>The entity ID "' + arg + '" is not a valid Entity ID.</li></ul>'); // check valid id
        }
        // check entity exists
        if (!__model__.modeldata.geom.snapshot.hasEnt(__model__.modeldata.active_ssid, ent_arr[0], ent_arr[1])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" has been deleted.</li></ul>'); // check id exists
        }
        // check entity type
        if (!ent_types_set.has(ent_arr[0])) {
            throw new Error('<ul><li>The entity with the ID "' + arg + '" is not one of the perimtted types.</li></ul>');
        }
        // return the ent array
        return ent_arr as TEntTypeIdx;
    } else {
        return arg.map(a_arg => _checkIdsAreValid(__model__, a_arg, ent_types_set, check_exists, curr_depth + 1, req_depth)) as TEntTypeIdx[] | TEntTypeIdx[][];
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
function _errorMsg(fn_name: string, arg_name: string, arg: any, id_types: number[], ent_types: EEntType[]|null): string {
    let err_msg =
        'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
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
function _getDataTypeStrFromIDType(id_type: any, ): string {
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
function _getIDTypeStr(ent_type: EEntType): string {
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
