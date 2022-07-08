"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAttribValue = exports.splitAttribNameIdxKey = exports.checkAttribNameIdxKey = exports.checkAttribIdxKey = exports.checkAttribName = void 0;
const chk = __importStar(require("./_check_types"));
// =========================================================================================================================================
// Attribute Checks
// =========================================================================================================================================
function checkAttribName(fn_name, attrib_name) {
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
exports.checkAttribName = checkAttribName;
function checkAttribIdxKey(fn_name, idx_or_key) {
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
exports.checkAttribIdxKey = checkAttribIdxKey;
function checkAttribNameIdxKey(fn_name, attrib) {
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
exports.checkAttribNameIdxKey = checkAttribNameIdxKey;
function splitAttribNameIdxKey(fn_name, attrib) {
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
exports.splitAttribNameIdxKey = splitAttribNameIdxKey;
function checkAttribValue(fn_name, attrib_value) {
    // if it is undefined, then we are deleting the attribute value
    if (attrib_value === undefined) {
        return;
    }
    // check the actual value
    chk.checkArgs(fn_name, 'attrib_value', attrib_value, [chk.isNull, chk.isStr, chk.isNum, chk.isBool, chk.isList, chk.isDict]);
}
exports.checkAttribValue = checkAttribValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NoZWNrX2F0dHJpYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9fY2hlY2tfYXR0cmlicy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFzQztBQUV0Qyw0SUFBNEk7QUFDNUksbUJBQW1CO0FBQ25CLDRJQUE0STtBQUM1SSxTQUFnQixlQUFlLENBQUMsT0FBZSxFQUFFLFdBQW1CO0lBQ2hFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7SUFDOUMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUUsT0FBTyxHQUFHLElBQUksR0FBRywwQkFBMEIsQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkJBQTJCLENBQUMsQ0FBQztLQUNsRTtJQUNELElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNqQyxNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsNENBQTRDLENBQUMsQ0FBQztLQUNuRjtJQUNELElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkNBQTJDLENBQUMsQ0FBQztLQUNsRjtJQUNELHVCQUF1QjtJQUN2QixJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEdBQUcseUJBQXlCLENBQUMsQ0FBQztLQUN4RDtBQUNMLENBQUM7QUFsQkQs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