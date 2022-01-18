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
export declare class MaterialFunc {
    __enum__: {
        /**
         * The `material` module has functions for defining materials.
         * The material definitions are saved as attributes at the model level.
         * For more informtion, see the threejs docs: https://threejs.org/
         * @module
         */
        _ESide: typeof Enum._ESide;
        _Ecolors: typeof Enum._Ecolors;
        _ELineMaterialType: typeof Enum._ELineMaterialType;
        _EMeshMaterialType: typeof Enum._EMeshMaterialType;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Glass(name: any, opacity: any): void;
    Lambert(name: any, emissive: any): void;
    LineMat(name: any, color: any, dash_gap_scale: any, select_vert_colors: any): void;
    MeshMat(name: any, color: any, opacity: any, select_side: any, select_vert_colors: any): void;
    Phong(name: any, emissive: any, specular: any, shininess: any): void;
    Physical(name: any, emissive: any, roughness: any, metalness: any, reflectivity: any): void;
    Set(entities: any, material: any): void;
    Standard(name: any, emissive: any, roughness: any, metalness: any): void;
}
