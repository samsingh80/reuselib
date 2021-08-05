/*global QUnit*/

sap.ui.define([
	"com/merckgroup/ME_Ecom_Products_UI5/controller/Products.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Products Controller");

	QUnit.test("I should test the Products controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});