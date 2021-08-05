/*global QUnit*/

sap.ui.define([
	"ns/cap2/controller/test.controller"
], function (Controller) {
	"use strict";

	QUnit.module("test Controller");

	QUnit.test("I should test the test controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
