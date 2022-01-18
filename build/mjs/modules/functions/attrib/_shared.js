import { EEntType } from '@design-automation/mobius-sim';
import { _EAttribPushTarget, _EEntTypeAndMod } from './_enum';
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
export function _getAttribPushTarget(ent_type_str) {
    switch (ent_type_str) {
        case _EAttribPushTarget.POSI:
            return EEntType.POSI;
        case _EAttribPushTarget.VERT:
            return EEntType.VERT;
        case _EAttribPushTarget.EDGE:
            return EEntType.EDGE;
        case _EAttribPushTarget.WIRE:
            return EEntType.WIRE;
        case _EAttribPushTarget.POINT:
            return EEntType.POINT;
        case _EAttribPushTarget.PLINE:
            return EEntType.PLINE;
        case _EAttribPushTarget.PGON:
            return EEntType.PGON;
        case _EAttribPushTarget.COLL:
            return EEntType.COLL;
        case _EAttribPushTarget.COLLC:
            return 'coll_children';
        case _EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _EAttribPushTarget.MOD:
            return EEntType.MOD;
        default:
            break;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hdHRyaWIvX3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFFLGtCQUFrQixFQUFhLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUd6RSxtR0FBbUc7QUFFbkcsTUFBTSxVQUFVLGtCQUFrQixDQUFDLFlBQXlDO0lBQ3hFLFFBQVEsWUFBWSxFQUFFO1FBQ2xCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLEtBQUs7WUFDdEIsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssZUFBZSxDQUFDLEtBQUs7WUFDdEIsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssZUFBZSxDQUFDLEdBQUc7WUFDcEIsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQztBQUNELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxZQUFnQztJQUNqRSxRQUFRLFlBQVksRUFBRTtRQUNsQixLQUFLLGtCQUFrQixDQUFDLElBQUk7WUFDeEIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssa0JBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxrQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLGtCQUFrQixDQUFDLElBQUk7WUFDeEIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssa0JBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3pCLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQztRQUMxQixLQUFLLGtCQUFrQixDQUFDLElBQUk7WUFDeEIsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssa0JBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3pCLE9BQU8sZUFBZSxDQUFDO1FBQzNCLEtBQUssa0JBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLGFBQWEsQ0FBQztRQUN6QixLQUFLLGtCQUFrQixDQUFDLEdBQUc7WUFDdkIsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQyJ9