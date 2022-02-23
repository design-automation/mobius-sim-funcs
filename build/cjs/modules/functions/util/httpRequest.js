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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPRequest = exports._HTTPRequestMethod = void 0;
const axios_1 = __importDefault(require("axios"));
var _HTTPRequestMethod;
(function (_HTTPRequestMethod) {
    _HTTPRequestMethod["GET"] = "GET";
    _HTTPRequestMethod["POST"] = "POST";
    _HTTPRequestMethod["PATCH"] = "PATCH";
    _HTTPRequestMethod["DELETE"] = "DELETE";
    _HTTPRequestMethod["PUT"] = "PUT";
})(_HTTPRequestMethod = exports._HTTPRequestMethod || (exports._HTTPRequestMethod = {}));
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method HTTP method
 * @returns the request response
 */
function HTTPRequest(__model__, request_data, request_url, method) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = request_url;
        if (request_url.indexOf('localhost') !== -1) {
            url = request_url.replace(/https?:\/\//g, '');
            url = '/' + url.split('/').splice(0, 1).join('/');
        }
        let res;
        yield (0, axios_1.default)({
            method: method,
            url: url,
            timeout: 0,
            data: request_data ? request_data : '',
        }).then(r => res = JSON.stringify(r));
        return res;
    });
}
exports.HTTPRequest = HTTPRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9odHRwUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxrREFBMEI7QUFHMUIsSUFBWSxrQkFNWDtBQU5ELFdBQVksa0JBQWtCO0lBQzFCLGlDQUFXLENBQUE7SUFDWCxtQ0FBYSxDQUFBO0lBQ2IscUNBQWUsQ0FBQTtJQUNmLHVDQUFpQixDQUFBO0lBQ2pCLGlDQUFXLENBQUE7QUFDZixDQUFDLEVBTlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFNN0I7QUFHRDs7Ozs7O0dBTUc7QUFDRixTQUFzQixXQUFXLENBQUMsU0FBa0IsRUFBRSxZQUFpQixFQUFFLFdBQW1CLEVBQUUsTUFBMEI7O1FBQ3JILElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQTtRQUNyQixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDekMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQzdDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUNuRDtRQUNELElBQUksR0FBVyxDQUFDO1FBQ2hCLE1BQU0sSUFBQSxlQUFLLEVBQUM7WUFDUixNQUFNLEVBQUUsTUFBTTtZQUNkLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDekMsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQUE7QUFkQSxrQ0FjQSJ9