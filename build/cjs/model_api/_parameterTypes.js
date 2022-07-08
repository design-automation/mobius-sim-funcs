"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parameterTypes = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _model_1 = require("./_model");
exports._parameterTypes = {
    // classes
    newMeta: mobius_sim_1.GIMetaData,
    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    console: '__console__',
    fileName: '__fileName__',
    new: '_model.__new__',
    merge: '_model.__merge__',
    newFn: _model_1.__new__,
    mergeFn: _model_1.__merge__,
    cloneFn: _model_1.__clone__,
    addData: '_model.addGiData',
    preprocess: '_model.__preprocess__',
    postprocess: '_model.__postprocess__',
    setattrib: 'attrib.Set',
    getattrib: 'attrib.Get',
    queryGet: 'query.Get',
    queryFilter: 'query.Filter',
    select: '_model.__select__',
    return: '_output.Return',
    asyncFuncs: [
        'util.ModelCompare',
        'util.ModelMerge',
        'io.Write', 'io.Read',
        'io.Import', 'io.Export',
        'util.HTTPRequest'
    ],
    // longitude latitude in Singapore, NUS
    LONGLAT: mobius_sim_1.LONGLAT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3BhcmFtZXRlclR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZGVsX2FwaS9fcGFyYW1ldGVyVHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW9FO0FBRXBFLHFDQUF5RDtBQUU1QyxRQUFBLGVBQWUsR0FBRztJQUMzQixVQUFVO0lBQ1YsT0FBTyxFQUFFLHVCQUFVO0lBRW5CLFNBQVMsRUFBRSxlQUFlO0lBQzFCLEtBQUssRUFBRSxXQUFXO0lBQ2xCLEtBQUssRUFBRSxXQUFXO0lBQ2xCLE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFFBQVEsRUFBRSxjQUFjO0lBRXhCLEdBQUcsRUFBRSxnQkFBZ0I7SUFDckIsS0FBSyxFQUFFLGtCQUFrQjtJQUV6QixLQUFLLEVBQUUsZ0JBQU87SUFDZCxPQUFPLEVBQUUsa0JBQVM7SUFDbEIsT0FBTyxFQUFFLGtCQUFTO0lBRWxCLE9BQU8sRUFBRSxrQkFBa0I7SUFFM0IsVUFBVSxFQUFFLHVCQUF1QjtJQUNuQyxXQUFXLEVBQUUsd0JBQXdCO0lBRXJDLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLFFBQVEsRUFBRSxXQUFXO0lBQ3JCLFdBQVcsRUFBRSxjQUFjO0lBRTNCLE1BQU0sRUFBRSxtQkFBbUI7SUFFM0IsTUFBTSxFQUFFLGdCQUFnQjtJQUV4QixVQUFVLEVBQUU7UUFDUixtQkFBbUI7UUFDbkIsaUJBQWlCO1FBQ2pCLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLFdBQVcsRUFBRSxXQUFXO1FBQ3hCLGtCQUFrQjtLQUNyQjtJQUVELHVDQUF1QztJQUN2QyxPQUFPLEVBQUUsb0JBQU87Q0FDbkIsQ0FBQyJ9