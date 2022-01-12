"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRay = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _1 = require(".");
function rayFromPln(pln) {
    // overloaded case
    const pln_dep = (0, mobius_sim_1.getArrDepth)(pln);
    if (pln_dep === 3) {
        return pln.map((pln_one) => rayFromPln(pln_one));
    }
    // normal case
    pln = pln;
    return [pln[0].slice(), (0, mobius_sim_1.vecCross)(pln[1], pln[2])];
}
// ================================================================================================
function getRay(__model__, data, fn_name) {
    if ((0, mobius_sim_1.isXYZ)(data)) {
        return [data, [0, 0, 1]];
    }
    if ((0, mobius_sim_1.isRay)(data)) {
        return data;
    }
    if ((0, mobius_sim_1.isPlane)(data)) {
        return rayFromPln(data);
    }
    const ents = data;
    const origin = (0, _1.getCentoridFromEnts)(__model__, ents, fn_name);
    return [origin, [0, 0, 1]];
}
exports.getRay = getRay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UmF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL19jb21tb24vZ2V0UmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUErSDtBQUMvSCx3QkFBd0M7QUFDeEMsU0FBUyxVQUFVLENBQUMsR0FBc0I7SUFDdEMsa0JBQWtCO0lBQ2xCLE1BQU0sT0FBTyxHQUFXLElBQUEsd0JBQVcsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7UUFDZixPQUFRLEdBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQVcsQ0FBQztLQUM1RTtJQUNELGNBQWM7SUFDZCxHQUFHLEdBQUcsR0FBYSxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFVLEVBQUUsSUFBQSxxQkFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFDRCxtR0FBbUc7QUFDbkcsU0FBZ0IsTUFBTSxDQUFDLFNBQWtCLEVBQUUsSUFBd0MsRUFBRSxPQUFlO0lBQ2hHLElBQUksSUFBQSxrQkFBSyxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQVMsQ0FBQztLQUNwQztJQUNELElBQUksSUFBQSxrQkFBSyxFQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2IsT0FBTyxJQUFZLENBQUM7S0FDdkI7SUFDRCxJQUFJLElBQUEsb0JBQU8sRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNmLE9BQU8sVUFBVSxDQUFDLElBQWMsQ0FBUyxDQUFDO0tBQzdDO0lBQ0QsTUFBTSxJQUFJLEdBQWdCLElBQW1CLENBQUM7SUFDOUMsTUFBTSxNQUFNLEdBQVMsSUFBQSxzQkFBbUIsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFTLENBQUM7QUFDdkMsQ0FBQztBQWJELHdCQWFDIn0=