#!/usr/bin/env node

var cartero = require( '../' );
var minimist = require( 'minimist' );
var path = require( 'path' );
var fs = require( 'fs' );

/* Note: This is hasn't been tested yet. */

var argv = minimist( process.argv.slice(2),
	{
		alias : {
			keepSeparate : 's',
			maps : 'm',
			watch : 'w',
			transform : 't',
			transformDirs : 'd',
			postProcessor : 'p',
			outputDirUrl : 'u',
			help : 'h'
		},
		boolean : [ 'keepSeparate', 'watch', 'help', 'maps' ]
	}
);

if( argv.help ) {
	return fs.createReadStream( __dirname + '/help.txt' ).pipe( process.stdout ).on( 'close', function() {
		process.exit( 0 );
	} );
}

var viewDirPath = argv._[0];
var outputDirPath = argv._[1];

if( viewDirPath === undefined || outputDirPath === undefined ) {
	console.log( 'Both a viewDir and an outputDir are required' );
	process.exit( 1 );
}

viewDirPath = resolvePath( viewDirPath );
outputDirPath = resolvePath( outputDirPath );

var watch = argv.watch;

var appTransformDirs = argv.transformDirs;
var appTransforms = argv.transform;
if( typeof appTransformDirs === 'string' ) appTransformDirs = [ appTransformDirs ];
if( typeof appTransforms === 'string' ) appTransforms = [ appTransforms ];
var carteroOptions = {
	keepSeparate : argv.keepSeparate,
	sourceMaps : argv.maps,
	watch : watch,
	appTransforms : appTransforms,
	appTransformDirs : appTransformDirs,
	outputDirUrl : argv.outputDirUrl,
	packageTransform : argv.packageTransform,
	postProcessors : argv.postProcessor
};

var c = cartero( viewDirPath, outputDirPath, carteroOptions );

c.on( 'error', function( err ) {
	console.log( err.stack );
	process.exit( 1 );
} );

c.on( "done", function() {
	if( ! watch )
		process.exit( 0 );
} );

function resolvePath( inputPath ) {
	return inputPath ? path.resolve( inputPath ) : inputPath;
}
