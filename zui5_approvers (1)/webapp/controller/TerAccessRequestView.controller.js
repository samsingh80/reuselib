sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap.m.MessageBox"
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,MessageBox) {
		"use strict";
//jQuery.sap.require("sap.m.MessageBox");
kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.TerAccessRequestView", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf ter_access.TerAccessRequestView
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		//Ticket detail
		/*var oDataModel = new sap.ui.model.json.JSONModel();
		oDataModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TERRequestSet?$filter=RequestId eq '"+requestId+"'&$expand=TERToPow,TERToTmm,TERToSow&$format=json", null, false);
		this.getView().setModel(oDataModel,"oDataModel");*/
		//var data = oDataModel.getData().d.results[0];
		var data = oModel.getData().d.results[0];
		
		if(data!=null){
			if(data.stage=="ITNC Team Approval"){
				this.getView().byId('commentMngr').setPlaceholder("Add note");
				this.getView().byId('approveButton').setText("Submit");
				this.getView().byId('rejectButton').setVisible(false);
				this.getView().byId('nwEngSelect').setVisible(true);
				
				var oDataModel = new sap.ui.model.json.JSONModel();
//				oDataModel.loadData("/sap/opu/odata/sap/ZCMSRV0001_GET_ASSIGNEE_UND_AT/GetAssigneeCollection?$filter=assigntm eq '0000001845'", null, false); //Roopali(20-09-2018) - assignment code changed from 10000743 to 0000001845
//	Start - Added logic to fetch the assignment team from BRM table - SJAYAB
				oDataModel.loadData("/sap/opu/odata/sap/ZCMSRV0001_GET_ASSIGNEE_UND_AT/GetAssigneeCollection?$filter=assigntm eq '1844'", null, false); 
//	End - Added logic to fetch the assignment team from BRM table - SJAYAB
				var netData ={
						"data": oDataModel.getData().d.results,
							};
				oDataModel.setData(netData);
				this.getView().setModel(oDataModel,"netEngg");
			//	this.getView().byId('nwFeedBack').setVisible(true);
				
			}else if(data.stage=="Network Engineer"){
				this.getView().byId('commentMngr').setPlaceholder("Add note");
				this.getView().byId('approveButton').setText("Submit");
				this.getView().byId('rejectButton').setVisible(false);
				this.getView().byId('nwFeedBack').setVisible(true);
				this.getView().byId('nwEngHeader').setVisible(true);
			}
			
			this.getView().byId('workPermitId').setValue(data.WorkPermit);
			this.getView().byId('workPermitId').setTooltip(data.WorkPermit);
			if(data.IsReqtAccReq=="X"){this.getView().byId('partOfTeamId').setSelected(true);}
			if(data.IsOtherTeamAccReq=="X"){this.getView().byId('othersId').setSelected(true);}
			if(data.TERToTmm.results.length > 0){
				this.getView().byId('othersId').setSelected(true);
				this.getView().byId('othersTblId').setVisible(true);
				var pHistory = this.getView().byId('othersTblId');
				pHistory.unbindItems();
				var oVmsLookupModel= new sap.ui.model.json.JSONModel();
				oVmsLookupModel.setProperty("/results",data.TERToTmm.results);
				pHistory.setModel(oVmsLookupModel);
			    pHistory.bindAggregation("items", "/results", new sap.m.ColumnListItem({
			        cells:[
			              
			               new sap.m.Text({
			                   text:"{KaustID}"
			               }),
			               new sap.m.Text({
			                   text:"{Name}"
			               })
			               ]
			    }));
			}
			
			if(data.StartTime!=""){
				//var startDate = this.convertDateBack(parseInt(data.StartTime));
				//this.getView().byId('startDateId').setValue(startDate);
				var startDateDisp = new Date(parseInt(data.StartTime)).toString();
				startDateDisp = startDateDisp.split(":00 ");
				this.getView().byId('startDateId').setValue(startDateDisp[0]);
			}
			if(data.EndTime!=""){
				var startDate = new Date(parseInt(data.StartTime));
				var endDate = new Date(parseInt(data.EndTime));
				var diff= endDate.getDate()-startDate.getDate();
				if(diff == 0){
					this.getView().byId('endDateId').setValue("Same day");
				}else{
					this.getView().byId('endDateId').setValue("Next day");
				}
			}
			
			
			this.getView().byId('buildingId').setValue(data.Building);
			this.getView().byId('levelSelId').setValue(data.Level);
			this.getView().byId('terRoomId').setValue(data.Room);
//			this.getView().byId('terRoomId').setText(data.Room);
			
			this.getView().byId('buildingId').setTooltip(data.Building);
			this.getView().byId('levelSelId').setTooltip(data.Level);
			this.getView().byId('terRoomId').setTooltip(data.Room);
			
			var result = this.getFields(data.TERToSow.results, "scopeOfWork");
			if(result.indexOf("Power Activity/ Survey")!=-1){
				this.getView().byId('powerActId').setSelected(true);
				var resultObject = this.search("Power Activity/ Survey", data.TERToSow.results);
				this.getView().byId('pwrLbl').setVisible(true);
				//this.getView().byId('pwrRdBtn').setVisible(true); 
				this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn",{
					buttons:[
						new sap.m.RadioButton({text:"No"}),
						new sap.m.RadioButton({text:"Yes"})
					],
					enabled: false
				});
				var vBox = this.getView().byId("pwrActVbox").insertItem(this.radioBtn,2);
				//this.getView().byId('pwrRdBtn').setVisible(true); 
				sap.ui.getCore().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.powerBackup));
				//this.getView().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.powerBackup));
			}
			if(result.indexOf("A/C Maintenance")!=-1){
				this.getView().byId('acMaintId').setSelected(true);
			}
			if(result.indexOf("TER Cleaning")!=-1){
				this.getView().byId('terCleanId').setSelected(true);
			}
			if(result.indexOf("Cable Pulling and Testing")!=-1){
				this.getView().byId('cblChkId').setSelected(true);
				this.getView().byId('cblAgreeId').setVisible(true);
				this.getView().byId('cblAgreeId').setSelected(true);
			}
			if(result.indexOf("HSE Inspection")!=-1){
				this.getView().byId('hseInspectId').setSelected(true);
			}
			if(result.indexOf("Others")!=-1){
				this.getView().byId('otherChkId').setSelected(true);
				var resultObject = this.search("Others", data.TERToSow.results);
				this.getView().byId('othersTextId').setVisible(true);
				this.getView().byId('othersTextId').setValue(resultObject.sowComments);
				this.getView().byId('othersTextId').setTooltip(resultObject.sowComments);
			}
			if(data.PowerInterrupt=="X"){
				this.getView().byId("PowerRadioGrpId").setSelectedIndex(1);
				this.getView().byId('pwrChkBoxId').setVisible(true);
				var powRes = data.TERToPow.results;
				if(powRes.length > 0){
					for(var i=0; i<powRes.length; i++ ){
						if(powRes[i].CircuitType=="PR"){
							this.getView().byId('prCbId').setSelected(true);
							this.getView().byId('inpPrId').setVisible(true);
							this.getView().byId('inpPrId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpPrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="BPR"){
							this.getView().byId('brCbId').setSelected(true);
							this.getView().byId('inpBrId').setVisible(true);
							this.getView().byId('inpBrId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpBrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if(powRes[i].CircuitType=="EPR"){
							this.getView().byId('eprCbId').setSelected(true);
							this.getView().byId('inpEcId').setVisible(true);
							this.getView().byId('inpEcId').setValue(powRes[i].EquipmentNumber);
							this.getView().byId('inpEcId').setTooltip(powRes[i].EquipmentNumber);
						}
					}
				}
			}else{
				this.getView().byId("PowerRadioGrpId").setSelectedIndex(parseInt(data.PowerInterrupt));
			}
			this.getView().byId("acIntRadioGrpId").setSelectedIndex(parseInt(data.AcInterruption));
			if(data.AcInterruption=="2"){
				this.getView().byId('acAgreeId').setSelected(true);
				this.getView().byId('acAgreeId').setVisible(true);
			}
			
		}
		
		
		
		// User Detail Model
		var that = this;
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null, true);
		oUserModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oUserModel, "oUserModel");
			}
		});
		oUserModel.attachRequestFailed(function(oEvent) {
			sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				title: "Failed to load User Detail",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
	},
	
	 getFields :function(input, field) {
	    var output = [];
	    for (var i=0; i < input.length ; ++i)
	        output.push(input[i][field]);
	    return output;
	},
	
	search: function (nameKey, myArray){
	    for (var i=0; i < myArray.length; i++) {
	        if (myArray[i].scopeOfWork === nameKey) {
	            return myArray[i];
	        }
	    }
	},
	
	
// For Approving TER Request 
		
handleAction : function(evt){
 		
		var oModel = sap.ui.getCore().byId("app").getModel();
 		var action = evt.getSource().getText();
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
 		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		//var comment = this.getView().byId("comment").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		
		/*var fName = this.getView().byId("fname");
		var lName = this.getView().byId("lname");
		var kaustID = this.getView().byId("kaustID");
		var email = this.getView().byId("email");
		var office = this.getView().byId("office");
		var pos = this.getView().byId("pos");
		var dept = this.getView().byId("dept");
		var mobile = this.getView().byId("mobile");*/
		
		
//		if((action=="Correct" || action=="Reject") && mngrComment==""){
		if((action=="Reject") && mngrComment==""){
			this.getView().byId("commentMngr").setValueState("Error");
			sap.m.MessageBox.show(
	        		"Please add a reason for rejection", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
//	          	        styleClass: bCompact ? "sapUiSizeCompact" : ""
	          	      }
	          	    );
				return;
		}else{
		//	var requestData = this.getView().getModel("oDataModel").getData().d.results[0];
			var requestData = oModel.getData().d.results[0];
			
			if(action=="Approve"||action=="Submit"){
				requestData["status"] = "055";
			}else if(action=="Correct"){
				requestData["status"] = "014";
			}else if(action=="Reject"){
				requestData["status"] = "011";
			}
			
			var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
			oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
			var loggedInUser = "", loggedInUserName="";
			if(oLoggedInUserModel.getData().d){
				loggedInUser = oLoggedInUserModel.getData().d.results[0].KaustID;
				loggedInUserName = oLoggedInUserModel.getData().d.results[0].FirstName;
			}
			
			/*if(requestData.stage=="ITNC Team Approval"){
				requestData["itncTeamComments"] = mngrComment;
				requestData["itncTeamApprover"] = loggedInUserName;
			}else*/ if(requestData.stage=="ITNC Team Approval"){ 
				if(this.getView().byId('selectedNwEngr').getSelectedKey()!="" ){
					requestData["networkAgentKId"] = this.getView().byId('selectedNwEngr').getSelectedKey();
					requestData["networkAgentUId"] = this.getView().byId('selectedNwEngr').getSelectedItem().getAdditionalText();
				}else{
					sap.m.MessageBox.show(
			        		"Please select Network Engineer", {
			          	        icon: sap.m.MessageBox.Icon.ERROR,
			          	        title: "Error",
			          	        actions: [sap.m.MessageBox.Action.OK],
			          	      }
			          	    );
						return;
				}
				//requestData["itncAgentComment"] = mngrComment;
				//requestData["itncAgentApprover"] = loggedInUserName;
				requestData["itncTeamComments"] = mngrComment;
				requestData["itncTeamApprover"] = loggedInUserName;
			}else if(requestData.stage=="Network Engineer"){																	//this.getView().byId('nwFeedBack').getVisible()
		//	}else if(requestData.stage=="CRM"){
				var selIndex = this.getView().byId('vendorShowUp').getSelectedIndex();
				//requestData.ven_presence = this.getView().byId('vendorShowUp').getAggregation("buttons")[selIndex].getText();
				requestData.ven_presence = selIndex.toString();
				if(this.getView().byId('vendorExTime').getSelectedIndex() == "0"){
					requestData.venActivityExten = "X";	
				}else{
					requestData.venActivityExten = "0";
				}
				if(this.getView().byId('toolbyVendor').getSelectedIndex() == "0"){
					requestData.toolMissingVen = "X";
				}else{
					requestData.toolMissingVen = "0";
				}
				requestData["feedbackComment"] = mngrComment;
				requestData["netAgent_approver"] = loggedInUserName;
			}
			
			
			delete requestData.TERToPow;
			delete requestData.TERToReq;
			delete requestData.TERToReqLog;
			delete requestData.TERToSow;
			delete requestData.TERToTmm
	    	var obj = JSON.stringify(requestData);
			this.completeKITSTask(taskId,action,obj,requestId);
		}
 },

	
	
	/**
	 * onOthers event triggered when user selects the check box for Other Team Members
	 * If selected show VMS Input field. 
	 */
	
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf ter_access.TerAccessRequestView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf ter_access.TerAccessRequestView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf ter_access.TerAccessRequestView
*/
//	onExit: function() {
//
//	}
});
    });