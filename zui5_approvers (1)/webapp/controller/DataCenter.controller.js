sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "com/kaust/zui5approvers/util/formatter",
     "sap.m.MessageBox"
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,formatter,MessageBox) {
		"use strict";
//jQuery.sap.require("kaust.ui.kits.approvers.util.formatter");
//jQuery.sap.require("sap.m.MessageBox");
kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.DataCenter", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaustrequestdatacenter.DataCenter
*/
	onInit: function() {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var data = oModel.getData().d.results[0];
//		if(data!=null){
//			
//			this.setFormData(data);
//			this.disableFields();
//		}
//		this.initializeControlsReadonly();
		if(data.stage == "Requester")
			{
        var oDatePicker = this.getView().byId("requestDate");
        oDatePicker.addEventDelegate({
            onAfterRendering: function() {

                var oDatePickerInner = this.$().find('.sapMInputBaseInner');
                var oID = oDatePickerInner[0].id;
                $('#' + oID).attr("readOnly", true);
                this.$().find("input").attr("readonly", true);
            }
        }, oDatePicker);
			}
	},
    /**
     *  to Make all the Controls readonly
     *  */
    initializeControlsReadOnly: function() {
        var oDatePicker = this.getView().byId("requestDate");
        oDatePicker.addEventDelegate({
            onAfterRendering: function() {

                var oDatePickerInner = this.$().find('.sapMInputBaseInner');
                var oID = oDatePickerInner[0].id;
                $('#' + oID).attr("readOnly", true);
                this.$().find("input").attr("readonly", true);
            }
        }, oDatePicker);

    },
    /**
     * Set Data to the Form 
     */
	setFormData:function(data)
	{

		var reqData={};
		if(data.stage != "Requester")
			{
		this.originalDCData=data.DCToTemplate;
		if(data.DCToTemplate.results.length>0)
		{
			for(var i=0 ; i<data.DCToTemplate.results.length ; i++)
				{
				if(data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Data Center team".toUpperCase())
					reqData.itDataCenter = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Exchange Building".toUpperCase())
					reqData.itExchangeBuild = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
					reqData.itBuldingHigh =true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
					reqData.itBuldingLow = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building-14 templates".toUpperCase())
					reqData.itBuldingMedium = true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT Test Room".toUpperCase()))
					reqData.itBuildingTest = true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-IN-Camps Maintenance".toUpperCase()))
					reqData.itInCmps=true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-OUT-Camps Maintenance".toUpperCase()))
					reqData.itOutCmps=true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
					reqData.itBuildingTempHighDesity = true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
					reqData.itBuildingTempLowDensity = true;
				if( data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[i].templateType.toUpperCase() == "Building 1 templates".toUpperCase())
					reqData.itBuildingTempMedium = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Stock Room".toUpperCase()))
					reqData.itBuildingTempItStock = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-1".toUpperCase()))
					reqData.itBuildingTempItMeter = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-2".toUpperCase()))
					reqData.itBuidingTempItMeter2 = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Security Room".toUpperCase()))
					reqData.itSecurityRoom = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Front and Back Stairs-BDC".toUpperCase()))
					reqData.otherTempItFront = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-BDC".toUpperCase()))
					reqData.otherTempItSpain = true;
				if(data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-SCC".toUpperCase()))
					reqData.otherTempItSpainscc = true;
				}
			if(data.attachment)
				reqData.fileLink=data.attachment;
			
			reqData.reqDate = new Date(parseInt(data.requestDate.split("(")[1].split(")")[0])).toISOString().split("T")[0];
			if(data.accessType == "X")
				this.getView().byId("escorted").setSelected(true);
			else 
				this.getView().byId("unEscorted").setSelected(true);
			
			
			var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + data.RequestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
			var oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData(url, null, false);
			if(oFileModel.getData().d.results[0].URL != ""){
				this.getView().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
			}
			
			
			var oTUserModel = new sap.ui.model.json.JSONModel();
			oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null,false);
//			oTUserModel.attachRequestCompleted(function(oEvent) {
//				if (oEvent.getParameter("success")) {
					this.getView().setModel(oUserModel, "tempoUserModel");
					var costCenter = oTUserModel.getProperty("/d/Costcenter");
					var userData = {
							d:
							{
								results:
									[
						{
							FirstName:data.FirstName,
							LastName:data.LastName,
							KaustID : data.kaustId,
							Email: data.Email,
							Position:data.Position,
							Deptname:data.Deptname,
							Office:data.Office,
							Mobile:data.Mobile,
							Costcenter:costCenter,
							Nationality:oTUserModel.getProperty("/d/Nationality"),
							SaudiID :oTUserModel.getProperty("/d/Nationality"),
							Iqama:oTUserModel.getProperty("/d/Iqama"),
							KaustIdExpiry:oTUserModel.getProperty("/d/KaustIdExpiry"),
							VendorNumber:oTUserModel.getProperty("/d/VendorNumber")
						}
					]}};
					var oUserModel =  new sap.ui.model.json.JSONModel();
					oUserModel.setData(userData);
					this.getView().byId('userInfoTab').setModel(oUserModel);
				
//				}
//			});
//			oTUserModel.attachRequestFailed(function(oEvent) {
//				sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
//					title: "Failed to load User Detail",
//					onClose: null,
//					textDirection: sap.ui.core.TextDirection.Inherit
//				});
//			});
			
		 if(data.onBehalf == "X")
			 this.getView().byId("idOnBehalf").setSelected(true);
		 else
			 this.getView().byId("idOnBehalf").setSelected(false);
		 
			this.getView().byId("Aggreement1").setVisible(false);
			this.getView().byId("AggreeCheck").setVisible(false);
			this.getView().byId("AggreeLink").setVisible(false);
			var requestModel =  new sap.ui.model.json.JSONModel();
			var reqModel =  new sap.ui.model.json.JSONModel();
			reqModel.setData(data);
			this.getView().setModel(reqModel,"requestData");
			requestModel.setData(reqData);
			this.getView().setModel(requestModel, "dataRequestData");
			
//			userData.=data.FirstName;
					
		}
	else
		{
		var requestModel =  new sap.ui.model.json.JSONModel();
		requestModel.setData({});
		this.getView().setModel(requestModel, "dataRequestData");
		}
	}
		else if(data.stage =="Requester")
			{
		

			var requestModel =  new sap.ui.model.json.JSONModel();
			var reqModel =  new sap.ui.model.json.JSONModel();
			reqModel.setData(data);
			this.getView().setModel(reqModel,"requestData");
			requestModel.setData(reqData);
			this.getView().setModel(requestModel, "dataRequestData");
			
			var oTUserModel = new sap.ui.model.json.JSONModel();
			oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null, false);
//			oTUserModel.attachRequestCompleted(function(oEvent) {
//				if (oEvent.getParameter("success")) {
					this.getView().setModel(oUserModel, "tempoUserModel");
					var costCenter = oTUserModel.getProperty("/d/Costcenter");
					this.getView().byId("idOnBehalf").setEnabled(true);
					var userData = {
							d:
							{
								results:
								[
						{
							FirstName:data.FirstName,
							LastName:data.LastName,
							KaustID : data.kaustId,
							Email: data.Email,
							Position:data.Position,
							Deptname:data.Deptname,
							Office:data.Office,
							Mobile:data.Mobile,
							Costcenter:costCenter
						}
					]}};
					var oUserModel =  new sap.ui.model.json.JSONModel();
					oUserModel.setData(userData);
					this.getView().byId('userInfoTab').setModel(oUserModel);
				
//				}
//			});
//			oTUserModel.attachRequestFailed(function(oEvent) {
//				sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
//					title: "Failed to load User Detail",
//					onClose: null,
//					textDirection: sap.ui.core.TextDirection.Inherit
//				});
//			});
		
			}
	},
	disableFields:function()
	{
		var data = this.getView().getModel("dataRequestData").getData();
		var reqData = this.getView().getModel("requestData").getData();
		

if(reqData.stage == "Data Center Team")
	{
	this.getView().byId("idOnBehalf").setVisible(true);
	this.getView().byId("idOnBehalf").setEnabled(false);
	this.getView().byId("escorted").setEnabled(false);
	this.getView().byId("unEscorted").setEnabled(false);
	this.getView().byId("submitBtn").setVisible(false);
	this.getView().byId("approveButton").setVisible(true);
	this.getView().byId("rejectButton").setVisible(true);
	data.enableField = true;
	reqData.enableField = true;
	this.getView().getModel("requestData").refresh();
	this.getView().byId("requestDate").setEnabled(false);
	this.getView().getModel("dataRequestData").refresh();
	}
else if(reqData.stage == "Line Manager")
	{
	this.getView().byId("submitBtn").setVisible(false);
	this.getView().byId("approveButton").setVisible(true);
	this.getView().byId("rejectButton").setVisible(true);
	data.enableField = false;
	reqData.enableField = false;
	this.getView().getModel("requestData").refresh();
	this.getView().getModel("dataRequestData").refresh();
	this.getView().byId("idOnBehalf").setVisible(true);
	this.getView().byId("idOnBehalf").setEnabled(false);
	}
else if(reqData.stage == "Requester")
	{
	this.getView().byId("idOnBehalf").setVisible(true);
	this.getView().byId("idOnBehalf").setEnabled(true);
	this.getView().byId("escorted").setEnabled(false);
	this.getView().byId("unEscorted").setEnabled(false);
	this.getView().byId("submitBtn").setVisible(true);
	this.getView().byId("approveButton").setVisible(false);
	this.getView().byId("rejectButton").setVisible(false);
	this.getView().byId("requestDate").setEnabled(true);
	data.enableField = true;
	reqData.enableField = true;
	this.getView().byId("requesterFileupload").setVisible(true);
	this.getView().byId("fileDisplay").setVisible(true);
	this.getView().getModel("requestData").refresh();
	this.getView().getModel("dataRequestData").refresh();
	this.getView().byId("Aggreement1").setVisible(true);
	this.getView().byId("AggreeCheck").setVisible(false);
	this.getView().byId("AggreeLink").setVisible(false);
this.getView().byId("fileLink").setVisible(false);
this.getView().byId("commentsLbl").setVisible(false);
this.getView().byId("CommentsForm").setVisible(false);
this.getView().byId("commentToolbar").setVisible(false);
	
	}
else
	{
	this.getView().byId("idOnBehalf").setVisible(true);
	this.getView().byId("idOnBehalf").setEnabled(false);
	this.getView().byId("escorted").setEnabled(false);
	this.getView().byId("unEscorted").setEnabled(false);
	this.getView().byId("submitBtn").setVisible(false);
	this.getView().byId("approveButton").setVisible(true);
	this.getView().byId("rejectButton").setVisible(true);
	this.getView().byId("requestDate").setEnabled(false);
	data.enableField = false;
	reqData.enableField = false;
	this.getView().getModel("requestData").refresh();
	this.getView().getModel("dataRequestData").refresh();
	}


	},

	 checkType:function(oEvt) {
//		 requestDate
		 if(this.getView().getModel("requestData")) {
			 var data = this.getView().getModel("requestData").getData();
			 var value= oEvt.getSource().getText();
//           12-01-2017: Making the Request Detail Enable in both the cases
//			 if(data.stage=="Requester") {
//				 if(value =='Escorted') {
//					 this.getView().byId("requestDate").setValue(new Date().toISOString().split("T")[0]);
//					 this.getView().byId("requestDate").setEnabled(false);
//				 } else {
//					 if (this.getView().getModel("requestData").getData().stage == "Data Center Team")
//						 this.getView().byId("requestDate").setEnabled(false);
//					 else {
//						 this.getView().byId("requestDate").setEnabled(true);
//						 this.getView().byId("requestDate").setValue();
//					 }
//				 }
//	 		}
			 if(data.stage=="Requester") { 
				 if (this.getView().getModel("requestData").getData().stage == "Data Center Team")
					 this.getView().byId("requestDate").setEnabled(false);
				 else {
					 this.getView().byId("requestDate").setEnabled(true);
				 }
			 }
		 }
	 },
	 
	onHandleAction: function(evt)
	{
		var oModel = sap.ui.getCore().byId("app").getModel();
 		var action = evt.getSource().getText();
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
// 		var mngrComment = this.getView().byId("commentMngr").getValue();
		var comment = this.getView().byId("comments").getValue().trim();
		
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		 var existUserId=true;
	        
	       //to check user Id is exist or not
	        var checked = this.getView().byId('idOnBehalf').getSelected();
	        if (checked && this.getView().byId('onBehalfUserTab').getVisible()) {
	            var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
	            if(!otherUser.Type)
	           		existUserId=false;
	        }
	        if(existUserId)
	        	{
	if(action=="Reject"&& comment ||action == "Approve" || action =="Submit"){
			var requestData = sap.ui.getCore().byId("app").getModel().getData().d.results[0];
			var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
			oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
			var loggedInUser = "", loggedInUserName="";
			if(oLoggedInUserModel.getData().d){
				loggedInUser = oLoggedInUserModel.getData().d.results[0].KaustID;
				loggedInUserName = oLoggedInUserModel.getData().d.results[0].FirstName;
			}
			var unexcorted = this.getView().byId("unEscorted").getSelected();
			if(unexcorted)
			{
				requestData.accessType = "0";
				requestData.flow = "NO";
			}
		else
			{
			requestData.accessType = "X";
			requestData.flow = "YES";
			}
			if(requestData.stage == "Line Manager")
				{
				requestData.comments=comment;
				requestData.t_role = "Line Manager";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
//				requestData.lineManagerApprover = loggedInUserName;
//				requestData.lineManagerComm="";
				}
			else if(requestData.stage =="Requester")
				{
				requestData.comments="";
				requestData.t_role = "Requester";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
				}
			else if(requestData.stage == "Justification")
			{
			requestData.comments=comment;
			requestData.t_role = "Justification Approval";
			requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
			requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
			requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
			requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
			requestData.requestDate = "0000-00-00T00:00:00";
			if(action=="Approve")
			requestData.approverStatus = 2// approved
			else
			requestData.approverStatus = 3// rejected
//			requestData.lineManagerApprover = loggedInUserName;
//			requestData.lineManagerComm="";
			}
	
			else if(requestData.stage == "Data Center Team")
				{
				requestData.comments=comment;
				requestData.t_role = "DC Team";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
//				requestData.dcTeamApprover = loggedInUserName
//				requestData.dcTeamComments = "";
				}
			else if(requestData.stage =="Data Center Lead")
				{
				requestData.comments=comment;
				requestData.t_role = "DC Lead";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
//				requestData.dcLeadApprover=loggedInUserName;;
//				requestData.dcLeadComm="";
				}
			else if(requestData.stage =="Research and Computing Team")
				{
				requestData.comments=comment;
				requestData.t_role = "R&C Manager";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
//				requestData.rcManagerApprover=loggedInUserName;;
//				requestData.rcManagerComm="";
				}
			else if(requestData.stage =="Security Team")
				{
				requestData.comments=comment;
				
//				requestData.securityTeamApprover=loggedInUserName;;
//				requestData.securityTeamComm="";
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
			
	    	if(action=="Approve"||action=="Submit") {
	    		requestData["lastTaskStatus"] = "Approve";	//for BPM
	    		if(requestData.stage == "Requester") {		//for ECC
	    			requestData["status"] = "055";
	    		} else {
	    			requestData["status"] = "012";
	    		}
	    	} else if(action=="Reject"){
				requestData["status"] = "011";
				requestData["lastTaskStatus"] = "Reject";
			}
	    	
//	    	delete requestData["DCToTemplate"];
	    	if(requestData.stage == "Data Center Team")
	    		{
	    		var bFormValid = this.fnValidForm();
	    		if(bFormValid)
	    			{
	    		requestData.DCToTemplate=requestData.DCToTemplate.results;
		    	for(var i=0;i<requestData.DCToTemplate.length ;i++)
		    		{
		    		delete requestData.DCToTemplate[i]["__metadata"];
		    		}
	    		
	    			requestData = this.dataChanged(requestData,requestData.RequestId);
	    			requestData.DCToTemplate = JSON.parse(this.changedData).DCToTemplate;
	    			var obj={};
	    			if(this.changedToNoArray.length>0)
	    			for(var i = 0; i<this.changedToNoArray.length;i++)
    				{
    					obj = {};
    					obj=this.changedToNoArray[i];
    					obj.templateField="";
    					requestData.DCToTemplate.push(obj);
    				}
	    		}
	    		else
	    			{
	    			return;
	    			}
	    		}
	    	else if(requestData.stage == "Requester")
			{
	    		requestData.changedText = "NA";
	    		requestData.Wftrigger = "X";
	    		if(this.attachment)
	    		requestData.attachment = this.attachment;

	    		var unexcorted = this.getView().byId("unEscorted").getSelected();
	    		var bReqDate = this.fnValidation(unexcorted,this.getView().byId("requestDate").getValue());
	    		if(!bReqDate)
	    			return;
	    		else
	    			{
	    			if(this.getView().byId("requestDate").getEnabled() )
		    			requestData.requestDate= new Date(this.getView().byId("requestDate").getValue()).toISOString().split(".")[0];
		    		else
		    			requestData.requestDate = new Date().toISOString().split(".")[0];
		    		
	    		requestData.activityType = "First";
	    		requestData.changeFlag = "0";
	    		requestData.approverStatus = 2// approved
	    		
	    		var oUserData = this.getView().getModel().getData().d.results[0];
	    		var aggrement = this.getView().byId("Aggreement1").getVisible();
	    		var aggrement2 = this.getView().byId("AggreeCheck").getVisible();
	    		var bFormValid = this.fnValidForm();
	    		if(!bFormValid)
	    			return;
	    		else{
	    		
	    		var fileVal = this.fnFileValidation();
	    		if(!this.getView().getModel("ofileModel") || !fileVal)
	    			{
	    			this.showMessage("Please upload copy of your KAUST ID","Warning");
	    			return;
	    			}	
	    		var bAgg = this.fnAgrementCheck(aggrement,aggrement2);
	    		if(!bAgg)
	    			return;
	    		else
	    			{
	    			var checked = this.getView().byId('idOnBehalf').getSelected();
		    		if(checked && !this.getView().byId('onBehalfUserTab').getVisible())
		    			{
		    			 this.showMessage("Please select OnBehalf User","Warning");
		    			 return;
		    			}
		    		else
		    			{
	    			requestData.DCToTemplate=requestData.DCToTemplate.results;
	    	    	for(var i=0;i<requestData.DCToTemplate.length ;i++)
	    	    		{
	    	    		delete requestData.DCToTemplate[i]["__metadata"];
	    	    		}
	    		requestData = this.dataChanged(requestData,requestData.RequestId);
	    		requestData.DCToTemplate = JSON.parse(this.changedData).DCToTemplate;
	    		
	    		if(checked && this.getView().byId('onBehalfUserTab').getVisible()){
	    			
	    			var otherUser = this.getView().getModel("oUserSerchModel").getData().d;
	    			requestData.onBehalf = "X";
//	    			payload.userId =otherUser.UserId;
	    			requestData.kaustId = otherUser.KaustID;
	    			requestData.onBehalfUserId = otherUser.UserId;
	    			requestData.FirstName = otherUser.FirstName;
	    			requestData.MiddleName = otherUser.MiddleName;
	    			requestData.LastName = otherUser.LastName;
	    			requestData.Email = otherUser.Email;
	    			requestData.RManager = otherUser.RManager;
	    			requestData.Position = otherUser.Position;
	    			requestData.Deptname = otherUser.Deptname;
	    			requestData.Mobile = otherUser.Mobile;
	    			requestData.Office = otherUser.Office;
	    			requestData.req_orgUnit = otherUser.Orgunit;
	    			requestData.req_orgName = otherUser.Orgname;
//	    			payload.requestType = "OnBehalf";
	    			requestData.applicantType = otherUser.Type;
	    			if(otherUser.Type.toUpperCase() == "STUDENT"||otherUser.Type.toUpperCase() =="STAFF")
	    				requestData.requestType = "Non-Contractor";
	    			else
	    				requestData.requestType = "Contractor";
	    		}// on behalf close
	    			}// return if on behalf user is not selected
			}
	    		}
	    			}
			}
	    	else if(requestData.stage == "Line Manager")
	    		{
	    		requestData.changedText = "NA";
	    		requestData.Wftrigger = "X";
	    		if( requestData.activityType ==  "First")
	    			requestData.activityType = "First";
	    		else
	    			requestData.activityType = "NA";
	    		
	    		requestData.changeFlag = "0";
	    		}
	    	requestData.seqNum = requestData.seqNum+"";
	    	delete requestData["timeStamp"];
	    	delete requestData["__metadata"];
	    	delete requestData["seqNum"];
	    	delete requestData["enableField"];
	    	delete requestData["KaustID"];
	    	var obj = JSON.stringify(requestData);
			this.completeKITSTask(taskId,action,obj,requestId);
			
		}
	else
		{
			this.showMessage("Please enter reason for rejection","Warning");
		}
	   }
	else
		this.showMessage("OnBehalf UserID is Missing","Warning");
	},
	fnFileValidation:function()
	{
		var file = document.getElementById('DataCenter--docFileUpload-fu').files[0];
		 if(file){
		 if(this.getView().getModel("ofileModel"))
			 {
			 if(this.getView().getModel("ofileModel").getData().fileName == file.name)
				 return true;
			 else
				 {
//				 this.showMessage("File attachment is required.", "Validation");
				return false;
				 }
			 }
		 else
			 {
//			 this.showMessage("File attachment is required.", "Validation");
				return false;
			 }
		 }
		 else
			 {
//			 this.showMessage("File attachment is required.", "Validation");
				return false;
			 }
	},
	fnValidation:function(unexcorted,date) {
//		var file = document.getElementById('DataCenter--docFileUpload-fu').files[0];
//		if(unexcorted) {
//			 if(date) {
//				 return true;
//			} else {
//				 this.showMessage("Please select Request date","Warning");
//				 return false;
//			}
//		} else 
//		return true;
		
		if (date) {
			return true;
		} else {
			this.showMessage("Please select Request date","Warning");
			return false;
		}
		
	},
	
	
	fnAgrementCheck:function(ag1,ag2)
	{
//		var reqData = this.getView().getModel("requestData").getData();
	
	
		if(ag1 && !ag2)
			{
			var firstAgg =this.getView().byId("firstAgg").getSelected();
				if(firstAgg)
					{
						return true;
					}
				else
					{
					this.showMessage("Please check the agreement for Data Center","Warning");
					return false;
					}
			}
		else if(ag2 && ag1)
			{
			var secAgg =this.getView().byId("AggreeCheck").getSelected();
			var firstAgg =this.getView().byId("firstAgg").getSelected();
				if(secAgg&& firstAgg )
					{
					return true;
					}
				else if(!firstAgg){
	            	this.showMessage("Please check the agreement for Data Center", "Warning");
	                return false;
	            }
				else
					{
					this.showMessage("Please check the agreement for Service Provider","Warning");
					return false;
					}
			}
	},
	fnValidForm:function()
	{
		var reqData = this.getView().getModel("dataRequestData").getData();
		if(reqData.itDataCenter||reqData.itExchangeBuild||reqData.itBuldingHigh || reqData.itBuldingLow || reqData.itBuldingMedium || reqData.itBuildingTest||reqData.itInCmps || reqData.itOutCmps||reqData.itBuildingTempHighDesity|| reqData.itBuildingTempLowDensity|| reqData.itBuildingTempItStock|| reqData.itBuildingTempMedium || reqData.itBuildingTempItMeter || reqData.itBuidingTempItMeter2 || reqData.itSecurityRoom||reqData.otherTempItFront ||reqData.otherTempItSpain || reqData.otherTempItSpainscc)
			{
			 return true
			}
		else{
			this.showMessage("Please select atleast 1 building ","Warning");
			return false;
		}
	},
	
	  validateDate: function(oEvt) {
//	    	var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
	        var currentDate = new Date();
	        var date = Date.parse(oEvt.getSource().getValue());
	        if(date){
	        if (Date.parse(currentDate) > date) {
	            sap.m.MessageBox.show(
	            		"Request date should be greater than  Today's Date", {
	                    icon: sap.m.MessageBox.Icon.ERROR,
	                    title: "Error",
	                    actions: [sap.m.MessageBox.Action.OK],

	                    //                  	        styleClass: bCompact ? "sapUiSizeCompact" : ""
	                }
	            );
	            oEvt.getSource().setValue("");
	            //	        
	        }
	        }
	        else
	        	{
       		 sap.m.MessageBox.show(
       	                "Request date is invalid, please select date from DatePicker", {
       	                    icon: sap.m.MessageBox.Icon.ERROR,
       	                    title: "Error",
       	                    actions: [sap.m.MessageBox.Action.OK],
       	                }
       	            );
       	            oEvt.getSource().setValue("");
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
	
	dataChanged:function(payload,requestId)
	{
	
		var requestData ={"DCToTemplate":""};
		if(payload.stage == "Data Center Team")
		{
			requestData.DCToTemplate = this.originalDCData.results;
			
		}
	
//			requestData.DCToTemplate = this.originalDCData.results;
			var changedData = this.getView().getModel("dataRequestData").getData();
			payload.RequestId= requestId;
			payload["DCToTemplate"]=[];
			if(changedData.itDataCenter)
			{
//				if(requestData.DCToTemplate.templateType == "Data Center Team template")
			var obj = {
					RequestId : payload.RequestId,
					templateType : oResourceModel.getProperty("Data Center Team template"),
					templateField : oResourceModel.getProperty("IT-Data Center team"),
					
			};
			payload.DCToTemplate.push(obj);
			}
			
		if(changedData.itExchangeBuild)
			{
			var obj = {
					RequestId : payload.RequestId,
					templateType : oResourceModel.getProperty("Exchange Building Template"),
					templateField : oResourceModel.getProperty("IT-Exchange Building"),
					
			};
			payload.DCToTemplate.push(obj);
			}
		if(changedData.itBuldingHigh || changedData.itBuldingLow || changedData.itBuldingMedium || changedData.itBuildingTest)
		{
			
		var obj = {
				templateType : oResourceModel.getProperty("Building-14 templates"),
				templateField: "",
				RequestId : payload.RequestId,
				
		};
		if(changedData.itBuldingHigh)
			obj.templateField = obj.templateField + oResourceModel.getProperty("IT-High Density");
		
		if(changedData.itBuldingLow)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" + oResourceModel.getProperty("IT-Low Density");
			else
				obj.templateField = obj.templateField  + oResourceModel.getProperty("IT-Low Density");
			}
		if(changedData.itBuldingMedium)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" + oResourceModel.getProperty("IT-Medium Density");
			else
				obj.templateField = obj.templateField   + oResourceModel.getProperty("IT-Medium Density");
			}
		if(changedData.itBuildingTest)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField  + "|" + oResourceModel.getProperty("IT Test Room");
			else
				obj.templateField = obj.templateField  + oResourceModel.getProperty("IT Test Room");
			}
		payload.DCToTemplate.push(obj);
		}

		if(changedData.itInCmps || changedData.itOutCmps )
		{
			
		var obj = {
				templateType : oResourceModel.getProperty("Maintenance templates"),
				templateField : "",
					RequestId : payload.RequestId,
				
		};
		if(changedData.itInCmps)
			obj.templateField = obj.templateField + oResourceModel.getProperty("IT-IN-Camps Maintenance (BDC,SCC)");
		
		if(changedData.itOutCmps)
			{
			if(obj.templateField.length > 1)
				obj.templateField = obj.templateField  + "|" +oResourceModel.getProperty("IT-OUT-Camps Maintenance (EXB,SHQ)");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-OUT-Camps Maintenance (EXB,SHQ)");
			}
		payload.DCToTemplate.push(obj);
		}
		
		
		if(changedData.itBuildingTempHighDesity|| changedData.itBuildingTempLowDensity|| changedData.itBuildingTempItStock|| changedData.itBuildingTempMedium || changedData.itBuildingTempItMeter || changedData.itBuidingTempItMeter2 || changedData.itSecurityRoom)
		{
			
		var obj = {
				templateType : oResourceModel.getProperty("Building 1 templates"),
				templateField : "",
				RequestId : payload.RequestId,
		
		};
		if(changedData.itBuildingTempHighDesity)
			obj.templateField = obj.templateField + oResourceModel.getProperty("IT-High Density");
		
		if(changedData.itBuildingTempLowDensity)
			{
			if(obj.templateField.length > 1)
				obj.templateField = obj.templateField + "|" + oResourceModel.getProperty("IT-Low Density");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-Low Density");
			}
		
		if(changedData.itBuildingTempItStock)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField +"|"+ oResourceModel.getProperty("IT-Stock Room");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-Stock Room");
			}
		if(changedData.itBuildingTempMedium)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" +oResourceModel.getProperty("IT-Medium Density");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-Medium Density");
			}
		if(changedData.itBuildingTempItMeter)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" + oResourceModel.getProperty("IT-MTER-1");
			else
				obj.templateField = obj.templateField  + oResourceModel.getProperty("IT-MTER-1");
			}
		if(changedData.itBuidingTempItMeter2)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" +oResourceModel.getProperty("IT-MTER-2");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-MTER-2");
			}
		if(changedData.itSecurityRoom)
			{
			if(obj.templateField.length>1)
				obj.templateField = obj.templateField + "|" +oResourceModel.getProperty("IT-Security Room");
			else
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-Security Room");
			}
		payload.DCToTemplate.push(obj);
		}
		
		if(changedData.otherTempItFront ||changedData.otherTempItSpain || changedData.otherTempItSpainscc)
			{
			var obj = {
					templateType : oResourceModel.getProperty("Other templates"),
					templateField : "",
					RequestId : payload.RequestId,
				
			};
			if(changedData.otherTempItFront)
				obj.templateField = obj.templateField + oResourceModel.getProperty("IT-Front and Back Stairs-BDC");
			
			if(changedData.otherTempItSpain)
				{
				if(obj.templateField.length>1)
					
					obj.templateField = obj.templateField+"|"+oResourceModel.getProperty("IT-Spine Access-BDC");
					else
					obj.templateField = obj.templateField +oResourceModel.getProperty("IT-Spine Access-BDC");
				}
			if(changedData.otherTempItSpainscc)
				{
				if(obj.templateField.length>1)
					obj.templateField = obj.templateField+"|"+oResourceModel.getProperty("IT-Spine Access-SCC");
				else
					obj.templateField = obj.templateField +oResourceModel.getProperty("IT-Spine Access-SCC");
			}
			payload.DCToTemplate.push(obj);
			}
		var changedTemp;

