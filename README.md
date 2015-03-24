NAME
====

swagger-ui-middleware - An express middleware for generating a swagger UI from a spec


USAGE
=====

	/* Creates a swagger API viewer on port 8080 under /swagger, using 
	   the spec in spec/swagger-spec.json */

	var
	 express = require("express"),
	 swaggerSpec = require(path.join(__dirname, "spec", "swagger-spec.json")),
	 swaggerUi = require("swagger-ui-middleware")
	;

	var app = express();
	app
	.use("/swagger", swaggerUi(swaggerSpec))
	.listen(8080)
	;


DESCRIPTION
===========

Provides endpoints for a instance of Swagger UI where mounted.  The data
for the UI is gathered from the provided object.


BUGS
====

- The main page (/ under the mountpoint) isn't cache eligiable.  Since it'll only 
  be loaded once due to 
  dust caching, this should be doable by computing a random ETag on startup, and
  just always sending this along.  It would be difficult (perhaps impossible) to
  both stream and compute a 100% accurate ETag at the same time, as the ETag would
  only be known after the headers have already been sent.

-- *However* if we computed the ETag based on a digest of the swagger doc, we
   should have a good enough solution.  I'll note this as a TODO.


AUTHOR
======

- Chris Taylor <cntaylor@ca.ibm.com>


DEPENDS ON
==========

- Swagger UI: https://github.com/swagger-api/swagger-ui