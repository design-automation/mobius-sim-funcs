/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the threejs docs: https://threejs.org/
 * @module
 */
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

// CLASS DEFINITION
export class MaterialFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Glass(name, opacity): Promise<void> {
        Glass(this.__model__, name, opacity);
    }
    async Lambert(name, emissive): Promise<void> {
        Lambert(this.__model__, name, emissive);
    }
    async LineMat(name, color, dash_gap_scale, select_vert_colors): Promise<void> {
        LineMat(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    async MeshMat(name, color, opacity, select_side, select_vert_colors): Promise<void> {
        MeshMat(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    async Phong(name, emissive, specular, shininess): Promise<void> {
        Phong(this.__model__, name, emissive, specular, shininess);
    }
    async Physical(name, emissive, roughness, metalness, reflectivity): Promise<void> {
        Physical(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
    async Set(entities, material): Promise<void> {
        Set(this.__model__, entities, material);
    }
    async Standard(name, emissive, roughness, metalness): Promise<void> {
        Standard(this.__model__, name, emissive, roughness, metalness);
    }

}
