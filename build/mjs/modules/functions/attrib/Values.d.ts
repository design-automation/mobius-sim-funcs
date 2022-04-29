import { GIModel, TAttribDataTypes } from '@design-automation/mobius-sim';
import { _EEntTypeAndMod } from './_enum';
/**
 * Get a list of unique attribute balues for an attribute.
 * \n
 * @param __model__
 * @param ent_type_sel Enum, the attribute entity type.
 * @returns A list of dictionaries, defining the name and type of each attribute.
 * @example attribs = attrib.Discover("pg")
 * @example_info An example of `attribs`: `[{name: "description", type: "str"}, {name: "area", type: "number"}]`.
 */
export declare function Values(__model__: GIModel, ent_type_sel: _EEntTypeAndMod, attribs: string | string[]): TAttribDataTypes[];
