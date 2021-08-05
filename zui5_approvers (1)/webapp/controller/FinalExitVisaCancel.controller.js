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
sap.ui.controller("com.kaust.zui5approvers.controller.FinalExitVisaCancel", {
	onInit: function () {
		// var app = this.getView().app;

		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var subserviceCode = oModel.getData().d.results[0].SubServiceCode;
		var kaustId = oModel.getData().d.results[0].KaustId;
		var data = [];
		// data = oModel.getData().d.results[0].Headertochild.results;
		if (data != null) {

			var ReqJson;
			var EmpJson;
			var FEVJson;
			var FEVHead;
			var FEVtJson;

			// that.getView().byId("FEV_requestid").setText(requestId);
			var oReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
			var fevfilter = "AllRequests?$filter=RequestId eq '" + requestId + "'";

			oReqModel.read(fevfilter, null, null, false, function (data, response) {
				var ReqModel = new sap.ui.model.json.JSONModel();
				ReqModel.setData(data.results);
				if (data.results.length > 0) {
					ReqJson = data.results[0];
				}
			}, function (response) {
				return "";
			});

			var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHRTRS0001TSR_GASC", true);
			var cstfilter = "UserDetail(KaustID='" + ReqJson.KaustId + "',UserId='')";

			odlrReqModel.read(cstfilter, null, null, false, function (data, response) {
				var dlrReqModel = new sap.ui.model.json.JSONModel();
				dlrReqModel.setData(data) //.results);
					// var oDetailsModel = new sap.ui.model.json.JSONModel();
					// oDetailsModel.setData(data.results[0]);
					// sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
					//		if (data.results.length > 0) {
				EmpJson = data; //.results[0];
				// 		that.getView().byId("idSKaustid").setValue(EmpJson.KaustID);
				// 		that.getView().byId("idSFname").setValue(EmpJson.FirstName);
				// 		that.getView().byId("idSMname").setValue(EmpJson.MiddleName);
				// 		that.getView().byId("idSLname").setValue(EmpJson.LastName);
				// 		that.getView().byId("idSGender").setValue(EmpJson.Gender);
				// 		that.getView().byId("idIqValue").setValue(EmpJson.Nationality);
				that.getView().byId("idReqType").setValue(EmpJson.Position);
				// //		that.getView().byId("idDateofEntrance").setValue(EmpJson.Position);
				// 		that.getView().byId("idiqamano").setValue(EmpJson.Iqama);
				// 		that.getView().byId("idBoarderNum").setValue(EmpJson.BorderNo);
				that.getView().byId("idpassportNuber").setValue(EmpJson.Passport);

//				var Kt = EmpJson.IqamaExpDate;
//				var mt = EmpJson.KaustIdExpiry;
//				var tt = new Date(Kt).getDate() + "-" + new Date(Kt).getMonth() + "-" + new Date(Kt).getFullYear();
//				var mt = new Date(mt).getDate() + "-" + new Date(mt).getMonth() + "-" + new Date(mt).getFullYear();
//				that.getView().byId("idpassportdatee").setValue(mt);
//				that.getView().byId("idpassportExpdate").setValue(tt);
				//      }

			}, function (response) {
				return "";
			});

			var odlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
			odlrModel.read("GASC_HeaderSet?$filter=RequestId eq'" + requestId + "'&$expand=Headertoiqama", null, null, false, function (data,
					response) {
					var dlrData = new sap.ui.model.json.JSONModel();
					dlrData.setData(data.results[0].Headertoiqama);
					that.getView().setModel(dlrData, "FEVNEWJson");
					that.getView().setModel(dlrData, "FEVNEWJson");

					FEVJson = data.results[0].Headertoiqama;
					EmpJson = FEVJson.results[0];
					FEVHead = data.results[0];
					var oDetailsModel = new sap.ui.model.json.JSONModel();
					oDetailsModel.setData(FEVJson.results[0]);
					sap.ui.getCore().setModel(oDetailsModel, "reqDetailsData");
					this.getView().setModel(oDetailsModel, "reqDetailsData");
					//         that.getView().byId("idSKaustid").setValue(EmpJson.KaustId);
					// 		that.getView().byId("idSFname").setValue(EmpJson.FirstName);
					// 		that.getView().byId("idSMname").setValue(EmpJson.MiddleName);
					// 		that.getView().byId("idSLname").setValue(EmpJson.LastName);
					// 		that.getView().byId("idSGender").setValue(EmpJson.Gender);
					// 		that.getView().byId("idIqValue").setValue(EmpJson.Nationality);
					// 	//	that.getView().byId("idReqType").setValue(EmpJson.Position);
					// //		that.getView().byId("idDateofEntrance").setValue(EmpJson.Position);
					// 		that.getView().byId("idiqamano").setValue(EmpJson.IqamaNo);
					// 		that.getView().byId("idBoarderNum").setValue(EmpJson.BorderNo);
					var dataHeader = data.results[0].Headertoiqama["results"];

					for (var i = 0; i <= dataHeader.length - 1; i++) {
						var RequestorTypeFlag = dataHeader[i].RequestorTypeFlag;

						if (RequestorTypeFlag === "" || RequestorTypeFlag === "S") {

							var RequestTypeFlag = dataHeader[i].RequestTypeFlag;
							if (RequestTypeFlag === "S") {
								that.getView().byId("fev_requstorflag").setText("Self");
							} else {
								that.getView().byId("fev_requstorflag").setText("Both");
							}
						} else if (RequestorTypeFlag === "D") {
							that.getView().byId("fev_requstorflag").setText("Dependent");

						}
						break;
					}

				}.bind(this),
				function (response) {
					return "";
				});

			// Populate Comments Details - Begin
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
			// Populate Comments details - End

		}

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

	changeComment: function (evt) {
		var that = this;
		var action = evt.oSource.mProperties.text;
		var mngrComment = this.getView().byId("commentMngr");

		mngrComment.setValueState("None");
		that.getView().byId("fev_action").setEnabled(true);

		if (this.getView().byId("fev_select").getSelectedIndex() == 1 || this.getView().byId("fev_select").getSelectedIndex() == 2) {
			if (mngrComment.getValue().trim() == "") {
				mngrComment.setValueState("Error");
				that.getView().byId("fev_action").setEnabled(false);
			} else {
				that.getView().byId("fev_action").setEnabled(true);
			}
		}
	},

	onFEVCANCELSelect: function (evt) {
		var that = this;
		var action = evt.oSource.mProperties.text;
		var mngrComment = this.getView().byId("commentMngr");

		mngrComment.setValueState("None");
		that.getView().byId("fev_action").setEnabled(false);
		mngrComment.setEnabled(false);

		if (action == "Approve") {
			that.getView().byId("fev_action").setEnabled(true);
			mngrComment.setEnabled(true);
		} else if (action == "Reject" || action == "Modify") {
			mngrComment.setEnabled(true);
			if (mngrComment.getValue().trim() == "") {
				mngrComment.setValueState("Error");
			} else {
				that.getView().byId("fev_action").setEnabled(true);
			}
		}
	},

	onFEVCancelAction: function (evt) {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var action = this.getView().byId("fev_select").getSelectedIndex();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		var that = this;
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		var data = "";

		var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01");
		oGASCModel.read("/GASC_HeaderSet?$filter=RequestId  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
			data = rdata.results[0];
			delete data["Headertovisa"];
			delete data["HeadertoInfo"];
			delete data["Headertoid"];
			delete data["Headertochild"];
			delete data["__metadata"];
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
				oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
					success: function (data1, response) {
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
				oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
					success: function (data1, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else {
			data.Comments = mngrComment;
			data.Status = "012";
			oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
				success: function (data1, response) {
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
		var submitButton = that.getView().byId("fev_action");
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
				submitButton.setVisible(false);
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