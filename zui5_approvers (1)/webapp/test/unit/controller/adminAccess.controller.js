/*global QUnit*/

sap.ui.define([
	"comkaust./zui5_approvers/controller/adminAccess.controller"
], function (Controller) {
	"use strict";

	QUnit.module("adminAccess Controller");

	QUnit.test("I should test the adminAccess controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
