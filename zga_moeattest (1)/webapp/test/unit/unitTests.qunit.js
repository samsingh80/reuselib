/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comkaust./zga_moeattest/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
