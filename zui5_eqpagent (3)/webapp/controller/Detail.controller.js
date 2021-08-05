sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5eqpagent/formatter/formatter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter) {
        "use strict";

        return Controller.extend("com.kaust.zui5eqpagent.controller.Detail", {
            formatter: formatter,
            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
            },
            /** Function called on full screen mode in 
             * flexible column layout
             **/
            handleFullScreen: function () {
                var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.oRouter.navTo("detail", {
                    layout: sNextLayout,
                    path: this.sPath
                });
            },

            /**Function called on exit full screen mode
             * in flexible column layout
             **/
            handleExitFullScreen: function () {
                var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                this.oRouter.navTo("detail", {
                    layout: sNextLayout,
                    path: this.sPath
                });
            },

            /**Function called on close screen mode in
             *  flexible column layout*/
            handleClose: function () {
                var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                this.oRouter.navTo("Routeapp", {
                    layout: sNextLayout
                });
            },

            /** Function called when detail route is triggered*/
            _onRouteMatched: function (oEvent) {
                // read the path variable which is passed as part of the URL pattern (defined in router configuration)
                var sPath = oEvent.getParameter("arguments").path;
                var oListModel = this.getOwnerComponent().getModel("oListModel");
                var sPath1 = "/" + sPath;
                var oData = oListModel.getProperty(sPath1);
                this.sPath = sPath;
                var sReqId = oData.request_id;
                this._getTransferDetails(sReqId);
            },

            /** Fetch the details of selected transfer
             *  request from the list
             */
            _getTransferDetails: function (sReqId) {
                var that = this;
                var oEquipModel = this.getOwnerComponent().getModel("oEquipModel");
                var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                var oListModel = this.getOwnerComponent().getModel("oListModel");

                //Check whether the data is already loaded as
                // the route is called whenminimise and maximize occur
                var sCreateFlag = "";
                var oEData = oEquipModel.getData();
                if (oEData) {
                    if (oEData.request_id === sReqId) {
                        sCreateFlag = "X";
                    }
                }
                if (sCreateFlag === "") {
                    //Create Key
                    var sRequestURL = oDataModel.createKey("/Transferequipments", {
                        request_id: sReqId
                    });

                    oDataModel.read(sRequestURL, {
                        urlParameters: {
                            "$expand": "items,header"
                        },
                        success: function (data, response) {
                            console.log(data);
                            if (data) {
                                var oData = data;
                                var oListData = oListModel.getData();
                                oData.kaust_id = oListData.kaust_id;
                                oEquipModel.setData(oData);
                                that.getView().setModel(oEquipModel, "oEquipModel");
                                oEquipModel.refresh(true);
                                if (oData.items.results.length > 0) {
                                    var allData = oData.items.results;
                                    that.__getMultiFields(allData);
                                }
                                that.__setHistoryModel(oData.request_id);
                                that.__setCommentModel(oData.request_id);
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });

                }
            },

            /** Get the History of Request Log */
            __setHistoryModel: function (requestId) {
                if (requestId) {
                    var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                    var sRequestURL = "/Requestlog";

                    var model = new sap.ui.model.json.JSONModel();
                    var table = this.getView().byId("TblHistory");
                    table.setModel(model, "historyModel");
                    oGAModel.read(sRequestURL, {
                        headers: {
                            "request_id": requestId
                        },

                        success: function (data, response) {
                            table.getModel("historyModel").setData(data.results);
                            var aFilter = [];
                            var oFilter1 = new sap.ui.model.Filter('status', sap.ui.model.FilterOperator.NE, 56);
                            var oFilter2 = new sap.ui.model.Filter('status', sap.ui.model.FilterOperator.NE, 57);
                            var oFilter3 = new sap.ui.model.Filter('status', sap.ui.model.FilterOperator.NE, 58);
                            var oFilter4 = new sap.ui.model.Filter('status', sap.ui.model.FilterOperator.NE, 59);

                            var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
                            var oCombineFilters = new sap.ui.model.Filter(corFilter, true);

                            table.getBinding('items').filter(oCombineFilters);

                        }

                    });
                }
            },

            /** Fetch the cmoments given for the request */
            __setCommentModel: function (requestId) {
                if (requestId) {
                    var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                    var oAVCommModel = new sap.ui.model.json.JSONModel();
                    var sRequestURL = "/CommentSet";
                    var that = this;

                    oGAModel.read(sRequestURL, {
                        headers: {
                            "request_id": requestId
                        },

                        success: function (data, response) {
                            var aList = data.results;
                            aList = aList.filter(function (oEle) {
                                return oEle.Comments !== "";
                            });
                            oAVCommModel.setData(aList);
                            that.getView().setModel(oAVCommModel, "GAComments");

                        }

                    });
                }
            },

            /** Combine the Equipment items details */
            __getMultiFields: function (oAllData) {
                var sRepIp = "", sEquipNo = "";
                var aItems = oAllData;
                var oEquipModel = this.getOwnerComponent().getModel("oEquipModel");
                var oData = oEquipModel.getData();
                for (var i in aItems) {
                    if (aItems[i].replenisheqip != "") {
                        sRepIp = sRepIp + aItems[i].replenisheqip + "\n";
                    }
                    if (aItems[i].equip_num != "") {
                        sEquipNo = sEquipNo + aItems[i].equip_num + "\n";
                    }
                }
                oData.replenisheqip = sRepIp;
                oData.equip_num = sEquipNo;
                oEquipModel.setData(oData);
                this.getOwnerComponent().setModel(oEquipModel, "oEquipModel");
                oEquipModel.refresh(true);
            }



        });
    });
//.