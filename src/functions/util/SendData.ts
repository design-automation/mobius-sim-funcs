import { Sim } from '../../mobius_sim';


// ================================================================================================
/**
 * Post a message to the parent window. Used when Mobius is embedded in an external website.
 *
 * @param __model__
 * @param data The data to send, a list or a dictionary.
 * @returns A message in the parent window.
 */
export function SendData(__model__: Sim, data: any): void {
    window.parent.postMessage(data, '*');
}
