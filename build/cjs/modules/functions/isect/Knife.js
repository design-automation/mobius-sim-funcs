"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knife = void 0;
/**
 * Separates a list of points, polylines or polygons into two lists with a plane.
 * @param __model__
 * @param geometry List of points, polylines or polygons.
 * @param plane Knife.
 * @param keep Keep above, keep below, or keep both lists of separated points, polylines or polygons.
 * @returns List, or list of two lists, of points, polylines or polygons.
 * @example knife1 = isect.Knife ([p1,p2,p3,p4,p5], plane1, keepabove)
 * @example_info Returns [[p1,p2,p3],[p4,p5]] if p1, p2, p3 are points above the plane and p4, p5 are points below the plane.
 */
function Knife(__model__, geometry, plane, keep) {
    // --- Error Check ---
    // const fn_name = 'isect.Knife';
    // const ents_arr = checkIDs(__model__, fn_name, 'geometry', geometry, ['isIDList'], [EEntType.POINT, EEntType.PLINE, EEntType.PGON]);
    // checkCommTypes(fn_name, 'plane', plane, [TypeCheckObj.isPlane]);
    // --- Error Check ---
    throw new Error('Not implemented.');
    return null;
}
exports.Knife = Knife;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS25pZmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaXNlY3QvS25pZmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0E7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLFNBQWtCLEVBQUUsUUFBZSxFQUFFLEtBQWEsRUFBRSxJQUFpQjtJQUN2RixzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHNJQUFzSTtJQUN0SSxtRUFBbUU7SUFDbkUsc0JBQXNCO0lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUFDLE9BQU8sSUFBSSxDQUFDO0FBQ3JELENBQUM7QUFQRCxzQkFPQyJ9