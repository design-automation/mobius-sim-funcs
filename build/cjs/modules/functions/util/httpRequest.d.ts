import { GIModel } from '@design-automation/mobius-sim';
import { _HTTPRequestMethod } from './_enum';
/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method Enum; HTTP method
 * @returns the request response
 */
export declare function HTTPRequest(__model__: GIModel, request_data: any, request_url: string, method: _HTTPRequestMethod): Promise<string>;
