"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Async_Param__getFile = exports._getFile = void 0;
/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
const jszip_1 = require("jszip");
/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota
function getURLContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        url = url.replace('http://', 'https://');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        if (url[0] === '"' || url[0] === '\'') {
            url = url.substring(1);
        }
        if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
            url = url.substring(0, url.length - 1);
        }
        const p = new Promise((resolve) => {
            const fetchObj = fetch(url);
            fetchObj.catch(err => {
                resolve('HTTP Request Error: Unable to retrieve file from ' + url);
            });
            fetchObj.then(res => {
                if (!res.ok) {
                    resolve('HTTP Request Error: Unable to retrieve file from ' + url);
                    return '';
                }
                if (url.indexOf('.zip') !== -1) {
                    res.blob().then(body => resolve(body));
                }
                else {
                    res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
                }
            });
        });
        return yield p;
    });
}
function openZipFile(zipFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {};
        yield (0, jszip_1.loadAsync)(zipFile.arrayBuffer()).then(function (zip) {
            return __awaiter(this, void 0, void 0, function* () {
                for (const filename of Object.keys(zip.files)) {
                    // const splittedNames = filename.split('/').slice(1).join('/');
                    yield zip.files[filename].async('text').then(function (fileData) {
                        result[filename] = fileData;
                    });
                }
            });
        });
        return result;
    });
}
function loadFromFileSystem(filecode) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = new Promise((resolve) => {
            navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
                // @ts-ignore
                window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function (fs) {
                    fs.root.getFile(filecode, {}, function (fileEntry) {
                        fileEntry.file((file) => {
                            const reader = new FileReader();
                            reader.onerror = () => {
                                resolve('error');
                            };
                            reader.onloadend = () => {
                                if ((typeof reader.result) === 'string') {
                                    resolve(reader.result.split('_|_|_')[0]);
                                    // const splitted = (<string>reader.result).split('_|_|_');
                                    // let val = splitted[0];
                                    // for (const i of splitted) {
                                    //     if (val.length < i.length) {
                                    //         val = i;
                                    //     }
                                    // }
                                    // resolve(val);
                                }
                                else {
                                    resolve(reader.result);
                                }
                            };
                            reader.readAsText(file, 'text/plain;charset=utf-8');
                        });
                    });
                });
            }, function (e) { console.log('Error', e); });
        });
        return yield p;
    });
}
function _getFile(source) {
    return __awaiter(this, void 0, void 0, function* () {
        if (source.startsWith('__model_data__')) {
            return source.substring(14);
        }
        else if (source.indexOf('://') !== -1) {
            const val = source.replace(/ /g, '');
            const result = yield getURLContent(val);
            if (result === undefined) {
                return source;
            }
            else if (result.indexOf && result.indexOf('HTTP Request Error') !== -1) {
                throw new Error(result);
            }
            else if (val.indexOf('.zip') !== -1) {
                return yield openZipFile(result);
            }
            else {
                return result;
            }
        }
        else {
            if (source.length > 1 && source[0] === '{') {
                return source;
            }
            const val = source.replace(/\"|\'/g, '');
            const backup_list = JSON.parse(localStorage.getItem('mobius_backup_list'));
            if (val.endsWith('.zip')) {
                throw (new Error(`Importing zip files from local storage is not supported`));
            }
            if (val.indexOf('*') !== -1) {
                const splittedVal = val.split('*');
                const start = splittedVal[0] === '' ? null : splittedVal[0];
                const end = splittedVal[1] === '' ? null : splittedVal[1];
                let result = '{';
                for (const backup_name of backup_list) {
                    let valid_check = true;
                    if (start && !backup_name.startsWith(start)) {
                        valid_check = false;
                    }
                    if (end && !backup_name.endsWith(end)) {
                        valid_check = false;
                    }
                    if (valid_check) {
                        const backup_file = yield loadFromFileSystem(backup_name);
                        result += `"${backup_name}": \`${backup_file.replace(/\\/g, '\\\\')}\`,`;
                    }
                }
                result += '}';
                return result;
            }
            else {
                if (backup_list.indexOf(val) !== -1) {
                    const result = yield loadFromFileSystem(val);
                    if (!result || result === 'error') {
                        throw (new Error(`File named ${val} does not exist in the local storage`));
                        // return source;
                    }
                    else {
                        return result;
                    }
                }
                else {
                    throw (new Error(`File named ${val} does not exist in the local storage`));
                }
            }
        }
    });
}
exports._getFile = _getFile;
function _Async_Param__getFile(source) {
}
exports._Async_Param__getFile = _Async_Param__getFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2dldEZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9mdW5jdGlvbnMvaW8vX2dldEZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsaUNBQWtDO0FBR2xDOzs7R0FHRztBQUVGLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsNkJBQTZCO0FBWXhFLFNBQWUsYUFBYSxDQUFDLEdBQVc7O1FBQ3BDLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDL0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDMUQ7UUFDRCxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNuQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM3RCxHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxQztRQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7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