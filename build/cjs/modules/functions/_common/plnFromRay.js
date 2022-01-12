"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plnFromRay = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
function plnFromRay(ray) {
    // overloaded case
    const ray_dep = (0, mobius_sim_1.getArrDepth)(ray);
    if (ray_dep === 3) {
        return ray.map((ray_one) => plnFromRay(ray_one));
    }
    // normal case
    ray = ray;
    const z_vec = (0, mobius_sim_1.vecNorm)(ray[1]);
    let vec = [0, 0, 1];
    if ((0, mobius_sim_1.vecDot)(vec, z_vec) === 1) {
        vec = [1, 0, 0];
    }
    const x_axis = (0, mobius_sim_1.vecCross)(vec, z_vec);
    const y_axis = (0, mobius_sim_1.vecCross)(x_axis, z_vec);
    return [ray[0].slice(), x_axis, y_axis];
}
exports.plnFromRay = plnFromRay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxuRnJvbVJheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9fY29tbW9uL3BsbkZyb21SYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQTJHO0FBQzNHLFNBQWdCLFVBQVUsQ0FBQyxHQUFrQjtJQUN6QyxrQkFBa0I7SUFDbEIsTUFBTSxPQUFPLEdBQVcsSUFBQSx3QkFBVyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQUksT0FBTyxLQUFLLENBQUMsRUFBRTtRQUNmLE9BQVEsR0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFhLENBQUM7S0FDNUU7SUFDRCxjQUFjO0lBQ2QsR0FBRyxHQUFHLEdBQVcsQ0FBQztJQUNsQixNQUFNLEtBQUssR0FBUyxJQUFBLG9CQUFPLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsSUFBSSxHQUFHLEdBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFCLElBQUksSUFBQSxtQkFBTSxFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUIsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNuQjtJQUNELE1BQU0sTUFBTSxHQUFTLElBQUEscUJBQVEsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQVMsSUFBQSxxQkFBUSxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBaEJELGdDQWdCQyJ9