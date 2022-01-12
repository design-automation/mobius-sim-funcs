"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EPolyhedronMethod = exports._EClose = exports._ECurveCatRomType = exports._EGridMethod = exports._EBoxMethod = void 0;
var _EBoxMethod;
(function (_EBoxMethod) {
    _EBoxMethod["FLAT"] = "flat";
    _EBoxMethod["ROWS"] = "rows";
    _EBoxMethod["COLUMNS"] = "columns";
    _EBoxMethod["LAYERS"] = "layers";
    _EBoxMethod["QUADS"] = "quads";
})(_EBoxMethod = exports._EBoxMethod || (exports._EBoxMethod = {}));
var _EGridMethod;
(function (_EGridMethod) {
    _EGridMethod["FLAT"] = "flat";
    _EGridMethod["COLUMNS"] = "columns";
    _EGridMethod["ROWS"] = "rows";
    _EGridMethod["QUADS"] = "quads";
})(_EGridMethod = exports._EGridMethod || (exports._EGridMethod = {}));
var _ECurveCatRomType;
(function (_ECurveCatRomType) {
    _ECurveCatRomType["CENTRIPETAL"] = "centripetal";
    _ECurveCatRomType["CHORDAL"] = "chordal";
    _ECurveCatRomType["CATMULLROM"] = "catmullrom";
})(_ECurveCatRomType = exports._ECurveCatRomType || (exports._ECurveCatRomType = {}));
var _EClose;
(function (_EClose) {
    _EClose["OPEN"] = "open";
    _EClose["CLOSE"] = "close";
})(_EClose = exports._EClose || (exports._EClose = {}));
var _EPolyhedronMethod;
(function (_EPolyhedronMethod) {
    _EPolyhedronMethod["FLAT_TETRA"] = "flat_tetra";
    _EPolyhedronMethod["FLAT_CUBE"] = "flat_cube";
    _EPolyhedronMethod["FLAT_OCTA"] = "flat_octa";
    _EPolyhedronMethod["FLAT_ICOSA"] = "flat_icosa";
    _EPolyhedronMethod["FLAT_DODECA"] = "flat_dodeca";
    _EPolyhedronMethod["FACE_TETRA"] = "face_tetra";
    _EPolyhedronMethod["FACE_CUBE"] = "face_cube";
    _EPolyhedronMethod["FACE_OCTA"] = "face_octa";
    _EPolyhedronMethod["FACE_ICOSA"] = "face_icosa";
    _EPolyhedronMethod["FACE_DODECA"] = "face_dodeca";
})(_EPolyhedronMethod = exports._EPolyhedronMethod || (exports._EPolyhedronMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcGF0dGVybi9fZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLFdBTVg7QUFORCxXQUFZLFdBQVc7SUFDbkIsNEJBQWEsQ0FBQTtJQUNiLDRCQUFhLENBQUE7SUFDYixrQ0FBbUIsQ0FBQTtJQUNuQixnQ0FBaUIsQ0FBQTtJQUNqQiw4QkFBZSxDQUFBO0FBQ25CLENBQUMsRUFOVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQU10QjtBQUNELElBQVksWUFLWDtBQUxELFdBQVksWUFBWTtJQUNwQiw2QkFBYSxDQUFBO0lBQ2IsbUNBQW1CLENBQUE7SUFDbkIsNkJBQWEsQ0FBQTtJQUNiLCtCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUxXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBS3ZCO0FBQ0QsSUFBWSxpQkFJWDtBQUpELFdBQVksaUJBQWlCO0lBQ3pCLGdEQUEyQixDQUFBO0lBQzNCLHdDQUFtQixDQUFBO0lBQ25CLDhDQUF5QixDQUFBO0FBQzdCLENBQUMsRUFKVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUk1QjtBQUNELElBQVksT0FHWDtBQUhELFdBQVksT0FBTztJQUNmLHdCQUFhLENBQUE7SUFDYiwwQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFIVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFHbEI7QUFDRCxJQUFZLGtCQVdYO0FBWEQsV0FBWSxrQkFBa0I7SUFDMUIsK0NBQXlCLENBQUE7SUFDekIsNkNBQXVCLENBQUE7SUFDdkIsNkNBQXVCLENBQUE7SUFDdkIsK0NBQXlCLENBQUE7SUFDekIsaURBQTJCLENBQUE7SUFDM0IsK0NBQXlCLENBQUE7SUFDekIsNkNBQXVCLENBQUE7SUFDdkIsNkNBQXVCLENBQUE7SUFDdkIsK0NBQXlCLENBQUE7SUFDekIsaURBQTJCLENBQUE7QUFDL0IsQ0FBQyxFQVhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBVzdCIn0=