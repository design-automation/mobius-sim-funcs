import { GIMetaData, LONGLAT } from '@design-automation/mobius-sim';
import { __clone__, __merge__, __new__ } from './_model';
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
    return: '_output.Return',
    asyncFuncs: [
        'util.ModelCompare',
        'util.ModelMerge',
        'io.Write', 'io.Read',
        'io.Import', 'io.Export',
        'util.HTTPRequest'
    ],
    // longitude latitude in Singapore, NUS
    LONGLAT: LONGLAT,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3BhcmFtZXRlclR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZGVsX2FwaS9fcGFyYW1ldGVyVHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVwRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFekQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHO0lBQzNCLFVBQVU7SUFDVixPQUFPLEVBQUUsVUFBVTtJQUVuQixTQUFTLEVBQUUsZUFBZTtJQUMxQixLQUFLLEVBQUUsV0FBVztJQUNsQixLQUFLLEVBQUUsV0FBVztJQUNsQixPQUFPLEVBQUUsYUFBYTtJQUN0QixRQUFRLEVBQUUsY0FBYztJQUV4QixHQUFHLEVBQUUsZ0JBQWdCO0lBQ3JCLEtBQUssRUFBRSxrQkFBa0I7SUFFekIsS0FBSyxFQUFFLE9BQU87SUFDZCxPQUFPLEVBQUUsU0FBUztJQUNsQixPQUFPLEVBQUUsU0FBUztJQUVsQixPQUFPLEVBQUUsa0JBQWtCO0lBRTNCLFVBQVUsRUFBRSx1QkFBdUI7SUFDbkMsV0FBVyxFQUFFLHdCQUF3QjtJQUVyQyxTQUFTLEVBQUUsWUFBWTtJQUN2QixTQUFTLEVBQUUsWUFBWTtJQUN2QixRQUFRLEVBQUUsV0FBVztJQUNyQixXQUFXLEVBQUUsY0FBYztJQUUzQixNQUFNLEVBQUUsbUJBQW1CO0lBRTNCLE1BQU0sRUFBRSxnQkFBZ0I7SUFFeEIsVUFBVSxFQUFFO1FBQ1IsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixVQUFVLEVBQUUsU0FBUztRQUNyQixXQUFXLEVBQUUsV0FBVztRQUN4QixrQkFBa0I7S0FDckI7SUFFRCx1Q0FBdUM7SUFDdkMsT0FBTyxFQUFFLE9BQU87Q0FDbkIsQ0FBQyJ9