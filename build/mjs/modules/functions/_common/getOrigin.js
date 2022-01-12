import { isRay, isPlane, isXYZ } from "@design-automation/mobius-sim";
import { getCentoridFromEnts } from ".";
// ================================================================================================
export function getOrigin(__model__, data, fn_name) {
    if (isXYZ(data)) {
        return data;
    }
    if (isRay(data)) {
        return data[0];
    }
    if (isPlane(data)) {
        return data[0];
    }
    const ents = data;
    const origin = getCentoridFromEnts(__model__, ents, fn_name);
    return origin;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JpZ2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL19jb21tb24vZ2V0T3JpZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0MsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN4RyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxHQUFHLENBQUM7QUFDeEMsbUdBQW1HO0FBQ25HLE1BQU0sVUFBVSxTQUFTLENBQUMsU0FBa0IsRUFBRSxJQUF3QyxFQUFFLE9BQWU7SUFDbkcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDYixPQUFPLElBQVksQ0FBQztLQUN2QjtJQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFTLENBQUM7S0FDMUI7SUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNmLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBUyxDQUFDO0tBQzFCO0lBQ0QsTUFBTSxJQUFJLEdBQWdCLElBQW1CLENBQUM7SUFDOUMsTUFBTSxNQUFNLEdBQVMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxPQUFPLE1BQWMsQ0FBQztBQUMxQixDQUFDIn0=