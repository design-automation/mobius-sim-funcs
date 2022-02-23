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

// CLASS DEFINITION
export class IoFunc {
    __enum__ = {
        ...Enum
    }

    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Export(entities, file_name, data_format, data_target) {
        await Export(this.__model__, entities, file_name, data_format, data_target);
    }
    async ExportData(entities, data_format): Promise<any> {
        return await ExportData(this.__model__, entities, data_format);
    }
    Geoalign(lat_long_o, lat_long_x, elev): void {
        Geoalign(this.__model__, lat_long_o, lat_long_x, elev);
    }
    Geolocate(lat_long, rot, elev): void {
        Geolocate(this.__model__, lat_long, rot, elev);
    }
    async Import(data_url, data_format): Promise<any> {
        return Import(this.__model__, data_url, data_format);
    }
    ImportData(model_data, data_format): any {
        return ImportData(this.__model__, model_data, data_format);
    }
    LatLong2XYZ(lat_long, elev): any {
        return LatLong2XYZ(this.__model__, lat_long, elev);
    }
    async Read(data): Promise<any> {
        return await Read(this.__model__, data);
    }
    async Write(data, file_name, data_target): Promise<any> {
        return await Write(this.__model__, data, file_name, data_target);
    }

}
