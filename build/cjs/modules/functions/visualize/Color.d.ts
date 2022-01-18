import { GIModel, TColor, TId } from '@design-automation/mobius-sim';
/**
 * Sets color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param color The color, [0,0,0] is black, [1,1,1] is white.
 * @returns void
 */
export declare function Color(__model__: GIModel, entities: TId | TId[], color: TColor): void;
