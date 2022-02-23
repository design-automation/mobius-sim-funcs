var fs = require('fs');
var path = require('path');

const MOBIUS_LOCATION = 'C:\\Users\\akibdpt\\Documents\\Angular\\mobius-parametric-modeller-dev-0-9'

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

const to = path.join(
    MOBIUS_LOCATION,
    'node_modules\\@design-automation\\mobius-sim-funcs'
);
fs.rmSync(path.join(to, 'build'), { recursive: true, force: true });
fs.rmSync(path.join(to, 'src'), { recursive: true, force: true });
fs.rmSync(path.join(to, 'typedoc-json'), { recursive: true, force: true });
copyFolderRecursiveSync(path.join(process.cwd(),'build'), to)
copyFolderRecursiveSync(path.join(process.cwd(),'src'), to)
copyFolderRecursiveSync(path.join(process.cwd(),'typedoc-json'), to)
