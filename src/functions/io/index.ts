/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { ENT_TYPE, Sim } from '../../mobius_sim';
import { Txy } from '../_common/consts';

import { checkIDs, ID } from '../_common/_check_ids';
import * as chk from '../_common/_check_types';

import * as Enum from './_enum';
import { _getFile } from './_getFile';
import { Export } from './Export';
import { ExportData } from './ExportData';
import { Geoalign } from './Geoalign';
import { Geolocate } from './Geolocate';
import { Import } from './Import';
import { ImportData } from './ImportData';
import { LatLong2XYZ } from './LatLong2XYZ';
import { Read } from './Read';
import { Write } from './Write';
import { arrMakeFlat } from '@design-automation/mobius-sim';

export { Read };
export { Write };
export { ImportData };
export { Import };
export { Export };
export { ExportData };
export { Geolocate };
export { Geoalign };
export { LatLong2XYZ };
export { _getFile };

// CLASS DEFINITION
export class IoFunc {

    // Document Enums here
    __enum__ = {
        Export: {
            data_format: Enum._EIOExportDataFormat, data_target: Enum._EIODataTarget
        },
        ExportData: {
            data_format: Enum._EIOExportDataFormat
        },
        Import: {
            data_format: Enum._EIOImportDataFormat
        },
        ImportData: {
            data_format: Enum._EIOImportDataFormat
        },
        Write: {
            data_target: Enum._EIODataTarget
        },
    };


    public __model__: Sim;
    public debug: boolean;
    constructor(model: Sim, debug: boolean) {
        this.__model__ = model;
        this.debug = debug;
    }
    async Export(entities: string | string[] | string[][], file_name: string, data_format: Enum._EIOExportDataFormat, data_target: Enum._EIODataTarget) {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'io.Export';
            if (entities !== null) {
                entities = arrMakeFlat(entities) as string[];
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            }
            chk.checkArgs(fn_name, 'file_name', file_name, [chk.isStr, chk.isStrL]);
        } 
        // --- Error Check ---    
        await Export(this.__model__, entities, file_name, data_format, data_target);
    }
    async ExportData(entities: string | string[] | string[][], data_format: Enum._EIOExportDataFormat): Promise<any> {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'io.Export';
            if (entities !== null) {
                entities = arrMakeFlat(entities) as string[];
                checkIDs(this.__model__, fn_name, 'entities', entities,
                    [ID.isIDL1], [ENT_TYPE.PLINE, ENT_TYPE.PGON, ENT_TYPE.COLL]) as string[];
            }
        } 
        // --- Error Check ---    
        return await ExportData(this.__model__, entities, data_format);
    }
    Geoalign(lat_long_o: Txy, lat_long_x: Txy, elev: number): void {
        // --- Error Check ---
        const fn_name = 'io.Geoalign';
        if (this.debug) {
            chk.checkArgs(fn_name, 'lat_long_o', lat_long_o, [chk.isXY, chk.isNull]);
            chk.checkArgs(fn_name, 'lat_long_x', lat_long_x, [chk.isXY, chk.isNull]);
            chk.checkArgs(fn_name, 'elev', elev, [chk.isNum, chk.isNull]);
        }
        // --- Error Check ---    
        Geoalign(this.__model__, lat_long_o, lat_long_x, elev);
    }
    Geolocate(lat_long: Txy, rot: number, elev: number): void {
        // --- Error Check ---
        const fn_name = 'io.Geolocate';
        if (this.debug) {
            chk.checkArgs(fn_name, 'lat_long_o', lat_long, [chk.isXY, chk.isNull]);
            chk.checkArgs(fn_name, 'rot', elev, [chk.isNum, chk.isNull]);
            chk.checkArgs(fn_name, 'elev', elev, [chk.isNum, chk.isNull]);
        }
        // --- Error Check ---    
        Geolocate(this.__model__, lat_long, rot, elev);
    }
    async Import(data_url: string, data_format: Enum._EIOImportDataFormat): Promise<any> {
        return await Import(this.__model__, data_url, data_format);
    }
    ImportData(model_data: string, data_format: Enum._EIOImportDataFormat): any {
        return ImportData(this.__model__, model_data, data_format);
    }
    LatLong2XYZ(lat_long: Txy, elev: number): any {
        // --- Error Check ---
        if (this.debug) {
            const fn_name = 'util.LatLong2XYZ';
            chk.checkArgs(fn_name, 'lat_long', lat_long, [chk.isXY, chk.isNull]);
            chk.checkArgs(fn_name, 'elev', elev, [chk.isNum, chk.isNull]);
        }
        // --- Error Check ---    
        return LatLong2XYZ(this.__model__, lat_long, elev);
    }
    async Read(data: string): Promise<any> {
        return await Read(this.__model__, data);
    }
    async Write(data: string, file_name: string, data_target: Enum._EIODataTarget): Promise<any> {
        return await Write(this.__model__, data, file_name, data_target);
    }

}
