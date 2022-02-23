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
exports.HTTPRequest = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method Enum; HTTP method
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9odHRwUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSxrREFBMEI7QUFNMUI7Ozs7OztHQU1HO0FBQ0YsU0FBc0IsV0FBVyxDQUFDLFNBQWtCLEVBQUUsWUFBaUIsRUFBRSxXQUFtQixFQUFFLE1BQTBCOztRQUNySCxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUE7UUFDckIsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3pDLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUM3QyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDbkQ7UUFDRCxJQUFJLEdBQVcsQ0FBQztRQUNoQixNQUFNLElBQUEsZUFBSyxFQUFDO1lBQ1IsTUFBTSxFQUFFLE1BQU07WUFDZCxHQUFHLEVBQUUsR0FBRztZQUNSLE9BQU8sRUFBRSxDQUFDO1lBQ1YsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQ3pDLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUFBO0FBZEEsa0NBY0EifQ==