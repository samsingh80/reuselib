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

                    case 'Distribution List Service':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.EmailDistrGrp", this);
                        this.getEmailDistrGrp(requestId, kaustId);
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

                    //Sponsorship transfer Staff / Student
                    case '0413':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.DPSPTransfer", this);
                        this.getDSTDetails(requestId, subServiceCode);
                        break;

                    // Sponsorship Transfer (Spouse)
                    case '0415':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.SPSTransfer", this);
                        this.getSSTDetails(requestId, subServiceCode);
                        break;

                    // Sponsorship Transfer (Child)    
                    case '0416':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.CHDTransfer", this);
                        this.getCSTDetails(requestId, subServiceCode);
                        break;


                    //Car Registration Renewal (Collect)
                    case '0503':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.CARRegRenew", this);
                        this.getCARRegRenewDetails(requestId, subServiceCode);
                        break;

                    //Car Driving License Issue (Collect)
                    case '0504':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.DLIssue", this);
                        this.getDLIssDetails(requestId, subServiceCode);
                        break;

                    // Car Driving License Renewal (Collect)    
                    case '0502':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.DLRenew", this);
                        this.getDLRDetails(requestId, subServiceCode);
                        break;

                    // Motorcycle Driving License Issue
                    case '0501':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.MCDLIssue", this);
                        this.getMCDLIssDetails(requestId, subServiceCode);
                        break;

                    // Motorcycle Driving License Renewal    
                    case '0505':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.MCDLRenew", this);
                        this.getMCDLRDetails(requestId, subServiceCode);
                        break;

                    //Final Exit Visa Issuance
                    case '0202':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FinalExitVisa", this);
                        this.getFEVDetails(requestId, subServiceCode);
                        break;

                    //Final Exit Visa Issuance
                    case '9202':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FinalExitVisa", this);
                        this.getFEVDetails(requestId, subServiceCode);
                        break;

                    //Final Exit Visa Cancellation   
                    case '9211':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FinalExitVisaCancel", this);
                        this.getFEVCANDetails(requestId, subServiceCode);
                        break;

                    //Final Exit Visa Cancellation   
                    case '8211':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FinalExitVisaCancel", this);
                        this.getFEVCANDetails(requestId, subServiceCode);
                        break;

                    //Final Exit Visa Cancellation   
                    case '0203':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FinalExitVisaCancel", this);
                        this.getFEVCANDetails(requestId, subServiceCode);
                        break;

                    //Iqama Issuance - Staff    
                    case '0103':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.IqamaIssue", this);
                        this.getIQMISSDetails(requestId, subServiceCode);
                        break;
                    //Iqama Issuance - Student
                    case '9103':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.IqamaIssue", this);
                        this.getIQMISSDetails(requestId, subServiceCode);
                        break;

                    // Iqama Renewal
                    case '0101':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.IqamaRenewal", this);
                        this.getIqamaRenDetails(requestId, subServiceCode);
                        break;

                    //Family Residency Visa
                    case '0208':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.FamilyResidencyVisa", this);
                        this.getFamilyResidencyDetails(requestId, subServiceCode);
                        break;

                    //Attestation from Ministry of Education(MOE)
                    case '1702':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.Moe", this);
                        this.getMoeDetails(requestId, subServiceCode);
                        break;

                    //Car Ownership Transfer
                    case '0507':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.VehOwnTransfer", this);
                        this.getVOTDetails(requestId, subServiceCode);
                        break;

                    //Saudi Passport Pick-up    
                    case '0310':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.SaudiPassportPickup", this);
                        this.getSaudiPassport(requestId, subServiceCode);
                        break;

                    //Saudi National ID Pick-up
                    case '0306':
                        detailsFragment = sap.ui.xmlfragment("com.kaust.zui5myrequest.fragment.SaudiNationalIdPickup", this);
                        this.getSaudiIdData(requestId, subServiceCode);
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
                      this.getProcessStages(status, detailsForm);
                      }*/
                    else {
                        this.getProcessStages(status, detailsForm);
                    }
                    // Rerender is moved to jsonp ajax call because it is asynchronous


                }
            },

            getProcessStages: function (status, detailsForm) {
                var oCustomModel = this.getOwnerComponent().getModel("oCustomModel");
                var oCusData = oCustomModel.getData();
                var step = oCusData.stage;
                var serviceCode = oCusData.serviceCode;
                if (serviceCode == "0051" || serviceCode == "0052" || serviceCode == '0053' || serviceCode == '0055' || serviceCode === "0026" ||
                    serviceCode === "0016") { } else {
                    if (step == 'CRM') {
                        step = 'IT Service Desk';
                    } else if (step == 'PM') {
                        step = 'Completed';
                    }
                    //else if (step == 'Recipient Approval') {
                    //step = 'Recipient Acknowledgement';
                    //}
                }
                if (serviceCode == "0102" && (step == "Line Manager Approval" || step == "Graduate Affairs Approval")) {
                    step = "LM/Graduate Affairs Approval";
                }

                //BRM Call
                var that = this;
                var oDialog = new sap.m.BusyDialog();
                // var brmURL = this.getBRMUrl();
                oDialog.open();
                var oPayload = {
                    "RuleServiceId": "379208f3d3d144dfa048e1d04df3f513",
                    "Vocabulary": [
                        {
                            "DO_ServiceDetails_IN": {

                                "ServiceCode": serviceCode
                            }
                        }
                    ]
                };

                $.ajax({
                    url: this._getRulesBaseURL() + "/v2/xsrf-token",
                    method: "GET",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (result, xhr, data) {
                        var bpmruletoken = data.getResponseHeader("X-CSRF-Token");

                        //Then invoke the business rules service via public API
                        $.ajax({
                            url: that._getRulesBaseURL() + "/v2/workingset-rule-services",
                            method: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(oPayload),
                            async: false,
                            headers: {
                                "X-CSRF-Token": bpmruletoken
                            },

                            success: function (result1, xhr1, data1) {
                                var response = result1.Result[0].DO_ProcessFlowStages_OUT;
                                if (response.stage1 != null) {
                                    var brmResult = [response.stage1, response.stage2, response.stage3, response.stage4, response.stage5, response.stage6, response.stage7,
                                    response.stage8, response.stage9, response.stage10
                                    ];
                                    var processFlow = that.getProcessFlow(step, brmResult, status);
                                    //29-03-2018 Incture (for changing the text of process flow)
                                    if (serviceCode === "0009") {
                                        var len = processFlow.getLanes().length;
                                        for (var i = 0; i < len; i++) {
                                            var processText = processFlow.getLanes()[i];
                                            if (processText.getText() === "Recipient Line Manager Approval") {
                                                processText.setText("Recipient line manager Approval");
                                            } else if (processText.getText() === "Recipient Approval") {
                                                processText.setText("Recipient Acknowledgement");
                                            }
                                        }
                                    }
                                    var contents = detailsForm.getContent();
                                    detailsForm.removeAllContent();
                                    detailsForm.addContent(processFlow);
                                    for (c in contents) {
                                        detailsForm.addContent(contents[c]);
                                    }
                                }
                                oDialog.destroy();
                                detailsForm.rerender();


                            }
                        });
                    }
                });


                // var response = { serviceCode: "0017", stage1: "IT Service Desk" };
                

            },


            _getBaseURL: function () {
                var componentName = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                // @ts-ignore
                return jQuery.sap.getModulePath(componentName);
            },
            _getRulesBaseURL: function () {
                return this._getBaseURL() + "/bpmruleruntime/rules-service/rest";
            },

            getProcessFlow: function (step, stages, status) {
                var processFlow = new sap.suite.ui.commons.ProcessFlow();
                var processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
                var stepFound = false;
                var icon = "sap-icon://employee-approvals";
                var subService = this.getView().getModel("helpModel").getData().helpItems.serviceOpened;
                var oSubCode = this.getView().getModel("helpModel").getData().helpItems.subServiceCode;
                //Zakeer : Resolved status
                if (subService == "Port Activation" || subService == "TER Access Process" || subService == "Data Center Access Process" || subService ==
                    "VPN Access for externals Process" || subService == "Admin Rights Process" || subService == "Audio Visual Services" || oSubCode ===
                    "0026" || oSubCode === "0016") {
                    if (status == "Initiated") {
                        return;
                    }
                    var isCompleted = $.inArray(status, ["Rejected", "Cancelled"]);
                    // For VPN skipping Info sec stage
                    if (subService == "VPN Access for externals Process") {
                        var data = this.getView().getModel("oDataModel").getData().d.results[0];
                        if (data.vpn == "X" && data.activityType == "New" && data.flow == "Non-Academic") { } else {
                            stages.shift();
                        }
                        //if(data.requestType=="Non VPN"){ 
                        if (!(data.vpn == "X" && data.activityType == "New")) {
                            var index = stages.indexOf("CRM");
                            stages.splice(index, 1);
                        }
                        var index = stages.indexOf("AD Automation");
                        if (index && data.requestType == "VPN" && data.reqTypeDesc == "New") {
                            stages[index] = "Account Creation";
                        } else if (index && data.requestType == "VPN" && data.reqTypeDesc == "Renew") {
                            stages[index] = "Account Renewal";
                        } else if (index && data.requestType == "Non VPN") {
                            stages[index] = "Account Provision";
                        }
                        if (step == "AD Automation") {
                            step = stages[index];
                        }

                        var index = stages.indexOf("CRM");
                        if (index) {
                            stages[index] = "Info Sec Team";
                            if (step == "CRM") {
                                step = stages[index];
                            }
                        }
                    }
                    if (subService == 'Data Center Access Process') {
                        var data = this.getView().getModel("dataCenter").getData().d.results[0];
                        if (data.requestType == "Non-Contractor") {
                            var index = stages.indexOf("Line Manager");
                            stages.splice(index, 1);
                        }
                        if (data.flow == "YES") {
                            var index = stages.indexOf("KAUST Security");
                            stages.splice(index, 1);
                        }
                        if (step == "CRM") {
                            step = "Data Center Access";
                        }

                        if (step == "Justification") {
                            step = "Pre Screening";
                        }

                        if (!data.justification) {
                            var index = stages.indexOf("Justification");
                            stages.splice(index, 1);
                        }

                        var index = stages.indexOf("Justification");
                        stages[index] = "Pre Screening";
                        //          var index = stages.indexOf("CRM");
                        //              if(index){
                        //               stages[index]="Data Center Access";
                        //            }

                        //Pavithra -- for pre step justification ---- start
                        if (data.RequestId && data.approverStatus == 1 || data.RequestId && data.approverStatus == 2 || data.RequestId && data.approverStatus ==
                            3) {
                            var index = stages.indexOf("KAUST Security");
                            //            stages.splice(index, 1);
                        } else {
                            var index = stages.indexOf("Justification");
                            stages.splice(index, 1);
                            var index = stages.indexOf("Requester");
                            stages.splice(index, 1);
                        }
                        //Pavithra -- for pre step justification ---- end
                    }
                    if (subService == "Admin Rights Process") {
                        var data = this.getView().getModel("oPortModel").getData();
                        var index = stages.indexOf("CRM");
                        if (index) {
                            stages[index] = "IT Service Desk"
                        }
                        if (data.Onbehalf != "X") {
                            var index = stages.indexOf("Line Manager");
                            stages.splice(index, 1);
                        }
                        // Roopali(03-07-2018) -comment the code to change the road map for Linux 
                        /*  if(data.selectedOperSys){
        
                          var present = data.selectedOperSys.indexOf("Linux");
                          if(present!=-1) {
                          var index = stages.indexOf("IT Service Manager");
                            stages.splice(index, 1);
                          }
                          // roopali changes end
                          //to be removed once stage is updated in BPM / ECC
                        }*/
                    }
                    if (subService == "Audio Visual Services") {
                        var oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
                        var index1, index2, index3, index4;
                        if (oAVData.requestType === "NA") {
                            index1 = stages.indexOf("IT Service Desk");
                            stages.splice(index1, 1);
                            index2 = stages.indexOf("Requester Feedback");
                            stages.splice(index2, 1);
                        }
                        if (oAVData.activityType === "NA") {
                            index1 = stages.indexOf("Room Booking Team");
                            stages.splice(index1, 1);
                        }
                        if (oAVData.activityType === "NA" && oAVData.requestType === "NA") {
                            index1 = stages.indexOf("IT Service Desk");
                            stages.splice(index1, 1);
                            index2 = stages.indexOf("Requester Feedback");
                            stages.splice(index2, 1);
                            index3 = stages.indexOf("Room Booking Team");
                            stages.splice(index3, 1);
                        }
                        //29-03-2018 Incture(Andrea) checking for flow 
                        if (oAVData.flow === "Library") {
                            index4 = stages.indexOf("Room Booking Team");
                            stages.splice(index4, 1);
                        } else if (oAVData.flow === "NA") {
                            index4 = stages.indexOf("Library Team");
                            stages.splice(index4, 1);
                        }

                        // Incture 01-23-2018: Requester Feedback Task is removed from Process
                        // In UI no changes are made as there is no effect of this change on the UI code
                        // In case if any request is in Pending Requester Feedback for AV then we will show the 
                        // Feedback task in UI. In case the request is not in Pending Requester Feedback then 
                        // Feedback task will not come in Road Map be it AV 
                        if (oAVData.requestType === "AV") {
                            if (status === "Pending Requester Feedback") {
                                stages.splice(stages.indexOf("Resolved"), 0, "Requester Feedback");
                            }
                        }
                    }
                    // end of VPN skipping Info sec stage

                    // INCTURE 1 Feb, 2018: Library Excessive Download (0026) Road map issue fix
                    if (oSubCode === "0026" || oSubCode === "0016") {
                        if (status === "Resolved") // If status is resolved
                        {
                            stages.splice(1, 0, "Resolved");
                        } // The BRM Service does not send Resolved Status hence pushing it to the array
                        else {
                            step = step === "CRM" ? "IT Service Desk" : step;
                        } // If status is not resolved replace CRM with IT Service Desk in step
                    }
                } else {
                    var isCompleted = $.inArray(status, ["Rejected", "Resolved", "Cancelled"]);
                }
                //Zakeer : Resolved status
                // var isCompleted = $.inArray(status, [ "Rejected", "Resolved", "Cancelled" ]);
                var i;
                for (i = 0; i < stages.length; i++) {
                    if (stages[i] == null) {
                        break;
                    }
                    if (stepFound) {
                        processState = sap.suite.ui.commons.ProcessFlowNodeState.Planned;
                        icon = "sap-icon://time-entry-request";
                        if (isCompleted !== -1) {
                            processState = null;
                            break;
                        }
                    }
                    if (stages[i].toUpperCase() == step.toUpperCase()) {
                        if ((subService == "VPN Access for externals Process" && step == "Resolved") || (subService == 'Data Center Access Process' && step ==
                            "Resolved")) { } else {
                            if (isCompleted != 0) { // to remove red color
                                processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
                            }
                            icon = "sap-icon://customer-history";
                            stepFound = true;
                        }
                    }

                    if (oSubCode === "0036" || oSubCode === "0207" || oSubCode === "1701" || oSubCode === "1702" || oSubCode === "1704" ||
                        oSubCode === "1705" || oSubCode === "0204" || oSubCode === "0205" || oSubCode === "0503" || oSubCode === "0205" ||
                        oSubCode === "0504" || oSubCode === "0501" || oSubCode === "1706" || oSubCode === "1707" || oSubCode === "0502" ||
                        oSubCode === "0505" || oSubCode === "0104" || oSubCode === "0206" || oSubCode === "0105" || oSubCode === "0302" ||
                        oSubCode === "1703" || oSubCode === "0402" || oSubCode === "0401" || oSubCode === "0303" || oSubCode === "0506" ||
                        oSubCode === "1700" || oSubCode === "0304" || oSubCode === "1912" || oSubCode === "1708" || oSubCode === "1709" ||
                        oSubCode === "0310" || oSubCode === "0306" || oSubCode === "0414" || oSubCode === "0415" || oSubCode === "0416" ||
                        oSubCode === "0208" || oSubCode === "0103" || oSubCode === "9103" || oSubCode === "0202" || oSubCode === "9202" ||
                        oSubCode === "0211" || oSubCode === "8211" || oSubCode === "9211" || oSubCode === "0203" || oSubCode === "0502" || oSubCode === "0101") {
                        if (step === "Pending Requester") {
                            if (isCompleted != 0) {
                                processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
                            }
                            icon = "sap-icon://customer-history";
                            stepFound = true;
                        }
                        if (oSubCode === "0206") { //|| oSubCode === "0302"
                            // if (sap.ui.getCore().byId("userInfoForm").getModel().getData().d.Type === "STAFF") {
                            // 	var index = stages.indexOf("HR/Graduate Affairs Approval");
                            // 	stages.splice(index, 1);
                            // 	if (status === "Resolved" || status === "Rejected" || status === "Cancelled") {
                            // 		processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
                            // 	} else {
                            // 		processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
                            // 	}
                            // }
                        }
                    }
                    // var x = new sap.m.Text({text:stages[i],wrapping:true});
                    processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
                        text: stages[i],
                        position: i,
                        state: [{
                            state: processState,
                            value: 100
                        }],
                        iconSrc: icon
                    }));
                }
                if (isCompleted !== -1) {
                    var text = status;
                    //   var y = new sap.m.Text({text:text,wrapping:true});
                    processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
                        text: text,
                        position: i,
                        state: [{
                            state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
                            value: 100
                        }],
                        iconSrc: "sap-icon://employee-approvals"
                    }));
                }
                processFlow.addStyleClass("heigher");
                return processFlow;
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
                        var startDate = that.convertDateBack(startData, '/');
                        var startTime = that.convertTime(oModelVScan.oData.starttime);
                        var start = startDate + " " + startTime;
                        sap.ui.getCore().byId("startTime").setVisible(true).setText(start);

                        var endData = oModelVScan.oData.enddate;
                        var endDate = that.convertDateBack(endData, '/');
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

                this.__setHistoryModel(requestId);
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
                this.__setHistoryModel(requestId);
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
                this.__setHistoryModel(requestId);
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
                                //  var startDate = this.convertDateBack(parseInt(data.StartTime),'/');
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


            /**
        * Generic Email Creation 
        **/
            getEmailDistrGrp: function (requestId) {
                var that = this;
                var urlRequestData = "/Gemail/" + requestId;
                var oKITSModel = this.getOwnerComponent().getModel("oKITSModel");
                oKITSModel.read(urlRequestData, {
                    urlParameters: {
                        "$expand": "header,item"
                    },
                    success: function (data, response) {
                        var oModelVScan = new sap.ui.model.json.JSONModel();
                        oModelVScan.setData(data);
                        sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.grpdisplayname);
                        sap.ui.getCore().byId("coOwnGrp").setText(oModelVScan.oData.coowneremail);
                        sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.grpemail);
                        // sap.ui.getCore().byId("primeOwnGrp").setText(oModelVScan.oData.Grpmember); thaj
                        //call for delegates
                        var authSenders = oModelVScan.oData.Authsender;
                        if (authSenders == "") {
                            // sap.ui.getCore().byId("authSenders").setText("No restriction");
                        }
                        var members = "";
                        var senders = "";
                        var persons = data.item.results;

                        for (var i in persons) {
                            if (persons[i].grpmember != "") {
                                members = members + persons[i].grpmember + ";";
                            }
                            if (persons[i].authsender != "") {
                                senders = senders + persons[i].authsender + ";";
                            }
                        }
                        if (senders == "") {
                            sap.ui.getCore().byId("authSenders").setText("No restriction");
                        } else {
                            sap.ui.getCore().byId("authSenders").setText(senders);
                        }
                        sap.ui.getCore().byId("grpMembers").setText(members);

                        that.getView().setModel(oModelVScan, "emailDistrModel");

                        sap.ui.getCore().byId("descr").setText(oModelVScan.oData.accountdesc);




                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                    }

                });

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
                        "$expand": "header,GAHeader,job_title_desc,new_job_title_desc"
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


                            if (DSTJson.dob) {
                                var startDate = that.convertDateBack(DSTJson.dob, '/');
                            }

                            oView.byId("dst_currjobtitle").setText(DSTJson.job_title_desc.mhn_name_latini);
                            oView.byId("dst_arcurrjobtitle").setText(DSTJson.job_title_desc.mhn_name);

                            oView.byId("dst_newjobtitle").setText(DSTJson.new_job_title_desc.mhn_name_latini);
                            oView.byId("dst_arnewjobtitle").setText(DSTJson.new_job_title_desc.mhn_name);



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

            /** Sponsorship Transfer (Spouse) **/
            getSSTDetails: function (sRequestId, oSubCode) {
                var requestId = sRequestId;
                var that = this;
                var oView = sap.ui.getCore();
                oView.byId("SSTPrefBody").setVisible(false);
                oView.byId("SSTTracking").setVisible(false);
                oView.byId("SSTReject").setVisible(false);
                var PrefJson;
                var EmpJson;
                var SSTJson;
                var JobJson;
                var DSTAttJson;


                var that = this;
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/SponsorshiptransferspouseSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,GAHeader"
                    },
                    success: function (data, response) {
                        var dstReqModel = new sap.ui.model.json.JSONModel();
                        dstReqModel.setData(data);
                        SSTJson = data;
                        // Populate Sponsorship Transfer Details - Sponser
                        if (oSubCode == "0415") {
                            oView.byId("sst_firstname").setText(SSTJson.first_name);
                            oView.byId("sst_middlename").setText(SSTJson.middle_name);
                            oView.byId("sst_lastname").setText(SSTJson.last_name);
                            oView.byId("sst_arfirstname").setText(SSTJson.ar_first_name);
                            oView.byId("sst_armiddlename").setText(SSTJson.ar_middle_name);
                            oView.byId("sst_arlastname").setText(SSTJson.ar_last_name);
                            oView.byId("sst_iqama").setText(SSTJson.iqama_no);
                            oView.byId("sst_nation").setText(SSTJson.nationality);
                            oView.byId("sst_gender").setText(SSTJson.gender);
                            oView.byId("sst_religion").setText(SSTJson.religion);
                            oView.byId("sst_currsponsornum").setText(SSTJson.sponsor_number);
                            oView.byId("sst_currsponsorname").setText(SSTJson.sponsor_name);
                            oView.byId("sst_arcurrsponsorname").setText(SSTJson.sponsor_name_ar);
                            oView.byId("sst_jobtitle").setText(SSTJson.job_title);



                            if (SSTJson.dob) {
                                var startDate = that.convertDateBack(SSTJson.dob, '/');
                            }

                            // if (SSTJson.SponKaustId.length > 0) {
                            //     var NsdJson;
                            //     var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                            //     oModelGasc.read("UserDetail(KaustID='" + SSTJson.SponKaustId + "',UserId='')", null, null, false, function (data, response) {
                            //         NsdJson = data;
                            //     },
                            //         function (response) {
                            //             return "";
                            //         });

                            //     oView.byId("sst_newsponsornum").setText(NsdJson.Iqama);
                            //     oView.byId("sst_newsponsorname").setText(NsdJson.FirstName + " " + NsdJson.MiddleName + " " + NsdJson.LastName);
                            //     oView.byId("sst_arnewsponsorname").setText(NsdJson.ArabicFirstName + " " + NsdJson.ArabicMiddleName + " " + NsdJson.ArabicLastName);
                            // }

                            oView.byId("sst_certattested").setText("No");
                            oView.byId("sst_certtranslated").setText("No");
                            oView.byId("sst_certmofa").setText("No");
                            oView.byId("SSTMCDetails").setVisible(false);

                            oView.byId("sst_transferfee").setText("SAR " + SSTJson.GAHeader.amount);
                            if (SSTJson.transfercount == "0")
                                oView.byId("sst_transfertype").setText("First");
                            if (SSTJson.transfercount == "1")
                                oView.byId("sst_transfertype").setText("Second");
                            if (SSTJson.transfercount == "2")
                                oView.byId("sst_transfertype").setText("Third & Above");

                            oView.byId("sst_sponsortype").setText("No");
                            if (SSTJson.sponsor_type == "X")
                                oView.byId("sst_sponsortype").setText("Yes");

                            oView.byId("sst_kaustid").setText(SSTJson.kaust_id);
                            oView.byId("sps_kaustid").setVisible(false);
                            oView.byId("sst_kaustflg").setText("No");
                            if (SSTJson.kaust_id.length > 0) {
                                oView.byId("sps_kaustid").setVisible(true);
                                oView.byId("sst_kaustflg").setText("Yes");
                            }

                            if (SSTJson.mar_certificate == "") {
                                oView.byId("sst_marcertificate").setText("No");
                                //				oView.byId("SSTMCDetails").setVisible(true);
                                if (SSTJson.cert_attested == "X")
                                    oView.byId("sst_certattested").setText("Yes");
                                if (SSTJson.cert_translated == "X")
                                    oView.byId("sst_certtranslated").setText("Yes");
                                if (SSTJson.cert_mofa == "X")
                                    oView.byId("sst_certmofa").setText("Yes");
                            } else {
                                oView.byId("sst_marcertificate").setText("Yes");
                            }

                            // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     if (data.results.length > 0) {
                            //         oView.byId("idSSTatt1").setText("Iqama");
                            //         oView.byId("idSSTatt1").setHref(data.results[0].URL);
                            //     }
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     if (data.results.length > 0) {
                            //         oView.byId("idSSTatt2").setText("Passport");
                            //         oView.byId("idSSTatt2").setHref(data.results[0].URL);
                            //     }
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     if (data.results.length > 0) {
                            //         oView.byId("idSSTatt3").setText("Saudi Visa");
                            //         oView.byId("idSSTatt3").setHref(data.results[0].URL);
                            //     }
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '9'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     if (data.results.length > 0) {
                            //         oView.byId("idSSTatt5").setText("Marriage Certificate");
                            //         oView.byId("idSSTatt5").setHref(data.results[0].URL);
                            //     }
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                            //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                            // oAttachModel.read(attxt, null, null, false, function (data, response) {
                            //     var attachModel = new sap.ui.model.json.JSONModel();
                            //     attachModel.setData(data);
                            //     SSTAttJson = data;
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // if (SSTAttJson.results.length > 0) {
                            //     for (var i = 0; i < SSTAttJson.results.length; i++) {
                            //         if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
                            //             oView.byId("idSSTatt4").setText("NOL to Passport");
                            //             oView.byId("idSSTatt4").setHref(SSTAttJson.results[i].URL);
                            //         }
                            //         if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "ATTESTED_MARRIAGE") {
                            //             oView.byId("idSSTatt6").setText("Attested Marriage Certificate");
                            //             oView.byId("idSSTatt6").setHref(SSTAttJson.results[i].URL);
                            //         }
                            //         if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "TRANSLATED_MARRIAGE") {
                            //             oView.byId("idSSTatt7").setText("Translated Marriage Certificate");
                            //             oView.byId("idSSTatt7").setHref(SSTAttJson.results[i].URL);
                            //         }
                            //     }
                            // }

                            if (SSTJson.Status == 11) {
                                oView.byId("SSTReject").setVisible(true);
                                oView.byId("idsstfincomments").setText(SSTJson.GAHeader.fincomments);
                            }

                            oView.byId("idSSTCollection").setSelectedIndex(0);
                            if (SSTJson.collection_mtd != null && SSTJson.collection_mtd == "1") {
                                oView.byId("idSSTCollection").setSelectedIndex(1);
                                oView.byId("SSTPrefBody").setVisible(true);
                                oView.byId("SSTTracking").setVisible(true);
                            }

                            oView.byId("idSSTDelivery").setSelectedIndex(0);
                            if (SSTJson.delivery_mtd != null && SSTJson.delivery_mtd == "1") {
                                oView.byId("idSSTDelivery").setSelectedIndex(1);
                                oView.byId("SSTPrefBody").setVisible(true);
                                oView.byId("SSTTracking").setVisible(true);
                            }

                            // oView.byId("sstcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
                            // oView.byId("sstcpdkaustid").setText(PrefJson.KaustID);
                            // oView.byId("sstcpdmobile").setText(PrefJson.Mobile);
                            // oView.byId("sstcpdbldno").setText(PrefJson.BuildingNo);
                            // oView.byId("sstcpdlevel").setText(PrefJson.levelb);
                            // oView.byId("sstcpdbldname").setText(PrefJson.BuildingName);
                            // oView.byId("idSSTTrackingNum").setText(SSTJson.TrackingId);


                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Sponsorship Transfer (Child) **/
            getCSTDetails: function (sRequestId, oSubCode) {
                var requestId = sRequestId;
                var that = this;
                var oView = sap.ui.getCore();
                oView.byId("CSTPrefBody").setVisible(false);
                oView.byId("CSTTracking").setVisible(false);
                oView.byId("CSTReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var CSTJson;
                var DepJson;
                var CSTHead;
                var CSTAttJson;


                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "SponsorTransferChild,header"
                    },
                    success: function (data, response) {
                        var childData = new sap.ui.model.json.JSONModel();
                        childData.setData(data.SponsorTransferChild);
                        that.getView().setModel(childData, "cstJson");
                        sap.ui.getCore().setModel(childData, "cstJson");
                        CSTJson = data.SponsorTransferChild;
                        CSTHead = data;

                        // Populate Sponsorship Transfer (Child) Details - Begin
                        if (oSubCode == "0416") {
                            if (CSTJson.results.length > 0) {
                                oView.byId("cst_certattested").setText("No");
                                oView.byId("cst_certtranslated").setText("No");
                                oView.byId("cst_certmofa").setText("No");
                                oView.byId("CSTBCDetails").setVisible(false);

                                oView.byId("cst_sponsortype").setText("No");
                                if (CSTJson.results[0].sponsor_type == "X")
                                    oView.byId("cst_sponsortype").setText("Yes");

                                if (CSTJson.results[0].birth_certificate == "") {
                                    oView.byId("cst_birthcertificate").setText("No");
                                    if (CSTJson.results[0].cert_attested == "X")
                                        oView.byId("cst_certattested").setText("Yes");
                                    if (CSTJson.results[0].cert_translated == "X")
                                        oView.byId("cst_certtranslated").setText("Yes");
                                    if (CSTJson.results[0].cert_mofa == "X")
                                        oView.byId("cst_certmofa").setText("Yes");
                                } else {
                                    oView.byId("cst_birthcertificate").setText("Yes");
                                }

                                oView.byId("nsp_kaust").setVisible(false);
                                if (CSTJson.results[0].sponsor_type == "X")
                                    oView.byId("nsp_kaust").setVisible(true);

                                oView.byId("nsp_kaustid").setText(CSTJson.results[0].spon_kaust_id);
                                oView.byId("nsp_fname").setText(CSTJson.results[0].spon_first_name);
                                oView.byId("nsp_mname").setText(CSTJson.results[0].spon_middle_name);
                                oView.byId("nsp_lname").setText(CSTJson.results[0].spon_last_name);
                                oView.byId("nsp_arfname").setText(CSTJson.results[0].spon_ar_first_name);
                                oView.byId("nsp_armname").setText(CSTJson.results[0].spon_ar_middle_name);
                                oView.byId("nsp_arlname").setText(CSTJson.results[0].spon_ar_last_name);
                                oView.byId("nsp_iqama").setText(CSTJson.results[0].spon_iqama_no);
                                oView.byId("nsp_nation").setText(CSTJson.results[0].spon_nationality);

                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
                                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     if (data.results.length > 0 && data.results[0].URL.length > 0) {
                                //         oView.byId("idCSTatt1").setText("Iqama - " + EmpJson.Fname + " " + EmpJson.Lname);
                                //         oView.byId("idCSTatt1").setHref(data.results[0].URL);
                                //     }
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
                                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     if (data.results.length > 0 && data.results[0].URL.length > 0) {
                                //         oView.byId("idCSTatt2").setText("Saudi Visa Page - " + EmpJson.Fname + " " + EmpJson.Lname);
                                //         oView.byId("idCSTatt2").setHref(data.results[0].URL);
                                //     }
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
                                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     if (data.results.length > 0 && data.results[0].URL.length > 0) {
                                //         oView.byId("idCSTatt3").setText("Passport - " + EmpJson.Fname + " " + EmpJson.Lname);
                                //         oView.byId("idCSTatt3").setHref(data.results[0].URL);
                                //     }
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     CSTAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (CSTAttJson.results.length > 0) {
                                //     for (var i = 0; i < CSTAttJson.results.length; i++) {
                                //         if (CSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
                                //             oView.byId("idCSTatt4").setText("NOL to Passport");
                                //             oView.byId("idCSTatt4").setHref(CSTAttJson.results[i].URL);
                                //         }

                                //     }
                                // }

                                // for (var j = 0; j < CSTJson.results.length; j++) {
                                //     for (var i = 1; i < DepJson["results"].length; i++) {
                                //         if (DepJson["results"][i].KaustId == CSTJson.results[j].KaustId) {
                                //             //		    				oView.byId("CSTRIDetails").getItems()[j].getCells()[4].mProperties.text=DepJson["results"][i].age;
                                //             oView.getModel("cstJson").getProperty("/results")[j].Age = DepJson["results"][i].age;
                                //             var chd_birthdate = CSTJson.results[j].Dob;
                                //             if (chd_birthdate != null) {
                                //                 var chd_Dob = chd_birthdate.split("T")[0];
                                //                 if (chd_Dob) {
                                //                     var chdd = chd_Dob.split("-");
                                //                     ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
                                //                     oView.getModel("cstJson").getProperty("/results")[j].Dob = ch_dt;
                                //                 }
                                //             }

                                //             i = DepJson["results"].length + 1;
                                //         }
                                //     }
                                // }
                            }

                            if (CSTHead.Status === 11) {
                                oView.byId("CSTReject").setVisible(true);
                                oView.byId("idcstfincomments").setText(CSTHead.fincomments);
                            }

                            oView.byId("idCSTCollection").setSelectedIndex(0);
                            if (CSTJson.results[0].collection_mtd != null && CSTJson.results[0].collection_mtd == "1") {
                                oView.byId("idCSTCollection").setSelectedIndex(1);
                                oView.byId("CSTPrefBody").setVisible(true);
                                oView.byId("CSTTracking").setVisible(true);
                            }

                            oView.byId("idCSTDelivery").setSelectedIndex(0);
                            if (CSTJson.results[0].delivery_mtd != null && CSTJson.results[0].delivery_mtd == "1") {
                                oView.byId("idCSTDelivery").setSelectedIndex(1);
                                oView.byId("CSTPrefBody").setVisible(true);
                                oView.byId("CSTTracking").setVisible(true);
                            }
                            oView.byId("idCSTTrackingNum").setText(CSTHead.tracking_id);

                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },



            /** Car Registration Renewal (Collect) */
            getCARRegRenewDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("CARREGRENEWPrefBody").setVisible(false);
                oView.byId("CARREGRENEWTracking").setVisible(false);
                oView.byId("CARREGRENEWReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var CARREGRENEWJson;
                var CARREGRENEWHead;
                var CARREGRENEWAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "DrivingLicense,header"
                    },
                    success: function (data, response) {

                        var CARREGRENEWData = new sap.ui.model.json.JSONModel();
                        CARREGRENEWData.setData(data.DrivingLicense);
                        that.getView().setModel(CARREGRENEWData, "CARREGRENEWJson");
                        sap.ui.getCore().setModel(CARREGRENEWData, "CARREGRENEWJson");
                        CARREGRENEWJson = data.DrivingLicense;
                        CARREGRENEWHead = data.header;
                        var oExpeditor = CARREGRENEWHead.expeditor;
                        // that.getExpeditorName();

                        // Populate Driving License Details - Begin
                        if (oSubCode == "0503") {
                            if (CARREGRENEWJson.results.length > 0) {

                                oView.byId("txt_CARREGRENEWExpDate").setText("No");
                                if (CARREGRENEWJson.results[0].card_expired === "X") {
                                    oView.byId("txt_CARREGRENEWExpDate").setText("Yes");
                                }

                                oView.byId("txt_CARREGRENEWFees").setText("No");
                                if (CARREGRENEWJson.results[0].fees_paid === "X") {
                                    oView.byId("txt_CARREGRENEWFees").setText("Yes");
                                }

                                // Populate Attachment Details - Begin
                                // var doctype;
                                // var empnation;
                                // var CARRegAttJson1;
                                // var oModelCarReg = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                                // oModelCarReg.read("UserDetail(KaustID='" + EmpJson.KaustId + "',UserId='')", null, null, false, function (data, response) {
                                //     empnation = data.Nationality;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });
                                // if (empnation != null && empnation.toUpperCase() == "SAUDI ARABIAN") {
                                //     doctype = "17";
                                //     oView.byId("CARREGRENEWatt").setText("Saudi ID");
                                // } else {
                                //     doctype = "3";
                                //     oView.byId("CARREGRENEWatt").setText("Iqama");
                                // }

                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

                                // var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
                                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + doctype + "'";
                                // oAttachModel.read(attxt1, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     CARRegAttJson1 = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (CARRegAttJson1.results.length > 0) {
                                //     oView.byId("CARREGRENEWatt").setHref(CARRegAttJson1.results[0].URL);
                                // }
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     CARREGRENEWAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (CARREGRENEWAttJson.results.length > 0) {
                                //     oView.byId("CARREGRENEWExpatt").setHref(CARREGRENEWAttJson.results[1].URL);
                                //     oView.byId("CARREGRENEWFeeatt").setHref(CARREGRENEWAttJson.results[0].URL);
                                // }
                                // Populate Attachment Details - End

                                // Populate Rejection Details - Begin
                                if (CARREGRENEWHead.status === 11) {
                                    oView.byId("CARREGRENEWReject").setVisible(true);
                                    oView.byId("CARREGRENEWfincomments").setText(CARREGRENEWHead.fincomments);
                                }
                                // Populate Rejection Details - End

                                // Populate Collection / Delivery Details - Begin
                                oView.byId("CARREGRENEWCollection").setSelectedIndex(0);
                                if (CARREGRENEWJson.results[0].collection_mtd != null && CARREGRENEWJson.results[0].collection_mtd == "1") {
                                    oView.byId("CARREGRENEWCollection").setSelectedIndex(0);
                                    oView.byId("CARREGRENEWPrefBody").setVisible(true);
                                    oView.byId("CARREGRENEWTracking").setVisible(true);
                                }

                                oView.byId("CARREGRENEWDelivery").setSelectedIndex(0);
                                if (CARREGRENEWJson.results[0].delivery_mtd != null && CARREGRENEWJson.results[0].delivery_mtd == "1") {
                                    oView.byId("CARREGRENEWDelivery").setSelectedIndex(0);
                                    oView.byId("CARREGRENEWPrefBody").setVisible(true);
                                    oView.byId("CARREGRENEWTracking").setVisible(true);

                                }

                            }
                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Car Driving License Issue (Collect) */
            getDLIssDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("DLISSPrefBody").setVisible(false);
                oView.byId("DLISSTracking").setVisible(false);
                oView.byId("DLISSReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var DLISSJson;
                var DLISSHead;
                var DLISSAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "DrivingLicense,header"
                    },
                    success: function (data, response) {
                        var dlissData = new sap.ui.model.json.JSONModel();
                        dlissData.setData(data.DrivingLicense);
                        that.getView().setModel(dlissData, "DLISSJson");
                        sap.ui.getCore().setModel(dlissData, "DLISSJson");
                        DLISSJson = data.DrivingLicense;
                        DLISSHead = data.header;

                        var oExpeditor = DLISSHead.expeditor;
                        // that.getExpeditorName();
                        if (oSubCode == "0504") {
                            if (DLISSJson.results.length > 0) {

                                oView.byId("txt_DLISSFP").setText("No");
                                if (DLISSJson.results[0].finger_letter === "X") {
                                    oView.byId("txt_DLISSFP").setText("Yes");
                                }

                                oView.byId("txt_DLISSMor").setText("No");
                                if (DLISSJson.results[0].morror_pass === "X") {
                                    oView.byId("txt_DLISSMor").setText("Yes");
                                }



                                // Populate Attachment Details - Begin
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     DLISSAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (DLISSAttJson.results.length > 0) {
                                //     //oView.byId("DLISSFPatt").setHref(DLISSAttJson.results[1].URL);
                                //     oView.byId("DLISSMoratt").setHref(DLISSAttJson.results[0].URL);
                                // }
                                // Populate Attachment Details - End

                                // Populate Rejection Details - Begin
                                if (DLISSHead.status == - 11) {
                                    oView.byId("DLISSReject").setVisible(true);
                                    oView.byId("DLISSfincomments").setText(DLISSHead.fincomments);
                                }
                                // Populate Rejection Details - End

                                oView.byId("DLISSDelivery").setSelectedIndex(0);
                                if (DLISSJson.results[0].delivery_mtd != null && DLISSJson.results[0].delivery_mtd === "1") {
                                    oView.byId("DLISSDelivery").setSelectedIndex(0);
                                    oView.byId("DLISSPrefBody").setVisible(true);
                                    oView.byId("DLISSTracking").setVisible(true);

                                }

                            }



                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Car Driving License Renewal (Collect) */
            getDLRDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("DLRENEWPrefBody").setVisible(false);
                oView.byId("DLRENEWTracking").setVisible(false);
                oView.byId("DLRENEWReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var DLRJson;
                var DLRHead;
                var DLRAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "DrivingLicense,header"
                    },
                    success: function (data, response) {
                        var dlrData = new sap.ui.model.json.JSONModel();
                        dlrData.setData(data.DrivingLicense);
                        that.getView().setModel(dlrData, "DLRENEWJson");
                        sap.ui.getCore().setModel(dlrData, "DLRENEWJson");
                        DLRJson = data.DrivingLicense;
                        DLRHead = data.header;

                        var oExpeditor = DLRHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "0502") {
                            if (DLRJson.results.length > 0) {

                                oView.byId("txt_DLR").setText("No");
                                if (DLRJson.results[0].moi_absher === "true")
                                    oView.byId("txt_DLR").setText("Yes");


                                // Populate Attachment Details - Begin
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     DLRAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (DLRAttJson.results.length > 0) {
                                //     oView.byId("DLRatt").setHref(DLRAttJson.results[0].URL);
                                // }
                                // // Populate Attachment Details - End

                                // // Populate Rejection Details - Begin
                                // if (DLRHead.Status == "011") {
                                //     oView.byId("DLRENEWReject").setVisible(true);
                                //     oView.byId("DLRENEWfincomments").setText(DLRHead.Fincomments);
                                // }
                                // Populate Rejection Details - End

                                // Populate Collection / Delivery Details - Begin
                                oView.byId("DLRENEWCollection").setSelectedIndex(0);
                                if (DLRJson.results[0].collection_mtd != null && DLRJson.results[0].collection_mtd == "1") {
                                    oView.byId("DLRENEWCollection").setSelectedIndex(1);
                                    oView.byId("DLRENEWPrefBody").setVisible(true);
                                    oView.byId("DLRENEWTracking").setVisible(true);
                                }

                                oView.byId("DLRENEWDelivery").setSelectedIndex(0);
                                if (DLRJson.results[0].delivery_mtd != null && DLRJson.results[0].delivery_mtd == "1") {
                                    oView.byId("DLRENEWDelivery").setSelectedIndex(1);
                                    oView.byId("DLRENEWPrefBody").setVisible(true);
                                    oView.byId("DLRENEWTracking").setVisible(true);

                                }

                            }

                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Motorcycle Driving License Issue (Collect) */
            getMCDLIssDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("MCDLISSPrefBody").setVisible(false);
                oView.byId("MCDLISSTracking").setVisible(false);
                oView.byId("MCDLISSReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var MCDLISSJson;
                var MCDLISSHead;
                var MCDLISSAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "DrivingLicense,header"
                    },
                    success: function (data, response) {
                        var mcdlissData = new sap.ui.model.json.JSONModel();
                        mcdlissData.setData(data.DrivingLicense);
                        that.getView().setModel(mcdlissData, "MCDLISSJson");
                        sap.ui.getCore().setModel(mcdlissData, "MCDLISSJson");
                        MCDLISSJson = data.DrivingLicense;
                        MCDLISSHead = data.header;

                        var oExpeditor = MCDLISSHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "0501") {
                            if (MCDLISSJson.results.length > 0) {

                                oView.byId("txt_MCDLFP").setText("No");
                                if (MCDLISSJson.results[0].finger_letter === "X") {
                                    oView.byId("txt_MCDLFP").setText("Yes");
                                }

                                oView.byId("txt_MCDLMor").setText("No");
                                if (MCDLISSJson.results[0].morror_pass === "X") {
                                    oView.byId("txt_MCDLMor").setText("Yes");
                                }

                                // Populate Attachment Details - Begin
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     MCDLISSAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (MCDLISSAttJson.results.length > 0) {
                                //     oView.byId("MCDLISSMoratt").setHref(MCDLISSAttJson.results[0].URL);
                                // }
                                // Populate Attachment Details - End

                                // Populate Rejection Details - Begin
                                if (MCDLISSHead.Status == "011") {
                                    oView.byId("MCDLISSReject").setVisible(true);
                                    oView.byId("MCDLISSfincomments").setText(MCDLISSHead.fincomments);
                                }


                                oView.byId("MCDLISSDelivery").setSelectedIndex(0);
                                if (MCDLISSJson.results[0].delivery_mtd != null && MCDLISSJson.results[0].delivery_mtd == "1") {
                                    oView.byId("MCDLISSDelivery").setSelectedIndex(0);
                                    oView.byId("MCDLISSPrefBody").setVisible(true);
                                    oView.byId("MCDLISSTracking").setVisible(true);

                                }
                            }
                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Motorcycle Driving License Renewal (Collect) */
            getMCDLRDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("MCDLRENEWPrefBody").setVisible(false);
                oView.byId("MCDLRENEWTracking").setVisible(false);
                oView.byId("MCDLRENEWReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var MCDLRJson;
                var MCDLRHead;
                var MCDLRAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "DrivingLicense,header"
                    },
                    success: function (data, response) {
                        var mcdlrData = new sap.ui.model.json.JSONModel();
                        mcdlrData.setData(data.DrivingLicense);
                        that.getView().setModel(mcdlrData, "MCDLRENEWJson");
                        sap.ui.getCore().setModel(mcdlrData, "MCDLRENEWJson");
                        MCDLRJson = data.DrivingLicense;
                        MCDLRHead = data.header;

                        var oExpeditor = MCDLRHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "0505") {


                            if (MCDLRJson.results.length > 0) {

                                oView.byId("txt_MCDLR").setText("No");
                                if (MCDLRJson.results[0].moi_absher === "true")
                                    oView.byId("txt_MCDLR").setText("Yes");


                                // Populate Attachment Details - Begin
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     MCDLRAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (MCDLRAttJson.results.length > 0) {
                                //     oView.byId("MCDLRatt").setHref(MCDLRAttJson.results[0].URL);
                                // }
                                // Populate Attachment Details - End

                                // Populate Rejection Details - Begin
                                if (MCDLRHead.status === 11) {
                                    oView.byId("MCDLRENEWReject").setVisible(true);
                                    oView.byId("MCDLRENEWfincomments").setText(MCDLRHead.fincomments);
                                }
                                // Populate Rejection Details - End

                                // Populate Collection / Delivery Details - Begin
                                oView.byId("MCDLRENEWCollection").setSelectedIndex(0);
                                if (MCDLRJson.results[0].collection_mtd != null && MCDLRJson.results[0].collection_mtd == "1") {
                                    oView.byId("MCDLRENEWCollection").setSelectedIndex(1);
                                    oView.byId("MCDLRENEWPrefBody").setVisible(true);
                                    oView.byId("MCDLRENEWTracking").setVisible(true);
                                }

                                oView.byId("MCDLRENEWDelivery").setSelectedIndex(0);
                                if (MCDLRJson.results[0].delivery_mtd != null && MCDLRJson.results[0].delivery_mtd == "1") {
                                    oView.byId("MCDLRENEWDelivery").setSelectedIndex(1);
                                    oView.byId("MCDLRENEWPrefBody").setVisible(true);
                                    oView.byId("MCDLRENEWTracking").setVisible(true);

                                }

                            }

                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Final Exit Visa Issuance */
            getFEVDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("FEVSReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var FEVJson;
                var FEVHead;
                var FEVtJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "Iqama,header"
                    },
                    success: function (data, response) {
                        var dlrData = new sap.ui.model.json.JSONModel();
                        dlrData.setData(data.Iqama);
                        that.getView().setModel(dlrData, "FEVNEWJson");
                        sap.ui.getCore().setModel(dlrData, "FEVNEWJson");

                        FEVJson = data.Iqama;
                        FEVHead = data.header;
                        var dataHeader = data.Iqama["results"];
                        for (var i = 0; i <= dataHeader.length - 1; i++) {
                            var RequestorTypeFlag = dataHeader[i].requestor_type_flag;
                            if (RequestorTypeFlag === "" || RequestorTypeFlag === "S") {
                                sap.ui.getCore().byId("fev_requstorflag").setText("Both");
                                if (RequestorTypeFlag === "S")
                                    var sponsFlag = dataHeader[i].sponsorship_check_flag;
                                sap.ui.getCore().byId("fev_sps").setVisible(true);
                                sap.ui.getCore().byId("fev_car").setVisible(true);
                                sap.ui.getCore().byId("fev_vis").setVisible(true);

                                if (sponsFlag === "" || sponsFlag === null) {
                                    sap.ui.getCore().byId("fev_sponsorshipflag").setText("No");
                                } else if (sponsFlag === "X") {
                                    sap.ui.getCore().byId("fev_sponsorshipflag").setText("Yes");
                                }

                                var carFlag = dataHeader[i].request_type_flag;
                                if (carFlag === "" || sponsFlag === null) {
                                    sap.ui.getCore().byId("fev_carflag").setText("No");
                                } else if (carFlag === "X") {
                                    sap.ui.getCore().byId("fev_carflag").setText("Yes");
                                }

                                var key = dataHeader[i].visitor_check_flag;
                                if (key === "" || key === null) {
                                    sap.ui.getCore().byId("fev_visitorflag").setText("No");
                                } else if (key === "X") {
                                    sap.ui.getCore().byId("fev_visitorflag").setText("Yes");
                                }

                            } else if (RequestorTypeFlag === "D") {
                                sap.ui.getCore().byId("fev_requstorflag").setText("Dependent");
                                sap.ui.getCore().byId("idbBoarderNum").setVisible(false);
                                sap.ui.getCore().byId("fev_sps").setVisible(false);
                                sap.ui.getCore().byId("fev_car").setVisible(false);
                                sap.ui.getCore().byId("fev_vis").setVisible(false);

                            }
                            break;
                        }

                        var oExpeditor = FEVHead.expeditor;
                        // that.getExpeditorName();

                        that.getUserData(data.header.kaust_id, requestId);

                        if (FEVHead.status === 11) {
                            oView.byId("FEVSReject").setVisible(true);
                            oView.byId("idFEVfincomments").setText(FEVHead.fincomments);
                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Final Exit Visa Cancellation */
            getFEVCANDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("FEVCANCELSReject").setVisible(false);
                var PrefJson;
                var EmpJson;
                var FEVCANCELJson;
                var FEVCANCELHead;
                var FEVtJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "Iqama,header"
                    },
                    success: function (data, response) {
                        var dlrData = new sap.ui.model.json.JSONModel();
                        dlrData.setData(data.Iqama);
                        that.getView().setModel(dlrData, "FEVNEWJson");
                        sap.ui.getCore().setModel(dlrData, "FEVNEWJson");

                        FEVCANCELJson = data.Iqama;

                        FEVCANCELHead = data.header;
                        var dataHeader = data.Iqama["results"];

                        for (var i = 0; i <= dataHeader.length - 1; i++) {
                            var RequestorTypeFlag = dataHeader[i].requestor_type_flag;

                            if (RequestorTypeFlag === "" || RequestorTypeFlag === "S") {

                                var RequestTypeFlag = dataHeader[i].request_type_flag;
                                if (RequestorTypeFlag === "S") {
                                    sap.ui.getCore().byId("fevCancel_requstorflag").setText("Self");
                                } else {
                                    sap.ui.getCore().byId("fevCancel_requstorflag").setText("Both");
                                }
                            } else if (RequestorTypeFlag === "D") {
                                sap.ui.getCore().byId("fevCancel_requstorflag").setText("Dependent");

                            }
                            break;
                        }

                        var oExpeditor = FEVCANCELHead.expeditor;
                        // that.getExpeditorName();

                        that.getUserData(data.header.kaust_id, requestId);

                        if (FEVCANCELHead.status === 11) {
                            oView.byId("FEVCancelSReject").setVisible(true);
                            oView.byId("idFEVCancelfincomments").setText(FEVCANCELHead.fincomments);
                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Iqama Issuance */
            getIQMISSDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("IQMISSPrefBody").setVisible(false);
                oView.byId("IQMISSTracking").setVisible(false);
                oView.byId("IQMISSReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var IQMISSJson;
                var IQMISSHead;
                var IQMISSAttJson;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "Iqama,header"
                    },
                    success: function (data, response) {
                        var iqmissData = new sap.ui.model.json.JSONModel();
                        iqmissData.setData(data.Iqama);
                        that.getView().setModel(iqmissData, "iqmissJson");
                        sap.ui.getCore().setModel(iqmissData, "iqmissJson");
                        IQMISSJson = data.Iqama;
                        IQMISSHead = data.header;

                        var oExpeditor = IQMISSHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "0103" || oSubCode == "9103") {
                            if (IQMISSJson.results.length > 0) {
                                oView.byId("iqmiss_kaustid").setText(IQMISSJson.results[0].kaust_id);
                                oView.byId("iqmiss_fname").setText(IQMISSJson.results[0].first_name);
                                oView.byId("iqmiss_mname").setText(IQMISSJson.results[0].middle_name);
                                oView.byId("iqmiss_lname").setText(IQMISSJson.results[0].last_name);
                                oView.byId("iqmiss_arfname").setText(IQMISSJson.results[0].ar_first_name);
                                oView.byId("iqmiss_armname").setText(IQMISSJson.results[0].ar_mid_name);
                                oView.byId("iqmiss_arlname").setText(IQMISSJson.results[0].ar_last_name);
                                oView.byId("iqmiss_nation").setText(IQMISSJson.results[0].nationality);
                                oView.byId("iqmiss_gender").setText(IQMISSJson.results[0].gender);
                                oView.byId("iqmiss_bordernum").setText(IQMISSJson.results[0].border_no);
                                oView.byId("iqmiss_costcenter").setText(IQMISSJson.results[0].cost_center);
                                oView.byId("iqmiss_wbs").setText(data.wbs);

                                oView.byId("iqmiss_medtst").setText("No");
                                if (IQMISSJson.results[0].medical_test_flag == "X")
                                    oView.byId("iqmiss_medtst").setText("Yes");

                                if (data.iqama_duration == "1")
                                    oView.byId("iqmiss_duration").setText("1 Year");
                                else if (data.iqama_duration == "2")
                                    oView.byId("iqmiss_duration").setText("2 Years");

                                // Populate Attachment Details - Begin
                                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
                                //     "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                                //     var attachModel = new sap.ui.model.json.JSONModel();
                                //     attachModel.setData(data);
                                //     IQMISSAttJson = data;
                                // },
                                //     function (response) {
                                //         return "";
                                //     });

                                // if (IQMISSAttJson.results.length > 0) {
                                //     for (var i = 0; i < IQMISSAttJson.results.length; i++) {
                                //         if (IQMISSAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "PASSPORT") {
                                //             oView.byId("idIQMISSatt1").setText("Passport");
                                //             oView.byId("idIQMISSatt1").setHref(IQMISSAttJson.results[i].URL);
                                //         }
                                //         if (IQMISSAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "SAUDI_VISA") {
                                //             oView.byId("idIQMISSatt2").setText("Saudi Visa");
                                //             oView.byId("idIQMISSatt2").setHref(IQMISSAttJson.results[i].URL);
                                //         }
                                //     }
                                // }
                                if (IQMISSHead.status === 11) {
                                    oView.byId("IQMISSReject").setVisible(true);
                                    oView.byId("idiqamissfincomments").setText(IQMISSHead.fincomments);
                                }
                                oView.byId("iqmiss_collec").setVisible(false);

                                oView.byId("idIQMISSDelivery").setSelectedIndex(0);
                                if (IQMISSJson.results[0].delivery_mtd != null && IQMISSJson.results[0].delivery_mtd == "1") {
                                    oView.byId("idIQMISSDelivery").setSelectedIndex(1);
                                    oView.byId("IQMISSPrefBody").setVisible(true);
                                    oView.byId("IQMISSTracking").setVisible(true);

                                }
                            }


                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Iqama Renewal */
            getIqamaRenDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("IqamaRenReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var IqamaRenJson;
                var IqamaRenHead;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "Iqama,header"
                    },
                    success: function (data, response) {
                        var IqamaRenData = new sap.ui.model.json.JSONModel();
                        var ReqData = [];
                        var Reqobj = {};
                        data.Iqama.results.forEach(function (val, index) {
                            Reqobj.KaustId = val.kaust_id;
                            Reqobj.FirstName = val.first_name;
                            Reqobj.MiddleName = val.middle_name;
                            Reqobj.LastName = val.last_name;
                            Reqobj.Nationality = val.nationality;
                            Reqobj.SaudiNo = val.saudi_id_no;
                            Reqobj.IqamaNo = val.iqama_no;
                            Reqobj.ExpiryDate = val.new_expiry_date;
                            ReqData.push(Reqobj);

                        });
                        IqamaRenData.setData(ReqData);
                        var IqamaRenItemData = new sap.ui.model.json.JSONModel();
                        IqamaRenItemData.setData(data.Iqama);
                        that.getView().setModel(IqamaRenData, "IqamaRenJson");
                        sap.ui.getCore().setModel(IqamaRenData, "IqamaRenJson");
                        that.getView().setModel(IqamaRenItemData, "IqamaRenItemJson");
                        sap.ui.getCore().setModel(IqamaRenItemData, "IqamaRenItemJson");
                        IqamaRenJson = data.Iqama;
                        IqamaRenHead = data.header;

                        var oExpeditor = IqamaRenHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "0101") {
                            if (IqamaRenJson.results.length > 0) {

                                if (IqamaRenJson.results[0].requestor_type_flag === "S") {
                                    oView.byId("txt_IqamaRenReq").setText("Self");
                                } else if (IqamaRenJson.results[0].requestor_type_flag === "D") {
                                    oView.byId("txt_IqamaRenReq").setText("Dependents");
                                } else {
                                    oView.byId("txt_IqamaRenReq").setText("Both");
                                }

                                if (data.duration === "1")
                                    oView.byId("txt_IqamaDuration").setText("One Year");
                                else if (data.duration === "2")
                                    oView.byId("txt_IqamaDuration").setText("Two Years");

                                // Populate Rejection Details - Begin
                                if (IqamaRenHead.status == 11) {
                                    oView.byId("IqamaRenReject").setVisible(true);
                                    oView.byId("IqamaRenfincomments").setText(IqamaRenHead.Fincomments);
                                }

                                // if (MOEJson.results[0].collection_mtd != null && MOEJson.results[0].collection_mtd == "1") {
                                // 	oView.byId("MOECollection").setSelectedIndex(0);
                                // 	oView.byId("MOEPrefBody").setVisible(true);
                                // 	oView.byId("MOETracking").setVisible(true);
                                // }

                                // oView.byId("IqamaRenDelivery").setSelectedIndex(0);
                                // if (IqamaRenJson.results[0].delivery_mtd != null && IqamaRenJson.results[0].delivery_mtd == "1") {
                                // 	oView.byId("IqamaRenDelivery").setSelectedIndex(0);
                                // 	oView.byId("IqamaRenPrefBody").setVisible(true);
                                // 	oView.byId("IqamaRenTracking").setVisible(true);

                                // }

                            }



                        }
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Family Residency Visa */
            getFamilyResidencyDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                var odetails;
                var kidsTotal = [];
                var isSpouse = [];

                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "VisitVisa,header"
                    },
                    success: function (oData, response) {
                        sap.ui.getCore().byId("idFamilyResVisa").setVisible(true);
                        var oDegJson = new sap.ui.model.json.JSONModel();
                        oDegJson.setData(oData);
                        that.getView().setModel(oDegJson, "oDegJson");
                        var oVisaJson = new sap.ui.model.json.JSONModel();
                        oVisaJson.setData(oData.VisitVisa);
                        that.getView().setModel(oVisaJson, "oVisaJson");
                        odetails = oData.VisitVisa.results;
                        // var oUserModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                        // oUserModel.read("UserDetail(KaustID='" + oData.results[0].KaustId + "',UserId='')", null, null, false, function (data) {
                        // 	var oReqJson = new sap.ui.model.json.JSONModel();
                        // 	oReqJson.setData(data);
                        // 	that.getView().setModel(oReqJson, "oReqJson");
                        // 	if (data.Nationality === "Saudi Arabian") {
                        // 		sap.ui.getCore().byId("idIqamalbl").setValue("Saudi ID");
                        // 		sap.ui.getCore().byId("idIqamaval").setValue(data.SaudiID);
                        // 	} else {
                        // 		sap.ui.getCore().byId("idIqamalbl").setValue("Iqama");
                        // 		sap.ui.getCore().byId("idIqamaval").setValue(data.Iqama);
                        // 	}
                        // 	sap.ui.getCore().byId("idVisaNo").setValue(oData.results[0].VisaNumber);
                        // });


                        for (var k = 0; k < odetails.length; k++) {
                            if (odetails[k].relationship === "Child") {
                                kidsTotal.push(odetails[k]);
                            }
                            if (odetails[k].relationship === "Spouse") {
                                isSpouse.push(odetails[k]);
                            }
                            if (odetails[k].religion === 2) {
                                oData.VisitVisa.results[k].ReliName = "Non-Muslim";
                            } else {
                                oData.VisitVisa.results[k].ReliName = "Muslim";
                            }

                            // for (var nat = 0; nat < nations.length; nat++) {
                            //     if (odetails[k].Nationality === nations[nat].LAND1) {
                            //         oData.VisitVisa.results[k].nation = nations[nat].LANDX;
                            //     }
                            // }
                        }

                        var familyData = new sap.ui.model.json.JSONModel();
                        familyData.setData(oData.VisitVisa);
                        that.getView().setModel(familyData, "frJson");

                        //File Read
                        // var passportForms = that.getFileAttachmentRequestDetails(null, requestId, 3);
                        // var birthCertificates = that.getFileAttachmentRequestDetails(null, requestId, 13);
                        // var mrgCertificates = that.getFileAttachmentRequestDetails(null, requestId, 11);
                        // var hb = sap.ui.getCore().byId("idhb");
                        // var spouseFiles;
                        // for (var i = 0; i < isSpouse.length; i++) {
                        //     var vb = new sap.m.VBox();
                        //     vb.addStyleClass("destilPartHeaderDSTStyle");
                        //     var name = "<strong>Spouse - " + isSpouse[i].FirstName + " " + isSpouse[i].MiddleName + " " + isSpouse[i].LastName + "</strong>\n";
                        //     var nameS = new sap.m.FormattedText({
                        //         htmlText: name
                        //     });
                        //     vb.addItem(nameS);
                        //     hb.addItem(vb);
                        //     for (var j = 0; j < passportForms.length; j++) {
                        //         var vb = new sap.m.VBox();
                        //         vb.addStyleClass("destilPartHeaderDSTStyle");
                        //         if (passportForms[j].FILENAME.includes("SPOUSE")) {
                        //             spouseFiles = new sap.m.Link({
                        //                 href: passportForms[j].URL,
                        //                 text: "Passport",
                        //                 target: "_blank",
                        //                 emphasized: true
                        //             });
                        //             vb.addItem(spouseFiles);
                        //             hb.addItem(vb);
                        //         }
                        //     }
                        //     for (var j = 0; j < mrgCertificates.length; j++) {
                        //         if (mrgCertificates[j].FILENAME.includes("ATTESTEDMRG")) {
                        //             var vb = new sap.m.VBox();
                        //             vb.addStyleClass("destilPartHeaderDSTStyle");
                        //             spouseFiles = new sap.m.Link({
                        //                 href: mrgCertificates[j].URL,
                        //                 text: "Attested Marriage Certificate",
                        //                 target: "_blank",
                        //                 emphasized: true
                        //             });
                        //             vb.addItem(spouseFiles);
                        //             hb.addItem(vb);
                        //         } else if (mrgCertificates[j].FILENAME.includes("TRANSLATEDMRG")) {
                        //             var vb = new sap.m.VBox();
                        //             vb.addStyleClass("destilPartHeaderDSTStyle");
                        //             spouseFiles = new sap.m.Link({
                        //                 href: mrgCertificates[j].URL,
                        //                 text: "Translated Marriage Certificate",
                        //                 target: "_blank",
                        //                 emphasized: true
                        //             });
                        //             vb.addItem(spouseFiles);
                        //             hb.addItem(vb);
                        //         }
                        //     }
                        // }

                        // var hb1 = sap.ui.getCore().byId("idhb1");
                        // var kidFiles;
                        // if (kidsTotal.length > 0) {
                        //     for (var i = 0; i < kidsTotal.length; i++) {
                        //         var hbox = new sap.m.VBox();
                        //         var vb1 = new sap.m.VBox();
                        //         vb1.addStyleClass("destilPartHeaderDSTStyle");
                        //         var kidname = "<strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i].LastName +
                        //             "</strong>";
                        //         if (i > 0) {
                        //             kidname = "<br><br><strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i].LastName +
                        //                 "</strong>";
                        //         }
                        //         var nameK = new sap.m.FormattedText({
                        //             htmlText: kidname
                        //         });
                        //         vb1.addItem(nameK);
                        //         hbox.addItem(vb1);
                        //         var num = parseInt(kidsTotal[i].SequenceNumber) - 1;
                        //         for (var j = 0; j < passportForms.length; j++) {
                        //             if (passportForms[j].FILENAME.includes("PASSPORTKID" + num)) {
                        //                 var vb1 = new sap.m.VBox();
                        //                 vb1.addStyleClass("destilPartHeaderDSTStyle");
                        //                 kidFiles = new sap.m.Link({
                        //                     href: passportForms[j].URL,
                        //                     text: "Passport",
                        //                     target: "_blank",
                        //                     emphasized: true
                        //                 });
                        //                 vb1.addItem(kidFiles);
                        //                 hbox.addItem(vb1);
                        //             }
                        //         }
                        //         for (var j = 0; j < birthCertificates.length; j++) {
                        //             if (birthCertificates[j].FILENAME.includes("ATTESTEDKID" + num)) {
                        //                 var vb1 = new sap.m.VBox();
                        //                 vb1.addStyleClass("destilPartHeaderDSTStyle");
                        //                 kidFiles = new sap.m.Link({
                        //                     href: birthCertificates[j].URL,
                        //                     text: "Attested Birth Certificate",
                        //                     target: "_blank",
                        //                     emphasized: true
                        //                 });
                        //                 vb1.addItem(kidFiles);
                        //                 hbox.addItem(vb1);
                        //             } else if (birthCertificates[j].FILENAME.includes("TRANSLATEDKID" + num)) {
                        //                 var vb1 = new sap.m.VBox();
                        //                 vb1.addStyleClass("destilPartHeaderDSTStyle");
                        //                 kidFiles = new sap.m.Link({
                        //                     href: birthCertificates[j].URL,
                        //                     text: "Translated Birth Certificate",
                        //                     target: "_blank",
                        //                     emphasized: true
                        //                 });
                        //                 vb1.addItem(kidFiles);
                        //                 hbox.addItem(vb1);
                        //             }
                        //         }
                        //         hb1.addItem(hbox);
                        //     }
                        // }

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

                        sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails[0].delivery_mtd));
                        sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails[0].collection_mtd));

                        if (odetails[0].delivery_mtd === "1" || odetails[0].collection_mtd === "1") {
                            sap.ui.getCore().byId("idUpsForm").setVisible(true);
                        } else {
                            sap.ui.getCore().byId("idUpsForm").setVisible(false);
                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Attestation from Ministry of Education(MOE) */
            getMoeDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("MOEPrefBody").setVisible(false);
                oView.byId("MOETracking").setVisible(false);
                oView.byId("MOEReject").setVisible(false);

                var PrefJson;
                var EmpJson;
                var MOEJson;
                var MOEHead;

                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "MOEAttest,header"
                    },
                    success: function (data, response) {
                        var MOEData = new sap.ui.model.json.JSONModel();
                        var ReqData = [];
                        var Reqobj = {};
                        // var val = data.header;
                        //     Reqobj.KaustId = val.kaust_id;
                        //     Reqobj.FirstName = val.first_name;
                        //     Reqobj.MiddleName = val.middle_name;
                        //     Reqobj.LastName = val.last_name;
                        //     Reqobj.Nationality = val.Nationality;
                        //     Reqobj.SaudiNo = val.IdNumber;
                        //     Reqobj.IqamaNo = val.IqamaNo;
                        //     ReqData.push(Reqobj);

                        // MOEData.setData(ReqData);

                        var MOEItemData = new sap.ui.model.json.JSONModel();
                        MOEItemData.setData(data.MOEAttest);
                        that.getView().setModel(MOEData, "MOEJson");
                        sap.ui.getCore().setModel(MOEData, "MOEJson");
                        that.getView().setModel(MOEItemData, "MOEItemJson");
                        sap.ui.getCore().setModel(MOEItemData, "MOEItemJson");
                        MOEJson = data.MOEAttest;
                        MOEHead = data.head;

                        var oExpeditor = MOEHead.expeditor;
                        // that.getExpeditorName();

                        if (oSubCode == "1702") {
                            if (MOEJson.results.length > 0) {

                                if (MOEJson.results[0].service_type === 1) {
                                    oView.byId("txt_MOEReq").setText("Sponsor");
                                } else if (MOEJson.results[0].service_type === 2) {
                                    oView.byId("txt_MOEReq").setText("Dependents");
                                } else {
                                    oView.byId("txt_MOEReq").setText("Both");
                                }

                                if (MOEHead.status === 11) {
                                    oView.byId("MOEReject").setVisible(true);
                                    oView.byId("MOEfincomments").setText(MOEHead.fincomments);
                                }

                                oView.byId("MOECollection").setSelectedIndex(0);
                                if (MOEJson.results[0].collection_mtd != null && MOEJson.results[0].collection_mtd == "1") {
                                    oView.byId("MOECollection").setSelectedIndex(0);
                                    oView.byId("MOEPrefBody").setVisible(true);
                                    oView.byId("MOETracking").setVisible(true);
                                }

                                oView.byId("MOEDelivery").setSelectedIndex(0);
                                if (MOEJson.results[0].delivery_mtd != null && MOEJson.results[0].delivery_mtd == "1") {
                                    oView.byId("MOEDelivery").setSelectedIndex(0);
                                    oView.byId("MOEPrefBody").setVisible(true);
                                    oView.byId("MOETracking").setVisible(true);

                                }

                            }


                        }


                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },


            /** Car Ownership Transfer */
            getVOTDetails: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                var oView = sap.ui.getCore();
                oView.byId("VOTCPrefBody").setVisible(false);
                oView.byId("VOTDPrefBody").setVisible(false);
                oView.byId("VOTTracking").setVisible(false);
                oView.byId("VOTReject").setVisible(false);
                var PrefCJson;
                var PrefDJson;
                var EmpJson;
                var VOTJson;
                var BuyJson;
                var SAtt1Json;
                var SAtt2Json;
                var SAtt3Json;
                var SAtt4Json;

                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/CartransferSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,GAHeader"
                    },
                    success: function (data, response) {
                        var votReqModel = new sap.ui.model.json.JSONModel();
                        votReqModel.setData(data);
                        VOTJson = data;



                        var oExpeditor = VOTJson.header.expeditor;
                        // that.getExpeditorName();

                        // Load the Collection preference Data
                        that.CollectionPreferenceData(VOTJson.s_kaust_id, oSubCode, that);

                        // Load the Delivery preference Data
                        that.DeliveryPreferenceData(VOTJson.b_kaust_id, oSubCode, that);

                        if (oSubCode == "0507") {
                            oView.byId("idskaustid").setText(VOTJson.s_kaust_id);
                            oView.byId("idsname").setText(VOTJson.s_name);
                            oView.byId("idsemail").setText(VOTJson.s_email);
                            oView.byId("idsmobile").setText(VOTJson.s_mobile);

                            oView.byId("idbkaustid").setText(VOTJson.b_kaust_id);
                            oView.byId("idbname").setText(VOTJson.b_name);
                            oView.byId("idbemail").setText(VOTJson.b_email);
                            oView.byId("idbmobile").setText(VOTJson.b_mobile);

                            oView.byId("idcbrand").setText(VOTJson.brand_code);
                            oView.byId("idcmodel").setText(VOTJson.model_code);
                            oView.byId("idccolor").setText(VOTJson.color_code);
                            oView.byId("idcplate").setText(VOTJson.plate_no);
                            oView.byId("idcyear").setText(VOTJson.car_year);
                            oView.byId("idcprice").setText(VOTJson.car_price + " SAR");

                            // var oAttachModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                            // var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + VOTJson.SKaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '15'";
                            // oAttachModel1.read(attxt1, null, null, false, function (data1, response) {
                            //     var attachModel1 = new sap.ui.model.json.JSONModel();
                            //     attachModel1.setData(data1);
                            //     SAtt1Json = data1;
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            // var oAttachModel2 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                            // var attxt2 = "FileRead?$filter=UNIQUE_ID eq '" + VOTJson.SKaustId +
                            //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '35'";
                            // oAttachModel2.read(attxt2, null, null, false, function (data2, response) {
                            //     var attachModel2 = new sap.ui.model.json.JSONModel();
                            //     attachModel2.setData(data2);
                            //     SAtt2Json = data2;
                            // },
                            //     function (response) {
                            //         return "";
                            //     });

                            oView.byId("idvvehsticker").setText("No");
                            if (VOTJson.vehicle_sticker != null && VOTJson.vehicle_sticker == "X") {
                                oView.byId("idvvehsticker").setText("Yes");
                            }



                            // if (SAtt1Json.results.length > 0) {
                            //     oView.byId("idvotatt1").setText(SAtt1Json.results[0].FILENAME);
                            //     oView.byId("idvotatt1").setHref(SAtt1Json.results[0].URL);
                            // }

                            // if (SAtt2Json.results.length > 0) {
                            //     oView.byId("idvotatt2").setText(SAtt2Json.results[0].FILENAME);
                            //     oView.byId("idvotatt2").setHref(SAtt2Json.results[0].URL);
                            // }

                            if (VOTJson.status === 11) {
                                oView.byId("VOTReject").setVisible(true);
                                oView.byId("idbcomments").setText(VOTJson.bcomments);
                            }
                            // oView.byId("idAmtRecdInp").setText(VOTJson.GAHeader.amount);

                            oView.byId("idvotCollection").setSelectedIndex(0);
                            if (VOTJson.collection_mtd != null && VOTJson.collection_mtd == "1") {
                                oView.byId("idvotCollection").setSelectedIndex(1);
                                oView.byId("VOTCPrefBody").setVisible(true);
                                oView.byId("VOTTracking").setVisible(true);
                            }

                            oView.byId("idvotDelivery").setSelectedIndex(0);
                            if (VOTJson.delivery_mtd != null && VOTJson.delivery_mtd == "1") {
                                oView.byId("idvotDelivery").setSelectedIndex(1);
                                oView.byId("VOTDPrefBody").setVisible(true);
                                oView.byId("VOTTracking").setVisible(true);
                            }

                        }

                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Saudi National ID Pick-up */
            getSaudiIdData: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                sap.ui.getCore().byId("idSaudiId").setVisible(true);

                //Get the country name
                var oBCModel = that.getOwnerComponent().getModel("oBCModel");
                var nations = oBCModel.getData();

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,SaudiID"
                    },
                    success: function (oData, response) {
                        if (oSubCode === "0306") {
                            var oSPJson = new sap.ui.model.json.JSONModel();
                            oSPJson.setData(oData.SaudiID);
                            var odetails = oData.SaudiID.results[0];
                            var idata = oData.SaudiID.results;
                            for (var it = 0; it < idata.length; it++) {
                                var dob = idata[it].date_of_birth;
                                oData.SaudiID.results[it].birthd = that.convertDateBack(dob, '-');
                            }
                            that.getView().setModel(oSPJson, "oSPJson");
                            sap.ui.getCore().setModel(oSPJson, "oSPJson");
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

                            // Get the Kaust location
                            that.getKaustRepSet(oData.rep_date, oData.location, oData.pickup_type, that);

                        }
                    },
                    error: function (oError) {
                        jQuery.sap.log.error(oError.statusCode + ": " + oError.statusText + " - " + oError.message);
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            /** Saudi Passport Pick-up */
            getSaudiPassport: function (sRequestId, oSubCode) {
                var that = this;
                var requestId = sRequestId;
                sap.ui.getCore().byId("idSaudiPP").setVisible(true);
                var odetails;
                var t = this;
                var DepJson;


                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/GASC_HeaderSet/" + requestId;
                oGAModel.read(sRequestURL, {
                    urlParameters: {
                        "$expand": "header,SaudiID"
                    },
                    success: function (oData, response) {
                        if (oSubCode === "0310") {
                            var oSPJson = new sap.ui.model.json.JSONModel();
                            oSPJson.setData(oData.SaudiID);
                            odetails = oData.SaudiID.results[0];
                            var idata = oData.SaudiID.results;
                            var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
                            // var urlFile2 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
                            // 	"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
                            // var data = "";
                            // filesData.read(urlFile2, {
                            // 	async: false,
                            // 	success: function (oData1, response) {
                            // 		data = oData1.results;
                            // 	}
                            // });
                            for (var it = 0; it < idata.length; it++) {
                                var dob = idata[it].date_of_birth;
                                oData.SaudiID.results[it].birthd = that.convertDateBack(dob, '-');
                                // for (var fn = 0; fn < data.length; fn++) {
                                // 	var filename = data[fn].FILENAME.split("-");
                                // 	for (var dep = 0; dep < DepJson.results.length; dep++) {
                                // 		if (DepJson.results[dep].KaustId === idata[it].KaustId) {
                                // 			if (filename[0].includes(dep)) {
                                // 				oData.results[0].Headertoid.results[it].fileName = filename[1];
                                // 				oData.results[0].Headertoid.results[it].url = data[fn].URL;
                                // 			}
                                // 		}
                                // 	}
                                // }
                            }
                            that.getView().setModel(oSPJson, "oSPJson");
                            sap.ui.getCore().setModel(oSPJson, "oSPJson");

                            // Get the Kaust location
                            that.getKaustRepSet(oData.rep_date, oData.location, oData.pickup_type, that);

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
                    },
                    error: function (oError) {
                        jQuery.sap.log.error(oError.statusCode + ": " + oError.statusText + " - " + oError.message);
                    }

                });

                //Comment Model
                this.__setBCCommentModel(requestId, that);
                //History Model
                this.__setHistoryModel(requestId);

            },

            //Get the Kaust location
            getKaustRepSet: function (date, loc, pickup, that) {
                var oGAModel = that.getOwnerComponent().getModel("oGAModel");
                var EDMDate = that.convertDateEDM(date, '-');
                var sRequestURL = "/KaustrepsSet(rep_date=" + EDMDate + ",location=" + loc + ")";
                oGAModel.read(sRequestURL, {
                    success: function (oData1, response) {
                        var result = oData1;
                        if (result) {
                            var today = result.date_of_birth;
                            if (today) {
                                today = that.convertDateBack(today, '-');
                            }
                            var repDate = that.convertDateBack(date, '-');
                            sap.ui.getCore().byId("idSType").setText(pickup === 1 ? "Issuance" : "Renewal");
                            sap.ui.getCore().byId("idRepName").setText(result.name);
                            sap.ui.getCore().byId("idNumber").setText(result.id_number);
                            sap.ui.getCore().byId("idRepLoc").setText(location === 1 ? "Jeddah" : "Rabigh");
                            sap.ui.getCore().byId("idRepDate").setText(repDate);
                            sap.ui.getCore().byId("idRepDob").setText(today);
                        }
                    }
                    ,
                    error: function (oError) {
                        jQuery.sap.log.error(oError.statusCode + ": " + oError.statusText + " - " + oError.message);
                    }
                });
            },

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

            //Convert EDM Date
            convertDateEDM: function (date, sign) {
                var dt = new Date(date);
                var yyyy = dt.getFullYear();
                var mm = dt.getMonth() + 1;
                var dd = dt.getDate();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var result = yyyy + sign + mm + sign + dd;
                return result;
            },

            convertDateBack: function (date, sign) {
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
                var result = mm + sign + dd + sign + yyyy;
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
                //                 rdata.results[0].HeaderToBC.results[bc].birthDate = t.convertDateBack(rdata.results[0].HeaderToBC.results[bc].birthDate,'/');
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
                                        data = data + '<br>' + c + ' : <strong>' + that.convertDateBack(dataIC[i].dob, '/') + '</strong>';
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
                                idata[it].pp_expiry_date = that.convertDateBack(idata[it].pp_expiry_date, '/');
                                var str = "";
                                str = "<strong>Passport No.: </strong>" + idata[it].new_passport + "<br>" +
                                    "<strong>Place of Issue: </strong>" + idata[it].place_of_issue + "<br>" +
                                    "<strong>Expiry Date: </strong>" + that.convertDateBack(idata[it].new_expiry_date, '/') + "<br><strong>Issue Date: </strong>" + that.convertDateBack(
                                        idata[it].date_of_issue, '/') + "<br>" + "<strong>Country: </strong>" + idata[it].CountryOfIssue;
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
                        var preferenceModel = that.getView().getModel("preferenceModel");
                        preferenceModel.setData(oData);
                        preferenceModel.refresh(true);
                        if (oData && oData.kaust_id != "" && oData.sub_service_code != "") { }

                    }

                });
            },


            /** Fetch the Preference data for the Collection */
            CollectionPreferenceData: function (KaustId, SubServiceCode, that) {
                var oGAModel = that.getOwnerComponent().getModel("oGAModel");
                var oAVCommModel = new sap.ui.model.json.JSONModel();
                var sRequestURL = "/MyPreferencesCollection";
                var preferenceModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(preferenceModel, "CollecPreferenceModel");
                oGAModel.read(sRequestURL, {
                    headers: {
                        "kaust_id": KaustId,
                        "sub_service_code": SubServiceCode
                    },
                    success: function (data, response) {
                        var oData = data.results[0];
                        var preferenceModel = that.getView().getModel("CollecPreferenceModel");
                        preferenceModel.setData(oData);
                        preferenceModel.refresh(true);
                        if (oData && oData.kaust_id != "" && oData.sub_service_code != "") { }

                    }

                });
            },


            /** Fetch the Preference data for the Delivery */
            DeliveryPreferenceData: function (KaustId, SubServiceCode, that) {
                var oGAModel = that.getOwnerComponent().getModel("oGAModel");
                var oAVCommModel = new sap.ui.model.json.JSONModel();
                var sRequestURL = "/MyPreferencesCollection";
                var preferenceModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(preferenceModel, "DelvPreferenceModel");
                oGAModel.read(sRequestURL, {
                    headers: {
                        "kaust_id": KaustId,
                        "sub_service_code": SubServiceCode
                    },
                    success: function (data, response) {
                        var oData = data.results[0];
                        var preferenceModel = that.getView().getModel("DelvPreferenceModel");
                        preferenceModel.setData(oData);
                        preferenceModel.refresh(true);
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
