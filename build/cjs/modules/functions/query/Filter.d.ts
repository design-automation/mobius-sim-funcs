/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { GIModel, TAttribDataTypes, TId } from '@design-automation/mobius-sim';
/**
 * Filter a list of entities based on an attribute value.
 * \n
 * The result will always be a list of entities, even if there is only one entity.
 * In a case where you want only one entity, remember to get the first item in the list.
 * \n
 * @param __model__
 * @param entities List of entities to filter. The entities must all be of the same type
 * @param attrib The attribute to use for filtering. Can be `name`, `[name, index]`, or `[name, key]`.
 * @param operator_enum Enum, the operator to use for filtering
 * @param value The attribute value to use for filtering.
 * @returns Entities, a list of entities that match the conditions specified in 'expr'.
 */
export declare function Filter(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number | string], operator_enum: _EFilterOperator, value: TAttribDataTypes): TId[] | TId[][];
export declare enum _EFilterOperator {
    IS_EQUAL = "==",
    IS_NOT_EQUAL = "!=",
    IS_GREATER_OR_EQUAL = ">=",
    IS_LESS_OR_EQUAL = "<=",
    IS_GREATER = ">",
    IS_LESS = "<",
    EQUAL = "="
}
