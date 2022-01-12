import * as chk from './_check_types';
// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
export function checkAttribName(fn_name, attrib_name) {
    chk.isStr(attrib_name); // check arg is string
    if (attrib_name === undefined) {
        throw new Error(fn_name + ': ' + 'attrib_name is undefined');
    }
    if (attrib_name.length === 0) {
        throw new Error(fn_name + ': ' + 'attrib_name not specified');
    }
    if (attrib_name.search(/\W/) !== -1) {
        throw new Error(fn_name + ': ' + 'attrib_name contains restricted characters');
    }
    if (attrib_name[0].search(/[0-9]/) !== -1) {
        throw new Error(fn_name + ': ' + 'attrib_name should not start with numbers');
    }
    // blocks writing to id
    if (attrib_name === 'id') {
        throw new Error(fn_name + ': id is not modifiable!');
    }
}
export function checkAttribIdxKey(fn_name, idx_or_key) {
    // -- check defined index
    if (typeof idx_or_key === 'number') {
        // check if index is number
        chk.isNum(idx_or_key);
        // this is an item in a list, the item value can be any
    }
    else if (typeof idx_or_key === 'string') {
        // check if index is number
        chk.isStr(idx_or_key);
        // this is an item in an object, the item value can be any
    }
    else {
        throw new Error(fn_name + ': index or key is not a valid type: ' + idx_or_key);
    }
}
export function checkAttribNameIdxKey(fn_name, attrib) {
    let attrib_name = null;
    let attrib_idx_key = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        if (attrib.length !== 2) {
            throw new Error(fn_name + ': ' + 'attrib_name not specified');
        }
        attrib_name = attrib[0];
        attrib_idx_key = attrib[1];
    }
    else {
        attrib_name = attrib;
    }
    // check that the name is ok
    checkAttribName(fn_name, attrib_name);
    // check that the array index or object key is ok
    if (attrib_idx_key !== null) {
        checkAttribIdxKey(fn_name, attrib_idx_key);
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function splitAttribNameIdxKey(fn_name, attrib) {
    let attrib_name = null;
    let attrib_idx_key = null;
    // deconstruct the attrib arg
    if (Array.isArray(attrib)) {
        attrib_name = attrib[0];
        attrib_idx_key = attrib[1];
    }
    else {
        attrib_name = attrib;
    }
    // return the deconstructed attrib arg, attrib_idx_key may be null
    return [attrib_name, attrib_idx_key];
}
export function checkAttribValue(fn_name, attrib_value) {
    // if it is undefined, then we are deleting the attribute value
    if (attrib_value === undefined) {
        return;
    }
    // check the actual value
    chk.checkArgs(fn_name, 'attrib_value', attrib_value, [chk.isNull, chk.isStr, chk.isNum, chk.isBool, chk.isList, chk.isDict]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2F0dHJpYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvX2NoZWNrX2F0dHJpYnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0Qyw0SUFBNEk7QUFDNUksbUJBQW1CO0FBQ25CLDRJQUE0STtBQUM1SSxNQUFNLFVBQVUsZUFBZSxDQUFDLE9BQWUsRUFBRSxXQUFtQjtJQUNoRSxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO0lBQzlDLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtRQUMzQixNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsMEJBQTBCLENBQUMsQ0FBQztLQUNqRTtJQUNELElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLDJCQUEyQixDQUFDLENBQUM7S0FDbEU7SUFDRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLDRDQUE0QyxDQUFDLENBQUM7S0FDbkY7SUFDRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxJQUFJLEtBQUssQ0FBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLDJDQUEyQyxDQUFDLENBQUM7S0FDbEY7SUFDRCx1QkFBdUI7SUFDdkIsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLHlCQUF5QixDQUFDLENBQUM7S0FDeEQ7QUFDTCxDQUFDO0FBQ0QsTUFBTSxVQUFV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