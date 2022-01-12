import { GIModel } from '@design-automation/mobius-sim';
import { Mirror } from './Mirror';
import { Move } from './Move';
import { Offset } from './Offset';
import { Remesh } from './Remesh';
import { Rotate } from './Rotate';
import { Scale } from './Scale';
import { XForm } from './XForm';
export { Move };
export { Rotate };
export { Scale };
export { Mirror };
export { XForm };
export { Offset };
export { Remesh };
export declare class ModifyFunc {
    __model__: GIModel;
    constructor(model: GIModel);
    Move(entities: any, vectors: any): any;
    Rotate(entities: any, ray: any, angle: any): any;
    Scale(entities: any, plane: any, scale: any): any;
    Mirror(entities: any, plane: any): any;
    XForm(entities: any, from_plane: any, to_plane: any): any;
    Offset(entities: any, dist: any): any;
    Remesh(entities: any): any;
}
