"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrigin = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _1 = require(".");
// ================================================================================================
function getOrigin(__model__, data, fn_name) {
    if ((0, mobius_sim_1.isXYZ)(data)) {
        return data;
    }
    if ((0, mobius_sim_1.isRay)(data)) {
        return data[0];
    }
    if ((0, mobius_sim_1.isPlane)(data)) {
        return data[0];
    }
    const ents = data;
    const origin = (0, _1.getCentoridFromEnts)(__model__, ents, fn_name);
    return origin;
}
exports.getOrigin = getOrigin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JpZ2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL19jb21tb24vZ2V0T3JpZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUF3RztBQUN4Ryx3QkFBd0M7QUFDeEMsbUdBQW1HO0FBQ25HLFNBQWdCLFNBQVMsQ0FBQyxTQUFrQixFQUFFLElBQXdDLEVBQUUsT0FBZTtJQUNuRyxJQUFJLElBQUEsa0JBQUssRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNiLE9BQU8sSUFBWSxDQUFDO0tBQ3ZCO0lBQ0QsSUFBSSxJQUFBLGtCQUFLLEVBQUMsSUFBSSxDQUFDLEVBQUU7UUFDYixPQUFPLElBQUksQ0FBQyxDQUFDLENBQVMsQ0FBQztLQUMxQjtJQUNELElBQUksSUFBQSxvQkFBTyxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2YsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFTLENBQUM7S0FDMUI7SUFDRCxNQUFNLElBQUksR0FBZ0IsSUFBbUIsQ0FBQztJQUM5QyxNQUFNLE1BQU0sR0FBUyxJQUFBLHNCQUFtQixFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsT0FBTyxNQUFjLENBQUM7QUFDMUIsQ0FBQztBQWJELDhCQWFDIn0=