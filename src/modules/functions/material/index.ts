/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the <a href="https://threejs.org/" target="_blank">threejs docs.</a> 
 * @module
 */
import { GIModel, TColor } from '@design-automation/mobius-sim';

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

    // Document Enums here
    __enum__ = {
        LineMat: {
            select_vert_colors: Enum._Ecolors
        },
        MeshMat: {
            select_side: Enum._ESide, select_vert_colors: Enum._Ecolors
        },
    };

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    Glass(name: string, opacity: number): void {
        Glass(this.__model__, name, opacity);
    }
    Lambert(name: string, emissive: TColor): void {
        Lambert(this.__model__, name, emissive);
    }
    LineMat(name: string, color: TColor, dash_gap_scale: number | number[], select_vert_colors: Enum._Ecolors): void {
        LineMat(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name: string, color: TColor, opacity: number, select_side: Enum._ESide, select_vert_colors: Enum._Ecolors): void {
        MeshMat(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Phong(name: string, emissive: TColor, specular: TColor, shininess: number): void {
        Phong(this.__model__, name, emissive, specular, shininess);
    }
    Physical(name: string, emissive: TColor, roughness: number, metalness: number, reflectivity: number): void {
        Physical(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
    Set(entities: string | string[], material: string | string[]): void {
        Set(this.__model__, entities, material);
    }
    Standard(name: string, emissive: TColor, roughness: number, metalness: number): void {
        Standard(this.__model__, name, emissive, roughness, metalness);
    }

}
