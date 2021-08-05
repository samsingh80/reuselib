sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5myrequest/formatter/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.kaust.zui5myrequest.controller.Detail", {
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
                var oListModel = this.getOwnerComponent().getModel("listModel");
                var sPath1 = "/" + sPath;
                var oData = oListModel.getProperty(sPath1);
                this.sPath = sPath;
                if (oData) {
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(oData);
                    this.getView().setModel(oModel, "confRoomModel");
                    this._LoadView(oData);
                }

            },

            /** Load the respective view based on the sub service code */
            _LoadView: function (oData) {
                var requestId = oData.request_id;
                var kaustId = oData.kaust_id;
                var subServiceCode = oData.sub_service_code;
                var subService = formatter.subServiceDescription(subServiceCode, this);
                var status = formatter.statusCodeText(oData.status, this);
                var oSubServModel = new sap.ui.model.json.JSONModel();
                oSubServModel.setProperty('/', subServiceCode);
                sap.ui.getCore().setModel(oSubServModel, 'oSubServModel');
                var helpModel = new sap.ui.model.json.JSONModel();
                var helpObject = new Object();
                helpObject.requestId = requestId;
                helpObject.serviceCode = oData.service_code;
                helpObject.subServiceCode = oData.sub_service_code;
                helpObject.serviceOpened = subService;
                helpModel.setProperty("/helpItems", helpObject);
                helpModel.setProperty("/durationVisible", true);
                this.getView().setModel(helpModel, "helpModel");

                // var app = this.getView().app;
                var tabsFragment;
                var detailsFragment;
                var detailsForm = this.getView().byId("page");
                detailsForm.removeAllContent();
                if (this.detailsFragment) {
                    this.detailsFragment.destroy();
                }
                if (this.footer) {
                    this.footer.destroy();
                }

                // Load the preference Data
                this.loadPreferenceData(kaustId, oData.sub_service_code);

                //Subservice
                switch (subService) {
                    case 'Generic Email Creation':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.GenEmail", this);
                        this.getGenEmail(requestId, kaustId);
                        break;
                    case 'Loan Equipment':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.LoanEquip", this);
                        this.getLoanEquip(requestId, kaustId);
                        break;

                    case 'Port Activation':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.PortAccess", this);
                        this.getPortDetails(requestId);
                        break;

                    case 'Vulnerability Scan Service':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.VulnerabilityScanDetails", this);
                        this.getView().addDependent(detailsFragment);
                        this.getVulnerabilityScanData(requestId, kaustId);
                        // app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("VScanModel"));
                        break;

                    case 'Security Incident Report':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.SecurityIncidentDetails", this);
                        this.getSecurityIncidentData(requestId, kaustId);
                        break;

                    case 'VPN Access for externals Process':
                        var oRequestModel = new sap.ui.model.json.JSONModel();
                        this.getView().setModel(oRequestModel, "oRequestModel");
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.VPNAccess", this);
                        detailsFragment.setModel(oRequestModel);
                        var listItem;
                        this.getVPNDetails(requestId, listItem);
                        break;
                    case 'Replenish Equipment':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.TransferEquip", this);
                        this.getReplenishEquip(requestId, kaustId);
                        break;
                    case 'Transfer Equipment':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.TransferEquip", this);
                        this.getTransferEquip(requestId, kaustId);
                        break;
                    case 'Copyright Notice Service':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.AccessRequestDetails", this);
                        this.getAccessRequestData(requestId, kaustId);
                        break;
                    case 'Smart Printing Registration':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.AccessRequestDetails", this);
                        this.getAccessRequestData(requestId, kaustId);
                        break;
                    case 'Encryption Request Service':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.AccessRequestDetails", this);
                        this.getAccessRequestData(requestId, kaustId);
                        break;
                    case 'TER Access Process':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.TERAccess", this);
                        this.getTERDetails(requestId);
                        break;

                    case 'Admin Rights Process':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.AdminAccess", this);
                        this.getAdminAccessDetails(requestId);
                        break;
                    case 'Data Center Access Process':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.DataAccess", this);
                        this.getDataCenterDetails(requestId, detailsFragment);
                        break;
                }




                //Sub service code
                switch (subServiceCode) {
                    case '0026':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.AccessRequestDetails", this);
                        this.getAccessRequestData(requestId, kaustId);
                        break;
                    //Birth certificate
                    case '0302':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.BirthCertificate", this);
                        this.getBirthCertificate(requestId, subServiceCode);
                        break;
                    //Transfer of Information
                    case '0401':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.TransferInformation", this);
                        this.getTransferInfo(requestId, subServiceCode);
                        break;

                    //Information Correction
                    case '0402':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.InfoCorrect", this);
                        this.getInfoCorrect(requestId, subServiceCode);
                        break;

                    //Job Title Change
                    case '0414':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.Jobtitlechange", this);
                        this.getJobTitleDetails(requestId, subServiceCode);
                        break;

                    //Foreign Visa Service
                    case '1708':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.ForeignVisa", this);
                        this.getForeignVisaDetails(requestId, subServiceCode);
                        break;

                    //Passport Pick up service    
                    case '1709':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.PassportPickup", this);
                        this.getPassportPickupDetails(requestId, subServiceCode);
                        break;

                    case '0413':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.DPSPTransfer", this);
                        this.getDSTDetails(requestId, subServiceCode);
                        break;

                    case '0415':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.SPSTransfer", this);
                        this.getSSTDetails(requestId, subServiceCode);
                        break;
                }

                //
                if (detailsFragment) {
                    this.detailsFragment = detailsFragment;
                    detailsForm.addContent(this.getStatus(requestId, kaustId, status, subService, subServiceCode));
                    var requesterInformationTab = sap.ui.getCore().byId("RequesterInformationSF");
                    if (requesterInformationTab != undefined) {
                        requesterInformationTab.setModel(sap.ui.getCore().byId("Master").getModel("RequesterInformationModel"));
                    }
                    detailsForm.addContent(detailsFragment);


                    if (subService != "Audio Visual Services" && subService != "Replenish Equipment" && subService != "Transfer Equipment" && subService !=
                        "Loan Equipment" && subServiceCode == "1701" && subServiceCode == "1704" && subServiceCode == "1705") {
                        if (tabsFragment == null) {
                            tabsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.Tabs", this);
                        }
                        detailsForm.addContent(tabsFragment);
                        //For Port, hiding comments tab : zakeer
                        if (subService == "Port Activation") {
                            detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].setVisible(false);
                        }
                        //closing of hiding comments tab : zakeer

                        //For TER, comments tab : zakeer
                        else if (subService == "TER Access Process") {
                            var data = this.getView().getModel("oDataModel").getData().d.results[0];
                            var comments = [];
                            if (data.itncTeamComments != "") {
                                var commObj = {
                                    "text": ""
                                };
                                commObj.text = data.itncTeamComments + " by " + data.itncTeamApprover;
                                comments.push(commObj);
                            }
                            if (data.itncAgentComment != "") {
                                var commObj = {
                                    "text": ""
                                };
                                commObj.text = data.itncAgentComment + " by " + data.itncAgentApprover;
                                comments.push(commObj);
                            }
                            if (data.feedbackComment != "") {
                                var commObj = {
                                    "text": ""
                                };
                                commObj.text = data.feedbackComment + " by " + data.netAgent_approver;
                                comments.push(commObj);
                            }
                            detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();

                            if (comments.length >= 1) {
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData({
                                    "Comments": comments
                                });
                                this.getView().setModel(oModel, "oCommModel");

                                var list = new sap.m.List();
                                list.bindItems({
                                    path: "oCommModel>/Comments",
                                    template: new sap.m.FeedListItem({
                                        text: "{oCommModel>text}",
                                    })
                                });
                                detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list);
                            }
                        } //TER : end of comments tab : zakeer
                        else if (subService == "VPN Access for externals Process") {
                            var data = this.getView().getModel("oDataModel").getData().d.results[0];
                            var comments = [];
                            if (data.secManagerComments != "") {
                                var commObj = {
                                    "text": ""
                                };
                                commObj.text = data.secManagerComments + " by " + data.infoSecManager;
                                comments.push(commObj);
                            }
                            if (data.msgTeamComments != "") {
                                var commObj = {
                                    "text": ""
                                };
                                commObj.text = data.msgTeamComments + " by " + data.msgTeam;
                                comments.push(commObj);
                            }

                            detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();

                            if (comments.length >= 1) {
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData({
                                    "Comments": comments
                                });
                                this.getView().setModel(oModel, "oCommModel");

                                var list = new sap.m.List();
                                list.bindItems({
                                    path: "oCommModel>/Comments",
                                    template: new sap.m.FeedListItem({
                                        text: "{oCommModel>text}",
                                    })
                                });
                                detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list);
                            }
                        } //TER : end of comments tab : zakeer
                        else if (subService == "Admin Rights Process") {
                            var requestId = this.getView().getModel("adminModel").getData().d.results[0].requestId;
                            var oDataApproverModel = new sap.ui.model.json.JSONModel();
                            oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId +
                                "'&$format=json", null, false);
                            var data = oDataApproverModel.getData().d.results;
                            //
                            //            data.forEach(function (oEle) {
                            //            oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
                            //          });
                            oDataApproverModel.setData(data);
                            this.getView().setModel(oDataApproverModel, "GAComments");
                        }

                        // Pavithra code- comments DC start
                        else if (subService == "Data Center Access Process") {
                            var rData = this.getView().getModel("dataCenter").getData().d.results[0]
                            var requestId = rData.RequestId;
                            var oDataApproverModel = new sap.ui.model.json.JSONModel();
                            oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId +
                                "'&$format=json", null, false);
                            var data = oDataApproverModel.getData().d.results;
                            //
                            //        data.forEach(function (oEle) {
                            //        oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
                            //      });
                            oDataApproverModel.setData(data);
                            this.getView().setModel(oDataApproverModel, "GAComments");
                            if (rData.justification && (rData.stage == "Line Manager" || rData.stage == "Data Center Team" || rData.stage ==
                                "Data Center Lead" || rData.stage == "Research and Computing Team")) {
                                sap.ui.getCore().byId("justificationtab").setVisible(true);
                                sap.ui.getCore().byId("justifctnTab").setValue(rData.justification);

                            } else if ((rData.stage == "Requester" || rData.stage == "Justification")) {
                                sap.ui.getCore().byId("justificationtab").setVisible(false);
                            }
                        }
                        //          Pavithra code- comments DC end        

                        //           Tabs Fragment for GASC Services: Darshna 
                        if (subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode === "0504" || subServiceCode === "0207" ||
                            subServiceCode === "0501" || subServiceCode === "0302" || subServiceCode === "0206" || subServiceCode === "1703" || subServiceCode ===
                            "0104" || subServiceCode === "1706" || subServiceCode === "1707" || subServiceCode === "0504" || subServiceCode === "1702" || subServiceCode === "0101" ||
                            subServiceCode === "0502" || subServiceCode === "0503" || subServiceCode === "0505" || subServiceCode === "0506" || subServiceCode ===
                            "0304" || subServiceCode === "0204" || subServiceCode === "0205") {
                            /*  var data = this.getView().getModel("oNewsPaperModel").getData();
                  var comments = [];
                  if(data.GAComments!="" && data.GAComments != undefined){
               var commObj = {"text":""};
             commObj.text= "GA Comments: " + data.GAComments;
             comments.push(commObj);}
            if(data.FinComments!="" && data.FinComments!=undefined){
               var commObj = {"text":""};
             commObj.text= "Financial Comments: " +  data.FinComments;
             comments.push(commObj);}
            if(data.ReqComments!="" && data.ReqComments!=undefined){
               var commObj = {"text":""};
             commObj.text= "Requester Comments: " +  data.ReqComments;
             comments.push(commObj);
             }
            detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();
            if(comments.length >= 1){
                var oComment = new sap.ui.model.json.JSONModel();
                oComment.setData({"Comments":comments});
                this.getView().setModel(oComment,"oCommModel");
    
                    var list = new sap.m.List();
                    list.bindItems({
                          path : "oCommModel>/Comments", 
                          template : new sap.m.FeedListItem({
                            text: "{oCommModel>text}",
                          })
                      }); 
                    detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list); 
                   }*/
                        }

                        //           Comments Log Implementation for IQAMA Renewal and Exit Re-Entry --- Dikhunmekh --- Start

                        var that = this;
                        //commented by shravya for iqama renewal
                        /*	if (subServiceCode == "0101") { // || subServiceCode == "0102") { 
        
                                sap.ui.getCore().byId('idIqamaComment').setVisible(false);
                                sap.ui.getCore().byId('idIqamaCommentGaApp').setVisible(true);
        
                                var oRequestId = this.getView().getModel("IqamaDetailsModel").getData()[0].RequestId;
                                var oCommentsModel = new sap.ui.model.json.JSONModel();
                                var oModelCommentsLog = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/")); // Darshna - this.getUrl added
                                var filterstr = "CommentSet?$filter=Request_ID eq '" + oRequestId + "'";
        
                                oModelCommentsLog.read(filterstr, null, null, false, function (data, response) {
                                    data.results = data.results.filter(function (val) {
                                        return val.Status != "056" &&
                                            val.Status != "057" &&
                                            val.Status != "058" &&
                                            val.Status != "059";
                                    });
                                    oCommentsModel.setData(data.results);
                                    that.getView().setModel(oCommentsModel, "oCommentsModel");
                                }, function (response) {
                                    return "";
                                });
                            }*/


                        //           Comments Log Implementation for IQAMA Renewal and Exit Re-Entry --- Dikhunmekh --- End

                        if (subService == "Data Center Access Process") {
                            this.getUserDataDC(kaustId, requestId);
                            sap.ui.getCore().byId("userInfoForm").setVisible(false);
                            sap.ui.getCore().byId("userInfoFormDC").setVisible(true);
                        } else {
                            this.getUserData(kaustId, requestId);
                        }
                        // sap.ui.getCore().byId("historyTab").setVisible(false);
                    } else if (subService == "Audio Visual Services" || subService == "Loan Equipment") {
                        var oModel = this.getView().getModel("confRoomModel");
                        //          INCTURE 01-18-2018: START---------------------------------------------------------------------------------------------------------------------------------------------------------------
                        //          Added if-else block to maintain separate Cancel Footer visibility for AV and Loan Equipment
                        if (subService == "Loan Equipment") { // No changes for Loan Equipment
                            if (oModel.oData.status != "013" && oModel.oData.status != "015" && oModel.oData.status != "011" && oModel.oData.status != "016" &&
                                oModel.oData.status != "018") {
                                var footer = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.CancelFooter", this);
                                this.footer = footer;
                                detailsForm.setFooter(footer);
                                sap.ui.getCore().byId("cancelRq").setEnabled(true);
                            }
                        } else if (subService == "Audio Visual Services") { // For AV the status check for 013 (Resolved) is removed
                            if (oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" && oModel.oData.Status != "018") {
                                var footer = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.CancelFooter", this);
                                detailsForm.setFooter(footer);
                                // Roopali(11-07-2018)- Make "Cancel individual slots" and "Cancel all" buttons visible and "Cancel Request" invisible if recurring event
                                if (oModel.oData.Rdevent === "X") {
                                    sap.ui.getCore().byId("IndividualCancel").setVisible(true);
                                    sap.ui.getCore().byId("AllCancel").setVisible(true);
                                    sap.ui.getCore().byId("cancelRq").setVisible(false);
                                }
                                // Roopali changes end
                            }
                        }
                        //          Commented below if block
                        //          if (oModel.oData.Status != "013" && oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" && oModel.oData.Status != "018") {
                        //            var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CancelFooter", this.getView().getController());
                        //            detailsForm.setFooter(footer);
                        //          }
                        //          INCTURE 01-18-2018: END---------------------------------------------------------------------------------------------------------------------------------------------------------------

                        // Comments Log Service Integration
                        var requestId = this.getView().getModel("confRoomModel").getData().RequestId;
                        var oAVCommModel = new sap.ui.model.json.JSONModel();
                        oAVCommModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId + "'&$format=json",
                            null, false);
                        var aList = oAVCommModel.getData().d.results;
                        aList = aList.filter(function (oEle) {
                            return oEle.Comments !== "";
                        });
                        oAVCommModel.setData(aList);
                        this.getView().setModel(oAVCommModel, "GAComments");
                    }

                    if (subService == "Final Exit") {
                        var oModel = this.getView().getModel("IqamaDetailsModel");
                        // if (oModel.oData[0].Status == "099") {
                        // 	var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SubmitFooter", this.getView().getController());
                        // 	detailsForm.setFooter(footer);
                        // }
                    }

                    if (sap.ui.getCore().byId("familyTable")) {
                        sap.ui.getCore().byId("familyTable").setModel(helpModel, "helpModel");
                    }
                    var col = sap.ui.getCore().byId("passportLostColumn");
                    if (col) {
                        col.setVisible(false);
                        // if (subServiceCode == '0401') {
                        // 	col.setVisible(true);
                        // }
                    }

                    if (subServiceCode == '0011') {
                        //          if(oModel.oData.EventLocation !='Conference Room')
                        //            this.getProcessStages1(listItem, status, detailsForm,'011b');
                        //          else if(oModel.oData.EventLocation =='Conference Room'&& (oModel.oData.Webex == 'X' || oModel.oData.Videowebconf == 'X' || oModel.oData.Avsupport == 'X' || oModel.oData.Confrecord == 'X'))
                        //            this.getProcessStages(listItem, status, detailsForm);
                        //          else
                        //            this.getProcessStages1(listItem, status, detailsForm,'011a');
                        this.getProcessStages(listItem, status, detailsForm);
                    } else if (subServiceCode == '0101') { //} || subServiceCode == '0202') { // || subServiceCode == '0103' || subServiceCode == '0102' 
                        /*	var oModel = this.getView().getModel("IqamaDetailsModel");
                            if (oModel.oData[0].Categorytype == 'SLCM') {
                                if (subServiceCode == '0101') {
                                    this.getProcessStages1(listItem, status, detailsForm, '0101a');
                                } else if (subServiceCode == '0102') {
                                    this.getProcessStages1(listItem, status, detailsForm, '0102a');
                                } else {
                                    this.getProcessStages1(listItem, status, detailsForm, '0103a');
                                }
        
                            } else {
                                this.getProcessStages(listItem, status, detailsForm);
                            }*/

                    } else if (subServiceCode == '0053' || subServiceCode == '0054' || subServiceCode == '0055') {
                        // this.getProcessStages(listItem, status, detailsForm); thaj
                    }
                    /* else if(subServiceCode == '0054')
                      {
                      this.getProcessStages(listItem, status, detailsForm);
                      }*/
                    else {
                        // this.getProcessStages(listItem, status, detailsForm); thaj
                    }
                    // Rerender is moved to jsonp ajax call because it is asynchronous


                }
            },

            /** Access Request Odata */
            getAccessRequestData: function (requestId, kaustId) {
                var that = this;
                var urlRequestData = "/AccessRequest/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        var oModelARequest = new sap.ui.model.json.JSONModel();
                        oModelARequest.setData(data);
                        that.getView().setModel(oModelARequest, "ARequestModel");
                        sap.ui.getCore().byId("SFDetails").setModel(oModelARequest);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {


                    }

                });


                // this.getUserData(kaustId);
            },

            /** Loan Equipment Odata */
            getLoanEquip: function (requestId, kaustId) {

                var that = this;
                var urlRequestData = "/Loanequip/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        sap.ui.getCore().byId("loanForm").setModel(oModelVScan);
                        // this.getView().setModel(oModelVScan, "confRoomModel");
                        var startData = oModelVScan.oData.startdate;
                        var startDate = that.convertDateBack(startData);
                        var startTime = that.convertTime(oModelVScan.oData.starttime);
                        var start = startDate + " " + startTime;
                        sap.ui.getCore().byId("startTime").setVisible(true).setText(start);

                        var endData = oModelVScan.oData.enddate;
                        var endDate = that.convertDateBack(endData);
                        var endtime = that.convertTime(oModelVScan.oData.endtime);
                        var end = endDate + " " + endtime;
                        sap.ui.getCore().byId("endTime").setVisible(true).setText(end);
                        // devices and access. tab
                        var devices = "";
                        if (oModelVScan.oData.pasystem == "X") {
                            devices = devices + "Portable PA System;";
                        }
                        if (oModelVScan.oData.projector == "X") {
                            devices = devices + "Projector;";
                        }
                        if (oModelVScan.oData.speaker == "X") {
                            devices = devices + "Speaker;";
                        }
                        if (oModelVScan.oData.screen == "X") {
                            devices = devices + "Screen;";
                        }
                        if (oModelVScan.oData.clicker == "X") {
                            devices = devices + "Clicker;";
                        }
                        if (oModelVScan.oData.appledviconnector == "X") {
                            devices = devices + "Apple mini-DVI Connector;";
                        }
                        if (oModelVScan.oData.hdmidviconnector == "X") {
                            devices = devices + "HDMI-DVI Connector;";
                        }
                        if (oModelVScan.oData.visualizer == "X") {
                            devices = devices + "Visualizer;";
                        }
                        if (oModelVScan.oData.vgaconnector == "X") {
                            devices = devices + "VGA Scaler Connector;";
                        }
                        sap.ui.getCore().byId("avTxt").setVisible(true).setText(devices);

                        // computer and access.
                        var computers = "";
                        if (oModelVScan.oData.imacworkstation == "X") {
                            computers = computers + oModelVScan.oData.quantity + " iMac workstation;";
                        }
                        if (oModelVScan.oData.printer == "X") {
                            computers = computers + oModelVScan.oData.quantity1 + " Printer;";
                        }
                        if (oModelVScan.oData.lmacbookair == "X") {
                            computers = computers + oModelVScan.oData.quantity2 + " Laptop MacBook Air;";
                        }
                        if (oModelVScan.oData.scanner == "X") {
                            computers = computers + oModelVScan.oData.quantity3 + " Scanner;";
                        }
                        if (oModelVScan.oData.applemonitor == "X") {
                            computers = computers + oModelVScan.oData.quantity4 + " Apple Monitor;";
                        }
                        if (oModelVScan.oData.others != "" && oModelVScan.oData.others != null) {
                            computers = computers + oModelVScan.oData.quantity5 + " " + oModelVScan.oData.others + ";";
                        }
                        if (oModelVScan.oData.lmacair == "X") {
                            computers = computers + oModelVScan.oData.quantity6 + " iMac workstation;";
                        }
                        sap.ui.getCore().byId("devices").setVisible(true).setText(computers);
                        sap.ui.getCore().byId("reason").setText(oModelVScan.oData.reason);
                        if (oModelVScan.oData.reason == "Repair") {
                            sap.ui.getCore().byId("incidentLbl").setVisible(true);
                            sap.ui.getCore().byId("incident").setVisible(true).setText(oModelVScan.oData.incireport);
                        }
                        //   sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.justification);
                        sap.ui.getCore().byId("loanForm").setModel(oModelVScan);
                        //Set the justification as comment model
                        that.setJustification(oModelVScan.oData, that);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {


                    }

                });


                this.getUserData(kaustId, requestId);
            },

            /** Vulnerability Scan Service */

            getVulnerabilityScanData: function (requestId, kaustId) {
                var that = this;
                var urlRequestData = "/Vulnerabilityscan/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        that.getView().setModel(oModelVScan, "oModelVScan");
                        // sap.ui.getCore().byId("VscanForm").setModel(oModelVScan);
                        oModelVScan.refresh(true);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

            },

            /** Security Incident Report */
            getSecurityIncidentData: function (requestId, kaustId) {
                var that = this;
                var urlRequestData = "/SecurityIncidentRequest/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        that.getView().setModel(oModelVScan, "SIncidentModel");
                        oModelVScan.refresh();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });
            },

            /** Port */
            getPortDetails: function (requestId) {
                var that = this;
                var urlRequestData = "/PortActivationRequest/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        sap.ui.getCore().byId('reqTypeId').setValue(data.requesttype);
                        // sap.ui.getCore().byId('subHeader').setText(data.Request_Type);
                        sap.ui.getCore().byId('idPortNo').setValue(data.port_tag_number);
                        sap.ui.getCore().byId('idPortNo').setTooltip(data.port_tag_number);
                        if (data.port_tag_number != 1) {
                            sap.ui.getCore().byId('serviceId').setVisible(true);
                            sap.ui.getCore().byId('idServType').setValue(data.service_type);
                            sap.ui.getCore().byId('idServType').setTooltip(data.service_type);
                        }
                        sap.ui.getCore().byId('idBul').setValue(data.l_building);
                        sap.ui.getCore().byId('idBul').setTooltip(data.l_building);
                        sap.ui.getCore().byId('idLevel').setValue(data.l_level);
                        sap.ui.getCore().byId('idLevel').setTooltip(data.l_level);
                        sap.ui.getCore().byId('idRoom').setValue(data.l_room);
                        sap.ui.getCore().byId('idRoom').setTooltip(data.l_room);
                        sap.ui.getCore().byId('ipAddress').setValue(data.ip_address); //andrea
                        that.disableAllPortFields();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

            },

            disableAllPortFields: function () {
                sap.ui.getCore().byId('reqTypeId').setEnabled(false);
                sap.ui.getCore().byId('idPortNo').setEnabled(false);
                sap.ui.getCore().byId('idServType').setEnabled(false);
                sap.ui.getCore().byId('idBul').setEnabled(false);
                sap.ui.getCore().byId('idLevel').setEnabled(false);
                sap.ui.getCore().byId('idRoom').setEnabled(false);
            },

            /** VPN Access for externals Process */
            getVPNDetails: function (requestId, listItem) {

                var oInternalModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oInternalModel, "oInternalModel");
                oInternalModel.setProperty("/ipVisible", false);
                oInternalModel.setProperty("/suggUserIdVisible", false);

                if (!jQuery.support.touch || jQuery.device.is.desktop) {
                    this.getView().addStyleClass("sapUiSizeCompact");
                }
                var oRequestModel = this.getView().getModel("oRequestModel");
                var that = this;
                var urlRequestData = "/VPNRequest/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "reqtypetext"
                    },
                    success: function (data, response) {
                        //thaj
                        // if (oDataModel.oData.d.results["0"].Stage == "AD Automation") {
                        //     oInternalModel.setProperty("/suggUserIdVisible", true);
                        //     sap.ui.getCore().byId('suggestedUserId').setValue(data.provisionedUserId); //andrea
                        //     if (data.isSugUserChng == "") {
                        //         sap.ui.getCore().byId('checkbox').setSelected(false); //andrea
                        //     } else {
                        //         sap.ui.getCore().byId('checkbox').setSelected(true);
                        //     } //andrea
                        // } else {
                        //     oInternalModel.setProperty("/suggUserIdVisible", false);
                        // }
                        //thaj
                        if (data != null) {
                            if (data.vpn_access == "X") {
                                sap.ui.getCore().byId("vpnType").setSelectedIndex(0);
                            } else {
                                sap.ui.getCore().byId("vpnType").setSelectedIndex(1);
                            }
                            if (data.requesttype === 1) {
                                sap.ui.getCore().byId('hostIpId').setValue(data.eipaddress);
                                oInternalModel.setProperty("/ipVisible", true);
                                oRequestModel.setProperty("/hostIpId", data.eipaddress);
                            }

                            if (data.dob_pass != null) {
                                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "MMM dd yyyy"
                                });
                                var dobDate = oDateFormat.format(new Date(data.dob_pass));

                                if (data.requesttype === 1) {
                                    sap.ui.getCore().byId('dob').setValue(dobDate);
                                }
                            }

                            if (data.vpnexpirydate != null) {
                                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "MMM dd yyyy"
                                });
                                var expiryDate = oDateFormat.format(data.vpnexpirydate);

                                if (data.requesttype === 1) {
                                    sap.ui.getCore().byId('expDateNew').setValue(expiryDate);
                                } else {
                                    sap.ui.getCore().byId('expiryDate').setValue(expiryDate);
                                }
                            }
                            sap.ui.getCore().byId('justification').setValue(data.justification);
                            //  sap.ui.getCore().byId('justification').setTooltip(data.Justification);
                            oRequestModel.setProperty("/justification", data.justification);

                            if (data.requesttype === 1) {
                                sap.ui.getCore().byId('eFname').setValue(data.efirst_name);
                                sap.ui.getCore().byId('eMname').setValue(data.emiddle_name);
                                sap.ui.getCore().byId('eLname').setValue(data.elast_name);
                                sap.ui.getCore().byId('eEmail').setValue(data.eemail);
                                oRequestModel.setProperty("/eFname", data.efirst_name);
                                oRequestModel.setProperty("/eMname", data.emiddle_name);
                                oRequestModel.setProperty("/eLname", data.elast_name);
                                oRequestModel.setProperty("/eEmail", data.eeMail);
                                //thaj var step = this.getStage(listItem.getCustomData());
                                // if (step == "Resolved" && data.provisioned_userid != "") {
                                //     sap.ui.getCore().byId('UIDSection').setVisible(true);

                                // thaj}
                            } else {
                                sap.ui.getCore().byId('adAccount').setValue(data.adid);
                                oRequestModel.setProperty("/adAccount", data.adid);
                                sap.ui.getCore().byId('renewType').setVisible(true);
                                sap.ui.getCore().byId('newType').setVisible(false);
                            }
                            sap.ui.getCore().byId('newOrRenew').setValue(data.reqtypetext.text);

                            //Thaj
                            // //For reading the data
                            // var url = "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId +
                            //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
                            // var oFileModel = new sap.ui.model.json.JSONModel();
                            // oFileModel.loadData(url, null, false);
                            // if (oFileModel.getData().d.results[0].URL != "") {
                            //     sap.ui.getCore().byId('fileSection').setVisible(true);
                            //     sap.ui.getCore().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
                            // }
                            //Thaj
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

            },

            /** Transfer Equipment */
            getTransferEquip: function (requestId, kaustId) {

                var that = this;
                var urlRequestData = "/Transferequipments/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "items"
                    },
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        sap.ui.getCore().byId("transferToForm").setModel(oModelVScan);
                        var items = data.items.results;
                        var sRepItem, sEquipnum;
                        items.forEach(function (item) {
                            if (!sRepItem) {
                                sRepItem = item.replenisheqip;
                            }
                            else {
                                sRepItem = sRepItem + '\n' + item.replenisheqip;
                            }
                            if (!sEquipnum) {
                                sEquipnum = item.equip_num;
                            }
                            else {
                                sEquipnum = sEquipnum + '\n' + item.equip_num;
                            }

                        });
                        sap.ui.getCore().byId("inputItem").setText(sRepItem);
                        sap.ui.getCore().byId("equipNo").setText(sEquipnum);
                        //Set the justification as comment model
                        that.setJustification(data, that);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

                this.getUserData(kaustId, requestId);
            },

            /** Replenish Equipment */
            getReplenishEquip: function (requestId, kaustId) {

                var that = this;
                var urlRequestData = "/Replenish/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        that.getView().setModel(oModelVScan);
                        sap.ui.getCore().byId("transferToForm").setVisible(false);
                        sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.replenisheqname);
                        //Set the justification as comment model
                        that.setJustification(data, that);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

                this.getUserData(kaustId, requestId);
            },

            /** Generic Email Creation */
            getGenEmail: function (requestId, kaustId) {
                var that = this;
                var urlRequestData = "/Email/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "item"
                    },
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        var reqType = oModelVScan.oData.requesttype;
                        sap.ui.getCore().byId("reqType").setText(oModelVScan.oData.requesttype);
                        if (reqType == "Generic Account") {
                            sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.remail);
                            sap.ui.getCore().byId("primeOwnBox").setText(oModelVScan.oData.owneremail);
                            sap.ui.getCore().byId("reqLogin").setVisible(false);
                            //call for delegates
                            var members = "";
                            var persons = data.item.results;

                            for (var i in persons) {
                                if (persons[i].delegates != "") {
                                    members = members + persons[i].delegates + ";";
                                }
                            }
                            sap.ui.getCore().byId("delegate").setText(members);
                        } else {
                            sap.ui.getCore().byId("emailTxt").setVisible(false);
                            sap.ui.getCore().byId("primeOwnBox").setVisible(false);
                            sap.ui.getCore().byId("delegate").setVisible(false);
                            sap.ui.getCore().byId("reqLogin").setText(oModelVScan.oData.ruserid);
                        }
                        sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.displayname);
                        that.getView().setModel(oModelVScan, "emailModel");

                        sap.ui.getCore().byId("descr").setText(oModelVScan.oData.accountdesc);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });
                this.getUserData(kaustId, requestId);

            },


            /**TER Access Process */
            getTERDetails: function (requestId) {
                if (!jQuery.support.touch || jQuery.device.is.desktop) {
                    this.getView().addStyleClass("sapUiSizeCompact");
                }
                //Ticket detail
                var that = this;
                var urlRequestData = "/TERRequest/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "members,pow,sow"
                    },
                    success: function (data, response) {
                        if (data != null) {
                            sap.ui.getCore().byId('workPermitId').setValue(data.workpermit);
                            sap.ui.getCore().byId('workPermitId').setTooltip(data.workpermit);
                            if (data.isreqtaccreq == "X") {
                                sap.ui.getCore().byId('partOfTeamId').setSelected(true);
                            }
                            if (data.isotherteamaccreq == "X") {
                                sap.ui.getCore().byId('othersId').setSelected(true);
                            }
                            if (data.members.results.length > 0) {
                                sap.ui.getCore().byId('othersId').setSelected(true);
                                sap.ui.getCore().byId('othersTblId').setVisible(true);

                                var pHistory = sap.ui.getCore().byId('othersTblId');
                                pHistory.unbindItems();
                                var oVmsLookupModel = new sap.ui.model.json.JSONModel();
                                oVmsLookupModel.setProperty("/results", data.members.results);
                                pHistory.setModel(oVmsLookupModel);
                                pHistory.bindAggregation("items", "/results", new sap.m.ColumnListItem({
                                    cells: [

                                        new sap.m.Text({
                                            text: "{kaustid}"
                                        }),
                                        new sap.m.Text({
                                            text: "{name}"
                                        })
                                    ]
                                }));
                            }

                            if (data.StartTime != "") {
                                //  var startDate = this.convertDateBack(parseInt(data.StartTime));
                                //  sap.ui.getCore().byId('startDateId').setValue(startDate);
                                // var startDateDisp = new Date(parseInt(data.StartTime)).toString();
                                // startDateDisp = startDateDisp.split(":00 ");
                                // sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
                                var startDateDisp = that.convertTime(data.starttime);
                                sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
                            }
                            if (data.startdate != "") {
                                var diff = data.enddate - data.startDate;
                                if (diff == 0) {
                                    sap.ui.getCore().byId('endDateId').setValue("Same day");
                                } else {
                                    sap.ui.getCore().byId('endDateId').setValue("Next day");
                                }
                            }

                            sap.ui.getCore().byId('buildingId').setValue(data.l_building);
                            sap.ui.getCore().byId('levelSelId').setValue(data.l_level);
                            sap.ui.getCore().byId('terRoomId').setText(data.l_room);

                            sap.ui.getCore().byId('buildingId').setTooltip(data.l_building);
                            sap.ui.getCore().byId('levelSelId').setTooltip(data.l_level);
                            sap.ui.getCore().byId('terRoomId').setTooltip(data.l_room);

                            var result = that.getFields(data.sow.results, "sow");
                            if (result.indexOf("Power Activity/ Survey") != -1) {
                                sap.ui.getCore().byId('powerActId').setSelected(true);
                                var resultObject = that.search("Power Activity/ Survey", data.sow.results);
                                sap.ui.getCore().byId('pwrLbl').setVisible(true);
                                this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn", {
                                    buttons: [
                                        new sap.m.RadioButton({
                                            text: "No"
                                        }),
                                        new sap.m.RadioButton({
                                            text: "Yes"
                                        })
                                    ],
                                    enabled: false
                                });
                                var vBox = sap.ui.getCore().byId("pwrActVbox").insertItem(this.radioBtn, 2);
                                sap.ui.getCore().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.power_backup));
                            }
                            if (result.indexOf("A/C Maintenance") != -1) {
                                sap.ui.getCore().byId('acMaintId').setSelected(true);
                            }
                            if (result.indexOf("TER Cleaning") != -1) {
                                sap.ui.getCore().byId('terCleanId').setSelected(true);
                            }
                            if (result.indexOf("Cable Pulling and Testing") != -1) {
                                sap.ui.getCore().byId('cblChkId').setSelected(true);
                                sap.ui.getCore().byId('cblAgreeId').setVisible(true);
                                sap.ui.getCore().byId('cblAgreeId').setSelected(true);
                            }
                            if (result.indexOf("HSE Inspection") != -1) {
                                sap.ui.getCore().byId('hseInspectId').setSelected(true);
                            }
                            if (result.indexOf("Others") != -1) {
                                sap.ui.getCore().byId('otherChkId').setSelected(true);
                                var resultObject = that.search("Others", data.sow.results);
                                sap.ui.getCore().byId('othersTextId').setVisible(true);
                                sap.ui.getCore().byId('othersTextId').setValue(resultObject.sow_comments);
                                sap.ui.getCore().byId('othersTextId').setTooltip(resultObject.sow_comments);
                            }
                            if (data.powerinterrupt == "X") {
                                sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(1);
                                sap.ui.getCore().byId('pwrChkBoxId').setVisible(true);
                                var powRes = data.pow.results;
                                if (powRes.length > 0) {
                                    for (var i = 0; i < powRes.length; i++) {
                                        if (powRes[i].circuittype == "PR") {
                                            sap.ui.getCore().byId('prCbId').setSelected(true);
                                            sap.ui.getCore().byId('inpPrId').setVisible(true);
                                            sap.ui.getCore().byId('inpPrId').setValue(powRes[i].equipmentnumbner);
                                            sap.ui.getCore().byId('inpPrId').setTooltip(powRes[i].equipmentnumbner);
                                        }
                                        if (powRes[i].circuittype == "BPR") {
                                            sap.ui.getCore().byId('brCbId').setSelected(true);
                                            sap.ui.getCore().byId('inpBrId').setVisible(true);
                                            sap.ui.getCore().byId('inpBrId').setValue(powRes[i].equipmentnumbner);
                                            sap.ui.getCore().byId('inpBrId').setTooltip(powRes[i].equipmentnumbner);
                                        }
                                        if (powRes[i].circuittype == "EPR") {
                                            sap.ui.getCore().byId('eprCbId').setSelected(true);
                                            sap.ui.getCore().byId('inpEcId').setVisible(true);
                                            sap.ui.getCore().byId('inpEcId').setValue(powRes[i].equipmentnumbner);
                                            sap.ui.getCore().byId('inpEcId').setTooltip(powRes[i].equipmentnumbner);
                                        }
                                    }
                                }
                            } else {
                                sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(parseInt(data.powerinterrupt));
                            }
                            sap.ui.getCore().byId("acIntRadioGrpId").setSelectedIndex(parseInt(data.ac_interruption));
                            if (data.ac_interruption == "2") {
                                sap.ui.getCore().byId('acAgreeId').setSelected(true);
                                sap.ui.getCore().byId('acAgreeId').setVisible(true);
                            }

                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });


                // // User Detail Model
                // var that = this;
                // var oUserModel = new sap.ui.model.json.JSONModel();
                // oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null,
                //     true);
                // oUserModel.attachRequestCompleted(function (oEvent) {
                //     if (oEvent.getParameter("success")) {
                //         that.getView().setModel(oUserModel, "oUserModel");
                //     }
                // });
                // oUserModel.attachRequestFailed(function (oEvent) {
                //     sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
                //         title: "Failed to load User Detail",
                //         onClose: null,
                //         textDirection: sap.ui.core.TextDirection.Inherit
                //     });
                // });
            },

            /**
	 * Fetch the details for Admin Rights Process  
	 **/
            getAdminAccessDetails: function (requestId) {
                var that = this;
                var urlRequestData = "/AdminRightsReq/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "header"
                    },
                    success: function (data, response) {
                        var oPortModel = new sap.ui.model.json.JSONModel();
                        // var oPortModel = that.getView().setModel("oPortModel");
                        if (data.custodian_usrid) {
                            that.getAdminUserDetail(data.custodian_usrid, that);
                        }

                        if (data.header.request_type === "Custodian") {
                            oPortModel.setProperty("/iCustodianRB", 0);
                            sap.ui.getCore().byId("custodianName").setVisible(false);
                        } else {
                            oPortModel.setProperty("/iCustodianRB", 1);
                        }

                        oPortModel.setProperty("/tagNumber", data.tagnumber);
                        oPortModel.setProperty("/sJustText", data.justification);
                        oPortModel.setProperty("/IP", data.linux_ip);
                        oPortModel.setProperty("/userKaustID", data.userid_ext);
                        var aOperSys = data.operatingsys.split(",");
                        aOperSys.forEach(function (oEle) {
                            oEle === "Windows" ? sap.ui.getCore().byId("idWinCB").setSelected(true) : oEle === "Mac" ? sap.ui.getCore().byId("idMacCB").setSelected(
                                true) : sap.ui.getCore().byId("idLinuxCB").setSelected(true);
                        });


                        if (aOperSys[0] === "Linux") {
                            oPortModel.setProperty("/bIpVisible", true);
                            oPortModel.setProperty("/userIDVisible", true);
                            oPortModel.setProperty("/idExpiryDate", false);
                        } else {
                            oPortModel.setProperty("/bIpVisible", false);
                            oPortModel.setProperty("/userIDVisible", false);
                            oPortModel.setProperty("/idExpiryDate", false);

                        }
                        oPortModel.setProperty("/Onbehalf", data.header.on_behalf);
                        oPortModel.setProperty("/selectedOperSys", aOperSys);
                        oPortModel.setProperty("/comments", data.comments);
                        oPortModel.setProperty("/bWinEnable", false);
                        oPortModel.setProperty("/bMacEnable", false);
                        oPortModel.setProperty("/bLinuxEnable", false);
                        oPortModel.setProperty("/bEnableFields", false);
                        oPortModel.setProperty("/bTagSelect", false);
                        oPortModel.setProperty("/bTagInpEnable", false);
                        oPortModel.setProperty("/bTagInput", true);
                        oPortModel.setProperty("/bIPEnable", false);
                        oPortModel.setProperty("/userIDEnable", false);
                        that.getView().setModel(oPortModel, "oPortModel");
                        oPortModel.refresh();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

            },

            getAdminUserDetail: function (kaustId, that) {
                var dataModel = new sap.ui.model.json.JSONModel();
                if (kaustId) {
                    var aFilters = this.getFilter(kaustId);
                    var sRequestURL = "/userDetailsSet";
                    var oHanaModel = that.getOwnerComponent().getModel("oHanaModel");
                    oHanaModel.read(sRequestURL, null, null, false, {
                        filters: aFilters,
                        urlParameters: {
                            "$expand": "UserDetailsToDependentDetails"
                        },
                        success: function (oData, oResponse) {
                            var data = oData.results[0];
                            var custodainName = data.FirstName + " " + data.LastName;
                            sap.ui.getCore().byId("custodianName").setVisible(true);
                            sap.ui.getCore().byId("custodianName").setText(custodainName);

                        },
                        error: function (data, textStatus, XMLHttpRequest) {

                        }
                    });
                }
            },

            getDataCenterDetails: function (requestId, detailsFragment) {
                var that = this;
                var urlRequestData = "/ReqHeader/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "DCWPDetail,DCWPManpower"
                    },
                    success: function (data, response) {

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

            },

            /** Sponsorship transfer Staff / Student **/
            getDSTDetails: function (sRequestId, oSubCode) {
                var requestId = sRequestId;
                var that = this;
                var oView = sap.ui.getCore();
                oView.byId("DSTPrefBody").setVisible(false);
                oView.byId("DSTTracking").setVisible(false);
                oView.byId("DSTReject").setVisible(false);
                var PrefJson;
                var EmpJson;
                var DSTJson;
                var JobJson;
                var DSTAttJson;


                var that = this;
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/SponsorshiptransferSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,GAHeader"
                    },
                    success: function (data, response) {
                        var dstReqModel = new sap.ui.model.json.JSONModel();
                        dstReqModel.setData(data);
                        DSTJson = data;
                        // Populate Sponsorship Transfer Details - Staff / Student - Begin
                        if (oSubCode == "0413") {
                            oView.byId("dst_firstname").setText(DSTJson.cand_first_name);
                            oView.byId("dst_middlename").setText(DSTJson.cand_middle_name);
                            oView.byId("dst_lastname").setText(DSTJson.cand_last_name);
                            oView.byId("dst_arfirstname").setText(DSTJson.ar_first_name);
                            oView.byId("dst_armiddlename").setText(DSTJson.ar_middle_name);
                            oView.byId("dst_arlastname").setText(DSTJson.ar_last_name);
                            oView.byId("dst_iqama").setText(DSTJson.can_iqama_no);
                            oView.byId("dst_costcenter").setText(DSTJson.GAHeader.costcenter);
                            oView.byId("dst_nation").setText(DSTJson.nationality);
                            oView.byId("dst_religion").setText(DSTJson.religion);
                            oView.byId("dst_currsponsornum").setText(DSTJson.sponsor_number);
                            oView.byId("dst_currsponsorname").setText(DSTJson.sponsor_name);
                            oView.byId("dst_arcurrsponsorname").setText(DSTJson.sponsor_name_ar);
                            oView.byId("dst_newsponsornum").setText(DSTJson.new_spnsr_name);
                            oView.byId("dst_newsponsorname").setText(DSTJson.new_spnsr_name);
                            oView.byId("dst_arnewsponsorname").setText(DSTJson.new_spnsr_name_ar);

                            // var dps_Dob = DSTJson.Dob.split("T")[0];
                            // if (dps_Dob) {
                            //     var chdd = dps_Dob.split("-");
                            //     var ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
                            //     oView.byId("dst_birthdate").setText(ch_dt);
                            // }
                            if (DSTJson.dob) {
                                var startDate = that.convertDateBack(DSTJson.dob);
                            }

                            // for (var i = 0; i < JobJson.results.length; i++) {
                            //     if (JobJson.results[i].MhnCodeAll == DSTJson.JobTitle) {
                            //         oView.byId("dst_currjobtitle").setText(JobJson.results[i].MhnNameLatini);
                            //         oView.byId("dst_arcurrjobtitle").setText(JobJson.results[i].MhnName);
                            //         i = JobJson.results.length + 2;
                            //     }
                            // }

                            // for (var i = 0; i < JobJson.results.length; i++) {
                            //     if (JobJson.results[i].MhnCodeAll == DSTJson.NewJobTitle) {
                            //         oView.byId("dst_newjobtitle").setText(JobJson.results[i].MhnNameLatini);
                            //         oView.byId("dst_arnewjobtitle").setText(JobJson.results[i].MhnName);
                            //         i = JobJson.results.length + 2;
                            //     }
                            // }

                            if (DSTJson.job_change == "X") {
                                oView.byId("dst_jobchange").setText("Yes");
                                oView.byId("dst_vbnewjob").setVisible(true);
                                oView.byId("dst_vbennewjob").setVisible(true);
                                oView.byId("dst_vbarnewjob").setVisible(true);
                            } else {
                                oView.byId("dst_jobchange").setText("No");
                                oView.byId("dst_vbnewjob").setVisible(false);
                                oView.byId("dst_vbennewjob").setVisible(false);
                                oView.byId("dst_vbarnewjob").setVisible(false);
                            }

                            // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                            //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     var attachModel = new sap.ui.model.json.JSONModel();
                            //     attachModel.setData(data);
                            //     DSTAttJson = data;
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // if (DSTAttJson.results.length > 0) {
                            //     for (var i = 0; i < DSTAttJson.results.length; i++) {
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "RELEASE_LETTER_KAUST") {
                            //             oView.byId("idDSTatt1").setText("Release Letter to KAUST");
                            //             oView.byId("idDSTatt1").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
                            //             oView.byId("idDSTatt2").setText("NOL to Passport");
                            //             oView.byId("idDSTatt2").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "IQAMA") {
                            //             oView.byId("idDSTatt3").setText("Iqama");
                            //             oView.byId("idDSTatt3").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "PASSPORT") {
                            //             oView.byId("idDSTatt4").setText("Passport");
                            //             oView.byId("idDSTatt4").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "ATTESTED_DEGREE") {
                            //             oView.byId("idDSTatt5").setText("Attested Degree");
                            //             oView.byId("idDSTatt5").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //         if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "TRANSLATED_DEGREE") {
                            //             oView.byId("idDSTatt6").setText("Translated Degree");
                            //             oView.byId("idDSTatt6").setHref(DSTAttJson.results[i].URL);
                            //         }
                            //     }
                            // }

                            if (DSTJson.header.status === 11) {
                                oView.byId("DSTReject").setVisible(true);
                                oView.byId("iddstfincomments").setText(DSTJson.GAHeader.fincomments);
                            }

                            oView.byId("idDSTCollection").setSelectedIndex(0);
                            if (DSTJson.collection_mtd != null && DSTJson.collection_mtd == "1") {
                                oView.byId("idDSTCollection").setSelectedIndex(1);
                                oView.byId("DSTPrefBody").setVisible(true);
                                oView.byId("DSTTracking").setVisible(true);
                            }

                            oView.byId("idDSTDelivery").setSelectedIndex(0);
                            if (DSTJson.delivery_mtd != null && DSTJson.delivery_mtd == "1") {
                                oView.byId("idDSTDelivery").setSelectedIndex(1);
                                oView.byId("DSTPrefBody").setVisible(true);
                                oView.byId("DSTTracking").setVisible(true);
                            }

                            // oView.byId("dstcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
                            // oView.byId("dstcpdkaustid").setText(PrefJson.KaustID);
                            // oView.byId("dstcpdmobile").setText(PrefJson.Mobile);
                            // oView.byId("dstcpdbldno").setText(PrefJson.BuildingNo);
                            // oView.byId("dstcpdlevel").setText(PrefJson.levelb);
                            // oView.byId("dstcpdbldname").setText(PrefJson.BuildingName);
                            oView.byId("idDSTTrackingNum").setText(DSTJson.tracking_id);
                            // Populate DST Details - End

                            // // Populate Comments Details - Begin    
                            // var oDataApproverModel = new sap.ui.model.json.JSONModel();
                            // oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
                            //     "'&$format=json", null, false);
                            // var data = oDataApproverModel.getData().d.results;
                            // oDataApproverModel.setData(data);
                            // this.getView().setModel(oDataApproverModel, "GAComments");

                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },


            //     var oExpeditor = DSTJson.Expeditor;
            //     if(oExpeditor.length > 0) {
            //     var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
            //     oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
            //         var expeditorModel = new sap.ui.model.json.JSONModel();
            //         expeditorModel.setData(data);
            //         oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
            //     },
            //         function (response) {
            //             return "";
            //         });
            //     //      oExpeditor = that.getExpeditorDetails(oExpeditor);
            //     oView.byId("idDSTExpeditor").setText(oExpeditor);
            // }





            getStatus: function (requestId, kaustId, status, subService, subServiceCode) {
                var objId = sap.ui.getCore().byId("idObj");
                if (objId) {
                    objId.destroy();
                }
                var objHeader = new sap.m.ObjectHeader("idObj", {
                    title: requestId,
                    number: kaustId
                });

                var firstStatus = new sap.m.ObjectStatus({
                    text: subService
                });
                objHeader.addStatus(firstStatus);

                if (status == "Rejected") {
                    var text = "";
                    var model = "";
                    var modelData = "";
                    if (subService == "Transfer Equipment") {
                        model = this.getView().getModel("transferModel");
                        modelData = model.getData();
                        if (modelData.Stage == 'Recipient Line Manager Approval') {
                            text = "Reason: " + model.oData.Recmannotes;
                        } else if (modelData.Stage == 'Line Manager Approval') {
                            text = "Reason: " + model.oData.mcomments;
                        } else {
                            text = "Reason: " + model.oData.Empnote;
                        }
                        var attribute = new sap.m.ObjectAttribute({
                            text: text,
                            tooltip: text
                        });
                        attribute.addStyleClass("redText");
                        objHeader.addAttribute(attribute);

                    } else if (subService == "TER Access Process") {
                        var data = this.getView().getModel("oDataModel").getData().d.results[0];
                        var text = "Reason: " + data.itncTeamComments;
                        var attribute = new sap.m.ObjectAttribute({
                            text: text,
                            tooltip: text
                        });
                        attribute.addStyleClass("redText");
                        objHeader.addAttribute(attribute);
                        return objHeader;
                    } else if (subService == "VPN Access for externals Process") {
                        var text;
                        var vpnData = this.getView().getModel("oDataModel").getData().d.results[0];
                        //        if(vpnData.Stage == "Info Sec Manager")
                        //          {
                        //          text = "Reason: " + vpnData.secManagerComments;
                        //          }
                        //        else 
                        if (vpnData.secManagerComments) {
                            text = "Reason: " + vpnData.secManagerComments;
                        }
                        if (vpnData.msgTeamComments) {
                            text = "Reason: " + vpnData.msgTeamComments;
                        }

                        var attribute = new sap.m.ObjectAttribute({
                            text: text,
                            tooltip: text
                        });
                        attribute.addStyleClass("redText");
                        objHeader.addAttribute(attribute);
                        return objHeader;
                    } else if (subService == "Data Center Access Process") {
                        //        var requestId = this.getView().getModel("dataCenter").getData().d.results[0].RequestId;
                        //        var oDataApproverModel = new sap.ui.model.json.JSONModel();
                        //        oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
                        //        var cdata = oDataApproverModel.getData().d.results;
                        //
                        //
                        var data = this.getView().getModel("dataCenter").getData().d.results[0];
                        //         if(cdata.Stage == data.stage)
                        //           {
                        //            data.comments = cdata[]
                        //           }
                        if (data.comments) {
                            var attribute = new sap.m.ObjectAttribute({
                                text: "Reason: " + data.comments,
                                tooltip: "Reason: " + data.comments
                            });

                        }
                        attribute.addStyleClass("redText");
                        objHeader.addAttribute(attribute);
                        return objHeader;
                    } else if (subService == "Admin Rights Process") {
                        var data = this.getView().getModel("adminModel").getData().d.results[0];
                        if (data.comments) {
                            var attribute = new sap.m.ObjectAttribute({
                                text: "Reason: " + data.comments,
                                tooltip: "Reason: " + data.comments
                            });

                        }
                        attribute.addStyleClass("redText");
                        objHeader.addAttribute(attribute);
                        return objHeader;
                    } else if (subService === "Audio Visual Services") {
                        var oAVData = this.getView().getModel("confRoomModel").getData();
                        if (oAVData.comments) {
                            var attribute = new sap.m.ObjectAttribute({
                                text: "Reason: " + oAVData.comments,
                                tooltip: "Reason: " + oAVData.comments
                            });
                            attribute.addStyleClass("redText");
                            objHeader.addAttribute(attribute);
                            return objHeader;
                        }
                    }
                    // GASC Modules: Started - Darshna
                    if (subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode == "0303" || subServiceCode == "0402" || subServiceCode ==
                        "0105" || subServiceCode == "0401" || subServiceCode == "0207" || subServiceCode == "0501" || subServiceCode == "0302" ||
                        subServiceCode == "0206" || subServiceCode == "0205" || subServiceCode == "1706" || subServiceCode == "1707" || subServiceCode ==
                        "0502" || subServiceCode == "1703" || subServiceCode == "1702" || subServiceCode == "0101" || subServiceCode == "0503" || subServiceCode == "0505" ||
                        subServiceCode == "0506" || subServiceCode == "0304" || subServiceCode == "0204") // || 
                    //        subServiceCode == "1708" || subServiceCode == "1709" || subServiceCode == "1704" || subServiceCode == "0104" || subServiceCode == "0504" || 
                    //        subServiceCode == "1701" || subServiceCode == "1705" || subServiceCode == "1912" || subServiceCode == "0504") 
                    {
                        if ((this.getView().getModel("GAComments").getData().length) > 0) {
                            var oLen = this.getView().getModel("GAComments").getData().length;
                            var text = "Reason: " + this.getView().getModel("GAComments").getData()[oLen - 1].Comments;
                            var attribute = new sap.m.ObjectAttribute({
                                text: text
                            });
                            attribute.addStyleClass("redText");
                            objHeader.addAttribute(attribute);
                        } else {
                            var text = "Reason: Rejected by Approver";
                            var attribute = new sap.m.ObjectAttribute({
                                text: text
                            });
                            attribute.addStyleClass("redText");
                            objHeader.addAttribute(attribute);
                        }
                    }
                    // GASC Modules: Ended
                    else {
                        if (subServiceCode != "1708" && subServiceCode != "1709" && subServiceCode != "1704" && subServiceCode != "0104" &&
                            subServiceCode != "0504" && subServiceCode != "1701" && subServiceCode != "1705" && subServiceCode != "1912" &&
                            subServiceCode != "0507" && subServiceCode != "0102" && subServiceCode != "0202" && subServiceCode != "9202" &&
                            subServiceCode != "0211" && subServiceCode != "8211" && subServiceCode != "9211" && subServiceCode != "0203" &&
                            subServiceCode != "0306" && subServiceCode != "0310" && subServiceCode != "0413" && subServiceCode != "0414" &&
                            subServiceCode != "0415" && subServiceCode != "0416" && subServiceCode != "0208" && subServiceCode != "0103" &&
                            subServiceCode != "9103" && subServiceCode != "0502" && subServiceCode != "0505" && subServiceCode != "0501") {
                            model = this.getView().getModel("IqamaDetailsModel");
                            modelData = model.oData[0];
                            if (modelData.Comments == undefined || modelData.Comments == null || modelData.Comments == '') {
                                if (modelData.FinComments == undefined || modelData.FinComments == null || modelData.FinComments == '') {
                                    text = "Reason: " + model.oData[0].GAComments;
                                } else {
                                    text = "Reason: " + model.oData[0].FinComments;
                                }

                            } else {
                                text = "Reason: " + model.oData[0].Comments;
                                //      var text = "Reason: " + model.oData[0].Comments;
                                //var text = "Reason: " + model.oData[0].Comments;
                                var attribute = new sap.m.ObjectAttribute({
                                    text: text
                                });
                                attribute.addStyleClass("redText");
                                objHeader.addAttribute(attribute);
                            }
                        }
                    }

                } else {
                    var attribute = new sap.m.ObjectAttribute({
                        text: status
                    });
                    objHeader.addAttribute(attribute);
                }
                return objHeader;
            },

            convertDateBack: function (date) {
                var time = new Date(date);
                var yyyy = time.getFullYear();
                var mm = time.getMonth() + 1;
                var dd = time.getDate();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var result = mm + "/" + dd + "/" + yyyy;
                return result;
            },

            convertTime: function (time) {
                var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" });
                var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));
                return timeStr;
            },


            getUserData: function (kaustId, requestId) {
                var form = sap.ui.getCore().byId("userInfoForm");
                if (!form) {
                    return;
                }
                var that = this;
                if (kaustId) {
                    var aFilters = this.getFilter(kaustId);
                    var dataModel = new sap.ui.model.json.JSONModel();
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
                            var data = {
                                d: oData.results[0]
                            }
                            dataModel.setData(data);
                            form.setModel(dataModel);
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
                }
            },
            getFilter: function (kaustId) {
                {
                    var aFilters = [],
                        aFilterIds = ["UserType", "KaustID", "DisplayDependents"],
                        aFilterValues = ["STUDENT", kaustId, "X"],
                        i;
                    for (i = 0; i < aFilterIds.length; i = i + 1) {
                        aFilters.push(new Filter(aFilterIds[i], FilterOperator.EQ, aFilterValues[i], ""));

                    }
                    return aFilters;

                };
            },

            /** Birth Certificate **/
            getBirthCertificate: function (requestId, oSubCode) {
                sap.ui.getCore().byId("idBCInfo").setVisible(true);
                var that = this;
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "BirthCertificate,header"
                    },
                    success: function (data, response) {

                        var hcDetails = data.BirthCertificate;
                        var odetails = data.BirthCertificate.results[0];

                        //Get the country name
                        var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                        var nations = oBCModel.getData();
                        if (nations) {
                            for (var nt = 0; nt < hcDetails.length; nt++) {
                                for (var ct = 0; ct < nations.length; ct++) {
                                    if (hcDetails[nt].Bcountry === nations[ct].LAND1) {
                                        rdata.results[0].HeaderToBC.results[nt].bcountry = nations[ct].LANDX;
                                    }
                                }
                            }
                        }

                        var oBCJson = new sap.ui.model.json.JSONModel();
                        oBCJson.setData(data.BirthCertificate);
                        sap.ui.getCore().setModel(oBCJson, "oBCJson");
                        that.getView().setModel(oBCJson, "oBCJson");
                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.delivery_mtd));
                        if (odetails.delivery_mtd === "1") { //|| odetails.Collectionmtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }


                        // that.__setBCCountryModel(hcDetails, that)

                    }

                });

                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);

                //     var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
                //     filesData.read("/FileRead?$filter=UNIQUE_ID eq '" + requestId +
                //         "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '13'", {
                //         async: false,
                //         success: function (oData) {
                //             data = oData.results;
                //             var seqnums = [];
                //             for (var bc = 0; bc < data.length; bc++) {
                //                 seqnums.push(data[bc].FILENAME.split("-")[1]);
                //             }
                //             var uniqueNames = [];
                //             $.each(seqnums, function (i, el) {
                //                 if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
                //             });
                //             for (bc = 0; bc < uniqueNames.length; bc++) {
                //                 var u = "";
                //                 for (var h = 0; h < data.length; h++) {
                //                     var filename = data[h].FILENAME.split("-");
                //                     if (filename[1] === uniqueNames[bc]) {
                //                         if (filename[0] === "ARABIC") {
                //                             u = u + "<a href=" + data[h].URL + "><strong>Arabic Notice</strong></a><br>";
                //                         } else if (filename[0] === "ENGLISH") {
                //                             u = u + "<a href=" + data[h].URL + "><strong>English Notice</strong></a><br>";
                //                         }
                //                     }
                //                 }
                //                 rdata.results[0].HeaderToBC.results[bc].url = u;
                //                 rdata.results[0].HeaderToBC.results[bc].birthDate = t.convertDateBack(rdata.results[0].HeaderToBC.results[bc].birthDate);
                //             }
                //         }
                //     });
                //     var oBCJson = new sap.ui.model.json.JSONModel();
                //     oBCJson.setData(rdata.results[0].HeaderToBC);
                //     sap.ui.getCore().setModel(oBCJson, "oBCJson");
                //     t.getView().setModel(oBCJson, "oBCJson");
                // }, function (response) {
                //     return "";
                // });

            },

            /** Set BC Country Model*/
            __setBCCountryModel: function (hcDetails, that) {
                var oCountryModel = that.getOwnerComponent().getModel("oCountryModel");
                var sRequestURL = "/COUNTRY";
                oCountryModel.read(sRequestURL, {
                    success: function (oData, response) {
                        var nations = oData.results;
                        var aBC = hcDetails.results;
                        for (var nt = 0; nt < hcDetails.length; nt++) {
                            for (var ct = 0; ct < nations.length; ct++) {
                                if (hcDetails[nt].birth_country === nations[ct].LAND1) {
                                    aBC[nt].bcountry = nations[ct].LANDX;
                                }
                            }
                        }
                        hcDetails.results = aBC;
                        var oBCJson = new sap.ui.model.json.JSONModel();
                        oBCJson.setData(hcDetails);
                        sap.ui.getCore().setModel(oBCJson, "oBCJson");
                        that.getView().setModel(oBCJson, "oBCJson");

                    }
                });

            },

            /** Set BC History */
            __setBCHistoryModel: function (requestId, that) {
                if (requestId) {
                    var oGAModel = that.getOwnerComponent().getModel("oGAModel");
                    var sRequestURL = "/Requestlog";
                    oGAModel.read(sRequestURL, {
                        headers: {
                            "request_id": requestId
                        },
                        success: function (oData, response) {
                            var data = new sap.ui.model.json.JSONModel();
                            data.setData({
                                historyInfo: oData.results
                            });
                            that.getView().setModel(data, "histData");
                        }

                    });
                }
            },

            /** Fetch the cmoments given for the request */
            __setBCCommentModel: function (requestId, that) {
                if (requestId) {
                    requestId = "0020005719";
                    var oGAModel = that.getOwnerComponent().getModel("oGAModel");
                    var oAVCommModel = new sap.ui.model.json.JSONModel();
                    var sRequestURL = "/CommentSet";
                    oGAModel.read(sRequestURL, {
                        headers: {
                            "request_id": requestId
                        },

                        success: function (oData, response) {
                            var data = new sap.ui.model.json.JSONModel();
                            data.setData({
                                CommentsInfo: oData.results
                            });
                            that.getView().setModel(data, "commentData");

                        }

                    });
                }
            },

            // Information Correction - start 
            getInfoCorrect: function (requestId, oSubCode) {
                var that = this;
                sap.ui.getCore().byId("idInfoCrt").setVisible(true);
                var odetails;
                var nations, religions;

                // Nationality
                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();

                // // Nation                
                // nations = [{
                //     "LAND1": "IN",
                //     "LANDX": "India"
                // }];

                // Religion                
                religions = [{
                    "key": "1",
                    "text": "Muslim"
                }, {
                    "key": "2",
                    "text": "Non-Muslim"
                }];


                //Info Correction
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "InfoCorrection,header"
                    },
                    success: function (oData, response) {
                        if (oSubCode === "0402") {
                            var dataIC = oData.InfoCorrection.results;
                            var oICJson = new sap.ui.model.json.JSONModel();
                            oICJson.setData(oData.InfoCorrection);
                            odetails = oData.InfoCorrection.results[0];
                            for (var i = 0; i < oData.InfoCorrection.results.length; i++) {
                                if (dataIC[i].relationship === "") {
                                    dataIC[i].relationship = "Self";
                                }
                                var fie = "",
                                    doc = "";
                                var a = dataIC[i].ck_arabic_name === 'X' ? 'Name Arabic' : '';
                                var b = dataIC[i].ck_english_name === 'X' ? 'Name English' : '';
                                var c = dataIC[i].ck_dob === 'X' ? 'Date of Birth' : '';
                                var d = dataIC[i].ck_nationality === 'X' ? 'Nationality' : '';
                                var e = dataIC[i].ck_religion === 'X' ? 'Religion' : '';
                                var f = dataIC[i].ck_babyname === 'X' ? 'Baby Name' : '';
                                var g = dataIC[i].ck_pob === 'X' ? 'Place of Birth' : '';
                                var h = dataIC[i].ck_maritalstatus === 'X' ? 'Marital Status' : '';
                                var d1 = dataIC[i].select_iqama === 'X' ? 'Iqama' : '';
                                var d2 = dataIC[i].select_drvlic === 'X' ? 'Driving License' : '';
                                var d3 = dataIC[i].select_bc === 'X' ? 'Birth Certificate' : '';
                                if (nations) {
                                    for (var kk = 0; kk < nations.length; kk++) {
                                        if (dataIC[i].nationality === nations[kk].LAND1) {
                                            dataIC[i].Nation = nations[kk].LANDX;
                                        }
                                    }
                                }
                                for (var ij = 0; ij < religions.length; ij++) {
                                    if (dataIC[i].religion === religions[ij].key) {
                                        dataIC[i].Region = religions[ij].text;
                                    }
                                }
                                var data = "";
                                if (a) {
                                    fie = fie + '\n' + a;
                                    data = data + '<br>' + a + ' : <strong>' + dataIC[i].arabic_name + '</strong>';
                                }
                                if (b) {
                                    fie = fie + '\n' + b;
                                    data = data + '<br>' + b + ' : <strong>' + dataIC[i].english_name + '</strong>';
                                }
                                if (c) {
                                    fie = fie + '\n' + c;
                                    if (dataIC[i].dob === "00000000") {
                                        dataIC[i].dob = "";
                                    }
                                    if (dataIC[i].dob != "00000000") {
                                        data = data + '<br>' + c + ' : <strong>' + that.convertDateBack(dataIC[i].dob) + '</strong>';
                                    }
                                }
                                if (d) {
                                    fie = fie + '\n' + d;
                                    data = data + '<br>' + d + ' : <strong>' + (dataIC[i].Nation ? dataIC[i].Nation : "") + '</strong>';
                                }
                                if (e) {
                                    fie = fie + '\n' + e;
                                    data = data + '<br>' + e + ' : <strong>' + (dataIC[i].Region ? dataIC[i].Region : "") + '</strong>';
                                }
                                if (f) {
                                    fie = fie + '\n' + f;
                                    data = data + '<br>' + f + ' : <strong>' + dataIC[i].babyname + '</strong>';
                                }
                                if (g) {
                                    fie = fie + '\n' + g;
                                    data = data + '<br>' + g + ' : <strong>' + dataIC[i].pob + '</strong>';
                                }
                                if (h) {
                                    fie = fie + '\n' + h;
                                    data = data + '<br>' + h + ' : <strong>' + dataIC[i].maritalstatus + '</strong>';
                                }
                                if (d1) {
                                    doc = doc + '\n' + d1;
                                }
                                if (d2) {
                                    doc = doc + '\n' + d2;
                                }
                                if (d3) {
                                    doc = doc + '\n' + d3;
                                }
                                dataIC[i].Fields = fie ? fie.substring(1) : fie;
                                dataIC[i].document_type = doc ? doc.substring(1) : doc;
                                dataIC[i].data = data ? data.substring(4) : data;
                            }
                            that.getView().setModel(oICJson, "oICJson");
                            sap.ui.getCore().setModel(oICJson, "oICJson");
                            sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.delivery_mtd));
                            sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.collection_mtd));
                            if (odetails.delivery_mtd === "1" || odetails.collection_mtd === "1") {
                                sap.ui.getCore().byId("idUpsForm").setVisible(true);
                            } else {
                                sap.ui.getCore().byId("idUpsForm").setVisible(false);
                            }
                        }
                    }

                });
                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);

            },

            //Transfer of Information
            getTransferInfo: function (requestId, oSubCode) {

                var that = this;

                sap.ui.getCore().byId("idTransferInfo").setVisible(true);
                var odetails;
                var nations, religions;

                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();


                // // Nation                
                // nations = [{
                //     "LAND1": "IN",
                //     "LANDX": "India"
                // }];

                // Religion                
                religions = [{
                    "key": "1",
                    "text": "Muslim"
                }, {
                    "key": "2",
                    "text": "Non-Muslim"
                }];


                //Transfer Information
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "Iqama,header"
                    },
                    success: function (oData, response) {
                        if (oSubCode === "0401") {
                            var oICJson = new sap.ui.model.json.JSONModel();
                            oICJson.setData(oData.Iqama);
                            odetails = oData.Iqama.results[0];
                            var idata = oData.Iqama.results;

                            // var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
                            // var urlFile2 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
                            //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
                            // var data = "";
                            // filesData.read(urlFile2, {
                            //     async: false,
                            //     success: function (oData1, response) {
                            //         data = oData1.results;
                            //     }
                            // });
                            var attachs = [];
                            var urls = "";

                            for (var it = 0; it < idata.length; it++) {
                                if (nations) {
                                    for (var c = 0; c < nations.length; c++) {
                                        if (idata[it].country_of_issue === nations[c].LAND1) {
                                            idata[it].CountryOfIssue = nations[c].LANDX;
                                        }
                                    }
                                }
                                idata[it].pp_expiry_date = that.convertDateBack(idata[it].pp_expiry_date);
                                var str = "";
                                str = "<strong>Passport No.: </strong>" + idata[it].new_passport + "<br>" +
                                    "<strong>Place of Issue: </strong>" + idata[it].place_of_issue + "<br>" +
                                    "<strong>Expiry Date: </strong>" + that.convertDateBack(idata[it].new_expiry_date) + "<br><strong>Issue Date: </strong>" + that.convertDateBack(
                                        idata[it].date_of_issue) + "<br>" + "<strong>Country: </strong>" + idata[it].CountryOfIssue;
                                idata[it].newDetails = str;
                                // for (var tc = 0; tc < data.length; tc++) {
                                //     if (data[tc].FILENAME.includes(idata[it].KaustId)) {
                                //         var uname = idata[it].KaustId + " - " + idata[it].FirstName + " " + idata[it].MiddleName + " " + idata[it].LastName;
                                //         urls = "<strong>" + uname + "</strong><br><br><a href='" + data[tc].URL + "' target='_blank'>" + data[tc].FILENAME.replace(
                                //             idata[it].KaustId, "") + "</a><br>";
                                //         attachs.push(urls);
                                //     }
                                // }
                            }
                            that.Url = "";
                            // for (var a = 0; a < attachs.length; a++) {
                            //     t.Url = t.Url + "<br>" + attachs[a];
                            // }
                            sap.ui.getCore().byId("idUrl").setHtmlText(that.Url);
                            that.getView().setModel(oICJson, "oTIJson");
                            sap.ui.getCore().setModel(oICJson, "oTIJson");
                        }


                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.delivery_mtd));
                        sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.collection_mtd));
                        if (odetails.delivery_mtd === "1" || odetails.collection_mtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }
                        if (odetails.collection_mtd === "2") {
                            sap.ui.getCore().byId("idCollection").setVisible(false);
                            sap.ui.getCore().byId("idCollectionType").setVisible(false);
                        }
                    }

                });
                //Get the country name
                // that.__setBCCountryModel(hcDetails, that)
                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);
            },


            // Job Title Change - Start
            getJobTitleDetails: function (requestId, oSubCode) {
                var JobTitleDetails;
                var that = this;
                //Filter Req
                var aFilters = [];
                aFilters.push(new Filter("request_id", FilterOperator.EQ, requestId, ""));


                //Transfer Information
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/JobtitlechangeSet";
                oGAModel.read(sRequestURL, {
                    filters: aFilters,
                    urlParameters: {
                        "$expand": "job_title_desc"
                    },
                    success: function (oData, response) {
                        var dataModel = new sap.ui.model.json.JSONModel();
                        dataModel.setData(oData.results[0]);
                        JobTitleDetails = oData.results[0];
                        that.getView().setModel(dataModel, "jobModel");

                        that.getJobUser(JobTitleDetails);

                        sap.ui.getCore().byId("idDC").setSelectedIndex(JobTitleDetails.deg_certificate - 1);
                        sap.ui.getCore().byId("idAC").setSelectedIndex(JobTitleDetails.cert_attested - 1);
                        sap.ui.getCore().byId("idTC").setSelectedIndex(JobTitleDetails.cert_translated - 1);
                        sap.ui.getCore().byId("idMC").setSelectedIndex(JobTitleDetails.cert_mofa - 1);
                        if (JobTitleDetails.deg_certificate === "1") {
                            sap.ui.getCore().byId("idAC").setVisible(false);
                            sap.ui.getCore().byId("idTC").setVisible(false);
                            sap.ui.getCore().byId("idMC").setVisible(false);
                            sap.ui.getCore().byId("idAClbl").setVisible(false);
                            sap.ui.getCore().byId("idTClbl").setVisible(false);
                            sap.ui.getCore().byId("idMClbl").setVisible(false);
                        } else {
                            sap.ui.getCore().byId("idAC").setVisible(true);
                            sap.ui.getCore().byId("idTC").setVisible(true);
                            sap.ui.getCore().byId("idMC").setVisible(true);
                            sap.ui.getCore().byId("idAClbl").setVisible(true);
                            sap.ui.getCore().byId("idTClbl").setVisible(true);
                            sap.ui.getCore().byId("idMClbl").setVisible(true);
                        }
                        // var fileDegrees = that.getFileAttachmentRequestDetails(null, requestId, 9);
                        // var attestedDegree, translatedDegree;
                        // for (var i = 0; i < fileDegrees.length; i++) {
                        //     if (fileDegrees[i].FILENAME.includes("ATTESTED")) {
                        //         fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
                        //         attestedDegree = fileDegrees[i];
                        //     }
                        //     if (fileDegrees[i].FILENAME.includes("TRANSLATED")) {
                        //         fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
                        //         translatedDegree = fileDegrees[i];
                        //     }
                        // }
                        // var filereadModel = new sap.ui.model.json.JSONModel({
                        //     attestedDegree: attestedDegree,
                        //     translatedDegree: translatedDegree
                        // });
                        // that.getView().setModel(filereadModel, "filereadModel");

                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(JobTitleDetails.delivery_mtd));
                        sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(JobTitleDetails.collection_mtd));

                        if (JobTitleDetails.delivery_mtd === "1" || JobTitleDetails.collection_mtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }

                        sap.ui.getCore().byId("idJobTitle").setVisible(true);
                    }

                });

                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);

            },

            /** User Details for Job title */
            getJobUser: function (JobTitleDetails) {
                var kaustId = JobTitleDetails.kaust_id;
                if (kaustId) {
                    var aFilters = this.getFilter(kaustId);
                    var dataModel = new sap.ui.model.json.JSONModel();
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
                            var data = oData.results[0];
                            JobTitleDetails.FirstName = data.FirstName;
                            JobTitleDetails.MiddleName = data.MiddleName;
                            JobTitleDetails.LastName = data.LastName;
                            JobTitleDetails.Costcenter = data.CostCenter;
                            var dataModel = new sap.ui.model.json.JSONModel();
                            dataModel.setData(JobTitleDetails);
                            that.getView().setModel(dataModel, "jobModel");
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
                }
            },

            /** Foreign Visa Details */
            getForeignVisaDetails: function (requestId, oSubCode) {

                var that = this;

                //Transfer Information
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/ForeignVisaSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,GAHeader"
                    },
                    success: function (oData, response) {
                        //Get the country name
                        var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                        var nations = oBCModel.getData();
                        if (nations) {
                            for (var c = 0; c < nations.length; c++) {
                                if (oData.CountrySlt === nations[c].LAND1) {
                                    oData.CountrySlt = nations[c].LANDX;
                                }
                            }
                        }
                        var visaModel = new sap.ui.model.json.JSONModel();
                        if (oData.attendence === "X") {
                            oData.attendence = "No";
                        } else {
                            oData.attendence = "Yes";
                        }
                        visaModel.setData(oData);
                        var visaDetails = oData;
                        that.getView().setModel(visaModel, "visaSet");

                        //Set the User Dependents
                        that.setVisaUserDependents(oData.header.kaust_id, visaDetails);

                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(visaDetails.delivery_mtd));
                        sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(visaDetails.collection_mtd));

                        if (visaDetails.delivery_mtd === "1" || visaDetails.collection_mtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }
                        sap.ui.getCore().byId("idApplyVisaSet").setVisible(true);
                    }

                });

                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);


            },

            /** Passport Pick up service */
            getPassportPickupDetails: function (requestId, oSubCode) {

                var that = this;
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/PassportpickupSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,GAHeader"
                    },
                    success: function (oData, response) {
                        var passportModel = new sap.ui.model.json.JSONModel();
                        //Get the country name
                        var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                        var nations = oBCModel.getData();
                        if (nations) {
                            for (var c = 0; c < nations.length; c++) {
                                if (oData.country_visa === nations[c].LAND1) {
                                    oData.country_visa = nations[c].LANDX;
                                }
                            }
                        }
                        if (oData.Attendence === "X") {
                            oData.Attendence = "No";
                        } else {
                            oData.Attendence = "Yes";
                        }
                        passportModel.setData(oData);
                        var passportDetails = oData;
                        that.getView().setModel(passportModel, "passport");

                        //Set the User Dependents
                        that.setVisaUserDependents(oData.header.kaust_id, passportDetails);

                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(passportDetails.delivery_mtd));
                        sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(passportDetails.collection_mtd));

                        if (passportDetails.delivery_mtd === "1" || passportDetails.collection_mtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }

                    }

                });
                sap.ui.getCore().byId("idPassportPickupSet").setVisible(true);

                //History Model
                that.__setBCHistoryModel(requestId, that);

                //Comment Model
                that.__setBCCommentModel(requestId, that);


            },

            /**Foreighn User Dependent details */
            setVisaUserDependents: function (kaustId, visaDetails) {

                var that = this;
                if (kaustId) {
                    var aFilters = this.getFilter(kaustId);
                    var dataModel = new sap.ui.model.json.JSONModel();
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
                            var data = oData.UserDetailsToDependentDetails;
                            var oDepDetailsModel = new sap.ui.model.json.JSONModel();
                            oDepDetailsModel.setData(data);
                            sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
                            DepJson = data;
                            var DependentsName = "";
                            var depkid = visaDetails.dependents_kaustid.split(".");
                            for (var k = 0; k < depkid.length; k++) {
                                for (var i = 0; i < DepJson["results"].length; i++) {
                                    if (DepJson["results"][i].KaustId == depkid[k]) {
                                        if (DependentsName.length == 0)
                                            DependentsName = DependentsName + DepJson["results"][i].FirstName + " " + DepJson["results"][i].LastName;
                                        else
                                            DependentsName = DependentsName + ", " + DepJson["results"][i].FirstName + " " + DepJson["results"][i].LastName;
                                        i = DepJson["results"].length + 1;
                                    }
                                }
                            }
                            sap.ui.getCore().byId("idSelectedReq").setText(DependentsName);
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
                    var table = sap.ui.getCore().byId("TblHistory");
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

            //Set Comment Model
            setJustification: function (data, that) {
                var oGACommentModel = new sap.ui.model.json.JSONModel();
                var aJus = [
                    {
                        justification: data.justification
                    }
                ];
                oGACommentModel.setData(aJus);
                that.getView().setModel(oGACommentModel, "GAComments");
            },

            /** Fetch the comments given for the request */
            __setCommentModel: function (requestId) {
                if (requestId) {
                    requestId = "0020005719";
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

            /** Fetch the Preference data for the request */
            loadPreferenceData: function (KaustId, SubServiceCode) {
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var oAVCommModel = new sap.ui.model.json.JSONModel();
                var sRequestURL = "/MyPreferencesCollection";
                var that = this;
                var preferenceModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(preferenceModel, "preferenceModel");
                oGAModel.read(sRequestURL, {
                    headers: {
                        "kaust_id": KaustId,
                        "sub_service_code": SubServiceCode
                    },
                    success: function (data, response) {
                        var oData = data.results[0];
                        that.getView().getModel("preferenceModel").setData(oData);
                        if (oData && oData.kaust_id != "" && oData.sub_service_code != "") { }

                    }

                });
            },

            getFields: function (input, field) {
                var output = [];
                for (var i = 0; i < input.length; ++i) {
                    output.push(input[i][field]);
                }
                return output;
            },
            search: function (nameKey, myArray) {
                for (var i = 0; i < myArray.length; i++) {
                    if (myArray[i].sow === nameKey) {
                        return myArray[i];
                    }
                }
            },


            cancelRq: function () {
                jQuery.sap.require("sap.m.MessageBox");
                var helpModel = this.getView().getModel("helpModel");
                var helpItems = helpModel.getProperty("/helpItems");
                var serviceName = helpItems.serviceOpened;
                var oModel = "";
                var msg = "";
                var that = this;
                switch (serviceName) {
                    case 'Audio Visual Services':
                        oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");

                        //    INCTURE 01-18-2018: START---------------------------------------------------------------------------------------------
                        var startDate;
                        //    The start date does not consider the meeting start time, hence below is commented
                        //    var startDate = new Date(oModel.oData.Ldate).getTime();
                        //    For putting the check that past requests are not cancelled - considering meeting start time for this scenario
                        if (oModel.oData.Ldate) {
                            if (!oModel.oData.Starttime) { // For Scenarios in which Start Time is missing
                                oModel.oData.Starttime = "00:00:00";
                            }
                            startDate = new Date(oModel.oData.Ldate.split("T")[0] + "T" + oModel.oData.Starttime).getTime();
                        } else { // In case Meeting Date is missing - cancellation is not possible
                            sap.m.MessageBox.show("Missing Event Information. Please contact your administrator.", {
                                icon: sap.m.MessageBox.Icon.WARNING,
                                title: "Warning",
                                actions: [sap.m.MessageBox.Action.OK],
                            });
                            return;
                        }
                        var today = new Date().getTime();

                        //      Removing the 24 Hour Cancellation Check  
                        //      if ((today + 24 * 60 * 60 * 1000) > startDate) {
                        //        sap.m.MessageBox.show("The request could not be cancelled less than 24h before the meeting date ", {
                        //          icon : sap.m.MessageBox.Icon.WARNING,
                        //          title : "Warning",
                        //          actions : [ sap.m.MessageBox.Action.OK ],
                        //        });
                        //        return;
                        //      }

                        //    Adding the check for meeting cancellation - after the meeting has started
                        if (today >= startDate) {
                            sap.m.MessageBox.show("The request could not be cancelled post meeting start time", {
                                icon: sap.m.MessageBox.Icon.WARNING,
                                title: "Warning",
                                actions: [sap.m.MessageBox.Action.OK],
                            });
                            return;
                        }
                        //    INCTURE 01-18-2018: END-----------------------------------------------------------------------------------

                        msg =
                            "By cancelling room booking, you are also cancelling all assosiated Audio and Visual services. Are you sure you want to cancel your room booking?";
                        break;
                    case 'Loan Equipment':
                        oModel = this.getView().getModel("confRoomModel");
                        msg = "Are you sure you want to cancel your Loan Equipment request?";
                        break;
                }

                //    INCTURE 01-18-2018: START----------------------------------------------------------------------
                //    Request Can be cancelled if status is 013 for AV
                var bValue = true; // Boolean variable to handle Loan Equipment and AV Status check
                if (serviceName === "Loan Equipment") { // No change in status for Loan Equipment
                    bValue = (oModel.oData.Status == "013" || oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status ==
                        "016" || oModel.oData.Status == "018");
                } else if (serviceName === "Audio Visual Services") { // Status 013 (Resolved) is removed for AV
                    bValue = (oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status == "016" || oModel.oData.Status ==
                        "018");
                }
                // The below if condition is replaced based on the Service Name
                //  if (oModel.oData.Status == "013" || oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status == "016" || oModel.oData.Status == "018") {
                if (bValue) {
                    sap.m.MessageBox.show("The request is already Resolved, no cancellation more possible", {
                        icon: sap.m.MessageBox.Icon.WARNING,
                        title: "Warning",
                        actions: [sap.m.MessageBox.Action.OK],
                    });
                } else {
                    sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                        function (oAction) {
                            if (sap.m.MessageBox.Action.OK === oAction) {
                                var oModel = that.getView().getModel("confRoomModel");
                                var oAVData = oModel.getProperty("/");
                                var requestId = helpItems.requestId;
                                // var serviceCode = helpItems.serviceCode;
                                // var subServiceCode = helpItems.subServiceCode;                                
                                var url = "/ReqHeader(request_id='" + requestId + "')";
                                var data = {
                                    status: "015"
                                }

                                var oKITSModel = that.getOwnerComponent().getModel("oKITSModel");

                                if (serviceName === "Audio Visual Services") {
                                    var oPayload = new Object();
                                    //  var sUrl = "CancelRequestSet(RequestId='" + requestId + "')";
                                    var sUrl = "CancelRequestSet(RequestId='" + requestId + "',Option='F',List='0')";
                                    var oKITSModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");

                                    oPayload["RequestId"] = requestId;
                                    oPayload["Status"] = "015";
                                    oPayload["ServiceCall"] = "X";
                                    oPayload["ServiceCall"] = "X";
                                    oPayload["Stage"] = oAVData.Stage;

                                    oKITSModel.update(sUrl, oPayload, {
                                        success: function (oData, oResponse) {
                                            sap.m.MessageBox.show("Your Request '" + requestId + "' has been cancelled.", {
                                                icon: sap.m.MessageBox.Icon.SUCCESS,
                                                title: "Success",
                                                actions: [sap.m.MessageBox.Action.OK],
                                            });
                                            sap.ui.getCore().byId("cancelRq").setEnabled(false);
                                        },
                                        error: function (oError) {
                                            sap.m.MessageBox.show("Failed to cancel the request. Please try again later", {
                                                icon: sap.m.MessageBox.Icon.ERROR,
                                                title: "Error",
                                                actions: [sap.m.MessageBox.Action.OK],
                                            });
                                        }
                                    });

                                    /*data["Adapter"] = oAVData.Adapter;
                                    data["Adevent"] = oAVData.Adevent;
                                    data["Agree"] = oAVData.Agree;
                                    data["Attendees"] = oAVData.Attendees;
                                    data["Avsupport"] = oAVData.Avsupport;
                                    data["Bldglevel"] = oAVData.Bldglevel;
                                    data["Bldgname"] = oAVData.Bldgname;
                                    data["Cemail"] = oAVData.Cemail;
                                    data["Clicker"] = oAVData.Clicker;
                                    data["ConfRoom"] = oAVData.ConfRoom;
                                    data["Confrecord"] = oAVData.Confrecord;
                                    data["Contact"] = oAVData.Contact;
                                    data["Costcenter"] = oAVData.Costcenter;
                                    data["Daily"] = oAVData.Daily;
                                    data["Department"] = oAVData.Department;
                                    data["Deptname"] = oAVData.Deptname;
                                    data["Email"] = oAVData.Email;
                                    data["Endtime"] = oAVData.Endtime;
                                    data["EventLocation"] = oAVData.EventLocation;
                                    data["Eventname"] = oAVData.Eventname;
                                    data["Externalmail"] = oAVData.Externalmail;
                                    data["FirstName"] = oAVData.FirstName;
                                    data["Flipchart"] = oAVData.Flipchart;
                                    data["Foodservices"] = oAVData.Foodservices;
                                    data["Friday"] = oAVData.Friday;
                                    data["HostUserName"] = oAVData.HostUserName;
                                    data["Hostuserid"] = oAVData.Hostuserid;
                                    data["Ipaddress"] = oAVData.Ipaddress;
                                    data["Ishost"] = oAVData.Ishost;
                                    data["Itmsequence"] = oAVData.Itmsequence;
                                    data["KaustId"] = oAVData.KaustId;
                                    data["Laptop"] = oAVData.Laptop;
                                    data["LastName"] = oAVData.LastName;
                                    data["Layout"] = oAVData.Layout;
                                    data["Ldate"] = oAVData.Ldate;
                                    data["Mcomments"] = oAVData.Mcomments;
                                    data["MiddleName"] = oAVData.MiddleName;
                                    data["Mobile"] = oAVData.Mobile;
                                    data["Monday"] = oAVData.Monday;
                                    data["Monitor"] = oAVData.Monitor;
                                    data["Monthly"] = oAVData.Monthly;
                                    data["Mphone"] = oAVData.Mphone;
                                    data["Office"] = oAVData.Office;
                                    data["Onbehalf"] = oAVData.Onbehalf;
                                    data["Others"] = oAVData.Others;
                                    data["Positiontext"] = oAVData.Positiontext;
                                    data["Presentation"] = oAVData.Presentation;
                                    data["Presenter"] = oAVData.Presenter;
                                    data["Private"] = oAVData.Private;
                                    data["ProcessId"] = oAVData.ProcessId;
                                    data["Projector"] = oAVData.Projector;
                                    data["Protocol"] = oAVData.Protocol;
                                    data["Public"] = oAVData.Public;
                                    data["RManager"] = oAVData.RManager;
                                    data["Rdevent"] = oAVData.Rdevent;
                                    data["Recording"] = oAVData.Recording;
                                    data["Renddate"] = oAVData.Renddate;
                                    data["Rstartdate"] = oAVData.Rstartdate;
                                    data["Saturday"] = oAVData.Saturday;
                                    data["Speakers"] = oAVData.Speakers;
                                    data["Stage"] = oAVData.Stage;
                                    data["Starttime"] = oAVData.Starttime;
                                    data["Sunday"] = oAVData.Sunday;
                                    data["Thursday"] = oAVData.Thursday;
                                    data["Title"] = oAVData.Title;
                                    data["Tuesday"] = oAVData.Tuesday;
                                    data["UserId"] = oAVData.UserId;
                                    data["Videowebconf"] = oAVData.Videowebconf;
                                    data["Wboard"] = oAVData.Wboard;
                                    data["Webex"] = oAVData.Webex;
                                    data["Wednesday"] = oAVData.Wednesday;
                                    data["Weekly"] = oAVData.Weekly;
                                    data["activityType"] = oAVData.activityType;
                                    data["country"] = oAVData.country;
                                    data["flow"] = oAVData.flow;
                                    data["requestType"] = oAVData.requestType;
                                    data["roomno"] = oAVData.roomno;
                                    data["lastTaskStatus"] = oAVData.lastTaskStatus;
                                    data["onBehalfUserId"] = oAVData.onBehalfUserId;
                                    data["buildingCode"] = oAVData.buildingCode;*/

                                } else {
                                    oKITSModel.update(url, data, {
                                        success: function (oResponse, textStatus, jqXHR) {
                                            sap.m.MessageBox.show("Your Request '" + requestId + "' has been cancelled.", {
                                                icon: sap.m.MessageBox.Icon.SUCCESS,
                                                title: "Success",
                                                actions: [sap.m.MessageBox.Action.OK],
                                            });
                                            sap.ui.getCore().byId("cancelRq").setEnabled(false);

                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {

                                            if (textStatus === "timeout") {
                                                sap.m.MessageBox.show("Connection timed out", {
                                                    icon: sap.m.MessageBox.Icon.ERROR,
                                                    title: "Error",
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    // styleClass: bCompact ? "sapUiSizeCompact" : ""
                                                });
                                                // sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
                                            } else {
                                                sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," +
                                                    jqXHR.statusText, {
                                                    icon: sap.m.MessageBox.Icon.ERROR,
                                                    title: "Error",
                                                    actions: [sap.m.MessageBox.Action.OK],
                                                    // styleClass: bCompact ? "sapUiSizeCompact" : ""
                                                });
                                                jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," +
                                                    jqXHR.statusText);
                                            };
                                        },
                                        complete: function () {
                                        }
                                    });
                                }
                            }
                        });
                }
            },
        });
    });