//		var originalArray = requestData.DCToTemplate;
		var changedArray = payload.DCToTemplate;
//		var changedArray = changedA;
		this.changedData = {"DCToTemplate":changedArray} ;
		this.changedData = JSON.stringify(this.changedData);
		
		if(payload.stage == "Data Center Team")
			{
			var originalArray = requestData.DCToTemplate;
			this.originalDto = {"DCToTemplate":originalArray};//changed data
			this.originalData = JSON.stringify(this.originalDto);
		var changedTemp="";
		var changed=false;
		this.orginalArraySplice =false;
		var matched= false;
		this.changedToNoArray= [];
		for (var i = originalArray.length - 1; i >= 0; i--) {
		   for (var j = changedArray.length - 1; j >= 0; j--) {
		       if (originalArray[i].templateType.toUpperCase() == changedArray[j].templateType.toUpperCase()) { // when the template matches
		        changedTemp += changedArray[j].templateType + "\n\t";
		           var arrayOrg = originalArray[i].templateField.split("|"); // original template field like 1,2,3
		           var arraychanged = changedArray[j].templateField.split("|"); // changed template Fieldfield 
		           var temp = [];
		           var exist=false;
		           matched=true;
		           for(var l = arraychanged.length-1 ; l>=0;l--)
		        	   {
		        	   		for(var m = arrayOrg.length-1 ;m>=0 ; m--)
		        	   			{
		        	   				if(arrayOrg[m].toUpperCase() == arraychanged[l].toUpperCase())
		        	   					{
		        	   					arrayOrg.splice(m,1);
		        	   					arraychanged.splice(l,1);
		        	   					changed=true;
//		        	   					matched=true;
		        	   					break;
		        	   					}
		        	   			}//after break
		        	   }
// unmatched data for original and changed array
		           if(arrayOrg.length>0)
		        	   {
		        	   // user changed to No from Yes
		        	   for(var l=0;l<arrayOrg.length ; l++)
		        		   {
		        		   		changedTemp = changedTemp + arrayOrg[l] + "-No\n";
		        		   		changed=true;
		        		   		exist=true;
		        		   }
		        	   //changed to no
//		        	   this.changedToNoArray.push(originalArray[i]); 
		        	   }
		           if(arraychanged.length>0 && changed)
		        	   {
		        	   //user changed no to yes
		        	   for(var l=0;l<arraychanged.length ; l++)
	        		   {
	        		   		changedTemp = changedTemp + arraychanged[l] + "-Yes\n";
	        		   		changed=true;
	        		   		exist=true;
	        		   }
		           }
		           if(!exist)
		            changedTemp = changedTemp.replace(changedArray[j].templateType,"");
		           //splice both matched items
		           changedArray.splice(j, 1);
		       }
		   }
		   if(matched)
			   {
		   originalArray.splice(i, 1);
		   matched=false;
			   }
		} //end of i for loop
		if (originalArray.length > 0) //remaining original array... which means user uncheck these template
		{
		   for (var i = 0; i < originalArray.length; i++) {
		    changedTemp += originalArray[i].templateType + "\n\t";
		       var arrayOrg = originalArray[i].templateField.split("|"); // original field like 1,2,3
		       for (var k = 0; k < arrayOrg.length; k++) {
		           changedTemp = changedTemp + arrayOrg[k] + "-No\n";
		           changed=true;
		       }
		       this.changedToNoArray.push(originalArray[i]);
		   } //end of for loop
		}
		if(changed && changedArray.length > 0)
			{
		if (changedArray.length > 0) {
		   for (var i = 0; i < changedArray.length; i++) {
		    changedTemp += changedArray[i].templateType + "\n\t";
		       var arrayChg = changedArray[i].templateField.split("|"); // original field like 1,2,3
		       for (var k = 0; k < arrayChg.length; k++) {
		           changedTemp = changedTemp + arrayChg[k] + "-Yes\n";
		           changed=true;
		       }
		   }
		}
			}

		if(changed)
			{
			payload.changedText = changedTemp;
			payload.Wftrigger = "X";
			payload.activityType = "Changed";
			payload["changeFlag"]="X";
			}
		else
			{
			payload.changedText = "NA";
			payload.Wftrigger = "X";
			payload["changeFlag"]="0";
			payload.activityType = "Not Changed";
			}
			}
		
		return payload;
	},
	 handleFileUploadLocal : function(oEvent){
			var that = this;
			 file = document.getElementById('DataCenter--docFileUpload-fu').files[0];
		        var regex = /[!$%^&*()+|~=`{}\[\]:";'<>?,\/]/;
		        if(file){
				 if(!regex.test(file.name)){
		        
			 var reader = new FileReader();
				reader.readAsArrayBuffer(file);

				reader.onload = function(evt) {
					
					var fileName = file.name;
					//alert(fileName	);
					var byteArray2 = new Uint8Array(
							evt.target.result);

					var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
					
					
					var ofileModel  = new sap.ui.model.json.JSONModel();
					var obj = {"fileData":"","fileName":""};
					obj.fileData = fileEncodedData;
					obj.fileName = fileName;
					ofileModel.setData(obj);
					that.getView().setModel(ofileModel,"ofileModel");
					var requestData = sap.ui.getCore().byId("app").getModel().getData().d.results[0];
//					requestData.attachment = this.handleFileUploadtoRMS(requestData,requestData.RequestId,requestData.kaustId);
					that.handleFileUploadtoRMS(requestData.RequestId,requestData.kaustId);
					that.getView().byId("fileuploadlbl").setVisible(true);
					that.getView().byId("fileLinkDisp").setVisible(true);
					 that.getView().byId("fileLinkIcon").setVisible(true);
					that.getView().byId("uploadBtn").setVisible(false);
//					that.getView().byId('fileLink').setVisible(true);
				};
				 }
				 else
					 {
					 that.getView().byId("fileuploadlbl").setVisible(false);
						that.getView().byId("fileLinkDisp").setVisible(false);
						 that.getView().byId("fileLinkIcon").setVisible(false);
						 that.getView().byId("uploadBtn").setVisible(false);
					 that.showMessage("Filename should not contain special characters","Warning");
					 }
		        }
		        else
		        	{
					 this.getView().byId("fileLinkIcon").setVisible(false);
					 this.getView().byId("fileLinkDisp").setVisible(false);
					 this.getView().byId("fileuploadlbl").setVisible(false);
					 this.getView().byId("uploadBtn").setVisible(false);
					 this.showMessage("Please select the file to upload","Warning");
		        	}
		},
		handleUploadChange:function()
		{

	    	file = document.getElementById('DataCenter--docFileUpload-fu').files[0];
	    	var regex = /[!$%^&*()+|~=`{}\[\]:";'<>?,\/]/;
	    	if(file)
	    		{
			 if(!regex.test(file.name)){ 
					this.getView().byId("fileLinkDisp").setVisible(false);
					 this.getView().byId("fileLinkIcon").setVisible(false);
					this.getView().byId("fileuploadlbl").setVisible(false);
					this.getView().byId("uploadBtn").setVisible(true);
			 }else
				 {

				 this.getView().byId("fileLinkIcon").setVisible(false);
				 this.getView().byId("fileLinkDisp").setVisible(false);
				 this.getView().byId("fileuploadlbl").setVisible(false);
				 this.getView().byId("uploadBtn").setVisible(false);
					this.showMessage("Filename should not contain special characters","Warning");   
				 }
	    		}
			 else
				 {

				 this.getView().byId("fileLinkIcon").setVisible(false);
				 this.getView().byId("fileLinkDisp").setVisible(false);
				 this.getView().byId("fileuploadlbl").setVisible(false);
				 this.getView().byId("uploadBtn").setVisible(false);
				 this.showMessage("Please select the file to upload","Warning");
				 }
	    
		},
		uint8ToString : function(buf) {
			var i, length, out = '';
			for (i = 0, length = buf.length; i < length; i += 1) {
				out += String.fromCharCode(buf[i]);
			}
			return out;
		},
		handleFileUploadtoRMS:function(requestId,kaustId)
		{
		if(this.getView().byId("docFileUpload").getValue())
			{
			var fielData = this.getView().getModel("ofileModel").getData();
//			var data=this.getView().getModel("oUserModel").getData().d.results[0];
//			this.setBusy(true);
			var busyDialog = new sap.m.BusyDialog();
	    	busyDialog.open();
			var that=this;
			this.UploadFileToRMS(fielData.fileName.split(".")[0],requestId,"3",function(){
				this.getUserFilesByKaustId(requestId,kaustId,function(ofilesData){
					var ofileModel  = new sap.ui.model.json.JSONModel();
					//handle File
					if(ofilesData.length > 0 ){
						if( ofilesData[0].MSG_TYPE =="E"){
							that.showMessage(ofilesData[0].MESSAGE,"Warning");						
						}else{							    	
					    	ofileModel.setData(ofilesData);	    				    	
						}
						that.getView().setModel(ofileModel, "userFiles");	    			    	
//					    tbl.setModel(ofileModel);
						
//						that.getView().byId("docFileUpload").setValue("");
						that.attachment = ofilesData[0].Url;
//						return ofilesData[0].Url;
//						that.resetAllFields();
					    busyDialog.close();
					}	
//					return ofilesData[0].Url;
//					that.updateDataCenter(requestId,createData,ofilesData[0].Url);
					
				
//				    docTitle.setValue("");
//				    docExpiryDate.setValue("");
//				    tabAttachment.setExpanded(false)
			    },function(){
//			    	tbl.setBusy(false);
			    });	
			});
		}
		else
			{
			this.showMessage("Please Upload ID proof","Warning");
			}
		},
UploadFileToRMS:function(fileName,KaustId,folderId,successFn){
		
		var uploadCntr = this.getView().byId("docFileUpload");
//		this.setBusy(true);
		/*Folder Name NodeID
			Passport 1
			Iqama 3
			Saudi Visa 5
			Degree Certificate 7
			Marriage Certificate 9
			Birth Certificate 11
			Driving License 13
			Car Registration Card 15
			Saudi ID 17
			Saudi Family Card 19
			Salary Certificate 21
			Employment Letter 23
			CV 25
			Others(unclassified) 27*/
		
		if( ! (fileName && KaustId && folderId)){
			this.showMessage("Missing parameters","Warning");
			return;
		}
				
		var that=this;
		var slug = fileName +','+ KaustId +','+ folderId;
		
		   var file = jQuery.sap.domById(uploadCntr.getId() + "-fu").files[0];
//		   var uploadUrl = this.getUrl("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
		   var uploadUrl = this.getUrl("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
		   var token = this.getToken();
		   var oHeaders = {
                   "x-csrf-token": token ,
                   "slug": slug,
                   "X-Requested-With": "XMLHttpRequest",
                   "Content-Type": file.type,
                   "DataServiceVersion": "2.0",
                   "Accept" : "text/plain, */*"
                   };
		   
		   if (file) {				   				   
				 $.ajax({
			 			url: uploadUrl ,			 		
			 			type: "POST",
			 			data: file,
			 			cache: false,
			 			processData:false,
			 			dataType: "text",
			 			headers: oHeaders,
//			 	        beforeSend: function(xhr){
//				                  xhr.setRequestHeader("X-CSRF-Token", token);
//				               },    			
			 			
							success: function(oResponse, textStatus, jqXHR) {
//								that.showMessage("File uploaded successfully", null, "Success");
								successFn.call(that);
							},
							error: function(jqXHR, textStatus, errorThrown){
								var errorMsg =jQuery(jqXHR.responseText).find('message').text().replace("RFC Error:","");
								
									if(errorMsg){
									sap.m.MessageBox.alert(errorMsg, {
										title : "Error",
										icon : sap.m.MessageBox.Icon.ERROR
									});
								}else if(textStatus==="error" && jqXHR.responseText.indexOf('/IWFND/CM_BEC/026') != -1){//unauthorize
									that.showMessage(" You Are Not Authorized To Upload The Documents");
								}else if(textStatus==="timeout") {
									that.showMessage("Connection timed out: too much data to retrieve. Please select a shorter period of time.", "Error");					
								} else {
									jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
									that.showMessage("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, "Error");
								};
							},
							complete:function(jqXHR, textStatus, errorThrown){
//								that.setBusy(false);
							}
						
						});	
		   }else{
				that.showMessage("Please upload copy of your KAUST ID" +  "Validation");
		   }
	},
	getUserFilesByKaustId:function(requestId,kaustId,SuccessCallback,completeCallback){
		var that= this;
//		this.setBusy(true);
		//http://sthcigwd1.kaust.edu.sa:8000/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '1002858975' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02 ' and DOCTYPE eq '30'
		$.ajax({
			url : "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'",			
			dataType : "json",
			contentType : "application/json",
			success : function(data, response) {
				
				var filesResult  = $.map(data.d.results,function(item){ return {
					'CRD_DATE': that.RmsDate( item.CRD_DATE ),
					'CRD_USER':item.CRD_USER,
					'FileName':item.FILENAME,
					'Url':item.URL,	
					'APPLICATION_TYPE':item.APPLICATION_TYPE,
					'UNIQUE_ID':item.UNIQUE_ID,
					'USER':item.USER,
					'EXP_DATE':that.RmsDate( item.CRD_DATE ),
					'MSG_TYPE':item.MSG_TYPE,
					'MESSAGE':item.MESSAGE
					
						} })
//					that.setBusy(false);
					SuccessCallback.call(that,filesResult);														
			},
			error : function() {
				that.showMessage("Server error happened","Warning")
			},
			complete:function(){
				completeCallback.call(that);	
			}
		});
		
	},
	getToken: function(){
		//var oDialog = this.getView().byId("BusyDialog");
	   // oDialog.open();
		  var token = null;
//		  var urlUserDetails = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail");
		  var urlUserDetails = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail"); 
		  $.ajax({  
	          url: urlUserDetails,  
	          type: "GET",  
	                dataType: 'json',
	                contentType: "application/json",
	                Accept: "application/json",
	                async: false,        
	          headers:
	          {     
	                         "X-Requested-With": "XMLHttpRequest",
	                         "Content-Type": "application/atom+xml",
	                         "DataServiceVersion": "2.0",       
	                         "X-CSRF-Token":"Fetch",  
	          },  
	          success: function(data, textStatus, XMLHttpRequest) { 
	          	//dataModel = data;
	              token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
	              },
	          error: function(data, textStatus, XMLHttpRequest)  
	          {  
	          	alert("Error message" + data.responseText );
	          }        
	          
	   });
		  //oDialog.close();
		  return token;
	},
	RmsDate:function(value){
		return value.substring(4, 6) + '/' + value.substring(6, 8)  + '/' + value.substring(0, 4) ;	 					
	 },
	 onBehalf : function(oEvent){
			
			
			var that = this;
			var checked = oEvent.getParameters().selected;
			if(checked){
				that.getView().byId('selPerson').setVisible(true);
		    	that.getView().byId("AggreeCheck").setVisible(true);
		    	that.getView().byId("AggreeLink").setVisible(true);
		    	that.getView().byId("Aggreement1").setVisible(true);
		    	that.getView().byId("AggreeCheck").setSelected(false);
			}else{
				that.getView().byId("AggreeCheck").setSelected(false);
				if(that.getView().byId('onBehalfUserTab').getVisible()){
				 sap.m.MessageBox.confirm("You are de-selecting on behalf. This will remove your selection. Would you like to continue?", {
					    title: "Confirmation", 
					    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],// default   
					    onClose: function(oAction){
					    	that.selectPerson(oAction);
					    	that.getView().byId("AggreeCheck").setVisible(false);
					    	that.getView().byId("AggreeLink").setVisible(false);
					    	that.getView().byId("Aggreement1").setVisible(true);
					    },                                  // default
					    textDirection: sap.ui.core.TextDirection.Inherit     // default
					    });
				}else{
					that.getView().byId("AggreeCheck").setVisible(false);
			    	that.getView().byId("AggreeLink").setVisible(false);
			    	that.getView().byId("Aggreement1").setVisible(true);
					that.getView().byId('selPerson').setVisible(false);
					that.getView().byId('onBehalfUserTab').setVisible(false);
				}
				
			}
		},
		onSelectPersonPress: function() {
			if (!this.oSearchUserFragment) {
				this.oSearchUserFragment = sap.ui.xmlfragment("kaust.ui.kits.approvers.fragments.UserSearch", this);
			}
			this.getView().addDependent(this.oSearchUserFragment);
			this.oSearchUserFragment.open();
		},
		onUserSearchPress: function(oEvent) {
			
			var userId = oEvent.getParameters().query;
			if(userId!=""){
				if(userId==this.getView().getModel().getData().d.results[0].kaustId){
					 sap.m.MessageBox.show("User can not select on behalf for themself", {
			              	        icon: sap.m.MessageBox.Icon.WARNING,
			              	        title: "Warning",
			              	        actions: [sap.m.MessageBox.Action.OK],
			              	      }
			              	    );
					 oEvent.getSource().setValue("");
					 return;
				}else{
			var oSearchResForm = this.oSearchUserFragment.getContent()[2];
			var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
			 
			var oUserSerchModel = new sap.ui.model.json.JSONModel();
			oUserSerchModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + userId + "',UserId='')?$format=json", null, false);
			if(oUserSerchModel.getData().d.KaustID!=""){
			this.getView().setModel(oUserSerchModel, "oUserSerchModel");
			oSearchResForm.setModel("oUserSerchModel");
			oSearchResForm.setVisible(true);
			oPickUserBtn.setEnabled(true);
			}else{
				
	            sap.m.MessageBox.show("Please enter valid KAUST ID", {
	              	        icon: sap.m.MessageBox.Icon.WARNING,
	              	        title: "Warning",
	              	        actions: [sap.m.MessageBox.Action.OK],
	              	      }
	              	    );
				}
			}
			}else{
				if( !oEvent.getParameters().clearButtonPressed){
				 sap.m.MessageBox.show("Please enter KAUST ID to search", {
		              	        icon: sap.m.MessageBox.Icon.WARNING,
		              	        title: "Warning",
		              	        actions: [sap.m.MessageBox.Action.OK],
		              	      }
		              	    );
				}
			}
		},
		onPickPress : function() {
			this.getView().byId('onBehalfUserTab').setVisible(true);
			this.getView().byId('idTabBar').setSelectedKey("Tab3");
			this.getView().byId("Aggreement1").setVisible(true);
			this.getView().byId("AggreeCheck").setVisible(true);
			this.getView().byId("AggreeLink").setVisible(true);
			this.oSearchUserFragment.close();
			var oSearchField = this.oSearchUserFragment.getContent()[1];
			var oSearchResForm = this.oSearchUserFragment.getContent()[2];
			var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
			oSearchField.setValue(null);
			oSearchResForm.setVisible(false);
			oPickUserBtn.setEnabled(false);
		
		},
		onCancelPress: function() {
			this.oSearchUserFragment.close();
			var oSearchField = this.oSearchUserFragment.getContent()[1];
			var oSearchResForm = this.oSearchUserFragment.getContent()[2];
			var oPickUserBtn = this.oSearchUserFragment.getBeginButton();
			this.getView().byId("Aggreement1").setVisible(true);
			this.getView().byId("AggreeCheck").setVisible(false);
			this.getView().byId("AggreeLink").setVisible(false);
			this.getView().byId("AggreeCheck").setSelected(false);
			oSearchField.setValue(null);
			oSearchResForm.setVisible(false);
			oPickUserBtn.setEnabled(false);
		},
		selectPerson : function(oAction){
			if(oAction=="YES"){
			this.getView().byId('selPerson').setVisible(false);
			this.getView().byId('onBehalfUserTab').setVisible(false);
			}else{
				this.getView().byId('idOnBehalf').setSelected(true);
			}
		},
	
		

/**
 * if(arraychanged.length>arrayOrg.length)
							{
							for(var k=0;k<arraychanged.length;k++)
							{
								if(arrayOrg.indexOf(arraychanged[k]) == -1)
								{
									
								
									temp.push(arraychanged[k]+":yes");
									
									
								}								
							}
						payload.DCToTemplate[j].changedText = temp.toString();	
							}
						else
							{
							for(var k=0;k<arrayOrg.length;k++)
							{
								if(arraychanged.indexOf(arrayOrg[k]) == -1)
								{
									temp.push(arrayOrg[k]+":No");
									
									
								}								
							}
							}
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaustrequestdatacenter.DataCenter
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaustrequestdatacenter.DataCenter
*/
	onAfterRendering: function() {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var data = oModel.getData().d.results[0];
//		12/11/2017 - Commented the Justification Validation Call, Will check based on Stage
//		var userID = data.userId;
//		var justificationModel = new sap.ui.model.json.JSONModel();
//		justificationModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/userJustRequestStatusSet?$filter=userId eq '"+userID+"'", null,false);
//
//		if(justificationModel.getData().d.results[0].approverStatus == 1) {
		if(data.stage === "Justification") {
		 this.getView().byId("Justification").setVisible(true);
		 this.getView().byId("RequestForm").setVisible(false);
		 this.getView().byId("submitBtn").setVisible(false);
		 this.getView().byId("approveButton").setVisible(true);
		 this.getView().byId("rejectButton").setVisible(true);
		 this.getView().byId("justifctn").setValue(data.justification);
		 this.getView().byId("requesterFileupload").setVisible(true);
		 this.getView().byId("idOnBehalf").setVisible(false);
		 this.getView().byId("selPerson").setVisible(false);
//		 this.getView().byId("justSep").setVisible(false);
			var oTUserModel = new sap.ui.model.json.JSONModel();
			oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null,false);
//			oTUserModel.attachRequestCompleted(function(oEvent) {
//				if (oEvent.getParameter("success")) {
					this.getView().setModel(oUserModel, "tempoUserModel");
					var costCenter = oTUserModel.getProperty("/d/Costcenter");

			var userData = {
					d:
					{
						results:
							[
				{
					FirstName:data.FirstName,
					LastName:data.LastName,
					KaustID : data.kaustId,
					Email: data.Email,
					Position:data.Position,
					Deptname:data.Deptname,
					Office:data.Office,
					Mobile:data.Mobile,
					Costcenter:costCenter
					
				}
			]}};
//			this.getView().getModel().getData().d.results[0]["KaustID"] = data.kaustId;
			var oUserModel =  new sap.ui.model.json.JSONModel();
			oUserModel.setData(userData);
			this.getView().byId('userInfoTab').setModel(oUserModel);
//			 this.getView().byId("idOnBehalf").setVisible(true);
		}
	 else
		 {
		 this.getView().byId("idOnBehalf").setVisible(false);
		 this.getView().byId("Justification").setVisible(false);
		 this.getView().byId("RequestForm").setVisible(true);
		 this.getView().byId("requesterFileupload").setVisible(false);
		 
		 if(data.justification)
			 {
//			 this.getView().byId("justSep").setVisible(true);
			 this.getView().byId("justificationtab").setVisible(true);
			 this.getView().byId("justifctnTab").setValue(data.justification);
			 }
		 else
			 {
//			 this.getView().byId("justSep").setVisible(true);
			 this.getView().byId("justificationtab").setVisible(false);
			 }
	if(data!=null){
				
				this.setFormData(data);
				this.disableFields();
			}
		 }
	},
	removeUploadedFile:function()
	{
		this.getView().getModel('ofileModel').setData("");
		this.getView().byId("docFileUpload").setValue("");
		this.getView().byId("uploadBtn").setVisible(false);
		this.getView().byId("fileuploadlbl").setVisible(false);
		this.getView().byId("fileLinkDisp").setVisible(false);
		 this.getView().byId("fileLinkIcon").setVisible(false);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaustrequestdatacenter.DataCenter
*/
//	onExit: function() {
//
//	}

});
    });