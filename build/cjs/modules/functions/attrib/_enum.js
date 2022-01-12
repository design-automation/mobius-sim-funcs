"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EDataType = exports._EAttribPushTarget = exports._EEntTypeAndMod = exports._EEntType = void 0;
var _EEntType;
(function (_EEntType) {
    _EEntType["POSI"] = "ps";
    _EEntType["VERT"] = "_v";
    _EEntType["EDGE"] = "_e";
    _EEntType["WIRE"] = "_w";
    _EEntType["FACE"] = "_f";
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
    _EEntTypeAndMod["FACE"] = "_f";
    _EEntTypeAndMod["POINT"] = "pt";
    _EEntTypeAndMod["PLINE"] = "pl";
    _EEntTypeAndMod["PGON"] = "pg";
    _EEntTypeAndMod["COLL"] = "co";
    _EEntTypeAndMod["MOD"] = "mo";
})(_EEntTypeAndMod = exports._EEntTypeAndMod || (exports._EEntTypeAndMod = {}));
var _EAttribPushTarget;
(function (_EAttribPushTarget) {
    _EAttribPushTarget["POSI"] = "ps";
    _EAttribPushTarget["VERT"] = "_v";
    _EAttribPushTarget["EDGE"] = "_e";
    _EAttribPushTarget["WIRE"] = "_w";
    _EAttribPushTarget["FACE"] = "_f";
    _EAttribPushTarget["POINT"] = "pt";
    _EAttribPushTarget["PLINE"] = "pl";
    _EAttribPushTarget["PGON"] = "pg";
    _EAttribPushTarget["COLL"] = "co";
    _EAttribPushTarget["COLLP"] = "cop";
    _EAttribPushTarget["COLLC"] = "coc";
    _EAttribPushTarget["MOD"] = "mo";
})(_EAttribPushTarget = exports._EAttribPushTarget || (exports._EAttribPushTarget = {}));
var _EDataType;
(function (_EDataType) {
    _EDataType["NUMBER"] = "number";
    _EDataType["STRING"] = "string";
    _EDataType["BOOLEAN"] = "boolean";
    _EDataType["LIST"] = "list";
    _EDataType["DICT"] = "dict";
})(_EDataType = exports._EDataType || (exports._EDataType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYXR0cmliL19lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksU0FVWDtBQVZELFdBQVksU0FBUztJQUNqQix3QkFBVyxDQUFBO0lBQ1gsd0JBQVcsQ0FBQTtJQUNYLHdCQUFXLENBQUE7SUFDWCx3QkFBVyxDQUFBO0lBQ1gsd0JBQVcsQ0FBQTtJQUNYLHlCQUFZLENBQUE7SUFDWix5QkFBWSxDQUFBO0lBQ1osd0JBQVcsQ0FBQTtJQUNYLHdCQUFXLENBQUE7QUFDZixDQUFDLEVBVlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFVcEI7QUFDRCxJQUFZLGVBV1g7QUFYRCxXQUFZLGVBQWU7SUFDdkIsOEJBQVcsQ0FBQTtJQUNYLDhCQUFXLENBQUE7SUFDWCw4QkFBVyxDQUFBO0lBQ1gsOEJBQVcsQ0FBQTtJQUNYLDhCQUFXLENBQUE7SUFDWCwrQkFBWSxDQUFBO0lBQ1osK0JBQVksQ0FBQTtJQUNaLDhCQUFXLENBQUE7SUFDWCw4QkFBVyxDQUFBO0lBQ1gsNkJBQVUsQ0FBQTtBQUNkLENBQUMsRUFYVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQVcxQjtBQUNELElBQVksa0JBYVg7QUFiRCxXQUFZLGtCQUFrQjtJQUMxQixpQ0FBVyxDQUFBO0lBQ1gsaUNBQVcsQ0FBQTtJQUNYLGlDQUFXLENBQUE7SUFDWCxpQ0FBVyxDQUFBO0lBQ1gsaUNBQVcsQ0FBQTtJQUNYLGtDQUFZLENBQUE7SUFDWixrQ0FBWSxDQUFBO0lBQ1osaUNBQVcsQ0FBQTtJQUNYLGlDQUFXLENBQUE7SUFDWCxtQ0FBYSxDQUFBO0lBQ2IsbUNBQWEsQ0FBQTtJQUNiLGdDQUFVLENBQUE7QUFDZCxDQUFDLEVBYlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFhN0I7QUFDRCxJQUFZLFVBTVg7QUFORCxXQUFZLFVBQVU7SUFDbEIsK0JBQWlCLENBQUE7SUFDakIsK0JBQWlCLENBQUE7SUFDakIsaUNBQW1CLENBQUE7SUFDbkIsMkJBQWEsQ0FBQTtJQUNiLDJCQUFhLENBQUE7QUFDakIsQ0FBQyxFQU5XLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBTXJCIn0=