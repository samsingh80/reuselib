sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,MessageBox) {
		"use strict";

		return Controller.extend("com.kaust.zui5approvers.controller.adminAccess", {
			onInit: function () {
                var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var data = oModel.getData().d.results[0];
		if(data!=null){
			this.setFormData(data);
//			this.disableFi elds();
		}
		this.getView().addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");

            },
            setFormData:function(data)
	{
		var oPortModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oPortModel,"oPortModel");
		 var obj={}
		 
		 // INCTURE [17th April 2018] (Darshna) - Putting the check for the custodian User ID
		 if (data.custodianUserId) {
			var oTUserModel = new sap.ui.model.json.JSONModel();
			oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserID(KaustID='',UserId='" + data.custodianUserId + "')", null,false);
			var custodainName = oTUserModel.getProperty("/d/FirstName")+" "+oTUserModel.getProperty("/d/LastName");
		 }
		 
		//for making ip address and expiry date visible 3-20-2018 Incture(andrea)
		 //Roopali(16-08-2018)- Remove IP Address Field(KS-11)
		//this.getView().byId('ipAddress').setValue(data.linuxIp);
		//Roopali -  set User ID
		this.getView().byId('kaustUserID').setValue(data.userid_ext);	
		/*if (data.custodian === "X") {					// INCTURE [17th April 2018] (Darshna) - Checking for the Request Type
			obj["iCustodianRB"] =  1;
			this.getView().byId("custodianName").setVisible(true);
			this.getView().byId("custodianName").setText(custodainName);
		} else {
			obj["iCustodianRB"] =  0;
			this.getView().byId("custodianName").setVisible(false);
//			oPortModel.setProperty("/iCustodianRB", 0);
		}*/
		if (data.requestType === "Custodian") {
			obj["iCustodianRB"] =  0;
			this.getView().byId("custodianName").setVisible(false);
		} else {
			obj["iCustodianRB"] =  1;			
			this.getView().byId("custodianName").setVisible(true);
			this.getView().byId("custodianName").setText(custodainName);
		}
			
		 
		 obj["tagNumber"] =  data.tagNumber;
//		oPortModel.setProperty("/tagNumber", data.tagNumber);
//		sap.ui.getCore().byId("idTagInput").setValue();
		 obj["sJustText"] =  data.justification;
//		oPortModel.setProperty("/sJustText",data.justification);
		var aOperSys = data.operatingSystem.split(",");
		var that =this;
		aOperSys.forEach(function (oEle) {
			oEle === "Windows" ? that.getView().byId("idWinCB").setSelected(true) : oEle === "Mac" ? that.getView().byId("idMacCB").setSelected(true) : that.getView().byId("idLinuxCB").setSelected(true);
		});
		obj["bWinEnable"] =false;
		obj["bMacEnable"] =false;
		obj["bLinuxEnable"] =false;
		obj["bEnableFields"] =false;
		obj["bTagSelect"] =false;
		obj["bTagInpEnable"] =false;
		obj["bTagInput"] =true;
		if(data.expDate != null){

			var startDateDisp = new Date(parseInt(data.expDate.split("(")[1].split(")")[0])).toDateString();
//			startDateDisp = startDateDisp.split(":00 ");
//			sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
//			var aDate = new Date(parseInt(data.expDate.split("(")[1].split(")")[0]))
//			oPortModel.setProperty("/oDateValue",startDateDisp[0]);
//		var aDate = new Date(parseInt(data.expDate.split("(")[1].split(")")[0]));
		obj["oDateValue"] = startDateDisp;
		}
//		obj["sJustText"] = data.justification;
//		obj["tagNumber"] = data.tagNumber;
//		obj["oDateValue"] = new Date(Date(data.expDate)).toISOString().split("T")[0];
		oPortModel.setData(obj);
//		sap.ui.getCore().byId("idTNCCheckBox").setSelected(true); 	
		oPortModel.refresh();
		if(data.operatingSystem==="Linux"){
			oPortModel.setProperty("/expVisible",false);
			oPortModel.setProperty("/ipVisible",true);
			oPortModel.setProperty("/userIDVisible",true);
			
		}
		else{
			oPortModel.setProperty("/expVisible",false); //Roopali(17-09-2018) expiry date field is not required
			oPortModel.setProperty("/ipVisible",false);
			oPortModel.setProperty("/userIDVisible",false);
		}
		var oTUserModel = new sap.ui.model.json.JSONModel();
		oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.KaustId + "',UserId='')?$format=json", null, true);
		oTUserModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oUserModel, "tempoUserModel");
				var costCenter = oTUserModel.getProperty("/d/Costcenter");
				
				var userData = {
						d:
						{
							results:
								[
					{
						FirstName:data.FirstName,
						LastName:data.LastName,
						KaustID : data.KaustId,
						UserId : data.UserId,    //Roopali - set KAUST Network ID
						Email: data.email,
						Position:data.position,
						Deptname:data.department,
						Office:data.office,
						Mobile:data.mobile,
						Costcenter:costCenter
						
					}
				]}};
				//Roopali - set KAUST Network ID if onBehalf is selected
				if(data.Onbehalf === "X"){
					userData.d.results[0].UserId = data.onBehalfUserId
				}
				
				var oUserModel =  new sap.ui.model.json.JSONModel();
				oUserModel.setData(userData);
				that.getView().byId('userInfoTab').setModel(oUserModel);

			}
		});
		oTUserModel.attachRequestFailed(function(oEvent) {
			sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				title: "Failed to load User Detail",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
		
	},
	onHandleAction:function(evt){

		var oModel = sap.ui.getCore().byId("app").getModel();
 		var action = evt.getSource().getText();
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
// 		var mngrComment = this.getView().byId("commentMngr").getValue();
		var comment = this.getView().byId("comments").getValue().trim();
		
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
	
	if(action=="Reject"&& comment ||action == "Approve"){
		
	
			var requestData = sap.ui.getCore().byId("app").getModel().getData().d.results[0];
			var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
			oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
			var loggedInUser = "", loggedInUserName="";
			if(oLoggedInUserModel.getData().d){
				loggedInUser = oLoggedInUserModel.getData().d.results[0].KaustID;
				loggedInUserName = oLoggedInUserModel.getData().d.results[0].FirstName;
			}
			if(requestData.Stage == "Custodian")
				{
				requestData.comments=comment;
				requestData.t_role = "Custodian";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				}
			else if(requestData.Stage == "IT Service Manager" )
				{
				requestData.comments=comment;
				requestData.t_role = "IT Service Manager";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				}
			
			
//			var oUserData = oLoggedInUserModel.getData().d.results[0];
//			requestData.kaustId = oUserData.KaustID;
//			requestData. FirstName = oUserData.FirstName;
//			requestData.MiddleName = oUserData.MiddleName;
//			requestData.LastName = oUserData.LastName;
//			requestData.Email = oUserData.Email;
//			requestData.RManager = oUserData.RManager;
//			requestData.Position = oUserData.Position;
//			requestData.Deptname = oUserData.Deptname;
//			requestData.Mobile = oUserData.Mobile;
//			requestData.Office = oUserData.Office;
			
	    	if(action=="Approve"||action=="Submit")
	    		{
	    		requestData["lastTaskStatus"] = "Approve";
	    		requestData["status"] = "012";
	    		}
	    	else if(action=="Reject"){
				requestData["status"] = "011";
				requestData["lastTaskStatus"] = "Reject";
			}
//	    	requestData.DCToTemplate=requestData.DCToTemplate.results;
//	    	for(var i=0;i<requestData.DCToTemplate.length ;i++)
//	    		{
//	    		delete requestData.DCToTemplate[i]["__metadata"];
//	    		}
////	    	delete requestData["DCToTemplate"];
//	    	if(requestData.stage == "DC Team Review")
//	    		{
//	    			requestData = this.dataChanged(requestData,requestData.RequestId);
//	    			requestData.DCToTemplate = JSON.parse(this.changedData).DCToTemplate;
////	    			requestData.changeFlag = "0";
//	    		}
//	    	else if(requestData.stage == "Line Manager")
//	    		{
//	    		requestData.changedText = "NA";
//	    		requestData.Wftrigger = "X";
//	    		requestData.activityType = "NA";
//	    		requestData.changeFlag = "0";
//	    		}
//	    	
//	    	requestData.seqNum = requestData.seqNum+"";
//	    	delete requestData["timeStamp"];
//	    	delete requestData["__metadata"];
//	    	delete requestData["seqNum"];
//	    	delete requestData["enableField"];
	    	var obj = JSON.stringify(requestData);
			this.completeKITSTask(taskId,action,obj,requestId);
			
		}
	else
		{
			this.showMessage("Please enter reason for rejection","Comment Mandatory");
		}
 
	
	},
	showMessage:function(msg,mtitle){
		//jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(msg, {
			icon : sap.m.MessageBox.Icon.WARNING,
			title : mtitle,
			actions : [ sap.m.MessageBox.Action.OK ],
		});
		
    },
    /**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_approvers.adminAccess
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_approvers.adminAccess
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_approvers.adminAccess
*/
//	onExit: function() {
//
//	}
		});
	});
