/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comkaust./zui5_approvers/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
