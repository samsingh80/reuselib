sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.merckgroup.ME_Ecom_Products_UI5.controller.Products", {
		onInit: function () {
			var oModel, oView;
			oModel = this.getOwnerComponent().getModel("ProductsoDataModel");
			oView = this.getView();
			oView.setModel(oModel);
		},
		/**To adjust the column as per the column 
		 * header-auto resizing
		 **/
		onBeforeRebindTable: function (oEvent) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sProduct = oBundle.getText("PRODUCTS_DETAILS_PRODUCTIDNAME");
			var oTable = this.byId("LineItemsSmartTable");
			var aColumns = oTable.getTable().getColumns();
			if (aColumns.length > 0) {
				var i = 0;
				aColumns.forEach(function (oLine) {
					var sLabel = oLine.getLabel().getText();
					if (sLabel !== sProduct) {
						oLine.setWidth("100%");
						oLine.getParent().autoResizeColumn(i);
					}
					i++;
				});
				aColumns[0].setWidth("100%");
				aColumns[0].getParent().autoResizeColumn(0);
			}

		},
		//Rendered after view has been setup
        	onAfterRendering: function () {
			var oUserInfo = sap.ushell.Container.getService("UserInfo");
			var sEmail = oUserInfo.getUser().getEmail();
			var smarttable = this.getView().byId("LineItemsSmartTable");
			smarttable.setTableBindingPath("/ProductMasters('" + sEmail + "')/Results");
		},
		/**On Filter Reset**/
		onFilterReset: function () {
			var smartFilterBar = this.getView().byId("smartFilterBar");
			smartFilterBar.clear();
		}
	});
});