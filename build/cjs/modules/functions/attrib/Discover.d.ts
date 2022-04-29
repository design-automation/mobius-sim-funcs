import { EAttribDataTypeStrs, GIModel } from '@design-automation/mobius-sim';
import { _EEntTypeAndMod } from './_enum';
/**
 * Get all attribute names and attribute types for an entity type.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @returns A list of dictionaries, defining the name and type of each attribute.
 * @example attribs = attrib.Discover("pg")
 * @example_info An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
 */
export declare function Discover(__model__: GIModel, ent_type_sel: _EEntTypeAndMod): Array<{
    name: string;
    type: EAttribDataTypeStrs;
}>;
