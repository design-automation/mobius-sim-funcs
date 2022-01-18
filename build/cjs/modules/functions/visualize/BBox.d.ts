import { GIModel, TBBox, TId } from '@design-automation/mobius-sim';
/**
 * Visualises a bounding box by adding geometry to the model.
 *
 * @param __model__
 * @param bboxes A list of lists.
 * @returns Entities, twelve polylines representing the box.
 * @example bbox1 = virtual.viBBox(position1, vector1, [0,1,0])
 * @example_info Creates a plane with position1 on it and normal = cross product of vector1 with y-axis.
 */
export declare function BBox(__model__: GIModel, bboxes: TBBox | TBBox): TId[];
