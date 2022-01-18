/**
 * The `list` module has functions for working with lists of items.
 * These functions have no direct link with the model, the are generic functions for manipulating lists.
 * The functions are often used when manipulating lists of IDs of entities in the model.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also various inline functions available for working with lists.
 * @module
 */
import * as Enum from './_enum';
import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';
import { Sort } from './Sort';
import { Splice } from './Splice';
export { Add };
export { Remove };
export { Replace };
export { Sort };
export { Splice };
// CLASS DEFINITION
export class ListFunc {
    constructor() {
        this.__enum__ = {
            ...Enum
        };
    }
    Add(list, item, method) {
        Add(list, item, method);
    }
    Remove(list, item, method) {
        Remove(list, item, method);
    }
    Replace(list, old_item, new_item, method) {
        Replace(list, old_item, new_item, method);
    }
    Sort(list, method) {
        Sort(list, method);
    }
    Splice(list, index, num_to_remove, items_to_insert) {
        Splice(list, index, num_to_remove, items_to_insert);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbGlzdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFDaEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWxDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNmLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUNsQixPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDbkIsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ2hCLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUVsQixtQkFBbUI7QUFDbkIsTUFBTSxPQUFPLFFBQVE7SUFBckI7UUFDSSxhQUFRLEdBQUc7WUFDUCxHQUFHLElBQUk7U0FDVixDQUFBO0lBa0JMLENBQUM7SUFoQkcsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNsQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTTtRQUNyQixNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU07UUFDcEMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDYixJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsZUFBZTtRQUM5QyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUVKIn0=