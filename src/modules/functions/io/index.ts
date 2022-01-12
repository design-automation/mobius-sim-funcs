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
export class IoFunc {
    __model__: GIModel;
    __enum__ = {
        ...Enum
    }
    constructor(model: GIModel) {
        this.__model__ = model;
    }
    async Read(data): Promise<any> {
        return Read(this.__model__, data);
    }
    async Write(data, file_name, data_target): Promise<any> {
        return Write(this.__model__, data, file_name, data_target);
    }
    ImportData(model_data, data_format): any {
        return ImportData(this.__model__, model_data, data_format);
    }
    async Import(input_data, data_format): Promise<any> {
        return Import(this.__model__, input_data, data_format);
    }
    async Export(entities, file_name, data_format, data_target): Promise<any> {
        return Export(this.__model__, entities, file_name, data_format, data_target);
    }
    Geolocate(lat_long, rot, elev): any {
        return Geolocate(this.__model__, lat_long, rot, elev);
    }
    Geoalign(lat_long_o, lat_long_x, elev): any {
        return Geoalign(this.__model__, lat_long_o, lat_long_x, elev);
    }
    LatLong2XYZ(lat_long, elev): any {
        return LatLong2XYZ(this.__model__, lat_long, elev);
    }
    _Async_Param_Read(data) {
        return null;
    }
    _Async_Param_Write(data, file_name, data_target) {
        return null;
    }
    _Async_Param_Import(input_data, data_format) {
        return null;
    }
    _Async_Param_Export(entities, file_name, data_format, data_target) {
    }
}
