/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comkaust./zui5_security/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
