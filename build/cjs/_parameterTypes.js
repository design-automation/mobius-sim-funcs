"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parameterTypes = void 0;
const mobius_sim_1 = require("@design-automation/mobius-sim");
const _model_1 = require("./modules/_model");
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
        'io.Import', 'io.Export'
    ],
    // longitude latitude in Singapore, NUS
    LONGLAT: mobius_sim_1.LONGLAT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3BhcmFtZXRlclR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL19wYXJhbWV0ZXJUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBb0U7QUFFcEUsNkNBQWlFO0FBRXBELFFBQUEsZUFBZSxHQUFHO0lBQzNCLFVBQVU7SUFDVixPQUFPLEVBQUUsdUJBQVU7SUFFbkIsU0FBUyxFQUFFLGVBQWU7SUFDMUIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsUUFBUSxFQUFFLGNBQWM7SUFFeEIsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixLQUFLLEVBQUUsa0JBQWtCO0lBRXpCLEtBQUssRUFBRSxnQkFBTztJQUNkLE9BQU8sRUFBRSxrQkFBUztJQUNsQixPQUFPLEVBQUUsa0JBQVM7SUFFbEIsT0FBTyxFQUFFLGtCQUFrQjtJQUUzQixVQUFVLEVBQUUsdUJBQXVCO0lBQ25DLFdBQVcsRUFBRSx3QkFBd0I7SUFFckMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsU0FBUyxFQUFFLFlBQVk7SUFDdkIsUUFBUSxFQUFFLFdBQVc7SUFDckIsV0FBVyxFQUFFLGNBQWM7SUFFM0IsTUFBTSxFQUFFLG1CQUFtQjtJQUUzQixNQUFNLEVBQUUsZ0JBQWdCO0lBRXhCLFVBQVUsRUFBRTtRQUNSLG1CQUFtQjtRQUNuQixpQkFBaUI7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsV0FBVyxFQUFFLFdBQVc7S0FDM0I7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxFQUFFLG9CQUFPO0NBQ25CLENBQUMifQ==