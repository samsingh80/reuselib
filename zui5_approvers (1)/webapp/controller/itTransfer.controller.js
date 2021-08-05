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
kaust.ui.kits.approvers.util.MainController.extend("com.kaust.zui5approvers.controller.itTransfer", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf zui5_replenish.App
	 */
	onInit: function () {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		this.getMultiFieldsReadOnly(requestId);

		var approver = oModel.oData.d.Stage;
		//    this.getView().byId("comment").setValue(oModel.oData.d.);

		var oDataURLKits = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/";
		var oModelKits = new sap.ui.model.odata.ODataModel(oDataURLKits);

		this.getView().setModel(oModelKits, "Kits");
		var disData = oModel.oData.d.Replenishitem.split("#");
		var disKey = oModel.oData.d.Equipnum.split("#");
		var disBrName = oModel.oData.d.BORROWER_NAME.split("#");
		//Set the borrower information in all the stages
		//  this.getView().byId("borrowerText").setValue(oModel.oData.d.BORROWER_NAME)
		if (approver == "Recipient Line Manager Approval") {
			this.getView().byId("toolbarJust").setVisible(true);
			this.getView().byId("reqDetails").setVisible(true);
			this.getView().byId("comment").setValue(oModel.oData.d.Managernotes);
			//      this.getView().byId("comment").setValue(oModel.oData.d.);
		} else if (approver == "Recipient Approval") {
			if (disData.length === 1) {
				this.getView().byId("idHboxVisible").setVisible(false);
			} else {
				this.getView().byId("idHboxVisible").setVisible(true);
			}
			this.getView().byId("toolbarJust").setVisible(true);
			this.getView().byId("newComment").setText("Recipient Notes");
			this.getView().byId("reqDetails").setVisible(true);
			this.getView().byId("comment").setValue(oModel.oData.d.Recmannotes);
			this.getView().byId("disclToolbar").setVisible(true);
			this.getView().byId("disclaimer2Box").setVisible(true);

			var searchModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(searchModel, "searchModel");
		}
		//Roopali(INCTURE - 12-12-2018) - line manager notes(KS-20)
		else if (approver == "Line Manager Approval") {
			this.getView().byId("toolbarJust").setVisible(true);
			this.getView().byId("reqDetails").setVisible(true);
			this.getView().byId("comment").setValue(oModel.oData.d.mcomments);
		}
		var tabdata = [];
		if (disData.length > 0 && disKey.length > 0) {
			for (var i = 0; i < disData.length; i++) {
				var arr = {};
				arr.dis = disData[i];
				arr.key = disKey[i];
				arr.borName = disBrName[i];
				tabdata.push(arr);
			}
		}
		var ojson = {
			res: tabdata
		};
		this.getView().setModel(new sap.ui.model.json.JSONModel(ojson), "res");
	},

	onItemSelected: function () {
		var oAllSelect = this.getView().byId("idTbChk").getSelected();
		var oTable = this.getView().byId("idTransferIT");
		var oitems = oTable.getItems();
		if (oAllSelect) {
			for (var i = 0; i < oitems.length; i++) {
				oitems[i].getCells()[2].getItems()[0].setEnabled(false);
				oitems[i].getCells()[3].getItems()[0].setEnabled(false);
			}
			this.getView().byId("idChk").setEnabled(true);
			this.getView().byId("idBtn").setEnabled(true);
		} else {
			for (var i = 0; i < oitems.length; i++) {
				oitems[i].getCells()[2].getItems()[0].setEnabled(true);
				oitems[i].getCells()[3].getItems()[0].setEnabled(true);
			}
			this.getView().byId("idChk").setEnabled(false);
			this.getView().byId("idBtn").setEnabled(false);
		}
	},

	getMultiFieldsReadOnly: function (requestId) {

		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment?$filter=RequestId eq '" + requestId + "'");
		var result = "";

		var multiModel = new sap.ui.model.json.JSONModel();

		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: "GET",
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				result = oResponse;
				multiModel.setData(result.d.results);
			},
			error: function (jqXHR, textStatus, errorThrown) {

				if (textStatus === "timeout") {

					sap.m.MessageBox.show(
						"Connection timed out", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						}
					);
				} else {

					sap.m.MessageBox.show(
						"The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						}
					);
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
						.statusText);
				};
			},

		});

		// var items = "";
		// var tagNumbers = "";
		// var persons = result.d.results;

		// for (var i in persons) {
		// if (persons[i].Replenishitem != "") {
		// items = items + persons[i].Replenishitem + "\n";
		// }
		// if (persons[i].Equipnum != "") {
		// tagNumbers = tagNumbers + persons[i].Equipnum + "\n";
		// }

		// }
		// this.getView().byId("labelItem").setText(items);
		// this.getView().byId("labelNo").setText(tagNumbers);
		this.getView().setModel(multiModel, "multiModel");
	},

	showConfirmWindow: function (evt) {

		//show Confirmation popup
		var oModel = sap.ui.getCore().byId("app").getModel();
		var action = evt.getSource().getText();
		var approver = oModel.oData.d.Stage;

		//    if(approver!="Line Manager Approval" || action!="Approve"){
		if (action != "Approve") {
			this.handleAction(action);
			return;
		}

		var deptName = oModel.oData.d.Deptname;
		var tDeptName = oModel.oData.d.TDeptname;

		var equipment = oModel.oData.d.Replenishitem.split("#");
		var equipNum = oModel.oData.d.Equipnum.split("#");
		var equipDetails = "";
		if (equipment.length > 0) {
			for (var de = 0; de < equipment.length; de++) {
				equipDetails = equipDetails + "\n" + equipNum[de] + " - " + equipment[de];
			}
		} else {
			equipDetails = equipment + " - " + equipNum;
		}

		var requestorName = oModel.oData.d.FirstName + " " + oModel.oData.d.LastName;
		var recieverName = oModel.oData.d.TFirstName + " " + oModel.oData.d.TLastName;

		var msg = "";

		if (approver == "Line Manager Approval") {
			if (deptName != tDeptName) {
				msg = "By clicking 'OK', " +
					"I agree to transfer the equipment " + equipDetails +
					"\n which was billed to my cost center from " + requestorName + " to " + recieverName;
			} else {
				msg = "By clicking 'OK', " +
					"I agree to transfer the equipment " + equipDetails +
					"\n from " + requestorName + " to " + recieverName;
			}
		} else if (approver == "Recipient Approval") {
			msg = "By clicking 'OK', I acknowledge receiving the equipment " + equipDetails +
				"\n from " + requestorName;
		} else if (approver === "Recipient Line Manager Approval") {
			msg = "By clicking 'OK', " +
				"I agree to transfer the equipment " + equipDetails +
				"\n which will be billed to my cost center from " + requestorName + " to " + recieverName;
		}

		if (msg != "") {
			var that = this;
			if (equipment.length < 7) {
				sap.m.MessageBox.show(msg,
					sap.m.MessageBox.Icon.QUESTION,
					"Confirmation", [
						sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
					],
					function (oAction) {
						if (sap.m.MessageBox.Action.OK === oAction) {
							that.handleAction(action);
						}
					});
			} else {
				sap.m.MessageBox.show(msg,
					sap.m.MessageBox.Icon.QUESTION,
					"Confirmation", [
						sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL
					],
					function (oAction) {
						if (sap.m.MessageBox.Action.OK === oAction) {
							that.handleAction(action);
						}
					}, "msgClass");
			}
		} else {
			this.handleAction(action);
		}
	},

	handleAction: function (action) {

		var oModel = sap.ui.getCore().byId("app").getModel();
		var approver = oModel.oData.d.Stage;

		var disclaimer = this.getView().byId("disclaimer2").getSelected();
		//Roopali(INCTURE- 19-11-2018)- added "action !== "Reject" " because check is not needed while rejecting the request
		if (!disclaimer && approver == "Recipient Approval" && action !== "Reject") {
			sap.m.MessageBox.show("Please accept the obligatory acknowledgment for transfering IT equipment", {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error",
				actions: [sap.m.MessageBox.Action.OK],
			});
			return;
		}

		var multiModel = this.getView().getModel("multiModel");
		var firstItem = multiModel.oData;

		var allItems = multiModel.oData.length;
		var itemName = "";
		var itemKey = "";
		var itemCat = "";
		var itemBilled = "";

		for (var oItem = 0; oItem < allItems; oItem++) {
			itemName = firstItem[oItem].Replenishitem + "&&" + itemName;
			itemKey = firstItem[oItem].Equipnum + "&&" + itemKey;
			itemCat = firstItem[oItem].Equipcat + "&&" + itemCat;
			itemBilled = firstItem[oItem].Equipbilled + "&&" + itemBilled;
		}

		var comment = this.getView().byId("commentMngr").getValue();
		var helpModel = this.getView("App").getModel("helpModel");
		var taskId = helpModel.getProperty("/taskId");
		var requestId = helpModel.getProperty("/requestId");

		if ((action == "Correct" || action == "Reject") && comment == "") {

			sap.m.MessageBox.show(
				"Please add a reason for rejection", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK]
				}
			);
		} else {

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

			data["UserId"] = oModel.oData.d.UserId;

			data["Replenishitem"] = itemName;
			data["Equipcat"] = itemCat;
			data["Equipnum"] = itemKey;
			data["Equipbilled"] = itemBilled;

			data["Recuserid"] = oModel.oData.d.Recuserid;
			data["TFirstName"] = oModel.oData.d.TFirstName;
			data["TLastName"] = oModel.oData.d.TLastName;
			data["TKaustId"] = oModel.oData.d.TKaustId;
			data["TEmail"] = oModel.oData.d.TEmail;
			data["TPosition"] = oModel.oData.d.TPosition;
			data["TDeptname"] = oModel.oData.d.TDeptname;
			data["TCostcenter"] = oModel.oData.d.TCostcenter;
			data["TOffice"] = oModel.oData.d.TOffice;
			data["TMobile"] = oModel.oData.d.TMobile;
			data["TOTAL_EQUIP"] = oModel.oData.d.TOTAL_EQUIP;
			data["SEND_MAN"] = oModel.oData.d.SEND_MAN;
			data["REC_MAN"] = oModel.oData.d.REC_MAN;
			data["DMANAGERID"] = oModel.oData.d.DMANAGERID;
			data["REC_MANAGERID"] = oModel.oData.d.REC_MANAGERID;

			data["Justification"] = oModel.oData.d.Justification;

			data["IT_SUPPORT"] = oModel.oData.d.IT_SUPPORT;
			data["IT_SUPPORT_TXT"] = oModel.oData.d.IT_SUPPORT_TXT
			if (approver == "Recipient Approval") {
				var oTable = this.getView().byId("idTransferIT");
				var oAllSelect = this.getView().byId("idTbChk").getSelected();
				var oitems = oTable.getItems();
				if (oAllSelect) {
					if (this.getView().byId("idChk").getSelected()) {
						data["BORROWER_ID"] = "";
						data["BORROWER_NAME"] = "K33PME";
					} else if (this.getView().getModel("searchModel")) {
						if (this.getView().getModel("searchModel").oData.d) {
							var borrowedByKaustID = this.getView().getModel("searchModel").oData.d.KaustID;
							var borrowedByName = this.getView().getModel("searchModel").oData.d.FirstName + " " + this.getView().getModel("searchModel").oData
								.d.LastName;
							data["BORROWER_ID"] = borrowedByKaustID;
							data["BORROWER_NAME"] = borrowedByName;
						}
					} else {
						data["BORROWER_ID"] = "";
						data["BORROWER_NAME"] = "NO_ONE";
					}
				} else {
					var bn = "",
						bkid = "";
					for (var i = 0; i < oitems.length; i++) {
						var txname = oitems[i].getCells()[2].getItems()[1].getText();
						if (oitems[i].getCells()[3].getItems()[0].getSelected()) {
							bn = bn + "&&" + "K33PME";
							bkid = bkid + "&&" + "";
						} else if (txname) {
							var tx = oitems[i].getCells()[2].getItems()[1].getText().split("-");
							bn = bn + "&&" + tx[1];
							bkid = bkid + "&&" + tx[0];
						} else {
							bkid = bkid + "&&" + "";
							bn = bn + "&&" + "NO_ONE";
						}
					}
					data["BORROWER_ID"] = bkid.substring(2);
					data["BORROWER_NAME"] = bn.substring(2);
				}
			} else {
				data["BORROWER_ID"] = "";
				data["BORROWER_NAME"] = "";
			}
			if (action == "Approve") {
				data["Status"] = oModel.oData.d.Status;
			} else if (action == "Correct") {
				data["Status"] = "014";
			} else if (action == "Reject") {
				data["Status"] = "011";
			} else if (action == "Submit") {
				data["Status"] = "001";
			} else {
				data["Status"] = "";
			}

			data["RequestId"] = requestId;
			data["Itmsequence"] = 1;

			if (approver == "Recipient Line Manager Approval") {
				data["Recmannotes"] = comment;
			} else if (approver == "Recipient Approval") {
				data["Empnote"] = comment;
			} else if (approver == "Line Manager Approval") {
				var lblCmt = this.getView().byId("labelComments").getText();
				if (lblCmt) {
					data["mcomments"] = lblCmt;
				} else {
					data["mcomments"] = comment;
				}
			}

			data["Wftrigger"] = "X";

			//        var obj = JSON.stringify(data);

			//        Edited by Darshna - 25th October 2017 : START
			//        Calling the oData Service first then the BPM task
			//      this.completeTransfer(taskId,action,data);
			this.updateRequest(data, taskId, action);
			//        Edited by Darshna - 25th October 2017 : END

		}
	},

	chkBoxSelect: function (oEvent) {
		var btnId = "",
			txtId = "",
			ctxtId = "";
		if (oEvent.getParameter("id").includes("__box0")) {
			btnId = "__button0" + oEvent.getParameter("id").replace("__box0", "");
			txtId = "__text10" + oEvent.getParameter("id").replace("__box0", "");
			if (sap.ui.getCore().byId(oEvent.getParameter("id")).getSelected()) {
				sap.ui.getCore().byId(btnId).setEnabled(false);
				sap.ui.getCore().byId(txtId).setText("");
			} else {
				sap.ui.getCore().byId(btnId).setEnabled(true);
				sap.ui.getCore().byId(txtId).setText("");
			}
		} else {
			var sel = oEvent.getParameter("selected");
			if (sel === true) {
				this.getView().byId("idBtn").setEnabled(false);
			} else {
				this.getView().byId("idBtn").setEnabled(true);
			}
		}
	},

	completeTransfer: function (taskId, decisionKey, dataPost, requestId) {
		var urlCompleteTask = this.getUrl("/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='" + taskId + "'&DecisionKey='" +
			decisionKey + "'");
		var approveButton = this.getView().byId("approveButton");
		var rejectButton = this.getView().byId("rejectButton");
		//     var correctButton = this.getView().byId("correctButton");
		var token = this.getGateWayToken();
		var data = "";
		var that = this;
		$.ajax({
			url: urlCompleteTask,
			dataType: 'json',
			async: false,
			type: "POST",
			data: data,
			cache: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-CSRF-Token", token);
			},

			success: function (oResponse, textStatus, jqXHR) {
				var data = oResponse;
				//                         Edited by Darshna 25 October: START
				//                         Commented as first OData service to be called then BPM
				//                         that.updateRequest(dataPost);
				//                         Edited by Darshna 25 October: END
				if (decisionKey == "Approve") {

					sap.m.MessageBox.show(
						"The request has been successfully Approved", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: [sap.m.MessageBox.Action.OK],
							// 	                           	        styleClass: bCompact? "sapUiSizeCompact" : ""
						}
					);
				} else {
					sap.m.MessageBox.show(
						"The request has been Rejected", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: [sap.m.MessageBox.Action.OK],
							// 	                           	        styleClass: bCompact? "sapUiSizeCompact" : ""
						}
					);
				}

				approveButton.setVisible(false);
				rejectButton.setVisible(false);
				//                         correctButton.setVisible(false);

			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (textStatus === "timeout") {
					sap.m.MessageBox.show(
						"Connection timed out", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							//                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
					//                                sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");                             
				} else {
					sap.m.MessageBox.show(
						"The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							//                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," +
						jqXHR
						.statusText);
					//                                sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
				};
			},
			complete: function () {

			}
		});

	},

	updateRequest: function (data, taskId, action) {

		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();

		var oModelKits = this.getView().getModel("Kits");
		var that = this;
		oEntryData = data;
		var utext = "Transferequipment(RequestId='" + data.RequestId + "',KaustId='" + data.KaustId + "')";

		oModelKits.update(utext, oEntryData, null, function (response) {
			busyDialog.close();
			//          Edited by Darshna 25 October: START
			//          Commented as first OData service to be called then BPM
			that.completeTransfer(taskId, action, data);
			//          Edited by Darshna 25 October: END
			//      window.open('','_self').close();
			window.parent.close();
		}, function () {
			busyDialog.close();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
				"Request creation failed", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
				}
			);
			return;
		});
	},

	handlePick: function (oEvent) {
		var reqId = "";
		if (oEvent.getParameter("id").includes("__button0")) {
			reqId = "__text10" + oEvent.getParameter("id").replace("__button0", "");
		}
		var oDialog1 = new sap.m.Dialog("pickDialog");
		oDialog1.setTitle("People search");
		var that = this;
		var simpleForm = new sap.ui.layout.form.SimpleForm({

			maxContainerCols: 2,
			content: [
				new sap.m.Label({
					text: "KAUST badge number",
					required: true
				}),
				new sap.m.Input({
					id: "inputSearch"
				}),
				new sap.m.Button({
					text: "Search",
					icon: "sap-icon://search",
					press: function (evt) {

						var param = sap.ui.getCore().byId("inputSearch").getValue();
						var requestor = that.getView().getModel("helpModel").getProperty("/kaustId");

						if (param != "") {
							if (param == requestor) {
								jQuery.sap.require("sap.m.MessageBox");

								sap.m.MessageBox.show(
									"Please select different user then yourself", {
										icon: sap.m.MessageBox.Icon.WARNING,
										title: "Warning",
										actions: [sap.m.MessageBox.Action.OK],
									}
								);
								return;
							}

							var sUrl = that.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + param + "',UserId='')");
							var form = sap.ui.getCore().byId("sForm2");
							var dialog = sap.ui.getCore().byId("pickDialog");
							var pickButton = sap.ui.getCore().byId("pickButton");

							//-- Search by KAUST ID --\\

							$.ajax({
								url: sUrl,
								dataType: 'json',
								contentType: "application/json",
								async: false,
								type: "GET",

								success: function (oResponse, textStatus, jqXHR) {
									//--User Found--\\
									if (oResponse.d.KaustID != "") {

										//                                if(oResponse.d.Type.toUpperCase()!="STAFF" && oResponse.d.Type.toUpperCase()!="FACULTY" && oResponse.d.Type.toUpperCase()!="STUDENT" && oResponse.d.Type.toUpperCase()!="POST DOCTORAL FELLOW"){
										// SJAYAB - Begin - Condition Commented as requested by Najran on 23rd July 2019
										//                                  if(oResponse.d.Type.toUpperCase()=="STAFF" || oResponse.d.Type.toUpperCase()=="FACULTY" || oResponse.d.Type.toUpperCase()=="POST DOCTORAL FELLOW" || oResponse.d.Type.toUpperCase()=="STUDENT"){
										//
										//                                    jQuery.sap.require("sap.m.MessageBox");
										//                                      
										//                                        sap.m.MessageBox.show(
										//                                              "Equipment could be borrowed only to a KAUST PTSA/Contractor, please pick another person", {
										//                                                    icon: sap.m.MessageBox.Icon.ERROR,
										//                                                    title: "Error",
										//                                                    actions: [sap.m.MessageBox.Action.OK],
										//                                                  }
										//                                                );
										//                                          pickButton.setEnabled(false);
										//                                          dialog.removeContent(form);
										//                                          return;
										//                                }
										// SJAYAB - End - Condition Commented as requested by Najran on 23rd July 2019
										var oModel = that.oView.getModel("searchModel");
										oModel.setData(oResponse);
										form.setModel(oModel);
										pickButton.setEnabled(true);
										dialog.addContent(form);
										//--User Not Found--\\
									} else {
										jQuery.sap.require("sap.m.MessageBox");

										sap.m.MessageBox.show(
											"No such user found", {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.OK],
											}
										);
										pickButton.setEnabled(false);
										dialog.removeContent(form);

									}
								},
								error: function (jqXHR, textStatus, errorThrown) {
									jQuery.sap.require("sap.m.MessageBox");
									if (textStatus === "timeout") {

										sap.m.MessageBox.show(
											"Connection timed out", {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.OK],
											}
										);

									} else {
										sap.m.MessageBox.show(
											"The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText, {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.OK],
											}
										);
										jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," +
											jqXHR.statusText);

									};
								},
							});

							//                      oDialog1.addContent(simpleForm2);
						} else {
							jQuery.sap.require("sap.m.MessageBox");

							sap.m.MessageBox.show(
								"Please define a user name", {
									icon: sap.m.MessageBox.Icon.WARNING,
									title: "Warning",
									actions: [sap.m.MessageBox.Action.OK],
								}
							);
						}
					}
				})

			]

		});

		var simpleForm2 = new sap.ui.layout.form.SimpleForm({
			id: "sForm2",
			title: [
				new sap.ui.core.Title({
					text: "Search result"
				})
			],
			visible: true,
			maxContainerCols: 2,
			content: [
				new sap.m.Label({
					text: "First Name"
				}),
				new sap.m.Text({
					text: "{/d/FirstName}"
				}),
				new sap.m.Label({
					text: "Last Name"
				}),
				new sap.m.Text({
					text: "{/d/LastName}"
				}),
				new sap.m.Label({
					text: "Email"
				}),
				new sap.m.Text({
					text: "{/d/Email}"
				}),
				new sap.m.Label({
					text: "Mobile No."
				}),
				new sap.m.Text({
					text: "{/d/Mobile}"
				}),
				new sap.m.Label({
					text: "Office Tel."
				}),
				new sap.m.Text({
					text: "{/d/Office}"
				}),
				new sap.m.Label({
					text: "Cost Center"
				}),
				new sap.m.Text({
					text: "{/d/Costcenter}"
				})
			]

		});

		oDialog1.addContent(simpleForm);

		// Pick the user from the search and copy it to main sceen

		oDialog1.addButton(new sap.m.Button({
			id: "pickButton",
			enabled: false,
			text: "Pick",
			type: "Accept",
			icon: "sap-icon://cause",
			press: function () {
				var searchModel = that.oView.getModel("searchModel");
				if (reqId) {
					sap.ui.getCore().byId(reqId).setText(searchModel.oData.d.KaustID + "-" + searchModel.oData.d.FirstName + " " + searchModel.oData
						.d.LastName);
					that.byId("borrowerLabel").setVisible(false);
					that.byId("borrowerText").setVisible(false);
				} else {
					that.byId("borrowerLabel").setVisible(true);
					that.byId("borrowerText").setVisible(true).setText(searchModel.oData.d.FirstName + " " + searchModel.oData.d.LastName);
				}
				oDialog1.destroy();
			}
		}));

		// Cancel the popUP

		oDialog1.addButton(new sap.m.Button({
			text: "Cancel",
			icon: "sap-icon://sys-cancel",
			type: "Reject",
			press: function () {
				sap.ui.getCore().byId("sForm2").destroy();
				oDialog1.destroy();

			}
		}));

		oDialog1.open();

	},

	goBack: function () {
		window.history.go(-1);
	}

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf zui5_replenish.App
	 */
	//  onBeforeRendering: function() {
	//
	//  },

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf zui5_replenish.App
	 */
	//  onAfterRendering: function() {
	//
	//  },

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf zui5_replenish.App
	 */
	//  onExit: function() {
	//
	//  }

});
});
    