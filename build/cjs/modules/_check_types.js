"use strict";
// =====================================================================================================================
// util - check type
// =====================================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTypeStrFromValue = exports.isLLen = exports.isRayLL = exports.isRayL = exports.isRay = exports.isBBoxL = exports.isBBox = exports.isPlnLL = exports.isPlnL = exports.isPln = exports.isXYZLL = exports.isXYZL = exports.isXYZ = exports.isColor = exports.isXYInt = exports.isXYL = exports.isXY = exports.isStrNum = exports.isStrStr = exports.isIntL = exports.isInt = exports.isNum01L = exports.isNum01 = exports.isNumL = exports.isNum = exports.isStrL = exports.isStr = exports.isBoolL = exports.isBool = exports.isNullL = exports.isNull = exports.isAnyL = exports.isAny = exports.isLList = exports.isList = exports.isDict = exports.checkArgs = void 0;
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
            ' Make sure that the argument passed to the "' + arg_name + '" parameter matches one of the above permitted data types.';
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
// List of lists
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
// List of Lists Three numbers
function isXYL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isXY(arg[i]);
    }
}
exports.isXYL = isXYL;
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
function isPlnLL(arg) {
    isList(arg);
    for (let i = 0; i < arg.length; i++) {
        isPlnL(arg[i]);
    }
}
exports.isPlnLL = isPlnLL;
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
            return 'a list containing one string and one number';
        case isNum:
            return 'a number';
        case isNumL:
            return 'a list of numbers';
        case isNum01:
            return 'a number between 0 and 1';
        case isNum01L:
            return 'a list of numbers between 0 and 1';
        case isInt:
            return 'an integer';
        case isIntL:
            return 'a list of integers';
        case isXY:
            return 'a list containing two numbers';
        case isXYInt:
            return 'a list containing two integers';
        case isColor:
            return 'a list containing three numbers between 0 and 1';
        case isXYZ:
            return 'a list containing three numbers';
        case isXYZL:
            return 'a list of lists containing three numbers';
        case isXYZLL:
            return 'a nested list of lists containing three numbers';
        case isPln:
            return 'a plane, defined by a list of three lists, each containing three numbers';
        case isPlnL:
            return 'a list of planes, each defined by a list of three lists, each containing three numbers';
        case isPlnLL:
            return 'a nested list of planes, each defined by a list of three lists, each containing three numbers';
        case isBBox:
            return 'a bounding box, defined by a list of four lists, each containing three numbers';
        case isBBoxL:
            return 'a list of bounding boxes, each defined by a list of four lists, each containing three numbers';
        case isRay:
            return 'a ray, defined by a list of two lists, each containing three numbers';
        case isRayL:
            return 'a list of rays, each defined by a list of two lists, each containing three numbers';
        case isRayLL:
            return 'a nested list of rays, each defined by a list of two lists, each containing three numbers';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX3R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvX2NoZWNrX3R5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx3SEFBd0g7QUFDeEgsb0JBQW9CO0FBQ3BCLHdIQUF3SDs7O0FBSXhIOzs7Ozs7R0FNRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxPQUFlLEVBQUUsUUFBZ0IsRUFBRSxHQUFRLEVBQUUsU0FBcUI7SUFFeEYsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFJLEdBQUcsQ0FBQztJQUNSLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsUUFBUSxHQUFHLGVBQWUsR0FBRyxNQUFNLENBQUMsQ0FBQztLQUN6RTtJQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLElBQUk7WUFDQSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDbkMsU0FBUztTQUNaO1FBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLE1BQU0sQ0FBQyxTQUFTO0tBQ25CO0lBQ0QsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUUsZ0VBQWdFO1FBQ2xGLGtGQUFrRjtRQUNsRiwrQ0FBK0M7UUFDL0MsSUFBSSxPQUFPLEdBQ1AscUNBQXFDLEdBQUcsT0FBTyxHQUFHLHdCQUF3QjtZQUMxRSxNQUFNO1lBQ04sc0JBQXNCLEdBQUcsT0FBTyxHQUFHLFNB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