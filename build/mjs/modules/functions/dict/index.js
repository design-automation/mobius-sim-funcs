import { Add } from './Add';
import { Remove } from './Remove';
import { Replace } from './Replace';
export { Add };
export { Remove };
export { Replace };
export class DictFunc {
    constructor() {
    }
    Add(dict, keys, values) {
        return Add(dict, keys, values);
    }
    Remove(dict, keys) {
        return Remove(dict, keys);
    }
    Replace(dict, old_keys, new_keys) {
        return Replace(dict, old_keys, new_keys);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvZGljdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQzVCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVwQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZixPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDbEIsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBRW5CLE1BQU0sT0FBTyxRQUFRO0lBQ2pCO0lBQ0EsQ0FBQztJQUNELEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU07UUFDbEIsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJO1FBQ2IsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQzVCLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNKIn0=