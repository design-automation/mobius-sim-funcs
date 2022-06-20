import { Sim } from '../../mobius_sim';


// ================================================================================================
/**
 * Checks the internal consistency of the model. Used for debugigng Mobius.
 *
 * @param __model__
 * @returns Text that summarises what is in the model, click print to see this text.
 */
export function ModelCheck(__model__: Sim): string {
    console.log('==== ==== ==== ====');
    console.log('MODEL GEOM\n', __model__.modeldata.geom.toStr());
    // console.log('MODEL ATTRIBS\n', __model__.modeldata.attribs.toStr());
    console.log('META\n', __model__.metadata.toDebugStr());
    console.log('==== ==== ==== ====');
    console.log(__model__);
    const check: string[] = __model__.check();
    if (check.length > 0) {
        return String(check);
    }
    return 'No internal inconsistencies have been found.';
}
