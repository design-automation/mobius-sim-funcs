import * as MobiusSIM from '@design-automation/mobius-sim';

import { Position } from '../make/Position';
import { Polyline } from '../make/Polyline';
import { ExportData } from './ExportData';
import { _EIOExportDataFormat } from './_enum';
import { _EClose } from '../make/_enum';

const Model = MobiusSIM.GIModel;
const model = new Model();

test('Make one line and export SIM', async () => {
    Polyline(model, Position(model, [[0, 0, 0],[10, 10, 0]]) as string[], _EClose.CLOSE);
    console.log(await ExportData(model, null, _EIOExportDataFormat.SIM))
    expect(await ExportData(model, null, _EIOExportDataFormat.SIM)).toBe(
        '{"type":"SIM","version":"0.1","geometry":{"num_posis":2,"points":[],"plines":[[0,1,0]],"pgons":[],"coll_pgons":[],"coll_plines":[],"coll_points":[],"coll_colls":[]},"attributes":{"posis":[{"name":"xyz","data_type":"list","values":[[0,0,0],[10,10,0]],"entities":[[0],[1]]}],"verts":[],"edges":[],"wires":[],"points":[],"plines":[],"pgons":[],"colls":[],"model":[]}}');
});