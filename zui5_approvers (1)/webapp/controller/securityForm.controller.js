sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap.m.MessageBox",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,MessageBox) {
		"use strict";
//jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.DateFormat");

kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.securityForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf security_form.securityForm
*/
	onInit: function() {
		var oUserModel =  new sap.ui.model.json.JSONModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		
////	oUserModel.loadData("https://sthcigwdq1.kaust.edu.sa:8006/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
	oUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
	this.getView().setModel(oUserModel, "oUserModel");
	var oDataModel = new sap.ui.model.json.JSONModel();
	oDataModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet?$filter=RequestId eq '"+requestId+"'&$expand=DCToTemplate&$format=json", null, false);
	var data = oDataModel.getData().d.results[0];
	this.setDataToForm(data);
	///sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '20920798'&format=json
	var oDataApproverModel = new sap.ui.model.json.JSONModel();
	oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
	var data = oDataApproverModel.getData().d.results;
	oDataApproverModel.setData({data});
	
	this.getView().setModel(oDataApproverModel,"approverModel");
	   var oDatePicker = this.getView().byId("expDate");
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
     *  to Make all the Controls readonly
     *  */
    initializeControlsReadOnly: function() {
     
    },

	getDate : function (value) {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "MM/dd/yyyy"});
		if(value){
//			value=value.split("T")[0];
			date=new Date(Date(value));
			return oDateFormat.format(date);
		}
		else
			return value;
		  },

