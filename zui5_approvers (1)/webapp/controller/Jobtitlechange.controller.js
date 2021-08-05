sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5approvers/util/formatter"
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,formatter) {
		"use strict";

//jQuery.sap.require("kaust.ui.kits.approvers.util.formatter");
sap.ui.controller("com.kaust.zui5approvers.controller.Jobtitlechange", {
	onInit: function () {
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var subserviceCode = oModel.getData().d.SubServiceCode;
		var kaustId = oModel.getData().d.KaustId;
		var data = [];
		data = oModel.getData().d;
		if (data != null) {
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			this.getView().byId("idTable").setModel(oUserModel, 'oUserModel');
			this.getView().byId("idRequesterForm").setModel(oUserModel, 'oUserModel');
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='" + kaustId + "',UserId='')", null, null, false, function (oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel, 'Details');
			});
			this.getView().setModel(oGASCModel, "oGASCModel");
			var hederData = oModel.getData().d;
			this.getView().byId("idDC").setSelectedIndex(data.DegCertificate - 1);
			this.getView().byId("idAC").setSelectedIndex(data.CertAttested - 1);
			this.getView().byId("idTC").setSelectedIndex(data.CertTranslated - 1);
			this.getView().byId("idMC").setSelectedIndex(data.CertMofa - 1);
			if (data.DegCertificate === "1") {
				this.getView().byId("idAC").setVisible(false);
				this.getView().byId("idTC").setVisible(false);
				this.getView().byId("idMC").setVisible(false);
				this.getView().byId("idAClbl").setVisible(false);
				this.getView().byId("idTClbl").setVisible(false);
				this.getView().byId("idMClbl").setVisible(false);
			}
			oUserModel.setProperty("/oUserData", hederData);
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
			var oDetails = new sap.ui.model.json.JSONModel();
			oDataModel.read("IqamaprofessionSet('" + oModel.getData().d.JobTitle + "')", null, null, false, function (oData, response) {
				oDetails.setData(oData);
				that.getView().setModel(oDetails, 'JobDetails');
			});
			var fileCheckIqama = that.getFileAttachmentDetails(null, kaustId, 3);
			var fileCheckPassport = that.getFileAttachmentDetails(null, kaustId, 1);
			var fileCheckSAVisa = that.getFileAttachmentDetails(null, kaustId, 5);
			var fileCheckDegreeCert = that.getFileAttachmentDetails(null, kaustId, 7);
			var fileDegrees = that.getFileAttachmentRequestDetails(null, requestId, 9);
			var attestedDegree, translatedDegree;
			for (var i = 0; i < fileDegrees.length; i++) {
				if (fileDegrees[i].FILENAME.includes("ATTESTED")) {
					fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
					attestedDegree = fileDegrees[i];
				}
				if (fileDegrees[i].FILENAME.includes("TRANSLATED")) {
					fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
					translatedDegree = fileDegrees[i];
				}
			}
			var filereadModel = new sap.ui.model.json.JSONModel({
				fileCheckIqama: fileCheckIqama,
				fileCheckPassport: fileCheckPassport,
				fileCheckSAVisa: fileCheckSAVisa,
				fileCheckDegreeCert: fileCheckDegreeCert,
				attestedDegree: attestedDegree,
				translatedDegree: translatedDegree
			});
			that.getView().setModel(filereadModel, "filereadModel");
		}

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData(oData.results);
				that.getView().setModel(data, "GAComments");
				sap.ui.getCore().setModel(data, "GAComments");
			}
		});
	},
	getFileAttachmentDetails: function (Event, kaustid, Doctype) {
		var filechk = false;
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
			"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + Doctype + "'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				if (data.results.length > 0) {
					if (data.results[0].URL.length > 0) {
						filechk = data.results[0];
					}
				}
			},
			function (response) {
				return "";
			});
		return filechk;
	},
	getFileAttachmentRequestDetails: function (oEvent, requestId, Doctype) {
		var filechk = false;
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + requestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '" + Doctype + "'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				if (data.results.length > 0) {
					if (data.results[0].URL.length > 0) {
						filechk = data.results;
					}
				}
			},
			function (response) {
				return "";
			});
		return filechk;
	},
	handleAction: function (evt) {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var userData = this.getView().byId("idRequesterForm").getModel("oUserModel");
		var userHeader = userData.getProperty("/oUserData");
		var userLineItem = userData.getProperty("/oUserDep");
		var action = this.getView().byId("idAction").getSelectedIndex();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		var that = this;
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		var data = "";
		var oJobModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);
		oJobModel.read("/JobtitlechangeSet(RequestId='" + requestId + "')", {
			async: false,
			success: function (oData, response) {
				data = oData;
			}
		});
		if (action == "-1") {
			sap.m.MessageBox.show(
				"Please select an action to submit", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
				}
			);
			return;
		}
		if (action == "2") {
			if (mngrComment == "") {
				this.getView().byId("commentMngr").setValueState("Error");
				sap.m.MessageBox.show(
					"Please add a reason for rejection", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			} else {
				this.getView().byId("commentMngr").setValueState("None");
				data.Comments = mngrComment;
				data.Status = "011";
				oJobModel.update("/JobtitlechangeSet(RequestId='" + requestId + "')", data, {
					success: function (odata, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else if (action == "1") {
			if (mngrComment == "") {
				this.getView().byId("commentMngr").setValueState("Error");
				sap.m.MessageBox.show(
					"Please add a reason for modification", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			} else {
				this.getView().byId("commentMngr").setValueState("None");
				data.Comments = mngrComment;
				data.Status = "099";
				oJobModel.update("/JobtitlechangeSet(RequestId='" + requestId + "')", data, {
					success: function (odata, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else {
			data.Comments = mngrComment;
			data.Status = "012";
			oJobModel.update("/JobtitlechangeSet(RequestId='" + requestId + "')", data, {
				success: function (odata, response) {
					that.completeTheGASCTask(taskId, action);
				},
				error: function (oError) {}
			});
		}
	},
	completeTheGASCTask: function (taskId, decisionKey) {
		var that = this;
		var token = this.getGateWayToken();
		var msg = "The request has been successfully Approved";
		if (decisionKey == "0") {
			decisionKey = "Approve";
			msg = "The request has been successfully Approved";
		} else if (decisionKey == "1") {
			decisionKey = "";
			msg = "The request has been sent for Modification";
		} else {
			decisionKey = "Reject";
			msg = "The request has been Rejected";
		}
		var urlCompleteTask = "/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='" + taskId + "'&DecisionKey='" + decisionKey +
			"'";
		var approveButton = that.getView().byId("approveButton");
		var data = "";
		$.ajax({
			url: urlCompleteTask,
			dataType: 'json',
			async: false,
			type: "POST",
			data: data,
			cache: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-CSRF-Token", token);
			},
			success: function (oResponse, textStatus, jqXHR) {
				if (decisionKey == "Approve") {
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							that.goBack(oAction);
						}
					});
				} else {
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							that.goBack(oAction);
						}
					});
				}
				approveButton.setVisible(false);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (textStatus === "timeout") {
					sap.m.MessageBox.show(
						"Connection timed out", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						}
					);
				} else {
					sap.m.MessageBox.show(
						"The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						}
					);
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
						.statusText);
				};
			}
		});
	},
	goBack: function (oAction) {
		if (oAction == "OK") {
			window.top.close();
		} else {
			return false;
		}
	},
	getGateWayToken: function () {
		var sToken = null;
		var sUserDetailUrl = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail";
		$.ajax({
			url: sUserDetailUrl,
			type: "GET",
			dataType: 'json',
			contentType: "application/json",
			Accept: "application/json",
			async: false,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch",
			},
			success: function (data, textStatus, XMLHttpRequest) {
				sToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			},
			error: function (data, textStatus, XMLHttpRequest) {
				jQuery.sap.log.error("Error message " + data.responseText);
			}
		});
		return sToken;
	}
});
    });