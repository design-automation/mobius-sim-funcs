// =====================================================================================================================
// util - check type
// =====================================================================================================================
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
export function checkArgs(fn_name, arg_name, arg, check_fns) {
    let pass = false;
    const err_arr = [];
    let ret;
    if (arg === undefined) {
        throw new Error(fn_name + ': ' + arg_name + ' is undefined' + '<br>');
    }
    for (let i = 0; i < check_fns.length; i++) {
        try {
            ret = check_fns[i](arg);
        }
        catch (err) {
            err_arr.push(err.message + '<br>');
            continue;
        }
        pass = true;
        break; // passed
    }
    if (pass === false) { // Failed all tests: argument does not fall into any valid types
        // const ret_msg = fn_name + ': ' + arg_name + ' failed the following tests:<br>';
        // throw new Error(ret_msg + err_arr.join(''));
        let err_msg = 'One of the arguments passed to the ' + fn_name + ' function is invalid. ' +
            '<ul>' +
            '<li>Function name: "' + fn_name + '" </li>' +
            '<li>Parameter name: "' + arg_name + '" </li>' +
            '<li>Argument value: ' + _getSampleStr(arg) + ' </li>' +
            '<li>Argument value data type: ' + getDataTypeStrFromValue(arg) + ' </li>' +
            '</ul>' +
            'The "' + arg_name + '" parameter accepts the following data types:' +
            '<ul>';
        for (const check_fn of check_fns) {
            err_msg = err_msg + '<li>' + _getDataTypeStrFromFunc(check_fn) + ' </li>';
        }
        err_msg = err_msg +
            '</ul>' +
            ' Make sure that the agument passed to the "' + arg_name + '" parameter matches one of the above perimtted data types.';
        throw new Error(err_msg);
    }
    return ret;
}
function _getSampleStr(arg) {
    let str;
    if (Array.isArray(arg)) {
        if (arg.length > 20) {
            str = JSON.stringify(arg.slice(0, 20)) + '...array items truncated';
        }
        else {
            str = JSON.stringify(arg);
        }
    }
    else {
        str = JSON.stringify(arg);
    }
    if (str.length > 1000) {
        return str.substring(0, 1000) + ' ...data truncated';
    }
    return str;
}
// Dict
export function isDict(arg) {
    if (Array.isArray(arg) || typeof arg === 'string' || arg === null || typeof arg !== 'object') {
        throw new Error();
    }
}
// List
export function isList(arg) {
    if (!Array.isArray(arg)) {
        throw new Error();
    }
}
// List
export function isLList(arg) {
    if (!Array.isArray(arg) || !Array.isArray(arg[0])) {
        throw new Error();
    }
}
// Any
export function isAny(arg) {
    if (arg === undefined) {
        throw new Error();
    }
}
// Any list
export function isAnyL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(arg[i]);
    }
}
// Null
export function isNull(arg) {
    if (arg !== null) {
        throw new Error();
    }
}
// Null list
export function isNullL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(arg[i]);
    }
}
// Boolean
export function isBool(arg) {
    if (typeof arg !== 'boolean') {
        throw new Error();
    }
}
// Boolean list
export function isBoolL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(arg[i]);
    }
}
// String
export function isStr(arg) {
    if (typeof arg !== 'string') {
        throw new Error();
    }
}
// String list
export function isStrL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(arg[i]);
    }
}
// Numbers
export function isNum(arg) {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error();
    }
}
// Number list
export function isNumL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(arg[i]);
    }
}
// Number between 0 and 1
export function isNum01(arg) {
    isNum(arg);
    if (arg < 0 || arg > 1) {
        throw new Error();
    }
}
// Number list between 0 and 1
export function isNum01L(arg) {
    isNumL(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(arg[i]);
    }
}
// Integer
export function isInt(arg) {
    if (!Number.isInteger(arg)) {
        throw new Error();
    }
}
// List Integers
export function isIntL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
// List Two strings
export function isStrStr(arg) {
    isStrL(arg);
    isLLen(arg, 2);
}
// List String and number
export function isStrNum(arg) {
    isLLen(arg, 2);
    isStr(arg[0]);
    isNum(arg[1]);
}
// List Two numbers
export function isXY(arg) {
    isNumL(arg);
    isLLen(arg, 2);
}
// List Number and Int
export function isXYInt(arg) {
    isIntL(arg);
    isLLen(arg, 2);
}
// List Colour - three numbers between 0 and 1
export function isColor(arg) {
    isNumL(arg);
    isLLen(arg, 3);
    isNum01L(arg);
    return;
}
// List Three Numbers
export function isXYZ(arg) {
    isNumL(arg);
    isLLen(arg, 3);
}
// List of Lists Three numbers
export function isXYZL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZ(arg[i]);
    }
}
export function isXYZLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZL(arg[i]);
    }
}
export function isPln(arg) {
    isXYZL(arg);
    isLLen(arg, 3);
}
export function isPlnL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isPln(arg[i]);
    }
}
export function isBBox(arg) {
    isXYZL(arg);
    isLLen(arg, 4);
}
export function isBBoxL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBBox(arg[i]);
    }
}
export function isRay(arg) {
    isXYZL(arg);
    isLLen(arg, 2);
}
export function isRayL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRay(arg[i]);
    }
}
export function isRayLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRayL(arg[i]);
    }
}
// List of specified length
export function isLLen(arg, len) {
    if (arg.length !== len) {
        throw new Error();
    }
}
/**
 *
 * @param check_fn
 */