setDataToForm:function(data)
{
	if(data.DCToTemplate.results.length>0)
		{
		var tableArray=[];
	var obj={};
		for(var i = 0; i < data.DCToTemplate.results.length; i++)
			{
		 obj={};
			  var arr =  data.DCToTemplate.results[i].templateField.split("|");
			  if(arr.length>0)
				  {
				  for( var j=0; j < arr.length; j++)
					  {
					  obj={};
					  obj["templateType"] = data.DCToTemplate.results[i].templateType;
					  obj["templateField"] = arr[j];
					  tableArray.push(obj);
					  }
				  }
			  else
				  {
				    obj["templateType"] = data.DCToTemplate.results[i].templateType;
				    obj["templateField"] = data.DCToTemplate.results[i].templateField;
				    tableArray.push(obj);
				  }
			}
		
		}
	var date= new Date().toISOString().split("T")[0];
	var buildingModel =  new sap.ui.model.json.JSONModel();
	buildingModel.setData(tableArray);
	this.getView().setModel(buildingModel,"buildingModel");
	
	if(data.accessType == "0")
		{
		data.requestTypeEsc = "Un Escorted";
		}
	else
		data.requestTypeEsc = "Escorted";
	data.Name=data.FirstName+" "+data.MiddleName+" "+data.LastName;
	
	var reqModel = new sap.ui.model.json.JSONModel();
	reqModel.setData(data);
	this.getView().setModel(reqModel,"reqData");
	var reqModel =  new sap.ui.model.json.JSONModel();
	reqModel.setData(data);
	this.getView().setModel(reqModel,"requestData");
	
	var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "MM/dd/yyyy"});
		date=oDateFormat.format(new Date());
	this.getView().byId("securityFormDate").setValue(date);
	
},
onPrint:function()
{
//	window.print();
	var reqData = this.getView().getModel("reqData").getData();
	 var first='<html><head><style> </style></head>';
	 if(!reqData.dcExpDate)
		 reqData.dcExpDate="";
	// var form='<div id="form1" style="width:100%"><div class="l" width="50%">'+form1.innerHTML+'</div><div class="r" width="50%">'+form2.innerHTML+'</div></div>';
	 var header = '<center><h3>Control Access Facility Request</h3></center><hr>';
	 var heading = "<h5 style='text-align:left;'> Applicant Details</h5>";
	var detail = "<pre><table style ='border-collapse :collapse; border :1px solid black;' width ='95%'>" + "<tr>" + "<td>Applicant Type: </td><td>" + reqData.applicantType + "</td>" + "<td>Request Type: </td><td>" + reqData.requestTypeEsc + "</td>" + "</tr>" +
		"<tr></tr>"+		
		"<tr>" + "<td>KAUST ID:</td><td>" + reqData.kaustId + "</td><td>Name:</td><td>" + reqData.Name + "</td>" + "</tr>" +
		"<tr></tr>"+
		"<tr>" + "<td>Organization Code:</td><td>" + reqData.req_orgUnit + "</td><td>Organization Name:</td><td>" + reqData.req_orgName + "</td>" + "</tr>"+
		"<tr></tr>"+
		"<tr>" + "<td>Expiry Date:</td><td>" + this.getDate(reqData.dcExpDate) + "</td><td></td><td>" + "" + "</td>" + "</tr>"+
		"</table><br></pre><br>";
	var heading2 = "<h5 style='text-align:left;'> Approver Details</h5>";	
	var table = "<table rules='cols' style ='border :1px solid black; ' width ='95%'><tr>" + "<th>Team</th>" +"<th>KAUST ID</th>"+"<th>Name</th>" + "<th>Organization Code</th>"  + "<th>Organization Name </th>" + "<th>Approval Date</th></tr>";
	var tableData = this.getView().getModel("approverModel").getData().data;
	for(var i=0;i<tableData.length;i++)
		{
		table += "<tr>";
		table += "<td style = 'border :1px solid black; word-wrap:break-word; width:5px'>" + tableData[i].Stage + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + tableData[i].t_KaustId + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + tableData[i].t_name + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + tableData[i].Orgunit + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + tableData[i].Orgname + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + this.getDate(tableData[i].TimeStamp) + "</td></tr>";
		}
	table+= "</table><br>";

	var heading3 = "<h5 style='text-align:left;'>Facility Access Request Details</h5>";	
	var table2 = "<table rules='cols' style ='border :1px solid black; ' width ='95%'><tr>" + "<th>Building</th>" +"<th>Room</th></tr>";
	var tableData = this.getView().getModel("buildingModel").getData();
	for(var i=0;i<tableData.length;i++)
		{
		table2 += "<tr>";
		table2 += "<td style = 'border :1px solid black; word-wrap:break-word; '>" + tableData[i].templateType + "</td>"+
		"<td style = 'border :1px solid black; word-wrap:break-word;'>" + tableData[i].templateField + "</td></tr>";
		}
	table2+= "</table><br>";
var userData = this.getView().getModel("oUserModel").getData().d.results[0];
var date=this.getDate(this.getView().byId("securityFormDate").getValue());
	var heading4 = "<h5 style='text-align:left;'>Security Details</h5>";	
	var detail2 = "<pre><table style ='border-collapse :collapse; border :1px solid black;' width ='95%'>" + "<tr>" + "<td>KAUST ID: </td><td>" + userData.KaustID + "</td>" + "<td>Name: </td><td>" + userData.FirstName + "</td>" + "</tr>" +
	"<tr></tr>"+		
	"<tr>" + "<td>Phone Number:</td><td>" + userData.Mobile + "</td><td>Date:</td><td>" + date + "</td>" + "</tr>" +
	"<tr></tr>"+
	"</table><br></pre>";


	var str = "width=900px, height=600px";
		var wind = window.open("", "", str);
		wind.document.write(first+header+heading+detail+heading2+table+heading3+table2+heading4+detail2+'</html>');
		wind.print();
		wind.close();
},
onComplete:function()
	{

		var oModel = sap.ui.getCore().byId("app").getModel();
 		var action = "Complete";
 		
 		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
 		
// 		var mngrComment = this.getView().byId("commentMngr").getValue();
//		var comment = this.getView().byId("comments").getValue();
		
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
	
	
			var requestData = sap.ui.getCore().byId("app").getModel().getData().d.results[0];
			var oLoggedInUserModel = new sap.ui.model.json.JSONModel();
			oLoggedInUserModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/UserDetail?$format=json", null, false);
			var loggedInUser = "", loggedInUserName="";
			if(oLoggedInUserModel.getData().d){
				loggedInUser = oLoggedInUserModel.getData().d.results[0].KaustID;
				loggedInUserName = oLoggedInUserModel.getData().d.results[0].FirstName;
			}
			if(this.getView().byId("expDate").getValue())
				{
			if(requestData.stage =="KAUST Security ")
				{
//				requestData.comments=comment;
				requestData.t_role = "Security Team";
				requestData.t_name = oLoggedInUserModel.getData().d.results[0].FirstName +" "+ oLoggedInUserModel.getData().d.results[0].MiddleName + " "+ oLoggedInUserModel.getData().d.results[0].LastName;
				requestData.t_kaustid = oLoggedInUserModel.getData().d.results[0].KaustID;
				requestData.org_name = oLoggedInUserModel.getData().d.results[0].Orgname;
				requestData.org_unit = oLoggedInUserModel.getData().d.results[0].Orgunit;
//				requestData.securityTeamApprover=loggedInUserName;;
//				requestData.securityTeamComm="";
				}
			
			date = new Date(Date.parse(this.getView().byId("expDate").getValue())).getDate()+"";
			var xDate = new Date(Date.parse(this.getView().byId("expDate").getValue())).toISOString().split(".")[0];
//			xDate = xDate.split("T")[0];
//			xDate = xDate.split("-");
//			xDate[2] = date;
//			var expDate = xDate[0]+"-"+xDate[1]+"-"+xDate[2];
			requestData.dcExpDate =  xDate;
//	    	if(action=="Approve"||action=="Submit")
//	    		{
	    		requestData["lastTaskStatus"] = "Approve";
	    		requestData["status"] = "055";
//	    		}
//	    	else if(action=="Reject"){
//				requestData["status"] = "011";
//				requestData["lastTaskStatus"] = "Reject";
//			}
	    	requestData.DCToTemplate=requestData.DCToTemplate.results;
	    	for(var i=0;i<requestData.DCToTemplate.length ;i++)
	    		{
	    		delete requestData.DCToTemplate[i]["__metadata"];
	    		}
//	    	delete requestData["DCToTemplate"];
	    	
	    	
	    	requestData.seqNum = requestData.seqNum+"";
	    	delete requestData["timeStamp"];
	    	delete requestData["__metadata"];
	    	delete requestData["seqNum"];
	    	delete requestData["enableField"];
	    	var obj = JSON.stringify(requestData);
			this.completeKITSTask(taskId,action,obj,requestId);
				}
			else
				{
				this.showMessage("Please Enter the Expiry Date","Warning");
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
	validateDate: function(oEvt) {
var requestDate=   this.getView().getModel("reqData").getData().requestDate;
        var currentDate = new Date(parseInt(requestDate.split("(")[1].split(")")[0]));
        var date = Date.parse(new Date(oEvt.getSource().getValue()));
        if(date)
        	{
        if(Date.parse(new Date()) > date)
    	{
		this.showMessage("Expiry Date should be greater than Today's Date","Warning");
		 oEvt.getSource().setValue("");
    	}
       
        else  if (Date.parse(currentDate) > date) {
        	this.showMessage("Expiry Date should be greater than Request Date","Warning");
            oEvt.getSource().setValue("");
        } 
        else
            oEvt.getSource().setValue(new Date(date).toISOString().split("T")[0]);
        	}
        else
        	{
      		 sap.m.MessageBox.show(
      	                "Expiry date is invalid, please select date from DatePicker", {
      	                    icon: sap.m.MessageBox.Icon.ERROR,
      	                    title: "Error",
      	                    actions: [sap.m.MessageBox.Action.OK],
      	                }
      	            );
      	            oEvt.getSource().setValue("");
        	}
    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf security_form.securityForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf security_form.securityForm
*/
	onAfterRendering: function() {
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf security_form.securityForm
*/
//	onExit: function() {
//
//	}

});
});