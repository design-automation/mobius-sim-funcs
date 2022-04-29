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
exports.Add = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Adds an item to a list.
 *
 * @param list List to add the item to.
 * @param item Item to add.
 * @param method Enum, select the method.
 * @returns void
 * @example append = list.Add([1,2,3], 4, 'at_end')
 * @example_info Expected value of list is [1,2,3,4].
 * @example append = list.Add([1,2,3], [4, 5], 'at_end')
 * @example_info Expected value of list is [1,2,3,[4,5]].
 * @example append = list.Add([1,2,3], [4,5], 'extend_end')
 * @example_info Expected value of list is [1,2,3,4,5].
 * @example append = list.Add(["a", "c", "d"], "b", 'alpha_descending')
 * @example_info Expected value of list is ["a", "b", "c", "d"].
 */
function Add(list, item, method) {
    // --- Error Check ---
    const fn_name = 'list.Add';
    chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    chk.checkArgs(fn_name, 'value', item, [chk.isAny]);
    // --- Error Check ---
    let str_value;
    switch (method) {
        case _enum_1._EAddMethod.TO_START:
            list.unshift(item);
            break;
        case _enum_1._EAddMethod.TO_END:
            list.push(item);
            break;
        case _enum_1._EAddMethod.EXTEND_START:
            if (!Array.isArray(item)) {
                item = [item];
            }
            for (let i = item.length - 1; i >= 0; i--) {
                list.unshift(item[i]);
            }
            break;
        case _enum_1._EAddMethod.EXTEND_END:
            if (!Array.isArray(item)) {
                item = [item];
            }
            for (let i = 0; i < item.length; i++) {
                list.push(item[i]);
            }
            break;
        case _enum_1._EAddMethod.SORTED_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value < list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _enum_1._EAddMethod.SORTED_REV_ALPHA:
            str_value = item + '';
            for (let i = 0; i < list.length + 1; i++) {
                if (str_value > list[i] + '' || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _enum_1._EAddMethod.SORTED_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _enum_1._EAddMethod.SORTED_REV_NUM:
            for (let i = 0; i < list.length + 1; i++) {
                if (item - list[i] < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _enum_1._EAddMethod.SORTED_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) > 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        case _enum_1._EAddMethod.SORTED_REV_ID:
            for (let i = 0; i < list.length + 1; i++) {
                if (_compareID(item, list[i]) < 0 || i === list.length) {
                    list.splice(i, 0, item);
                    break;
                }
            }
            break;
        default:
            break;
    }
}
exports.Add = Add;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2xpc3QvQWRkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQXNFO0FBRXRFLDJEQUE2QztBQUM3QyxtQ0FBc0M7QUFLdEMsbUdBQW1HO0FBQ25HOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILFNBQWdCLEdBQUcsQ0FBQyxJQUFXLEVBQUUsSUFBZSxFQUFFLE1BQW1CO0lBQ2pFLHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7SUFDM0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25ELEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuRCxzQkFBc0I7SUFDdEIsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLFFBQVEsTUFBTSxFQUFFO1FBQ1osS0FBSyxtQkFBVyxDQUFDLFFBQVE7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixNQUFNO1FBQ1YsS0FBSyxtQkFBVyxDQUFDLE1BQU07WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixNQUFNO1FBQ1YsS0FBSyxtQkFBVyxDQUFDLFlBQVk7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFBRTtZQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFB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