// ================================================================================================
import { GIModel } from '@design-automation/mobius-sim';
import axios from 'axios';

import { _HTTPRequestMethod } from './_enum';



/**
 * Create a http request to a URL.
 * Typically used with a server that runs simulations, or to download data. 
 * 
 * @param request_data Request data. Can be 'null' to request everything. 
 * @param request_url Request url, as a string.
 * @param method Enum, HTTP method: `'GET', 'POST', 'PATCH', 'DELETE'` or `'PUT'`.
 * @returns The request response: JSON data in the form of a dictionary.
 * @example `data = util.HTTPRequest(null, "websiteurl.com", "GET")`
 * @exampleinfo This will show the website in the console. 
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
