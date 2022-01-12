declare global {
    interface Navigator {
        webkitPersistentStorage: {
            requestQuota: (a: any, b: any, c: any) => {};
        };
    }
}
export declare function _getFile(source: string): Promise<any>;
export declare function _Async_Param__getFile(source: string): void;
