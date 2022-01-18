/**
 * The `dict` module has functions for working with dictionaries.
 * These functions have no direct link with the model, the are generic functions for manipulating dictionaries.
 * These functions neither make nor modify anything in the model.
 * In addition to these functions, there are also inline functions available for working with dictionaries.
 * @module
 */
import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';
export { Add };
export { Remove };
export { Replace };
// CLASS DEFINITION
export class DictFunc {
    Add(dict, keys, values) {
        Add(dict, keys, values);
    }
    Remove(dict, keys) {
        Remove(dict, keys);
    }
    Replace(dict, old_keys, new_keys) {
        Replace(dict, old_keys, new_keys);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZGljdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQzVCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZixPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDbEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBR25CLG1CQUFtQjtBQUNuQixNQUFNLE9BQU8sUUFBUTtJQUVqQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNO1FBQ2xCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUk7UUFDYixNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQzVCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FFSiJ9