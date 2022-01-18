/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { GIModel } from '@design-automation/mobius-sim';
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
export declare class IoFunc {
    __enum__: {
        /**
         * The `io` module has functions for importing and exporting.
         * @module
         */
        _EIOImportDataFormat: typeof Enum._EIOImportDataFormat;
        _EIODataSource: typeof Enum._EIODataSource;
        _EIODataTarget: typeof Enum._EIODataTarget;
        _EIOExportDataFormat: typeof Enum._EIOExportDataFormat;
    };
    __model__: GIModel;
    constructor(model: GIModel);
    Export(entities: any, file_name: any, data_format: any, data_target: any): Promise<void>;
    ExportData(entities: any, data_format: any): Promise<any>;
    Geoalign(lat_long_o: any, lat_long_x: any, elev: any): Promise<void>;
    Geolocate(lat_long: any, rot: any, elev: any): Promise<void>;
    Import(data_url: any, data_format: any): Promise<any>;
    ImportData(model_data: any, data_format: any): Promise<any>;
    LatLong2XYZ(lat_long: any, elev: any): Promise<any>;
    Read(data: any): Promise<any>;
    Write(data: any, file_name: any, data_target: any): Promise<any>;
}
