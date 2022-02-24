import * as MobiusSIM from '@design-automation/mobius-sim';

import { Position } from './Position';

const Model = MobiusSIM.GIModel;
const model = new Model();

test('Make one position', () => {
    expect(Position(model, [0, 0, 0])).toBe('ps0');
    expect(model.exportGI(null)).toBe('{"type":"GIJson","version":"0.7",' +
    '"geometry":{"num_posis":1,"verts":[],"tris":[],"edges":[],"wires":[' +
    '],"points":[],"plines":[],"pgons":[],"pgontris":[],"coll_pgons":[],' +
    '"coll_plines":[],"coll_points":[],"coll_childs":[],"selected":{}},"' +
    'attributes":{"posis":[{"name":"xyz","data_type":"list","data":[[[0,' +
    '0,0],[0]]]}],"verts":[],"edges":[],"wires":[],"points":[],"plines":' +
    '[],"pgons":[],"colls":[],"model":[]}}');
});

test('Make 3 positions in an array', () => {
    expect(Position(model, [[2, 3, 4], [1, 1, 1], [10, 20, 50]])).toStrictEqual(['ps1', 'ps2', 'ps3']);
    expect(model.exportGI(null)).toBe('{"type":"GIJson","version":"0.7",' +
    '"geometry":{"num_posis":4,"verts":[],"tris":[],"edges":[],"wires":[' +
    '],"points":[],"plines":[],"pgons":[],"pgontris":[],"coll_pgons":[],' +
    '"coll_plines":[],"coll_points":[],"coll_childs":[],"selected":{}},"' +
    'attributes":{"posis":[{"name":"xyz","data_type":"list","data":[[[0,' +
    '0,0],[0]],[[2,3,4],[1]],[[1,1,1],[2]],[[10,20,50],[3]]]}],"verts":[' +
    '],"edges":[],"wires":[],"points":[],"plines":[],"pgons":[],"colls":' +
    '[],"model":[]}}');
});

test('Make 3 positions in a nested array', () => {
    expect(Position(model, [[[2, 3, 5]], [[1, 5, 6], [2, 2, 2]]])).toStrictEqual([['ps4'], ['ps5', 'ps6']]);
    expect(model.exportGI(null)).toBe('{"type":"GIJson","version":"0.7",' +
    '"geometry":{"num_posis":7,"verts":[],"tris":[],"edges":[],"wires":[' +
    '],"points":[],"plines":[],"pgons":[],"pgontris":[],"coll_pgons":[],' +
    '"coll_plines":[],"coll_points":[],"coll_childs":[],"selected":{}},"' +
    'attributes":{"posis":[{"name":"xyz","data_type":"list","data":[[[0,' +
    '0,0],[0]],[[2,3,4],[1]],[[1,1,1],[2]],[[10,20,50],[3]],[[2,3,5],[4]' +
    '],[[1,5,6],[5]],[[2,2,2],[6]]]}],"verts":[],"edges":[],"wires":[],"' +
    'points":[],"plines":[],"pgons":[],"colls":[],"model":[]}}');
});

test('Make an existing position', () => {
    expect(Position(model, [0, 0, 0])).toStrictEqual('ps7');
    expect(model.exportGI(null)).toBe('{"type":"GIJson","version":"0.7",' +
    '"geometry":{"num_posis":8,"verts":[],"tris":[],"edges":[],"wires":[' +
    '],"points":[],"plines":[],"pgons":[],"pgontris":[],"coll_pgons":[],' +
    '"coll_plines":[],"coll_points":[],"coll_childs":[],"selected":{}},"' +
    'attributes":{"posis":[{"name":"xyz","data_type":"list","data":[[[0,' +
    '0,0],[0,7]],[[2,3,4],[1]],[[1,1,1],[2]],[[10,20,50],[3]],[[2,3,5],[' +
    '4]],[[1,5,6],[5]],[[2,2,2],[6]]]}],"verts":[],"edges":[],"wires":[]' +
    ',"points":[],"plines":[],"pgons":[],"colls":[],"model":[]}}');
});

test('Make an existing position with string -> Error', () => {
    function errorTest() {
        Position(model, <any>'[0,0,0]');
    }
    expect(errorTest).toThrow();
});


// expect(model.exportGI(null)).toBe('');
