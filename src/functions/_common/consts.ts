// ================================================================================================
// CONSTANTS
// ================================================================================================
// longitude latitude in Singapore, NUS
export const LONGLAT = [103.778329, 1.298759];
// -------------------------------------------------------------------------------------------------
// some constants
export const XYPLANE: TPlane = [[0, 0, 0], [1, 0, 0], [0, 1, 0]];
export const YZPLANE: TPlane = [[0, 0, 0], [0, 1, 0], [0, 0, 1]];
export const ZXPLANE: TPlane = [[0, 0, 0], [0, 0, 1], [1, 0, 0]];
// -------------------------------------------------------------------------------------------------
export const YXPLANE: TPlane = [[0, 0, 0], [0, 1, 0], [1, 0, 0]];
export const ZYPLANE: TPlane = [[0, 0, 0], [0, 0, 1], [0, 1, 0]];
export const XZPLANE: TPlane = [[0, 0, 0], [1, 0, 0], [0, 0, 1]];
// ================================================================================================
// TYPES
// ================================================================================================
export type Txy = [number, number]; // north direction
export type Txyz = [number, number, number];
export type TRay = [Txyz, Txyz]; // an origin and a direction vector
export type TPlane = [Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TBBox = [Txyz, Txyz, Txyz, Txyz]; // an origin, an x vec and a y vec
export type TQuery = string;
export type TColor = [number, number, number]; // TODO replace with Txyz
export type TNormal = [number, number, number]; // TODO replace with xyz
export type TTexture = [number, number];
export type TAttribDataTypes = string | number | boolean | any[] | object;
export type TModelAttribValuesArr = Array<[string, TAttribDataTypes]>; // for JSON
export const RE_SPACES: RegExp = /\s+/g;
// ================================================================================================
// ENUMS
// ================================================================================================
export enum EAttribNames {
    COORDS =  'xyz',
    NORMAL =  'normal',
    COLOR =   'rgb',
    TEXTURE = 'uv',
    NAME = 'name',
    MATERIAL = 'material',
    VISIBILITY = 'visibility',
    LABEL = 'label',
    COLL_NAME = 'name',
    TIMESTAMP = '_ts'
}
// -------------------------------------------------------------------------------------------------
export enum EAttribDataTypeStrs {
    // INT = 'Int',
    NUMBER = 'number',
    STRING = 'string',
    BOOLEAN = 'boolean',
    LIST = 'list', // a list of anything
    DICT = 'dict' // an object
}
// -------------------------------------------------------------------------------------------------