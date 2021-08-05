
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

	kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.LoanEquipment", {	

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_loanequip.App
*/
	onInit: function() {
		
		var oModel = sap.ui.getCore().byId("app").getModel();
//		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
//		var requestId = helpModel.getProperty("/requestId");		
		var form = this.getView().byId("eventInfo");
		form.setModel(oModel);
		
		var onbehalf = oModel.oData.d.Onbehalf;
   	 	if(onbehalf=="X"){
   		 this.getView().byId("onBehalf").setSelected(true);
   	    	var requestorForm = this.getView().byId("userInfoForm");
   	    	var label = new sap.m.Label({text:"Request Initiator"});
   	    	var text = new sap.m.Text().setText(oModel.oData.d.UserId);
   	    	requestorForm.addContent(label);
   	    	requestorForm.addContent(text);
   	 	}
   	 	
   	 	var startData= oModel.oData.d.Startdate;
		 var msString = startData.slice(6, 19);
		 var msInt = parseInt(msString);
		 var startDate = this.convertDateBack(msInt);
		 var start = startDate + " " + oModel.oData.d.Starttime;
		 this.getView().byId("startTime").setVisible(true).setText(start);
	 
		 var endData= oModel.oData.d.Enddate;
		 var msString = endData.slice(6, 19);
		 var msInt = parseInt(msString);
		 var endDate = this.convertDateBack(msInt);
		 var end = endDate + " " + oModel.oData.d.Endtime;
		 this.getView().byId("endTime").setVisible(true).setText(end);
   	 	
		 // devices and access. tab
    	 var devices = "";
    	 if(oModel.oData.d.Pasystem=="X"){
    		 devices = devices + "Portable PA System;";
    	 }
    	 if(oModel.oData.d.Projector=="X"){
    		 devices = devices + "Projector;";
    	 }
    	 if(oModel.oData.d.Speaker=="X"){
    		 devices = devices + "Speaker;";
    	 }
    	 if(oModel.oData.d.Screen=="X"){
    		 devices = devices + "Screen;";
    	 }
    	 if(oModel.oData.d.Clicker=="X"){
    		 devices = devices + "Clicker;";
    	 }
    	 if(oModel.oData.d.Appledviconnector=="X"){
    		 devices = devices + "Apple mini-DVI Connector;";
    	 }
    	 if(oModel.oData.d.Hdmidviconnector=="X"){
    		 devices = devices + "HDMI-DVI Connector;";
    	 }
    	 if(oModel.oData.d.Visualizer=="X"){
    		 devices = devices + "Visualizer;";
    	 }
    	 if(oModel.oData.d.Vgaconnector=="X"){
    		 devices = devices + "VGA Scaler Connector;";
    	 }
    	 
    	 this.getView().byId("avTxt").setVisible(true).setText(devices);
    	 
    	  //computer and access. 	 
    	 var computers ="";
    	 if(oModel.oData.d.Imacworkstation=="X"){
    		 computers = computers + oModel.oData.d.Quantity + " iMac workstation;";
    	 }
    	 if(oModel.oData.d.Printer=="X"){
    		 computers = computers + oModel.oData.d.Quantity1 + " Printer;";
    	 }
    	 if(oModel.oData.d.Lmacbookair=="X"){
    		 computers = computers + oModel.oData.d.Quantity2 + " Laptop MacBook Air;";
    	 }
    	 if(oModel.oData.d.Scanner=="X"){
    		 computers = computers + oModel.oData.d.Quantity3 + " Scanner;";
    	 }
    	 if(oModel.oData.d.Applemonitor=="X"){
    		 computers = computers + oModel.oData.d.Quantity4 + " Apple Monitor;";
    	 }
    	 if(oModel.oData.d.Others!=""){
    		 computers = computers + oModel.oData.d.Quantity5 + " " + oModel.oData.d.Others+";";
    	 }
    	 if(oModel.oData.d.Lmacair=="X"){
    		 computers = computers + oModel.oData.d.Quantity6 + " Laptop MacBook Pro;";
    	 }
    	 
    	 this.getView().byId("devices").setVisible(true).setText(computers);
		 
    	 if(oModel.oData.d.Reason=="Repair"){
    		 this.getView().byId("incidentLbl").setVisible(true);
	    	 this.getView().byId("incident").setVisible(true).setText(oModel.oData.d.Incireport);
    	 }
		 
//		var reason = "Loan";
		var approver = oModel.oData.d.Stage;
//		var approver = "avTeam";
//		var approver = "eucTeam";
		
		if(approver=="EUC Team Approval"){
			this.getView().byId("mngerComments").setVisible(true);
			this.getView().byId("commentTitle").setText("EUC Team Approval");
			this.getView().byId("mngrComment").setValue(oModel.oData.d.Mcomments);
		}else if(approver=="AV Team Approval"){
			this.getView().byId("commentTitle").setText("AV Team Approval");
		}
		
//		var reason = "Repair";
//		if(reason=="Repair"){
//			this.getView().byId("idIncidentReport").setVisible(true);
//		}else{
//			this.getView().byId("idIncidentReport").setVisible(false);
//		}
		
		 this.getView().byId("comment").setVisible(true).setValue(oModel.oData.d.Justification);

		var kaustId = oModel.oData.d.KaustId; 
	    this.getUserData(kaustId);

	},
	
	
	getUserData : function(kaustId){
		
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='"+kaustId+"',UserId='')");
		var form = this.getView().byId("userInfoForm");
		var dataModel = new sap.ui.model.json.JSONModel();
		
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
           alert("Error message");
            }        
            
     });
		
		
		form.setModel(dataModel);
		
		
	},
	
	handleAction : function(evt){
		
			var oModel = sap.ui.getCore().byId("app").getModel();
	 		
	 		var action = evt.getSource().getText();
	 		
			var comment = this.getView().byId("commentMngr").getValue();
			var helpModel = this.getView("App").getModel("helpModel");
			var taskId = helpModel.getProperty("/taskId");
			var requestId = helpModel.getProperty("/requestId");
			
			var approver = oModel.oData.d.Stage;
			
			if(action=="Reject" && comment==""){
				
				sap.m.MessageBox.show(
		        		"Please add a reason for rejection", {
		          	        icon: sap.m.MessageBox.Icon.ERROR,
		          	        title: "Error",
		          	        actions: [sap.m.MessageBox.Action.OK],
	//	          	        styleClass: bCompact ? "sapUiSizeCompact" : ""
		          	      }
		          	    );
			}else{
			
				var data = new Object();
				
				
				data["FirstName"] = oModel.oData.d.FirstName;
            	data["LastName"] = oModel.oData.d.LastName;
            	data["KaustId"] = oModel.oData.d.KaustId;
            	data["Email"] = oModel.oData.d.Email;
            	data["Positiontext"] = oModel.oData.d.Positiontext;
            	data["Deptname"] = oModel.oData.d.Deptname;
            	data["Costcenter"] = oModel.oData.d.Costcenter;
            	data["Office"] = oModel.oData.d.Office;
            	data["Mobile"] = oModel.oData.d.Mobile;
            	
            	data["Eventname"] = oModel.oData.d.Eventname;
            	data["Eventlocation"] = oModel.oData.d.Eventlocation;
            	data["Eventtype"] = oModel.oData.d.Eventtype;
            	
            	data["Delivery"] = oModel.oData.d.Delivery;
            	data["Startdate"] = oModel.oData.d.Startdate;
            	data["Enddate"] = oModel.oData.d.Enddate;
            	data["Starttime"] = oModel.oData.d.Starttime;
            	data["Endtime"] = oModel.oData.d.Endtime;
				
            	data["UserId"] = oModel.oData.d.UserId;
        		data["Onbehalf"] = oModel.oData.d.Onbehalf;
        		
        		data["Projector"] = oModel.oData.d.Projector;
        		data["Speaker"] = oModel.oData.d.Speaker;
        		data["Screen"] = oModel.oData.d.Screen;
        		data["Clicker"] = oModel.oData.d.Clicker;
        		data["Appledviconnector"] = oModel.oData.d.Appledviconnector;
        		data["Hdmidviconnector"] = oModel.oData.d.Hdmidviconnector;
        		data["Visualizer"] = oModel.oData.d.Visualizer;
        		data["Vgaconnector"] = oModel.oData.d.Vgaconnector;
        		
        		data["Imacworkstation"] = oModel.oData.d.Imacworkstation;
    			data["Quantity"] = oModel.oData.d.Quantity;
    			data["Printer"] = oModel.oData.d.Printer;
    			data["Quantity1"] = oModel.oData.d.Quantity1;
    			data["Lmacbookair"] = oModel.oData.d.Lmacbookair;
    			data["Quantity2"] = oModel.oData.d.Quantity2;
    			data["Scanner"] = oModel.oData.d.Scanner;
    			data["Quantity3"] = oModel.oData.d.Quantity3;
    			data["Applemonitor"] = oModel.oData.d.Applemonitor;
    			data["Quantity4"] = oModel.oData.d.Quantity4;
    			data["Lmacair"] = oModel.oData.d.Lmacair;
    			data["Quantity6"] = oModel.oData.d.Quantity6;
    			data["Others"] = oModel.oData.d.Others;
    			data["Quantity5"] = oModel.oData.d.Quantity5;
    			
    			data["Reason"] = oModel.oData.d.Reason;
    			data["Incireport"] = oModel.oData.d.Incireport;
				
				if(action=="Approve"){
					data["Status"] = "012";
				}else if(action=="Reject"){
					data["Status"] = "011";
				}
				
				data["ServiceCode"] = "0009";
            	data["SubServiceCode"] = "0013";
            	data["RequestId"] = requestId;
            	
            	if(approver=="EUC Team Approval"){
            		data["Euteamcomments"] = comment;
            	}else if(approver=="Line Manager Approval"){
    		    	data["Mcomments"] = comment;
            	}else if(approver=="AV Team Approval"){
                	data["Avteamcomments"] = comment;
            	}
            	
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
* @memberOf zui5_loanequip.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_loanequip.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_loanequip.App
*/
//	onExit: function() {
//
//	}

});
});