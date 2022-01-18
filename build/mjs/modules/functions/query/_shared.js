import { EEntType } from '@design-automation/mobius-sim';
import { _EEntTypeAndMod } from './_enum';
// ================================================================================================
export function _getEntTypeFromStr(ent_type_str) {
    switch (ent_type_str) {
        case _EEntTypeAndMod.POSI:
            return EEntType.POSI;
        case _EEntTypeAndMod.VERT:
            return EEntType.VERT;
        case _EEntTypeAndMod.EDGE:
            return EEntType.EDGE;
        case _EEntTypeAndMod.WIRE:
            return EEntType.WIRE;
        case _EEntTypeAndMod.POINT:
            return EEntType.POINT;
        case _EEntTypeAndMod.PLINE:
            return EEntType.PLINE;
        case _EEntTypeAndMod.PGON:
            return EEntType.PGON;
        case _EEntTypeAndMod.COLL:
            return EEntType.COLL;
        case _EEntTypeAndMod.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9fc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUV6RCxPQUFPLEVBQWEsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR3JELG1HQUFtRztBQUVuRyxNQUFNLFVBQVUsa0JBQWtCLENBQUMsWUFBdUM7SUFDdEUsUUFBUSxZQUFZLEVBQUU7UUFDbEIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsS0FBSztZQUN0QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSyxlQUFlLENBQUMsS0FBSztZQUN0QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxlQUFlLENBQUMsR0FBRztZQUNwQixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDeEI7WUFDSSxNQUFNO0tBQ2I7QUFDTCxDQUFDIn0=