import { SIMFuncs } from '../../../index'
// DUMMY TEST CASES
const sf = new SIMFuncs();

const posis1 = sf.pattern.Rectangle([0,0,0], 5)
const pgon1 = sf.make.Polygon(posis1)

const info = sf.util.EntityInfo(pgon1)

test('PARAMINFO PLACEHOLDER TEST', () => {
    //@ts-ignore
    expect(info).toStrictEqual(
    "<h4>Entity Information:</h4>"+
    "<ul><li>Type: <b>Polygon</b></li>"+
    "<ul>"+
    "<li>Attribs: _ts</li>"+
    "<li>Num verts: 4</li>"+
    "<li>Num edges: 4</li>"+
    "<li>Num wires: 1</li>"+
    "</ul></ul>"
    );
}); 


// import { SIMFuncs } from '../../../index'
// import { ProcedureTypes } from "@models/procedure";
// import { InputType } from "@models/port";

// const sf = new SIMFuncs();

// const newParamBlank = {
//     type: ProcedureTypes.Constant,
//     ID: 'parameters_blank',
//     parent: undefined,
//     meta: {
//         description: '',
//         inputMode: InputType.Constant,
//         module: 'ParamBlank',
//         name: 'Param1',
//     },
//     children: undefined,
//     variable: undefined,
//     argCount: 0,
//     args: [],
//     print: false,
//     enabled: true,
//     selected: false,
//     terminate: false,
//     hasError: false
// };

// const pinfo = sf.util.ParamInfo({})
