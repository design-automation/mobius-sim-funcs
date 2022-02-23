import { GIModel } from '@design-automation/mobius-sim';
export declare enum _HTTPRequestMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
    PUT = "PUT"
}
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method HTTP method
 * @returns the request response
 */
export declare function HTTPRequest(__model__: GIModel, request_data: any, request_url: string, method: _HTTPRequestMethod): Promise<string>;
