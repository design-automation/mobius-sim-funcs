"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getEntTypeFromStr = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2Z1bmN0aW9ucy9xdWVyeS9fc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUF5RDtBQUV6RCxtQ0FBcUQ7QUFHckQsbUdBQW1HO0FBRW5HLFNBQWdCLGtCQUFrQixDQUFDLFlBQXVDO0lBQ3RFLFFBQVEsWUFBWSxFQUFFO1FBQ2xCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsSUFBSTtZQUNyQixPQUFPLHFCQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLEtBQUs7WUFDdEIsT0FBTyxxQkFBUSxDQUFDLEtBQUssQ0FBQztRQUMxQixLQUFLLHVCQUFlLENBQUMsS0FBSztZQUN0QixPQUFPLHFCQUFRLENBQUMsS0FBSyxDQUFDO1FBQzFCLEtBQUssdUJBQWUsQ0FBQyxJQUFJO1lBQ3JCLE9BQU8scUJBQVEsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyx1QkFBZSxDQUFDLElBQUk7WUFDckIsT0FBTyxxQkFBUSxDQUFDLElBQUksQ0FBQztRQUN6QixLQUFLLHVCQUFlLENBQUMsR0FBRztZQUNwQixPQUFPLHFCQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3hCO1lBQ0ksTUFBTTtLQUNiO0FBQ0wsQ0FBQztBQXZCRCxnREF1QkMifQ==