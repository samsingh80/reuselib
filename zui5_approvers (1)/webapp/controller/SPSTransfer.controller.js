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
sap.ui.controller("com.kaust.zui5approvers.controller.SPSTransfer", {
	onInit: function () {
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var subserviceCode = oModel.getData().d.SubServiceCode;
		var data = [];
		data = oModel.getData().d;
		if (data != null) 
		{
			var EmpJson;
			var NatJson;
			var SSTJson;
			var SSTAttJson;

			var osstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
			var sstfilter = "AllRequests?$filter=RequestId eq '" + requestId + "'";

			osstReqModel.read(sstfilter, null, null, false, function (data, response) {
				var sstReqModel = new sap.ui.model.json.JSONModel();
				sstReqModel.setData(data.results);
				if (data.results.length > 0) {
					EmpJson = data.results[0];
				}
			}, function (response) {
				return "";
			});

			var kaustId = EmpJson.KaustId;
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='" + kaustId + "',UserId='')", null, null, false, function (oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel, 'Details');
			});

			var osstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
			var reqtxt = "SponsorshiptransferspouseSet('" + requestId + "')";
			osstReqModel.read(reqtxt, null, null, false, function (data, response) {
					var sstReqModel = new sap.ui.model.json.JSONModel();
					sstReqModel.setData(data);
					SSTJson = data;
				},
				function (response) {
					return "";
				});

			var oNationModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/");
			oNationModel.read("COUNTRY", null, null, false, function(data, response) {
				var nationModel=new sap.ui.model.json.JSONModel();
				nationModel.setData(data);
				nationModel.setSizeLimit(data.results.length);
				sap.ui.getCore().setModel(nationModel,'NationDetails');
				NatJson = data;
			}, 
			function(response) 
			{
				return "";
			});
			
			that.getView().byId("sst_requestid").setText(SSTJson.RequestId);
			that.getView().byId("sst_firstname").setText(SSTJson.FirstName);
			that.getView().byId("sst_middlename").setText(SSTJson.MiddleName);
			that.getView().byId("sst_lastname").setText(SSTJson.LastName);
			that.getView().byId("sst_iqama").setText(SSTJson.IqamaNo);
			that.getView().byId("sst_nation").setText(SSTJson.Nationality);
			that.getView().byId("sst_gender").setText(SSTJson.Gender);
			that.getView().byId("sst_religion").setText(SSTJson.Religion);
			that.getView().byId("sst_currsponsornum").setText(SSTJson.SponsorNumber);
			that.getView().byId("sst_currsponsorname").setText(SSTJson.SponsorName);
			that.getView().byId("sst_jobtitle").setText(SSTJson.JobTitle);

			var sps_Dob = SSTJson.Dob.split("T")[0];
			if(sps_Dob)
			{
				var chdd =  sps_Dob.split("-");
				var ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
				that.getView().byId("sst_birthdate").setText(ch_dt);
			}
			
			if(SSTJson.SponKaustId.length > 0)
			{
				var NsdJson;
				var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
				oModelGasc.read("UserDetail(KaustID='"+SSTJson.SponKaustId+"',UserId='')", null, null, false, function(data, response) {
					NsdJson = data;
				}, 
				function(response) 
				{
					return "";
				});
				
				that.getView().byId("sst_newsponsornum").setText(NsdJson.Iqama);
				that.getView().byId("sst_newsponsorname").setText(NsdJson.FirstName + " " + NsdJson.MiddleName + " " + NsdJson.LastName);
			}
//			that.getView().byId("sst_certattested").setText("No");
//			that.getView().byId("sst_certtranslated").setText("No");
//			that.getView().byId("sst_certmofa").setText("No");
			that.getView().byId("SSTMCDetails").setVisible(false);
			that.getView().byId("sst_action").setEnabled(false);
			that.getView().byId("commentMngr").setEnabled(false);

			that.getView().byId("sst_transferfee").setText("SAR " + SSTJson.Amount);
			if (SSTJson.Transfercount == "0")
				that.getView().byId("sst_transfertype").setText("First");
			if (SSTJson.Transfercount == "1")
				that.getView().byId("sst_transfertype").setText("Second");
			if (SSTJson.Transfercount == "2")
				that.getView().byId("sst_transfertype").setText("Third & Above");
			
			that.getView().byId("sst_sponsortype").setText("No");
			if(SSTJson.SponsorType == "X")
				that.getView().byId("sst_sponsortype").setText("Yes");

			that.getView().byId("sst_kaustid").setText(SSTJson.KaustId);
			that.getView().byId("sps_kaustid").setVisible(false);
			that.getView().byId("sst_kaustflg").setText("No");
			if (SSTJson.KaustId.length > 0)
			{
				that.getView().byId("sps_kaustid").setVisible(true);
				that.getView().byId("sst_kaustflg").setText("Yes");
			}

//			if(SSTJson.MarCertificate == "")
//			{
//				that.getView().byId("sst_marcertificate").setText("No");
//				that.getView().byId("SSTMCDetails").setVisible(true);
//				if(SSTJson.CertAttested == "X")
//					that.getView().byId("sst_certattested").setText("Yes");
//				if(SSTJson.CertTranslated == "X")
//					that.getView().byId("sst_certtranslated").setText("Yes");
//				if(SSTJson.CertMofa == "X")
//					that.getView().byId("sst_certmofa").setText("Yes");
//			}
//			else
//			{
//				that.getView().byId("sst_marcertificate").setText("Yes");
//			}

			var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
				if(data.results.length > 0)
				{
					that.getView().byId("idSSTatt1").setText("Iqama");
					that.getView().byId("idSSTatt1").setHref(data.results[0].URL);
				}
			},
		    function (response) {
				return "";
		    });
			
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
				if(data.results.length > 0)
				{
					that.getView().byId("idSSTatt2").setText("Passport");
					that.getView().byId("idSSTatt2").setHref(data.results[0].URL);
				}
			},
		    function (response) {
				return "";
		    });
		
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
				if(data.results.length > 0)
				{
					that.getView().byId("idSSTatt3").setText("Saudi Visa");
					that.getView().byId("idSSTatt3").setHref(data.results[0].URL);
				}
			},
		    function (response) {
				return "";
		    });
		
