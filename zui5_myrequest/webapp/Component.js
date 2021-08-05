sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/kaust/zui5myrequest/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper) {
    "use strict";

    return UIComponent.extend("com.kaust.zui5myrequest.Component", {

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

            // Create an instance of JSON Model for layout.
            var oModel = new JSONModel();
            this.setModel(oModel);

            //Set Custom Model
            var oCustom = new sap.ui.model.json.JSONModel();
            this.setModel(oCustom, "oCustomModel");

            //Get Country Model
            this.setCountryModel();

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
        },

        /**
         * Set the Country Model
         */
        setCountryModel: function () {
            var that = this;
            var oBCJson = new sap.ui.model.json.JSONModel();
            that.setModel(oBCJson, "oBCModel");
            var oCountryModel = that.getModel("oCountryModel");
            var sRequestURL = "/COUNTRY";
            oCountryModel.read(sRequestURL, {
                success: function (oData, response) {
                    var nations = oData.results;
                    oBCJson.setData(nations);
                    that.setModel(oBCJson, "oBCModel");

                }
            });
        },


        /**
        * Set the initial view
        **/
        createContent: function () {
            return sap.ui.view({
                viewName: "com.kaust.zui5myrequest.view.App",
                type: "XML"
            });
        },

        /**
         * Returns an instance of the semantic helper
         * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
         */
        getHelper: function () {
            var oFCL = this.getRootControl().byId("fcl"),
                oParams = jQuery.sap.getUriParameters(),
                oSettings = {
                    defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
                    defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
                    mode: oParams.get("mode"),
                    initialColumnsCount: 1,
                    maxColumnsCount: oParams.get("max")
                };

            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        }
    });
});
