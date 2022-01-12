"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getAttribPushTarget = exports._getEntTypeFromStr = void 0;
/**
 * The `attrib` module has functions for working with attributes in teh model.
 * Note that attributes can also be set and retrieved using the "@" symbol.
 * @module
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9hdHRyaWIvX3NoYXJlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsOERBQXlEO0FBRXpELG1DQUF5RTtBQUd6RSxtR0FBbUc7QUFFbkcsU0FBZ0Isa0JBQWtCLENBQUMsWUFBeUM7SUFDeEUsUUFBUSxZQUFZLEVBQUU7UUFDbEIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsS0FBSztZQUN0QixPQUFPLHFCQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssdUJBQWUsQ0FBQyxLQUFLO1lBQ3RCLE9BQU8scUJBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxHQUFHO1lBQ3BCLE9BQU8scUJBQVEsQ0FBQyxHQUFHLENBQUM7UUFDeEI7WUFDSSxNQUFNO0tBQ2I7QUFDTCxDQUFDO0FBdkJELGdEQXVCQztBQUNELFNBQWdCLG9CQUFvQixDQUFDLFlBQWdDO0lBQ2pFLFFBQVEsWUFBWSxFQUFFO1FBQ2xCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLHFCQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssMEJBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLHFCQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsSUFBSTtZQUN4QixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssMEJBQWtCLENBQUMsS0FBSztZQUN6QixPQUFPLGVBQWUsQ0FBQztRQUMzQixLQUFLLDBCQUFrQixDQUFDLEtBQUs7WUFDekIsT0FBTyxhQUFhLENBQUM7UUFDekIsS0FBSywwQkFBa0IsQ0FBQyxHQUFHO1lBQ3ZCLE9BQU8scUJBQVEsQ0FBQyxHQUFHLENBQUM7UUFDeEI7WUFDSSxNQUFNO0tBQ2I7QUFDTCxDQUFDO0FBM0JELG9EQTJCQyJ9