/*global QUnit*/

sap.ui.define([
	"comkaust./zga_moeattest/controller/MOEATTEST.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MOEATTEST Controller");

	QUnit.test("I should test the MOEATTEST controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
