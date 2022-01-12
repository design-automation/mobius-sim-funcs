"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EBooleanMethod = exports._EOffsetRound = exports._EOffset = exports._EClipEndType = exports._EClipJointType = exports._EBBoxMethod = void 0;
var _EBBoxMethod;
(function (_EBBoxMethod) {
    _EBBoxMethod["AABB"] = "aabb";
    _EBBoxMethod["OBB"] = "obb";
})(_EBBoxMethod = exports._EBBoxMethod || (exports._EBBoxMethod = {}));
var _EClipJointType;
(function (_EClipJointType) {
    _EClipJointType["SQUARE"] = "jtSquare";
    _EClipJointType["ROUND"] = "jtRound";
    _EClipJointType["MITER"] = "jtMiter";
})(_EClipJointType = exports._EClipJointType || (exports._EClipJointType = {}));
var _EClipEndType;
(function (_EClipEndType) {
    _EClipEndType["OPEN_SQUARE"] = "etOpenSquare";
    _EClipEndType["OPEN_ROUND"] = "etOpenRound";
    _EClipEndType["OPEN_BUTT"] = "etOpenButt";
    _EClipEndType["CLOSED_PLINE"] = "etClosedLine";
    _EClipEndType["CLOSED_PGON"] = "etClosedPolygon";
})(_EClipEndType = exports._EClipEndType || (exports._EClipEndType = {}));
// Function enums
var _EOffset;
(function (_EOffset) {
    _EOffset["SQUARE_END"] = "square_end";
    _EOffset["BUTT_END"] = "butt_end";
})(_EOffset = exports._EOffset || (exports._EOffset = {}));
var _EOffsetRound;
(function (_EOffsetRound) {
    _EOffsetRound["SQUARE_END"] = "square_end";
    _EOffsetRound["BUTT_END"] = "butt_end";
    _EOffsetRound["ROUND_END"] = "round_end";
})(_EOffsetRound = exports._EOffsetRound || (exports._EOffsetRound = {}));
var _EBooleanMethod;
(function (_EBooleanMethod) {
    _EBooleanMethod["INTERSECT"] = "intersect";
    _EBooleanMethod["DIFFERENCE"] = "difference";
    _EBooleanMethod["SYMMETRIC"] = "symmetric";
})(_EBooleanMethod = exports._EBooleanMethod || (exports._EBooleanMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvcG9seTJkL19lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQiw2QkFBYSxDQUFBO0lBQ2IsMkJBQVcsQ0FBQTtBQUNmLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUNELElBQVksZUFJWDtBQUpELFdBQVksZUFBZTtJQUN2QixzQ0FBbUIsQ0FBQTtJQUNuQixvQ0FBaUIsQ0FBQTtJQUNqQixvQ0FBaUIsQ0FBQTtBQUNyQixDQUFDLEVBSlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFJMUI7QUFDRCxJQUFZLGFBTVg7QUFORCxXQUFZLGFBQWE7SUFDckIsNkNBQTRCLENBQUE7SUFDNUIsMkNBQTBCLENBQUE7SUFDMUIseUNBQXdCLENBQUE7SUFDeEIsOENBQTZCLENBQUE7SUFDN0IsZ0RBQStCLENBQUE7QUFDbkMsQ0FBQyxFQU5XLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBTXhCO0FBQ0QsaUJBQWlCO0FBQ2pCLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixxQ0FBeUIsQ0FBQTtJQUN6QixpQ0FBcUIsQ0FBQTtBQUN6QixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7QUFDRCxJQUFZLGFBSVg7QUFKRCxXQUFZLGFBQWE7SUFDckIsMENBQXlCLENBQUE7SUFDekIsc0NBQXFCLENBQUE7SUFDckIsd0NBQXVCLENBQUE7QUFDM0IsQ0FBQyxFQUpXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBSXhCO0FBQ0QsSUFBWSxlQUlYO0FBSkQsV0FBWSxlQUFlO0lBQ3ZCLDBDQUF1QixDQUFBO0lBQ3ZCLDRDQUF5QixDQUFBO0lBQ3pCLDBDQUF1QixDQUFBO0FBQzNCLENBQUMsRUFKVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUkxQiJ9