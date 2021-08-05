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
kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.VpnRequestForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf vpn_access.VpnRequestForm
*/
	onInit: function() {
		//Andrea
		var oInternalModel=new sap.ui.model.json.JSONModel();
		this.getView().setModel(oInternalModel, "oInternalModel");
		oInternalModel.setProperty("/enabled",false);
		oInternalModel.setProperty("/visible",false);
		oInternalModel.setProperty("/visible1",true);
		//Andrea
		
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var data = oModel.getData().d.results[0];
		if(data!=null){
			if(data.vpn == "X"){
				this.getView().byId("vpnType").setSelectedIndex(0);
			}else{
				this.getView().byId("vpnType").setSelectedIndex(1);
			}
			/*this.getView().byId('name').setValue(data.name);
			this.getView().byId('email').setValue(data.email);
			this.getView().byId('kaustId').setValue(data.KaustId);
			this.getView().byId('telephone').setValue(data.office);
			this.getView().byId('mobile').setValue(data.mobile);*/
			this.getView().byId('hostIpId').setValue(data.eIPAddress);
			this.getView().byId('hostIpId').setTooltip(data.eIPAddress);
			if(data.VPNExpiryDate != null){
				var expiryDate = data.VPNExpiryDate;
				var startIndex = expiryDate.indexOf("(");
				var endIndex = expiryDate.indexOf(")");
				expiryDate=expiryDate.substring(startIndex+1,endIndex)
				expiryDate = new Date(parseInt(expiryDate)).toString();
				expiryDate = expiryDate.split(" ");
							
				
				if(data.request_type=="0001" || data.request_type=="1") {
					oInternalModel.setProperty("/visible",false);//andrea
					oInternalModel.setProperty("/visible1",true);//andrea
					this.getView().byId('expDateNew').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
				} else {
					oInternalModel.setProperty("/visible",true);//andrea
					oInternalModel.setProperty("/visible1",false);//andrea
					this.getView().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
				}
//				this.getView().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
			}
			this.getView().byId('justification').setValue(data.Justification);
			this.getView().byId('justification').setTooltip(data.Justification);
			if(data.request_type=="0001" || data.request_type=="1"){
				this.getView().byId('eFname').setValue(data.eFirstName);
				this.getView().byId('eMname').setValue(data.eMiddleName);
				this.getView().byId('eLname').setValue(data.eLastName);
				this.getView().byId('eEmail').setValue(data.eMail);

				this.getView().byId('eFname').setTooltip(data.eFirstName);
				this.getView().byId('eMname').setTooltip(data.eMiddleName);
				this.getView().byId('eLname').setTooltip(data.eLastName);
				this.getView().byId('eEmail').setTooltip(data.eMail);
				//andrea
				var dob = data.dobPass;
				var startIndex1 = dob.indexOf("(");
				var endIndex1 = dob.indexOf(")");
				dob=dob.substring(startIndex1+1,endIndex1)
				dob = new Date(parseInt(dob)).toString();
				dob = dob.split(" ");
				this.getView().byId('dob').setValue(dob[1]+" "+dob[2]+" "+dob[3]);
				//andrea
				
				
				//this.getView().byId('adAccount').setVisible(false);
				if(data.Stage == "Messaging Team"){
					this.getView().byId('eFname').setEnabled(true);
					this.getView().byId('eMname').setEnabled(true);
					this.getView().byId('eLname').setEnabled(true);
					//this.getView().byId('hostIpId').setEnabled(true);
					this.getView().byId('UIDSection').setVisible(true);
					//this.getView().byId('suggestedUID').setText(data.suggestedUserId);
					suggestedUID = this.UID_creation();
				}
			}else{
				/*if(data.Stage == "Messaging Team"){
					this.getView().byId('hostIpId').setEnabled(true);
				}*/
//				this.getView().byId('eFname').setVisible(false);
//				this.getView().byId('eMname').setVisible(false);
//				this.getView().byId('eLname').setVisible(false);
				this.getView().byId('newType').setVisible(false);
				this.getView().byId('renewType').setVisible(true);
				this.getView().byId('adAccount').setValue(data.adId);
				this.getView().byId('adAccount').setTooltip(data.adId);
			}
			
			this.getView().byId('newOrRenew').setValue(data.reqTypeDesc);
			
			//For reading the data
			var url ="/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId + "' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
			var oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData(url, null, false);
			if(oFileModel.getData().d.results[0].URL != ""){
				this.getView().byId('fileSection').setVisible(true);
				this.getView().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
			}
		}
		
		// User Detail Model
		var that = this;
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.KaustId + "',UserId='')?$format=json", null, true);
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
	
	//INCTURE (andrea)
	
	validateUser : function(evt){
		var value=evt.getSource().getValue().toLowerCase();		//andrea
		var a = value.slice(0,2);			
		var that = this;
		var v=value.split("_");
		
		var oRegEx = /[^a-zA-Z0-9]/; // INCTURE [16 May 2018] (Darshna) - Fix for the VPN suggested user ID issue
		var input=this.getView().byId("suggestedUID");
		
		if(a!="x_"||a===""||v.length>2) {
			input.setValueState("Error");
			input.setValue("");
			input.removeStyleClass("sapMInputBaseMessage");
			sap.m.MessageBox.show(
         		"User ID should start with 'X_' and it should contain only one '_'", {
         	        icon: sap.m.MessageBox.Icon.ERROR,
         	        title: "Error",
         	        actions: [sap.m.MessageBox.Action.OK],
         	      });
			
		} else if(v[1] && v[1].match(oRegEx)) {
			input.setValueState("Error");
			input.setValue("");
			input.removeStyleClass("sapMInputBaseMessage");
			sap.m.MessageBox.show(
         		"User ID should not contain any special character and it should start with 'X_'", {
         	        icon: sap.m.MessageBox.Icon.ERROR,
         	        title: "Error",
         	        actions: [sap.m.MessageBox.Action.OK],
         	      });
			
		} else if (!v[1]) {
			input.setValueState("Error");
			input.setValue("");
			input.removeStyleClass("sapMInputBaseMessage");
			sap.m.MessageBox.show(
         		"User ID cannot be of only two characters. Please enter a valid User ID", {
         	        icon: sap.m.MessageBox.Icon.ERROR,
         	        title: "Error",
         	        actions: [sap.m.MessageBox.Action.OK],
         	      });
			
		} else {		
	    	var busyDialog = new sap.m.BusyDialog();
	    	busyDialog.open();
	    	var getADUrl = this.getADUrl();
	    	var url = getADUrl + 'GetUserInfoByUserName?userName=';
//	    	var url = 'http://devvms.kaust.edu.sa:8079/api/ad/GetUserInfoByUserName?userName=';
	    	var servUrl = url + value;
	    	$.ajax({
	    	      url: servUrl,
	    	      async: "false",
	    	      type: "GET",
	    	      dataType: "jsonp",
	    	      contentType: "application/json",
	    	      jsonpCallback: "a",
	    	      // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
	    	      success: function(data) {
	    	    	  busyDialog.close();
	                  var inputField = that.getView().byId("suggestedUID");
	                   if(data){
	                	   inputField.setValue("");
	            	   		inputField.setValueState("Error");
	            	   		inputField.removeStyleClass("sapMInputBaseMessage");	                	   
	                	   		                		  
	                   }else{
	                	   inputField.setValueState("Success");
	                	  // inputField.setValue(data.UserName);
		                	  //inputField.setValueState("Error").setValueStateText("Please enter a valid x_account");
	                   }
	    	      },
	    	   error: function(data) {
	    		   that.getView().byId("suggestedUID").setValue("");
	    		   jQuery.sap.log.debug("error: " + data);
	    		   busyDialog.close();
                   sap.m.MessageBox.show(
                     		"Not authorised for AD service, please contact your administrator", {
                     	        icon: sap.m.MessageBox.Icon.ERROR,
                     	        title: "Error",
                     	        actions: [sap.m.MessageBox.Action.OK],
                     	      });
	    		  // that.getView().byId("adAccount").setValue("");
	    	   }
	    	  });
		}
	},
		//andrea
	/*	To make the suggested user id field enabled or disabled Andrea
	*/	
		suggestUserId: function(oEvent){
			var sel=this.getView().byId("checkbox").getSelected();
			var oModel = sap.ui.getCore().byId("app").getModel();
			var requestData = oModel.getData().d.results[0];
			var userId=this.getView().byId("suggestedUID").getValue();
			var oInternalModel=this.getView().getModel("oInternalModel");	
			var suggUID=oInternalModel.oData.suggUID;
			if(sel===true){
				oInternalModel.setProperty("/enabled",true);
				oModel.oData.d.results["0"].isSugUserChng="X";
				
			}
			else{
				oInternalModel.setProperty("/enabled",false);
				oModel.oData.d.results["0"].isSugUserChng="";
				if(userId===""){
					this.getView().byId('suggestedUID').setValue(suggUID);
					requestData["provisionedUserId"]=suggUID;
					oInternalModel.setProperty("/enabled",false);
				}
			}
				
		},
	

