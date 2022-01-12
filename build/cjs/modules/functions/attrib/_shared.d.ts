/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
import { EEntType } from '@design-automation/mobius-sim';
import { _EAttribPushTarget, _EEntType, _EEntTypeAndMod } from './_enum';
export declare function _getEntTypeFromStr(ent_type_str: _EEntType | _EEntTypeAndMod): EEntType;
export declare function _getAttribPushTarget(ent_type_str: _EAttribPushTarget): EEntType | string;
