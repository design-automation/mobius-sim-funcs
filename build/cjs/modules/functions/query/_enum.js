"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EFilterOperator = exports._ETypeQueryEnum = exports._ESortMethod = exports._EEdgeMethod = exports._EDataType = exports._EEntTypeAndMod = exports._EEntType = void 0;
var _EEntType;
(function (_EEntType) {
    _EEntType["POSI"] = "ps";
    _EEntType["VERT"] = "_v";
    _EEntType["EDGE"] = "_e";
    _EEntType["WIRE"] = "_w";
    _EEntType["POINT"] = "pt";
    _EEntType["PLINE"] = "pl";
    _EEntType["PGON"] = "pg";
    _EEntType["COLL"] = "co";
})(_EEntType = exports._EEntType || (exports._EEntType = {}));
var _EEntTypeAndMod;
(function (_EEntTypeAndMod) {
    _EEntTypeAndMod["POSI"] = "ps";
    _EEntTypeAndMod["VERT"] = "_v";
    _EEntTypeAndMod["EDGE"] = "_e";
    _EEntTypeAndMod["WIRE"] = "_w";
    _EEntTypeAndMod["POINT"] = "pt";
    _EEntTypeAndMod["PLINE"] = "pl";
    _EEntTypeAndMod["PGON"] = "pg";
    _EEntTypeAndMod["COLL"] = "co";
    _EEntTypeAndMod["MOD"] = "mo";
})(_EEntTypeAndMod = exports._EEntTypeAndMod || (exports._EEntTypeAndMod = {}));
var _EDataType;
(function (_EDataType) {
    _EDataType["NUMBER"] = "number";
    _EDataType["STRING"] = "string";
    _EDataType["BOOLEAN"] = "boolean";
    _EDataType["LIST"] = "list";
    _EDataType["DICT"] = "dict";
})(_EDataType = exports._EDataType || (exports._EDataType = {}));
var _EEdgeMethod;
(function (_EEdgeMethod) {
    _EEdgeMethod["PREV"] = "previous";
    _EEdgeMethod["NEXT"] = "next";
    _EEdgeMethod["PREV_NEXT"] = "both";
    _EEdgeMethod["TOUCH"] = "touching";
})(_EEdgeMethod = exports._EEdgeMethod || (exports._EEdgeMethod = {}));
var _ESortMethod;
(function (_ESortMethod) {
    _ESortMethod["DESCENDING"] = "descending";
    _ESortMethod["ASCENDING"] = "ascending";
})(_ESortMethod = exports._ESortMethod || (exports._ESortMethod = {}));
var _ETypeQueryEnum;
(function (_ETypeQueryEnum) {
    _ETypeQueryEnum["EXISTS"] = "exists";
    _ETypeQueryEnum["IS_POSI"] = "is_position";
    _ETypeQueryEnum["IS_USED_POSI"] = "is_used_posi";
    _ETypeQueryEnum["IS_UNUSED_POSI"] = "is_unused_posi";
    _ETypeQueryEnum["IS_VERT"] = "is_vertex";
    _ETypeQueryEnum["IS_EDGE"] = "is_edge";
    _ETypeQueryEnum["IS_WIRE"] = "is_wire";
    _ETypeQueryEnum["IS_POINT"] = "is_point";
    _ETypeQueryEnum["IS_PLINE"] = "is_polyline";
    _ETypeQueryEnum["IS_PGON"] = "is_polygon";
    _ETypeQueryEnum["IS_COLL"] = "is_collection";
    _ETypeQueryEnum["IS_OBJ"] = "is_object";
    _ETypeQueryEnum["IS_TOPO"] = "is_topology";
    _ETypeQueryEnum["IS_POINT_TOPO"] = "is_point_topology";
    _ETypeQueryEnum["IS_PLINE_TOPO"] = "is_polyline_topology";
    _ETypeQueryEnum["IS_PGON_TOPO"] = "is_polygon_topology";
    _ETypeQueryEnum["IS_OPEN"] = "is_open";
    _ETypeQueryEnum["IS_CLOSED"] = "is_closed";
    _ETypeQueryEnum["IS_HOLE"] = "is_hole";
    _ETypeQueryEnum["HAS_HOLES"] = "has_holes";
    _ETypeQueryEnum["HAS_NO_HOLES"] = "has_no_holes";
})(_ETypeQueryEnum = exports._ETypeQueryEnum || (exports._ETypeQueryEnum = {}));
var _EFilterOperator;
(function (_EFilterOperator) {
    _EFilterOperator["IS_EQUAL"] = "==";
    _EFilterOperator["IS_NOT_EQUAL"] = "!=";
    _EFilterOperator["IS_GREATER_OR_EQUAL"] = ">=";
    _EFilterOperator["IS_LESS_OR_EQUAL"] = "<=";
    _EFilterOperator["IS_GREATER"] = ">";
    _EFilterOperator["IS_LESS"] = "<";
    _EFilterOperator["EQUAL"] = "=";
})(_EFilterOperator = exports._EFilterOperator || (exports._EFilterOperator = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcXVlcnkvX2VudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBWSxTQVNYO0FBVEQsV0FBWSxTQUFTO0lBQ2pCLHdCQUFhLENBQUE7SUFDYix3QkFBYSxDQUFBO0lBQ2Isd0JBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2IseUJBQWEsQ0FBQTtJQUNiLHdCQUFhLENBQUE7SUFDYix3QkFBYSxDQUFBO0FBQ2pCLENBQUMsRUFUVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQVNwQjtBQUNELElBQVksZUFVWDtBQVZELFdBQVksZUFBZTtJQUN2Qiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDhCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7SUFDYiw4QkFBYSxDQUFBO0lBQ2IsOEJBQWEsQ0FBQTtJQUNiLDZCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVZXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBVTFCO0FBQ0QsSUFBWSxVQU1YO0FBTkQsV0FBWSxVQUFVO0lBQ2xCLCtCQUFtQixDQUFBO0lBQ25CLCtCQUFtQixDQUFBO0lBQ25CLGlDQUFtQixDQUFBO0lBQ25CLDJCQUFlLENBQUE7SUFDZiwyQkFBYSxDQUFBO0FBQ2pCLENBQUMsRUFOVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQU1yQjtBQUNELElBQVksWUFLWDtBQUxELFdBQVksWUFBWTtJQUNwQixpQ0FBaUIsQ0FBQTtJQUNqQiw2QkFBYSxDQUFBO0lBQ2Isa0NBQWtCLENBQUE7SUFDbEIsa0NBQWtCLENBQUE7QUFDdEIsQ0FBQyxFQUxXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBS3ZCO0FBQ0QsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3BCLHlDQUF5QixDQUFBO0lBQ3pCLHVDQUF1QixDQUFBO0FBQzNCLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUNELElBQVksZUFzQlg7QUF0QkQsV0FBWSxlQUFlO0lBQ3ZCLG9DQUFpQixDQUFBO0lBQ2pCLDBDQUF5QixDQUFBO0lBQ3pCLGdEQUE2QixDQUFBO0lBQzdCLG9EQUFpQyxDQUFBO0lBQ2pDLHdDQUF1QixDQUFBO0lBQ3ZCLHNDQUFxQixDQUFBO0lBQ3JCLHNDQUFxQixDQUFBO0lBQ3JCLHdDQUFzQixDQUFBO0lBQ3RCLDJDQUF5QixDQUFBO0lBQ3pCLHlDQUF3QixDQUFBO0lBQ3hCLDRDQUEyQixDQUFBO0lBQzNCLHVDQUF1QixDQUFBO0lBQ3ZCLDBDQUF5QixDQUFBO0lBQ3pCLHNEQUFxQyxDQUFBO0lBQ3JDLHlEQUF3QyxDQUFBO0lBQ3hDLHVEQUFzQyxDQUFBO0lBQ3RDLHNDQUF3QixDQUFBO0lBQ3hCLDBDQUEwQixDQUFBO0lBQzFCLHNDQUF3QixDQUFBO0lBQ3hCLDBDQUEwQixDQUFBO0lBQzFCLGdEQUE2QixDQUFBO0FBQ2pDLENBQUMsRUF0QlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFzQjFCO0FBRUQsSUFBWSxnQkFRWDtBQVJELFdBQVksZ0JBQWdCO0lBQ3hCLG1DQUE0QixDQUFBO0lBQzVCLHVDQUE0QixDQUFBO0lBQzVCLDhDQUE0QixDQUFBO0lBQzVCLDJDQUE0QixDQUFBO0lBQzVCLG9DQUEyQixDQUFBO0lBQzNCLGlDQUEyQixDQUFBO0lBQzNCLCtCQUEyQixDQUFBO0FBQy9CLENBQUMsRUFSVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVEzQiJ9