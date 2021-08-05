sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5approvers/util/MainController",
    "sap.m.MessageBox"
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,MainController,MessageBox) {
		"use strict";
//jQuery.sap.require("kaust.ui.kits.approvers.util.MainController");
//jQuery.sap.require("sap.m.MessageBox");

kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.VPNAccess", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_vpnaccess.App
*/
	onInit: function() {

		var oModel = sap.ui.getCore().byId("app").getModel();		
		this.getView().byId("justif").setText(oModel.oData.d.Comments);
		this.getView().byId("inputNumber").setText(oModel.oData.d.EfirstName);
		
		var kaustId = oModel.oData.d.KaustId;
		var userID = oModel.oData.d.UserId;
	    this.getUserData(kaustId);
	    this.getVpnAccessRequestorData(userID);
		
//		var sUrl = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail");
//        var userModel = new sap.ui.model.json.JSONModel(sUrl, false);
//        this.getView().setModel(userModel);
//
//		
//        var param = "MsgTeamView";
//        var param = "ITView";
//        var txtArea = this.getView().byId("comment");
//        if(param=="MsgTeamView"){
//        	txtArea.setEditable(false);
//        	this.getView().byId("approveButton").setVisible(false);
//        	this.getView().byId("rejectButton").setVisible(false);
//        	this.getView().byId("correctButton").setVisible(false);
//        	this.getView().byId("cancelButton").setVisible(false);
//        }else{
//        	txtArea.setPlaceholder("Add note (mandatory when rejecting)");
//        }
        
//		var form = this.getView().byId("userInfoForm");
//		form.setModel(userModel);
		
	},
	getDateFromJson:function(jsonDate){
		if ( jsonDate == null ||jsonDate.trim()=="" || jsonDate == "0000-00-00" )
			{
				return "";
			}
		return new Date(parseInt(jsonDate.substr(6)));
		//return datevalue.getMonth()+1 + "-" + datevalue.getDate() + "-" + datevalue.getFullYear();
	},
getUserData : function(kaustId){
		
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='"+kaustId+"',UserId='')");
		var form = this.getView().byId("OnBehalfUserInfo");
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
		
		if(dataModel.oData.d.KaustIdExpiry){				
		var expiryDate = this.getDateFromJson(dataModel.oData.d.KaustIdExpiry);
		this.getView().byId("expDate").setText(this.formateDate(expiryDate));
		}
	},
getVpnAccessRequestorData : function(userId){
		
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
	
	formateDate: function(date){
 		
 		var yyyy = date.getFullYear();
 		var mm = date.getMonth()+1;
 		var dd = date.getDate();
 		if(dd<10){
 			dd='0'+dd;
 		}
 		if(mm<10){
 			mm='0'+mm;
 		}
 		
 		var result = mm+"/"+ dd +"/"+yyyy;
 		return result; 		
 	},
	dateToYYYYmmdd : function(date){
 		
 		var yyyy = date.getFullYear();
 		var mm = date.getMonth()+1;
 		var dd = date.getDate();
 		if(dd<10){
 			dd='0'+dd;
 		}
 		if(mm<10){
 			mm='0'+mm;
 		}
 		
 		var result = yyyy+"-"+mm+"-"+dd+"T00:00:00";
// 		var result = dd+"."+mm+"."+yyyy;
 		return result;
 		
 	},
 	
 	inputChange : function(evt){
			
			var button = evt.getSource();
			if(button.getValue()){
				button.setValueState("None");
			}
			
			
		},
		
		inputChange : function(evt){
	    	
	    	var inputField = this.getView().byId("expDate");
	    	var startDate = inputField.getValue();
	    	var temp = new Date();
	 		var heute = this.convertDateBack(temp);
	 		var result = true;
	 		if(startDate != ""){
	 			var today = new Date(heute);
	 			var start = new Date(startDate);
	 			if(start<today){
	 				sap.m.MessageBox.show(
	 	            		"Expiration Date cannot be in the past", {
	 	              	        icon: sap.m.MessageBox.Icon.ERROR,
	 	              	        title: "Error",
	 	              	        actions: [sap.m.MessageBox.Action.OK],
	 	              	      }
	 	              	    );
	 				inputField.setValueState("Error");
	 				result = false;
	 			}else{
	 				inputField.setValueState("None");
	 			}
	 		}
	 		return result;
	    	
	    },
	    
	    convertDateBack : function(date){
	 		
			var time = new Date(date);
			
			var yyyy = time.getFullYear();
 		var mm = time.getMonth()+1;
 		var dd = time.getDate();
 		
 		if(dd<10){
 			dd='0'+dd;
 		}
 		if(mm<10){
 			mm='0'+mm;
 		}
 		
 		var result = mm+"/"+dd+"/"+yyyy;

 		return result;
	},
	
 
 	handleAction : function(evt){
 		
 		var action = evt.getSource().getText();
 		var oModel = sap.ui.getCore().byId("app").getModel();
 		
 		var fName = this.getView().byId("fname");
		var lName = this.getView().byId("lname");
		var kaustID = this.getView().byId("kaustID");
		var email = this.getView().byId("email");
		var pos =  this.getView().byId("pos");
		var depName = this.getView().byId("dep");
		var office = this.getView().byId("office");
		var mobile = this.getView().byId("mobile");
		var rManager= this.getView().byId("rManager");
		
		var comment = this.getView().byId("comment").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		var requestId = helpModel.getProperty("/requestId");
		var expDate = this.getView().byId("expDate");
//		var dateValue = this.getView().byId("expDate").getText();
//		if(action=="Approve" && dateValue==""){
//			sap.m.MessageBox.show(
//	        		"Date of expiration cannot be empty", {
//	          	        icon: sap.m.MessageBox.Icon.ERROR,
//	          	        title: "Error",
//	          	        actions: [sap.m.MessageBox.Action.OK],
//	          	      }
//	          	    );
//			this.getView().byId("expDate").setValueState("Error");
//			return;
//		}
//		var expDate = "";
//		if(dateValue!=""){
//			 expDate = this.dateToYYYYmmdd(new Date(dateValue));
//		}
		
		if(action=="Reject" && comment==""){
			
			sap.m.MessageBox.show(
	        		"Please add a reason for rejection", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
	          	      }
	          	    );
		}else{
		
			var data = new Object();
			
			data["FirstName"] = fName.getText();
        	data["LastName"] = lName.getText();
        	data["KaustId"] = kaustID.getText();
        	data["Email"] = email.getText();
        	data["Position"] = pos.getText();
        	data["Deptname"] = depName.getText();
        	data["Office"] = office.getText();
        	data["Mobile"] = mobile.getText();
        	data["RManager"] = rManager.getText();
        	
			if(action=="Approve"){
				data["Status"] = "012";
			}else if(action=="Correct"){
				data["Status"] = "014";
			}else{
				data["Status"] = "011";
			}
			
			data["EfirstName"] = oModel.oData.d.EfirstName;
			data["RequestId"] = requestId;
	    	data["Comments"] = comment;
	    	//data["Vpnexpdate"] = expDate.getText();
        	data["ServiceCode"] = "0011";
        	data["SubServiceCode"] = "0024";
	    	data["Wftrigger"] = "X";
	    	
	    	var obj = JSON.stringify(data);
	    	
			
			this.completeTask(taskId,action,obj);
			
		}
 }
 
 

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_vpnaccess.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_vpnaccess.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_vpnaccess.App
*/
//	onExit: function() {
//
//	}

});
    });