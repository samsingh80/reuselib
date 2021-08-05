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

	kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.itReplenish", {	

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_replenish.App
*/
	onInit: function() {

        var searchModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(searchModel,"searchModel");        
		var oModel = sap.ui.getCore().byId("app").getModel();

		var kaustId = oModel.oData.d.KaustId; 
	    this.getUserData(kaustId);
	    
//        
//		var form1 = this.getView().byId("reqDetails");
//		form1.setModel(userModel);
//		
//		var form = this.getView().byId("userInfoForm");
//		form.setModel(userModel);

	},
	
getUserData : function(kaustId){
		
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='"+kaustId+"',UserId='')");
		var form = this.getView().byId("userInfoForm");
		var dataModel = new sap.ui.model.json.JSONModel();
		var oModel = sap.ui.getCore().byId("app").getModel();
		
        $.ajax({  
            url: sUrl,  
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
            	dataModel.setData(data);
                    },
            error: function(data, textStatus, XMLHttpRequest)  
            {  
           alert("Could not get user data");
            }        
            
     });
		
		this.getView().byId("requestor").setText(oModel.oData.d.UserId);
		form.setModel(dataModel);
		
		
	},
	
	handleAction : function(evt){
 		
 		var action = evt.getSource().getText();
 		
		var oModel = sap.ui.getCore().byId("app").getModel();
 		
		var comment = this.getView().byId("commentMngr").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		var requestId = helpModel.getProperty("/requestId");
		
		var disclaimer = this.getView().byId("disclaimer2").getSelected();
		if(!disclaimer){
			sap.m.MessageBox.show(
	        		"Please accept the terms and conditions first", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
//	          	        styleClass: bCompact ? "sapUiSizeCompact" : ""
	          	      }
	          	    );
			return;
		}
		
		
		if((action=="Correct" || action=="Reject") && comment==""){
			
			sap.m.MessageBox.show(
	        		"Please add a reason for rejection", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
	          	        
	          	      }
	          	    );
		}else{
		
			var data = new Object();
			
			data["FirstName"] = oModel.oData.d.FirstName;
        	data["LastName"] = oModel.oData.d.LastName;
        	data["KaustId"] = oModel.oData.d.KaustId;
        	data["Email"] = oModel.oData.d.Email;
        	data["Position"] = oModel.oData.d.Position;
        	data["Deptname"] = oModel.oData.d.Deptname;
        	data["Costcenter"] = oModel.oData.d.Costcenter;
        	data["Office"] = oModel.oData.d.Office;
        	data["Mobile"] = oModel.oData.d.Mobile;
        	data["custodianusrid"] = oModel.oData.d.custodianusrid;
        	
        	data["UserId"] = oModel.oData.d.UserId;
        	
        	data["ReplenishName"] = oModel.oData.d.ReplenishName;
        	data["Replenishid"] = oModel.oData.d.Replenishid;
			
			if(action=="Approve"){
				data["Status"] = "012";
			}else if(action=="Correct"){
				data["Status"] = "014";
			}else if(action=="Reject"){
				data["Status"] = "011";
			}
			
			data["ServiceCode"] = "0008";
        	data["SubServiceCode"] = "0006";
			
			data["RequestId"] =requestId;
	    	data["Empnotes"] = comment;
	    	data["Wftrigger"] = "X";
	    	
	    	var obj = JSON.stringify(data);
	    	
			
			this.completeTask(taskId,action,obj);
			
		}
 },
    
    goBack : function(){
    	
    	window.history.go(-1);
    }
    
    	
    	
    	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_replenish.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_replenish.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_replenish.App
*/
//	onExit: function() {
//
//	}

});
    });