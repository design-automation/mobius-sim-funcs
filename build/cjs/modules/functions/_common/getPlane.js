"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlane = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _1 = require(".");
const plnFromRay_1 = require("./plnFromRay");
// ================================================================================================
function getPlane(__model__, data, fn_name) {
    if ((0, mobius_sim_1.isXYZ)(data)) {
        return [data, [1, 0, 0], [0, 1, 0]];
    }
    if ((0, mobius_sim_1.isRay)(data)) {
        return (0, plnFromRay_1.plnFromRay)(data);
    }
    if ((0, mobius_sim_1.isPlane)(data)) {
        return data;
    }
    const ents = data;
    const origin = (0, _1.getCentoridFromEnts)(__model__, ents, fn_name);
    return [origin, [1, 0, 0], [0, 1, 0]];
}
exports.getPlane = getPlane;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGxhbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvX2NvbW1vbi9nZXRQbGFuZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBd0c7QUFDeEcsd0JBQXdDO0FBQ3hDLDZDQUEwQztBQUUxQyxtR0FBbUc7QUFDbkcsU0FBZ0IsUUFBUSxDQUFDLFNBQWtCLEVBQUUsSUFBd0MsRUFBRSxPQUFlO0lBQ2xHLElBQUksSUFBQSxrQkFBSyxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFXLENBQUM7S0FDakQ7SUFDRCxJQUFJLElBQUEsa0JBQUssRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNiLE9BQU8sSUFBQSx1QkFBVSxFQUFDLElBQVksQ0FBVyxDQUFDO0tBQzdDO0lBQ0QsSUFBSSxJQUFBLG9CQUFPLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZixPQUFPLElBQWMsQ0FBQztLQUN6QjtJQUNELE1BQU0sSUFBSSxHQUFnQixJQUFtQixDQUFDO0lBQzlDLE1BQU0sTUFBTSxHQUFTLElBQUEsc0JBQW1CLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQVcsQ0FBQztBQUNwRCxDQUFDO0FBYkQsNEJBYUMifQ==