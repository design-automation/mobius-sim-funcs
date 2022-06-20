import { Sim } from '../../mobius_sim';


// ================================================================================================
/**
 * Returns a html string representation of the parameters in the model.
 * The string can be printed to the console for viewing.
 *
 * @param __model__
 * @param __constList__
 * @returns A dictionary that summarises what is in the model.
 */
export function ParamInfo(__model__: Sim, __constList__: {}): string {
    return JSON.stringify(__constList__);
}