handleAction : function(evt){
		var oModel = sap.ui.getCore().byId("app").getModel();
 		var action = evt.getSource().getText();
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
 		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		//var comment = this.getView().byId("comment").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		
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
				requestData["status"] = "012";
				requestData["lastTaskStatus"] = "Approve";
			}else if(action=="Correct"){
				requestData["status"] = "014";
			}else if(action=="Reject"){
				requestData["status"] = "011";
				requestData["lastTaskStatus"] = "Reject"
			}
			
			var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
			oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
			var loggedInUser = "", loggedInUserName="";
			if(oLoggedInUserModel.getData().d){
				loggedInUser = oLoggedInUserModel.getData().d.results[0].KaustID;
				loggedInUserName = oLoggedInUserModel.getData().d.results[0].FirstName;
			}
			
			requestData.Wftrigger= "X";
			if(requestData.Stage=="Info Sec Manager"){
				requestData["secManagerComments"] = mngrComment;
				requestData["infoSecManager"] = loggedInUserName;
				requestData["comments"]=mngrComment;
				requestData["t_role"] = "Info Sec Manager";
				requestData["t_name"] = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData["t_kaustid"] = oLoggedInUserModel.getData().d.results[0].KaustID;
			} else if(requestData.Stage == "Messaging Team") {
					var hostId = this.getView().byId('hostIpId').getValue().trim();
					var newOrRenew=oModel.oData.d.results["0"].request_type;//andrea
//					if(newOrRenew=="1"){//andrea
//					if(hostId == "" || hostId == null){
//						 sap.m.MessageBox.show("Please enter host IP addresses", {
//						        icon: sap.m.MessageBox.Icon.WARNING,
//						        title: "Warning",
//						        actions: [sap.m.MessageBox.Action.OK],
//						      });
//						 return false;
//					}	else if	(!this.ValidateIPaddress(hostId)){
//							return false;
//					}
//				}
					requestData["msgTeam"] = loggedInUserName;
					requestData["msgTeamComments"] = mngrComment;
					requestData["comments"]=mngrComment;
					requestData["t_role"] = "Messaging Team";
					requestData["t_name"] = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
					requestData["t_kaustid"] = oLoggedInUserModel.getData().d.results[0].KaustID;
					if(requestData.request_type == "0001" || requestData.request_type =="1"){
						var sFname = this.getView().byId('eFname').getValue().trim();
						var mName = this.getView().byId('eMname').getValue().trim();
						var sLname = this.getView().byId('eLname').getValue().trim();
						var oRegEx = /^[a-zA-Z]+$/;
						if(!sFname) {
							sap.m.MessageBox.show("Please provide First Name", {
						        icon: sap.m.MessageBox.Icon.ERROR,
						        title: "Error",
						        actions: [sap.m.MessageBox.Action.OK],
						      });
							return false;
						} else if (!oRegEx.test(sFname)) {
							sap.m.MessageBox.show("Please provide a valid First Name", {
			          	        icon: sap.m.MessageBox.Icon.ERROR,
			          	        title: "Error",
			          	        actions: [sap.m.MessageBox.Action.OK],
			          	      });
							return false;
						}
						if (mName && !oRegEx.test(mName)) {
							sap.m.MessageBox.show("Please provide a valid Middle Name", {
			          	        icon: sap.m.MessageBox.Icon.ERROR,
			          	        title: "Error",
			          	        actions: [sap.m.MessageBox.Action.OK],
			          	      });
							return false;
						}
						if(!sLname) {
							sap.m.MessageBox.show("Please provide Last Name", {
						        icon: sap.m.MessageBox.Icon.ERROR,
						        title: "Error",
						        actions: [sap.m.MessageBox.Action.OK],
						      });
							return false;
						}  else if (!oRegEx.test(sLname)) {
							sap.m.MessageBox.show("Please provide a valid Last Name", {
			          	        icon: sap.m.MessageBox.Icon.ERROR,
			          	        title: "Error",
			          	        actions: [sap.m.MessageBox.Action.OK],
			          	      });
							return false;
						}
						requestData["suggestedUserId"] = suggestedUID;
						
						// Incture - 1/2/2017: Provisioned User ID not to be saved in case of rejection
						if(action=="Reject"){ 
							requestData["provisionedUserId"] = "";
							requestData["isSugUserChng"]="";
						} else {
							requestData["provisionedUserId"] = this.getView().byId('suggestedUID').getValue();//Andrea
						}
						// requestData["provisionedUserId"] = this.getView().byId('suggestedUID').getText();
						
						requestData["eFirstName"] = sFname;
						requestData["eMiddleName"] = mName;
						requestData["eLastName"] = sLname;
					}
					requestData["eIPAddress"] = this.getView().byId('hostIpId').getValue().trim();
				//	requestData["Stage"] = requestData.Stage;
				}
			/*else if(requestData.stage=="ITNC Agent Approval"){
				if(this.getView().byId('selectedNwEngr').getSelectedKey()!=""){
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
				requestData["itncAgentComment"] = mngrComment;
				requestData["itncAgentApprover"] = loggedInUserName;
			}else if(requestData.stage=="Network Engineer Approval"){																	//this.getView().byId('nwFeedBack').getVisible()
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
			}*/
			if(requestData.VPNExpiryDate == null){
			delete requestData.VPNExpiryDate;
			}
			delete requestData.VPNRenewalDate;
			delete requestData.timeStamp;
			delete requestData.seqNum;
			if(requestData.request_type == 2)
			{
				requestData.provisionedUserId = requestData.adId;
			}
			if(action=="Reject"){ 
				requestData["provisionedUserId"] = "";
			}
	    	var obj = JSON.stringify(requestData);
			
