import { __new__, __merge__, __clone__ } from './modules/_model';
import { GIMetaData } from '@design-automation/mobius-sim/dist/geo-info/GIMetaData';
import { LONGLAT } from '@design-automation/mobius-sim/dist/geo-info/common';
export const _parameterTypes = {
    // classes
    newMeta: GIMetaData,
    constList: '__constList__',
    model: '__model__',
    input: '__input__',
    console: '__console__',
    fileName: '__fileName__',
    new: '_model.__new__',
    merge: '_model.__merge__',
    newFn: __new__,
    mergeFn: __merge__,
    cloneFn: __clone__,
    addData: '_model.addGiData',
    preprocess: '_model.__preprocess__',
    postprocess: '_model.__postprocess__',
    setattrib: 'attrib.Set',
    getattrib: 'attrib.Get',
    queryGet: 'query.Get',
    queryFilter: 'query.Filter',
    select: '_model.__select__',
    return: '_Output.Return',
    asyncFuncs: [
        'util.ModelCompare',
        'util.ModelMerge',
        'io.Write', 'io.Read',
        'io.Import', 'io.Export'
    ],
    // longitude latitude in Singapore, NUS
    LONGLAT: LONGLAT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3BhcmFtZXRlclR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL19wYXJhbWV0ZXJUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDcEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRTdFLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRztJQUMzQixVQUFVO0lBQ1YsT0FBTyxFQUFFLFVBQVU7SUFFbkIsU0FBUyxFQUFFLGVBQWU7SUFDMUIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsUUFBUSxFQUFFLGNBQWM7SUFFeEIsR0FBRyxFQUFFLGdCQUFnQjtJQUNyQixLQUFLLEVBQUUsa0JBQWtCO0lBRXpCLEtBQUssRUFBRSxPQUFPO0lBQ2QsT0FBTyxFQUFFLFNBQVM7SUFDbEIsT0FBTyxFQUFFLFNBQVM7SUFFbEIsT0FBTyxFQUFFLGtCQUFrQjtJQUUzQixVQUFVLEVBQUUsdUJBQXVCO0lBQ25DLFdBQVcsRUFBRSx3QkFBd0I7SUFFckMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsU0FBUyxFQUFFLFlBQVk7SUFDdkIsUUFBUSxFQUFFLFdBQVc7SUFDckIsV0FBVyxFQUFFLGNBQWM7SUFFM0IsTUFBTSxFQUFFLG1CQUFtQjtJQUUzQixNQUFNLEVBQUUsZ0JBQWdCO0lBRXhCLFVBQVUsRUFBRTtRQUNSLG1CQUFtQjtRQUNuQixpQkFBaUI7UUFDakIsVUFBVSxFQUFFLFNBQVM7UUFDckIsV0FBVyxFQUFFLFdBQVc7S0FDM0I7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxFQUFFLE9BQU87Q0FDbkIsQ0FBQyJ9