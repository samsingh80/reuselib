sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5myrequest/formatter/formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter) {
        "use strict";

        return Controller.extend("com.kaust.zui5myrequest.controller.Master", {
            formatter: formatter,
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.getServiceDescriptions();
                this.getRequestList();
            },

            /** Fetch the Description based on the service 
             * and sub service code
             */
            getServiceDescriptions: function () {
                var that = this;
                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel");
                var sRequestURL = "/SubService";
                oCommonModel.read(sRequestURL, {
                    success: function (data, response) {
                        var oModelList = new sap.ui.model.json.JSONModel();
                        oModelList.setData(data.results);
                        that.getOwnerComponent().setModel(oModelList, "ServiceDescriptions");
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },

            /** Odata call to fetch the list of request based
             *  on the search text
             */
            getRequestList: function () {
                var that = this;
                var oModelList = new sap.ui.model.json.JSONModel();
                // var sSearchValue = this.getView().byId("srchfld").getValue();
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                let mHeaders = {};
                // if (sSearchValue) {
                //     mHeaders.request_id = sSearchValue;
                // } else {
                //     mHeaders.userid = 'TST_EMPLOYEE';
                // }
                var sRequestURL = "/AllRequests";
                // oKITSModel.setHeaders(mHeaders);
                oKITSModel.read(sRequestURL, {
                    success: function (data, response) {
                        console.log(data);
                        oModelList.setData(data.results);
                        if (oModelList.oData.length > 0) {
                            that.getView().byId("list").setVisible(true);
                        }
                        that.getOwnerComponent().setModel(oModelList, "listModel");
                        oModelList.refresh(true);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

            },

            /** Action trigger when the request is selected
             *  from the list
             */
            handleListItemPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext("listModel");

                //Set Custom Data
                var cusData = oSelectedItem.getCustomData();
                this.setCustomData(cusData);

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
            setCustomData: function (customData) {
                var stage,serviceCode;
                for (var i = 0; i < customData.length; i++) {
                    if (customData[i].getKey() == "stage") {
                        stage= customData[i].getValue("stage");
                    }
                }
                if(!stage){
                    stage = "No stage";
                }                 

                for (var i = 0; i < customData.length; i++) {
                    if (customData[i].getKey() == "subServiceCode") {
                        serviceCode = customData[i].getValue("subServiceCode");
                    }
                }
                if(!serviceCode){
                    serviceCode = "No code";
                } 

                var data = {
                    stage : stage,
                    serviceCode : serviceCode
                };
                var oCustomModel = this.getOwnerComponent().getModel("oCustomModel");
                oCustomModel.setData(data);
                this.getOwnerComponent().setModel(oCustomModel);

            },

            /*** Search based on kaust id,request id,subservice code and status */
            handleSearch: function (evt) {
                // create model filter
                var query = evt.getParameter("query");
                var that = this;
                if (query && query.length > 0) {
                    var filterKaustId = new sap.ui.model.Filter("kaust_id", sap.ui.model.FilterOperator.Contains, query);
                    var filterRequestId = new sap.ui.model.Filter("request_id", sap.ui.model.FilterOperator.Contains, query);
                    var filterStatus = new sap.ui.model.Filter("status", function (oValue) {
                        var result = false;
                        var map = formatter._statusMap;
                        var status = map[oValue];
                        if (status) {
                            result = (status.toLowerCase().indexOf(query.toLowerCase()) > -1);
                        }
                        return result;
                    });

                    var filterSubServiceCode = new sap.ui.model.Filter("sub_service_code", function (oValue) {
                        var result = false;
                        var arr = that.getOwnerComponent().getModel("ServiceDescriptions").oData;
                        var description = "";
                        jQuery.each(arr, function (index, obj) {
                            if (obj["sub_service_code"] === oValue) {
                                description = obj["sub_service_desc"];
                                if (description.indexOf(query) > -1) {
                                    result = true;
                                }
                            }
                        });

                        return result;
                    });
                    var filter = new sap.ui.model.Filter({
                        filters: [filterKaustId, filterRequestId, filterStatus, filterSubServiceCode],
                        and: false
                    });
                }
                // update list binding
                var list = this.getView().byId("list");
                var binding = list.getBinding("items");
                binding.filter(filter);
                var refreshPressed = evt.getParameter("refreshButtonPressed");
                if (refreshPressed) {
                    this.initialize();
                    sap.ui.getCore().byId("app").app.destroyDetailPages();
                    sap.ui.getCore().byId("app").app.removeAllDetailPages();
                }
            },
            getUserDetails: function () {
                var oUserModel = new sap.ui.model.json.JSONModel();
                var ohelpModel = new sap.ui.model.json.JSONModel();
                var that = this;
                var aFilters = this.getFilter();
                var sRequestURL = "/userDetailsSet";
                var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oHanaModel = this.getOwnerComponent().getModel("oHanaModel");
                oHanaModel.read(sRequestURL, {
                    filters: aFilters,
                    urlParameters: {
                        "$expand": "UserDetailsToDependentDetails"
                    },
                    success: function (oData, oResponse) {
                        console.log(oData);
                        // oUserModel.setProperty("/oUserData", oData.results[0]);
                        // that.getView().setModel(oUserModel, "oUserModel");
                        // var helpData = JSON.parse(JSON.stringify(oData.results[0]));
                        // ohelpModel.setData(helpData);
                        // that.getView().setModel(ohelpModel, "helpModel");
                        // ohelpModel.refresh(true);
                        // oUserModel.refresh(true);
                    },
                    error: function (data, textStatus, XMLHttpRequest) {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(oResourceModel.getText("ERROR_MSG"), {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oResourceModel.getText("ERROR"),
                            actions: [sap.m.MessageBox.Action.OK],
                        });
                    }
                });
            },
            getFilter: function () {
                {
                    var aFilters = [],
                        aFilterIds = ["UserType", "UserName", "DisplayDependents"],
                        aFilterValues = ["STUDENT", "GHANIMA", "X"],
                        i;
                    for (i = 0; i < aFilterIds.length; i = i + 1) {
                        aFilters.push(new Filter(aFilterIds[i], FilterOperator.EQ, aFilterValues[i], ""));

                    }
                    return aFilters;

                };
            },
        });
    });
