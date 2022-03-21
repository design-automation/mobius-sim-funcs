import { GIModel, TAttribDataTypes, TId } from '@design-automation/mobius-sim';
import { _ESet } from './_enum';
/**
 * Set an attribute value for one or more entities.
 * \n
 * If entities is null, then model level attributes will be set.
 * \n
 * @param __model__
 * @param entities Entities, the entities to set the attribute value for.
 * @param attrib The attribute. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param value The attribute value, or list of values.
 * @param method Enum
 */
export declare function Set(__model__: GIModel, entities: TId | TId[] | TId[][], attrib: string | [string, number | string], value: TAttribDataTypes | TAttribDataTypes[], method: _ESet): void;
