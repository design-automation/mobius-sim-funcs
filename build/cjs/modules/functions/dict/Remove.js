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
exports.Remove = void 0;
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Removes keys from a dict. If the key does not exist, no action is taken and no error is thrown.
 * \n
 * @param dict The dict in which to remove keys
 * @param keys The key or list of keys to remove.
 * @returns void
 */
function Remove(dict, keys) {
    // --- Error Check ---
    const fn_name = 'dict.Remove';
    chk.checkArgs(fn_name, 'key', keys, [chk.isStr, chk.isStrL]);
    // --- Error Check ---
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    keys = keys;
    for (const key of keys) {
        if (typeof key !== 'string') {
            throw new Error('dict.Remove: Keys must be strings; \
                the following key is not valid:"' + key + '".');
        }
        if (key in dict) {
            delete dict[key];
        }
    }
}
exports.Remove = Remove;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3ZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2RpY3QvUmVtb3ZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQTZDO0FBRzdDLG1HQUFtRztBQUNuRzs7Ozs7O0dBTUc7QUFDSCxTQUFnQixNQUFNLENBQUMsSUFBWSxFQUFFLElBQXFCO0lBQ3RELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUM7SUFDOUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0Qsc0JBQXNCO0lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFhLENBQUM7S0FBRTtJQUN4RCxJQUFJLEdBQUcsSUFBZ0IsQ0FBQztJQUN4QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUNwQixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDO2lEQUNxQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN2RDtRQUNELElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO0tBQ0o7QUFDTCxDQUFDO0FBaEJELHdCQWdCQyJ9