function _getDataTypeStrFromFunc(check_fn) {
    switch (check_fn) {
        case isAny:
            return 'anything';
        case isNull:
            return 'a null value';
        case isNullL:
            return 'a list of null values';
        case isList:
            return 'a list of values';
        case isLList:
            return 'a list of lists of values';
        case isDict:
            return 'a dictionary of values';
        case isBool:
            return 'a boolean value';
        case isBoolL:
            return 'a list of booleans';
        case isStr:
            return 'a string';
        case isStrL:
            return 'a list of strings';
        case isStrStr:
            return 'a list containing two strings';
        case isStrNum:
            return 'a list containg one string and one number';
        case isNum:
            return 'a number';
        case isNumL:
            return 'a list of numbers';
        case isInt:
            return 'an integer';
        case isXY:
            return 'a list containing two numbers';
        case isXYInt:
            return 'a list containing two integers';
        case isColor:
            return 'a list containing three numbers between 0 and 1';
        case isXYZ:
            return 'a list containing three numbers';
        case isXYZL:
            return 'a list of lists conatining three numbers';
        case isXYZLL:
            return 'a nested list of lists conatining three numbers';
        case isPln:
            return 'a plane, defined by a list of three lists, each conatining three numbers';
        case isPlnL:
            return 'a list of planes, each defined by a list of three lists, each conatining three numbers';
        case isBBox:
            return 'a bounding box, defined by a list of four lists, each conatining three numbers';
        case isBBoxL:
            return 'a list of bounding boxes, each defined by a list of four lists, each conatining three numbers';
        case isRay:
            return 'a ray, defined by a list of two lists, each conatining three numbers';
        case isRayL:
            return 'a list of rays, each defined by a list of two lists, each conatining three numbers';
        case isRayLL:
            return 'a nested list of rays, each defined by a list of two lists, each conatining three numbers';
        default:
            return 'sorry... arg type not found';
    }
}
/**
 *
 * @param arg
 */
