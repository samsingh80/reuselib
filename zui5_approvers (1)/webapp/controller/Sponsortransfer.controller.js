sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

sap.ui.controller("com.kaust.zui5approvers.controller.Sponsortransfer", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_approvers.BirthCertificate
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var subserviceCode = oModel.getData().d.results[0].subServiceCode;
		var kaustId = oModel.getData().d.results[0].KaustId;
		var data = [];
		
		  if (subserviceCode == "0206") {
			data = oModel.getData().d.results[0].HeaderToDHS.results;
		}
		if(data!=null){
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			this.getView().byId("idTable").setModel(oUserModel,'oUserModel');
			this.getView().byId("idRequesterForm").setModel(oUserModel,'oUserModel');
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='"+kaustId+"',UserId='')", null, null, false, function(oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel,'Details');
			});
			this.getView().setModel(oGASCModel, "oGASCModel");
			var hederData = oModel.getData().d.results[0];
			oUserModel.setProperty("/oUserData", hederData);
			
			/*var afilters = [];
			var afilter = new sap.ui.model.Filter("KaustId", sap.ui.model.FilterOperator.EQ, "");
			afilters.push(afilter);
			var tableId = this.getView().byId("idTable");
			tableId.getBinding("items").filter(new sap.ui.model.Filter({
				filters: afilters,
				and: true
			}), "Application");*/
		}
	},
	
	fnDepRowSelection: function(evt){
		var item = evt.getParameter("listItem");
		var itemForm = this.getView().byId("idBirthCertificateDetails");
		itemForm.setBindingContext(item.getBindingContext());
	},
	
	formatRequestType : function (requestType) {
		if (requestType == "replacement") {
			return "Replacement";
		} else {
			return "Issue";
		}
	},
	
	formatDisplayDate : function(sVal) { 
		if (!sVal) return;
		var sParsedDate = new Date(parseInt(sVal.split("(")[1].split(")")[0]));
		var dateFormat = sap.ui.core.format.DateFormat.getInstance({
			pattern : "MMM d, y"
		});
		return dateFormat.format(sParsedDate);
	},
	
	
	
	displaySponsorDetail: function(sVal) {
		if (sVal == "0206") {
			return true;
		} else {
			return false;
		}
	},
	
	handleAction : function(evt){
		var oModel = sap.ui.getCore().byId("app").getModel();
		var userData = this.getView().byId("idRequesterForm").getModel("oUserModel");
		var userHeader = userData.getProperty("/oUserData");
		var userLineItem = userData.getProperty("/oUserDep");
		var action = evt.getSource().getText();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		var subServiceCode = userLineItem[0].subServiceCode;
		var relationType = "DH";
		var that = this;
		/*if (subServiceCode == "0206") {
			relationType = "DH";
		}*/
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		if (action=="Reject") {
			if (mngrComment=="") {
				sap.m.MessageBox.show(
						"Please add a reason for rejection", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						}
				); return;
			} else {
				var oGASCModel = this.getView().getModel("oGASCModel");
				oGASCModel.read("/GASC_HeaderSet?$filter=Request_ID  eq  '"+requestId+"'", null, null, false, function(rdata, response){
					var aData = rdata.results[0];
					aData.Comments = mngrComment;
					aData.t_name = "Graduate Affairs Approver";
					delete aData["HeaderToDHS"];
					delete aData["__metadata"];
					oGASCModel.update("/GASC_HeaderSet(Request_ID='"+requestId+"')", aData, {
						success: function(data,response){
							that.completeTheGASCTask(taskId, action);
					},
						error: function(oError){
					}
				});
				});				
			}
			
		} else {
			var lineItemLength = userLineItem.length;
			var noKaustIdUsers = [];
			for(var i=0; i<userLineItem.length; i++){
				if (!userLineItem[i].KaustId) {
					noKaustIdUsers.push(userLineItem[i]);
				}
			}
			var count = 0;
			var noKaustIdUsersLength = lineItemLength;
			for(var i=0; i<noKaustIdUsersLength; i++){
				count = count + 1;
				//var date = new Date(parseInt(noKaustIdUsers[i].birthDate.split("(")[1].split(")")[i]));
				//var birthDate = date.getFullYear()+""+("0" + (date.getMonth() + 1)).slice(-2)+""+("0" + date.getDate()).slice(-2);
				var obj = {
						"KaustId": userHeader.KaustId,
						"arrivalDaTE": "",
						"iqamaExpiryDate": "",
						"iqamaNumber": userLineItem[i].IqamaNo,
						"nationalIdExpiryDate": "",
						"nationalIdNumber": "",
						"passportIssuedPlace": "",
						"passportExpiryDate": "",
						"passportIssuedDate": "",
						"passportNumber": userLineItem[i].Passport,
						"expectedReloDate": "",
						"dependentRelocate": "YES",
						"nationality": userLineItem[i].Nationality,
						//"birthDate": birthDate,
						"sex": userLineItem[i].Gender,
						"thirdName": "",
						"secondName": userLineItem[i].Mname,
						"firstName": userLineItem[i].Fname,
						"lastName": userLineItem[i].Lname,
						"relationType": relationType,
						"msg": ""
				}
				this.fnCreateKaustId(obj, taskId, action, noKaustIdUsersLength, count);
			}
		}
	},	
	
	
	fnCreateKaustId: function(jsonData, taskId, decisionKey, lineItemLength, count) {
		var that = this;
		var oCreateKaustIdModel = this.getView().getModel("oGASCModel");
		oCreateKaustIdModel.create("/ADD_DEPENDENTSet", jsonData, {
				success: function(data,response){
					if (count == lineItemLength) {
						that.fnUpdateChildRelation(taskId, decisionKey);
					}
			},
			error: function(oError){
				sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : "Error",
					actions : [ sap.m.MessageBox.Action.OK ],
				});
			}
		});
	},
	
	fnUpdateChildRelation: function(taskId, decisionKey) {
		var that = this;
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var reuestId = helpModel.getProperty("/requestId");
		var oUpdateChildRelationModel = this.getView().getModel("oGASCModel");
		oUpdateChildRelationModel.read("DH_SponsorshipSet?$filter=Request_ID eq '"+reuestId+"' and PassportLost eq 'X'",{
				success: function(data,response){
					that.completeTheGASCTask(taskId, decisionKey);
			},
			error: function(oError){
				sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
					icon : sap.m.MessageBox.Icon.ERROR,
					title : "Error",
					actions : [ sap.m.MessageBox.Action.OK ],
				});
			}
		});
	},
	
	completeTheGASCTask:function(taskId,decisionKey){
		var that = this;
		var token = this.getGateWayToken();
		var msg = "The request has been successfully Approved";
		if(decisionKey =="Submit"){
			decisionKey="Approve";
			msg = "The request has been successfully Submitted";
		}
		var urlCompleteTask = "/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='"+ taskId + "'&DecisionKey='"+decisionKey+"'"; 
		var approveButton = that.getView().byId("approveButton");
		var rejectButton = that.getView().byId("rejectButton");
		var data="";
		$.ajax({
			url: urlCompleteTask,
			dataType: 'json',
			async: false,
			type: "POST",
			data: data,
			cache: false,
			beforeSend: function(xhr){
				xhr.setRequestHeader("X-CSRF-Token", token);
			},                        
			success: function(oResponse, textStatus, jqXHR) {
				var data = oResponse;
				if(decisionKey=="Approve"){
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction){
							that.goBack(oAction);
						}
					});
				}else{
					sap.m.MessageBox.show(
							"The request has been Rejected", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction){
									that.goBack(oAction);
								}
							}
					);
				}
				approveButton.setVisible(false);
				rejectButton.setVisible(false);
			},
			error: function(jqXHR, textStatus, errorThrown){
				if(textStatus==="timeout") {
					sap.m.MessageBox.show(
							"Connection timed out", {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: [sap.m.MessageBox.Action.OK],
							}
					);
				} else {
					sap.m.MessageBox.show(
							"The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: [sap.m.MessageBox.Action.OK],
							}
					);
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
				};
			}
		});
	},
	
	goBack : function(oAction){
		if(oAction=="OK"){
			window.top.close();
		}else{
			return false;
		}
	},
	
	getGateWayToken:function(){
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
	            "X-CSRF-Token":"Fetch",  
			},  
			success: function(data, textStatus, XMLHttpRequest) { 
				sToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			},
			error: function(data, textStatus, XMLHttpRequest) {  
				jQuery.sap.log.error("Error message " + data.responseText );
			}        
		});
		return sToken;
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_approvers.BirthCertificate
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_approvers.BirthCertificate
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_approvers.BirthCertificate
*/
//	onExit: function() {
//
//	}

});
    });