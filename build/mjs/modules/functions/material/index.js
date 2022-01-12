import * as Enum from './_enum';
import { Glass } from './Glass';
import { Lambert } from './Lambert';
import { LineMat } from './LineMat';
import { MeshMat } from './MeshMat';
import { Phong } from './Phong';
import { Physical } from './Physical';
import { Set } from './Set';
import { Standard } from './Standard';
export { Set };
export { LineMat };
export { MeshMat };
export { Glass };
export { Lambert };
export { Phong };
export { Standard };
export { Physical };
export class MaterialFunc {
    constructor(model) {
        this.__enum__ = {
            ...Enum
        };
        this.__model__ = model;
    }
    Set(entities, material) {
        return Set(this.__model__, entities, material);
    }
    LineMat(name, color, dash_gap_scale, select_vert_colors) {
        return LineMat(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name, color, opacity, select_side, select_vert_colors) {
        return MeshMat(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Glass(name, opacity) {
        return Glass(this.__model__, name, opacity);
    }
    Lambert(name, emissive) {
        return Lambert(this.__model__, name, emissive);
    }
    Phong(name, emissive, specular, shininess) {
        return Phong(this.__model__, name, emissive, specular, shininess);
    }
    Standard(name, emissive, roughness, metalness) {
        return Standard(this.__model__, name, emissive, roughness, metalness);
    }
    Physical(name, emissive, roughness, metalness, reflectivity) {
        return Physical(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvbWF0ZXJpYWwvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxLQUFLLElBQUksTUFBTSxTQUFTLENBQUM7QUFDaEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUM1QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXRDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNmLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUNuQixPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDbkIsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUNuQixPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDakIsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUNwQixNQUFNLE9BQU8sWUFBWTtJQUtyQixZQUFZLEtBQWM7UUFIMUIsYUFBUSxHQUFHO1lBQ1AsR0FBRyxJQUFJO1NBQ1YsQ0FBQTtRQUVHLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVE7UUFDbEIsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxrQkFBa0I7UUFDbkQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFDRCxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGtCQUFrQjtRQUN6RCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU87UUFDZixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRO1FBQ2xCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUztRQUNyQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUztRQUN6QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVk7UUFDdkQsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDeEYsQ0FBQztDQUNKIn0=