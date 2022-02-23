import axios from 'axios';
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method Enum; HTTP method
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdXRpbC9odHRwUmVxdWVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFNMUI7Ozs7OztHQU1HO0FBQ0YsTUFBTSxDQUFDLEtBQUssVUFBVSxXQUFXLENBQUMsU0FBa0IsRUFBRSxZQUFpQixFQUFFLFdBQW1CLEVBQUUsTUFBMEI7SUFDckgsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFBO0lBQ3JCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN6QyxHQUFHLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDN0MsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ25EO0lBQ0QsSUFBSSxHQUFXLENBQUM7SUFDaEIsTUFBTSxLQUFLLENBQUM7UUFDUixNQUFNLEVBQUUsTUFBTTtRQUNkLEdBQUcsRUFBRSxHQUFHO1FBQ1IsT0FBTyxFQUFFLENBQUM7UUFDVixJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7S0FDekMsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDIn0=