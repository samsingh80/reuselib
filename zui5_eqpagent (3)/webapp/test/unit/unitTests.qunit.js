/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comkaust./zui5_eqpagent/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
