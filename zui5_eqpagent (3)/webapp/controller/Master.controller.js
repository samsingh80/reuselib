sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5eqpagent/formatter/formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter) {
        "use strict";

        return Controller.extend("com.kaust.zui5eqpagent.controller.Master", {
            formatter: formatter,

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.oRouter = this.getOwnerComponent().getRouter();
            },

            /** Action trigger when the request is selected
             *  from the list
             */
            handleListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext("oListModel");

                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                // get the instance of the router and navigate to Detail View. 
                var oRouter = this.getOwnerComponent().getRouter();

                var oPath = oContext.getPath();
                var splitPath = oPath.split("/");
                var sPath = splitPath[1];

                oRouter.navTo("detail", {
                    layout: oNextUIState.layout,
                    path: sPath
                });

            },

            /** Function to change the case of search text to upper */
            onType: function (evt) {
                if (this.getView().byId("srchfld").getValue().length > 0) {
                    this.getView().byId("srchfld").setValue(this.getView().byId("srchfld").getValue().toUpperCase());
                }
            },

            /** Function  triggered when the search is done */
            searchreq: function (evt) {
                var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                if (this.getView().byId("srchfld").getValue().length > 0) {
                    this.getView().byId("srch").setVisible(false);
                    var list = this.getView().byId("list");
                    list.removeAllItems();
                    //Clear the conf model
                    var oEquipModel = this.getOwnerComponent().getModel("oEquipModel");
                    oEquipModel.setData(null);
                    this.getOwnerComponent().setModel(oEquipModel, "oEquipModel");
                    oEquipModel.refresh();
                    this.__getRequestList();
                    var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                    this.oRouter.navTo("Routeapp", {
                        layout: sNextLayout
                    });
                }
                else {
                    sap.m.MessageBox.error(oResourceModel.getText("EN_NUM"), {
                        title:oResourceModel.getText("INV_INP"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                }
            },

            /** Odata call to fetch the list of request based
             *  on the search text
             */
            __getRequestList: function () {
                var that = this;
                var oModelList = new sap.ui.model.json.JSONModel();
                var sSearchValue = this.getView().byId("srchfld").getValue();
                var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                var regex = /^\d+$/;
                let mHeaders = {};
                mHeaders.sub_service_code = '0009';
                if (regex.test(sSearchValue)) {
                    mHeaders.request_id = sSearchValue;
                } else {
                    mHeaders.userid = sSearchValue;
                }
                var sRequestURL = "/AllRequests";
                oDataModel.setHeaders(mHeaders);
                oDataModel.read(sRequestURL, {
                    success: function (data, response) {
                        console.log(data);
                        oModelList.setData(data.results);
                        if (oModelList.oData.length > 0) {
                            that.getView().byId("list").setVisible(true);
                        }
                        that.getOwnerComponent().setModel(oModelList, "oListModel");
                        oModelList.refresh(true);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

            },

        });
    });
