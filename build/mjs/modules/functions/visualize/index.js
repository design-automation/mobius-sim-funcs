import * as Enum from './_enum';
import { BBox } from './BBox';
import { Color } from './Color';
import { Edge } from './Edge';
import { Gradient } from './Gradient';
import { Mesh } from './Mesh';
import { Plane } from './Plane';
import { Ray } from './Ray';
export { Color };
export { Gradient };
export { Edge };
export { Mesh };
export { Ray };
export { Plane };
export { BBox };
export class VisualizeFunc {
    constructor(model) {
        this.__enum__ = {
            ...Enum
        };
        this.__model__ = model;
    }
    Color(entities, color) {
        return Color(this.__model__, entities, color);
    }
    Gradient(entities, attrib, range, method) {
        return Gradient(this.__model__, entities, attrib, range, method);
    }
    Edge(entities, method) {
        return Edge(this.__model__, entities, method);
    }
    Mesh(entities, method) {
        return Mesh(this.__model__, entities, method);
    }
    Ray(rays, scale) {
        return Ray(this.__model__, rays, scale);
    }
    Plane(planes, scale) {
        return Plane(this.__model__, planes, scale);
    }
    BBox(bboxes) {
        return BBox(this.__model__, bboxes);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvdmlzdWFsaXplL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFFNUIsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUNwQixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDaEIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2hCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNmLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNqQixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDaEIsTUFBTSxPQUFPLGFBQWE7SUFLdEIsWUFBWSxLQUFjO1FBSDFCLGFBQVEsR0FBRztZQUNQLEdBQUcsSUFBSTtTQUNWLENBQUE7UUFFRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUNwQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTTtRQUNqQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNELEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSztRQUNmLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxJQUFJLENBQUMsTUFBTTtRQUNQLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNKIn0=