sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";	
	kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.itEquipment", {		

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_copyright.App
*/
	onInit: function() {
		
		var oModel = sap.ui.getCore().byId("app").getModel();
//        var helpModel = new sap.ui.model.json.JSONModel();
//        this.getView().setModel(helpModel,"helpModel");
        var equipmentModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(equipmentModel,"equipment");
		
        var kaustId = oModel.oData.d.KaustId; 
	    this.getUserData(kaustId);
	    
		var approval = oModel.oData.d.Stage;
//		var approval= "Line Manager Approval";
//		var approval= "EUC Team Approval";
		if(approval=="EUC Team Approval"){
			this.getView().byId("approveButton").setText("Approve");
			this.getView().byId("rejectButton").setText("Reject");
			this.getView().byId("rejectButton").setVisible(true);
			this.getView().byId("title").setText("Summary of order");
			this.getView().byId("eucComment").setVisible(true);
		}
		
		var userId = oModel.oData.d.UserId; 
		var url = this.getBPMUrl("/kaust.com~sbf~bpm~java~restservices/equipmentforgrade/getequipforuser?userid="+userId); 
//		var url = brmURL + userId;
		
//		http://sthcibpdd1.kaust.edu.sa:50000/kaust.com~sbf~bpm~java~restservices/equipmentforgrade/getequipbygrade?grade=VP
//		http://sthcibpdd1.kaust.edu.sa:50000/kaust.com~sbf~bpm~java~restservices/equipmentforgrade/getequipforuser?userid=
//		var url = "http://sthcibpdd1.kaust.edu.sa:50000/kaust.com~sbf~bpm~java~restservices/equipmentforgrade/getequipforuser?userid="+userId+"";
//		var url = "http://sthcibpdd1.kaust.edu.sa:50000/kaust.com~sbf~bpm~java~restservices/equipmentforgrade/getequipbygrade?grade="+grade+"";
		var busyDialog = new sap.m.BusyDialog();
    	busyDialog.open();
    	var that = this;
		
		$.ajax({
  	      url: url,
  	      async: "false",
  	      type: "GET",
  	      dataType: "jsonp",
  	      contentType: "application/json",
  	      jsonpCallback: "a",
  	   
  	      success: function(data) {
                 busyDialog.close();
//                 that.getView().getModel("helpModel").setProperty("/equipmentList",data.equipmentList);
                 var equip = [];
                 var equipments = new Object();
//                 equipments.packageEquip = "Package 1";
                 var txt = "";
                 var totalPrice = 0;
                 for (var i=0; i<2; i++){
                	 if(data.packages.length>0){
	                	 equipments.packageEquip = data.packages[i].packageName;
	                	 for (var y in data.packages[i].items ){
	                		 txt=txt + data.packages[i].items[y].name + "\n";
	                		 if(data.packages[i].items[y].price=="0.0"){
	                			 totalPrice = totalPrice + 2000;
	                		 }else{
		                		 totalPrice = totalPrice + parseInt(data.packages[i].items[y].price);
	                		 }
	                	 }
	                	 var currency = "";
	                	 if(data.packages[i].items[y].currency==""){
	                		 currency = "SAR";
	                	 }else{
	                		 currency = data.packages[i].items[y].currency;
	                	 }
	                	 
	                	 var priceTxt = "Total: " + currency + " ";
	                	 txt = txt + "_____________"+"\n";
	                	 txt = txt + priceTxt + totalPrice + "\n";
	                	 equipments.totalPrice = totalPrice;
                    	 equipments.equipment = txt;
	                	 equip.push(equipments);
	                	 equipments = new Object();
	                	 totalPrice = 0;
	                	 txt = "";
                	 }
                 }
                 equipments.packageEquip = "Custom Package";
                 equipments.equipment = "";
                 equip.push(equipments);
                 equipments = new Object();
                 equipments.packageEquip = "No device needed";
                 equipments.equipment = "";
                 equip.push(equipments);
                 that.getView().getModel("equipment").setProperty("/equipments",equip);
                 that.getView().getModel("equipment").setProperty("/custItems",data.items);
                 
                 
                 if(approval=="EUC Team Approval"){
                	var oTable = that.getView().byId("equipmentTbl");
                	var rows = oTable.getItems();
                	if(oModel.oData.d.Pack1 == "X"){
                		oTable.setSelectedItem(rows[0]);
                	}else if(oModel.oData.d.Pack2 == "X"){
                		oTable.setSelectedItem(rows[1]);
                	}else if(oModel.oData.d.Zpack == "X"){
                		oTable.setSelectedItem(rows[2]);
                		that.changePack();
                		var equipmentModel =  that.getView().getModel("equipment");
                		var checkedItems = [];
                		if(oModel.oData.d.Lmackair == "X"){
                			checkedItems.push("Macbook Air");
                		}
                		if(oModel.oData.d.Lmackpro == "X"){
                			checkedItems.push("Macbook Pro");
                		}
                		if(oModel.oData.d.Amonitor == "X"){
                			checkedItems.push("Apple monitor");
                		}
                		if(oModel.oData.d.Lprinter == "X"){
                			checkedItems.push("Lexmark Color Printer C543");
                		}
                		if(oModel.oData.d.Lbwprinter == "X"){
                			checkedItems.push("Lexmark W840dn B/W Printer");
                		}
                		if(oModel.oData.d.Hpscanner == "X"){
                			checkedItems.push("HP Scanner Jet 5590");
                		}
                		if(oModel.oData.d.Istation == "X"){
                			checkedItems.push("IMAC workstation");
                		}
                		
                		var rButton = sap.ui.getCore().byId("rButton");
                		if(checkedItems.length>0){
                			if(rButton){
                				for(var i in checkedItems){
                					var item = checkedItems[i];
                					for(var y in rButton.getButtons()){
                						var button = rButton.getButtons()[y];
                						if(button.getText().indexOf(item)!=-1){
                							rButton.setSelectedButton(button);
                						}
                					}
                				}
                    		}
                			
                			
                			for(var i in checkedItems){
                				var item = checkedItems[i];
                				for(var y in equipmentModel.oData.checkBoxes){
                					var checkBox = equipmentModel.oData.checkBoxes[y];
                					if(item==checkBox.name){
                						equipmentModel.oData.checkBoxes[y].checked=true;
                					}
                				}
                			}
                			equipmentModel.updateBindings();
                		}
                		
                		
                		
//                		equipmentModel.oData.checkBoxes
                	}else if(oModel.oData.d.Ndevice == "X"){
                		oTable.setSelectedItem(rows[3]);
                	}
                	
                 }else{
                	 var oTable = that.getView().byId("equipmentTbl");
                 	var rows = oTable.getItems();
                 	oTable.setSelectedItem(rows[0]);
                 }

  	      },
  	      error: function(data) {
  	    	  	busyDialog.close();
  	    	  	jQuery.sap.require("sap.m.MessageBox");
                      sap.m.MessageBox.show(
                        		"Something went wrong, please contact your administrator", {
                        	        icon: sap.m.MessageBox.Icon.ERROR,
                        	        title: "Error",
                        	        actions: [sap.m.MessageBox.Action.OK],
                        	      }
                        	    );
  	   }
  	  });
		
		this.getView().byId("equipmentTbl").setModel(equipmentModel);
		this.getView().byId("equipmentTbl").attachSelectionChange(null, this.changePack, this);
		
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
	
	
	
	changePack : function(evt){
		
		var table = this.getView().byId("equipmentTbl");
		var path = table.getSelectedContextPaths()[0];
		var item = table.getModel().getProperty(path);
		if(item.packageEquip=="Custom Package"){
			this.getView().byId("custTitle").setText("Customize newcomer package");
			var customForm = this.getView().byId("customPack");
			customForm.destroyContent();
			customForm.setVisible(true);
			
			var equipmentModel =  this.getView().getModel("equipment");
			var equipments = equipmentModel.getProperty("/custItems");
			var title = new sap.ui.core.Title({text:""});
			var checkBoxes = [];
			var radioButtons = [];
			var buttons =  new Object();
			var checked = new Object();
			for (var i in equipments){
				var equip = equipments[i];
				var priceTxt = 0;
				if(equip.price=="0.0"){
					priceTxt = 2000;
				}else{
					priceTxt = parseInt(equip.price);
				}
				var currTxt = "";
				if(equip.currency==""){
					currTxt="SAR";
				}else{
					currTxt=equip.currency;
				}
		// fill radiobuttons		
				if(equip.isOneOption){
					buttons =  new Object();
					buttons.name = equip.name;
					buttons.price = priceTxt;
					buttons.currency = currTxt;
					radioButtons.push(buttons);
		//fill checkboxes			
				}else{
					checked = new Object();
					checked.name = equip.name;
					checked.checked = equip.checked;
					checked.price = priceTxt;
					checked.currency = currTxt;
					checkBoxes.push(checked);
//					= new sap.m.CheckBox("box"+i,{text:equipments[i].name});
//					customForm.addContent(content);
				}
//					customForm.addContent(title);
			}
			equipmentModel.setProperty("/radioButtons",radioButtons);
			equipmentModel.setProperty("/checkBoxes",checkBoxes);
			
			if(radioButtons.length>0){
				var rButtonGrp = new sap.m.RadioButtonGroup("rButton",{columns:1});
				for (var i in radioButtons){
					var currencyPrice = " (" + radioButtons[i].currency + " " + radioButtons[i].price + ")";
					var text = radioButtons[i].name + currencyPrice;
					rButtonGrp.addButton(new sap.m.RadioButton({text:text}));
					customForm.addContent(title);
				}
				customForm.addContent(rButtonGrp);
			}
			
			if(checkBoxes.length>0){
				for (var i in equipmentModel.oData.checkBoxes){
					var currencyPrice = " (" + equipmentModel.oData.checkBoxes[i].currency + " " + equipmentModel.oData.checkBoxes[i].price + ")";
					var text = equipmentModel.oData.checkBoxes[i].name + currencyPrice;
					var checkBox = new sap.m.CheckBox({text:text});
					checkBox.setModel(equipmentModel);
//					checkBox.bindProperty("text", text);
					checkBox.bindProperty("selected", "/checkBoxes/" + i + "/checked");
//					{text:equipmentModel.oData.checkBoxes[i].name, selected:equipmentModel.oData.checkBoxes[i].checked}
					customForm.addContent(checkBox);
					customForm.addContent(title);

				}
			}
			
			
		}else{
			this.getView().byId("custTitle").setText("");
			this.getView().byId("customPack").setVisible(false);
		}
		
	},
	
	
	handleAction : function(evt){
	 		
	 		var action = evt.getSource().getText();
	 		var oModel = sap.ui.getCore().byId("app").getModel();
	 		
	 		if(action=="Cancel"){
	 			var docURL = document.URL;
	 			var hostURL = docURL.replace("bpminbox/inbox.html", "");
	 			
	 			window.location = hostURL + "bpminbox/inbox.html";
	 			
	 			return;
	 		}
	 		
	 		var oTable = this.getView().byId("equipmentTbl");
	 		var selectedPath = oTable.getSelectedContexts()[0].sPath;
	 		if((action=="Approve" || action=="Submit") && selectedPath.length==0){
	 			
	 			sap.m.MessageBox.show(
		        		"Please select a package from the table", {
		          	        icon: sap.m.MessageBox.Icon.WARNING,
		          	        title: "Warning",
		          	        actions: [sap.m.MessageBox.Action.OK],
		          	      }
		          	    );
	 			return;
	 		}
	 		
	 		var equipModel = this.getView().getModel("equipment");
	 		var selectedPack = equipModel.getProperty(selectedPath);
	 		
	 		var fName = this.getView().byId("fname");
			var lName = this.getView().byId("lname");
			var kaustID = this.getView().byId("kaustID");
			var email = this.getView().byId("email");
			var pos =  this.getView().byId("jobTitle");
			var depName = this.getView().byId("department");
			var billedCostCenter = this.getView().byId("billedCostCenter");
			var office = this.getView().byId("office");
			var mobile = this.getView().byId("mobile");
	 		
			var comment = this.getView().byId("commentMngr").getValue();
			var helpModel = this.getView("App").getModel("helpModel");
			var taskId = helpModel.getProperty("/taskId");
			var requestId = oModel.oData.d.RequestId; 
			
			if(action=="Reject" && comment==""){
				
				sap.m.MessageBox.show(
		        		"Please add a reason for rejection", {
		          	        icon: sap.m.MessageBox.Icon.ERROR,
		          	        title: "Error",
		          	        actions: [sap.m.MessageBox.Action.OK],
		          	      }
		          	    );
			}else{
				
				var totalPrice = 0;
			
				var data = new Object();
				
				if(action=="Approve"){
					data["Status"] = "012";
				}else if(action=="Correct"){
					data["Status"] = "014";
				}else if(action=="Reject"){
					data["Status"] = "011";
				}else if(action=="Submit"){
					data["Status"] = "001";
				}else{
					data["Status"] = "";
				}
				
				data["UserId"] = oModel.oData.d.UserId;
				data["FirstName"] = fName.getText();
	        	data["LastName"] = lName.getText();
	        	data["KaustId"] = kaustID.getText();
	        	data["Email"] = email.getText();
	        	data["Position"] = pos.getText();
	        	data["Deptname"] = depName.getText();
	        	data["Costcenter"] = billedCostCenter.getText();
	        	data["Office"] = office.getText();
	        	data["Mobile"] = mobile.getText();
	        	
	        	data["RequestId"] = requestId;
	        	
	        	if(selectedPack.packageEquip=="Package 1"){
					data["Pack1"] = "X";
					data["Pname"] = selectedPack.packageEquip;
					totalPrice = parseInt(selectedPack.totalPrice);
				}else if(selectedPack.packageEquip=="Package 2"){
					data["Pack2"] = "X";
					data["Pname"] = selectedPack.packageEquip;
					totalPrice = parseInt(selectedPack.totalPrice);
				}else if(selectedPack.packageEquip=="No device needed"){
					data["Ndevice"] = "X";
				}else if(selectedPack.packageEquip=="Custom Package"){
					data["Zpack"] = "X";
					var rButton = sap.ui.getCore().byId("rButton");
					
				//get selection from radio button	
					if(rButton){
						var selectedOption = rButton.getSelectedButton().getText();
						var radioButs = equipModel.getProperty("/radioButtons");
						for(var i in radioButs){
							var button = radioButs[i];
							if(selectedOption.indexOf(button.name)!=-1){
								totalPrice = totalPrice + parseInt(button.price);
							}
						}
						if(selectedOption.indexOf("Macbook Pro")!=-1){
							data["Lmackpro"] = "X";
						}
						if(selectedOption.indexOf("Macbook Air")!=-1){
							data["Lmackair"] = "X";
						}
						if(selectedOption.indexOf("IMAC")!=-1){
							data["Istation"] = "X";
						}
						if(selectedOption.indexOf("Lexmark Color")!=-1){
							data["Lprinter"] = "X";
						}
						if(selectedOption.indexOf("Apple monitor")!=-1){
							data["Amonitor"] = "X";
						}
						if(selectedOption.indexOf("Lexmark W840dn B/W ")!=-1){
							data["Lbwprinter"] = "X";
						}
						if(selectedOption.indexOf("HP")!=-1){
							data["Hpscanner"] = "X";
						}
						
					}
					
				//get selection from checkboxes
					var checkBoxModel = equipModel.getProperty("/checkBoxes");
					for(var i in checkBoxModel){
						if(checkBoxModel[i].checked){
							switch(checkBoxModel[i].name){
							case("Macbook Pro"):
								data["Lmackpro"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							case("Macbook Air"):
								data["Lmackair"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							case("IMAC"):
								data["Istation"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;	
							case("Lexmark Color"):
								data["Lprinter"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							case("Apple monitor"):
								data["Amonitor"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							case("Lexmark W840dn B/W Printer"):
								data["Lbwprinter"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							case("HP"):
								data["Hpscanner"] = "X";
								totalPrice = totalPrice + parseInt(checkBoxModel[i].price);
								break;
							}
						}
					}
				}
				
				data["ServiceCode"] = "0008";
            	data["SubServiceCode"] = "0005";				
		    	data["Mcomments"] = comment;
		    	data["Wftrigger"] = "X";
		    	
		    	var that = this;
		    	var msg = "";
		    	if((action=="Reject" || action=="Approve")){
		    		jQuery.sap.require("sap.m.MessageBox");
		    		if(action=="Reject" ){
		    			msg = "Are you sure you want to reject this request";
		    		}else if(selectedPack.packageEquip=="No device needed" && action!="Reject"){
		    			msg = "Are you sure you want to submit the request with the No device needed option?";
		    		}else{
		    			msg = "The total value for the equipmet(s) requested is "+ totalPrice + " .Please note this amount will be charged to your cost center";
		    		}
		    		
		    			sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [
		    			    sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], function(oAction) {
		    			     if (sap.m.MessageBox.Action.OK === oAction) {
		    			    	 var obj = JSON.stringify(data);
		    			    	 that.completeTask(taskId,action,obj);
		    			       }
		    			});
		    		
		    	}else if(action=="Submit"){
		    		jQuery.sap.require("sap.m.MessageBox");
		    		if(selectedPack.packageEquip=="No device needed"){
		    			msg = "Are you sure you want to submit the request with the No device needed option?";
		    		}else{
		    			msg = "The total value for the equipmet(s) requested is "+ totalPrice + " .Please note this amount will be charged to your cost center";
		    		}
		    			sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [
		    			    sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], function(oAction) {
		    			     if (sap.m.MessageBox.Action.OK === oAction) {
		    			    	 	action="Approve";
		    			    		var obj = JSON.stringify(data);
		    			    		that.completeTask(taskId,action,obj);
		    			       }
		    			});
						
					}
		    		
		    		
		    	}
			
	 },
	 
	 
	 submitRequest: function(data,requestId){
		 
		 var busyDialog = new sap.m.BusyDialog();
 	 	busyDialog.open();
		 	
		 	var token = this.getGateWayToken();
		 	var requestURL = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Equipment(RequestId='"+requestId+"',KaustId='')");
		 	
		 	$.ajax({
		         url: requestURL,
		         dataType: 'json',
		         contentType: "application/json",
		         async: false,
		         data: data,
		         type: "PUT",
		         
		 
		   beforeSend: function(xhr){  
		             xhr.setRequestHeader("X-CSRF-Token", token); 
		   }, 
		         
		         success: function(oResponse, textStatus, jqXHR) {
		        	 busyDialog.close();
		         	jQuery.sap.require("sap.m.MessageBox");
		         	
		             sap.m.MessageBox.show(
		             		"Thank you for your request. Your Request id is:'"+oResponse.d.RequestId+"'.Please note it for future references", {
		             	        icon: sap.m.MessageBox.Icon.SUCCESS,
		             	        title: "Success",
		             	        actions: [sap.m.MessageBox.Action.OK]
		             	      }
		             	    );
		
		         	
//		         	that.getView().byId("submitButton").setEnabled(false);
		               
		         },
		         error: function(jqXHR, textStatus, errorThrown){
		        	 busyDialog.close();
		         	jQuery.sap.require("sap.m.MessageBox");
		               if(textStatus==="timeout") {
		             	  
		                   sap.m.MessageBox.show(
		                     		"Connection timed out", {
		                     	        icon: sap.m.MessageBox.Icon.ERROR,
		                     	        title: "Error",
		                     	        actions: [sap.m.MessageBox.Action.OK],
		//                     	        styleClass: bCompact ? "sapUiSizeCompact" : ""
		                     	      }
		                     	    );
		             	  
		//                      sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");      
		//             	  	   sap.m.MessageBox.alert("Connection timed out", null, "Error");                                   
		
		               } else {
		                      jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status +"," + jqXHR.statusText);
		
		               };
		         },
		         complete: function(){
		         }
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