sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("com.kaust.zui5myrequest.controller.App", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            },

            /**Helper function for before 
		    * route pattern matched**/
            onBeforeRouteMatched: function (oEvent) {

                var oModel = this.getOwnerComponent().getModel();
                var sLayout = oEvent.getParameters().arguments.layout;

                // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
                if (!sLayout) {
                    var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                    sLayout = oNextUIState.layout;
                }

                // Update the layout of the FlexibleColumnLayout
                if (sLayout) {
                    oModel.setProperty("/layout", sLayout);
                }
            },

            /**	onRouteMatched	Helper function for route pattern **/
            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");

                this._updateUIElements();

                // Save the current route name
                this.currentRouteName = sRouteName;
                this.currentPath = oArguments.path;
            },

            /**function called when the layout of flexible column is changed **/
            onStateChanged: function (oEvent) {
                this._updateUIElements();
            },

            /** Update the close/fullscreen buttons visibility **/
            _updateUIElements: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
                var ofcl = this.byId("fcl");           
                oModel.setData(oUIState);
            },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf com.merckgroup.ME_Ecom_OpenOrders_Customer_UI5.view.home
             */
            onExit: function () {
                this.oRouter.detachRouteMatched(this.onRouteMatched, this);
                this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            }
        });
    });
