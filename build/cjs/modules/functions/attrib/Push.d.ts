import { GIModel, TId } from '@design-automation/mobius-sim';
import { _EAttribPushTarget, _EPushMethodSel } from './_enum';
/**
 * Push attributes up or down the hierarchy. The original attribute is not changed.
 * \n
 * @param __model__
 * @param entities Entities, the entities to push the attribute values for.
 * @param attrib The attribute. Can be `name`, `[name, index_or_key]`,
 * `[source_name, source_index_or_key, target_name]` or `[source_name, source_index_or_key, target_name, target_index_or_key]`.
 * @param ent_type_sel Enum, the target entity type where the attribute values should be pushed to.
 * @param method_sel Enum, the method for aggregating attribute values in cases where aggregation is necessary.
 */
export declare function Push(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number | string] | [string, number | string, string] | [string, number | string, string, number | string], ent_type_sel: _EAttribPushTarget, method_sel: _EPushMethodSel): void;
