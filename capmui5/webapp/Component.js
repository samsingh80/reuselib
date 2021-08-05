sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ns/capmui5/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ns.capmui5.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
            this.setModel(models.createDeviceModel(), "device");
            
            this.setoModel()
        },
        
        //Reading the odata 
		setoModel: function () {
			// Read the order details from the ClosedOrdersPurchaser model
			var that = this;
			var oDataModel = this.getModel("oDataModel");
			
			var sUrl = "/BookPrice";
			oDataModel.read(sUrl, {				
				success: function (oData, oResponse) {
                    console.log("Success");
                    console.log(oData);
                    console.log(oResponse);
				},
				error: function (oError) {
					console.log("Error");
				}
			});

		},
	});
});
