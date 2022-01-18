"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Async_Param_Write = exports.Write = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _enum_1 = require("./_enum");
const Export_1 = require("./Export");
// ================================================================================================
/**
 * Write data to the hard disk or to the local storage.
 *
 * @param data The data to be saved (can be the url to the file).
 * @param file_name The name to be saved in the file system (file extension should be included).
 * @param data_target Enum, where the data is to be exported to.
 * @returns whether the data is successfully saved.
 */
function Write(__model__, data, file_name, data_target) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data_target === _enum_1._EIODataTarget.DEFAULT) {
                return (0, mobius_sim_1.download)(data, file_name);
            }
            return (0, Export_1._saveResource)(data, file_name);
        }
        catch (ex) {
            return false;
        }
    });
}
exports.Write = Write;
function _Async_Param_Write(__model__, data, file_name, data_target) {
    return null;
}
exports._Async_Param_Write = _Async_Param_Write;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vV3JpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsOERBQWtFO0FBRWxFLG1DQUF5QztBQUN6QyxxQ0FBeUM7QUFLekMsbUdBQW1HO0FBQ25HOzs7Ozs7O0dBT0c7QUFDSCxTQUFzQixLQUFLLENBQUMsU0FBa0IsRUFBRSxJQUFZLEVBQUUsU0FBaUIsRUFBRSxXQUEyQjs7UUFDeEcsSUFBSTtZQUNBLElBQUksV0FBVyxLQUFLLHNCQUFjLENBQUMsT0FBTyxFQUFFO2dCQUN4QyxPQUFPLElBQUEscUJBQVEsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDcEM7WUFDRCxPQUFPLElBQUEsc0JBQWEsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekM7UUFBQyxPQUFPLEVBQUUsRUFBRTtZQUNULE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0lBQ0wsQ0FBQztDQUFBO0FBVEQsc0JBU0M7QUFDRCxTQUFnQixrQkFBa0IsQ0FBQyxTQUFrQixFQUFFLElBQVksRUFBRSxTQUFpQixFQUFFLFdBQTJCO0lBQy9HLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFGRCxnREFFQyJ9