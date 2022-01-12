"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ESolarMethod = exports._ESunPathMethod = exports._ESkyMethod = exports._ERaytraceMethod = exports._EShortestPathResult = exports._EShortestPathMethod = exports._ECentralityType = exports._ECentralityMethod = void 0;
var _ECentralityMethod;
(function (_ECentralityMethod) {
    _ECentralityMethod["UNDIRECTED"] = "undirected";
    _ECentralityMethod["DIRECTED"] = "directed";
})(_ECentralityMethod = exports._ECentralityMethod || (exports._ECentralityMethod = {}));
var _ECentralityType;
(function (_ECentralityType) {
    _ECentralityType["BETWEENNESS"] = "betweenness";
    _ECentralityType["CLOSENESS"] = "closeness";
    _ECentralityType["HARMONIC"] = "harmonic";
})(_ECentralityType = exports._ECentralityType || (exports._ECentralityType = {}));
var _EShortestPathMethod;
(function (_EShortestPathMethod) {
    _EShortestPathMethod["UNDIRECTED"] = "undirected";
    _EShortestPathMethod["DIRECTED"] = "directed";
})(_EShortestPathMethod = exports._EShortestPathMethod || (exports._EShortestPathMethod = {}));
var _EShortestPathResult;
(function (_EShortestPathResult) {
    _EShortestPathResult["DISTS"] = "distances";
    _EShortestPathResult["COUNTS"] = "counts";
    _EShortestPathResult["PATHS"] = "paths";
    _EShortestPathResult["ALL"] = "all";
})(_EShortestPathResult = exports._EShortestPathResult || (exports._EShortestPathResult = {}));
var _ERaytraceMethod;
(function (_ERaytraceMethod) {
    _ERaytraceMethod["STATS"] = "stats";
    _ERaytraceMethod["DISTANCES"] = "distances";
    _ERaytraceMethod["HIT_PGONS"] = "hit_pgons";
    _ERaytraceMethod["INTERSECTIONS"] = "intersections";
    _ERaytraceMethod["ALL"] = "all";
})(_ERaytraceMethod = exports._ERaytraceMethod || (exports._ERaytraceMethod = {}));
var _ESkyMethod;
(function (_ESkyMethod) {
    _ESkyMethod["WEIGHTED"] = "weighted";
    _ESkyMethod["UNWEIGHTED"] = "unweighted";
    _ESkyMethod["ALL"] = "all";
})(_ESkyMethod = exports._ESkyMethod || (exports._ESkyMethod = {}));
var _ESunPathMethod;
(function (_ESunPathMethod) {
    _ESunPathMethod["DIRECT"] = "direct";
    _ESunPathMethod["INDIRECT"] = "indirect";
    _ESunPathMethod["SKY"] = "sky";
})(_ESunPathMethod = exports._ESunPathMethod || (exports._ESunPathMethod = {}));
var _ESolarMethod;
(function (_ESolarMethod) {
    _ESolarMethod["DIRECT_WEIGHTED"] = "direct_weighted";
    _ESolarMethod["DIRECT_UNWEIGHTED"] = "direct_unweighted";
    _ESolarMethod["INDIRECT_WEIGHTED"] = "indirect_weighted";
    _ESolarMethod["INDIRECT_UNWEIGHTED"] = "indirect_unweighted";
})(_ESolarMethod = exports._ESolarMethod || (exports._ESolarMethod = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2VudW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvYW5hbHl6ZS9fZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLGtCQUdYO0FBSEQsV0FBWSxrQkFBa0I7SUFDMUIsK0NBQXlCLENBQUE7SUFDekIsMkNBQXFCLENBQUE7QUFDekIsQ0FBQyxFQUhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBRzdCO0FBQ0QsSUFBWSxnQkFJWDtBQUpELFdBQVksZ0JBQWdCO0lBQ3hCLCtDQUEyQixDQUFBO0lBQzNCLDJDQUF1QixDQUFBO0lBQ3ZCLHlDQUFxQixDQUFBO0FBQ3pCLENBQUMsRUFKVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQUkzQjtBQUNELElBQVksb0JBR1g7QUFIRCxXQUFZLG9CQUFvQjtJQUM1QixpREFBeUIsQ0FBQTtJQUN6Qiw2Q0FBcUIsQ0FBQTtBQUN6QixDQUFDLEVBSFcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFHL0I7QUFDRCxJQUFZLG9CQUtYO0FBTEQsV0FBWSxvQkFBb0I7SUFDNUIsMkNBQW1CLENBQUE7SUFDbkIseUNBQWlCLENBQUE7SUFDakIsdUNBQWUsQ0FBQTtJQUNmLG1DQUFXLENBQUE7QUFDZixDQUFDLEVBTFcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFLL0I7QUFDRCxJQUFZLGdCQU1YO0FBTkQsV0FBWSxnQkFBZ0I7SUFDeEIsbUNBQWUsQ0FBQTtJQUNmLDJDQUF1QixDQUFBO0lBQ3ZCLDJDQUF1QixDQUFBO0lBQ3ZCLG1EQUErQixDQUFBO0lBQy9CLCtCQUFXLENBQUE7QUFDZixDQUFDLEVBTlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFNM0I7QUFDRCxJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDbkIsb0NBQXFCLENBQUE7SUFDckIsd0NBQXlCLENBQUE7SUFDekIsMEJBQVcsQ0FBQTtBQUNmLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQUNELElBQVksZUFJWDtBQUpELFdBQVksZUFBZTtJQUN2QixvQ0FBaUIsQ0FBQTtJQUNqQix3Q0FBcUIsQ0FBQTtJQUNyQiw4QkFBVyxDQUFBO0FBQ2YsQ0FBQyxFQUpXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSTFCO0FBQ0QsSUFBWSxhQUtYO0FBTEQsV0FBWSxhQUFhO0lBQ3JCLG9EQUFtQyxDQUFBO0lBQ25DLHdEQUF1QyxDQUFBO0lBQ3ZDLHdEQUF1QyxDQUFBO0lBQ3ZDLDREQUEyQyxDQUFBO0FBQy9DLENBQUMsRUFMVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUt4QiJ9