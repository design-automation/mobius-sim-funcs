import { GIModel } from '@design-automation/mobius-sim';

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
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Set(entities, material): any {
        return Set(this.__model__, entities, material);
    }
    LineMat(name, color, dash_gap_scale, select_vert_colors): any {
        return LineMat(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name, color, opacity, select_side, select_vert_colors): any {
        return MeshMat(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Glass(name, opacity): any {
        return Glass(this.__model__, name, opacity);
    }
    Lambert(name, emissive): any {
        return Lambert(this.__model__, name, emissive);
    }
    Phong(name, emissive, specular, shininess): any {
        return Phong(this.__model__, name, emissive, specular, shininess);
    }
    Standard(name, emissive, roughness, metalness): any {
        return Standard(this.__model__, name, emissive, roughness, metalness);
    }
    Physical(name, emissive, roughness, metalness, reflectivity): any {
        return Physical(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
}
