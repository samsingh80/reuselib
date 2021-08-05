sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5approvers/util/formatter",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,formatter) {
		"use strict";
//jQuery.sap.require("com.kaust.zui5approvers.util.formatter");
sap.ui.controller("com.kaust.zui5approvers.controller.CHDTransfer", {
	onInit: function () {
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
		data = oModel.getData().d.results[0].Headertochild.results;
		if (data != null) 
		{
			var EmpJson;
			var CSTJson;
			var DepJson;
			var CSTAttJson;

			that.getView().byId("cst_requestid").setText(requestId);

			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='" + kaustId + "',UserId='')", null, null, false, function (oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel, 'Details');
				EmpJson = oData;
			});

			var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oDependentsModel.read("UserDependents?$filter=KaustId eq '"+kaustId+"'", null, null, false, function(data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				that.getView().setModel(oDepDetailsModel,"DepDetails");
		  		DepJson = data;
			}, 
			function(response) 
			{
				return "";
			});
			
			var childData = new sap.ui.model.json.JSONModel();
			childData.setData(oModel.getData().d.results[0].Headertochild);
			that.getView().setModel(childData, "cstJson");
			CSTJson = oModel.getData().d.results[0].Headertochild;
			
			if(CSTJson.results.length > 0)
			{
//				that.getView().byId("cst_certattested").setText("No");
//				that.getView().byId("cst_certtranslated").setText("No");
//				that.getView().byId("cst_certmofa").setText("No");
				that.getView().byId("CSTBCDetails").setVisible(false);
				that.getView().byId("cst_action").setEnabled(false);
				that.getView().byId("commentMngr").setEnabled(false);
	
				that.getView().byId("cst_sponsortype").setText("No");
				if(CSTJson.results[0].SponsorType == "X")
					that.getView().byId("cst_sponsortype").setText("Yes");
	
//				if(CSTJson.results[0].BirthCertificate == "")
//				{
//					that.getView().byId("cst_birthcertificate").setText("No");
//					that.getView().byId("CSTBCDetails").setVisible(true);
//					if(CSTJson.results[0].CertAttested == "X")
//						that.getView().byId("cst_certattested").setText("Yes");
//					if(CSTJson.results[0].CertTranslated == "X")
//						that.getView().byId("cst_certtranslated").setText("Yes");
//					if(CSTJson.results[0].CertMofa == "X")
//						that.getView().byId("cst_certmofa").setText("Yes");
//				}
//				else
//				{
//					that.getView().byId("cst_birthcertificate").setText("Yes");
//				}
				
				that.getView().byId("nsp_kaust").setVisible(false);
				if(CSTJson.results[0].SponsorType == "X")
					that.getView().byId("nsp_kaust").setVisible(true);
				
				that.getView().byId("nsp_kaustid").setText(CSTJson.results[0].SponKaustId);
				that.getView().byId("nsp_fname").setText(CSTJson.results[0].SponFirstName);
				that.getView().byId("nsp_mname").setText(CSTJson.results[0].SponMiddleName);
				that.getView().byId("nsp_lname").setText(CSTJson.results[0].SponLastName);
				that.getView().byId("nsp_iqama").setText(CSTJson.results[0].SponIqamaNo);
				that.getView().byId("nsp_nation").setText(CSTJson.results[0].SponNationality);

				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
					if(data.results.length > 0 && data.results[0].URL.length > 0)
					{
						that.getView().byId("idCSTatt1").setText("Iqama - "+ EmpJson.FirstName + " " + EmpJson.LastName);
						that.getView().byId("idCSTatt1").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});
				
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
					if(data.results.length > 0 && data.results[0].URL.length > 0)
					{
						that.getView().byId("idCSTatt2").setText("Saudi Visa Page - "+ EmpJson.FirstName + " " + EmpJson.LastName);
						that.getView().byId("idCSTatt2").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});
				
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
					if(data.results.length > 0 && data.results[0].URL.length > 0)
					{
						that.getView().byId("idCSTatt3").setText("Passport - "+ EmpJson.FirstName + " " + EmpJson.LastName);
						that.getView().byId("idCSTatt3").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});
				
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + requestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
					var attachModel = new sap.ui.model.json.JSONModel();
					attachModel.setData(data);
					CSTAttJson = data;
				},
				function (response) {
					return "";
				});

				if (CSTAttJson.results.length > 0) 
				{
					for (var i = 0; i < CSTAttJson.results.length; i++) 
					{
						if(CSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT")
						{
							that.getView().byId("idCSTatt4").setText("NOL to Passport");
							that.getView().byId("idCSTatt4").setHref(CSTAttJson.results[i].URL);
						}

					}
				}

				for(var j=0; j < CSTJson.results.length ; j++)
				{
					for(var i=1; i < DepJson["results"].length ; i++)
					{
		    			if(DepJson["results"][i].KaustId == CSTJson.results[j].KaustId)
						{
		    				that.getView().byId("CSTRIDetails").getItems()[j].getCells()[6].mProperties.text=DepJson["results"][i].age;
		    				if(CSTJson.results[j].Dob)
	    					{
			    				var chd_birthdate = new Date(parseInt(CSTJson.results[j].Dob.split("(")[1].split(")")[0]));
								var chd_D = parseInt(chd_birthdate.getDate());
								var chd_M = parseInt(chd_birthdate.getMonth()) + 1;
								var chd_Y = parseInt(chd_birthdate.getYear()) + 1900;
								ch_dt = chd_D  + "." + chd_M + "." + chd_Y;
								that.getView().byId("CSTRIDetails").getItems()[j].getCells()[7].mProperties.text = ch_dt;
	    					}
//		    				for (var k = 0; k < CSTAttJson.results.length; k++) 
//		    				{
//		    					if(CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[0] == "ATTESTEDBIRTH")
//		    					{
//	    			    			if(DepJson["results"][i].KaustId == CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[1].split(".")[0])
//	    							{
//	    			    				that.getView().byId("CSTRIDetails").getItems()[j].getCells()[6].mProperties.href=CSTAttJson.results[k].URL;
//	    							}
//		    					}
//		    					if(CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[0] == "TRANSLATEDBIRTH")
//		    					{
//	    			    			if(DepJson["results"][i].KaustId == CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[1].split(".")[0])
//	    							{
//	    			    				that.getView().byId("CSTRIDetails").getItems()[j].getCells()[7].mProperties.href=CSTAttJson.results[k].URL;
//	    							}
//		    					}
//		    				}
		    				i = DepJson["results"].length + 1;
						}
					}
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
		that.getView().byId("cst_action").setEnabled(true);

		if(this.getView().byId("cst_select").getSelectedIndex() == 1 || this.getView().byId("cst_select").getSelectedIndex() == 2)
		{
			if(mngrComment.getValue().trim() == "") 
			{
				mngrComment.setValueState("Error");
				that.getView().byId("cst_action").setEnabled(false);
			}
			else
			{
				that.getView().byId("cst_action").setEnabled(true);
			}
		}
	},

	onCSTSelect: function (evt)
	{
		var that = this;
		var action = evt.oSource.mProperties.text;
		var mngrComment = this.getView().byId("commentMngr");
		
		mngrComment.setValueState("None");
		that.getView().byId("cst_action").setEnabled(false);
		mngrComment.setEnabled(false);

		if(action == "Approve") 
		{
			that.getView().byId("cst_action").setEnabled(true);
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
				that.getView().byId("cst_action").setEnabled(true);
			}
		}
	},
	
	onCSTAction: function (evt) 
	{
		var oModel = sap.ui.getCore().byId("app").getModel();
		var action = this.getView().byId("cst_select").getSelectedIndex();
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
		var submitButton = that.getView().byId("cst_action");
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