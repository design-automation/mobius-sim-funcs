// ================================================================================================
import { GIModel } from '@design-automation/mobius-sim';
import axios from 'axios';


export enum _HTTPRequestMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT'
}


/**
 * create a http request to a URL.
 * @param request_data request data
 * @param request_url request url
 * @param method HTTP method
 * @returns the request response
 */
 export async function HTTPRequest(__model__: GIModel, request_data: any, request_url: string, method: _HTTPRequestMethod): Promise<string> {
    let url = request_url
    if (request_url.indexOf('localhost') !== -1) {
        url = request_url.replace(/https?:\/\//g, '')
        url = '/' + url.split('/').splice(0,1).join('/')
    }
    let res: string;
    await axios({
        method: method,
        url: url,
        timeout: 0,
        data: request_data ? request_data : '',
    }).then( r => res = JSON.stringify(r));
    return res;
}
