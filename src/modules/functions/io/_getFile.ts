/**
 * The `io` module has functions for importing and exporting.
 * @module
 */
import { loadAsync } from 'jszip';


/**
 * The `io` module has functions for importing and exporting.
 * @module
 */

 const requestedBytes = 1024 * 1024 * 200; // 200 MB local storage quota

 // ================================================================================================
 declare global {
     interface Navigator {
         webkitPersistentStorage: {
             requestQuota: (a, b, c) => {}
         };
     }
 }
 

async function getURLContent(url: string): Promise<any> {
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
            } else {
                res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
            }
        });

    });
    return await p;
}
async function openZipFile(zipFile) {
    const result = {};
    await loadAsync(zipFile.arrayBuffer()).then(async function (zip) {
        for (const filename of Object.keys(zip.files)) {
            // const splittedNames = filename.split('/').slice(1).join('/');
            await zip.files[filename].async('text').then(function (fileData) {
                result[filename] = fileData;
            });
        }
    });
    return result;
}
async function loadFromFileSystem(filecode): Promise<any> {
    const p = new Promise((resolve) => {
        navigator.webkitPersistentStorage.requestQuota(
            requestedBytes, function (grantedBytes) {
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
                                    resolve((<string>reader.result).split('_|_|_')[0]);
                                    // const splitted = (<string>reader.result).split('_|_|_');
                                    // let val = splitted[0];
                                    // for (const i of splitted) {
                                    //     if (val.length < i.length) {
                                    //         val = i;
                                    //     }
                                    // }
                                    // resolve(val);
                                } else {
                                    resolve(reader.result);
                                }
                            };
                            reader.readAsText(file, 'text/plain;charset=utf-8');
                        });
                    });
                });
            }, function (e) { console.log('Error', e); }
        );
    });
    return await p;
}
export async function _getFile(source: string) {
    if (source.startsWith('__model_data__')) {
        return source.substring(14);
    } else if (source.indexOf('://') !== -1) {
        const val = source.replace(/ /g, '');
        const result = await getURLContent(val);
        if (result === undefined) {
            return source;
        } else if (result.indexOf && result.indexOf('HTTP Request Error') !== -1) {
            throw new Error(result);
        } else if (val.indexOf('.zip') !== -1) {
            return await openZipFile(result);
        } else {
            return result;
        }
    } else {
        if (source.length > 1 && source[0] === '{') {
            return source;
        }
        const val = source.replace(/\"|\'/g, '');
        const backup_list: string[] = JSON.parse(localStorage.getItem('mobius_backup_list'));
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
                    const backup_file = await loadFromFileSystem(backup_name);
                    result += `"${backup_name}": \`${backup_file.replace(/\\/g, '\\\\')}\`,`;
                }
            }
            result += '}';
            return result;
        } else {
            if (backup_list.indexOf(val) !== -1) {
                const result = await loadFromFileSystem(val);
                if (!result || result === 'error') {
                    throw (new Error(`File named ${val} does not exist in the local storage`));
                    // return source;
                } else {
                    return result;
                }
            } else {
                throw (new Error(`File named ${val} does not exist in the local storage`));
            }
        }
    }
}
export function _Async_Param__getFile(source: string) {
}
