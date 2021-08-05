jQuery.sap.declare("kaust.ui.kits.approvers.util.MainController");
jQuery.sap.require("sap.m.MessageBox");


// this is a common controller for all reusable function
sap.ui.core.mvc.Controller.extend("kaust.ui.kits.approvers.util.MainController", {
	
	
	completeTask:function(taskId,decisionKey,dataPost,requestId){
		
		var msg = "The request has been successfully Approved";     // for Approval message : zakeer
		//For Submission Approved Task : Zakeer
		if(decisionKey =="Submit"){
			decisionKey="Approve";
			msg = "The request has been successfully Submitted";
		}
		//Close of Submission Approved Task : Zakeer
	       var urlCompleteTask = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='"+ taskId + "'&DecisionKey='"+decisionKey+"'"); 
	       var approveButton = this.getView().byId("approveButton");
	       var rejectButton = this.getView().byId("rejectButton");
//	       var correctButton = this.getView().byId("correctButton");s
	       var token = this.getGateWayToken();
	       var data="";
	       var that=this;
	       $.ajax({
	                     url: urlCompleteTask,
	                     dataType: 'json',
	                     async: false,
	                     type: "POST",
	                     data: data,
	                     cache: false,
	               beforeSend: function(xhr){
	                  xhr.setRequestHeader("X-CSRF-Token", token);
	               },                        
	                     
	                     success: function(oResponse, textStatus, jqXHR) {
	                           var data = oResponse;
	                           that.updateOdata(requestId, dataPost);
	                           
	                           if(decisionKey=="Approve"){
	                        	   
	                        	   sap.m.MessageBox.show(
	   	                           		msg, {
	   	                           	        icon: sap.m.MessageBox.Icon.SUCCESS,
	   	                           	        title: "Success",
	   	                           	        actions: [sap.m.MessageBox.Action.OK],
//	   	                           	        styleClass: bCompact? "sapUiSizeCompact" : ""
	   	                           	        onClose: function(oAction){
	   	                           	        	that.goBack(oAction);
	   	                           	        }
	   	                           	      }
	   	                           	    );
	                           }else{
	                        	   sap.m.MessageBox.show(
	   	                           		"The request has been Rejected", {
	   	                           	        icon: sap.m.MessageBox.Icon.SUCCESS,
	   	                           	        title: "Success",
	   	                           	        actions: [sap.m.MessageBox.Action.OK],
//	   	                           	        styleClass: bCompact? "sapUiSizeCompact" : ""
	   	                           	        onClose: function(oAction){
	   	                           	        	that.goBack(oAction);
	   	                           	        }
	   	                           	      }
	   	                           	    );
	                           }
	                           
	                           
	                           approveButton.setVisible(false);
	                           rejectButton.setVisible(false);
//	                           correctButton.setVisible(false);
	                     
	                     },
	                     error: function(jqXHR, textStatus, errorThrown){
	                           
	                           if(textStatus==="timeout") {
                            	   sap.m.MessageBox.show(
                                    		"Connection timed out", {
                                    	        icon: sap.m.MessageBox.Icon.ERROR,
                                    	        title: "Error",
                                    	        actions: [sap.m.MessageBox.Action.OK],
//                                    	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    	      }
                                    	    );
//	                                  sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                             
	                           } else {
	                        	   sap.m.MessageBox.show(
                            			   "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                                    	        icon: sap.m.MessageBox.Icon.ERROR,
                                    	        title: "Error",
                                    	        actions: [sap.m.MessageBox.Action.OK],
//                                    	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    	      }
                                    	    );
	                                  jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
//	                                  sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
	                           };
	                     },
	                     complete: function(){
	                     
	                     }
	              });
	  },
	  
	  updateTemplateData:function(requestId,jsonData)
	  {


		  var object = {};
		  var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		  var url = helpModel.getProperty("/url");
		  
		  if(url.indexOf("DataCenterSet")!=-1)
			  {
//			  url = url.split("&$")[0];
			 url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/$batch";

			  }
		  var payload = "--batch\r\nContent-Type: multipart/mixed; boundary=changeset\r\n";
		  var obj={};
		  String.prototype.replaceAll = function(search, replacement) {
			   var target = this;
			   return target.replace(new RegExp(search, 'g'), replacement);
			};
			
		  for(var i=0;i<jsonData.DCToTemplate.length ; i++)
			  {
			  obj=jsonData.DCToTemplate[i];
			  this.tempType = jsonData.DCToTemplate[i].templateType;
			  this.tempType = this.tempType.replaceAll(" ","");
			  payload += "\r\n--changeset\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n"+
		  "PUT DCTemplateTypeSet(RequestId='"+requestId+"',templateType='"+this.tempType+"') HTTP/1.1\r\n"+
		  "Content-Type: application/json\r\n\r\n"+JSON.stringify(obj)+"\r\n";
			  }
		  payload+="--changeset--\r\n"+"--batch--";
		 
		  

		 
		  
///////////////////////////////////////////////////////////////////////////////////
//		  var tempJSON = "'" + JSON.stringify(temp) + "'";
//          var searchData = "--batch" + "\n" +
//          "Content-Type: application/http" + "\n" + "Content-Transfer-Encoding: binary" + "\n" + "\n" + "GET es_noncap_asset_details_getall?$format=json&$filter=MassInput+eq+" + tempJSON + " HTTP/1.1" + "\n" + "\n" + "\n" + "--batch--"
//          var tempResults = [];
//          var token;
//          var sUrl = "/AssetManagement/Drl_Proxy_Servlet?sap/opu/odata/sap/ZDRL_NONCAPASSET_GET_DETAILS_SRV/$metadata";
//          jQuery.ajax({
//             
//              url: sUrl + getTimeStampForURL(),
//              type: "GET",
//              async: false,
//              beforeSend: function(xhr) {
//                  xhr.setRequestHeader("X-CSRF-Token", "Fetch");
//              },
//              success: function(data, textStatus, XMLHttpRequest) {
//                  token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
//                  $.ajax({
//                      url: "/AssetManagement/Drl_Proxy_Servlet?sap/opu/odata/sap/ZDRL_NONCAPASSET_GET_DETAILS_SRV/$batch",
//                      type: "POST",
//                      async: false,
//                      headers: {
//                          "Content-Type": "multipart/mixed;boundary=batch",
//                          "X-CSRF-Token": token
//                      },
//                      dataType: 'text',
//                      data: searchData,
//                      success: function(data, textStatus, jqXHR) {
//                          var newData = data;
//                          var jsonArray = newData.split('dataserviceversion: 2.0');
//                          var obj = JSON.parse(jsonArray[1].split('--')[0]);
//                          var temp = [];
//                          for (var i = 0; i < obj.d.results.length; i++) {
//                              if (obj.d.results[i].ErrMsg == "") {
//                                  obj.d.results[i].AmountSingle = obj.d.results[i].Amount / obj.d.results[i].Quantity;
//                                  obj.d.results[i].Quantity = Math.floor(obj.d.results[i].Quantity)
//                                  obj.d.results[i].OrigQunatityValue = obj.d.results[i].Quantity;
//                                  temp.push(obj.d.results[i]);
//                              }
//                          }
//                          obj.d.results = temp;
//                          subAssetModel.setData(obj.d);
//                          subAssetModel.refresh();
//
//                      },
//                      error: function(data, textStatus, jqXHR) {
//                          //alert("failed");
//                          //this.busy.close();
//                          sap.m.MessageToast.show("Service failed due to  :" + textStatus);
//                      }
//                  });
//              }
//          });
 ///////////////////////////////////////////////////////////////////////////////

		  debugger;
		  
		  var token = this.getGateWayToken();
		  $.ajax({
		     url: url,
	            type: "POST",
                async: false,
                dataType: 'text',
                headers: {
                  "Content-Type": "multipart/mixed;boundary=batch",
                },
//                contentType: "multipart/mixed;boundary=batch",
                data: payload,
		     
		 
		beforeSend: function(xhr){  
		         xhr.setRequestHeader("X-CSRF-Token", token);
		         debugger;
		}, 
		     
		     success: function(oResponse, textStatus, jqXHR) {
		       var dataDetails = oResponse;
		       debugger;
		    //   window.open('','_self').close();                 Zakeer : preventing closing of the tab
		           //sap.ui.commons.MessageBox.alert("Email Request Successfully created", null, "Success");
		          // sap.ui.getCore().byId("submit").setEnabled(false); 
		              
		     },
		     error: function(jqXHR, textStatus, errorThrown){
		           
		           if(textStatus==="timeout") {
		        	   sap.m.MessageBox.show(
                       		"Connection timed out", {
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
//                       	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                       	      }
                       	    ); 
//		        	   sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                                   
		           } else {
		        	   sap.m.MessageBox.show(
                			   "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                        	        icon: sap.m.MessageBox.Icon.ERROR,
                        	        title: "Error",
                        	        actions: [sap.m.MessageBox.Action.OK],
//                        	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                        	      }
                        	    );   
		        	   jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status +"," + jqXHR.statusText);
		 
		           };
		     },
		     complete: function(){
		     }
		});

	    
	  },
	  
	  /**Update OData*/
	  updateOdata:function(requestId,jsonData){
		  var flagSuccess = false;
		  var object = {};
		  var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		  var url = helpModel.getProperty("/url");
		  //For TER module  url updation : zakeer
		  if(url.indexOf("TERRequestSet")!=-1){
			  urlArr = url.split("?");
			  url = urlArr[0]+"(RequestId='"+requestId+"')";
		  }
		  if(url.indexOf("DataCenterSet")!=-1)
			  {
//			  url = url.split("&$")[0];
			  jsonData = JSON.parse(jsonData);
			 url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet('"+requestId+"')";
			 if(jsonData.stage != "Justification")
			 this.updateTemplateData(requestId, jsonData);
			 delete jsonData["DCToTemplate"];
			 jsonData = JSON.stringify(jsonData);
			  }
		  if(url.indexOf("VPNRequestSet")!=-1)
			  {
			  url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet('"+requestId+"')";
			  }
		  if(url.indexOf("AdminRightsReqSet")!=-1)
			  {
			  url="/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AdminRightsReqSet('"+requestId+"')";
			  }
		  if(url.indexOf("Vsm")!=-1) {
			  url="/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm(RequestId='" + requestId + "',KaustId='',ConfRoom='')";
		  }
		  // end to TER module url updation : zakeer
//		  var urlEmailPost = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='"+requestId+"',KaustId='')");
		  debugger;
		  var token = this.getGateWayToken();
//		  object = JSONjsonData, status);
		 
		  $.ajax({
		     url: url,
		     dataType: 'json',
		     contentType: "application/json",
		     async: false,
		     data: jsonData,
		     type: "PUT",
		     beforeSend: function(xhr){  
		         xhr.setRequestHeader("X-CSRF-Token", token);
		         debugger;
		     }, 
		     success: function(oResponse, textStatus, jqXHR) {
			       var dataDetails = oResponse;
			       flagSuccess = true;
			       return flagSuccess;
			       //window.open('','_self').close();                 Zakeer : preventing closing of the tab
			       //sap.ui.commons.MessageBox.alert("Email Request Successfully created", null, "Success");
			       // sap.ui.getCore().byId("submit").setEnabled(false); 
		     },
		     error: function(jqXHR, textStatus, errorThrown){
		           if(textStatus==="timeout") {
		        	   sap.m.MessageBox.show(
                       		"Connection timed out", {
                       	        icon: sap.m.MessageBox.Icon.ERROR,
                       	        title: "Error",
                       	        actions: [sap.m.MessageBox.Action.OK],
//                       	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                       	      }
                       	    ); 
//		        	   sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                                   
		           } else {
		        	   sap.m.MessageBox.show(
                			   "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
                        	        icon: sap.m.MessageBox.Icon.ERROR,
                        	        title: "Error",
                        	        actions: [sap.m.MessageBox.Action.OK],
//                        	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                        	      }
                        	    );   
		        	   jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status +"," + jqXHR.statusText);
		 
		           };
		           return flagSuccess;
		     },
		     complete: function(){
		     }
		});
		  return flagSuccess;
	  },
	  
	    getUrl: function(sUrl){
	        if(sUrl == ""){
	               return sUrl;
	        }
	        if(window.location.hostname == "localhost"){
	               return "proxy"+sUrl;
	        }
	        else{
	               return sUrl;
	        }
	        
	 },
	 getServiceUrl:function(url) {	 
			var host = window.location.hostname;
			switch (host)
		    {
		    	case 'sthcigwdq1.kaust.edu.sa':
		    		var port =  window.location.port;
		    		if(port == "8000" ||port == "8001" ){
		    		   return "https://sthpodq.kaust.edu.sa:50001" + url;
		    		}else {
		    		   return "https://sthpodq.kaust.edu.sa:50501" + url;
		    		}	    	   	
		    		break;
		    	case 'kstcigwdq1.kaust.edu.sa':
		    		var port =  window.location.port;
		    		if(port == "8000" ||port == "8001" ){
		    		   return "https://kstpodq.kaust.edu.sa:50001" + url;
		    		}else {
		    		   return "https://kstpodq.kaust.edu.sa:50501" + url;
		    		}	    	   	
		    		break;
		       case 'sthgwpsrcs.kaust.edu.sa':
		    	   	return "https://sthpop.kaust.edu.sa:50101" + url;
		            break;
		       case 'kstgwpsrcs.kaust.edu.sa':
		    	   	return "https://kstspop.kaust.edu.sa:50101" + url;
		            break;
		       case 'localhost': return "https://kstpodq.kaust.edu.sa:50501" + url;
	          break;
		     }
		     return host + url;
		},	
		
		getBPMUrl:function(url) {	 
			var host = window.location.hostname;
			switch (host)
		    {
		    	case 'sthcigwdq1.kaust.edu.sa':
		    		var port =  window.location.port;
		    		if(port == "8000" ||port == "8001" ){
		    		   return "https://sthpodq.kaust.edu.sa:50001" + url;
		    		}else {
		    		   return "https://sthpodq.kaust.edu.sa:50501" + url;
		    		}	    	   	
		    		break;
		    	case 'kstcigwdq1.kaust.edu.sa':
		    		var port =  window.location.port;
		    		if(port == "8000" ||port == "8001" ){
		    		   return "https://kstpodq.kaust.edu.sa:50001" + url;
		    		}else {
		    		   return "https://kstpodq.kaust.edu.sa:50501" + url;
		    		}	    	   	
		    		break;
		       case 'sthgwpsrcs.kaust.edu.sa':
		    	   	return "https://sthpop.kaust.edu.sa:50101" + url;
		            break;
		       case 'kstgwpsrcs.kaust.edu.sa':
		    	   	return "https://kstspop.kaust.edu.sa:50101" + url;
		            break;
		       case 'localhost': return "https://kstpodq.kaust.edu.sa:50501" + url;
	          break;
		     }
		     return host + url;
		},
		
		/**11-22-2017 : Edited by Incture: The above method (getBPMUrl) does not provide the correct BPM URL */
		/**Get BPM URL handles the port number: START*/
		getBPMUrlNew: function(url) {
			    var host = window.location.hostname;
			    if (host.indexOf("kaust.edu.sa") == -1) {
			      host = host + ".kaust.edu.sa";
			    }
			    switch (host) {
			    case 'sthcigwdq1.kaust.edu.sa':
			           var port =  window.location.port;
			           if(port == "8000" ||port == "8001" ){ //QA port
			        	   return "https://sthpodq.kaust.edu.sa:50001" + url;   
			           }else {//port == "8005" ||port == "8006"
			        	   return "https://sthpodq.kaust.edu.sa:50501" + url;            
			           }                       
			    break;
			    case 'kstcigwdq1.kaust.edu.sa':
			           var port =  window.location.port;
			           if(port == "8000" ||port == "8001" ){ //QA port
			        	   return "https://kstpodq.kaust.edu.sa:50001" + url;   
			           }else {//port == "8005" ||port == "8006"
			        	   return "https://kstpodq.kaust.edu.sa:50501" + url;            
			           }                       
			    break;
			    case 'sthgwpsrcs.kaust.edu.sa':
			    	return "https://sthpop.kaust.edu.sa:50101" + url;
			    	break;
			    case 'sthgwpsrcs.kaust.edu.sa':
			    	return "https://kstspop.kaust.edu.sa:50101" + url;
			    	break;
			    }
			    return;
		},
		/**Get BPM URL handles the port number: END*/
		
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
	 
	 
	 
		 getGateWayToken:function(){
		     var metadataEmail = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='',KaustId='')");
		     var token = null;
		     $.ajax({  
		          url: metadataEmail,  
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
		            dataModel = data;
		              token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');    },
		          error: function(data, textStatus, XMLHttpRequest)  
		          {  
		         alert("Error message");
		          }        
		          
		   });
		     return token;
	 },

	 //KITS changes 15 sept 2017 - Zakeer -start
	 goBack : function(oAction){
			if(oAction=="OK"){
				//window.history.go(-1);
				//window.open('','_self').close();
				window.top.close();
			}else{
				return false;
			}
		},
	 //KITS changes 15 sept 2017 - Zakeer -end
		
		
	// Complete task KITS services : Zakeer
	completeKITSTask:function(taskId,decisionKey,dataPost,requestId){
		 var that = this;
		 var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		  var url = helpModel.getProperty("/url");
		  //For TER module  url updation : zakeer
		  if(url.indexOf("TERRequestSet")!=-1){
			  urlArr = url.split("?");
			  url = urlArr[0]+"(RequestId='"+requestId+"')";
		  }
		  // end to TER module url updation : zakeer
		  // If the update is not possible in ECC do not make the BPM Call
          var flagSuccess = that.updateOdata(requestId, dataPost)
//        var urlCompleteTask = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='"+ taskId + "'&DecisionKey='"+decisionKey+"'");
		 if(flagSuccess){
          var token = this.getGateWayToken();
//		  $.ajax({
//		     url: urlCompleteTask,
//		     dataType: 'json',
//		     contentType: "application/json",
//		     async: false,
//		     data: dataPost,
//		     type: "PUT",
//		beforeSend: function(xhr){  
//		         xhr.setRequestHeader("X-CSRF-Token", token);
//		}, 
//		     success: function(oResponse, textStatus, jqXHR) {
//		       var dataDetails = oResponse;
	    var msg = "The request has been successfully Approved";     // for Approval message : zakeer
		//For Submission Approved Task : Zakeer
	    if(decisionKey =="Submit"){
			decisionKey="Approve";
				msg = "The request has been successfully Submitted";
		}
	    else if(decisionKey =="Complete")
	    	{
	    	decisionKey="Approve";
			msg = "The request has been successfully Completed";
	    	}
		//Close of Submission Approved Task : Zakeer
       var urlCompleteTask = that.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='"+ taskId + "'&DecisionKey='"+decisionKey+"'"); 
       var approveButton = that.getView().byId("approveButton");
       var rejectButton = that.getView().byId("rejectButton");
//			       var correctButton = this.getView().byId("correctButton");s
//			       var token = that.getGateWayToken();
       var data="";
       $.ajax({
         url: urlCompleteTask,
         dataType: 'json',
         async: false,
         type: "POST",
         data: data,
         cache: false,
         beforeSend: function(xhr){
        	 xhr.setRequestHeader("X-CSRF-Token", token);
         },                        
         success: function(oResponse, textStatus, jqXHR) {
        	 var data = oResponse;
             // that.updateOdata(requestId, dataPost);
        	 if(decisionKey=="Approve"){
        		 if(url.indexOf("Vsm")!=-1){
    	        		that.showMsg(msg);
    	        	} else {
    	        		sap.m.MessageBox.show(msg, {
    		       	        icon: sap.m.MessageBox.Icon.SUCCESS,
    		       	        title: "Success",
    		       	        actions: [sap.m.MessageBox.Action.OK],
    		       	        onClose: function(oAction){
    		       	        	that.goBack(oAction);
    		       	        }
    	            	});
    	        	} 
        	 }else{
        		 if(url.indexOf("Vsm")!=-1){
 	        		that.showMsg("The request has been Rejected");
 	        	} else {
        	   sap.m.MessageBox.show("The request has been Rejected", {
	       	       icon: sap.m.MessageBox.Icon.SUCCESS,
	       	       title: "Success",
	       	       actions: [sap.m.MessageBox.Action.OK],
	       	       onClose: function(oAction){
	       	    	   that.goBack(oAction);
	       	       }
        	   });
        	 }
        	 }
        	 approveButton.setVisible(false);
        	 rejectButton.setVisible(false);
         },
         error: function(jqXHR, textStatus, errorThrown){
        	 if(textStatus==="timeout") {
        		 sap.m.MessageBox.show("Connection timed out", {
        	        icon: sap.m.MessageBox.Icon.ERROR,
        	        title: "Error",
        	        actions: [sap.m.MessageBox.Action.OK],
        	      });
               } else {
            	  sap.m.MessageBox.show(
        			  "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
        				  icon: sap.m.MessageBox.Icon.ERROR,
        				  title: "Error",
        				  actions: [sap.m.MessageBox.Action.OK],
        			  });
                 jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText);
               };
         	}
       });
//		     },
//		     error: function(jqXHR, textStatus, errorThrown){
//		           if(textStatus==="timeout") {
//		        	   sap.m.MessageBox.show(
//                      		"Connection timed out", {
//                      	        icon: sap.m.MessageBox.Icon.ERROR,
//                      	        title: "Error",
//                      	        actions: [sap.m.MessageBox.Action.OK],
//                      	      }
//                      	    ); 
//		           } else {
//		        	   sap.m.MessageBox.show(
//               			   "The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, {
//                       	        icon: sap.m.MessageBox.Icon.ERROR,
//                       	        title: "Error",
//                       	        actions: [sap.m.MessageBox.Action.OK],
//                       	      }
//                       	    );   
//		        	   jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status +"," + jqXHR.statusText);
//		 
//		           };
//		     }
//		});
		 }else{
		   		sap.m.MessageBox.show("Error while submitting, Please try again" , {
        	        icon: sap.m.MessageBox.Icon.ERROR,
        	        title: "Error",
        	        actions: [sap.m.MessageBox.Action.OK],
//        	        styleClass: bCompact ? "sapUiSizeCompact" : ""
        	      }
        	    );   
		}
	},
	
	showMsg: function(msg) {
		var that = this;
		 var dialog = new sap.m.Dialog({
	         title: 'Success',
	         type: 'Message',
	         state: 'Success',
	         content: [
                new sap.m.Label({
                    text: msg
                })],
	            beginButton: new sap.m.Button({
	                text: 'Ok',
	                press: function() {
	                    dialog.close();
	                }
	            }),
	            afterClose: function() {
	                window.top.close();
	                dialog.destroy();
	            }
	        });
	        dialog.open(); 
	}
	// End -Complete task KITS services : Zakeer	
	
});