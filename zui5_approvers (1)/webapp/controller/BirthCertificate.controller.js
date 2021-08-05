sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

//Dikhu edit starts
sap.ui.controller("com.kaust.zui5approvers.controller.BirthCertificate", {
	//Dikhu edit ends
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf zui5_approvers.BirthCertificate
	 */
	onInit: function () {
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}

		var that = this;
		var oModel = this.getOwnerComponent().getModel("GASC_HeaderModel");
		var helpModel = this.getOwnerComponent().getModel("helpModel");
        var requestId = helpModel.getProperty("/requestId");
        var oData = oModel.getData();
		var subserviceCode = oData.subServiceCode;
		var kaustId = oData.KaustId;
        var data = [];
        subserviceCode == "0302";
		if (subserviceCode == "0302") {
			data = oData.HeaderToBC.results;
		} else if (subserviceCode == "0206") {
			data = oData.HeaderToDHS.results;
		}

		if (data != null) {
			var nations;
			var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
			oNatModel.read("/COUNTRY", {
				async: false,
				success: function (oData, response) {
					nations = oData.results;
				}
			});
			for (var nt = 0; nt < data.length; nt++) {
				for (var ct = 0; ct < nations.length; ct++) {
					if (data[nt].Bcountry === nations[ct].LAND1) {
						oData.HeaderToBC.results[nt].bcountry = nations[ct].LANDX;
					}
				}
			}
			var t = this;
			var data1;
			var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
			filesData.read("/FileRead?$filter=UNIQUE_ID eq '" + requestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '13'", {
					async: false,
					success: function (oData) {
						data1 = oData.results;
						var seqnums = [];
						for (var bc = 0; bc < data1.length; bc++) {
							seqnums.push(data1[bc].FILENAME.split("-")[1]);
						}
						var uniqueNames = [];
						$.each(seqnums, function (i, el) {
							if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
						});
						for (bc = 0; bc < uniqueNames.length; bc++) {
							var u = "";
							for (var h = 0; h < data1.length; h++) {
								var filename = data1[h].FILENAME.split("-");
								if (filename[1] === uniqueNames[bc]) {
									if (filename[0] === "ARABIC") {
										u = u + "<a href=" + data1[h].URL + "><strong>Arabic Notice</strong></a><br>";
									} else if (filename[0] === "ENGLISH") {
										u = u + "<a href=" + data1[h].URL + "><strong>English Notice</strong></a><br>";
									}
								}
							}
							data[bc].urls = u;
						}
					}
				});

			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			this.getView().byId("idTable").setModel(oUserModel, 'oUserModel');
			this.getView().byId("idRequesterForm").setModel(oUserModel, 'oUserModel');
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='" + kaustId + "',UserId='')", null, null, false, function (oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel, 'Details');
			});
			this.getView().setModel(oGASCModel, "oGASCModel");
			var hederData = oModel.getData().d.results[0];
			oUserModel.setProperty("/oUserData", hederData);

			var afilters = [];
			var afilter = new sap.ui.model.Filter("KaustId", sap.ui.model.FilterOperator.EQ, "");
			afilters.push(afilter);
			var tableId = this.getView().byId("idTable");
			tableId.getBinding("items").filter(new sap.ui.model.Filter({
				filters: afilters,
				and: true
			}), "Application");
		}

		//	this.handleVerify();
	},

	fnDepRowSelection: function (evt) {
		var item = evt.getParameter("listItem");
		var itemForm = this.getView().byId("idBirthCertificateDetails");
		itemForm.setBindingContext(item.getBindingContext());
	},

	formatRequestType: function (requestType) {
		if (requestType == "replacement") {
			return "Replacement";
		} else {
			return "Issue";
		}
	},

	formatDisplayDate: function (sVal) {
		if (!sVal) return;
		var sParsedDate = new Date(parseInt(sVal.split("(")[1].split(")")[0]));
		var dateFormat = sap.ui.core.format.DateFormat.getInstance({
			pattern: "MMM d, y"
		});
		return dateFormat.format(sParsedDate);
	},

	displayBirthInfoDetail: function (sVal) {
		if (sVal == "0302") {
			return true;
		} else {
			return false;
		}
	},

	displaySponsorDetail: function (sVal) {
		if (sVal == "0206") {
			return true;
		} else {
			return false;
		}
	},

	// handleVerify: function () {
	// 	var userData = this.getView().byId("idRequesterForm").getModel("oUserModel");
	// 	var userHeader = userData.getProperty("/oUserData");
	// 	var rows = this.getView().byId("idTable").getAggregation("items");
	// 	var c = 0;
	// 	if (rows.length > 0) {
	// 		for (var i = 0; i < rows.length; i++) {
	// 			var engfName = rows[i].getCells()[0].getItems()[0].getText();
	// 			var arafName = rows[i].getCells()[0].getItems()[2].getValue();
	// 			if (engfName && !arafName) {
	// 				rows[i].getCells()[0].getItems()[2].setValueState("Error");
	// 				c = c + 1;
	// 			} else {
	// 				rows[i].getCells()[0].getItems()[2].setValueState("None");
	// 			}

	// 			var engmName = rows[i].getCells()[1].getItems()[0].getText();
	// 			var aramName = rows[i].getCells()[1].getItems()[2].getValue();
	// 			if (engmName && !aramName) {
	// 				rows[i].getCells()[1].getItems()[2].setValueState("Error");
	// 				c = c + 1;
	// 			} else {
	// 				rows[i].getCells()[1].getItems()[2].setValueState("None");
	// 			}

	// 			var englName = rows[i].getCells()[2].getItems()[0].getText();
	// 			var aralName = rows[i].getCells()[2].getItems()[2].getValue();
	// 			if (englName && !aralName) {
	// 				rows[i].getCells()[2].getItems()[2].setValueState("Error");
	// 				c = c + 1;
	// 			} else {
	// 				rows[i].getCells()[2].getItems()[2].setValueState("None");
	// 			}
	// 		}

	// 		if (c != 0) {
	// 			return false;
	// 		} else {
	// 			return true;
	// 		}
	// 	}
	// },

	handleAction: function (evt) {
		var oModel = this.getOwnerComponent().getModel("GASC_HeaderModel");
		var userData = this.getView().byId("idRequesterForm").getModel("oUserModel");
		var userHeader = userData.getProperty("/oUserData");
		var userLineItem = userData.getProperty("/oUserDep");
		var action = evt.getSource().getText();
		var helpModel = this.getOwnerComponent().getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		// if (this.handleVerify()) {
		// 	var rows = this.getView().byId("idTable").getAggregation("items");
		// 	var oGASCModel = this.getView().getModel("oGASCModel");
		// 	for (var i = 0; i < rows.length; i++) {
		// 		var date = new Date(parseInt(userHeader.HeaderToBC.results[i].birthDate.split("(")[1].split(")")[0]));
		// 		var birthDate = date.getFullYear() + "" + ("0" + (date.getMonth() + 1)).slice(-2) + "" + ("0" + date.getDate()).slice(-2);
		// 		var arr = {
		// 			"Request_ID": userHeader.HeaderToBC.results[i].Request_ID,
		// 			"AFname": rows[i].getCells()[0].getItems()[2].getValue(),
		// 			"AMname": rows[i].getCells()[1].getItems()[2].getValue(),
		// 			"ALname": rows[i].getCells()[2].getItems()[2].getValue(),
		// 			"Fname": userHeader.HeaderToBC.results[i].Fname,
		// 			"Mname": userHeader.HeaderToBC.results[i].Mname,
		// 			"Lname": userHeader.HeaderToBC.results[i].Lname,
		// 			"Relationship": userHeader.HeaderToBC.results[i].Relationship,
		// 			"IsDepNew": userHeader.HeaderToBC.results[i].IsDepNew,
		// 			"SequenceNumber": userHeader.HeaderToBC.results[i].SequenceNumber,
		// 			"subServiceCode": "0302",
		// 			"birthDate": new Date(birthDate.substring(4, 6) + "/" + birthDate.substring(6, 8) + "/" + birthDate.substring(0, 4)),
		// 			"Gender": userHeader.HeaderToBC.results[i].Gender,
		// 			"nationId": userHeader.HeaderToBC.results[i].nationId,
		// 			"Nationality": userHeader.HeaderToBC.results[i].Nationality,
		// 			"Collectionmtd": userHeader.HeaderToBC.results[i].Collectionmtd,
		// 			"Deliverymtd": userHeader.HeaderToBC.results[i].Deliverymtd
		// 		};
		// 		oGASCModel.update("BirthCertificationSet(KaustId='',Request_ID='" + requestId + "')", arr, null, function (response) {},
		// 			function () {
		// 				return;
		// 			});
		// 	}
		// } else {
		// 	sap.m.MessageBox.show(
		// 		"Please enter Arabic Names", {
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			title: "Error",
		// 			actions: [sap.m.MessageBox.Action.OK],
		// 		}
		// 	);
		// 	return;
		// }
		var subServiceCode = userLineItem[0].subServiceCode;
		var relationType = "Child";
		if (subServiceCode == "0206") {
			relationType = "DH";
		}
		var that = this;
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		if (action == "Reject") {
			if (mngrComment == "") {
				sap.m.MessageBox.show(
					"Please add a reason for rejection", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			} else {
				var oGASCModel = this.getView().getModel("oGASCModel");
				oGASCModel.read("/GASC_HeaderSet?$filter=Request_ID  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
					var aData = rdata.results[0];
					aData.Comments = mngrComment;
					aData.t_name = "Graduate Affairs Approver";
					delete aData["HeaderToBC"];
					delete aData["__metadata"];
					oGASCModel.update("/GASC_HeaderSet(Request_ID='" + requestId + "')", aData, {
						success: function (data, response) {
							that.completeTheGASCTask(taskId, action);
						},
						error: function (oError) {}
					});
				});
			}

		} else {
			var lineItemLength = userLineItem.length;
			var noKaustIdUsers = [];
			for (var i = 0; i < userLineItem.length; i++) {
				if (!userLineItem[i].KaustId) {
					noKaustIdUsers.push(userLineItem[i]);
				}
			}
			var count = 0;
			var noKaustIdUsersLength = noKaustIdUsers.length;
			for (var i = 0; i < noKaustIdUsersLength; i++) {
				count = count + 1;
				var date = new Date(parseInt(noKaustIdUsers[i].birthDate.split("(")[1].split(")")[0]));
				var birthDate = date.getFullYear() + "" + ("0" + (date.getMonth() + 1)).slice(-2) + "" + ("0" + date.getDate()).slice(-2);
				var obj = {
					"KaustId": userHeader.KaustId,
					"arrivalDaTE": "",
					"iqamaExpiryDate": "",
					"iqamaNumber": noKaustIdUsers[i].IqamaNo,
					"nationalIdExpiryDate": "",
					"nationalIdNumber": "",
					"passportIssuedPlace": "",
					"passportExpiryDate": "",
					"passportIssuedDate": "",
					"passportNumber": noKaustIdUsers[i].Passport,
					"expectedReloDate": "",
					"dependentRelocate": "YES",
					"nationality": noKaustIdUsers[i].Nationality,
					"birthDate": birthDate,
					"sex": noKaustIdUsers[i].Gender,
					"thirdName": "",
					"secondName": noKaustIdUsers[i].Mname,
					"firstName": noKaustIdUsers[i].Fname,
					"lastName": noKaustIdUsers[i].Lname,
					"relationType": relationType,
					"msg": "",
					"requestId": requestId
				};
				this.fnCreateKaustId(obj, taskId, action, noKaustIdUsersLength, count);
			}
		}
	},

	fnCreateKaustId: function (jsonData, taskId, decisionKey, lineItemLength, count) {
		var that = this;
		var oCreateKaustIdModel = this.getView().getModel("oGASCModel");
		oCreateKaustIdModel.create("/ADD_DEPENDENTSet", jsonData, {
			success: function (data, response) {
				if (count == lineItemLength) {
					that.fnUpdateChildRelation(taskId, decisionKey);
				}
			},
			error: function (oError) {
				sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
				});
			}
		});
	},

	fnUpdateChildRelation: function (taskId, decisionKey) {
		var that = this;
		var helpModel = this.getOwnerComponent().getModel("helpModel");
		var reuestId = helpModel.getProperty("/requestId");
		var oUpdateChildRelationModel = this.getView().getModel("oGASCModel");
		oUpdateChildRelationModel.read("BirthCertificationSet?$filter=Request_ID eq '" + reuestId + "' and PassportLost eq 'X'", {
			success: function (data, response) {
				that.completeTheGASCTask(taskId, decisionKey);
			},
			error: function (oError) {
				sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
				});
			}
		});
	},

	completeTheGASCTask: function (taskId, decisionKey) {
		var that = this;
		var token = this.getGateWayToken();
		var msg = "The request has been successfully Approved";
		if (decisionKey == "Submit") {
			decisionKey = "Approve";
			msg = "The request has been successfully Submitted";
		}
		var urlCompleteTask = "/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='" + taskId + "'&DecisionKey='" + decisionKey +
			"'";
		var approveButton = that.getView().byId("approveButton");
		var rejectButton = that.getView().byId("rejectButton");
		var data = "";
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
				if (decisionKey == "Approve") {
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							that.goBack(oAction);
						}
					});
				} else {
					sap.m.MessageBox.show(
						"The request has been Rejected", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {
								that.goBack(oAction);
							}
						}
					);
				}
				approveButton.setVisible(false);
				rejectButton.setVisible(false);
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
			}
		});
	},

	goBack: function (oAction) {
		if (oAction == "OK") {
			window.top.close();
		} else {
			return false;
		}
	},

	getGateWayToken: function () {
		var sToken = null;
		var sUserDetailUrl = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail";
		$.ajax({
			url: sUserDetailUrl,
			type: "GET",
			dataType: 'json',
			contentType: "application/json",
			Accept: "application/json",
			async: false,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch",
			},
			success: function (data, textStatus, XMLHttpRequest) {
				sToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			},
			error: function (data, textStatus, XMLHttpRequest) {
				jQuery.sap.log.error("Error message " + data.responseText);
			}
		});
		return sToken;
	},

	//Deepak attachment enable in table **********************************************
	familyDepAttachmentPressed: function (oEvent) {
		var index = oEvent.getSource().getParent().getBindingContext("oUserModel").sPath.split("/")[2];
		var oGASCModel = this.getView().getModel("GASC_HeaderModel");
		var sFileURL = oGASCModel.getProperty("/d/results/0/HeaderToBC/results/" + index + "/url");
		var fileName = oGASCModel.getProperty("/d/results/0/HeaderToBC/results/" + index + "/fileName");
		if (fileName) {
			if (fileName.split(",").length == 1) {
				window.open(sFileURL, "_blank");
			} else {
				if (!this.attachmentModel) {
					this.attachmentModel = new sap.ui.model.json.JSONModel();
				}
				var arry = [];
				fileNames = fileName.split(",");
				sFileURL = sFileURL.split(",");
				for (var i = 0; i < fileNames.length; i++) {
					arry.push({
						name: fileNames[i],
						url: sFileURL[i]
					});
				}
				this.attachmentModel.setData({
					items: arry
				});

				if (!this.attachmentList) {
					this.attachmentList = sap.ui.xmlfragment("kaust.ui.kits.approvers.fragments.attachmentList", this);
				}
				this.attachmentList.setModel(this.attachmentModel);
				this.getView().addDependent(this.attachmentList);
				this.attachmentList.open();
			}
		}
	},
	closeDialogBox: function () {
		this.attachmentList.close();
	},
	handleAttachmentPress: function (oEvent) {
			var sFileURL = oEvent.getParameter("listItem").mAggregations.customData[0].getProperty("key");
			window.open(sFileURL, "_blank");
		}
		//End*****************************************************************************

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf zui5_approvers.BirthCertificate
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf zui5_approvers.BirthCertificate
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf zui5_approvers.BirthCertificate
	 */
	//	onExit: function() {
	//
	//	}

});
});