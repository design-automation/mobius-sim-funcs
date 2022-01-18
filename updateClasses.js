var fs = require('fs');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var DIR = "./build/mjs/modules/functions";
var MODDIR = "./src/modules/functions";


const class_template = `// CLASS DEFINITION
export class __class_name__ {
__enum_string__
__model__string__
__functions_string__
}
`
const enum_template = `    __enum__ = {
        ...Enum
    }
`
const model_template = `    __model__: GIModel;
    constructor(model: GIModel) {
        this.__model__ = model;
    }
`
const func_template = `    __func_name__(__params1__): __returnType__ {
        __return__ __func_name__(__params2__);
    }
`
const async_template = `    async __func_name__(__params1__): Promise<__returnType__> {
        __return__ __func_name__(__params2__);
    }
`

// todo: bug fix for defaults
function extract_params(funcString){
    const splitted = funcString.split(/\(|\)\:|,/)
    const params1 = [];
    const params2 = [];
    for (let i = 1; i < splitted.length - 1; i++) {
        const pSplit = splitted[i].split(':');
        if (pSplit.length === 1) { continue; }
        const p = splitted[i].split(':')[0].trim()
        if (p === '__model__') {
            params2.push('this.__model__')
            continue
        }
        params1.push(p)
        params2.push(p)
    }
    const result = {
        funcName: splitted[0].trim(), 
        return: splitted[splitted.length-1].trim(),
        params1: params1,
        params2: params2,
        async: false
    }
    if(result.return.indexOf('Promise') !== -1) {
        result.async = true;
    }
    return result
}


// Loop through all the files in the temp directory
fs.readdir(DIR, function (err, folders) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
    for (const folder of folders) {
        if (folder.indexOf('.') !== -1 || folder.startsWith('_')) {
            continue; // Skip
        }
        let indexF = fs.readFileSync(`${MODDIR}/${folder}/index.ts`, {encoding:'utf8', flag:'r'});
        fs.readdir(DIR + '/' + folder, function (err, files) {
            // assemble each function string
            let allFuncString = '';
            for (const file of files) {
                if (!file.endsWith('.d.ts') || file.startsWith('_') || file === 'index.ts') {
                    continue; // Skip
                }
                const f = fs.readFileSync(`${DIR}/${folder}/${file}`, {encoding:'utf8', flag:'r'});
                const fSplitted = f.split(/export declare function /)
                for (let i = 1; i < fSplitted.length; i ++) {
                    if (fSplitted[i].trim().startsWith('_')) { continue; }

                    const extracted = extract_params(fSplitted[i].split('\n')[0].trim().slice(0, -1))
                    let funcstring = extracted.async? async_template : func_template;
                    funcstring = funcstring.replace(/__func_name__/g, extracted.funcName)
                    funcstring = funcstring.replace('__params1__', extracted.params1.join(', '))
                    funcstring = funcstring.replace('__params2__', extracted.params2.join(', '))
                    if (extracted.return.indexOf('void') !== -1) {
                        funcstring = funcstring.replace('__return__ ', '')
                        funcstring = funcstring.replace('__returnType__', 'void')
                    } else {
                        funcstring = funcstring.replace('__return__', 'return')
                        funcstring = funcstring.replace('__returnType__', 'any')
                    }
                    allFuncString += funcstring;
                }
            }
            // assemble class string and write
            let classString = class_template;
            classString = classString.replace('__class_name__', folder.charAt(0).toUpperCase() + folder.slice(1) + 'Func')
            if (indexF.indexOf('import * as Enum') !== -1) {
                classString = classString.replace('__enum_string__', enum_template)
            } else {
                classString = classString.replace('__enum_string__', '')
            }
            if (folder === 'dict' || folder === 'list') {
                classString = classString.replace('__model__string__\n', '')
            } else {
                classString = classString.replace('__model__string__\n', model_template)
            }
            classString = classString.replace('__functions_string__', allFuncString)
            const newString = indexF.split('// CLASS DEFINITION')[0] + classString
            fs.writeFile(`${MODDIR}/${folder}/index.ts`, newString, () => {})
        })
    }
});
