jQuery.sap.require("kaust.ui.kits.myRequest.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.layout.form.SimpleForm");
jQuery.sap.require("sap.ui.commons.Label");

sap.ui.controller("kaust.ui.kits.myRequest.view.Detail", {

	handleNavButtonPress: function (evt) {
		this.nav.back("Master");
	},

	ItemOpenAttachment: function (evt) {
		// evt.preventDefault(); //stop the browser from following		
		// var itemObj = evt.getSource().getBindingContext().getObject();
		// var itemUrl = itemObj.Url;
		// //window.location.href = "http://sthhmdm8dv.kaust.edu.sa:01090/ContentServer/ContentServer.dll?get&pVersion=0046&contRep=ZSLUTL01&docId=5542AA0B26AF4572E10000000AFE0415&compId=1238629_pp.pdf.pdf";
		// window.location.href = itemUrl;
		var oRequestid = sap.ui.getCore().byId("idObj").getTitle();
		var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
		filesData.read("/FileRead?$filter=UNIQUE_ID eq '" + oRequestid +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'", {
				async: true,
				success: function (oData, response) {
					var data = oData.results[0];
					window.open(data.URL, "_blank");
				}
			});
	},

	onAfterRendering: function () {
		//		var detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());

	},
	
		handleMoeDegreePress: function (oevent) {
			var Path = oevent.getSource().getParent().getBindingContextPath();
			var TblData = this.getView().getModel("MOEItemJson");
			var Linkobj = TblData.getProperty(Path);
			var attJson = [];
			var oRequestid = sap.ui.getCore().byId("idObj").getTitle();
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + oRequestid +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				attJson = data;
			},
			function (response) {
				return "";
			});

		if (attJson.results.length > 0) {
		  for(var i=0;i<attJson.results.length;i++){
		  	var type = attJson.results[i].FILENAME;
		  	var split = type.split("_");
		  	if(split[0] === Linkobj.KaustId ){
		     	window.open(attJson.results[i].URL, "_blank");
		  	}
		}
		}
		},
	
		// Moe Link Press
		handleMoeLinkPress: function (oevent) {
			var Path = oevent.getSource().getParent().getBindingContextPath();
			var TblData = this.getView().getModel("MOEItemJson");
			var Linkobj = TblData.getProperty(Path);
			var doctype1 = "";
			var errmsg, infmsg;
			if (Linkobj.Nationality != null && Linkobj.Nationality.toUpperCase() == "SAUDI ARABIAN") {
				doctype1 = "17";
				errmsg = "Saudi National ID is not uploaded in system, kindly click OK button to upload";
				infmsg = "Kindly ensure latest copy of Saudi National ID is uploaded in the system";
			} else {
				doctype1 = "3";
				errmsg = "Iqama is not uploaded in system, kindly click OK button to upload";
				infmsg = "Kindly ensure latest copy of Iqama is uploaded in the system";
			}

			var Linkfilechk = false;
			Linkfilechk = this.getFileAttachmentDetails(null, Linkobj.KaustId, doctype1);
			if (Linkfilechk) {
				window.open(Linkfilechk.URL);
			} else {
				sap.ui.getCore().attachInit(function () {
					sap.m.MessageBox.show(errmsg, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Document not found",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							try {
								var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
								window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaattach/index.html";
							} catch (Exception) {
								return;
							}
						}
					});
				});
			}
		},

	getFileAttachmentDetails: function (oEvent, kaustid, Doctype) {
			sap.ui.core.BusyIndicator.show(0);
			var filechk = false;
			var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + Doctype + "'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					var attachModel = new sap.ui.model.json.JSONModel();
					attachModel.setData(data);
					sap.ui.core.BusyIndicator.hide();
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

	//	Dikhu edit starts
	onChange: function (evt) {
			var item = evt.getParameter("listItem");
			var subSerCode = sap.ui.getCore().getModel('oSubServModel').getProperty('/');
			if (subSerCode == "0504") {
				var itemForm = sap.ui.getCore().byId("CarLicenseIssue");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0501") {
				var itemForm = sap.ui.getCore().byId("MotorcycleLicenseIssue");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0206") {
				var itemForm = sap.ui.getCore().byId("Sponsortransfer");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "1706") {
				var itemForm = sap.ui.getCore().byId("DivingLicenseRenew");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0104") {
				var itemForm = sap.ui.getCore().byId("policeClearance");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0105") {
				var itemForm = sap.ui.getCore().byId("zakatLetter");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0302") {
				var itemForm = sap.ui.getCore().byId("idBirthCertificateDetails");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0507") {
				var itemForm = sap.ui.getCore().byId("idCarOwnershipTransfer");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0506") {
				var itemForm = sap.ui.getCore().byId("idCarPlateChange");
				itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "0402") {
				//	var itemForm = sap.ui.getCore().byId("idInfoCorrect");
				//	itemForm.setBindingContext(item.getBindingContext());
			} else if (subSerCode == "1700") {
				var itemForm = sap.ui.getCore().byId("PetsImportExport");
				itemForm.setBindingContext(item.getBindingContext());
			}
		}
		//	Dikhu edit ends
});