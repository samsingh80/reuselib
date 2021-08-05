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
sap.ui.controller("com.kaust.zui5approvers.controller.FamilyResidencyVisa", {
	onInit: function () {
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var kaustId = oModel.getData().d.results[0].KaustId;
		var data = [];
		data = oModel.getData().d.results[0].Headertovisa.results;
		if (data != null) {
			var oDegJson = new sap.ui.model.json.JSONModel();
			oDegJson.setData(oModel.getData().d.results[0]);
			that.getView().setModel(oDegJson, "oDegJson");
			var oVisaJson = new sap.ui.model.json.JSONModel();
			oVisaJson.setData(oModel.getData().d.results[0].Headertovisa.results[0]);
			that.getView().setModel(oVisaJson, "oVisaJson");
			var oVisaJson1 = new sap.ui.model.json.JSONModel();
			oVisaJson1.setData(oModel.getData().d.results[0].Headertovisa.results[0]);
			if(oModel.getData().d.results[0].Headertovisa.results.length > 1)
			{
				oVisaJson1.setData(oModel.getData().d.results[0].Headertovisa.results[1]);
				that.getView().setModel(oVisaJson1, "oVisaJson1");
			}
			var oUserModel = new sap.ui.model.json.JSONModel();
			oUserModel.setProperty("/oUserDep", data);
			this.getView().byId("idRequesterForm").setModel(oUserModel, 'oUserModel');
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			var doctype;
			oGASCModel.read("UserDetail(KaustID='" + kaustId + "',UserId='')", null, null, false, function (oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel, 'Details');
				if (oData.Nationality === "Saudi Arabian") {
					that.getView().byId("idIqamalbl").setText("Saudi ID");
					that.getView().byId("idIqamaval").setText(oData.SaudiID);
					that.getView().byId("idReqSaudiVisa").setVisible(false);
					that.getView().byId("idVisaLink").setVisible(false);
				} else {
					that.getView().byId("idIqamalbl").setText("Iqama Number");
					that.getView().byId("idIqamaval").setText(oData.Iqama);
					that.getView().byId("idReqSaudiVisa").setVisible(true);
					that.getView().byId("idVisaLink").setVisible(true);
				}
				that.getView().byId("idVisaNo").setText(oModel.getData().d.results[0].VisaNumber);
				if (oData.Nationality === "Saudi Arabian") {
					that.getView().byId("idIqamaAttach").setText("Saudi ID");
					doctype = "17";
				} else {
					that.getView().byId("idIqamaAttach").setText("Iqama");
					doctype = "3";
				}
			});
			this.getView().setModel(oGASCModel, "oGASCModel");
			var hederData = oModel.getData().d.results[0];
			var odetails = oModel.getData().d.results[0].Headertovisa.results;
			var nations;
			var kidsTotal = [];
			var isSpouse = [];
			var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
			oNatModel.read("/COUNTRY", {
				async: false,
				success: function (oData, response) {
					nations = oData.results;
				}
			});
			oUserModel.setProperty("/oUserData", hederData);
			for (var k = 0; k < odetails.length; k++) {
				if (odetails[k].Relationship.toUpperCase() === "CHILD" || odetails[k].Relationship.toUpperCase() === "STEPCHILD") {
					kidsTotal.push(odetails[k]);
				}
				if (odetails[k].Relationship.toUpperCase() === "SPOUSE") {
					isSpouse.push(odetails[k]);
				}
				if (odetails[k].Religion === 2) {
					oModel.getData().d.results[0].Headertovisa.results[k].ReliName = "Non-Muslim";
				} else {
					oModel.getData().d.results[0].Headertovisa.results[k].ReliName = "Muslim";
				}

				for (var nat = 0; nat < nations.length; nat++) {
					if (odetails[k].Nationality === nations[nat].LAND1) {
						oModel.getData().d.results[0].Headertovisa.results[k].nation = nations[nat].LANDX;
					}
				}
			}
			var familyData = new sap.ui.model.json.JSONModel();
			familyData.setData(oModel.getData().d.results[0].Headertovisa);
			that.getView().setModel(familyData, "frJson");
			var passportForms = that.getFileAttachmentRequestDetails(null, requestId, 3);
			var birthCertificates = that.getFileAttachmentRequestDetails(null, requestId, 13);
			var mrgCertificates = that.getFileAttachmentRequestDetails(null, requestId, 11);
			var hb = that.byId("idhb");
			var spouseFiles;
			for (var i = 0; i < isSpouse.length; i++) {
				var vb = new sap.m.VBox();
				vb.addStyleClass("destilPartHeaderDSTStyle");
				var name = "<strong>Spouse - " + isSpouse[i].FirstName + " " + isSpouse[i].MiddleName + " " + isSpouse[i].LastName + "</strong>\n";
				var nameS = new sap.m.FormattedText({
					htmlText: name
				});
				vb.addItem(nameS);
				hb.addItem(vb);
				for (var j = 0; j < passportForms.length; j++) {
					var vb = new sap.m.VBox();
					vb.addStyleClass("destilPartHeaderDSTStyle");
					if (passportForms[j].FILENAME.includes("SPOUSE")) {
						spouseFiles = new sap.m.Link({
							href: passportForms[j].URL,
							text: "Passport",
							target: "_blank",
							emphasized: true
						});
						vb.addItem(spouseFiles);
						hb.addItem(vb);
					}
				}
				for (var j = 0; j < mrgCertificates.length; j++) {
					if (mrgCertificates[j].FILENAME.includes("ATTESTEDMRG")) {
						var vb = new sap.m.VBox();
						vb.addStyleClass("destilPartHeaderDSTStyle");
						spouseFiles = new sap.m.Link({
							href: mrgCertificates[j].URL,
							text: "Attested Marriage Certificate",
							target: "_blank",
							emphasized: true
						});
						vb.addItem(spouseFiles);
						hb.addItem(vb);
					} else if (mrgCertificates[j].FILENAME.includes("TRANSLATEDMRG")) {
						var vb = new sap.m.VBox();
						vb.addStyleClass("destilPartHeaderDSTStyle");
						spouseFiles = new sap.m.Link({
							href: mrgCertificates[j].URL,
							text: "Translated Marriage Certificate",
							target: "_blank",
							emphasized: true
						});
						vb.addItem(spouseFiles);
						hb.addItem(vb);
					}
				}
			}

			var hb1 = that.byId("idhb1");
			var kidFiles;
			if (kidsTotal.length > 0) {
				for (var i = 0; i < kidsTotal.length; i++) {
					var hbox = new sap.m.VBox();
					var vb1 = new sap.m.VBox();
					vb1.addStyleClass("destilPartHeaderDSTStyle");
					var kidname = "<strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i].LastName +
						"</strong>";
					if (i > 0) {
						kidname = "<br><strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i]
							.LastName + "</strong>";
					}
					var nameK = new sap.m.FormattedText({
						htmlText: kidname
					});
					vb1.addItem(nameK);
					hbox.addItem(vb1);
					var num = parseInt(kidsTotal[i].SequenceNumber) - 1;
					for (var j = 0; j < passportForms.length; j++) {
						if (passportForms[j].FILENAME.includes("PASSPORTKID" + num)) {
							var vb1 = new sap.m.VBox();
							vb1.addStyleClass("destilPartHeaderDSTStyle");
							kidFiles = new sap.m.Link({
								href: passportForms[j].URL,
								text: "Passport",
								target: "_blank",
								emphasized: true
							});
							vb1.addItem(kidFiles);
							hbox.addItem(vb1);
						}
					}
					for (var j = 0; j < birthCertificates.length; j++) {
						if (birthCertificates[j].FILENAME.includes("ATTESTEDKID" + num)) {
							var vb1 = new sap.m.VBox();
							vb1.addStyleClass("destilPartHeaderDSTStyle");
							kidFiles = new sap.m.Link({
								href: birthCertificates[j].URL,
								text: "Attested Birth Certificate",
								target: "_blank",
								emphasized: true
							});
							vb1.addItem(kidFiles);
							hbox.addItem(vb1);
						} else if (birthCertificates[j].FILENAME.includes("TRANSLATEDKID" + num)) {
							var vb1 = new sap.m.VBox();
							vb1.addStyleClass("destilPartHeaderDSTStyle");
							kidFiles = new sap.m.Link({
								href: birthCertificates[j].URL,
								text: "Translated Birth Certificate",
								target: "_blank",
								emphasized: true
							});
							vb1.addItem(kidFiles);
							hbox.addItem(vb1);
						}
					}
					hb1.addItem(hbox);
				}
			}

			var fileDegrees = that.getFileAttachmentRequestDetails(null, requestId, 9);
			var attestedDegree, translatedDegree;
			for (var i = 0; i < fileDegrees.length; i++) {
				if (fileDegrees[i].FILENAME.includes("ATTESTED")) {
					fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
					attestedDegree = fileDegrees[i];
				}
				if (fileDegrees[i].FILENAME.includes("TRANSLATED")) {
					fileDegrees[i].FILENAME = (fileDegrees[i].FILENAME).split("-")[1];
					translatedDegree = fileDegrees[i];
				}
			}
			var fileCheckIqama = that.getFileAttachmentDetails(null, kaustId, doctype);
			var fileCheckPassport = that.getFileAttachmentDetails(null, kaustId, 1);
			var fileCheckSAVisa = that.getFileAttachmentDetails(null, kaustId, 5);
			var fileCheckDegreeCert = that.getFileAttachmentDetails(null, kaustId, 7);
			var filereadModel = new sap.ui.model.json.JSONModel({
				fileCheckIqama: fileCheckIqama,
				fileCheckPassport: fileCheckPassport,
				fileCheckSAVisa: fileCheckSAVisa,
				fileCheckDegreeCert: fileCheckDegreeCert,
				attestedDegree: attestedDegree,
				translatedDegree: translatedDegree
			});
			that.getView().setModel(filereadModel, "filereadModel");
		}

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData(oData.results);
				that.getView().setModel(data, "GAComments");
				sap.ui.getCore().setModel(data, "GAComments");
			}
		});
	},
	getFileAttachmentDetails: function (Event, kaustid, Doctype) {
		var filechk = false;
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
			"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + Doctype + "'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				if (data.results.length > 0) {
					if (data.results[0].URL.length > 0) {
						filechk = data.results[0];
					}
				}
			},
			function (response) {
				return "";
			});
		return filechk;
	},
	getFileAttachmentRequestDetails: function (oEvent, requestId, Doctype) {
		var filechk = false;
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + requestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '" + Doctype + "'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				if (data.results.length > 0) {
					if (data.results[0].URL.length > 0) {
						filechk = data.results;
					}
				}
			},
			function (response) {
				return "";
			});
		return filechk;
	},
	handleAction: function (evt) {
		var oModel = sap.ui.getCore().byId("app").getModel();
		var userData = this.getView().byId("idRequesterForm").getModel("oUserModel");
		var userHeader = userData.getProperty("/oUserData");
		var userLineItem = userData.getProperty("/oUserDep");
		var action;
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		var taskId = helpModel.getProperty("/taskId");
		var that = this;
		var mngrComment = this.getView().byId("commentMngr").getValue().trim();
		var data = "";
		var tableItems = this.getView().byId("idFamilyDetails").getItems();
		var approve = 0,
			modify = 0,
			reject = 0;
		var c = 0;
		for (var i = 0; i < tableItems.length; i++) {
			if (tableItems[i].getCells()[8].getSelectedIndex() === 0) {
				c = c + 1;
				approve = approve + 1;
			} else if (tableItems[i].getCells()[8].getSelectedIndex() === 1) {
				c = c + 1;
				modify = modify + 1;
			} else if (tableItems[i].getCells()[8].getSelectedIndex() === 2) {
				c = c + 1;
				reject = reject + 1;
			}
		}
		if ((approve === 0 && modify === 0 && reject === 0) || (c != tableItems.length)) {
			action = "-1";
		} else if (approve === tableItems.length) {
			action = "0";
		} else if (reject === tableItems.length) {
			action = "2";
		} else if (modify > 0) {
			action = "1";
		} else if (approve > 0 && modify === 0 && reject > 0) {
			action = "0";
			if (mngrComment == "") {
				this.getView().byId("commentMngr").setValueState("Error");
				sap.m.MessageBox.show(
					"Please add a reason", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			}
		}
		if (action == "-1") {
			sap.m.MessageBox.show(
				"Please select action(s) to submit", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
				}
			);
			return;
		}
		if (action == "2") {
			if (mngrComment == "") {
				this.getView().byId("commentMngr").setValueState("Error");
				sap.m.MessageBox.show(
					"Please add a reason", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			} else {
				this.getView().byId("commentMngr").setValueState("None");
				var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01");
				oGASCModel.read("/GASC_HeaderSet?$filter=RequestId  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
					data = rdata.results[0];
					familyDetails = oModel.getData().d.results[0].Headertovisa.results;
					data.Comments = mngrComment;
					delete data["Headertovisa"];
					delete data["HeadertoInfo"];
					delete data["Headertoid"];
					delete data["__metadata"];
				});
				var Headertovisa = [];
				for (var i = 0; i < familyDetails.length; i++) {
					var submitData = familyDetails[i];
					delete submitData["__metadata"];
					var status;
					if (tableItems[i].getCells()[8].getSelectedIndex() === 0) {
						status = 1;
					} else if (tableItems[i].getCells()[8].getSelectedIndex() === 1) {
						status = 3;
					} else if (tableItems[i].getCells()[8].getSelectedIndex() === 2) {
						status = 2;
					}
					var sarr = {};
					sarr = {
						"Mandt": submitData.Mandt,
						"RequestId": submitData.RequestId,
						"SequenceNumber": submitData.SequenceNumber,
						"Gender": submitData.Gender,
						"Ksamarriage": submitData.Ksamarriage,
						"Attestmarriage": submitData.Attestmarriage,
						"Translatmarriage": submitData.Translatmarriage,
						"Mofamarriage": submitData.Mofamarriage,
						"Relationship": submitData.Relationship,
						"Nationality": submitData.Nationality,
						"LastName": submitData.LastName,
						"FirstName": submitData.FirstName,
						"Ksabirth": submitData.Ksabirth,
						"Attestbirth": submitData.Attestbirth,
						"Translatebirth": submitData.Translatebirth,
						"Mofabirth": submitData.Mofabirth,
						"MiddleName": submitData.MiddleName,
						"Religion": submitData.Religion,
						"CountryOfOrigin": submitData.CountryOfOrigin,
						"CollectionMtd": submitData.CollectionMtd,
						"DeliveryMtd": submitData.DeliveryMtd,
						"RequestStatus": status,
					};
					Headertovisa.push(sarr);
				}
				data.Comments = mngrComment;
				data.Status = "011";
				data.Process = "VA";
				data.Headertovisa = Headertovisa;
				oGASCModel.create("/GASC_HeaderSet", data, {
					success: function (data1, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else if (action == "1") {
			if (mngrComment == "") {
				this.getView().byId("commentMngr").setValueState("Error");
				sap.m.MessageBox.show(
					"Please add a reason", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					}
				);
				return;
			} else {
				this.getView().byId("commentMngr").setValueState("None");
				var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01");
				oGASCModel.read("/GASC_HeaderSet?$filter=RequestId  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
					data = rdata.results[0];
					familyDetails = oModel.getData().d.results[0].Headertovisa.results;
					data.Comments = mngrComment;
					delete data["Headertovisa"];
					delete data["HeadertoInfo"];
					delete data["Headertoid"];
					delete data["__metadata"];
				});
				var Headertovisa = [];
				for (var i = 0; i < familyDetails.length; i++) {
					var submitData = familyDetails[i];
					delete submitData["__metadata"];
					var status;
					if (tableItems[i].getCells()[8].getSelectedIndex() === 0) {
						status = 1;
					} else if (tableItems[i].getCells()[8].getSelectedIndex() === 1) {
						status = 3;
					} else if (tableItems[i].getCells()[8].getSelectedIndex() === 2) {
						status = 2;
					}
					var sarr = {};
					sarr = {
						"Mandt": submitData.Mandt,
						"RequestId": submitData.RequestId,
						"SequenceNumber": submitData.SequenceNumber,
						"Gender": submitData.Gender,
						"Ksamarriage": submitData.Ksamarriage,
						"Attestmarriage": submitData.Attestmarriage,
						"Translatmarriage": submitData.Translatmarriage,
						"Mofamarriage": submitData.Mofamarriage,
						"Relationship": submitData.Relationship,
						"Nationality": submitData.Nationality,
						"LastName": submitData.LastName,
						"FirstName": submitData.FirstName,
						"Ksabirth": submitData.Ksabirth,
						"Attestbirth": submitData.Attestbirth,
						"Translatebirth": submitData.Translatebirth,
						"Mofabirth": submitData.Mofabirth,
						"MiddleName": submitData.MiddleName,
						"Religion": submitData.Religion,
						"CountryOfOrigin": submitData.CountryOfOrigin,
						"CollectionMtd": submitData.CollectionMtd,
						"DeliveryMtd": submitData.DeliveryMtd,
						"RequestStatus": status
					};
					Headertovisa.push(sarr);
				}
				data.Comments = mngrComment;
				data.Status = "099";
				data.Process = "VA";
				data.Headertovisa = Headertovisa;
				oGASCModel.create("/GASC_HeaderSet", data, {
					success: function (data1, response) {
						that.completeTheGASCTask(taskId, action);
					},
					error: function (oError) {}
				});
			}
		} else {
			var familyDetails;
			this.getView().byId("commentMngr").setValueState("None");
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01");
			oGASCModel.read("/GASC_HeaderSet?$filter=RequestId  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
				data = rdata.results[0];
				familyDetails = oModel.getData().d.results[0].Headertovisa.results;
				data.Comments = mngrComment;
				delete data["Headertovisa"];
				delete data["HeadertoInfo"];
				delete data["Headertoid"];
				delete data["__metadata"];
			});
			var Headertovisa = [];
			for (var i = 0; i < familyDetails.length; i++) {
				var submitData = familyDetails[i];
				delete submitData["__metadata"];
				var status;
				if (tableItems[i].getCells()[8].getSelectedIndex() === 0) {
					status = 1;
				} else if (tableItems[i].getCells()[8].getSelectedIndex() === 1) {
					status = 3;
				} else if (tableItems[i].getCells()[8].getSelectedIndex() === 2) {
					status = 2;
				}
				var sarr = {};
				sarr = {
					"Mandt": submitData.Mandt,
					"RequestId": submitData.RequestId,
					"SequenceNumber": submitData.SequenceNumber,
					"Gender": submitData.Gender,
					"Ksamarriage": submitData.Ksamarriage,
					"Attestmarriage": submitData.Attestmarriage,
					"Translatmarriage": submitData.Translatmarriage,
					"Mofamarriage": submitData.Mofamarriage,
					"Relationship": submitData.Relationship,
					"Nationality": submitData.Nationality,
					"LastName": submitData.LastName,
					"FirstName": submitData.FirstName,
					"Ksabirth": submitData.Ksabirth,
					"Attestbirth": submitData.Attestbirth,
					"Translatebirth": submitData.Translatebirth,
					"Mofabirth": submitData.Mofabirth,
					"MiddleName": submitData.MiddleName,
					"Religion": submitData.Religion,
					"CountryOfOrigin": submitData.CountryOfOrigin,
					"CollectionMtd": submitData.CollectionMtd,
					"DeliveryMtd": submitData.DeliveryMtd,
					"RequestStatus": status
				};
				Headertovisa.push(sarr);
			}
			data.Comments = mngrComment;
			data.Status = "012";
			data.Process = "VA";
			data.Headertovisa = Headertovisa;
			oGASCModel.create("/GASC_HeaderSet", data, {
				success: function (data1, response) {
					that.completeTheGASCTask(taskId, action);
				},
				error: function (oError) {}
			});
		}
	},
	completeTheGASCTask: function (taskId, decisionKey) {
		var that = this;
		var token = this.getGateWayToken();
		var msg = "The request has been successfully Approved";
		if (decisionKey == "0") {
			decisionKey = "Approve";
			msg = "The request has been successfully Approved";
		} else if (decisionKey == "1") {
			decisionKey = "";
			msg = "The request has been sent for Modification";
		} else {
			decisionKey = "Reject";
			msg = "The request has been Rejected";
		}
		var urlCompleteTask = "/sap/opu/odata/IWPGW/TASKPROCESSING;v=2;mo/Decision?InstanceID='" + taskId + "'&DecisionKey='" + decisionKey +
			"'";
		var approveButton = that.getView().byId("approveButton");
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
					sap.m.MessageBox.show(msg, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							that.goBack(oAction);
						}
					});
				}
				approveButton.setVisible(false);
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
				}
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
	}
});
    });