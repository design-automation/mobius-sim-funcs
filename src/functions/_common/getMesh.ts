import { Sim, ENT_TYPE } from 'src/mobius_sim';
import * as THREE from 'three';
import { Txyz } from './consts';
// -------------------------------------------------------------------------------------------------
/**
 * Create a threejs mesh. Returns an array with two items:
 * - The threejs mesh.
 * - An array of pgon IDs, where array idx is the index of thr triangle
 * @param __model__ 
 * @param ents 
 * @returns 
 */
export function createSingleMeshBufTjs(__model__: Sim, ents: string[]): [THREE.Mesh, string[]] {
    // Note that for meshes, faces must be pointed towards the origin of the ray in order to be
    // detected; intersections of the ray passing through the back of a face will not be detected.
    // To raycast against both faces of an object, you'll want to set the material's side property
    // to THREE.DoubleSide.
    const mat_tjs: THREE.Material = new THREE.MeshBasicMaterial();
    mat_tjs.side = THREE.DoubleSide;
    // get all unique posis
    const posis_set: Set<string> = new Set();
    for (const ent of ents) {
        const posis: string[] = __model__.getEnts(ENT_TYPE.POSI, ent);
        posis.forEach( posi => posis_set.add(posi) );
    }
    // create a flat list of xyz coords
    const xyzs_flat: number[] = [];
    const posi_to_xyzs_map: Map<string, number> = new Map();
    const unique_posis: string[] = Array.from(posis_set);
    for (let i = 0; i < unique_posis.length; i++) {
        const posi: string = unique_posis[i];
        const xyz: Txyz = __model__.getPosiCoords(posi);
        xyzs_flat.push(...xyz);
        posi_to_xyzs_map.set(posi, i);
    }
    // get an array of all the pgons
    const pgons: string[] = [];
    for (const ent of ents) {
        switch (__model__.entType(ent)) {
            case ENT_TYPE.PGON:
                pgons.push(ent);
                break;
            default:
                const coll_pgons: string[] =
                    __model__.getEnts(ENT_TYPE.PGON, ent);
                coll_pgons.forEach( coll_pgon => pgons.push(coll_pgon) );
                break;
        }
    }
    // create data
    const tris_flat: number[] = [];
    const idx_to_pgon: string[] = [];
    let idx_tjs = 0;
    for (const pgon of pgons) {
        // create the tjs geometry
        const tris: string[] = __model__.getEnts(ENT_TYPE.TRI, pgon);
        // modeldata.geom.nav_tri.navPgonToTri(pgon);
        for (const tri of tris) {
            const tri_posis: string[] = __model__.getEnts(ENT_TYPE.POSI, tri);
            // modeldata.geom.nav_tri.navTriToPosi(tri);
            tris_flat.push( posi_to_xyzs_map.get( tri_posis[0]) );
            tris_flat.push( posi_to_xyzs_map.get( tri_posis[1]) );
            tris_flat.push( posi_to_xyzs_map.get( tri_posis[2]) );
            // add the index to the map
            idx_to_pgon[idx_tjs] = pgon;
            idx_tjs++;
        }
    }
    // create tjs mesh, assigning the material
    const geom_tjs = new THREE.BufferGeometry();
    geom_tjs.setIndex( tris_flat );
    geom_tjs.setAttribute( 'position', new THREE.Float32BufferAttribute( xyzs_flat, 3 ) );
    const mesh: THREE.Mesh = new THREE.Mesh(geom_tjs, mat_tjs);
    // return the mesh and a map tri_idx -> pgon_i
    return [mesh, idx_to_pgon];
}
// -------------------------------------------------------------------------------------------------