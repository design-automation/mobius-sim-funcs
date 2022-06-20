import {
    arrMakeFlat,
    download,
    ENT_TYPE,
    exportGeojson,
    exportGltf,
    exportPosiBasedObj,
    exportVertBasedObj,
    Sim,
    idsBreak,
    string,
    string,
} from '../../mobius_sim';

import { checkIDs, ID } from '../_common/_check_ids';
import { checkArgs, isStr, isStrL } from '../../_check_types';
import { _EIODataTarget, _EIOExportDataFormat } from './_enum';



const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota

// ================================================================================================
/**
 * Export data from the model as a file.
 * \n
 * If you export to your hard disk,
 * it will result in a popup in your browser, asking you to save the file.
 * \n
 * If you export to Local Storage, there will be no popup.
 * \n
 * @param __model__
 * @param entities (Optional) Entities to be exported. If null, the whole model will be exported.
 * @param file_name Name of the file as a string.
 * @param data_format Enum, the export file format: `'gi', 'sim', 'obj_v', 'obj_ps', 'geojson'` or `'gltf'`.
 * @param data_target Enum, where the data is to be exported to: `'Save to Hard Disk'` or `'Save to Local Storage'`.
 * @returns void
 * @example `io.Export (#pg, 'my\_model.obj', 'obj', 'Save to Hard Disk')`
 * @example_info Exports all the polygons in the model as an OBJ, saved to the hard disk.
 */
export async function Export(__model__: Sim, entities: string | string[] | string[][],
    file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget) {
    if (typeof localStorage === 'undefined') { return; }
    // --- Error Check ---
    const fn_name = 'io.Export';
    let ents_arr = null;
    if (this.debug) {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as string[];
            ents_arr = checkIDs(__model__, fn_name, 'entities', entities,
                [ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
        }
        checkArgs(fn_name, 'file_name', file_name, [isStr, isStrL]);
    } else {
        if (entities !== null) {
            entities = arrMakeFlat(entities) as string[];
            ents_arr = idsBreak(entities) as string[];
        }
    }
    // --- Error Check ---
    await _export(__model__, ents_arr, file_name, data_format, data_target);
}
export function _Async_Param_Export(__model__: Sim, entities: string | string[] | string[][],
    file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget) {
}
async function _export(__model__: Sim, ents_arr: string[],
    file_name: string, data_format: _EIOExportDataFormat, data_target: _EIODataTarget): Promise<boolean> {
    const ssid: number = __model__.modeldata.active_ssid;
    switch (data_format) {
        case _EIOExportDataFormat.GI:
            {
                let model_data = '';
                model_data = __model__.exportGI(ents_arr);
                // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
                model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
                // === save the file ===
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(model_data, file_name);
                }
                return await _saveResource(model_data, file_name);
            }
        case _EIOExportDataFormat.SIM:
        {
            let model_data = '';
            model_data = __model__.exportSIM(ents_arr);
            // gi_data = gi_data.replace(/\\\"/g, '\\\\\\"'); // TODO temporary fix
            model_data = model_data.replace(/\\/g, '\\\\\\'); // TODO temporary fix
            // === save the file ===
            if (data_target === _EIODataTarget.DEFAULT) {
                return download(model_data, file_name);
            }
            return await _saveResource(model_data, file_name);
        }
        case _EIOExportDataFormat.OBJ_VERT:
            {
                const obj_verts_data: string = exportVertBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_verts_data, file_name);
                }
                return await _saveResource(obj_verts_data, file_name);
            }
        case _EIOExportDataFormat.OBJ_POSI:
            {
                const obj_posis_data: string = exportPosiBasedObj(__model__, ents_arr, ssid);
                // obj_data = obj_data.replace(/#/g, '%23'); // TODO temporary fix
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(obj_posis_data, file_name);
                }
                return await _saveResource(obj_posis_data, file_name);
            }
        // case _EIOExportDataFormat.DAE:
        //     const dae_data: string = exportDae(__model__);
        //     // dae_data = dae_data.replace(/#/g, '%23'); // TODO temporary fix
        //     if (data_target === _EIODataTarget.DEFAULT) {
        //         return download(dae_data, file_name);
        //     }
        //     return await _saveResource(dae_data, file_name);
        //     break;
        case _EIOExportDataFormat.GEOJSON:
            {
                const geojson_data: string = exportGeojson(__model__, ents_arr, true, ssid); // flatten
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(geojson_data, file_name);
                }
                return await _saveResource(geojson_data, file_name);
            }
        case _EIOExportDataFormat.GLTF:
            {
                const gltf_data: string = await exportGltf(__model__, ents_arr, ssid);
                if (data_target === _EIODataTarget.DEFAULT) {
                    return download(gltf_data, file_name);
                }
                return await _saveResource(gltf_data, file_name);
            }
        default:
            throw new Error('Data type not recognised');
    }
}

// ================================================================================================
/**
 * Functions for saving and loading resources to file system.
 */

export async function _saveResource(file: string, name: string): Promise<boolean> {
    const itemstring = localStorage.getItem('mobius_backup_list');
    if (!itemstring) {
        localStorage.setItem('mobius_backup_list', `["${name}"]`);
        localStorage.setItem('mobius_backup_date_dict', `{ "${name}": "${(new Date()).toLocaleString()}"}`);
    } else {
        const items: string[] = JSON.parse(itemstring);
        let check = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item === name) {
                items.splice(i, 1);
                items.unshift(item);
                check = true;
                break;
            }
        }
        if (!check) {
            items.unshift(name);
            // if (items.length > 10) {
            //     const item = items.pop();
            //     localStorage.removeItem(item);
            // }
        }
        localStorage.setItem('mobius_backup_list', JSON.stringify(items));
        const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        itemDates[itemstring] = (new Date()).toLocaleString();
        localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
    }
    // window['_code__'] = name;
    // window['_file__'] = file;

    const exportPromise = new Promise( resolve => {
        function saveToFS(fs) {
            const code = name;
            // console.log(code)
            fs.root.getFile(code, { create: true }, function (fileEntry) {
                fileEntry.createWriter(async function (fileWriter) {
                    const bb = new Blob([file + '_|_|_'], { type: 'text/plain;charset=utf-8' });
                    await fileWriter.write(bb);
                    resolve('success')
                }, (e) => { resolve(e); });
            }, (e) => { resolve(e); });
        }
    
        navigator.webkitPersistentStorage.requestQuota(
            requestedBytes, function (grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, saveToFS,
                    function (e) { resolve(e); });
            }, function (e) { resolve(e); }
        );
    
    })
    const endmsg = await exportPromise;

    return true;
    // localStorage.setItem(code, file);
}