//			this.completeTask(taskId,action,obj,requestId);
	    	this.completeKITSTask(taskId,action,obj,requestId);
	    	
		}
 },	
 
 ValidateIPaddress: function (ip) {  
		
		// var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  
		var ipformat = /^((((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\,?)*)-?)*$/;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var newOrRenew=oModel.oData.d.results["0"].request_type;//andrea
		if(newOrRenew=="1")	{
		if(ipformat.test(ip)){  
			 return true;  
		 }else  
		 {  
			 sap.m.MessageBox.show("Please enter valid IP addresses",{
	 	        icon: sap.m.MessageBox.Icon.ERROR,
	    	        title: "Error",
	    	        actions: [sap.m.MessageBox.Action.OK],
	    	      });
			 return false;  
		 } 
		}
		 },  
 
 UID_creation : function(oEvent){
	 	if (oEvent) {
	 		var sName = oEvent.getSource().getValue().trim();
			sName = sName.charAt(0).toUpperCase()+ sName.slice(1);
			oEvent.getSource().setValue(sName);
			if (sName) {
				if (!this.getNameValidation()) {
					return;
				}
			}
	 	}
		var uid="x_";
		var fName = this.getView().byId('eFname').getValue().trim();
		var mName = this.getView().byId('eMname').getValue().trim();
		var lName = this.getView().byId('eLname').getValue().trim();
		
// Start - remove Al and El from last name - SJAYAB - 26th April 2020	
//		if(lName != "" && lName.length >= 2)
//		{
//			if(lName.substring(0,2).toUpperCase() == "AL" || lName.substring(0,2).toUpperCase() == "EL")
//			{
//				lName  = lName.substring(2);
//			}
//		}
// End - remove Al and El from last name - SJAYAB - 26th April 2020
		
		if(lName!=""){
			if(lName.length > 6){
			uid = uid+lName.substring(0,6);
			}else{
				uid = uid+lName.substring(0,lName.length);
			}
		}else{
			this.getView().byId('UIDSection').setVisible(false);
			return;
		}
		
		if(fName != ""){
			uid = uid+fName.substring(0,1);
			}else{
				this.getView().byId('UIDSection').setVisible(false);
				return;
			}
		if(mName != ""){
			uid = uid+mName.substring(0,1);
			}
		uid = uid.toLowerCase();
		var busyDialog = new sap.m.BusyDialog();
		//busyDialog.open();
		var flag = this.validateUID(uid);
	//	var flag = false;
		if(flag){
			this.getView().byId('UIDSection').setVisible(false);
			var uid1 = uid+"0a";
			var flag1 = this.validateUID(uid1);
			if(flag1){
				this.getView().byId('UIDSection').setVisible(false);
				var uid2 = uid+"0b";
				var flag2 = this.validateUID(uid2);
				if(flag2){
					this.getView().byId('UIDSection').setVisible(false);
					// show the user id existing in AD for all combinations
				}else{
					this.getView().byId('UIDSection').setVisible(true);
					this.getView().byId('suggestedUID').setValue(uid2);//Andrea
				}
			}else{
				this.getView().byId('UIDSection').setVisible(true);
				this.getView().byId('suggestedUID').setValue(uid1);//Andrea
			}
		}else{
			this.getView().byId('UIDSection').setVisible(true);
			this.getView().byId('suggestedUID').setValue(uid);//Andrea
		}
		//busyDialog.close();
		this.getView().getModel("oInternalModel").setProperty("/suggUID",uid);
		return uid;	
	},
	
	/**Name Validations*/
	getNameValidation: function() {
		var oRegEx = /^[a-zA-Z]+$/;
		var fName = this.getView().byId('eFname').getValue();
		var mName = this.getView().byId('eMname').getValue();
		var lName = this.getView().byId('eLname').getValue();
		var aErrorMsg = [];
		if (fName && !oRegEx.test(fName)) {
			aErrorMsg.push("First Name");
		}
		if (mName && !oRegEx.test(mName)) {
			aErrorMsg.push("Middle Name")
		}
		if (lName && !oRegEx.test(lName)) {
			aErrorMsg.push("Last Name")
		}
		if (aErrorMsg.length > 0) {
			sap.m.MessageBox.show("Please enter a valid " + aErrorMsg.join(", "), {
	  	        icon: sap.m.MessageBox.Icon.ERROR,
	  	        title: "Error",
	  	        actions: [sap.m.MessageBox.Action.OK],
	  	      });
			return false;
		}
		return true;
	},
	
	validateUID : function(uid){
		var that = this;
    	var getADUrl = this.getADUrl();
    	var url = getADUrl + 'GetUserInfoByUserName?userName=';
//    	var url = 'http://devvms.kaust.edu.sa:8079/api/ad/GetUserInfoByUserName?userName=';
    	var servUrl = url + uid;
    	
    	var oUIDLookupModel = new sap.ui.model.json.JSONModel();
    	oUIDLookupModel.loadData(servUrl, null, false);
    	if(oUIDLookupModel.getData()!=null){
    		return true;
    	}else{
    		return false;
    	}	
    	/*oUIDLookupModel.attachRequestCompleted(function(oEvent) {
			if (oEvent.getParameter("success")) {
				if(oUIDLookupModel.getData()!=null){
		    		return true;
		    	}else{
		    		return false;
		    	}	
			}
		});
    	oUIDLookupModel.attachRequestFailed(function(oEvent) {
    		return false;
		});*/
	},
	
	getADUrl:function() {
		  var host = window.location.hostname;
		  var port = window.location.port;
		  
		  if (host == "localhost") {
		   //return "http://devvms.kaust.edu.sa:8079/api/ad/";
			  return "https://ws.kaust.edu.sa/api/activedirectory/";  // given by KAUST second time
		  }
		  if (host.indexOf("kaust.edu.sa") == -1 ) {
		   host = host + ".kaust.edu.sa";
		  } 
		  switch (port){
		    case '8005':
		    // return "http://devvms.kaust.edu.sa:8079/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
		     break;
		    case '8006':
		//	 return "https://devvms.kaust.edu.sa:8079/api/ad/";
		//     return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
			 break;
		    case '8000':
		//     return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
		     break;
		    case '8001':
		//	 return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
			 break;
		    case '8002':
		 //    return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
		     break;
		    case '8003':
		//	     return "https://ws.kaust.edu.sa/api/ad/";
		    	return "https://ws.kaust.edu.sa/api/activedirectory/";
			     break;
		  }
		  return;
		 },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf vpn_access.VpnRequestForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf vpn_access.VpnRequestForm
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf vpn_access.VpnRequestForm
*/
//	onExit: function() {
//
//	}

});
    });