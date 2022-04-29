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
exports.Replace = void 0;
const chk = __importStar(require("../../../_check_types"));
const _enum_1 = require("./_enum");
// ================================================================================================
/**
 * Replaces items in a list.
 * \n
 * If method is set to 'index', then old_item should be the index of the item to be replaced. Negative indexes are allowed.
 * If method is not set to 'index', then old_item should be the value.
 *
 * @param list The list in which to replace items
 * @param old_item The old item to replace.
 * @param new_item The new item.
 * @param method Enum, select the method for replacing items in the list.
 * @returns void
 */
function Replace(list, old_item, new_item, method) {
    // --- Error Check ---
    const fn_name = 'list.Replace';
    chk.checkArgs(fn_name, 'list', list, [chk.isList]);
    chk.checkArgs(fn_name, 'item', old_item, [chk.isAny]);
    chk.checkArgs(fn_name, 'new_value', new_item, [chk.isAny]);
    // --- Error Check ---
    let index;
    switch (method) {
        case _enum_1._EReplaceMethod.REPLACE_INDEX:
            index = old_item;
            if (!isNaN(index)) {
                if (index < 0) {
                    index = list.length + index;
                }
                list[index] = new_item;
            }
            break;
        case _enum_1._EReplaceMethod.REPLACE_FIRST_VALUE:
            index = list.indexOf(old_item);
            if (index !== -1) {
                list[index] = new_item;
            }
            break;
        case _enum_1._EReplaceMethod.REPLACE_LAST_VALUE:
            index = list.lastIndexOf(old_item);
            if (index !== -1) {
                list[index] = new_item;
            }
            break;
        case _enum_1._EReplaceMethod.REPLACE_ALL_VALUES:
            for (index = 0; index < list.length; index++) {
                if (list[index] === old_item) {
                    list[index] = new_item;
                }
            }
            break;
        default:
            throw new Error('list.Replace: Replace method not recognised.');
    }
}
exports.Replace = Replace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9saXN0L1JlcGxhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBNkM7QUFDN0MsbUNBQTBDO0FBSzFDLG1HQUFtRztBQUNuRzs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxJQUFXLEVBQUUsUUFBYSxFQUFFLFFBQWEsRUFBRSxNQUF1QjtJQUN0RixzQkFBc0I7SUFDdEIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNuRCxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNELHNCQUFzQjtJQUN0QixJQUFJLEtBQWEsQ0FBQztJQUNsQixRQUFRLE1BQU0sRUFBRTtRQUNaLEtBQUssdUJBQWUsQ0FBQyxhQUFhO1lBQzlCLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDakIsSUFBSSxDQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRztnQkFDakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO29CQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztpQkFBRTtnQkFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQzthQUMxQjtZQUNELE1BQU07UUFDVixLQUFLLHVCQUFlLENBQUMsbUJBQW1CO1lBQ3BDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7YUFBRTtZQUM3QyxNQUFNO1FBQ1YsS0FBSyx1QkFBZSxDQUFDLGtCQUFrQjtZQUNuQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQUU7WUFDN0MsTUFBTTtRQUNWLEtBQUssdUJBQWUsQ0FBQyxrQkFBa0I7WUFDbkMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7aUJBQzFCO2FBQ0o7WUFDRCxNQUFNO1FBQ1Y7WUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7S0FDdkU7QUFDTCxDQUFDO0FBbENELDBCQWtDQyJ9