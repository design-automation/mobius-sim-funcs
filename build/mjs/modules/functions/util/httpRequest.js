import axios from 'axios';
export var _HTTPRequestMethod;
(function (_HTTPRequestMethod) {
    _HTTPRequestMethod["GET"] = "GET";
    _HTTPRequestMethod["POST"] = "POST";
    _HTTPRequestMethod["PATCH"] = "PATCH";
    _HTTPRequestMethod["DELETE"] = "DELETE";
    _HTTPRequestMethod["PUT"] = "PUT";
})(_HTTPRequestMethod || (_HTTPRequestMethod = {}));
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method HTTP method
 * @returns the request response
 */
export async function HTTPRequest(__model__, request_data, request_url, method) {
    let url = request_url;
    if (request_url.indexOf('localhost') !== -1) {
        url = request_url.replace(/https?:\/\//g, '');
        url = '/' + url.split('/').splice(0, 1).join('/');
    }
    let res;
    await axios({
        method: method,
        url: url,
        timeout: 0,
        data: request_data ? request_data : '',
    }).then(r => res = JSON.stringify(r));
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9odHRwUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFHMUIsTUFBTSxDQUFOLElBQVksa0JBTVg7QUFORCxXQUFZLGtCQUFrQjtJQUMxQixpQ0FBVyxDQUFBO0lBQ1gsbUNBQWEsQ0FBQTtJQUNiLHFDQUFlLENBQUE7SUFDZix1Q0FBaUIsQ0FBQTtJQUNqQixpQ0FBVyxDQUFBO0FBQ2YsQ0FBQyxFQU5XLGtCQUFrQixLQUFsQixrQkFBa0IsUUFNN0I7QUFHRDs7Ozs7O0dBTUc7QUFDRixNQUFNLENBQUMsS0FBSyxVQUFVLFdBQVcsQ0FBQyxTQUFrQixFQUFFLFlBQWlCLEVBQUUsV0FBbUIsRUFBRSxNQUEwQjtJQUNySCxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUE7SUFDckIsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3pDLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUM3QyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDbkQ7SUFDRCxJQUFJLEdBQVcsQ0FBQztJQUNoQixNQUFNLEtBQUssQ0FBQztRQUNSLE1BQU0sRUFBRSxNQUFNO1FBQ2QsR0FBRyxFQUFFLEdBQUc7UUFDUixPQUFPLEVBQUUsQ0FBQztRQUNWLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtLQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QyxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMifQ==