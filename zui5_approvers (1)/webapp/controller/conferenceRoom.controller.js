sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/kaust/zui5approvers/util/formatter"
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,formatter) {
		"use strict";

//jQuery.sap.require("kaust.ui.kits.approvers.util.formatter");


kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.conferenceRoom", {		

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_copyright.App
*/
	onInit: function() {		
//		var sUrl = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail");
//        var userModel = new sap.ui.model.json.JSONModel();
//        this.getView().setModel(userModel);
//        
//        var searchModel = new sap.ui.model.json.JSONModel();
//        this.getView().setModel(searchModel,"searchModel");
//
//		var form = this.getView().byId("userInfoForm");
//		form.setModel(userModel);
		//to add the field for AV StandBY Support Andrea(Incture)
		oView=this.getView();
	    //var brmURL="https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant"; 
		var  brmURL=this.getBRMUrl();
		
		$.ajax({
		      url : brmURL,
		      async : "false",
		      dataType : "jsonp",
		      contentType : "application/json",
		      jsonpCallback :"AV_STAND_BY_SUPPORT_CHARGES",
		      // Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
		      success : function(response) {
		        var sarValue=response.value;
		    	var text="(Charges "+sarValue+ " SAR/hour will be applied)";
		    	oView.byId("charges").setText(text);
		      },
		      error : function() {
		        
		      }
		    });
		var oModel = sap.ui.getCore().byId("app").getModel();
		var oModelData = oModel.getProperty("/d/results/0");
		 //Change the text from AV Support to AV Support only according to the selection Incture(Andrea)
	    var avCheck=oModelData.Avsupport;
	    var videoCheck=oModelData.Videowebconf;
	    var webex=oModelData.Webex ;
	    var conf=oModelData.Confrecord;
	    if(avCheck==="X"){
	    	if(videoCheck === "X" || webex === "X" || conf ==="X"){
	    		//oView.byId("avSupport").setText("AV Support");
	    		this.getView().byId("avSupport").setSelected(false);
	    		this.getView().byId("avFilter").setVisible(false);
	    	}
	    	else{
	    		//oView.byId("avSupport").setText("AV Support only");
	    		this.getView().byId("avSupport").setSelected(true);
	    		this.getView().byId("avFilter").setVisible(true);
	    	}
	    }
	    // A
		//to add the field for AV StandBY Support Andrea(Incture)
	    var standBy=oModelData.isAvStandbyRequired;
	    if(standBy==="X"){
	    	 this.getView().byId("AvStandby").setSelectedIndex(0);
	    	 this.getView().byId("charges").setVisible(true);
	    }
	    else{
	    	this.getView().byId("AvStandby").setSelectedIndex(1);
	    	this.getView().byId("charges").setVisible(false);
	    }
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		
		var form = this.getView().byId("externForm");
		form.setModel(oModel);
		
		// create a Model for the table in the Tab Video and Web Conf
        var webConfModel = new sap.ui.model.json.JSONModel({ 	
			"WebConf" : []
		});
		
		this.getView().setModel(webConfModel,"webConfModel");
		var oTab = this.getView().byId("videoWebTab");
		oTab.setModel(webConfModel);
		
	// create a Model for the table in the Tab Webex Conference
		var webExModel = new sap.ui.model.json.JSONModel({ 
			"webExPart" : []
		});
		
		this.getView().setModel(webExModel,"webExModel");
		var oTabWebEx = this.getView().byId("webExTab");
		oTabWebEx.setModel(webExModel);
		
		var location = oModelData.EventLocation;
		if (location=="Conference Room"){
			
			this.getView().byId("roomInfoToolbar").setVisible(true);
			this.getView().byId("roomInfoROmode").setVisible(true);
			this.getView().byId("roomInfoROmode").setModel(oModel);
			if(oModelData.Foodservices=="Y"){
				this.getView().byId("foodServ").setSelected(true);
			}
			if(oModelData.Recording=="Y"){
				this.getView().byId("record").setSelected(true);
			}
			if(oModelData.Presentation=="Y"){
				this.getView().byId("pressFac").setSelected(true);
			}
			
			}
		
		var start = oModelData.Ldate;
		var msString = start.slice(6, 19);
		var msInt = parseInt(msString);
		var startDate = this.convertDateBack(msInt);
      	this.getView().byId("inputDate").setValue(startDate);
		
		if(oModelData.Adevent=="X"){
			this.getView().byId("dayEvent").setSelected(true);
			this.getView().byId("inputStartTime").setVisible(false);
			this.getView().byId("startTimeLabel").setVisible(false);
			this.getView().byId("endTimeLabel").setVisible(false);
			this.getView().byId("inputEndTime").setVisible(false);
		}
		if(oModelData.Ishost==""){				    	
			this.getHostData(oModelData.Hostuserid);
			this.getView().byId("hostLbl").setVisible(true);
			this.getView().byId("hostName").setVisible(true);
			this.getView().byId("hostName").setText(oModelData.HostUserName);
		}
		
		if(oModelData.Wboard=="X"){
			this.getView().byId("wBoard").setSelected(true);
		}
		if(oModelData.Flipchart=="X"){
			this.getView().byId("chart").setSelected(true);
		}
		if(oModelData.Others!=""){
			this.getView().byId("others").setSelected(true);
			this.getView().byId("otherItems").setText(oModelData.Others);
			this.getView().byId("otherItems").setVisible(true);
		}
//Reccurence		
//		this.getView().byId("recurr").setVisible(false);
		if(oModelData.Rdevent=="X"){
			this.getView().byId("reccurBox").setVisible(true);
			this.getView().byId("pattLbl").setVisible(true);
			this.getView().byId("reccPattern").setVisible(true);
			this.getView().byId("reccRangeLbl").setVisible(true);
			var range = oModelData.Rstartdate;
			var msString = range.slice(6, 19);
 			var msInt = parseInt(msString);
	        var rangeStartDate = this.convertDateBack(msInt);
	        var rangeEnd = oModelData.Renddate;
			var msString = rangeEnd.slice(6, 19);
 			var msInt = parseInt(msString);
	        var rangeEndDate = this.convertDateBack(msInt);
	        
			this.getView().byId("reccRange").setVisible(true).setText(rangeStartDate + "-" + rangeEndDate);
			if(oModelData.Daily=="X"){
				this.getView().byId("reccPattern").setText("Daily");
			}
			if(oModelData.Weekly=="X"){
				this.getView().byId("reccPattern").setText("Weekly");
				this.getView().byId("weeklyRecurLbl").setVisible(true);
				var reccurDays = "";
				if(oModelData.Sunday=="X"){
					reccurDays = reccurDays + "Sunday;";
				}
				if(oModelData.Monday=="X"){
					reccurDays = reccurDays + "Monday;";
				}
				if(oModelData.Tuesday=="X"){
					reccurDays = reccurDays + "Tuesday;";
				}
				if(oModelData.Wednesday=="X"){
					reccurDays = reccurDays + "Wednesday;";
				}
				if(oModelData.Thursday=="X"){
					reccurDays = reccurDays + "Thursday;";
				}
				if(oModelData.Friday=="X"){
					reccurDays = reccurDays + "Friday;";
				}
				if(oModelData.Saturday=="X"){
					reccurDays = reccurDays + "Saturday;";
				}
				
				
				this.getView().byId("weeklyReccur").setVisible(true).setText(reccurDays);
				
			}
			if(oModelData.Monthly=="X"){
				this.getView().byId("reccPattern").setText("Monthly");
			}
			
			
		}
		if(oModelData.comments!=""){
			this.getView().byId("comment").setValue(oModelData.comments);
		}
		
		
		//Av Support Tab		
		if(oModelData.Avsupport=="X"){
			this.getView().byId("avFilter").setVisible(true);
			this.getView().byId("avSupport").setSelected(true);
			if(videoCheck === "X" || webex === "X" || conf ==="X"){
		  		//sap.ui.getCore().byId("avSupport").setText("AV Support");
		  		this.getView().byId("avSupport").setSelected(false);
		  		this.getView().byId("avFilter").setVisible(false);
		  		
		  	}
			
			if(oModelData.Laptop=="X"){
				this.getView().byId("laptop").setSelected(true);
				this.getView().byId("laptop1").setSelected(true);
		        this.getView().byId("laptop2").setSelected(true);
		        this.getView().byId("laptop3").setSelected(true);
			}
			if(oModelData.Clicker=="X"){
				this.getView().byId("clicker").setSelected(true);
				this.getView().byId("clicker1").setSelected(true);
		        this.getView().byId("clicker2").setSelected(true);
		        this.getView().byId("clicker3").setSelected(true);
			}
			if(oModelData.Adapter=="X"){
				this.getView().byId("adapter").setSelected(true);
				this.getView().byId("adapter1").setSelected(true);
		        this.getView().byId("adapter2").setSelected(true);
		        this.getView().byId("adapter3").setSelected(true);
			}
			if(oModelData.Mphone=="X"){
				this.getView().byId("mic").setSelected(true);
				 this.getView().byId("mic1").setSelected(true);
			     this.getView().byId("mic2").setSelected(true);
			     this.getView().byId("mic3").setSelected(true);
			}
			if(oModelData.Speakers=="X"){
				this.getView().byId("speakers").setSelected(true);
				this.getView().byId("speakers1").setSelected(true);
		        this.getView().byId("speakers2").setSelected(true);
		        this.getView().byId("speakers3").setSelected(true);
			}
			if(oModelData.Projector=="X"){
				this.getView().byId("projector").setSelected(true);
				 this.getView().byId("projector1").setSelected(true);
			      this.getView().byId("projector2").setSelected(true);
			      this.getView().byId("projector3").setSelected(true);
			}
			if(oModelData.Monitor=="X"){
				this.getView().byId("monitor").setSelected(true);
				this.getView().byId("monitor1").setSelected(true);
		        this.getView().byId("monitor2").setSelected(true);
		        this.getView().byId("monitor3").setSelected(true);
			}
			
		}
		
		// Web And Video Conf Tab		
		if(oModelData.Videowebconf=="X"){
			this.getView().byId("webVideoFilter").setVisible(true);
			this.getView().byId("webVideo").setSelected(true);
			
		}
		
		// Webex Tab		
		if(oModelData.Webex=="X"){
			this.getView().byId("webex").setSelected(true);
			this.getView().byId("webexFilter").setVisible(true);
		}
		
		if(oModelData.Videowebconf=="X" || oModelData.Webex=="X") {
			this.getMultiFieldsReadOnly(requestId);
		}
		
		// Conf. Recording Tab		
		if(oModelData.Confrecord=="X"){
			this.getView().byId("confRecFilter").setVisible(true);
			this.getView().byId("confRec").setSelected(true);
			
			if(oModelData.Private=="X"){
				this.getView().byId("grRec").setSelectedIndex(1);
			}
			
		}
		
		var kaustId = oModelData.KaustId; 
	    this.getUserData(kaustId);
		
	    // Setting up the Approver Form or Feedback Form based on Stage
	    var oPropData;
	    var oPropModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(oPropModel, "oPropModel");
	    if (oModelData.Stage === "Requester Feedback") {
	    	oPropData = {
    	    	"sTaskHeading": "Requester Feedback for AV Service",
    	    	"bApproverForm": false,
    	    	"bFeedbackForm": true,
    	    	"bFeedFBtns": true,
    	    	"bAppFBtns": false,
    	    	"iRating": -1
    	    }
	    } else if (oModelData.Stage === "Room Booking Team"){
	    	oPropData = {
    	    	"sTaskHeading": "Approver Comments",
    	    	"bApproverForm": true,
    	    	"bFeedbackForm": false,
    	    	"bFeedFBtns": false,
    	    	"bAppFBtns": true,
    	    	"iRating": -1
    	    }
	    }//29-03-2018 Incture(andrea)
	    else if(oModelData.Stage === "Library Team"){
	    	oPropData={
	    		"bApproverForm":true,
	    		"bFeedbackForm": false,	
	    		"bAppFBtns": true,
	    		"bAppFBtns":true,
	    		"bFeedFBtns":false
	    		
	    	}
	    }
	    oPropModel.setProperty("/", oPropData);
	    // Logged in user information for comment update in ECC
	    var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
	    this.getView().setModel(oLoggedInUserModel, "oLoggedInUserModel");
		oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, true);
		oLoggedInUserModel.attachRequestCompleted(function(oEvent){
			if (oEvent.getParameter("success")) {
				if(oLoggedInUserModel.getData().d){
					oLoggedInUserModel.setProperty("/sKID", oLoggedInUserModel.getData().d.results[0].KaustID);
					oLoggedInUserModel.setProperty("/sName", oLoggedInUserModel.getData().d.results[0].FirstName + " " + oLoggedInUserModel.getData().d.results[0].MiddleName + " " + oLoggedInUserModel.getData().d.results[0].LastName);
				}
			}
		});
		oLoggedInUserModel.attachRequestFailed(function(oError){
			jQuery.sap.log.error(oError.getParameter("statusCode") + ":" + oError.getParameter("statusText"));
		});
	},
	
	getBRMUrl : function() {
	    var host = window.location.hostname;
	    if (host == "localhost") {
	      // Darshna - Edited : Replaced http with https
	      return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	    }
	    if (host.indexOf("kaust.edu.sa") == -1) {
	      host = host + ".kaust.edu.sa";
	    }

	    switch (host) {
	    case 'sthcigwdq1.kaust.edu.sa':
	           var port =  window.location.port;
	           if(port == "8000" ||port == "8001" ){ //QA port
	             return "https://sthpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	           }else {//port == "8005" ||port == "8006"
	             return "https://sthpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	           }                       
           break;
	    case 'kstcigwdq1.kaust.edu.sa':
	           var port =  window.location.port;
	           if(port == "8000" ||port == "8001" ){ //QA port
	             return "https://kstpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	           }else {//port == "8005" ||port == "8006"
	             return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	           }                       
           break;
	    case 'sthgwpsrcs.kaust.edu.sa':
	      return "https://sthpop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	      break;
	    case 'kstgwpsrcs.kaust.edu.sa':
		      return "https://kstspop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
		      break;
	    // Darshna - Edited : Added a switch case for localhost
	    case 'localhost' :
	      return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant";
	    }
	    return;
	  },
	/** to Fetch Request Id from the URL */
    getRequestId: function() {
        var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
        var requestId = url.split("requestId=");
        if (requestId.length > 1) {
            return requestId[1];
        } else {
            return "";
        }
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
getHostData : function(userId){
	
	var _that = this;
	var form = this.getView().byId("HostInfoForm");
	form.setVisible(true);
	var dataModel = new sap.ui.model.json.JSONModel();
//---------------
	var serviceUrl = _that.getBPMUrlNew("/kaust.com~sbf~bpm~java~restservices/requestDetails/RequestType?UserId="+userId);
	//
	$.ajax({
        url: serviceUrl,
        async: false,
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
        	dataModel.setData(responseData);
        	form.setModel(dataModel);			  	
           }, error: function(jqXHR, textStatus, errorThrown){
        	   alert('Unexpected error happened');
           }
	});
	
	
	
	/*
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
		*/
	
}, 

getMultiFieldsReadOnly : function(requestId){
    	
    	var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '"+requestId+"'");
//    	var url =  "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'";
		var result = "";
		
		$.ajax({
            url: url,
         dataType: 'json',
            async: false,
            type: "GET",
            cache: false,
            success: function(oResponse, textStatus, jqXHR) {
            	result = oResponse;
                   },
                   error: function(jqXHR, textStatus, errorThrown){
                          
                          if(textStatus==="timeout") {

                       	   sap.m.MessageBox.show(
                                "Connection timed out", {
                             	        icon: sap.m.MessageBox.Icon.ERROR,
                             	        title: "Error",
                             	        actions: [sap.m.MessageBox.Action.OK],
//                             	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                             	      }
                             	    );
//                                 sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                              
                          } else {

                               sap.m.MessageBox.show(
                               "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                                        icon: sap.m.MessageBox.Icon.ERROR,
                                        title: "Error",
                                        actions: [sap.m.MessageBox.Action.OK],
//                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                      }
                                    );
                                 jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
//                                 sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
                          };
                   },
            
            });
		
		var persons = result.d.results;
		var oModel = this.getView().getModel("webConfModel");
		var oModelWebEx = this.getView().getModel("webExModel");

		
		for(var i in persons){
			if(persons[i].Cemail!=""){
	    		oModel.oData.WebConf.push({
	    				protocol : persons[i].Protocol,
	    				ipAddress : persons[i].Ipaddress,
	    				techAssist : persons[i].Contact,
	    				emailConf : persons[i].Cemail
	    			
	    		});
			}
			if(persons[i].Externalmail!=""){

				oModelWebEx.oData.webExPart.push({
	    				exUserEmail : persons[i].Externalmail,
	    				country : persons[i].country
	    			
	    		});
			}
		}
		oModel.updateBindings();
		oModelWebEx.updateBindings();
    },
	
	handleAction : function(evt){
 		
		var oModel = sap.ui.getCore().byId("app").getModel();
		var oModelData = oModel.getProperty("/d/results/0");
 		var action = evt.getSource().getText();
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
 		var mngrComment = this.getView().byId("commentMngr").getValue();
		var comment = this.getView().byId("comment").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		
		var fName = this.getView().byId("fname");
		var lName = this.getView().byId("lname");
		var kaustID = this.getView().byId("kaustID");
		var email = this.getView().byId("email");
		var office = this.getView().byId("office");
		var pos = this.getView().byId("pos");
		var dept = this.getView().byId("dept");
		var mobile = this.getView().byId("mobile");
		
		var location = oModelData.EventLocation;
		
		var oPropModel = this.getView().getModel("oPropModel");
		var iSrvQuality = this.getView().byId("idSrvQualRB").getSelectedIndex();
		
		var oLoggedInUserModel = this.getView().getModel("oLoggedInUserModel");
		
//		if((action=="Correct" || action=="Reject") && mngrComment==""){
		if((action=="Reject") && mngrComment==""){
			
			sap.m.MessageBox.show(
	        		"Please add a reason for rejection", {
	          	        icon: sap.m.MessageBox.Icon.ERROR,
	          	        title: "Error",
	          	        actions: [sap.m.MessageBox.Action.OK],
//	          	        styleClass: bCompact ? "sapUiSizeCompact" : ""
	          	      }
	          	    );
			if(location=="Conference Room" && (this.getView().byId("bldgNameInfo").getValue()=="" || this.getView().byId("bldgLevelInfo").getValue()=="" || this.getView().byId("roomNoInfo").getValue()=="")){
				
				sap.m.MessageBox.show(
		        		"The Building/Room information cannot be empty", {
		          	        icon: sap.m.MessageBox.Icon.ERROR,
		          	        title: "Error",
		          	        actions: [sap.m.MessageBox.Action.OK],
//		          	        styleClass: bCompact ? "sapUiSizeCompact" : ""
		          	      }
		          	    );
				return;
			}
		} else if (action === "Submit" && oModelData.Stage === "Requester Feedback" && oPropModel.getProperty("/iRating") === -1) {
				sap.m.MessageBox.show(
		        		"Please provide the AV Service Quality Rating before submitting the Feedback Task", {
		          	        icon: sap.m.MessageBox.Icon.ERROR,
		          	        title: "Error",
		          	        actions: [sap.m.MessageBox.Action.OK],
		          	      });
		} else {
		
			var data = new Object();
			
			if(action === "Approve"){
				data["Status"] = "012";
				data["lastTaskStatus"] = "Approve";
			}else if(action=="Submit"){
				data["Status"] = "055";
				data["lastTaskStatus"] = "Approve";
			}else if(action=="Correct"){
				data["Status"] = "014";
				data["lastTaskStatus"] = "Approve";
			}else{
				data["Status"] = "011";
				data["lastTaskStatus"] = "Reject";
			}
			
			data["FirstName"] = fName.getText();
			data["LastName"] = lName.getText();
        	data["KaustId"] = kaustID.getText();
        	data["Email"] = email.getText();
        	data["Office"] = office.getText();
        	data["Mobile"] = mobile.getText();
        	data["Positiontext"] = pos.getText();
        	data["Deptname"] = dept.getText();
        	data["RequestId"] =requestId;
        	data["Itmsequence"] = "01";
        	
        	data["Mcomments"] = mngrComment;
        	
        	data["UserId"] = oModelData.UserId;
        	data["Ishost"] = oModelData.Ishost;
        	data["HostUserName"] = oModelData.HostUserName;
        	data["Hostuserid"] = oModelData.Hostuserid;
        	data["EventLocation"] = oModelData.EventLocation;
        	data["Attendees"] = oModelData.Attendees;
    		data["Foodservices"] = oModelData.Foodservices;
    		data["Recording"] = oModelData.Recording;
    		data["Presentation"] = oModelData.Presentation;
    		data["Layout"] = oModelData.Layout;
        	data["Eventname"] = oModelData.Eventname;
        	data["Ldate"] = oModelData.Ldate;
        	data["Starttime"] = oModelData.Starttime;
        	data["Endtime"] =oModelData.Endtime;
        	data["Adevent"] = oModelData.Adevent;
        	data["Rdevent"] = oModelData.Rdevent;
        	data["Renddate"] = oModelData.Renddate;
    		data["Rstartdate"] = oModelData.Rstartdate;
    		data["Daily"] = oModelData.Daily;
    		data["Weekly"] = oModelData.Weekly;
    		data["Monthly"] = oModelData.Monthly;
    		
    		data["Sunday"] = oModelData.Sunday;
    		data["Monday"] = oModelData.Monday;
    		data["Tuesday"] = oModelData.Tuesday;
    		data["Wednesday"] = oModelData.Wednesday;
    		data["Thursday"] = oModelData.Thursday;
    		data["Friday"] = oModelData.Friday;
    		data["Saturday"] = oModelData.Saturday;
    		
    		data["Wboard"] = oModelData.Wboard;
    		data["Flipchart"] = oModelData.Flipchart;
		   	data["Others"] = oModelData.Others;
    		data["Avsupport"] = oModelData.Avsupport;
    		data["Laptop"] = oModelData.Laptop;
    		data["Clicker"] = oModelData.Clicker;
    		data["Adapter"] = oModelData.Adapter;
    		data["Mphone"] = oModelData.Mphone;
    		data["Speakers"] = oModelData.Speakers;
    		data["Projector"] = oModelData.Projector;
    		data["Monitor"] = oModelData.Monitor;
    		data["Videowebconf"] = oModelData.Videowebconf;
    		data["Webex"] = oModelData.Webex;
    		data["Externalmail"] = oModelData.Externalmail;
			data["country"] = oModelData.country;
			data["Confrecord"] = oModelData.Confrecord;
			data["Public"] = oModelData.Public;
			data["Private"] = oModelData.Private;
			data["Title"] = oModelData.Title;
			data["Presenter"] = oModelData.Presenter;
			data["Department"] = oModelData.Department;
			//data["comments"] = oModelData.comments;
			data["comments"] = mngrComment;
			//Adding missing fields
			data["ProcessId"] = oModelData.ProcessId;
			data["Onbehalf"] = oModelData.Onbehalf;
			data["MiddleName"] = oModelData.MiddleName;
			data["RManager"] = oModelData.RManager;
			data["Costcenter"] = oModelData.Costcenter;
			data["country"] = oModelData.country;
			data["Protocol"] = oModelData.Protocol;
			data["Ipaddress"] = oModelData.Ipaddress;
			data["Contact"] = oModelData.Contact;
			data["Cemail"] = oModelData.Cemail;
			data["Agree"] = oModelData.Agree;
			data["Servicecall"] = oModelData.Servicecall;
			data["MsgTyp1"] = oModelData.MsgTyp1;
			data["Msg1"] = oModelData.Msg1;	
			
			data["isAvStandbyRequired"] = oModelData.isAvStandbyRequired;
        	
    		if (location=="Conference Room"){
    			data["Bldgname"] = this.getView().byId("bldgNameInfo").getValue();
            	data["Bldglevel"] = this.getView().byId("bldgLevelInfo").getValue();
        		data["roomno"] =  this.getView().byId("roomNoInfo").getValue();
        		data["ConfRoom"] = this.getView().byId("roomNoInfo").getValue();
    		}else{
    			data["Bldgname"] = oModelData.Bldgname;
            	data["Bldglevel"] = oModelData.Bldglevel;
        		data["roomno"] = oModelData.roomno;
        		data["ConfRoom"] = oModelData.roomno;
    		}
        	
        	//data["Stage"] = "AV Team Lead Approval";
    		data["Stage"] = oModelData.Stage;
    		if (oModelData.Stage === "Room Booking Team") {
    			data["t_role"] = "Room Booking Team";
    			data["t_name"] = oLoggedInUserModel.getProperty("/sName");
    			data["t_kaustid"] = oLoggedInUserModel.getProperty("/sKID");
    		} 
    		//29-03-2018 Incture(andrea)
    		if (oModelData.Stage === "Library Team") {
    			data["t_role"] = "Library Team";
    			data["t_name"] = oLoggedInUserModel.getProperty("/sName");
    			data["t_kaustid"] = oLoggedInUserModel.getProperty("/sKID");
    		} 
    		if (oModelData.Stage === "Requester Feedback") {
    			data["serviceQuality"] = (iSrvQuality + 1);
    			data["feedbackComments"] = this.getView().byId("idFeedback").getValue().trim();
    		}
    		
    		
        	data["ServiceCode"] = "0009";
        	data["SubServiceCode"] = "0011";
	    	data["Wftrigger"] = "X";
	    	
	    	data["flow"] = oModelData.flow;
			data["requestType"] = oModelData.requestType;
			data["activityType"] = oModelData.activityType;
			data["buildingCode"] = oModelData.buildingCode;
			
	    	var obj = JSON.stringify(data);
			this.completeKITSTask(taskId,action,obj, requestId);
		}
 },
 
 	 editRoom : function(evt){

 		 if(this.getView().byId("bldgNameInfo").getEditable()){
 			 evt.oSource.setIcon("sap-icon://edit");
 			this.getView().byId("bldgNameInfo").setEditable(false);
 	 		 this.getView().byId("bldgLevelInfo").setEditable(false);
 	 		 this.getView().byId("roomNoInfo").setEditable(false);
 		 }else{
 			evt.oSource.setIcon("sap-icon://display");
 			this.getView().byId("bldgNameInfo").setEditable(true);
 	 		 this.getView().byId("bldgLevelInfo").setEditable(true);
 	 		 this.getView().byId("roomNoInfo").setEditable(true);
 		 }
 		 
 		 
 		 
 		 
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
	
	goBack : function(){
		window.history.go(-1);
	},
	
	fnTrimChange: function(oEvent) {
		var oControl = oEvent.getSource();
		oControl.setValue(oControl.getValue().trim());
	},
	
	onQualitySelect: function(oEvent) {
		var oPropModel = this.getView().getModel("oPropModel");
		oPropModel.setProperty("/iRating", oEvent.getSource().getSelectedIndex());
	}
    	
    	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zui5_copyright.App
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zui5_copyright.App
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zui5_copyright.App
*/
//	onExit: function() {
//
//	}

});
});