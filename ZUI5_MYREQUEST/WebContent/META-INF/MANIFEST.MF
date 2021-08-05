jQuery.sap.declare("kaust.ui.kits.myRequest.Component");

sap.ui.core.UIComponent.extend("kaust.ui.kits.myRequest.Component", {

	metadata: {
		version: "1.0",
		includes: ["customCSS.css"],
		dependencies: {
			libs: ["sap.m", "sap.ui.layout", "sap.suite.ui.commons", "sap.ui.commons"],
			components: []
		}
	},

	createContent: function () {
		// create root view
		var oView = sap.ui.view({
			id: "app",
			viewName: "kaust.ui.kits.myRequest.view.App",
			type: "JS",
			viewData: {
				component: this
			}
		});

		// Edited by Darshna : Host Property POC
		// Commented on 1-10-2018
		//		var oPropertyModel = new sap.ui.model.resource.ResourceModel({
		//			bundleUrl : "http://sthcigwdq1.kaust.edu.sa:8005/sap/bc/ui5_ui5/sap/zcuutl0006_gasc/gascdepiqamaissuance/property/host.properties"
		//		});
		//		this.setModel(oPropertyModel, "oPropertyModel");

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: "i18n/i18n.properties"
		});
		oView.setModel(i18nModel, "i18n");

		//		// Using OData model to connect against a real service
		//		var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
		//		var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
		//		oView.setModel(oModel);

		// Using a local model for offline development
		//		var oModel = new sap.ui.model.json.JSONModel("model/mock.json");
		//		oView.setModel(oModel);

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone: jQuery.device.is.phone,
			listMode: (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType: (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");
		// done
		return oView;
	}
});