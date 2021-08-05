/*global QUnit*/

sap.ui.define([
	"comkaust./zui5_security/controller/SecurityFormView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SecurityFormView Controller");

	QUnit.test("I should test the SecurityFormView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
