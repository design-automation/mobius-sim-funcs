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
exports._Async_Param_Read = exports.Read = void 0;
const _getFile_1 = require("./_getFile");
// ================================================================================================
/**
 * Read data from a Url or from local storage.
 *
 * @param data The data to be read (from URL or from Local Storage).
 * @returns the data.
 */
function Read(__model__, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, _getFile_1._getFile)(data);
    });
}
exports.Read = Read;
function _Async_Param_Read(__model__, data) {
    return null;
}
exports._Async_Param_Read = _Async_Param_Read;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9pby9SZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLHlDQUFzQztBQUl0QyxtR0FBbUc7QUFDbkc7Ozs7O0dBS0c7QUFDSCxTQUFzQixJQUFJLENBQUMsU0FBa0IsRUFBRSxJQUFZOztRQUN2RCxPQUFPLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQUE7QUFGRCxvQkFFQztBQUNELFNBQWdCLGlCQUFpQixDQUFDLFNBQWtCLEVBQUUsSUFBWTtJQUM5RCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRkQsOENBRUMifQ==