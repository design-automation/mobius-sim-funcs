"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getAttribPushTarget = exports._getEntTypeFromStr = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _enum_1 = require("./_enum");
// ================================================================================================
function _getEntTypeFromStr(ent_type_str) {
    switch (ent_type_str) {
        case _enum_1._EEntTypeAndMod.POSI:
            return mobius_sim_1.EEntType.POSI;
        case _enum_1._EEntTypeAndMod.VERT:
            return mobius_sim_1.EEntType.VERT;
        case _enum_1._EEntTypeAndMod.EDGE:
            return mobius_sim_1.EEntType.EDGE;
        case _enum_1._EEntTypeAndMod.WIRE:
            return mobius_sim_1.EEntType.WIRE;
        case _enum_1._EEntTypeAndMod.POINT:
            return mobius_sim_1.EEntType.POINT;
        case _enum_1._EEntTypeAndMod.PLINE:
            return mobius_sim_1.EEntType.PLINE;
        case _enum_1._EEntTypeAndMod.PGON:
            return mobius_sim_1.EEntType.PGON;
        case _enum_1._EEntTypeAndMod.COLL:
            return mobius_sim_1.EEntType.COLL;
        case _enum_1._EEntTypeAndMod.MOD:
            return mobius_sim_1.EEntType.MOD;
        default:
            break;
    }
}
exports._getEntTypeFromStr = _getEntTypeFromStr;
function _getAttribPushTarget(ent_type_str) {
    switch (ent_type_str) {
        case _enum_1._EAttribPushTarget.POSI:
            return mobius_sim_1.EEntType.POSI;
        case _enum_1._EAttribPushTarget.VERT:
            return mobius_sim_1.EEntType.VERT;
        case _enum_1._EAttribPushTarget.EDGE:
            return mobius_sim_1.EEntType.EDGE;
        case _enum_1._EAttribPushTarget.WIRE:
            return mobius_sim_1.EEntType.WIRE;
        case _enum_1._EAttribPushTarget.POINT:
            return mobius_sim_1.EEntType.POINT;
        case _enum_1._EAttribPushTarget.PLINE:
            return mobius_sim_1.EEntType.PLINE;
        case _enum_1._EAttribPushTarget.PGON:
            return mobius_sim_1.EEntType.PGON;
        case _enum_1._EAttribPushTarget.COLL:
            return mobius_sim_1.EEntType.COLL;
        case _enum_1._EAttribPushTarget.COLLC:
            return 'coll_children';
        case _enum_1._EAttribPushTarget.COLLP:
            return 'coll_parent';
        case _enum_1._EAttribPushTarget.MOD:
            return mobius_sim_1.EEntType.MOD;
        default:
            break;
    }
}
exports._getAttribPushTarget = _getAttribPushTarget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hdHRyaWIvX3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUQ7QUFFekQsbUNBQXlFO0FBR3pFLG1HQUFtRztBQUVuRyxTQUFnQixrQkFBa0IsQ0FBQyxZQUF5QztJQUN4RSxRQUFRLFlBQVksRUFBRTtRQUNsQixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxLQUFLO1lBQ3RCLE9BQU8scUJBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSyx1QkFBZSxDQUFDLEtBQUs7WUFDdEIsT0FBTyxxQkFBUSxDQUFDLEtBQUssQ0FBQztRQUMxQixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLEdBQUc7WUFDcEIsT0FBTyxxQkFBUSxDQUFDLEdBQUcsQ0FBQztRQUN4QjtZQUNJLE1BQU07S0FDYjtBQUNMLENBQUM7QUF2QkQsZ0RBdUJDO0FBQ0QsU0FBZ0Isb0JBQW9CLENBQUMsWUFBZ0M7SUFDakUsUUFBUSxZQUFZLEVBQUU7UUFDbEIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxLQUFLO1lBQ3pCLE9BQU8scUJBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSywwQkFBa0IsQ0FBQyxLQUFLO1lBQ3pCLE9BQU8scUJBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxJQUFJO1lBQ3hCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxLQUFLO1lBQ3pCLE9BQU8sZUFBZSxDQUFDO1FBQzNCLEtBQUssMEJBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLGFBQWEsQ0FBQztRQUN6QixLQUFLLDBCQUFrQixDQUFDLEdBQUc7WUFDdkIsT0FBTyxxQkFBUSxDQUFDLEdBQUcsQ0FBQztRQUN4QjtZQUNJLE1BQU07S0FDYjtBQUNMLENBQUM7QUEzQkQsb0RBMkJDIn0=