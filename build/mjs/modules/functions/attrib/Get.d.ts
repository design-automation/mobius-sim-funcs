import { GIModel, TAttribDataTypes, TId } from '@design-automation/mobius-sim';
/**
 * Get attribute values for one or more entities.
 * \n
 * If entities is null, then model level attributes will be returned.
 * \n
 * @param __model__
 * @param entities Entities, the entities to get the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @returns One attribute value, or a list of attribute values.
 */
export declare function Get(__model__: GIModel, entities: TId | TId[] | TId[][], attrib: string | [string, number | string]): TAttribDataTypes | TAttribDataTypes[];
