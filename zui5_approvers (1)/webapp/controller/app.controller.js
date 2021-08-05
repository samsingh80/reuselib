sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("com.kaust.zui5approvers.controller.app", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf zui5_approvers.App
             */
            onInit: function () {

                var helpModel = new sap.ui.model.json.JSONModel();
                this.getOwnerComponent().setModel(helpModel, "helpModel");
                //      var taskId = jQuery.sap.getUriParameters().get("taskId");

                //-- Current workaround for the taksId parameter issue--\\
                //    43cfb53d8cc611eb99320000038f8baa "Both"
                // Self a0c0a1668cc511eb8a670000038f8baa
                // var test = jQuery.sap.getUriParameters(); //thaj
                //in old bpm it was like below
                //var task = test.mParams["sap-config-mode"][0];
                //var taskId = task.slice(12, task.length);
                //after bpm update 
                // var taskId = test.mParams.taskId[0];//thaj                
                var taskId = "0e034d4cb17111eb8d220000038f8baa";
                // var taskId = "b94ff55c912c11ebaa890000038f8baa";
                // ----------------------------------------sd--------------\\
                //thaj
                // this.claimTask(taskId);
                // var requestId = this.getRequestId(taskId);
                var requestId = 'R1624201501912';
                //thaj
                //    

                helpModel.setProperty("/taskId", taskId, null);
                helpModel.setProperty("/requestId", requestId, null);
                //    
                //thaj
                // var subServiceCode = this.getServiceCode(taskId);
                var subServiceCode = "0302";
                //thaj
                this.getUserModelData(requestId, subServiceCode);
                // this.loadApproverView(subServiceCode, requestId, taskId);
                //
                //    var param = "0005";
                //    this.loadApproverView(param);

            },

            claimTask: function (taskId) {
                var dataPost;
                var urlClaimTask = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Claim?InstanceID='" + taskId + "'");
                var token = this.getGateWayToken();
                $.ajax({
                    url: urlClaimTask,
                    dataType: 'json',
                    async: false,
                    type: "POST",
                    data: dataPost,
                    cache: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("X-CSRF-Token", token);
                    },

                    success: function (oResponse, textStatus, jqXHR) {

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        if (textStatus === "timeout") {
                            sap.m.MessageBox.show(
                                "Connection timed out", {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                         	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );

                        } else {
                            sap.m.MessageBox.show(
                                "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                                  styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );

                            jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
                                .statusText);
                        };
                    },

                });
            },

            getRequestId: function (taskId) {
                var requestId = null;
                var urlGetTaskDetails = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/CustomAttributeCollection(InstanceID='" + taskId +
                    "',Name='RequestId')/");
                //       										/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/TaskCollection(InstanceID='399e357fee3811e4b4e00000003f0246')/CustomAttributeData
                //       										"/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/CustomAttributeCollection(InstanceID='"+ taskId + "',Name='RequestId')/"
                $.ajax({
                    url: urlGetTaskDetails,
                    dataType: 'json',
                    async: false,
                    type: "GET",
                    cache: false,
                    success: function (oResponse, textStatus, jqXHR) {
                        //requestData = oResponse;
                        requestId = oResponse.d.Value;

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        if (textStatus === "timeout") {
                            sap.m.MessageBox.show(
                                "Connection timed out", {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                      styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );

                        } else {

                            sap.m.MessageBox.show(
                                "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                      styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );
                            jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
                                .statusText);
                        };
                    },

                });
                return requestId;

            },

            getServiceCode: function (taskId) {
                var serviceCode = "";
                var urlGetTaskDetails = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/CustomAttributeCollection(InstanceID='" + taskId +
                    "',Name='ServiceCode')/");
                //       										/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/TaskCollection(InstanceID='399e357fee3811e4b4e00000003f0246')/CustomAttributeData
                //       										"/sap/opu/odata/IWPGW/TASKPROCESSING;v=2/CustomAttributeCollection(InstanceID='"+ taskId + "',Name='RequestId')/"
                $.ajax({
                    url: urlGetTaskDetails,
                    dataType: 'json',
                    async: false,
                    type: "GET",
                    cache: false,
                    success: function (oResponse, textStatus, jqXHR) {
                        //requestData = oResponse;
                        serviceCode = oResponse.d.Value;

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        if (textStatus === "timeout") {
                            sap.m.MessageBox.show(
                                "Connection timed out", {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                      styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );

                        } else {

                            sap.m.MessageBox.show(
                                "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                      styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );
                            jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
                                .statusText);
                        };
                    },

                });
                return serviceCode;

            },

            getUserModelData: function (requestId, subServiceCode) {
                var urlRequestData = "";
                var sModelname = "";
                var approver = {
                    "SmartPrint": "0010",
                    "VPNAccess": "0024",
                    "GenericEmail": "0001",
                    "NewEmailList": "0002",
                    "eFax": "0003",
                    "ITequipment": "0005",
                    "ITreplenish": "0006",
                    "ITtransfer": "0009",
                    "ConferenceRoomBooking": "0011",
                    "LoanEquipment": "0013",
                    "TERAccess": "0052", // zakeer : for ter sub service code
                    "DataAccess": "0053",
                    "VPNAccessExt": "0055", // for VPN sub service code
                    "BirthCertificate": "0302", // Birth Certificate Sub service code
                    "Sponsortransfer": "0206", //navin: Sponsorship transfer Subservice code
                    "AdminRights": "0054", //Pavithra : Admin Rights
                    "Jobtitlechange": "0414", //Sri lakshmi: Job title change subservice code
                    "FamilyResidencyVisa": "0208", //Sri lakshmi: Family Residency Visa
                    "SponsorTransferSpouse": "0415", // SJAYAB - Sponsorship Transfer (Spouse)
                    "SponsorTransferChild": "0416", // SJAYAB - Sponsorship Transfer (Child)
                    "FinalExitVisa": "0202", // Vijay - Final Exit Visa	
                    "FEVDependent": "9202", // SJAYAB - Final Exit Visa	
                    "FinalExitVisaCancellation": "0211", // Vijay - Final Exit Visa	Cancellation
                    "FEVCancelDep": "8211", // SJAYAB - Final Exit Visa	Cancellation
                    "DPFEVCancel": "9211", // Vijay - Final Exit Visa	Cancellation (Dept)
                    "IqamaRenew": "0101",// Shravya - Iqama renewal
                    "GovtVisitVisaExtension": "0203" // Vijay Goverment Visiting Visa Extension 
                };

                switch (subServiceCode) {
                    case (approver.SmartPrint):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.GenericEmail):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.NewEmailList):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.eFax):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Fax(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.ITequipment):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Equipment(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.ITreplenish):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Replenish(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.ITtransfer):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.LoanEquipment):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Loanequip(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.ConferenceRoomBooking):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '" + requestId + "'");
                        break;
                    case (approver.VPNAccess):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='" + requestId + "',KaustId='')");
                        break;
                    case (approver.TERAccess): // for ter getting details
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TERRequestSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=TERToPow,TERToTmm,TERToSow");
                        break;
                    case (approver.VPNAccessExt):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet?$filter=requestId eq '" + requestId + "'");
                        break;
                    case (approver.DataAccess):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=DCToTemplate");
                        break;
                    case (approver.BirthCertificate):
                        urlRequestData = "/GASC_HeaderSet/" + requestId + "?$expand=header,log,BirthCertificate";
                        sModelname = "GA";
                        break;
                    case (approver.Sponsortransfer): // navin : for sponsorship transfer Approval of No KAUST ID user
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/GASC_HeaderSet?$filter=Request_ID eq '" + requestId +
                            "'&$expand=HeaderToDHS");
                        break;

                    case (approver.AdminRights):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AdminRightsReqSet?$filter=requestId eq '" + requestId +
                            "'&$format=json");
                        break;
                    case (approver.Jobtitlechange):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/JobtitlechangeSet(RequestId='" + requestId + "')");
                        break;
                    case (approver.FamilyResidencyVisa):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertovisa");
                        break;
                    case (approver.SponsorTransferSpouse):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/SponsorshiptransferspouseSet(RequestId='" + requestId +
                            "')");
                        break;
                    case (approver.SponsorTransferChild):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertochild");
                        break;
                    case (approver.FinalExitVisa):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.FEVDependent):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.FinalExitVisaCancellation):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.FEVCancelDep):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.DPFEVCancel):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.IqamaRenew):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                    case (approver.GovtVisitVisaExtension):
                        urlRequestData = this.getUrl("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/GASC_HeaderSet?$filter=RequestId eq '" + requestId +
                            "'&$expand=Headertoiqama");
                        break;
                }

                var helpModel = this.getView().getModel("helpModel");
                helpModel.setProperty("/url", urlRequestData, null);
                //Check whether we need to call GA or KITS
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel;
                if (sModelname === 'GA') {
                    oDataModel = this.getOwnerComponent().getModel("oGAModel");
                } else if (sModelname === 'GA') {
                    oDataModel = this.getOwnerComponent().getModel("oKITSModel");
                }
                var that = this;

                oDataModel.read(urlRequestData, {
                    success: function (data, response) {
                        oModel.setData(data);
                        that.getView().setModel(oModel);
                        that.getOwnerComponent().setModel(oModel, "GASC_HeaderModel");
                        var taskId;
                        that.loadApproverView(subServiceCode, requestId, taskId, that);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        if (textStatus === "timeout") {

                            sap.m.MessageBox.show(
                                "Connection timed out", {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                       	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );
                            //                                           sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                              
                        } else {

                            sap.m.MessageBox.show(
                                "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK],
                                //                                                  styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );
                            jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
                                .statusText);
                            //                                           sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
                        }
                    }

                });




                //         this.GASC_HeaderModel = oModel;
                // return subServiceCode;
            },

            loadApproverView: function (subCode, reqId, taskId, that) {
                // this = that;

                var view = this.getView();
                var approver = {

                    "SmartPrint": "0010",
                    "VPNAccess": "0024",
                    "GenericEmail": "0001",
                    "NewEmailList": "0002",
                    "eFax": "0003",
                    "ITequipment": "0005",
                    "ITreplenish": "0006",
                    "ITtransfer": "0009",
                    "ConferenceRoomBooking": "0011",
                    "LoanEquipment": "0013",
                    "TERAccess": "0052", // zakeer : for ter sub service code
                    "VPNAccessExt": "0055", // zakeer : for VPN sub service code
                    "DataAccess": "0053", //Pavithra : Data access center
                    "BirthCertificate": "0302", // Shailesh : Birth Certificate Sub service code
                    "Sponsortransfer": "0206", // navin:sponsorship Transfer Sub service code
                    "AdminRights": "0054", //Pavithra : Admin Rights
                    "CarOwnershipTransfer": "0507", //SJAYAB: Car Ownership transfer
                    "Jobtitlechange": "0414",
                    "FamilyResidencyVisa": "0208",
                    "SponsorTransferSpouse": "0415", //SJAYAB - Sponsorship Transfer (Spouse)
                    "SponsorTransferChild": "0416", //SJAYAB - Sponsorship Transfer (Child)
                    "FinalExitVisa": "0202", //Vijay - FinalExitVisa
                    "FEVDependent": "9202", // SJAYAB - Final Exit Visa	
                    "FinalExitVisaCancellation": "0211", // Vijay - Final Exit Visa	Cancellation
                    "FEVCancelDep": "8211", // SJAYAB - Final Exit Visa	Cancellation
                    "DPFEVCancel": "9211", // Vijay - Final Exit Visa	Cancellation (Dept)
                    "IqamaRenew": "0101",// Shravya - Iqama renewal
                    "GovtVisitVisaExtension": "0203" // Vijay Goverment Visting Visa Extension  
                };

                switch (subCode) {
                    case (approver.SmartPrint):
                        var master = sap.ui.xmlview("smartPrint", "com.kaust.zui5approvers.view.smartPrint");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        master.byId("userInfoForm").setModel(this.getView().getModel());
                        break;
                    case (approver.VPNAccess):
                        var master = sap.ui.xmlview("VPNAccess", "com.kaust.zui5approvers.view.VPNAccess");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.GenericEmail):
                        var master = sap.ui.xmlview("GenericEmail", "com.kaust.zui5approvers.view.genericEmail");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.NewEmailList):
                        var master = sap.ui.xmlview("newEmailList", "com.kaust.zui5approvers.view.newEmailList");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.eFax):
                        var master = sap.ui.xmlview("eFax", "com.kaust.zui5approvers.view.eFax");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.ITequipment):
                        var master = sap.ui.xmlview("itEquipment", "com.kaust.zui5approvers.view.itEquipment");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.ITreplenish):
                        var master = sap.ui.xmlview("itReplenish", "com.kaust.zui5approvers.view.itReplenish");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.ITtransfer):
                        var master = sap.ui.xmlview("itTransfer", "com.kaust.zui5approvers.view.itTransfer");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.LoanEquipment):
                        var master = sap.ui.xmlview("LoanEquipment", "com.kaust.zui5approvers.view.LoanEquipment");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.ConferenceRoomBooking):
                        var master = sap.ui.xmlview("ConferenceRoomBooking", "com.kaust.zui5approvers.view.conferenceRoom");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.TERAccess): // zakeer : for loading ter view
                        var master = sap.ui.xmlview("TerAccessRequestView", "com.kaust.zui5approvers.view.TerAccessRequestView");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.VPNAccessExt): // zakeer : for loading ter view
                        var master = sap.ui.xmlview("VpnRequestForm", "com.kaust.zui5approvers.view.VpnRequestForm");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.DataAccess):
                        var oModel = sap.ui.getCore().byId("app").getModel();

                        if (oModel.getData().d.results[0].stage == "KAUST Security") {
                            var master = sap.ui.xmlview("securityForm", "com.kaust.zui5approvers.view.securityForm");
                            master.getController().nav = view.getController();
                            view.app.addPage(master, false);
                        } else {
                            var master = sap.ui.xmlview("DataCenter", "com.kaust.zui5approvers.view.DataCenter");
                            master.getController().nav = view.getController();
                            view.app.addPage(master, false);
                        }
                        break;
                    case (approver.BirthCertificate):
                        var master = this.getOwnerComponent().runAsOwner(function () {
                            return sap.ui.xmlview("BirthCertificate", "com.kaust.zui5approvers.view.BirthCertificate"); });
                            master.getController().nav = view.getController();
                            view.app.addPage(master, false);
                            break;
                    case (approver.Sponsortransfer):
                        var master = sap.ui.xmlview("Sponsortransfer", "com.kaust.zui5approvers.view.Sponsortransfer");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.AdminRights):
                        var master = sap.ui.xmlview("adminAccess", "com.kaust.zui5approvers.view.adminAccess");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.CarOwnershipTransfer):
                        try {
                            var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                            window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gavehowntr/vehowntrnbuy.html?RID=" + reqId + "TASKID=" + taskId;
                        } catch (Exception) {
                            return;
                        }
                        break;
                    case (approver.Jobtitlechange):
                        var master = sap.ui.xmlview("Jobtitlechange", "com.kaust.zui5approvers.view.Jobtitlechange");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.FamilyResidencyVisa):
                        var master = sap.ui.xmlview("FamilyResidencyVisa", "com.kaust.zui5approvers.view.FamilyResidencyVisa");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.SponsorTransferSpouse):
                        var master = sap.ui.xmlview("SPSTransfer", "com.kaust.zui5approvers.view.SPSTransfer");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.SponsorTransferChild):
                        var master = sap.ui.xmlview("CHDTransfer", "com.kaust.zui5approvers.view.CHDTransfer");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.FinalExitVisa):
                        var master = sap.ui.xmlview("FinalExitVisa", "com.kaust.zui5approvers.view.FinalExitVisa");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.FEVDependent):
                        var master = sap.ui.xmlview("FinalExitVisa", "com.kaust.zui5approvers.view.FinalExitVisa");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.FinalExitVisaCancellation):
                        var master = sap.ui.xmlview("FinalExitVisaCancel", "com.kaust.zui5approvers.view.FinalExitVisaCancel");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.FEVCancelDep):
                        var master = sap.ui.xmlview("FinalExitVisaCancel", "com.kaust.zui5approvers.view.FinalExitVisaCancel");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.DPFEVCancel):
                        var master = sap.ui.xmlview("FinalExitVisaCancel", "com.kaust.zui5approvers.view.FinalExitVisaCancel");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;
                    case (approver.IqamaRenew):
                        var master = sap.ui.xmlview("IqamaRenew", "com.kaust.zui5approvers.view.IqamaRenew");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;

                    case (approver.GovtVisitVisaExtension):
                        var master = sap.ui.xmlview("GovtVistVisaExten", "com.kaust.zui5approvers.view.GovtVistVisaExten");
                        master.getController().nav = view.getController();
                        view.app.addPage(master, false);
                        break;



                }
            },

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf zui5_approvers.App
             */
            //  onBeforeRendering: function() {
            //
            //  },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf zui5_approvers.App
             */
            onAfterRendering: function () {

            },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf zui5_approvers.App
             */
            //  onExit: function() {
            //
            //  }

        });
    });
