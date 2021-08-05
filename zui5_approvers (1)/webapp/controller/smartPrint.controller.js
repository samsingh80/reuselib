sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap.m.MessageBox",
     "com/kaust/zui5approvers/util/MainController",

    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,MessageBox,MainController) {
		"use strict";
//jQuery.sap.require("kaust.ui.kits.approvers.util.MainController");
//jQuery.sap.require("sap.m.MessageBox");

kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.smartPrint", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_printerreg.App
*/
	onInit: function() {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var userID = oModel.oData.d.UserId;
		this.getSmartPrintRequestorData(userID);
	},
	
getSmartPrintRequestorData : function(userId){
		
		var _that = this;
		var oView =_that.getView();
		
		var serviceUrl = _that.getServiceUrl("/kaust.com~sbf~bpm~java~restservices/requestDetails/RequestType?UserId="+userId);
		//
		$.ajax({
	        url: serviceUrl,
	        async: "false",
	        dataType: "jsonp",
	        contentType: "application/json",
	        jsonpCallback: 'UserId',   
	        headers:
	        {     
	                       "X-Requested-With": "XMLHttpRequest",
	                       "Content-Type": "application/atom+xml",
	                       "DataServiceVersion": "2.0",       
	                       "X-CSRF-Token":"Fetch",  
	        },  
	        // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
	        success: function( responseData ) {            	            	
	        	//console.log( response );
	        	responseData.UserId = userId;
	        	
	        	oView.byId("reqUserId").setText(responseData.UserId);
	        	oView.byId("reqfname").setText(responseData.firstName);
	        	oView.byId("reqlname").setText(responseData.lastName);
	        	oView.byId("reqkaustID").setText(responseData.kaustId);
	        	oView.byId("reqemail").setText(responseData.email);
	        	oView.byId("reqrManager").setText(responseData.managerId);
			  	
	           }, error: function(jqXHR, textStatus, errorThrown){
	        	   debugger;
	        	   alert('Unexpected error happened');
	           }
		});
		
	}, 
handleAction : function(evt){
 		
 		var action = evt.getSource().getText();
 		
		var comment = this.getView().byId("comment").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		var requestId = helpModel.getProperty("/requestId");
		
		if(action=="Reject" && comment==""){
			
			sap.m.MessageBox.show(
	        		"Please add a reason for rejection", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
	          	      }
	          	    );
		}else{
			
	    	var firstName = this.getView().byId("fname");
	    	var lastName = this.getView().byId("lname");
	    	var middleName = this.getView().byId("mname");
	    	var email = this.getView().byId("email");
	    	var manager = this.getView().byId("manager");
			
			var data = new Object();
			
			if(action=="Approve"){
				data["Status"] = "012";
			}else{
				data["Status"] = "011";
			}
			
        	data["FirstName"] = firstName.getText();
        	data["LastName"] = lastName.getText();
        	data["MiddleName"] = middleName.getText();
        	data["Email"] = email.getText();
        	data["RManager"] = manager.getText();
        	
        	data["ServiceCode"] = "0008";
        	data["SubServiceCode"] = "0010";
        	data["Stage"] = "Line Manager Approval";
			
	    	data["Comments"] = comment;
	    	data["Wftrigger"] = "X";
	    	
	    	var obj = JSON.stringify(data);
	    	
			
			this.completeTask(taskId,action,obj,requestId);
			
		}
 },
	
 	backToPrevious : function(){
 		
 		window.history.go(-1);
 		
 	}
    

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_printerreg.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_printerreg.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_printerreg.App
*/
//	onExit: function() {
//
//	}

});
    });