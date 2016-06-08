"use strict";

var 
 express = require("express"),
 path = require("path"),
 dust = require("dustjs-linkedin"),
 Readable = require("stream").Readable,
 fs = require("fs")
;

/* Load dust templates from disk after searching the cache and coming back
   empty-handed. This is used by dust.stream() below. */
dust.onLoad = function (filename, callback) {
	fs.readFile(filename, { encoding: "utf8" }, callback);
};

module.exports = function (spec) {
	var r = express.Router();

	r
	.use(express.static(path.join(__dirname, "assets")))
	.get("/", swaggerLandingPageRendererFactory(spec))
	;

	return r;
};

function swaggerLandingPageRendererFactory(spec) {
	return function (req, res) {
		return readSchemaFile(spec, function (err, spec) {
			if (err) {
				console.log("Could not parse swagger spec: " + err.toString());
				return res.status(500).end();
			}

			var templateFilename = path.join(__dirname, "assets", "templates", "swagger.dust");
			var context = {
				spec: spec,
				contextRoot: req.originalUrl
			};

			(new Readable()).wrap(addPause(dust.stream(templateFilename, context)))
			 .on("error", function (e) {
			 	console.log("Dust error: " + e);
			 	res.status(500).end();
			 })
			 .setEncoding('UTF-8')
			 .pipe(res)
			 ;
		});
	};
}

function addPause(oldStream) {
	oldStream.pause = function () {};
	return oldStream;
}

function readSchemaFile(spec, callback) {
	if (typeof spec !== "string") {
		return callback(null, spec);
	}

	// The provided file is a filename.
	fs.readFile(spec, function (err, r) {
		if (err) {
			return callback(err);
		}

		var parsedSpec;

		try {
			parsedSpec = JSON.parse(r);
		} catch (e) { 
			return callback(e);
		}

		return callback(null, parsedSpec);
	});
}