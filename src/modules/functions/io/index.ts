/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel, Txy } from '@design-automation/mobius-sim';

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


    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Export(entities: string | string[] | string[][], file_name: string, data_format: Enum._EIOExportDataFormat, data_target: Enum._EIODataTarget) {
        await Export(this.__model__, entities, file_name, data_format, data_target);
    }
    async ExportData(entities: string | string[] | string[][], data_format: Enum._EIOExportDataFormat): Promise<any> {
        return await ExportData(this.__model__, entities, data_format);
    }
    Geoalign(lat_long_o: Txy, lat_long_x: Txy, elev: number): void {
        Geoalign(this.__model__, lat_long_o, lat_long_x, elev);
    }
    Geolocate(lat_long: Txy, rot: number, elev: number): void {
        Geolocate(this.__model__, lat_long, rot, elev);
    }
    async Import(data_url: string, data_format: Enum._EIOImportDataFormat): Promise<any> {
        return await Import(this.__model__, data_url, data_format);
    }
    ImportData(model_data: string, data_format: Enum._EIOImportDataFormat): any {
        return ImportData(this.__model__, model_data, data_format);
    }
    LatLong2XYZ(lat_long: Txy, elev: number): any {
        return LatLong2XYZ(this.__model__, lat_long, elev);
    }
    async Read(data: string): Promise<any> {
        return await Read(this.__model__, data);
    }
    async Write(data: string, file_name: string, data_target: Enum._EIODataTarget): Promise<any> {
        return await Write(this.__model__, data, file_name, data_target);
    }

}
