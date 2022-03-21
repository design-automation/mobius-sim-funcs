import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EColorRampMethod } from './_enum';
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export declare function Gradient(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number] | [string, string], range: number | [number, number], method: _EColorRampMethod): void;
