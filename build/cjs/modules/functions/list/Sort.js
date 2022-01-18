"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.Sort = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Sorts an list, based on the values of the items in the list.
 * \n
 * For alphabetical sort, values are sorted character by character,
 * numbers before upper case alphabets, upper case alphabets before lower case alphabets.
 *
 * @param list List to sort.
 * @param method Enum; specifies the sort method to use.
 * @returns void
 * @example list.Sort(list, 'alpha')
 * @example_info where list = ["1","2","10","Orange","apple"]
 * Expected value of list is ["1","10","2","Orange","apple"].
 * @example list.Sort(list, 'numeric')
 * @example_info where list = [56,6,48]
 * Expected value of list is [6,48,56].
 */
function Sort(list, method) {
    // --- Error Check ---
    chk.checkArgs('list.Sort', 'list', list, [chk.isList]);
    // --- Error Check ---
    _sort(list, method);
}
exports.Sort = Sort;
function _compareID(id1, id2) {
    const [ent_type1, index1] = (0, mobius_sim_1.idsBreak)(id1);
    const [ent_type2, index2] = (0, mobius_sim_1.idsBreak)(id2);
    if (ent_type1 !== ent_type2) {
        return ent_type1 - ent_type2;
    }
    if (index1 !== index2) {
        return index1 - index2;
    }
    return 0;
}
function _compareNumList(l1, l2, depth) {
    if (depth === 1) {
        return l1[0] - l2[0];
    }
    if (depth === 2) {
        return l1[0][0] - l2[0][0];
    }
    let val1 = l1;
    let val2 = l2;
    for (let i = 0; i < depth; i++) {
        val1 = val1[0];
        val2 = val2[0];
    }
    return val1 - val2;
}
function _sort(list, method) {
    switch (method) {
        case _enum_1._ESortMethod.REV:
            list.reverse();
            break;
        case _enum_1._ESortMethod.ALPHA:
            list.sort().reverse();
            break;
        case _enum_1._ESortMethod.REV_ALPHA:
            list.sort();
            break;
        case _enum_1._ESortMethod.NUM:
            if (Array.isArray(list[0])) {
                const depth = (0, mobius_sim_1.getArrDepth)(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth)).reverse();
            }
            else {
                list.sort((a, b) => b - a);
            }
            break;
        case _enum_1._ESortMethod.REV_NUM:
            if (Array.isArray(list[0])) {
                const depth = (0, mobius_sim_1.getArrDepth)(list[0]);
                list.sort((a, b) => _compareNumList(a, b, depth));
            }
            else {
                list.sort((a, b) => a - b);
            }
            break;
        case _enum_1._ESortMethod.ID:
            list.sort(_compareID).reverse();
            break;
        case _enum_1._ESortMethod.REV_ID:
            list.sort(_compareID);
            break;
        case _enum_1._ESortMethod.SHIFT:
            const last = list.pop();
            list.unshift(last);
            break;
        case _enum_1._ESortMethod.REV_SHIFT:
            const first = list.shift();
            list.push(first);
            break;
        case _enum_1._ESortMethod.RANDOM:
            list.sort(() => .5 - Math.random());
            break;
        default:
            throw new Error('list.Sort: Sort method not recognised.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9saXN0L1NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhEQUFtRjtBQUVuRiwyREFBNkM7QUFDN0MsbUNBQXVDO0FBS3ZDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxTQUFnQixJQUFJLENBQUMsSUFBVyxFQUFFLE1BQW9CO0lBQ2xELHNCQUFzQjtJQUN0QixHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkQsc0JBQXNCO0lBQ3RCLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUxELG9CQUtDO0FBQ0QsU0FBUyxVQUFVLENBQUMsR0FBVyxFQUFFLEdBQVc7SUFDeEMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBZ0IsSUFBQSxxQkFBUSxFQUFDLEdBQUcsQ0FBZ0IsQ0FBQztJQUN0RSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFnQixJQUFBLHFCQUFRLEVBQUMsR0FBRyxDQUFnQixDQUFDO0lBQ3RFLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUFFLE9BQU8sU0FBUyxHQUFJLFNBQVMsQ0FBQztLQUFFO0lBQy9ELElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUFFLE9BQU8sTUFBTSxHQUFJLE1BQU0sQ0FBQztLQUFFO0lBQ25ELE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUNELFNBQVMsZUFBZSxDQUFDLEVBQVMsRUFBRSxFQUFTLEVBQUUsS0FBYTtJQUN4RCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMs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