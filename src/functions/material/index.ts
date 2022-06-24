/**
 * The `material` module has functions for defining materials.
 * The material definitions are saved as attributes at the model level.
 * For more informtion, see the <a href="https://threejs.org/" target="_blank">threejs docs.</a> 
 * @module
 */
import { Sim } from '../../mobius_sim';
import { TColor } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

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

    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    Glass(name: string, opacity: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.Glass';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
        }
        // --- Error Check ---    
        Glass(this.__model__, name, opacity);
    }
    Lambert(name: string, emissive: TColor): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.Lambert';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
        }
        // --- Error Check ---    
        Lambert(this.__model__, name, emissive);
    }
    LineMat(name: string, color: TColor, dash_gap_scale: number | number[], select_vert_colors: Enum._Ecolors): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.LineMat';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
            chk.checkArgs(fn_name, 'dash_gap_scale', dash_gap_scale, [chk.isNull, chk.isNum, chk.isNumL]);
        }
        // --- Error Check ---    
        LineMat(this.__model__, name, color, dash_gap_scale, select_vert_colors);
    }
    MeshMat(name: string, color: TColor, opacity: number, select_side: Enum._ESide, select_vert_colors: Enum._Ecolors): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.MeshMat';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'color', color, [chk.isColor]);
            chk.checkArgs(fn_name, 'opacity', opacity, [chk.isNum01]);
        }
        // --- Error Check ---    
        MeshMat(this.__model__, name, color, opacity, select_side, select_vert_colors);
    }
    Phong(name: string, emissive: TColor, specular: TColor, shininess: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.Phong';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
            chk.checkArgs(fn_name, 'specular', specular, [chk.isColor]);
            chk.checkArgs(fn_name, 'shininess', shininess, [chk.isNum]);
        }
        // --- Error Check ---    
        Phong(this.__model__, name, emissive, specular, shininess);
    }
    Physical(name: string, emissive: TColor, roughness: number, metalness: number, reflectivity: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.Physical';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
            chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
            chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
            chk.checkArgs(fn_name, 'reflectivity', reflectivity, [chk.isNum]);
        }
        // --- Error Check ---    
        Physical(this.__model__, name, emissive, roughness, metalness, reflectivity);
    }
    Set(entities: string | string[], material: string | string[]): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'matrial.Set';
            checkIDs(this.__model__, fn_name, 'entities', entities,
                [ID.isID, ID.isIDL1, ID.isIDL2], null) as string[];
            chk.checkArgs(fn_name, 'material', material, [chk.isStr, chk.isStrL]);
        } 
        // --- Error Check ---        
        Set(this.__model__, entities, material);
    }
    Standard(name: string, emissive: TColor, roughness: number, metalness: number): void {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'material.Standard';
            chk.checkArgs(fn_name, 'name', name, [chk.isStr]);
            chk.checkArgs(fn_name, 'emissive', emissive, [chk.isColor]);
            chk.checkArgs(fn_name, 'roughness', roughness, [chk.isNum]);
            chk.checkArgs(fn_name, 'metalness', metalness, [chk.isNum]);
        }
        // --- Error Check ---    
        Standard(this.__model__, name, emissive, roughness, metalness);
    }

}