export function getDataTypeStrFromValue(arg) {
    if (Array.isArray(arg)) {
        if (arg.length === 0) {
            return 'empty list';
        }
        const types_set = new Set();
        for (const a_arg of arg) {
            types_set.add(_typeOf(a_arg));
        }
        const types_arr = Array.from(types_set.values());
        if (types_arr.length === 1) {
            return 'a list of ' + arg.length + ' ' + types_arr[0] + 's';
        }
        else {
            let str = 'a list of length ' + arg.length + ', containing ';
            for (let i = 0; i < types_arr.length; i++) {
                if (i < types_arr.length - 2) {
                    str += types_arr[i] + 's, ';
                }
                else if (i < types_arr.length - 1) {
                    str += types_arr[i] + 's and ';
                }
                else {
                    str += types_arr[i] + 's';
                }
            }
            return str;
        }
    }
    return _typeOf(arg);
}
function _typeOf(arg) {
    if (arg === undefined) {
        return 'undefined';
    }
    if (arg === null) {
        return 'null';
    }
    if (Array.isArray(arg)) {
        return 'list';
    }
    if (typeof arg === 'object') {
        return 'dict';
    }
    return typeof arg;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX3R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL19jaGVja190eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3SEFBd0g7QUFDeEgsb0JBQW9CO0FBQ3BCLHdIQUF3SDtBQUl4SDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFDLE9BQWUsRUFBRSxRQUFnQixFQUFFLEdBQVEsRUFBRSxTQUFxQjtJQUV4RixJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksR0FBRyxDQUFDO0lBQ1IsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsZUFBZSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0tBQ3pFO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsSUFBSTtZQUNBLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztZQUNuQyxTQUFTO1NBQ1o7UUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osTUFBTSxDQUFDLFNBQVM7S0FDbkI7SUFDRCxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRSxnRUFBZ0U7UUFDbEYsa0ZBQWtGO1FBQ2xGLCtDQUErQztRQUMvQyxJQUFJLE9BQU8sR0FDUCxxQ0FBcUMsR0FBRyxPQUFPLEdBQUcsd0JBQXdCO1lBQzFFLE1BQU07WUFDTixzQkFBc0IsR0FBRyxPQUFPLEdBQUcsU0FBUztZQUM1Qyx1QkFBdUIsR0FBRyxRQUFRLEdBQUcsU0FBUztZQUM5QyxzQkFBc0IsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUTtZQUN0RCxnQ0FBZ0MsR0FBRyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRO1lBQzFFLE9BQU87WUFDUCxPQUFPLEdBQUcsUUFBUSxHQUFHLCtDQUErQztZQUNwRSxNQUFNLENBQUM7UUFDWCxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUM5QixPQUFPLEdBQUcsT0FBTyxHQUFHLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7U0FDN0U7UUFDRCxPQUFPLEdBQUcsT0FBTztZQUNiLE9BQU87WUFDUCw2Q0FBNkMsR0FBRyxRQUFRLEdBQUcsNERBQTRELENBQUM7UUFDNUgsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM1QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUNELFNBQVMsYUFBYSxDQUFDLEdBQVE7SUFDM0IsSUFBSSxHQUFXLENBQUM7SUFDaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDakIsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRywwQkFBMEIsQ0FBQztTQUN2RTthQUFNO1lBQ0gsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7S0FDSjtTQUFNO1FBQ0gsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDN0I7SUFDRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFO1FBQ25CLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7S0FDeEQ7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFHRCxPQUFPO0FBQ1AsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFRO0lBQzNCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDMUYsTUFBTSxJQUFJLEtBQUssRUFBRyxDQUFDO0tBQ3RCO0FBQ0wsQ0FBQztBQUNELE9BQU87QUFDUCxNQUFNLFVBQVUsTUFBTSxDQUFDLEdBQVE7SUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDckIsTUFBTSxJQUFJLEtBQUssRUFBRyxDQUFDO0tBQ3RCO0FBQ0wsQ0FBQztBQUNELE9BQU87QUFDUCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVE7SUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9DLE1BQU0sSUFBSSxLQUFLLEVBQUcsQ0FBQztLQUN0QjtBQUNMLENBQUM7QUFDRCxNQUFNO0FBQ04sTUFBTSxVQUFVLEtBQUssQ0FBQyxHQUFRO0lBQzFCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsV0FBVztBQUNYLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBUTtJQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7QUFDTCxDQUFDO0FBQ0QsT0FBTztBQUNQLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBUTtJQUMzQixJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDZCxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsWUFBWTtBQUNaLE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBUTtJQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDTCxDQUFDO0FBQ0QsVUFBVTtBQUNWLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBWTtJQUMvQixJQUFJLE9BQU8sR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsZUFBZTtBQUNmLE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBYztJQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDTCxDQUFDO0FBQ0QsU0FBUztBQUNULE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBVztJQUM3QixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsY0FBYztBQUNkLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBYTtJQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7QUFDTCxDQUFDO0FBQ0QsVUFBVTtBQUNWLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBVztJQUM3QixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLG1DQUFtQztRQUNqRCxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsY0FBYztBQUNkLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBYTtJQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7QUFDTCxDQUFDO0FBQ0QseUJBQXlCO0FBQ3pCLE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBUTtJQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWCxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsOEJBQThCO0FBQzlCLE1BQU0sVUFBVSxRQUFRLENBQUMsR0FBUTtJQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7QUFDTCxDQUFDO0FBQ0QsVUFBVTtBQUNWLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBUTtJQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBQ0QsZ0JBQWdCO0FBQ2hCLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBVTtJQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7QUFDTCxDQUFDO0FBQ0QsbUJBQW1CO0FBQ25CLE1BQU0sVUFBVSxRQUFRLENBQUMsR0FBcUI7SUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBQ0QseUJBQXlCO0FBQ3pCLE1BQU0sVUFBVSxRQUFRLENBQUMsR0FBcUI7SUFDMUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNkLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBQ0QsbUJBQW1CO0FBQ25CLE1BQU0sVUFBVSxJQUFJLENBQUMsR0FBUTtJQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCxzQkFBc0I7QUFDdEIsTUFBTSxVQUFVLE9BQU8sQ0FBQyxHQUFRO0lBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUNELDhDQUE4QztBQUM5QyxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVc7SUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNmLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNkLE9BQU87QUFDWCxDQUFDO0FBQ0QscUJBQXFCO0FBQ3JCLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBUztJQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCw4QkFBOEI7QUFDOUIsTUFBTSxVQUFVLE1BQU0sQ0FBQyxHQUFXO0lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNMLENBQUM7QUFDRCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQWE7SUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCO0FBQ0csQ0FBQztBQUNMLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBVztJQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCxNQUFNLFVBQVUsTUFBTSxDQUFDLEdBQWE7SUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0csQ0FBQztBQUNMLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBVTtJQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVk7SUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0csQ0FBQztBQUNMLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBUztJQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCxNQUFNLFVBQVUsTUFBTSxDQUFDLEdBQVc7SUFDOUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pCO0FBQ0wsQ0FBQztBQUNELE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBYTtJQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDTCxDQUFDO0FBRUQsMkJBQTJCO0FBQzNCLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBVSxFQUFFLEdBQVc7SUFDMUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckI7QUFDTCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FBQyxRQUFhO0lBQzFDLFFBQVEsUUFBUSxFQUFFO1FBQ2QsS0FBSyxLQUFLO1lBQ04sT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxNQUFNO1lBQ1AsT0FBTyxjQUFjLENBQUM7UUFDMUIsS0FBSyxPQUFPO1lBQ1IsT0FBTyx1QkFBdUIsQ0FBQztRQUNuQyxLQUFLLE1BQU07WUFDUCxPQUFPLGtCQUFrQixDQUFDO1FBQzlCLEtBQUssT0FBTztZQUNSLE9BQU8sMkJBQTJCLENBQUM7UUFDdkMsS0FBSyxNQUFNO1lBQ1AsT0FBTyx3QkFBd0IsQ0FBQztRQUNwQyxLQUFLLE1BQU07WUFDUCxPQUFPLGlCQUFpQixDQUFDO1FBQzdCLEtBQUssT0FBTztZQUNSLE9BQU8sb0JBQW9CLENBQUM7UUFDaEMsS0FBSyxLQUFLO1lBQ04sT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxNQUFNO1lBQ1AsT0FBTyxtQkFBbUIsQ0FBQztRQUMvQixLQUFLLFFBQVE7WUFDVCxPQUFPLCtCQUErQixDQUFDO1FBQzNDLEtBQUssUUFBUTtZQUNULE9BQU8sMkNBQTJDLENBQUM7UUFDdkQsS0FBSyxLQUFLO1lBQ04sT0FBTyxVQUFVLENBQUM7UUFDdEIsS0FBSyxNQUFNO1lBQ1AsT0FBTyxtQkFBbUIsQ0FBQztRQUMvQixLQUFLLEtBQUs7WUFDTixPQUFPLFlBQVksQ0FBQztRQUN4QixLQUFLLElBQUk7WUFDTCxPQUFPLCtCQUErQixDQUFDO1FBQzNDLEtBQUssT0FBTztZQUNSLE9BQU8sZ0NBQWdDLENBQUM7UUFDNUMsS0FBSyxPQUFPO1lBQ1IsT0FBTyxpREFBaUQsQ0FBQztRQUM3RCxLQUFLLEtBQUs7WUFDTixPQUFPLGlDQUFpQyxDQUFDO1FBQzdDLEtBQUssTUFBTTtZQUNQLE9BQU8sMENBQTBDLENBQUM7UUFDdEQsS0FBSyxPQUFPO1lBQ1IsT0FBTyxpREFBaUQsQ0FBQztRQUM3RCxLQUFLLEtBQUs7WUFDTixPQUFPLDBFQUEwRSxDQUFDO1FBQ3RGLEtBQUssTUFBTTtZQUNQLE9BQU8sd0ZBQXdGLENBQUM7UUFDcEcsS0FBSyxNQUFNO1lBQ1AsT0FBTyxnRkFBZ0YsQ0FBQztRQUM1RixLQUFLLE9BQU87WUFDUixPQUFPLCtGQUErRixDQUFDO1FBQzNHLEtBQUssS0FBSztZQUNOLE9BQU8sc0VBQXNFLENBQUM7UUFDbEYsS0FBSyxNQUFNO1lBQ1AsT0FBTyxvRkFBb0YsQ0FBQztRQUNoRyxLQUFLLE9BQU87WUFDUixPQUFPLDJGQUEyRixDQUFDO1FBQ3ZHO1lBQ0ksT0FBTyw2QkFBNkIsQ0FBQztLQUM1QztBQUNMLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsR0FBUTtJQUM1QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixPQUFPLFlBQVksQ0FBQztTQUN2QjtRQUNELE1BQU0sU0FBUyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3pDLEtBQUssTUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ3JCLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDakM7UUFDRCxNQUFNLFNBQVMsR0FBYSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzNELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxZQUFZLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUMvRDthQUFNO1lBQ0gsSUFBSSxHQUFHLEdBQUcsbUJBQW1CLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7WUFDN0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDL0I7cUJBQU0sSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2pDLEdBQUcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO2lCQUNsQztxQkFBTTtvQkFDSCxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztpQkFDN0I7YUFDSjtZQUNELE9BQU8sR0FBRyxDQUFDO1NBQ2Q7S0FDSjtJQUNELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFDRCxTQUFTLE9BQU8sQ0FBQyxHQUFRO0lBQ3JCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sV0FBVyxDQUFDO0tBQUU7SUFDOUMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQUUsT0FBTyxNQUFNLENBQUM7S0FBRTtJQUNwQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFBRSxPQUFPLE1BQU0sQ0FBQztLQUFFO0lBQzFDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQUUsT0FBTyxNQUFNLENBQUM7S0FBRTtJQUMvQyxPQUFPLE9BQU8sR0FBRyxDQUFDO0FBQ3RCLENBQUMifQ==