"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const chk = __importStar(require("../../../_check_types"));
// ================================================================================================
/**
 * Get one or more collections from the model, given a name or list of names.
 * Collections with an attribute called 'name' and with a value that matches teh given vale will be returned.
 * \n
 * The value for name can include wildcards: '?' matches any single character and '*' matches any sequence of characters.
 * For example, 'coll?' will match 'coll1' and 'colla'. 'coll*' matches any name that starts with 'coll'.
 * \n
 * If a single collection is found, the collection will be returned as a single item (not a list).
 * This is a convenience so that there is no need to get the first item out of the returned list.
 * \n
 * If no collections are found, then an empty list is returned.
 * \n
 * @param __model__
 * @param names A name or list of names. May include wildcards, '?' and '*'.
 * @returns The collection, or a list of collections.
 */
function Get(__model__, names) {
    // --- Error Check ---
    if (__model__.debug) {
        const fn_name = 'collection.Get';
        chk.checkArgs(fn_name, 'names', names, [chk.isStr, chk.isStrL]);
    }
    // --- Error Check ---
    const colls_i = _get(__model__, names);
    if (colls_i.length === 0) {
        return []; // return an empty list
    }
    else if (colls_i.length === 1) {
        return (0, mobius_sim_1.idMake)(mobius_sim_1.EEntType.COLL, colls_i[0]);
    }
    return (0, mobius_sim_1.idsMakeFromIdxs)(mobius_sim_1.EEntType.COLL, colls_i);
    // return idsMake(colls_i.map(coll_i => [EEntType.COLL, coll_i]) as TEntTypeIdx[]) as TId[];
}
exports.Get = Get;
function _get(__model__, names) {
    if (!Array.isArray(names)) {
        // wildcards
        if (names.indexOf('*') !== -1 || names.indexOf('?') !== -1) {
            const reg_exp = new RegExp(names.replace('?', '\\w').replace('*', '\\w*'));
            const all_colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, mobius_sim_1.EEntType.COLL);
            const all_names = all_colls_i.map(coll_i => __model__.modeldata.attribs.get.getEntAttribVal(mobius_sim_1.EEntType.COLL, coll_i, mobius_sim_1.EAttribNames.COLL_NAME));
            const unique_names = Array.from(new Set(all_names));
            const match_names = [];
            for (const name1 of unique_names) {
                if (reg_exp.test(name1)) {
                    match_names.push(name1);
                }
            }
            return _get(__model__, match_names);
        }
        const colls_i = __model__.modeldata.geom.snapshot.getEnts(__model__.modeldata.active_ssid, mobius_sim_1.EEntType.COLL);
        const query_result = __model__.modeldata.attribs.query.filterByAttribs(mobius_sim_1.EEntType.COLL, colls_i, mobius_sim_1.EAttribNames.COLL_NAME, null, mobius_sim_1.EFilterOperatorTypes.IS_EQUAL, names);
        return query_result;
    }
    else {
        const all_colls_i = [];
        for (const name1 of names) {
            for (const coll_i of _get(__model__, name1)) {
                all_colls_i.push(coll_i);
            }
        }
        return all_colls_i;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZnVuY3Rpb25zL2NvbGxlY3Rpb24vR2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBUXVDO0FBRXZDLDJEQUE2QztBQUk3QyxtR0FBbUc7QUFDbkc7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLFNBQWtCLEVBQUUsS0FBc0I7SUFDMUQsc0JBQXNCO0lBQ3RCLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtRQUNqQixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztRQUNqQyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNuRTtJQUNELHNCQUFzQjtJQUN0QixNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7S0FDckM7U0FBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzdCLE9BQU8sSUFBQSxtQkFBTSxFQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBUSxDQUFDO0tBQ25EO0lBQ0QsT0FBTyxJQUFBLDRCQUFlLEVBQUMscUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFVLENBQUM7SUFDeEQsNEZBQTRGO0FBQ2hHLENBQUM7QUFmRCxrQkFlQztBQUNELFNBQVMsSUFBSSxDQUFDLFNBQWtCLEVBQUUsS0FBc0I7SUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkIsWUFBWTtRQUNaLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3hELE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzRSxNQUFNLFdBQVcsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEgsTUFBTSxTQUFTLEdBQWEsV0FBVyxDQUFDLEdBQUcsQ0FBRSxNQUFNLENBQUMsRUFBRSxDQUNsRCxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLHFCQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSx5QkFBWSxDQUFDLFNBQVMsQ0FBVyxDQUMzRyxDQUFDO1lBQ0YsTUFBTSxZQUFZLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzlELE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztZQUNqQyxLQUFLLE1BQU0sS0FBSyxJQUFJLFlBQVksRUFBRTtnQkFDOUIsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQUU7YUFDeEQ7WUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDdkM7UUFDRCxNQUFNLE9BQU8sR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEgsTUFBTSxZQUFZLEdBQWEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FDNUUscUJBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLHlCQUFZLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxpQ0FBb0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEcsT0FBTyxZQUFZLENBQUM7S0FDdkI7U0FBTTtRQUNILE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztRQUNqQyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssRUFBRTtZQUN2QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3pDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUI7U0FDSjtRQUNELE9BQU8sV0FBVyxDQUFDO0tBQ3RCO0FBQ0wsQ0FBQyJ9