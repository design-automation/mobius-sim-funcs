"use strict";
// =====================================================================================================================
// util - check type
// =====================================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTypeStrFromValue = exports.isLLen = exports.isRayLL = exports.isRayL = exports.isRay = exports.isBBoxL = exports.isBBox = exports.isPlnL = exports.isPln = exports.isXYZLL = exports.isXYZL = exports.isXYZ = exports.isColor = exports.isXYInt = exports.isXY = exports.isStrNum = exports.isStrStr = exports.isIntL = exports.isInt = exports.isNum01L = exports.isNum01 = exports.isNumL = exports.isNum = exports.isStrL = exports.isStr = exports.isBoolL = exports.isBool = exports.isNullL = exports.isNull = exports.isAnyL = exports.isAny = exports.isLList = exports.isList = exports.isDict = exports.checkArgs = void 0;
/**
 *
 * @param fn_name
 * @param arg_name
 * @param arg
 * @param check_fns
 */
function checkArgs(fn_name, arg_name, arg, check_fns) {
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
exports.checkArgs = checkArgs;
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
function isDict(arg) {
    if (Array.isArray(arg) || typeof arg === 'string' || arg === null || typeof arg !== 'object') {
        throw new Error();
    }
}
exports.isDict = isDict;
// List
function isList(arg) {
    if (!Array.isArray(arg)) {
        throw new Error();
    }
}
exports.isList = isList;
// List
function isLList(arg) {
    if (!Array.isArray(arg) || !Array.isArray(arg[0])) {
        throw new Error();
    }
}
exports.isLList = isLList;
// Any
function isAny(arg) {
    if (arg === undefined) {
        throw new Error();
    }
}
exports.isAny = isAny;
// Any list
function isAnyL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isAny(arg[i]);
    }
}
exports.isAnyL = isAnyL;
// Null
function isNull(arg) {
    if (arg !== null) {
        throw new Error();
    }
}
exports.isNull = isNull;
// Null list
function isNullL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNull(arg[i]);
    }
}
exports.isNullL = isNullL;
// Boolean
function isBool(arg) {
    if (typeof arg !== 'boolean') {
        throw new Error();
    }
}
exports.isBool = isBool;
// Boolean list
function isBoolL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBool(arg[i]);
    }
}
exports.isBoolL = isBoolL;
// String
function isStr(arg) {
    if (typeof arg !== 'string') {
        throw new Error();
    }
}
exports.isStr = isStr;
// String list
function isStrL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isStr(arg[i]);
    }
}
exports.isStrL = isStrL;
// Numbers
function isNum(arg) {
    if (isNaN(arg)) { // } || isNaN(parseInt(arg, 10))) {
        throw new Error();
    }
}
exports.isNum = isNum;
// Number list
function isNumL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum(arg[i]);
    }
}
exports.isNumL = isNumL;
// Number between 0 and 1
function isNum01(arg) {
    isNum(arg);
    if (arg < 0 || arg > 1) {
        throw new Error();
    }
}
exports.isNum01 = isNum01;
// Number list between 0 and 1
function isNum01L(arg) {
    isNumL(arg);
    for (let i = 0; i < arg.length; i++) {
        isNum01(arg[i]);
    }
}
exports.isNum01L = isNum01L;
// Integer
function isInt(arg) {
    if (!Number.isInteger(arg)) {
        throw new Error();
    }
}
exports.isInt = isInt;
// List Integers
function isIntL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isInt(arg[i]);
    }
}
exports.isIntL = isIntL;
// List Two strings
function isStrStr(arg) {
    isStrL(arg);
    isLLen(arg, 2);
}
exports.isStrStr = isStrStr;
// List String and number
function isStrNum(arg) {
    isLLen(arg, 2);
    isStr(arg[0]);
    isNum(arg[1]);
}
exports.isStrNum = isStrNum;
// List Two numbers
function isXY(arg) {
    isNumL(arg);
    isLLen(arg, 2);
}
exports.isXY = isXY;
// List Number and Int
function isXYInt(arg) {
    isIntL(arg);
    isLLen(arg, 2);
}
exports.isXYInt = isXYInt;
// List Colour - three numbers between 0 and 1
function isColor(arg) {
    isNumL(arg);
    isLLen(arg, 3);
    isNum01L(arg);
    return;
}
exports.isColor = isColor;
// List Three Numbers
function isXYZ(arg) {
    isNumL(arg);
    isLLen(arg, 3);
}
exports.isXYZ = isXYZ;
// List of Lists Three numbers
function isXYZL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZ(arg[i]);
    }
}
exports.isXYZL = isXYZL;
function isXYZLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXYZL(arg[i]);
    }
}
exports.isXYZLL = isXYZLL;
function isPln(arg) {
    isXYZL(arg);
    isLLen(arg, 3);
}
exports.isPln = isPln;
function isPlnL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isPln(arg[i]);
    }
}
exports.isPlnL = isPlnL;
function isBBox(arg) {
    isXYZL(arg);
    isLLen(arg, 4);
}
exports.isBBox = isBBox;
function isBBoxL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isBBox(arg[i]);
    }
}
exports.isBBoxL = isBBoxL;
function isRay(arg) {
    isXYZL(arg);
    isLLen(arg, 2);
}
exports.isRay = isRay;
function isRayL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRay(arg[i]);
    }
}
exports.isRayL = isRayL;
function isRayLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isRayL(arg[i]);
    }
}
exports.isRayLL = isRayLL;
// List of specified length
function isLLen(arg, len) {
    if (arg.length !== len) {
        throw new Error();
    }
}
exports.isLLen = isLLen;
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
function getDataTypeStrFromValue(arg) {
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
exports.getDataTypeStrFromValue = getDataTypeStrFromValue;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX3R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL19jaGVja190eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0hBQXdIO0FBQ3hILG9CQUFvQjtBQUNwQix3SEFBd0g7OztBQUl4SDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixTQUFTLENBQUMsT0FBZSxFQUFFLFFBQWdCLEVBQUUsR0FBUSxFQUFFLFNBQXFCO0lBRXhGLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxHQUFHLENBQUM7SUFDUixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxlQUFlLEdBQUcsTUFBTSxDQUFDLENBQUM7S0FDekU7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFJO1lBQ0EsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLFNBQVM7U0FDWjtRQUNELElBQUksR0FBRyxJQUFJLENBQUM7UUFDWixNQUFNLENBQUMsU0FBUztLQUNuQjtJQUNELElBQUksSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFLGdFQUFnRTtRQUNsRixrRkFBa0Y7UUFDbEYsK0NBQStDO1FBQy9DLElBQUksT0FBTyxHQUNQLHFDQUFxQyxHQUFHLE9BQU8sR0FBRyx3QkFBd0I7WUFDMUUsTUFBTTtZQUNOLHNCQUFzQixHQUFHLE9BQU8sR0FBRyxTQUFTO1lBQzVDLHVC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