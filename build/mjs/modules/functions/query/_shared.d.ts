/**
 * The `query` module has functions for querying entities in the the model.
 * Most of these functions all return a list of IDs of entities in the model.
 * @module
 */
import { EEntType } from '@design-automation/mobius-sim';
import { _EEntType, _EEntTypeAndMod } from './_enum';
export declare function _getEntTypeFromStr(ent_type_str: _EEntType | _EEntTypeAndMod): EEntType;
