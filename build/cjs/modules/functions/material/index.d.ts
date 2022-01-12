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
    __model__: GIModel;
    __enum__: {
        _ESide: typeof Enum._ESide;
        _Ecolors: typeof Enum._Ecolors;
        _ELineMaterialType: typeof Enum._ELineMaterialType;
        _EMeshMaterialType: typeof Enum._EMeshMaterialType;
    };
    constructor(model: GIModel);
    Set(entities: any, material: any): any;
    LineMat(name: any, color: any, dash_gap_scale: any, select_vert_colors: any): any;
    MeshMat(name: any, color: any, opacity: any, select_side: any, select_vert_colors: any): any;
    Glass(name: any, opacity: any): any;
    Lambert(name: any, emissive: any): any;
    Phong(name: any, emissive: any, specular: any, shininess: any): any;
    Standard(name: any, emissive: any, roughness: any, metalness: any): any;
    Physical(name: any, emissive: any, roughness: any, metalness: any, reflectivity: any): any;
}
