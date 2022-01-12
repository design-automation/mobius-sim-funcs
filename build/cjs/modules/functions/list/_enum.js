"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ESortMethod = exports._EReplaceMethod = exports._ERemoveMethod = exports._EAddMethod = void 0;
var _EAddMethod;
(function (_EAddMethod) {
    _EAddMethod["TO_START"] = "to_start";
    _EAddMethod["TO_END"] = "to_end";
    _EAddMethod["EXTEND_START"] = "extend_start";
    _EAddMethod["EXTEND_END"] = "extend_end";
    _EAddMethod["SORTED_ALPHA"] = "alpha_descending";
    _EAddMethod["SORTED_REV_ALPHA"] = "alpha_ascending";
    _EAddMethod["SORTED_NUM"] = "numeric_descending";
    _EAddMethod["SORTED_REV_NUM"] = "numeric_ascending";
    _EAddMethod["SORTED_ID"] = "ID_descending";
    _EAddMethod["SORTED_REV_ID"] = "ID_ascending";
})(_EAddMethod = exports._EAddMethod || (exports._EAddMethod = {}));
var _ERemoveMethod;
(function (_ERemoveMethod) {
    _ERemoveMethod["REMOVE_INDEX"] = "index";
    _ERemoveMethod["REMOVE_FIRST_VALUE"] = "first_value";
    _ERemoveMethod["REMOVE_LAST_VALUE"] = "last_value";
    _ERemoveMethod["REMOVE_ALL_VALUES"] = "all_values";
})(_ERemoveMethod = exports._ERemoveMethod || (exports._ERemoveMethod = {}));
var _EReplaceMethod;
(function (_EReplaceMethod) {
    _EReplaceMethod["REPLACE_INDEX"] = "index";
    _EReplaceMethod["REPLACE_FIRST_VALUE"] = "first_value";
    _EReplaceMethod["REPLACE_LAST_VALUE"] = "last_value";
    _EReplaceMethod["REPLACE_ALL_VALUES"] = "all_values";
})(_EReplaceMethod = exports._EReplaceMethod || (exports._EReplaceMethod = {}));
var _ESortMethod;
(function (_ESortMethod) {
    _ESortMethod["REV"] = "reverse";
    _ESortMethod["ALPHA"] = "alpha_descending";
    _ESortMethod["REV_ALPHA"] = "alpha_ascending";
    _ESortMethod["NUM"] = "numeric_descending";
    _ESortMethod["REV_NUM"] = "numeric_ascending";
    _ESortMethod["ID"] = "ID_descending";
    _ESortMethod["REV_ID"] = "ID_ascending";
    _ESortMethod["SHIFT"] = "shift_1";
    _ESortMethod["REV_SHIFT"] = "reverse_shift_1";
    _ESortMethod["RANDOM"] = "random";
})(_ESortMethod = exports._ESortMethod || (exports._ESortMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbGlzdC9fZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLFdBV1g7QUFYRCxXQUFZLFdBQVc7SUFDbkIsb0NBQXFCLENBQUE7SUFDckIsZ0NBQWlCLENBQUE7SUFDakIsNENBQTZCLENBQUE7SUFDN0Isd0NBQXlCLENBQUE7SUFDekIsZ0RBQWlDLENBQUE7SUFDakMsbURBQW9DLENBQUE7SUFDcEMsZ0RBQWlDLENBQUE7SUFDakMsbURBQW9DLENBQUE7SUFDcEMsMENBQTJCLENBQUE7SUFDM0IsNkNBQThCLENBQUE7QUFDbEMsQ0FBQyxFQVhXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBV3RCO0FBQ0QsSUFBWSxjQUtYO0FBTEQsV0FBWSxjQUFjO0lBQ3RCLHdDQUFzQixDQUFBO0lBQ3RCLG9EQUFrQyxDQUFBO0lBQ2xDLGtEQUFnQyxDQUFBO0lBQ2hDLGtEQUFnQyxDQUFBO0FBQ3BDLENBQUMsRUFMVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUt6QjtBQUNELElBQVksZUFLWDtBQUxELFdBQVksZUFBZTtJQUN2QiwwQ0FBdUIsQ0FBQTtJQUN2QixzREFBbUMsQ0FBQTtJQUNuQyxvREFBaUMsQ0FBQTtJQUNqQyxvREFBaUMsQ0FBQTtBQUNyQyxDQUFDLEVBTFcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFLMUI7QUFDRCxJQUFZLFlBV1g7QUFYRCxXQUFZLFlBQVk7SUFDcEIsK0JBQWUsQ0FBQTtJQUNmLDBDQUEwQixDQUFBO0lBQzFCLDZDQUE2QixDQUFBO0lBQzdCLDBDQUEwQixDQUFBO0lBQzFCLDZDQUE2QixDQUFBO0lBQzdCLG9DQUFvQixDQUFBO0lBQ3BCLHVDQUF1QixDQUFBO0lBQ3ZCLGlDQUFpQixDQUFBO0lBQ2pCLDZDQUE2QixDQUFBO0lBQzdCLGlDQUFpQixDQUFBO0FBQ3JCLENBQUMsRUFYVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQVd2QiJ9