//			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
//				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '9'";
//			oAttachModel.read(attxt, null, null, false, function (data, response) {
//				if(data.results.length > 0)
//				{
//					that.getView().byId("idSSTatt5").setText("Marriage Certificate");
//					that.getView().byId("idSSTatt5").setHref(data.results[0].URL);
//				}
//			},
//		    function (response) {
//				return "";
//		    });
		
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + requestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				SSTAttJson = data;
			},
			function (response) {
				return "";
			});

			if (SSTAttJson.results.length > 0) {
				for (var i = 0; i < SSTAttJson.results.length; i++) {
					if(SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT")
					{
						that.getView().byId("idSSTatt4").setText("NOL to Passport");
						that.getView().byId("idSSTatt4").setHref(SSTAttJson.results[i].URL);
					}
//					if(SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "ATTESTED_MARRIAGE")
//					{
//						that.getView().byId("idSSTatt6").setText("Attested Marriage Certificate");
//						that.getView().byId("idSSTatt6").setHref(SSTAttJson.results[i].URL);
//					}
//					if(SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "TRANSLATED_MARRIAGE")
//					{
//						that.getView().byId("idSSTatt7").setText("Translated Marriage Certificate");
//						that.getView().byId("idSSTatt7").setHref(SSTAttJson.results[i].URL);
//					}
				}
			}
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
	
	changeComment: function (evt)
	{
		var that = this;
		var action = evt.oSource.mProperties.text;
		var mngrComment = this.getView().byId("commentMngr");
		
		mngrComment.setValueState("None");
		that.getView().byId("sst_action").setEnabled(true);

		if(this.getView().byId("sst_select").getSelectedIndex() == 1 || this.getView().byId("sst_select").getSelectedIndex() == 2)
		{
			if(mngrComment.getValue().trim() == "") 
			{
				mngrComment.setValueState("Error");
				that.getView().byId("sst_action").setEnabled(false);
			}
			else
			{
				that.getView().byId("sst_action").setEnabled(true);
			}
		}
	},

	onSSTSelect: function (evt)
	{
		var that = this;
		var action = evt.oSource.mProperties.text;
		var mngrComment = this.getView().byId("commentMngr");
		
		mngrComment.setValueState("None");
		that.getView().byId("sst_action").setEnabled(false);
		mngrComment.setEnabled(false);

		if(action == "Approve") 
		{
			that.getView().byId("sst_action").setEnabled(true);
			mngrComment.setEnabled(true);
		}
		else if(action == "Reject" || action == "Modify") 
		{
			mngrComment.setEnabled(true);
			if(mngrComment.getValue().trim() == "") 
			{
				mngrComment.setValueState("Error");
			}
			else
			{
				that.getView().byId("sst_action").setEnabled(true);
			}
		}
	},
	
	onSSTAction: function (evt) 
	{
		var oModel = sap.ui.getCore().byId("app").getModel();
		var action = this.getView().byId("sst_select").getSelectedIndex();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		var that = this;
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		var data = "";
		var oJobModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);
		oJobModel.read("/SponsorshiptransferspouseSet(RequestId='" + requestId + "')", {
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
				oJobModel.update("/SponsorshiptransferspouseSet(RequestId='" + requestId + "')", data, {
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
				oJobModel.update("/SponsorshiptransferspouseSet(RequestId='" + requestId + "')", data, {
					success: function (odata, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else {
			data.Comments = mngrComment;
			data.Status = "012";
			oJobModel.update("/SponsorshiptransferspouseSet(RequestId='" + requestId + "')", data, {
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
		var submitButton = that.getView().byId("sst_action");
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