sap.ui.controller("kaust.ui.kits.myRequest.view.App", {
	to: function (pageId, context) {
		var app = this.getView().app;

		// load page on demand
		var master = ("Master" === pageId);
		if (app.getPage(pageId, master) === null) {
			var page = sap.ui.view({
				id: pageId,
				viewName: "kaust.ui.kits.myRequest.view." + pageId,
				type: "XML"
			});

			page.getController().nav = this;
			app.addPage(page, master);
			jQuery.sap.log.info("app controller > loaded page: " + pageId);
		}

		// show the page 
		app.to(pageId);

		// set data context on the page
		if (context) {
			var listItem = context;
			var requestId = listItem.getTitle();
			var helpModel = new sap.ui.model.json.JSONModel();
			var kaustId = listItem.getNumber();
			// var subService = listItem.getNumberUnit();
			var subService = listItem.getFirstStatus().getText();
			var status = listItem.getAttributes()[0].getText();

			// save serviceCode and subServiceCode for cancellation
			var binding = listItem.getBindingContext("listModel");
			var path = binding.sPath;
			var selectedItem = binding.oModel.getProperty(path);
			var serviceCode = selectedItem.ServiceCode;
			var subServiceCode = selectedItem.SubServiceCode;
			var oSubServModel = new sap.ui.model.json.JSONModel();
			oSubServModel.setProperty('/', subServiceCode);
			sap.ui.getCore().setModel(oSubServModel, 'oSubServModel');
			var helpObject = new Object();
			helpObject.requestId = requestId;
			helpObject.serviceCode = serviceCode;
			helpObject.subServiceCode = subServiceCode;
			helpObject.serviceOpened = subService;
			helpModel.setProperty("/helpItems", helpObject);
			helpModel.setProperty("/durationVisible", true);
			this.getView().setModel(helpModel, "helpModel");

			var tabsFragment;
			var detailsFragment;
			var detailsForm = app.getPage(pageId).byId("page");
			detailsForm.removeAllContent();

			/**
			 * Darshna - Editing starts
			 * Creating a oData preferenceModel.
			 * Invoking loadPreferenceData method. Passing parameters - KaustId and subServiceCode.
			 */
			var oPreferenceModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/"));
			this.getView().setModel(oPreferenceModel, "oPreferenceModel");
			this.loadPreferenceData(selectedItem.KaustId, selectedItem.SubServiceCode);
			/** Darshna - Editing ends */

			switch (subService) {

			case 'Distribution List Service':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.EmailDistrGrp", app.getPage(pageId).getController());
				this.getEmailDistrGrp(requestId, kaustId);
				break;
			case 'Generic Email Creation':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.GenEmail", app.getPage(pageId).getController());
				this.getGenEmail(requestId, kaustId);
				break;
			case 'New E-fax Service':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Fax(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Efax", app.getPage(pageId).getController());
				this.getEfax(requestId, kaustId);
				break;
			case 'Loan Equipment':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Loanequip(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.LoanEquip", app.getPage(pageId).getController());
				this.getLoanEquip(requestId, kaustId);
				break;
			case 'Replenish Equipment':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Replenish(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TransferEquip", app.getPage(pageId).getController());
				this.getReplenishEquip(requestId, kaustId);
				break;
			case 'Transfer Equipment':
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment(RequestId='" + requestId + "',KaustId='')");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TransferEquip", app.getPage(pageId).getController());
				this.getTransferEquip(requestId, kaustId);
				break;
			case 'Audio Visual Services':
				this.getConfereceRoomData(requestId, kaustId);
				//Roopali-INCTURE(22-11-2018) - get deleted dates
				// this.getDeletedDates(requestId);
				//var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm(RequestId='" + requestId + "',KaustId='')");
				var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '" + requestId + "'");
				helpModel.setProperty("/url", url);
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.ConferenceRoomBooking", app.getPage(pageId).getController());
				this.setConferenceLayout(requestId);
				break;
			case 'Vulnerability Scan Service':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.VulnerabilityScanDetails", app.getPage(pageId).getController());
				this.getVulnerabilityScanData(requestId, kaustId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("VScanModel"));
				break;
			case 'Security Incident Report':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SecurityIncidentDetails", app.getPage(pageId).getController());
				this.getSecurityIncidentData(requestId, kaustId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("SIncidentModel"));
				break;
			case 'Copyright Notice Service':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
				this.getAccessRequestData(requestId, kaustId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
				break;
			case 'Smart Printing Registration':
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
				this.getAccessRequestData(requestId, kaustId);
				break;
			case 'Encryption Request Service':
				app.getPage(pageId).setModel(sap.ui.getCore().getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
				this.getAccessRequestData(requestId, kaustId);
				break;
			case 'VPN Access for Externals':
				this.getAccessRequestData(requestId, kaustId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
				break;
			case 'Iqama Renewal':
				//Commented by shravya for iqama renewal
			/*	this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
				detailsFragment.setModel(helpModel, "helpModel");
				tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				if (tabsFragment == null) {
					tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				}
				break;*/
			case 'Exit Reentry Visa':
				//        this.getIqamaRenewelOrExitEntryRequestDetails(requestId, kaustId);
				//        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				//        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", this);
				//        tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//        helpModel.setProperty("/durationVisible", false);
				//        detailsFragment.setModel(helpModel, "helpModel");
				//        if (tabsFragment == null) {
				//          tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", this);
				//        }
				break;
				//			case 'Iqama Issuance':
				//				this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
				//				detailsFragment.setModel(helpModel, "helpModel");
				//				tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//				if (tabsFragment == null) {
				//					tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//				}
				//				break;
				// case 'Transfer of Information':
				// 	this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
				// 	app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				// 	detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
				// 	detailsFragment.setModel(helpModel, "helpModel");
				// 	tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				// 	if (tabsFragment == null) {
				// 		tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				// 	}
				// 	break;
			case 'Govt Visa Extension':
				this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
				detailsFragment.setModel(helpModel, "helpModel");
				tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				sap.ui.getCore().byId("lVisaExp").setVisible(true);
				sap.ui.getCore().byId("tVisaExp").setVisible(true);
				sap.ui.getCore().byId("lisExp").setVisible(true);
				sap.ui.getCore().byId("tisExp").setVisible(true);
				if (tabsFragment == null) {
					tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				}
				sap.ui.getCore().byId("idDetailLabel").setText("Visitor Details");
				break;
				//			case 'Final Exit':
				//				this.getIqamaRenewelOrExitEntryRequestDetails(requestId);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel"));
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewalDetails", app.getPage(pageId).getController());
				//				helpModel.setProperty("/durationVisible", false);
				//				detailsFragment.setModel(helpModel, "helpModel");
				//				tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//				sap.ui.getCore().byId("lVisaExp").setVisible(false);
				//				sap.ui.getCore().byId("tVisaExp").setVisible(false);
				//				sap.ui.getCore().byId("lisExp").setVisible(false);
				//				sap.ui.getCore().byId("tisExp").setVisible(false);
				//				sap.ui.getCore().byId("commentText").setEditable(true);
				//				if (tabsFragment == null) {
				//					tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//				}
				//				break;
				//For KIT new modules : zakeer
			case 'Port Activation':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.PortAccess", app.getPage(pageId).getController());
				this.getPortDetails(requestId);
				break;
			case 'TER Access Process':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TERAccess", app.getPage(pageId).getController());
				this.getTERDetails(requestId);
				break;

			case 'Admin Rights Process':
				var oPortModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oPortModel, "oPortModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AdminAccess", app.getPage(pageId).getController());
				detailsFragment.setModel(oPortModel);
				this.getAdminAccessDetails(requestId);
				break;

			case 'Data Center Access Process':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.DataAccess", app.getPage(pageId).getController());
				this.getDataCenterDetails(requestId, detailsFragment);
				detailsFragment.setModel(this.getView().getModel("dataRequestData"), "dataRequestData");
				break;
			case 'VPN Access for externals Process':
				var oRequestModel = new sap.ui.model.json.JSONModel();
				this.getView().setModel(oRequestModel, "oRequestModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.VPNAccess", app.getPage(pageId).getController());
				detailsFragment.setModel(oRequestModel);
				this.getVPNDetails(requestId, listItem);
				break;

			case '7 Seat approval':
				break;
			}

			/**
			 * INCTURE
			 * For new GASC Modules: The identifier should be subServiceCode
			 * New Switch statements with subServiceCode
			 */

			switch (subServiceCode) {
				//      Dikhu edit starts
			case '0036':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;

			case '0303':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;

			case '0204':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;

			case '0205':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
			case '0207':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
			case '1701':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Attestation", app.getPage(pageId).getController());
				this.getAttestationDetails(requestId, subServiceCode);
				//        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//        detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				//        detailsFragment.setModel(helpModel, "helpModel");
				break;
			case '1702':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Moe", app.getPage(pageId).getController());
				this.getMoeDetails(requestId, subServiceCode);
				/*	detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
					this.getNewsPaperDetails(requestId, subServiceCode);
					app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
					detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
					detailsFragment.setModel(helpModel, "helpModel");*/
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
				case '0101':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaRenewal", app.getPage(pageId).getController());
				this.getIqamaRenDetails(requestId, subServiceCode);
				/*	detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
					this.getNewsPaperDetails(requestId, subServiceCode);
					app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
					detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
					detailsFragment.setModel(helpModel, "helpModel");*/
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
			case '1704':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Attestation", app.getPage(pageId).getController());
				this.getAttestationDetails(requestId, subServiceCode);
				break;
			case '1705':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Attestation", app.getPage(pageId).getController());
				this.getAttestationDetails(requestId, subServiceCode);
				break;
			case '0102':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.ExitReentryVisa", app.getPage(pageId).getController());
				this.getExitRentryVisaDetails(requestId, subServiceCode);
				break;
			case '0504':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.DLIssue", app.getPage(pageId).getController());
				this.getDLIssDetails(requestId, subServiceCode);
				break;
				//detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//	this.getNewsPaperDetails(requestId, subServiceCode);
				//	app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				////          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("CarLicenseIssue").setVisible(true);
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
			case '0501':
				/*	detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
					this.getNewsPaperDetails(requestId, subServiceCode);
					app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
					//          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
					detailsFragment.setModel(helpModel, "helpModel");
					sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(true);*/
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.MCDLIssue", app.getPage(pageId).getController());
				this.getMCDLIssDetails(requestId, subServiceCode);
				break;

			case '1700':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				sap.ui.getCore().byId("PetsImportExport").setVisible(true);
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;

			case '1706':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				sap.ui.getCore().byId("DivingLicenseRenew").setVisible(true);
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
			case '1707':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(helpModel, "helpModel");
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
				//       Dikhu edit ends
			case '0206':
				// detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				// this.getNewsPaperDetails(requestId, subServiceCode);
				// app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				// detailsFragment.setModel(helpModel, "helpModel");
				// sap.ui.getCore().byId("Sponsortransfer").setVisible(true);
				// break;
				//NAVIN EDITING STARTS
				//New Changes
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SponsershipTransfer", app.getPage(pageId).getController());
				this.getSponsershipTransferInfo(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
				break;

			case '0103':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaIssue", app.getPage(pageId).getController());
				this.getIQMISSDetails(requestId, subServiceCode);
				break;

			case '9103':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaIssue", app.getPage(pageId).getController());
				this.getIQMISSDetails(requestId, subServiceCode);
				break;

			case '0104':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				sap.ui.getCore().byId("policeClearance").setVisible(true);
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
				// chandra edit starts
			case '0105':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TaxLetter", app.getPage(pageId).getController());
				this.getTaxLetterDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//          detailsFragment.setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"), "oNewsPaperModel");
				detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("zakatLetter").setVisible(true);
				//          tabsFragment = sap.ui.getCore().byId("IqamaGRID");
				//            if (tabsFragment == null) {
				//                tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TabsIqamaRenewal", app.getPage(pageId).getController());
				//              }
				break;
				// chandra edit starts
				// NAVIN EDITING ENDS
			case '0302':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.BirthCertificate", app.getPage(pageId).getController());
				this.getBirthCertificate(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				// detailsFragment.setModel(helpModel, "helpModel");
				// sap.ui.getCore().byId("idBirthCertificateDetails").setVisible(true);
				break;
			case '0402':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.InfoCorrect", app.getPage(pageId).getController());
				this.getInfoCorrect(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
				break;
			case '0401':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.TransferInformation", app.getPage(pageId).getController());
				this.getTransferInfo(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
				break;
			case '0310':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SaudiPassportPickup", app.getPage(pageId).getController());
				this.getSaudiPassport(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
				break;
			case '0306':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SaudiNationalIdPickup", app.getPage(pageId).getController());
				this.getSaudiIdData(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//detailsFragment.setModel(helpModel, "helpModel");
				//sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
				break;
			case '1703':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(helpModel, "helpModel");
				sap.ui.getCore().byId("idMandanSalehForm").setVisible(true);
				break;
			case '0404':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaCancel", app.getPage(pageId).getController());
				this.getIQMCANDetails(requestId, subServiceCode);
				break;
			case '0408':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaCancel", app.getPage(pageId).getController());
				this.getIQMCANDetails(requestId, subServiceCode);
				break;
			case '0410':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaReplace", app.getPage(pageId).getController());
				this.getIQMLDRDetails(requestId, subServiceCode);
				break;
			case '9410':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.IqamaReplace", app.getPage(pageId).getController());
				this.getIQMLDRDetails(requestId, subServiceCode);
				break;
			case '0413':
				//        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//        this.getNewsPaperDetails(requestId, subServiceCode);
				//        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//        detailsFragment.setModel(helpModel, "helpModel");
				//        sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(true);
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.DPSPTransfer", app.getPage(pageId).getController());
				this.getDSTDetails(requestId, subServiceCode);
				break;
			case '0415':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SPSTransfer", app.getPage(pageId).getController());
				this.getSSTDetails(requestId, subServiceCode);
				break;
			case '0416':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CHDTransfer", app.getPage(pageId).getController());
				this.getCSTDetails(requestId, subServiceCode);
				break;
			case '0507':
				//        detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//        this.getNewsPaperDetails(requestId, subServiceCode);
				//        app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//        detailsFragment.setModel(helpModel, "helpModel");
				//        sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(true);
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.VehOwnTransfer", app.getPage(pageId).getController());
				this.getVOTDetails(requestId, subServiceCode);
				break;
			case '0202':
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//				this.getNewsPaperDetails(requestId, subServiceCode);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//				detailsFragment.setModel(helpModel, "helpModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FinalExitVisa", app.getPage(pageId).getController());
				this.getFEVDetails(requestId, subServiceCode);
				break;
			case '9202':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FinalExitVisa", app.getPage(pageId).getController());
				this.getFEVDetails(requestId, subServiceCode);
				break;
			case '0211':
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//				this.getNewsPaperDetails(requestId, subServiceCode);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//				detailsFragment.setModel(helpModel, "helpModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FinalExitVisaCancel", app.getPage(pageId).getController());
				this.getFEVCANDetails(requestId, subServiceCode);
				break;
			case '8211':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FinalExitVisaCancel", app.getPage(pageId).getController());
				this.getFEVCANDetails(requestId, subServiceCode);
				break;
			case '9211':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FinalExitVisaCancel", app.getPage(pageId).getController());
				this.getFEVCANDetails(requestId, subServiceCode);
				break;
			case '0203':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.GovtvvisaExten", app.getPage(pageId).getController());
				this.getGVVEXTDetails(requestId, subServiceCode);
				break;
			case '0502':
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//				this.getNewsPaperDetails(requestId, subServiceCode);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//				detailsFragment.setModel(helpModel, "helpModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.DLRenew", app.getPage(pageId).getController());
				this.getDLRDetails(requestId, subServiceCode);
				break;
			case '0505':
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//				this.getNewsPaperDetails(requestId, subServiceCode);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//				detailsFragment.setModel(helpModel, "helpModel");
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.MCDLRenew", app.getPage(pageId).getController());
				this.getMCDLRDetails(requestId, subServiceCode);
				break;
			case '0503':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CARRegRenew", app.getPage(pageId).getController());
				this.getCARRegRenewDetails(requestId, subServiceCode);
				//				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				//				this.getNewsPaperDetails(requestId, subServiceCode);
				//				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				//				detailsFragment.setModel(helpModel, "helpModel");
				break;
			case '0505':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(helpModel, "helpModel");
				break;
			case '0506':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(helpModel, "helpModel");
				sap.ui.getCore().byId("idCarPlateChange").setVisible(true);
				break;
			case '0304':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.NewspaperAnnounce", app.getPage(pageId).getController());
				this.getNewsPaperDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				detailsFragment.setModel(helpModel, "helpModel");
				break;
			case '0026':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.AccessRequestDetails", app.getPage(pageId).getController());
				this.getAccessRequestData(requestId, kaustId);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("ARequestModel"));
				break;
				// 7 Seater code starts
			case '1912':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SevenSeater", app.getPage(pageId).getController());
				this.getSevenSeaterDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				break;
				// 7 Seater code ends
				// Foreign Visa apply visa - start
			case '1708':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.ForeignVisa", app.getPage(pageId).getController());
				this.getForeignVisaDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				break;
				// Foreign Visa apply visa - end
				// Passport pick up - start
			case '1709':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.PassportPickup", app.getPage(pageId).getController());
				this.getPassportPickupDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				break;
				// Passport pick up - end
				//Job title change
			case '0414':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Jobtitlechange", app.getPage(pageId).getController());
				this.getJobTitleDetails(requestId, subServiceCode);
				break;
				// Family Residency Visa
			case '0208':
				detailsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.FamilyResidencyVisa", app.getPage(pageId).getController());
				this.getFamilyResidencyDetails(requestId, subServiceCode);
				app.getPage(pageId).setModel(sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel"));
				break;
			}

			if (detailsFragment) {
				// Edited by Darshna - Added SubServiceCode
				detailsForm.addContent(this.getStatus(requestId, kaustId, status, subService, subServiceCode));
				var requesterInformationTab = sap.ui.getCore().byId("RequesterInformationSF");
				if (requesterInformationTab != undefined) {
					requesterInformationTab.setModel(sap.ui.getCore().byId("Master").getModel("RequesterInformationModel"));
				}
				detailsForm.addContent(detailsFragment);

				if (subService != "Audio Visual Services" && subService != "Replenish Equipment" && subService != "Transfer Equipment" && subService !=
					"Loan Equipment" && subServiceCode == "1701" && subServiceCode == "1704" && subServiceCode == "1705") {
					if (tabsFragment == null) {
						tabsFragment = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.Tabs", app.getPage(pageId).getController());
					}
					detailsForm.addContent(tabsFragment);
					//For Port, hiding comments tab : zakeer
					if (subService == "Port Activation") {
						detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].setVisible(false);
					}
					//closing of hiding comments tab : zakeer

					//For TER, comments tab : zakeer
					else if (subService == "TER Access Process") {
						var data = this.getView().getModel("oDataModel").getData().d.results[0];
						var comments = [];
						if (data.itncTeamComments != "") {
							var commObj = {
								"text": ""
							};
							commObj.text = data.itncTeamComments + " by " + data.itncTeamApprover;
							comments.push(commObj);
						}
						if (data.itncAgentComment != "") {
							var commObj = {
								"text": ""
							};
							commObj.text = data.itncAgentComment + " by " + data.itncAgentApprover;
							comments.push(commObj);
						}
						if (data.feedbackComment != "") {
							var commObj = {
								"text": ""
							};
							commObj.text = data.feedbackComment + " by " + data.netAgent_approver;
							comments.push(commObj);
						}
						detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();

						if (comments.length >= 1) {
							var oModel = new sap.ui.model.json.JSONModel();
							oModel.setData({
								"Comments": comments
							});
							sap.ui.getCore().byId("Detail").setModel(oModel, "oCommModel");

							var list = new sap.m.List();
							list.bindItems({
								path: "oCommModel>/Comments",
								template: new sap.m.FeedListItem({
									text: "{oCommModel>text}",
								})
							});
							detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list);
						}
					} //TER : end of comments tab : zakeer
					else if (subService == "VPN Access for externals Process") {
						var data = this.getView().getModel("oDataModel").getData().d.results[0];
						var comments = [];
						if (data.secManagerComments != "") {
							var commObj = {
								"text": ""
							};
							commObj.text = data.secManagerComments + " by " + data.infoSecManager;
							comments.push(commObj);
						}
						if (data.msgTeamComments != "") {
							var commObj = {
								"text": ""
							};
							commObj.text = data.msgTeamComments + " by " + data.msgTeam;
							comments.push(commObj);
						}

						detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();

						if (comments.length >= 1) {
							var oModel = new sap.ui.model.json.JSONModel();
							oModel.setData({
								"Comments": comments
							});
							sap.ui.getCore().byId("Detail").setModel(oModel, "oCommModel");

							var list = new sap.m.List();
							list.bindItems({
								path: "oCommModel>/Comments",
								template: new sap.m.FeedListItem({
									text: "{oCommModel>text}",
								})
							});
							detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list);
						}
					} //TER : end of comments tab : zakeer
					else if (subService == "Admin Rights Process") {
						var requestId = this.getView().getModel("adminModel").getData().d.results[0].requestId;
						var oDataApproverModel = new sap.ui.model.json.JSONModel();
						oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId +
							"'&$format=json", null, false);
						var data = oDataApproverModel.getData().d.results;
						//
						//            data.forEach(function (oEle) {
						//            oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
						//          });
						oDataApproverModel.setData(data);
						this.getView().setModel(oDataApproverModel, "GAComments");
					}

					// Pavithra code- comments DC start
					else if (subService == "Data Center Access Process") {
						var rData = this.getView().getModel("dataCenter").getData().d.results[0]
						var requestId = rData.RequestId;
						var oDataApproverModel = new sap.ui.model.json.JSONModel();
						oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId +
							"'&$format=json", null, false);
						var data = oDataApproverModel.getData().d.results;
						//
						//        data.forEach(function (oEle) {
						//        oEle["comment"] = oEle.Comments +" by "+ oEle.t_name;
						//      });
						oDataApproverModel.setData(data);
						this.getView().setModel(oDataApproverModel, "GAComments");
						if (rData.justification && (rData.stage == "Line Manager" || rData.stage == "Data Center Team" || rData.stage ==
								"Data Center Lead" || rData.stage == "Research and Computing Team")) {
							sap.ui.getCore().byId("justificationtab").setVisible(true);
							sap.ui.getCore().byId("justifctnTab").setValue(rData.justification);

						} else if ((rData.stage == "Requester" || rData.stage == "Justification")) {
							sap.ui.getCore().byId("justificationtab").setVisible(false);
						}
					}
					//          Pavithra code- comments DC end        

					//           Tabs Fragment for GASC Services: Darshna 
					if (subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode === "0504" || subServiceCode === "0207" ||
						subServiceCode === "0501" || subServiceCode === "0302" || subServiceCode === "0206" || subServiceCode === "1703" || subServiceCode ===
						"0104" || subServiceCode === "1706" || subServiceCode === "1707" || subServiceCode === "0504" || subServiceCode === "1702" || subServiceCode === "0101" ||
						subServiceCode === "0502" || subServiceCode === "0503" || subServiceCode === "0505" || subServiceCode === "0506" || subServiceCode ===
						"0304" || subServiceCode === "0204" || subServiceCode === "0205") {
						/*  var data = sap.ui.getCore().byId("Detail").getModel("oNewsPaperModel").getData();
              var comments = [];
              if(data.GAComments!="" && data.GAComments != undefined){
           var commObj = {"text":""};
         commObj.text= "GA Comments: " + data.GAComments;
         comments.push(commObj);}
        if(data.FinComments!="" && data.FinComments!=undefined){
           var commObj = {"text":""};
         commObj.text= "Financial Comments: " +  data.FinComments;
         comments.push(commObj);}
        if(data.ReqComments!="" && data.ReqComments!=undefined){
           var commObj = {"text":""};
         commObj.text= "Requester Comments: " +  data.ReqComments;
         comments.push(commObj);
         }
        detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].destroyContent();
        if(comments.length >= 1){
            var oComment = new sap.ui.model.json.JSONModel();
            oComment.setData({"Comments":comments});
            sap.ui.getCore().byId("Detail").setModel(oComment,"oCommModel");

                var list = new sap.m.List();
                list.bindItems({
                      path : "oCommModel>/Comments", 
                      template : new sap.m.FeedListItem({
                        text: "{oCommModel>text}",
                      })
                  }); 
                detailsForm.getContent()[2].getContent()[0].getAggregation("_header").getItems()[1].addContent(list); 
               }*/
					}

					//           Comments Log Implementation for IQAMA Renewal and Exit Re-Entry --- Dikhunmekh --- Start

					var that = this;
						//commented by shravya for iqama renewal
				/*	if (subServiceCode == "0101") { // || subServiceCode == "0102") { 

						sap.ui.getCore().byId('idIqamaComment').setVisible(false);
						sap.ui.getCore().byId('idIqamaCommentGaApp').setVisible(true);

						var oRequestId = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel").getData()[0].RequestId;
						var oCommentsModel = new sap.ui.model.json.JSONModel();
						var oModelCommentsLog = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/")); // Darshna - this.getUrl added
						var filterstr = "CommentSet?$filter=Request_ID eq '" + oRequestId + "'";

						oModelCommentsLog.read(filterstr, null, null, false, function (data, response) {
							data.results = data.results.filter(function (val) {
								return val.Status != "056" &&
									val.Status != "057" &&
									val.Status != "058" &&
									val.Status != "059";
							});
							oCommentsModel.setData(data.results);
							that.getView().setModel(oCommentsModel, "oCommentsModel");
						}, function (response) {
							return "";
						});
					}*/
				

					//           Comments Log Implementation for IQAMA Renewal and Exit Re-Entry --- Dikhunmekh --- End

					if (subService == "Data Center Access Process") {
						this.getUserDataDC(kaustId, requestId);
						sap.ui.getCore().byId("userInfoForm").setVisible(false);
						sap.ui.getCore().byId("userInfoFormDC").setVisible(true);
					} else {
						this.getUserData(kaustId, requestId);
					}
					// sap.ui.getCore().byId("historyTab").setVisible(false);
				} else if (subService == "Audio Visual Services" || subService == "Loan Equipment") {
					var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
					//          INCTURE 01-18-2018: START---------------------------------------------------------------------------------------------------------------------------------------------------------------
					//          Added if-else block to maintain separate Cancel Footer visibility for AV and Loan Equipment
					if (subService == "Loan Equipment") { // No changes for Loan Equipment
						if (oModel.oData.Status != "013" && oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" &&
							oModel.oData.Status != "018") {
							var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CancelFooter", this.getView().getController());
							detailsForm.setFooter(footer);
						}
					} else if (subService == "Audio Visual Services") { // For AV the status check for 013 (Resolved) is removed
						if (oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" && oModel.oData.Status != "018") {
							var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CancelFooter", this.getView().getController());
							detailsForm.setFooter(footer);
							// Roopali(11-07-2018)- Make "Cancel individual slots" and "Cancel all" buttons visible and "Cancel Request" invisible if recurring event
							if (oModel.oData.Rdevent === "X") {
								sap.ui.getCore().byId("IndividualCancel").setVisible(true);
								sap.ui.getCore().byId("AllCancel").setVisible(true);
								sap.ui.getCore().byId("cancelRq").setVisible(false);
							}
							// Roopali changes end
						}
					}
					//          Commented below if block
					//          if (oModel.oData.Status != "013" && oModel.oData.Status != "015" && oModel.oData.Status != "011" && oModel.oData.Status != "016" && oModel.oData.Status != "018") {
					//            var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.CancelFooter", this.getView().getController());
					//            detailsForm.setFooter(footer);
					//          }
					//          INCTURE 01-18-2018: END---------------------------------------------------------------------------------------------------------------------------------------------------------------

					// Comments Log Service Integration
					var requestId = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData().RequestId;
					var oAVCommModel = new sap.ui.model.json.JSONModel();
					oAVCommModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + requestId + "'&$format=json",
						null, false);
					var aList = oAVCommModel.getData().d.results;
					aList = aList.filter(function (oEle) {
						return oEle.Comments !== "";
					});
					oAVCommModel.setData(aList);
					this.getView().setModel(oAVCommModel, "GAComments");
				}

				if (subService == "Final Exit") {
					var oModel = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
					// if (oModel.oData[0].Status == "099") {
					// 	var footer = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.SubmitFooter", this.getView().getController());
					// 	detailsForm.setFooter(footer);
					// }
				}

				if (sap.ui.getCore().byId("familyTable")) {
					sap.ui.getCore().byId("familyTable").setModel(helpModel, "helpModel");
				}
				var col = sap.ui.getCore().byId("passportLostColumn");
				if (col) {
					col.setVisible(false);
					// if (subServiceCode == '0401') {
					// 	col.setVisible(true);
					// }
				}

				if (subServiceCode == '0011') {
					//          if(oModel.oData.EventLocation !='Conference Room')
					//            this.getProcessStages1(listItem, status, detailsForm,'011b');
					//          else if(oModel.oData.EventLocation =='Conference Room'&& (oModel.oData.Webex == 'X' || oModel.oData.Videowebconf == 'X' || oModel.oData.Avsupport == 'X' || oModel.oData.Confrecord == 'X'))
					//            this.getProcessStages(listItem, status, detailsForm);
					//          else
					//            this.getProcessStages1(listItem, status, detailsForm,'011a');
					this.getProcessStages(listItem, status, detailsForm);
				} else if (subServiceCode == '0101') { //} || subServiceCode == '0202') { // || subServiceCode == '0103' || subServiceCode == '0102' 
				/*	var oModel = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
					if (oModel.oData[0].Categorytype == 'SLCM') {
						if (subServiceCode == '0101') {
							this.getProcessStages1(listItem, status, detailsForm, '0101a');
						} else if (subServiceCode == '0102') {
							this.getProcessStages1(listItem, status, detailsForm, '0102a');
						} else {
							this.getProcessStages1(listItem, status, detailsForm, '0103a');
						}

					} else {
						this.getProcessStages(listItem, status, detailsForm);
					}*/

				} else if (subServiceCode == '0053' || subServiceCode == '0054' || subServiceCode == '0055') {
					this.getProcessStages(listItem, status, detailsForm);
				}
				/* else if(subServiceCode == '0054')
				  {
				  this.getProcessStages(listItem, status, detailsForm);
				  }*/
				else {
					this.getProcessStages(listItem, status, detailsForm);
				}
				// Rerender is moved to jsonp ajax call because it is asynchronous
			}
		}
	},

	onChange: function () {},
	getStatus: function (requestId, kaustId, status, subService, subServiceCode) {
		var objHeader = new sap.m.ObjectHeader("idObj", {
			title: requestId,
			number: kaustId
		});

		var firstStatus = new sap.m.ObjectStatus({
			text: subService
		});
		objHeader.addStatus(firstStatus);

		if (status == "Rejected") {
			var text = "";
			var model = "";
			var modelData = "";
			if (subService == "Transfer Equipment") {
				model = sap.ui.getCore().byId("Detail").getModel("transferModel");
				modelData = model.getData();
				if (modelData.Stage == 'Recipient Line Manager Approval') {
					text = "Reason: " + model.oData.Recmannotes;
				} else if (modelData.Stage == 'Line Manager Approval') {
					text = "Reason: " + model.oData.mcomments;
				} else {
					text = "Reason: " + model.oData.Empnote;
				}
				var attribute = new sap.m.ObjectAttribute({
					text: text,
					tooltip: text
				});
				attribute.addStyleClass("redText");
				objHeader.addAttribute(attribute);

			} else if (subService == "TER Access Process") {
				var data = this.getView().getModel("oDataModel").getData().d.results[0];
				var text = "Reason: " + data.itncTeamComments;
				var attribute = new sap.m.ObjectAttribute({
					text: text,
					tooltip: text
				});
				attribute.addStyleClass("redText");
				objHeader.addAttribute(attribute);
				return objHeader;
			} else if (subService == "VPN Access for externals Process") {
				var text;
				var vpnData = this.getView().getModel("oDataModel").getData().d.results[0];
				//        if(vpnData.Stage == "Info Sec Manager")
				//          {
				//          text = "Reason: " + vpnData.secManagerComments;
				//          }
				//        else 
				if (vpnData.secManagerComments) {
					text = "Reason: " + vpnData.secManagerComments;
				}
				if (vpnData.msgTeamComments) {
					text = "Reason: " + vpnData.msgTeamComments;
				}

				var attribute = new sap.m.ObjectAttribute({
					text: text,
					tooltip: text
				});
				attribute.addStyleClass("redText");
				objHeader.addAttribute(attribute);
				return objHeader;
			} else if (subService == "Data Center Access Process") {
				//        var requestId = this.getView().getModel("dataCenter").getData().d.results[0].RequestId;
				//        var oDataApproverModel = new sap.ui.model.json.JSONModel();
				//        oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '"+requestId+"'&$format=json", null, false);
				//        var cdata = oDataApproverModel.getData().d.results;
				//
				//
				var data = this.getView().getModel("dataCenter").getData().d.results[0];
				//         if(cdata.Stage == data.stage)
				//           {
				//            data.comments = cdata[]
				//           }
				if (data.comments) {
					var attribute = new sap.m.ObjectAttribute({
						text: "Reason: " + data.comments,
						tooltip: "Reason: " + data.comments
					});

				}
				attribute.addStyleClass("redText");
				objHeader.addAttribute(attribute);
				return objHeader;
			} else if (subService == "Admin Rights Process") {
				var data = this.getView().getModel("adminModel").getData().d.results[0];
				if (data.comments) {
					var attribute = new sap.m.ObjectAttribute({
						text: "Reason: " + data.comments,
						tooltip: "Reason: " + data.comments
					});

				}
				attribute.addStyleClass("redText");
				objHeader.addAttribute(attribute);
				return objHeader;
			} else if (subService === "Audio Visual Services") {
				var oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
				if (oAVData.comments) {
					var attribute = new sap.m.ObjectAttribute({
						text: "Reason: " + oAVData.comments,
						tooltip: "Reason: " + oAVData.comments
					});
					attribute.addStyleClass("redText");
					objHeader.addAttribute(attribute);
					return objHeader;
				}
			}
			// GASC Modules: Started - Darshna
			if (subServiceCode == "1700" || subServiceCode == "0036" || subServiceCode == "0303" || subServiceCode == "0402" || subServiceCode ==
				"0105" || subServiceCode == "0401" || subServiceCode == "0207" || subServiceCode == "0501" || subServiceCode == "0302" ||
				subServiceCode == "0206" || subServiceCode == "0205" || subServiceCode == "1706" || subServiceCode == "1707" || subServiceCode ==
				"0502" || subServiceCode == "1703" || subServiceCode == "1702"|| subServiceCode == "0101" || subServiceCode == "0503" || subServiceCode == "0505" ||
				subServiceCode == "0506" || subServiceCode == "0304" || subServiceCode == "0204") // || 
			//        subServiceCode == "1708" || subServiceCode == "1709" || subServiceCode == "1704" || subServiceCode == "0104" || subServiceCode == "0504" || 
			//        subServiceCode == "1701" || subServiceCode == "1705" || subServiceCode == "1912" || subServiceCode == "0504") 
			{
				if ((this.getView().getModel("GAComments").getData().length) > 0) {
					var oLen = this.getView().getModel("GAComments").getData().length;
					var text = "Reason: " + this.getView().getModel("GAComments").getData()[oLen - 1].Comments;
					var attribute = new sap.m.ObjectAttribute({
						text: text
					});
					attribute.addStyleClass("redText");
					objHeader.addAttribute(attribute);
				} else {
					var text = "Reason: Rejected by Approver";
					var attribute = new sap.m.ObjectAttribute({
						text: text
					});
					attribute.addStyleClass("redText");
					objHeader.addAttribute(attribute);
				}
			}
			// GASC Modules: Ended
			else {
				if (subServiceCode != "1708" && subServiceCode != "1709" && subServiceCode != "1704" && subServiceCode != "0104" && 
					subServiceCode != "0504" && subServiceCode != "1701" && subServiceCode != "1705" && subServiceCode != "1912" && 
					subServiceCode != "0507" && subServiceCode != "0102" && subServiceCode != "0202" && subServiceCode != "9202" && 
					subServiceCode != "0211" && subServiceCode != "8211" && subServiceCode != "9211" && subServiceCode != "0203" && 
					subServiceCode != "0306" && subServiceCode != "0310" && subServiceCode != "0413" && subServiceCode != "0414" && 
					subServiceCode != "0415" && subServiceCode != "0416" && subServiceCode != "0208" && subServiceCode != "0103" &&
					subServiceCode != "9103" && subServiceCode != "0502" && subServiceCode != "0505" && subServiceCode != "0501") {
					model = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel");
					modelData = model.oData[0];
					if (modelData.Comments == undefined || modelData.Comments == null || modelData.Comments == '') {
						if (modelData.FinComments == undefined || modelData.FinComments == null || modelData.FinComments == '') {
							text = "Reason: " + model.oData[0].GAComments;
						} else {
							text = "Reason: " + model.oData[0].FinComments;
						}

					} else {
						text = "Reason: " + model.oData[0].Comments;
						//      var text = "Reason: " + model.oData[0].Comments;
						//var text = "Reason: " + model.oData[0].Comments;
						var attribute = new sap.m.ObjectAttribute({
							text: text
						});
						attribute.addStyleClass("redText");
						objHeader.addAttribute(attribute);
					}
				}
			}

		} else {
			var attribute = new sap.m.ObjectAttribute({
				text: status
			});
			objHeader.addAttribute(attribute);
		}
		return objHeader;
	},

	getVPNDetails: function (requestId, listItem) {
		//andrea
		var oInternalModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oInternalModel, "oInternalModel");
		oInternalModel.setProperty("/ipVisible", false);
		oInternalModel.setProperty("/suggUserIdVisible", false);
		//andrea
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		var oRequestModel = this.getView().getModel("oRequestModel");
		var oDataModel = new sap.ui.model.json.JSONModel();
		oDataModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/VPNRequestSet?$filter=requestId eq '" + requestId + "'&$format=json", null,
			false);
		this.getView().setModel(oDataModel, "oDataModel");

		var data = oDataModel.getData().d.results[0];

		//andrea
		if (oDataModel.oData.d.results["0"].Stage == "AD Automation") {
			oInternalModel.setProperty("/suggUserIdVisible", true);
			sap.ui.getCore().byId('suggestedUserId').setValue(data.provisionedUserId); //andrea
			if (data.isSugUserChng == "") {
				sap.ui.getCore().byId('checkbox').setSelected(false); //andrea
			} else {
				sap.ui.getCore().byId('checkbox').setSelected(true);
			} //andrea
		} else {
			oInternalModel.setProperty("/suggUserIdVisible", false);
		}
		//andrea
		if (data != null) {
			if (data.vpn == "X") {
				sap.ui.getCore().byId("vpnType").setSelectedIndex(0);
			} else {
				sap.ui.getCore().byId("vpnType").setSelectedIndex(1);
			}
			if (data.request_type == "0001") { //andrea
				sap.ui.getCore().byId('hostIpId').setValue(data.eIPAddress);
				oInternalModel.setProperty("/ipVisible", true);
				//sap.ui.getCore().byId('hostIpId').setTooltip(data.eIPAddress);
				oRequestModel.setProperty("/hostIpId", data.eIPAddress);
			} //andrea

			if (data.dobPass != null) { //andrea
				var dobDate = data.dobPass;
				var startIndex = dobDate.indexOf("(");
				var endIndex = dobDate.indexOf(")");
				dobDate = dobDate.substring(startIndex + 1, endIndex)
				dobDate = new Date(parseInt(dobDate)).toString();
				dobDate = dobDate.split(" ");

				if (data.request_type == "0001") {
					sap.ui.getCore().byId('dob').setValue(dobDate[1] + " " + dobDate[2] + " " + dobDate[3]);
				}
				//      sap.ui.getCore().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
			} //andrea

			if (data.VPNExpiryDate != null) {
				var expiryDate = data.VPNExpiryDate;
				var startIndex = expiryDate.indexOf("(");
				var endIndex = expiryDate.indexOf(")");
				expiryDate = expiryDate.substring(startIndex + 1, endIndex)
				expiryDate = new Date(parseInt(expiryDate)).toString();
				expiryDate = expiryDate.split(" ");

				if (data.request_type == "0001") {
					sap.ui.getCore().byId('expDateNew').setValue(expiryDate[1] + " " + expiryDate[2] + " " + expiryDate[3]);
				} else {
					sap.ui.getCore().byId('expiryDate').setValue(expiryDate[1] + " " + expiryDate[2] + " " + expiryDate[3]);
				}
				//      sap.ui.getCore().byId('expiryDate').setValue(expiryDate[1]+" "+expiryDate[2]+" "+expiryDate[3]);
			}
			sap.ui.getCore().byId('justification').setValue(data.Justification);
			//  sap.ui.getCore().byId('justification').setTooltip(data.Justification);
			oRequestModel.setProperty("/justification", data.Justification);

			if (data.request_type == "0001") {
				sap.ui.getCore().byId('eFname').setValue(data.eFirstName);
				sap.ui.getCore().byId('eMname').setValue(data.eMiddleName);
				sap.ui.getCore().byId('eLname').setValue(data.eLastName);
				sap.ui.getCore().byId('eEmail').setValue(data.eMail);
				//sap.ui.getCore().byId('dob').setValue(data.dobPass);
				/*sap.ui.getCore().byId('eFname').setTooltip(data.eFirstName);
				sap.ui.getCore().byId('eMname').setTooltip(data.eMiddleName);
				sap.ui.getCore().byId('eLname').setTooltip(data.eLastName);
				sap.ui.getCore().byId('eEmail').setTooltip(data.eMail);*/
				oRequestModel.setProperty("/eFname", data.eFirstName);
				oRequestModel.setProperty("/eMname", data.eMiddleName);
				oRequestModel.setProperty("/eLname", data.eLastName);
				oRequestModel.setProperty("/eEmail", data.eMail);
				var step = this.getStage(listItem.getCustomData());
				if (step == "Resolved" && data.provisionedUserId != "") {
					sap.ui.getCore().byId('UIDSection').setVisible(true);
					//sap.ui.getCore().byId('suggestedUID').setText(data.provisionedUserId);

				}
				//sap.ui.getCore().byId('adAccount').setVisible(false);
			} else {
				sap.ui.getCore().byId('adAccount').setValue(data.adId);
				//sap.ui.getCore().byId('adAccount').setTooltip(data.adId);
				oRequestModel.setProperty("/adAccount", data.adId);
				sap.ui.getCore().byId('renewType').setVisible(true);
				sap.ui.getCore().byId('newType').setVisible(false);
			}
			sap.ui.getCore().byId('newOrRenew').setValue(data.reqTypeDesc);

			//For reading the data
			var url = "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + requestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
			var oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData(url, null, false);
			if (oFileModel.getData().d.results[0].URL != "") {
				sap.ui.getCore().byId('fileSection').setVisible(true);
				sap.ui.getCore().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
			}
		}
	},

	getTERDetails: function (requestId) {
		if (!jQuery.support.touch || jQuery.device.is.desktop) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		//Ticket detail
		var oDataModel = new sap.ui.model.json.JSONModel();
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/TERRequestSet?$filter=RequestId eq '" + requestId +
			"'&$expand=TERToPow,TERToTmm,TERToSow&$format=json");
		oDataModel.loadData(url, null, false);
		this.getView().setModel(oDataModel, "oDataModel");
		var data = oDataModel.getData().d.results[0];

		if (data != null) {
			sap.ui.getCore().byId('workPermitId').setValue(data.WorkPermit);
			sap.ui.getCore().byId('workPermitId').setTooltip(data.WorkPermit);
			if (data.IsReqtAccReq == "X") {
				sap.ui.getCore().byId('partOfTeamId').setSelected(true);
			}
			if (data.IsOtherTeamAccReq == "X") {
				sap.ui.getCore().byId('othersId').setSelected(true);
			}
			if (data.TERToTmm.results.length > 0) {
				sap.ui.getCore().byId('othersId').setSelected(true);
				sap.ui.getCore().byId('othersTblId').setVisible(true);

				var pHistory = sap.ui.getCore().byId('othersTblId');
				pHistory.unbindItems();
				var oVmsLookupModel = new sap.ui.model.json.JSONModel();
				oVmsLookupModel.setProperty("/results", data.TERToTmm.results);
				pHistory.setModel(oVmsLookupModel);
				pHistory.bindAggregation("items", "/results", new sap.m.ColumnListItem({
					cells: [

						new sap.m.Text({
							text: "{KaustID}"
						}),
						new sap.m.Text({
							text: "{Name}"
						})
					]
				}));
			}

			if (data.StartTime != "") {
				//  var startDate = this.convertDateBack(parseInt(data.StartTime));
				//  sap.ui.getCore().byId('startDateId').setValue(startDate);
				var startDateDisp = new Date(parseInt(data.StartTime)).toString();
				startDateDisp = startDateDisp.split(":00 ");
				sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
			}
			if (data.EndTime != "") {
				var startDate = new Date(parseInt(data.StartTime));
				var endDate = new Date(parseInt(data.EndTime));
				var diff = endDate.getDate() - startDate.getDate();
				if (diff == 0) {
					sap.ui.getCore().byId('endDateId').setValue("Same day");
				} else {
					sap.ui.getCore().byId('endDateId').setValue("Next day");
				}
			}

			//Andrea editing starts here
			sap.ui.getCore().byId('buildingId').setValue(data.Building);
			sap.ui.getCore().byId('levelSelId').setValue(data.Level);
			//sap.ui.getCore().byId('terRoomId').setValue(data.Room);
			sap.ui.getCore().byId('terRoomId').setText(data.Room);
			//Andrea editing ends here

			sap.ui.getCore().byId('buildingId').setTooltip(data.Building);
			sap.ui.getCore().byId('levelSelId').setTooltip(data.Level);
			sap.ui.getCore().byId('terRoomId').setTooltip(data.Room);

			var result = this.getFields(data.TERToSow.results, "scopeOfWork");
			if (result.indexOf("Power Activity/ Survey") != -1) {
				sap.ui.getCore().byId('powerActId').setSelected(true);
				var resultObject = this.search("Power Activity/ Survey", data.TERToSow.results);
				sap.ui.getCore().byId('pwrLbl').setVisible(true);
				//sap.ui.getCore().byId('pwrRdBtn').setVisible(true); 
				this.radioBtn = new sap.m.RadioButtonGroup("pwrRdBtn", {
					buttons: [
						new sap.m.RadioButton({
							text: "No"
						}),
						new sap.m.RadioButton({
							text: "Yes"
						})
					],
					enabled: false
				});
				var vBox = sap.ui.getCore().byId("pwrActVbox").insertItem(this.radioBtn, 2);
				sap.ui.getCore().byId('pwrRdBtn').setSelectedIndex(parseInt(resultObject.powerBackup));
			}
			if (result.indexOf("A/C Maintenance") != -1) {
				sap.ui.getCore().byId('acMaintId').setSelected(true);
			}
			if (result.indexOf("TER Cleaning") != -1) {
				sap.ui.getCore().byId('terCleanId').setSelected(true);
			}
			if (result.indexOf("Cable Pulling and Testing") != -1) {
				sap.ui.getCore().byId('cblChkId').setSelected(true);
				sap.ui.getCore().byId('cblAgreeId').setVisible(true);
				sap.ui.getCore().byId('cblAgreeId').setSelected(true);
			}
			if (result.indexOf("HSE Inspection") != -1) {
				sap.ui.getCore().byId('hseInspectId').setSelected(true);
			}
			if (result.indexOf("Others") != -1) {
				sap.ui.getCore().byId('otherChkId').setSelected(true);
				var resultObject = this.search("Others", data.TERToSow.results);
				sap.ui.getCore().byId('othersTextId').setVisible(true);
				sap.ui.getCore().byId('othersTextId').setValue(resultObject.sowComments);
				sap.ui.getCore().byId('othersTextId').setTooltip(resultObject.sowComments);
			}
			if (data.PowerInterrupt == "X") {
				sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(1);
				sap.ui.getCore().byId('pwrChkBoxId').setVisible(true);
				var powRes = data.TERToPow.results;
				if (powRes.length > 0) {
					for (var i = 0; i < powRes.length; i++) {
						if (powRes[i].CircuitType == "PR") {
							sap.ui.getCore().byId('prCbId').setSelected(true);
							sap.ui.getCore().byId('inpPrId').setVisible(true);
							sap.ui.getCore().byId('inpPrId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpPrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if (powRes[i].CircuitType == "BPR") {
							sap.ui.getCore().byId('brCbId').setSelected(true);
							sap.ui.getCore().byId('inpBrId').setVisible(true);
							sap.ui.getCore().byId('inpBrId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpBrId').setTooltip(powRes[i].EquipmentNumber);
						}
						if (powRes[i].CircuitType == "EPR") {
							sap.ui.getCore().byId('eprCbId').setSelected(true);
							sap.ui.getCore().byId('inpEcId').setVisible(true);
							sap.ui.getCore().byId('inpEcId').setValue(powRes[i].EquipmentNumber);
							sap.ui.getCore().byId('inpEcId').setTooltip(powRes[i].EquipmentNumber);
						}
					}
				}
			} else {
				sap.ui.getCore().byId("PowerRadioGrpId").setSelectedIndex(parseInt(data.PowerInterrupt));
			}
			sap.ui.getCore().byId("acIntRadioGrpId").setSelectedIndex(parseInt(data.AcInterruption));
			if (data.AcInterruption == "2") {
				sap.ui.getCore().byId('acAgreeId').setSelected(true);
				sap.ui.getCore().byId('acAgreeId').setVisible(true);
			}

		}

		// User Detail Model
		var that = this;
		var oUserModel = new sap.ui.model.json.JSONModel();
		oUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + data.kaustId + "',UserId='')?$format=json", null,
			true);
		oUserModel.attachRequestCompleted(function (oEvent) {
			if (oEvent.getParameter("success")) {
				that.getView().setModel(oUserModel, "oUserModel");
			}
		});
		oUserModel.attachRequestFailed(function (oEvent) {
			sap.m.MessageBox.error(oEvent.getParameter("statusCode") + ":" + oEvent.getParameter("statusText"), {
				title: "Failed to load User Detail",
				onClose: null,
				textDirection: sap.ui.core.TextDirection.Inherit
			});
		});
	},

	getFields: function (input, field) {
		var output = [];
		for (var i = 0; i < input.length; ++i) {
			output.push(input[i][field]);
		}
		return output;
	},

	search: function (nameKey, myArray) {
		for (var i = 0; i < myArray.length; i++) {
			if (myArray[i].scopeOfWork === nameKey) {
				return myArray[i];
			}
		}
	},

	/**
	 * Fetch the details for Admin Rights Process  
	 **/
	getAdminAccessDetails: function (requestId) {
		var oDataModel = new sap.ui.model.json.JSONModel();
		var oPortModel = this.getView().getModel("oPortModel");
		oPortModel.setProperty("/idExpiryDate", false); //andrea
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AdminRightsReqSet?$filter=requestId eq '" + requestId + "'&$format=json");
		oDataModel.loadData(url, null, false);
		this.getView().setModel(oDataModel, "adminModel");
		var data = oDataModel.getData().d.results[0];
		if (data.custodianUserId) {
			var oTUserModel = new sap.ui.model.json.JSONModel();
			oTUserModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserID(KaustID='',UserId='" + data.custodianUserId + "')", null, false);
			var custodainName = oTUserModel.getProperty("/d/FirstName") + " " + oTUserModel.getProperty("/d/LastName");
		}
		/*  if (data.custodian === "X") {
		    sap.ui.getCore().byId("custodianName").setVisible(true);
		    sap.ui.getCore().byId("custodianName").setText(custodainName);
		    oPortModel.setProperty("/iCustodianRB", 1);
		  } else {
		    oPortModel.setProperty("/iCustodianRB", 0);
		    sap.ui.getCore().byId("custodianName").setVisible(false);
		  }*/
		if (data.requestType === "Custodian") {
			oPortModel.setProperty("/iCustodianRB", 0);
			sap.ui.getCore().byId("custodianName").setVisible(false);
		} else {
			sap.ui.getCore().byId("custodianName").setVisible(true);
			sap.ui.getCore().byId("custodianName").setText(custodainName);
			oPortModel.setProperty("/iCustodianRB", 1);
		}
		oPortModel.setProperty("/tagNumber", data.tagNumber);
		//      sap.ui.getCore().byId("idTagInput").setValue();
		oPortModel.setProperty("/sJustText", data.justification);
		// Andrea adding linuxip
		oPortModel.setProperty("/IP", data.linuxIp);
		// Roopali - set User ID 
		oPortModel.setProperty("/userKaustID", data.userid_ext);
		//Andrea
		var aOperSys = data.operatingSystem.split(",");
		aOperSys.forEach(function (oEle) {
			oEle === "Windows" ? sap.ui.getCore().byId("idWinCB").setSelected(true) : oEle === "Mac" ? sap.ui.getCore().byId("idMacCB").setSelected(
				true) : sap.ui.getCore().byId("idLinuxCB").setSelected(true);
		});

		// Andrea code for making IP visible or not visible
		if (aOperSys[0] === "Linux") {
			oPortModel.setProperty("/bIpVisible", true);
			oPortModel.setProperty("/userIDVisible", true); //Roopali
			oPortModel.setProperty("/idExpiryDate", false);
		} else {
			oPortModel.setProperty("/bIpVisible", false);
			oPortModel.setProperty("/userIDVisible", false); // Roopali
			oPortModel.setProperty("/idExpiryDate", false); // Roopali(17-09-2018) expiry date field is not required 

		}
		//Andrea

		oPortModel.setProperty("/Onbehalf", data.Onbehalf);
		oPortModel.setProperty("/selectedOperSys", aOperSys);
		oPortModel.setProperty("/comments", data.comments);
		oPortModel.setProperty("/bWinEnable", false);
		oPortModel.setProperty("/bMacEnable", false);
		oPortModel.setProperty("/bLinuxEnable", false);
		oPortModel.setProperty("/bEnableFields", false);
		oPortModel.setProperty("/bTagSelect", false);
		oPortModel.setProperty("/bTagInpEnable", false);
		oPortModel.setProperty("/bTagInput", true);
		//Andrea
		oPortModel.setProperty("/bIPEnable", false);
		oPortModel.setProperty("/userIDEnable", false); // Roopali

		;
		// Roopali - expiry date field is removed
		/*if(aOperSys[0]!="Linux"){
		var startDateDisp = new Date(parseInt(data.expDate.split("(")[1].split(")")[0])).toDateString();
		oPortModel.setProperty("/oDateValue",startDateDisp);
		}
		else{
		  oPortModel.setProperty("/oDateValue","");
		}*/

		//      startDateDisp = startDateDisp.split(":00 ");
		//      sap.ui.getCore().byId('startDateId').setValue(startDateDisp[0]);
		//      var aDate = new Date(parseInt(data.expDate.split("(")[1].split(")")[0]))

		//      sap.ui.getCore().byId("idTNCCheckBox").setSelected(true);
		oPortModel.refresh();

	},

	getPortDetails: function (requestId) {
		var oDataModel = new sap.ui.model.json.JSONModel();
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/PortActivationRequest?$filter=RequestId eq '" + requestId +
			"'&$format=json");
		oDataModel.loadData(url, null, false);
		var data = oDataModel.getData().d.results[0];
		sap.ui.getCore().byId('reqTypeId').setValue(data.reqTypeDesc);
		// sap.ui.getCore().byId('subHeader').setText(data.Request_Type);
		sap.ui.getCore().byId('idPortNo').setValue(data.Port_Tag_Number);
		sap.ui.getCore().byId('idPortNo').setTooltip(data.Port_Tag_Number);
		if (data.Request_Type != "0001") {
			sap.ui.getCore().byId('serviceId').setVisible(true);
			sap.ui.getCore().byId('idServType').setValue(data.Service_Type);
			sap.ui.getCore().byId('idServType').setTooltip(data.Service_Type);
		}
		sap.ui.getCore().byId('idBul').setValue(data.Building);
		sap.ui.getCore().byId('idBul').setTooltip(data.Building);
		sap.ui.getCore().byId('idLevel').setValue(data.Level);
		sap.ui.getCore().byId('idLevel').setTooltip(data.Level);
		sap.ui.getCore().byId('idRoom').setValue(data.Room);
		sap.ui.getCore().byId('idRoom').setTooltip(data.Room);
		sap.ui.getCore().byId('ipAddress').setValue(data.ipAddress); //andrea
		this.disableAllPortFields();
	},

	disableAllPortFields: function () {
		sap.ui.getCore().byId('reqTypeId').setEnabled(false);
		sap.ui.getCore().byId('idPortNo').setEnabled(false);
		sap.ui.getCore().byId('idServType').setEnabled(false);
		sap.ui.getCore().byId('idBul').setEnabled(false);
		sap.ui.getCore().byId('idLevel').setEnabled(false);
		sap.ui.getCore().byId('idRoom').setEnabled(false);
	},

	getEmailDistrGrp: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Gemail(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		var that = this;
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);

			sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.Grpdisplayname);
			sap.ui.getCore().byId("coOwnGrp").setText(oModelVScan.oData.COwneremail);
			sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.Grpemail);
			sap.ui.getCore().byId("primeOwnGrp").setText(oModelVScan.oData.Grpmember);
			//call for delegates
			var authSenders = oModelVScan.oData.Authsender;
			if (authSenders == "") {
				sap.ui.getCore().byId("authSenders").setText("No restriction");
			}
			that.getMultiFieldsEmailDistrReadOnly(requestId);

			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "emailDistrModel");

			sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);

	},

	getGenEmail: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Email(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		var that = this;
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);

			var reqType = oModelVScan.oData.Requesttype;
			sap.ui.getCore().byId("reqType").setText(oModelVScan.oData.Requesttype);
			if (reqType == "Generic Account") {
				sap.ui.getCore().byId("emailTxt").setText(oModelVScan.oData.Remail);
				sap.ui.getCore().byId("primeOwnBox").setText(oModelVScan.oData.Owneremail);
				sap.ui.getCore().byId("reqLogin").setVisible(false);
				//call for delegates
				that.getMultiFieldsGenEmailReadOnly(requestId);
			} else {
				sap.ui.getCore().byId("emailTxt").setVisible(false);
				sap.ui.getCore().byId("primeOwnBox").setVisible(false);
				sap.ui.getCore().byId("delegate").setVisible(false);
				sap.ui.getCore().byId("reqLogin").setText(oModelVScan.oData.Ruserid);
			}
			sap.ui.getCore().byId("dispName").setText(oModelVScan.oData.Displayname);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "emailModel");

			sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);

	},

	getEfax: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Fax(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		var that = this;
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);

			var efaxType = "";
			if (oModelVScan.oData.Localonly == "X") {
				efaxType = "Local Only";
			} else if (oModelVScan.oData.Localnational == "X") {
				efaxType = "Local and National";
			} else if (oModelVScan.oData.Localinational == "X") {
				efaxType = "Local/National/International";
			}
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "efaxModel");
			sap.ui.getCore().byId("efaxText").setText(efaxType);
			sap.ui.getCore().byId("descr").setText(oModelVScan.oData.Accountdesc);

		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);

	},

	getLoanEquip: function (requestId, kaustId) {

		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Loanequip(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		var that = this;
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "confRoomModel");
			// sap.ui.getCore().byId("loanForm").setVisible(false);

			var startData = oModelVScan.oData.Startdate;
			// var msString = startData.slice(6, 19);
			// var msInt = parseInt(msString);
			var startDate = that.convertDateBack(startData);
			var start = startDate + " " + oModelVScan.oData.Starttime;
			sap.ui.getCore().byId("startTime").setVisible(true).setText(start);

			var endData = oModelVScan.oData.Enddate;
			// var msString = endData.slice(6, 19);
			// var msInt = parseInt(msString);
			var endDate = that.convertDateBack(endData);
			var end = endDate + " " + oModelVScan.oData.Endtime;
			sap.ui.getCore().byId("endTime").setVisible(true).setText(end);

			// devices and access. tab
			var devices = "";
			if (oModelVScan.oData.Pasystem == "X") {
				devices = devices + "Portable PA System;";
			}
			if (oModelVScan.oData.Projector == "X") {
				devices = devices + "Projector;";
			}
			if (oModelVScan.oData.Speaker == "X") {
				devices = devices + "Speaker;";
			}
			if (oModelVScan.oData.Screen == "X") {
				devices = devices + "Screen;";
			}
			if (oModelVScan.oData.Clicker == "X") {
				devices = devices + "Clicker;";
			}
			if (oModelVScan.oData.Appledviconnector == "X") {
				devices = devices + "Apple mini-DVI Connector;";
			}
			if (oModelVScan.oData.Hdmidviconnector == "X") {
				devices = devices + "HDMI-DVI Connector;";
			}
			if (oModelVScan.oData.Visualizer == "X") {
				devices = devices + "Visualizer;";
			}
			if (oModelVScan.oData.Vgaconnector == "X") {
				devices = devices + "VGA Scaler Connector;";
			}
			sap.ui.getCore().byId("avTxt").setVisible(true).setText(devices);

			// computer and access.
			var computers = "";
			if (oModelVScan.oData.Imacworkstation == "X") {
				computers = computers + oModelVScan.oData.Quantity + " iMac workstation;";
			}
			if (oModelVScan.oData.Printer == "X") {
				computers = computers + oModelVScan.oData.Quantity1 + " Printer;";
			}
			if (oModelVScan.oData.Lmacbookair == "X") {
				computers = computers + oModelVScan.oData.Quantity2 + " Laptop MacBook Air;";
			}
			if (oModelVScan.oData.Scanner == "X") {
				computers = computers + oModelVScan.oData.Quantity3 + " Scanner;";
			}
			if (oModelVScan.oData.Applemonitor == "X") {
				computers = computers + oModelVScan.oData.Quantity4 + " Apple Monitor;";
			}
			if (oModelVScan.oData.Others != "") {
				computers = computers + oModelVScan.oData.Quantity5 + " " + oModelVScan.oData.Others + ";";
			}
			if (oModelVScan.oData.Lmacair == "X") {
				computers = computers + oModelVScan.oData.Quantity6 + " iMac workstation;";
			}
			sap.ui.getCore().byId("devices").setVisible(true).setText(computers);
			sap.ui.getCore().byId("reason").setText(oModelVScan.oData.Reason);
			if (oModelVScan.oData.Reason == "Repair") {
				sap.ui.getCore().byId("incidentLbl").setVisible(true);
				sap.ui.getCore().byId("incident").setVisible(true).setText(oModelVScan.oData.Incireport);
			}

			sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
			sap.ui.getCore().byId("loanForm").setModel(oModelVScan);
			// sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.Replenishid);

		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);
	},

	getReplenishEquip: function (requestId, kaustId) {

		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Replenish(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "transferModel");
			sap.ui.getCore().byId("transferToForm").setVisible(false);
			sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
			sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.ReplenishName);

		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);
	},

	getTransferEquip: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Transferequipment(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		// var filterstr = "Replenish(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		that = this;
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();
			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "transferModel");
			sap.ui.getCore().byId("itComment").setText(oModelVScan.oData.Justification);
			sap.ui.getCore().byId("inputItem").setText(oModelVScan.oData.Replenishitem.replace(/#/g, '\n'));
			sap.ui.getCore().byId("equipNo").setText(oModelVScan.oData.Equipnum.replace(/#/g, '\n'));
			sap.ui.getCore().byId("transferToForm").setModel(oModelVScan);;
			//   that.getMultiFieldsTransferIT(requestId);
		}, function (response) {
			return "";
		});
		this.getUserData(kaustId, requestId);
	},

	getConfereceRoomData: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var oModelVScan = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().byId("Detail").setModel(oModelVScan, "confRoomModel");
		var filterstr = "Vsm?$filter=RequestId eq '" + requestId + "'";
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			//  var oModelVScan = new sap.ui.model.json.JSONModel();
			oModelVScan.setData(data.results[0]);
			//  sap.ui.getCore().byId("Detail").setModel(oModelVScan, "confRoomModel");
		}, function (response) {
			return "";
		});
		this.getDeletedDates(requestId, oModelVScan);
	},
	getDeletedDates: function (requestId, oModelVScan) {
		var that = this,
			detedDatesTxt = sap.ui.getCore().byId("canceledDate"),
			url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DeletedDatesSet?$filter=RequestId eq '" + requestId + "'");
		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: 'GET',
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				var DateArray = [],
					formattedDateArray = [];
				for (var i = 0; i < oResponse.d.results.length; i++) {
					DateArray.push(that.convertDateBack(parseInt(oResponse.d.results[i].Starttimestamp.substr(6, 13))));
					formattedDateArray.push(new Date(parseInt(oResponse.d.results[i].Starttimestamp.substr(6, 13))));
				}
				oModelVScan.setProperty('/DeletedDastes', DateArray);
				oModelVScan.setProperty('/DeletedDastesFormated', formattedDateArray);
				oModelVScan.refresh(true);
				/*if(DateArray.length>0){
				   detedDatesTxt.setVisible(true).setText(DateArray.join());
				      }*/
				/* var oModelDeletedDates = new sap.ui.model.json.JSONModel();
				 oModelDeletedDates.setData(oResponse.results[0]);
				    sap.ui.getCore().byId("Detail").setModel(oModelDeletedDates, "confRoomDeletedDatesModel");*/

			},
			error: function () {}
		})
	},

	getPortData: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Vsm(RequestId='" + requestId + "',KaustId='" + kaustId + "')";
		var filterstr = "PortActivationRequest?$filter=RequestId eq '20919775'&$format=json";
		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "portModel");

		}, function (response) {
			return "";
		});
	},

	getSecurityIncidentData: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "SecurityIncidentRequest(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "SIncidentModel");

		}, function (response) {
			return "";
		});
	},
	getVulnerabilityScanData: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "Vulnerabilityscan(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelVScan = new sap.ui.model.json.JSONModel();

			oModelVScan.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelVScan, "VScanModel");

		}, function (response) {
			return "";
		});
	},
	getAccessRequestData: function (requestId, kaustId) {
		var oModelMyRequests = sap.ui.getCore().byId("Master").getModel("MyRequests");
		var filterstr = "AccessRequest(RequestId='" + requestId + "',KaustId='" + kaustId + "')";

		oModelMyRequests.read(filterstr, null, null, false, function (data, response) {
			var oModelARequest = new sap.ui.model.json.JSONModel();

			oModelARequest.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelARequest, "ARequestModel");
			sap.ui.getCore().byId("SFDetails").setModel(oModelARequest);

		}, function (response) {
			return "";
		});
		// this.getUserData(kaustId);
	},
	getIqamaRenewelOrExitEntryRequest: function (requestId, kaustId) {
		var oDataURLMyRequests = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
		var oModelRequest = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests)); // Darshna - this.getUrl added
		var filterstr = "Requests(RequestId='" + requestId + "',Lock='')";

		oModelRequest.read(filterstr, null, null, false, function (data, response) {
			var oModelIREERequest = new sap.ui.model.json.JSONModel();

			oModelIREERequest.setData(data);
			sap.ui.getCore().byId("Detail").setModel(oModelIREERequest, "IREEModel");

		}, function (response) {
			return "";
		});
	},
	getIqamaRenewelOrExitEntryRequestDetails: function (requestId) {
		var oDataURLMyRequests = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
		var oModelRequest = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests)); // Darshna - this.getUrl added
		var filter = "UserDependents/?$filter=RequestId eq '" + requestId + "'";

		oModelRequest.read(filter, null, null, false, function (data, response) {
			var oModelIREERequest = new sap.ui.model.json.JSONModel();

			if (data.results[0].SubServiceCode == "0203") {
				if (data.results[0].VisaExpired == "true") {
					data.results[0].VisaExpired = "Yes";
				} else if (data.results[0].VisaExpired == "false") {
					data.results[0].VisaExpired = "No";
				}
			}

			oModelIREERequest.setData(data.results);
			sap.ui.getCore().byId("Detail").setModel(oModelIREERequest, "IqamaDetailsModel");

		}, function (response) {
			return "";
		});
	},

	back: function (pageId) {
		this.getView().app.backToPage(pageId);
	},
	getProcessStages: function (listItem, status, detailsForm) {
		var step = this.getStage(listItem.getCustomData());
		var serviceCode = this.getSubServiceCode(listItem.getCustomData());
		// Zakeer : CRM for port,ter and Library Excessive Download
		//0053 - data center
		if (serviceCode == "0051" || serviceCode == "0052" || serviceCode == '0053' || serviceCode == '0055' || serviceCode === "0026" ||
			serviceCode === "0016") {} else {
			if (step == 'CRM') {
				step = 'IT Service Desk';
			} else if (step == 'PM') {
				step = 'Completed';
			}
			//else if (step == 'Recipient Approval') {
			//step = 'Recipient Acknowledgement';
			//}
		}
		if (serviceCode == "0102" && (step == "Line Manager Approval" || step == "Graduate Affairs Approval")) {
			step = "LM/Graduate Affairs Approval";
		}
		var that = this;
		var oDialog = new sap.m.BusyDialog();
		var brmURL = this.getBRMUrl();
		oDialog.open();
		$.ajax({
			url: brmURL,
			async: "false",
			dataType: "jsonp",
			contentType: "application/json",
			jsonpCallback: "a" + serviceCode,
			// Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
			success: function (response) {
				if (response.stage1 != null) {
					var brmResult = [response.stage1, response.stage2, response.stage3, response.stage4, response.stage5, response.stage6, response.stage7,
						response.stage8, response.stage9, response.stage10
					];
					var processFlow = that.getProcessFlow(step, brmResult, status);
					//29-03-2018 Incture (for changing the text of process flow)
					if (serviceCode === "0009") {
						var len = processFlow.getLanes().length;
						for (var i = 0; i < len; i++) {
							var processText = processFlow.getLanes()[i];
							if (processText.getText() === "Recipient Line Manager Approval") {
								processText.setText("Recipient line manager Approval");
							} else if (processText.getText() === "Recipient Approval") {
								processText.setText("Recipient Acknowledgement");
							}
						}
					}
					var contents = detailsForm.getContent();
					detailsForm.removeAllContent();
					detailsForm.addContent(processFlow);
					for (c in contents) {
						detailsForm.addContent(contents[c]);
					}
				}
				oDialog.destroy();
				detailsForm.rerender();
			},
			error: function () {
				oDialog.destroy();
				detailsForm.rerender();
			}
		});
	},
	getProcessStages1: function (listItem, status, detailsForm, serviceCode) {
		var step = this.getStage(listItem.getCustomData());
		if (step == 'CRM') {
			step = 'IT Service Desk';
		}
		//var serviceCode = this.getSubServiceCode(listItem.getCustomData());
		var that = this;
		var oDialog = new sap.m.BusyDialog();
		var brmURL = this.getBRMUrl();
		oDialog.open();
		$.ajax({
			url: brmURL,
			async: "false",
			dataType: "jsonp",
			contentType: "application/json",
			jsonpCallback: "a" + serviceCode,
			// Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
			success: function (response) {
				if (response.stage1 != null) {
					var brmResult = [response.stage1, response.stage2, response.stage3, response.stage4, response.stage5, response.stage6, response.stage7,
						response.stage8, response.stage9, response.stage10
					];
					var processFlow = that.getProcessFlow(step, brmResult, status);
					var contents = detailsForm.getContent();
					detailsForm.removeAllContent();
					detailsForm.addContent(processFlow);
					for (c in contents) {
						detailsForm.addContent(contents[c]);
					}
				}
				oDialog.destroy();
				detailsForm.rerender();
			},
			error: function () {
				oDialog.destroy();
				detailsForm.rerender();
			}
		});
	},
	getBRMUrl: function () {
		var host = window.location.hostname;

		if (host == "localhost") {
			// Darshna - Edited : Replaced http with https
			return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
		}
		if (host.indexOf("kaust.edu.sa") == -1) {
			host = host + ".kaust.edu.sa";
		}

		switch (host) {

		case 'sthcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://sthpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			} else { //port == "8005" ||port == "8006"
				return "https://sthpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			}
			break;
		case 'kstcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://kstpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			} else { //port == "8005" ||port == "8006"
				return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			}
			break;
		case 'sthgwpsrcs.kaust.edu.sa':
			return "https://sthpop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			break;
		case 'kstgwpsrcs.kaust.edu.sa':
			return "https://kstspop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			break;
			// Darshna - Edited : Added a switch case for localhost
		case 'localhost':
			return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
		}
		return;
	},
	getProcessFlow: function (step, stages, status) {
		var processFlow = new sap.suite.ui.commons.ProcessFlow();
		var processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
		var stepFound = false;
		var icon = "sap-icon://employee-approvals";
		var subService = this.getView().getModel("helpModel").getData().helpItems.serviceOpened;
		var oSubCode = this.getView().getModel("helpModel").getData().helpItems.subServiceCode;
		//Zakeer : Resolved status
		if (subService == "Port Activation" || subService == "TER Access Process" || subService == "Data Center Access Process" || subService ==
			"VPN Access for externals Process" || subService == "Admin Rights Process" || subService == "Audio Visual Services" || oSubCode ===
			"0026" || oSubCode === "0016") {
			if (status == "Initiated") {
				return;
			}
			var isCompleted = $.inArray(status, ["Rejected", "Cancelled"]);
			// For VPN skipping Info sec stage
			if (subService == "VPN Access for externals Process") {
				var data = this.getView().getModel("oDataModel").getData().d.results[0];
				if (data.vpn == "X" && data.activityType == "New" && data.flow == "Non-Academic") {} else {
					stages.shift();
				}
				//if(data.requestType=="Non VPN"){ 
				if (!(data.vpn == "X" && data.activityType == "New")) {
					var index = stages.indexOf("CRM");
					stages.splice(index, 1);
				}
				var index = stages.indexOf("AD Automation");
				if (index && data.requestType == "VPN" && data.reqTypeDesc == "New") {
					stages[index] = "Account Creation";
				} else if (index && data.requestType == "VPN" && data.reqTypeDesc == "Renew") {
					stages[index] = "Account Renewal";
				} else if (index && data.requestType == "Non VPN") {
					stages[index] = "Account Provision";
				}
				if (step == "AD Automation") {
					step = stages[index];
				}

				var index = stages.indexOf("CRM");
				if (index) {
					stages[index] = "Info Sec Team";
					if (step == "CRM") {
						step = stages[index];
					}
				}
			}
			if (subService == 'Data Center Access Process') {
				var data = this.getView().getModel("dataCenter").getData().d.results[0];
				if (data.requestType == "Non-Contractor") {
					var index = stages.indexOf("Line Manager");
					stages.splice(index, 1);
				}
				if (data.flow == "YES") {
					var index = stages.indexOf("KAUST Security");
					stages.splice(index, 1);
				}
				if (step == "CRM") {
					step = "Data Center Access";
				}

				if (step == "Justification") {
					step = "Pre Screening";
				}

				if (!data.justification) {
					var index = stages.indexOf("Justification");
					stages.splice(index, 1);
				}

				var index = stages.indexOf("Justification");
				stages[index] = "Pre Screening";
				//          var index = stages.indexOf("CRM");
				//              if(index){
				//               stages[index]="Data Center Access";
				//            }

				//Pavithra -- for pre step justification ---- start
				if (data.RequestId && data.approverStatus == 1 || data.RequestId && data.approverStatus == 2 || data.RequestId && data.approverStatus ==
					3) {
					var index = stages.indexOf("KAUST Security");
					//            stages.splice(index, 1);
				} else {
					var index = stages.indexOf("Justification");
					stages.splice(index, 1);
					var index = stages.indexOf("Requester");
					stages.splice(index, 1);
				}
				//Pavithra -- for pre step justification ---- end
			}
			if (subService == "Admin Rights Process") {
				var data = this.getView().getModel("oPortModel").getData();
				var index = stages.indexOf("CRM");
				if (index) {
					stages[index] = "IT Service Desk"
				}
				if (data.Onbehalf != "X") {
					var index = stages.indexOf("Line Manager");
					stages.splice(index, 1);
				}
				// Roopali(03-07-2018) -comment the code to change the road map for Linux 
				/*  if(data.selectedOperSys){

				  var present = data.selectedOperSys.indexOf("Linux");
				  if(present!=-1) {
				  var index = stages.indexOf("IT Service Manager");
				    stages.splice(index, 1);
				  }
				  // roopali changes end
				  //to be removed once stage is updated in BPM / ECC
				}*/
			}
			if (subService == "Audio Visual Services") {
				var oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
				var index1, index2, index3, index4;
				if (oAVData.requestType === "NA") {
					index1 = stages.indexOf("IT Service Desk");
					stages.splice(index1, 1);
					index2 = stages.indexOf("Requester Feedback");
					stages.splice(index2, 1);
				}
				if (oAVData.activityType === "NA") {
					index1 = stages.indexOf("Room Booking Team");
					stages.splice(index1, 1);
				}
				if (oAVData.activityType === "NA" && oAVData.requestType === "NA") {
					index1 = stages.indexOf("IT Service Desk");
					stages.splice(index1, 1);
					index2 = stages.indexOf("Requester Feedback");
					stages.splice(index2, 1);
					index3 = stages.indexOf("Room Booking Team");
					stages.splice(index3, 1);
				}
				//29-03-2018 Incture(Andrea) checking for flow 
				if (oAVData.flow === "Library") {
					index4 = stages.indexOf("Room Booking Team");
					stages.splice(index4, 1);
				} else if (oAVData.flow === "NA") {
					index4 = stages.indexOf("Library Team");
					stages.splice(index4, 1);
				}

				// Incture 01-23-2018: Requester Feedback Task is removed from Process
				// In UI no changes are made as there is no effect of this change on the UI code
				// In case if any request is in Pending Requester Feedback for AV then we will show the 
				// Feedback task in UI. In case the request is not in Pending Requester Feedback then 
				// Feedback task will not come in Road Map be it AV 
				if (oAVData.requestType === "AV") {
					if (status === "Pending Requester Feedback") {
						stages.splice(stages.indexOf("Resolved"), 0, "Requester Feedback");
					}
				}
			}
			// end of VPN skipping Info sec stage

			// INCTURE 1 Feb, 2018: Library Excessive Download (0026) Road map issue fix
			if (oSubCode === "0026" || oSubCode === "0016") {
				if (status === "Resolved") // If status is resolved
				{
					stages.splice(1, 0, "Resolved");
				} // The BRM Service does not send Resolved Status hence pushing it to the array
				else {
					step = step === "CRM" ? "IT Service Desk" : step;
				} // If status is not resolved replace CRM with IT Service Desk in step
			}
		} else {
			var isCompleted = $.inArray(status, ["Rejected", "Resolved", "Cancelled"]);
		}
		//Zakeer : Resolved status
		// var isCompleted = $.inArray(status, [ "Rejected", "Resolved", "Cancelled" ]);
		var i;
		for (i = 0; i < stages.length; i++) {
			if (stages[i] == null) {
				break;
			}
			if (stepFound) {
				processState = sap.suite.ui.commons.ProcessFlowNodeState.Planned;
				icon = "sap-icon://time-entry-request";
				if (isCompleted !== -1) {
					processState = null;
					break;
				}
			}
			if (stages[i].toUpperCase() == step.toUpperCase()) {
				if ((subService == "VPN Access for externals Process" && step == "Resolved") || (subService == 'Data Center Access Process' && step ==
						"Resolved")) {} else {
					if (isCompleted != 0) { // to remove red color
						processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
					}
					icon = "sap-icon://customer-history";
					stepFound = true;
				}
			}

			if (oSubCode === "0036" || oSubCode === "0207" || oSubCode === "1701" || oSubCode === "1702" || oSubCode === "1704" || 
				oSubCode === "1705" || oSubCode === "0204" || oSubCode === "0205" || oSubCode === "0503" || oSubCode === "0205" || 
				oSubCode === "0504" || oSubCode === "0501" || oSubCode === "1706" || oSubCode === "1707" || oSubCode === "0502" || 
				oSubCode === "0505" || oSubCode === "0104" || oSubCode === "0206" || oSubCode === "0105" || oSubCode === "0302" || 
				oSubCode === "1703" || oSubCode === "0402" || oSubCode === "0401" || oSubCode === "0303" || oSubCode === "0506" || 
				oSubCode === "1700" || oSubCode === "0304" || oSubCode === "1912" || oSubCode === "1708" || oSubCode === "1709" || 
				oSubCode === "0310" || oSubCode === "0306" || oSubCode === "0414" || oSubCode === "0415" || oSubCode === "0416" || 
				oSubCode === "0208" || oSubCode === "0103" || oSubCode === "9103" || oSubCode === "0202" || oSubCode === "9202" ||
				oSubCode === "0211" || oSubCode === "8211" || oSubCode === "9211" || oSubCode === "0203" || oSubCode === "0502" || oSubCode === "0101") {
				if (step === "Pending Requester") {
					if (isCompleted != 0) {
						processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
					}
					icon = "sap-icon://customer-history";
					stepFound = true;
				}
				if (oSubCode === "0206") { //|| oSubCode === "0302"
					// if (sap.ui.getCore().byId("userInfoForm").getModel().getData().d.Type === "STAFF") {
					// 	var index = stages.indexOf("HR/Graduate Affairs Approval");
					// 	stages.splice(index, 1);
					// 	if (status === "Resolved" || status === "Rejected" || status === "Cancelled") {
					// 		processState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
					// 	} else {
					// 		processState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
					// 	}
					// }
				}
			}
			// var x = new sap.m.Text({text:stages[i],wrapping:true});
			processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
				text: stages[i],
				position: i,
				state: [{
					state: processState,
					value: 100
				}],
				iconSrc: icon
			}));
		}
		if (isCompleted !== -1) {
			var text = status;
			//   var y = new sap.m.Text({text:text,wrapping:true});
			processFlow.addLane(new sap.suite.ui.commons.ProcessFlowLaneHeader({
				text: text,
				position: i,
				state: [{
					state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
					value: 100
				}],
				iconSrc: "sap-icon://employee-approvals"
			}));
		}
		processFlow.addStyleClass("heigher");
		return processFlow;
	},
	getStage: function (customData) {
		for (var i = 0; i < customData.length; i++) {
			if (customData[i].getKey() == "stage") {
				return customData[i].getValue("stage");
			}
		}
		return "No stage";
	},
	getSubServiceCode: function (customData) {
		for (var i = 0; i < customData.length; i++) {
			if (customData[i].getKey() == "subServiceCode") {
				return customData[i].getValue("subServiceCode");
			}
		}
		return "No code";
	},
	//url for av standbysupport Incture(Andrea)
	getBRMUrlforAvStandBySupport: function () {
		var host = window.location.hostname;

		if (host == "localhost") {
			// Darshna - Edited : Replaced http with https
			return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
		}
		if (host.indexOf("kaust.edu.sa") == -1) {
			host = host + ".kaust.edu.sa";
		}

		switch (host) {

		case 'sthcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://sthpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			} else { //port == "8005" ||port == "8006"
				return "https://sthpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			}
			break;
		case 'kstcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://kstpodq.kaust.edu.sa:50001/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			} else { //port == "8005" ||port == "8006"
				return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			}
			break;
		case 'sthgwpsrcs.kaust.edu.sa':
			return "https://sthpop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			break;
		case 'kstgwpsrcs.kaust.edu.sa':
			return "https://kstspop.kaust.edu.sa:50101/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
			break;
			// Darshna - Edited : Added a switch case for localhost
		case 'localhost':
			return "https://kstpodq.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/flowstages/getprocessstages";
		}
		return;
	},
	/** to Fetch Request Id from the URL */
	getRequestId: function () {
		var url = (window.location != window.parent.location) ? document.referrer : document.location.href;
		var requestId = url.split("requestId=");
		if (requestId.length > 1) {
			return requestId[1];
		} else {
			return "";
		}
	},
	setConferenceLayout: function (requestId) {
		var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
		//to add the field for AV StandBY Support Andrea(Incture)
		// var brmURL="https://sthcibpdqq1.kaust.edu.sa:50501/kaust.com~sbf~bpm~java~restservices/process/getBpmConstant"; 
		var brmURL = this.getBRMUrlforAvStandBySupport();
		$.ajax({
			url: brmURL,
			async: "false",
			dataType: "jsonp",
			contentType: "application/json",
			jsonpCallback: "AV_STAND_BY_SUPPORT_CHARGES",
			// Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
			success: function (response) {
				var sarValue = response.value;
				var text = "(Charges " + sarValue + " SAR/hour will be applied)";
				sap.ui.getCore().byId("charges").setText(text);
			},
			error: function () {

			}
		});
		var standBy = oModel.oData.isAvStandbyRequired;
		if (standBy === "X") {
			sap.ui.getCore().byId("AvStandby").setSelectedIndex(0);
			sap.ui.getCore().byId("charges").setVisible(true);
		} else {
			sap.ui.getCore().byId("AvStandby").setSelectedIndex(1);
			sap.ui.getCore().byId("charges").setVisible(false);
		}
		var form = sap.ui.getCore().byId("externForm");
		form.setModel(oModel);
		// create a Model for the table in the Tab Video and Web Conf
		var webConfModel = new sap.ui.model.json.JSONModel({
			"WebConf": []
		});
		sap.ui.getCore().byId("Detail").setModel(webConfModel, "webConfModel");
		var oTab = sap.ui.getCore().byId("videoWebTab");
		oTab.setModel(webConfModel);

		// create a Model for the table in the Tab Webex Conference
		var webExModel = new sap.ui.model.json.JSONModel({
			"webExPart": []
		});
		sap.ui.getCore().byId("Detail").setModel(webExModel, "webExModel");
		var oTabWebEx = sap.ui.getCore().byId("webExTab");
		oTabWebEx.setModel(webExModel);
		var location = oModel.oData.EventLocation;
		if (location == "Conference Room") {
			sap.ui.getCore().byId("roomInfoToolbar").setVisible(true);
			sap.ui.getCore().byId("roomInfoROmode").setVisible(true);
			sap.ui.getCore().byId("roomInfoROmode").setModel(oModel);
			if (oModel.oData.Foodservices == "Y") {
				sap.ui.getCore().byId("foodServ").setSelected(true);
			}
			if (oModel.oData.Recording == "Y") {
				sap.ui.getCore().byId("record").setSelected(true);
			}
			if (oModel.oData.Presentation == "Y") {
				sap.ui.getCore().byId("pressFac").setSelected(true);
			}
		}
		var start = oModel.oData.Ldate;
		// var msString = start.slice(6, 19);
		// var msInt = parseInt(msString);
		var startDate = this.convertDateBack(start);
		sap.ui.getCore().byId("inputDate").setText(startDate);
		if (oModel.oData.Adevent == "X") {
			sap.ui.getCore().byId("dayEvent").setSelected(true);
			sap.ui.getCore().byId("inputStartTime").setVisible(false);
			sap.ui.getCore().byId("timeLabel").setVisible(false);
			sap.ui.getCore().byId("endTimeLabel").setVisible(false);
			sap.ui.getCore().byId("inputEndTime").setVisible(false);
		}

		if (oModel.oData.Ishost == "") {
			sap.ui.getCore().byId("idHostLbl").setVisible(true);
			sap.ui.getCore().byId("hostName").setVisible(true);
			sap.ui.getCore().byId("hostName").setText(oModel.oData.HostUserName);
			this.getHostData(oModel.oData.Hostuserid);
		}
		if (oModel.oData.Wboard == "X") {
			sap.ui.getCore().byId("wBoard").setSelected(true);
		}
		if (oModel.oData.Flipchart == "X") {
			sap.ui.getCore().byId("chart").setSelected(true);
		}
		if (oModel.oData.Others != "") {
			sap.ui.getCore().byId("others").setSelected(true);
			sap.ui.getCore().byId("otherItems").setText(oModel.oData.Others);
			sap.ui.getCore().byId("otherItems").setVisible(true);
		}
		// Reccurence
		// this.getView().byId("recurr").setVisible(false);
		if (oModel.oData.Rdevent == "X") {
			sap.ui.getCore().byId("reccurBox").setVisible(true);
			sap.ui.getCore().byId("pattLbl").setVisible(true);
			sap.ui.getCore().byId("reccPattern").setVisible(true);
			sap.ui.getCore().byId("reccRangeLbl").setVisible(true);
			sap.ui.getCore().byId("canceledDatesLbl").setVisible(true);
			// sap.ui.getCore().byId("canceledDate").setVisible(true);

			var range = oModel.oData.Rstartdate;
			// var msString = range.slice(6, 19);
			// var msInt = parseInt(msString);
			var rangeStartDate = this.convertDateBack(range);
			var rangeEnd = oModel.oData.Renddate;
			// var msString = rangeEnd.slice(6, 19);
			// var msInt = parseInt(msString);
			//Roopali-INCTURE(22-11-2018) - set deleted dates
			if (oModel.getData().DeletedDastes.length > 0) {
				sap.ui.getCore().byId("canceledDate").setVisible(true).setText(oModel.getData().DeletedDastes.join());
			}
			var rangeEndDate = this.convertDateBack(rangeEnd);

			sap.ui.getCore().byId("reccRange").setVisible(true).setText(rangeStartDate + "-" + rangeEndDate);
			if (oModel.oData.Daily == "X") {
				sap.ui.getCore().byId("reccPattern").setText("Daily");
			}
			if (oModel.oData.Weekly == "X") {
				sap.ui.getCore().byId("reccPattern").setText("Weekly");
				sap.ui.getCore().byId("weeklyRecurLbl").setVisible(true);
				var reccurDays = "";
				this.days = [];
				if (oModel.oData.Sunday == "X") {
					reccurDays = reccurDays + "Sunday;";
					this.days.push(0);
				}
				if (oModel.oData.Monday == "X") {
					reccurDays = reccurDays + "Monday;";
					this.days.push(1);
				}
				if (oModel.oData.Tuesday == "X") {
					reccurDays = reccurDays + "Tuesday;";

					this.days.push(2);
				}
				if (oModel.oData.Wednesday == "X") {
					reccurDays = reccurDays + "Wednesday;";
					this.days.push(3);
				}
				if (oModel.oData.Thursday == "X") {
					reccurDays = reccurDays + "Thursday;";
					this.days.push(4);
				}
				if (oModel.oData.Friday == "X") {
					reccurDays = reccurDays + "Friday;";
					this.days.push(5);
				}
				if (oModel.oData.Saturday == "X") {
					reccurDays = reccurDays + "Saturday;";
					this.days.push(6);
				}
				sap.ui.getCore().byId("weeklyReccur").setVisible(true).setText(reccurDays);
			}
			if (oModel.oData.Monthly == "X") {
				sap.ui.getCore().byId("reccPattern").setText("Monthly");
			}
		}
		if (oModel.oData.comments != "") {
			sap.ui.getCore().byId("comment").setValue(oModel.oData.comments);
		}

		//Change the text from AV Support to AV Support only according to the selection Incture(Andrea)
		var avCheck = oModel.oData.Avsupport;
		var videoCheck = oModel.oData.Videowebconf;
		var webex = oModel.oData.Webex;
		var conf = oModel.oData.Confrecord;
		if (avCheck === "X") {
			if (videoCheck === "X" || webex === "X" || conf === "X") {
				//sap.ui.getCore().byId("avSupport").setText("AV Support");
				sap.ui.getCore().byId("avSupport").setSelected(false);
				sap.ui.getCore().byId("avFilter").setVisible(false);

			} else {
				sap.ui.getCore().byId("avSupport").setSelected(true);
				sap.ui.getCore().byId("avFilter").setVisible(true);
				//sap.ui.getCore().byId("avSupport").setText("AV Support only");
			}
		}
		// Av Support Tab
		if (oModel.oData.Avsupport == "X") {
			sap.ui.getCore().byId("avFilter").setVisible(true);
			sap.ui.getCore().byId("avSupport").setSelected(true);
			if (videoCheck === "X" || webex === "X" || conf === "X") {
				//sap.ui.getCore().byId("avSupport").setText("AV Support");
				sap.ui.getCore().byId("avSupport").setSelected(false);
				sap.ui.getCore().byId("avFilter").setVisible(false);

			}
			if (oModel.oData.Laptop == "X") {
				sap.ui.getCore().byId("laptop").setSelected(true);
				sap.ui.getCore().byId("laptop1").setSelected(true);
				sap.ui.getCore().byId("laptop2").setSelected(true);
				sap.ui.getCore().byId("laptop3").setSelected(true);
			}
			if (oModel.oData.Clicker == "X") {
				sap.ui.getCore().byId("clicker").setSelected(true);
				sap.ui.getCore().byId("clicker1").setSelected(true);
				sap.ui.getCore().byId("clicker2").setSelected(true);
				sap.ui.getCore().byId("clicker3").setSelected(true);
			}
			if (oModel.oData.Adapter == "X") {
				sap.ui.getCore().byId("adapter").setSelected(true);
				sap.ui.getCore().byId("adapter1").setSelected(true);
				sap.ui.getCore().byId("adapter2").setSelected(true);
				sap.ui.getCore().byId("adapter3").setSelected(true);
			}
			if (oModel.oData.Mphone == "X") {
				sap.ui.getCore().byId("mic").setSelected(true);
				sap.ui.getCore().byId("mic1").setSelected(true);
				sap.ui.getCore().byId("mic2").setSelected(true);
				sap.ui.getCore().byId("mic3").setSelected(true);
			}
			if (oModel.oData.Speakers == "X") {
				sap.ui.getCore().byId("speakers").setSelected(true);
				sap.ui.getCore().byId("speakers1").setSelected(true);
				sap.ui.getCore().byId("speakers2").setSelected(true);
				sap.ui.getCore().byId("speakers3").setSelected(true);
			}
			if (oModel.oData.Projector == "X") {
				sap.ui.getCore().byId("projector").setSelected(true);
				sap.ui.getCore().byId("projector1").setSelected(true);
				sap.ui.getCore().byId("projector2").setSelected(true);
				sap.ui.getCore().byId("projector3").setSelected(true);
			}
			if (oModel.oData.Monitor == "X") {
				sap.ui.getCore().byId("monitor").setSelected(true);
				sap.ui.getCore().byId("monitor1").setSelected(true);
				sap.ui.getCore().byId("monitor2").setSelected(true);
				sap.ui.getCore().byId("monitor3").setSelected(true);
			}
		}

		// Web And Video Conf Tab
		if (oModel.oData.Videowebconf == "X") {
			sap.ui.getCore().byId("webVideoFilter").setVisible(true);
			sap.ui.getCore().byId("webVideo").setSelected(true);
		}
		// Webex Tab
		if (oModel.oData.Webex == "X") {
			sap.ui.getCore().byId("webex").setSelected(true);
			sap.ui.getCore().byId("webexFilter").setVisible(true);
		}
		if (oModel.oData.Videowebconf == "X" || oModel.oData.Webex == "X") {
			this.getMultiFieldsConfRoomReadOnly(requestId);
		}
		// Conf. Recording Tab
		if (oModel.oData.Confrecord == "X") {
			var confForm = sap.ui.getCore().byId("confRecForm");
			confForm.setModel(oModel);
			sap.ui.getCore().byId("confRecFilter").setVisible(true);
			sap.ui.getCore().byId("confRec").setSelected(true);
			if (oModel.oData.Private == "X") {
				sap.ui.getCore().byId("grRec").setSelectedIndex(1);
			}
		}
		if (oModel.oData.serviceQualityDesc) {
			var oFeedTab = sap.ui.getCore().byId("feedbackTab");
			var oFeedRB = sap.ui.getCore().byId("idSrvQualRB");
			oFeedTab.setVisible(true);
			var iIndex = -1;
			if (oModel.oData.serviceQuality === "1") {
				iIndex = 0;
			} else if (oModel.oData.serviceQuality === "2") {
				iIndex = 1;
			} else if (oModel.oData.serviceQuality === "3") {
				iIndex = 2;
			} else if (oModel.oData.serviceQuality === "4") {
				iIndex = 3;
			}
			oFeedRB.setSelectedIndex(iIndex);
			sap.ui.getCore().byId("idFeedback").setValue(oModel.oData.feedbackComments);
		}
		var kaustId = oModel.oData.KaustId;
		this.getUserData(kaustId, requestId);
	},

	getHostData: function (userId) {
		var _that = this;
		var form = sap.ui.getCore().byId("HostInfoForm");
		form.setVisible(true);
		var dataModel = new sap.ui.model.json.JSONModel();
		//---------------
		var serviceUrl = _that.getBPMUrl("/kaust.com~sbf~bpm~java~restservices/requestDetails/RequestType?UserId=" + userId);
		//
		$.ajax({
			url: serviceUrl,
			async: false,
			dataType: "jsonp",
			contentType: "application/json",
			jsonpCallback: 'UserId',
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/atom+xml",
				"DataServiceVersion": "2.0",
				"X-CSRF-Token": "Fetch",
			},
			// Work with the response. JSONP is asynchronous service. That is the reason rerender is placed in the result.
			success: function (responseData) {
				//console.log( response );
				responseData.UserId = userId;
				dataModel.setData(responseData);
				form.setModel(dataModel);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert('Unexpected error happened');
			}
		});
	},

	/**Get Service URL*/
	getBPMUrl: function (url) {
		var host = window.location.hostname;
		if (host.indexOf("kaust.edu.sa") == -1) {
			host = host + ".kaust.edu.sa";
		}
		switch (host) {
		case 'sthcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://sthpodq.kaust.edu.sa:50001" + url;
			} else { //port == "8005" ||port == "8006"
				return "https://sthpodq.kaust.edu.sa:50501" + url;
			}
			break;
		case 'kstcigwdq1.kaust.edu.sa':
			var port = window.location.port;
			if (port == "8000" || port == "8001") { //QA port
				return "https://kstpodq.kaust.edu.sa:50001" + url;
			} else { //port == "8005" ||port == "8006"
				return "https://kstpodq.kaust.edu.sa:50501" + url;
			}
			break;
		case 'sthgwpsrcs.kaust.edu.sa':
			return "https://sthpop.kaust.edu.sa:50101" + url;
			break;
		case 'kstgwpsrcs.kaust.edu.sa':
			return "https://kstspop.kaust.edu.sa:50101" + url;
			break;
		}
		return;
	},
	getUserDataDC: function (kaustId, requestId) {
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + kaustId + "',UserId='')");
		var form = sap.ui.getCore().byId("userInfoForm");
		var form1 = sap.ui.getCore().byId("userInfoFormDC");
		if (!form) {
			return;
		}
		if (!form1) {
			return;
		}
		var dataModel = new sap.ui.model.json.JSONModel();
		$.ajax({
			url: sUrl,
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
				dataModel.setData(data);
			},
			error: function (data, textStatus, XMLHttpRequest) {
				alert("Error message");
			}
		});

		form1.setModel(dataModel);
		form.setModel(dataModel);

		if (requestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/")); // Darshna - this.getUrl added
			var filterstr = "Requestlog?$filter=RequestId eq '" + requestId + "'";

			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistory");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
			}, function (response) {
				return "";
			});
		}
	},
	getUserData: function (kaustId, requestId) {
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/UserDetail(KaustID='" + kaustId + "',UserId='')");
		var form = sap.ui.getCore().byId("userInfoForm");
		//    var form1 = sap.ui.getCore().byId("userInfoFormDC");
		if (!form) {
			return;
		}
		//    if(!form1) return;
		var dataModel = new sap.ui.model.json.JSONModel();
		$.ajax({
			url: sUrl,
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
				dataModel.setData(data);
			},
			error: function (data, textStatus, XMLHttpRequest) {
				alert("Error message");
			}
		});

		//    form1.setModel(dataModel);
		form.setModel(dataModel);

		if (requestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/")); // Darshna - this.getUrl added
			var filterstr = "Requestlog?$filter=RequestId eq '" + requestId + "'";

			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistory");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {

				//        Hide K-Safe J-Safe Statuses in Status Log from Requester --- Dikhunmekh --- Start

				/*data.results = data.results.filter(function(val){
				    return  val.Status != "056" &&
				          val.Status != "057" &&
				          val.Status != "058" &&
				          val.Status != "059";
				  });*/

				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');

				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);

				table.getBinding('items').filter(oCombineFilters);

				//      Hide K-Safe J-Safe Statuses in Status Log from Requester --- Dikhunmekh --- End

			}, function (response) {
				return "";
			});
		}
	},

	getMultiFieldsConfRoomReadOnly: function (requestId) {
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm?$filter=RequestId eq '" + requestId + "'");
		// var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'";
		var result = "";
		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: "GET",
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				result = oResponse;
			},
			error: function (jqXHR, textStatus, errorThrown) {
				if (textStatus === "timeout") {
					sap.m.MessageBox.show("Connection timed out", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						// styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
					// sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
				} else {
					sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," +
						jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							// styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
						.statusText);
					// sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
				};
			},
		});
		var persons = result.d.results;
		var oModel = sap.ui.getCore().byId("Detail").getModel("webConfModel");
		var oModelWebEx = sap.ui.getCore().byId("Detail").getModel("webExModel");
		for (var i in persons) {
			if (persons[i].Ipaddress != "") {
				oModel.oData.WebConf.push({
					protocol: persons[i].Protocol,
					ipAddress: persons[i].Ipaddress,
					techAssist: persons[i].Contact,
					emailConf: persons[i].Cemail
				});
			}
			if (persons[i].Externalmail != "") {
				oModelWebEx.oData.webExPart.push({
					exUserEmail: persons[i].Externalmail,
					country: persons[i].country
				});
			}
		}
		oModel.updateBindings();
		oModelWebEx.updateBindings();
	},

	getMultiFieldsTransferIT: function (requestId) {

		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Transferequipment?$filter=RequestId eq '" + requestId + "'");
		var result = "";

		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: "GET",
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				result = oResponse;
			},
			error: function (jqXHR, textStatus, errorThrown) {

				if (textStatus === "timeout") {

					sap.m.MessageBox.show("Connection timed out", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					});
				} else {

					sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," +
						jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
						});
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
						.statusText);
				};
			},

		});

		var items = "";
		var tagNumbers = "";
		var persons = result.d.results;

		for (var i in persons) {
			if (persons[i].Replenishitem != "") {
				items = items + persons[i].Replenishitem + "\n";
			}
			if (persons[i].Equipnum != "") {
				tagNumbers = tagNumbers + persons[i].Equipnum + "\n";
			}
		}
		sap.ui.getCore().byId("inputItem").setText(items);
		sap.ui.getCore().byId("equipNo").setText(tagNumbers);
	},

	//get Multiple Values for Delegates field
	getMultiFieldsGenEmailReadOnly: function (requestId) {

		//        var url = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email?$filter=RequestId eq '"+requestId+"'";
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Email?$filter=RequestId eq '" + requestId + "'");
		var result = "";

		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: "GET",
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				result = oResponse;
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

		var members = "";
		var persons = result.d.results;

		for (var i in persons) {
			if (persons[i].Delegates != "") {
				members = members + persons[i].Delegates + ";";
			}
		}
		sap.ui.getCore().byId("delegate").setText(members);
	},

	getMultiFieldsEmailDistrReadOnly: function (requestId) {

		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '" + requestId + "'");
		//      var url =  "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Gemail?$filter=RequestId eq '"+requestId+"'";
		var result = "";

		$.ajax({
			url: url,
			dataType: 'json',
			async: false,
			type: "GET",
			cache: false,
			success: function (oResponse, textStatus, jqXHR) {
				result = oResponse;
			},
			error: function (jqXHR, textStatus, errorThrown) {

				if (textStatus === "timeout") {

					sap.m.MessageBox.show(
						"Connection timed out", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							//                                      styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
					// sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");

				} else {

					sap.m.MessageBox.show(
						"The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							//                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
					jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR
						.statusText);
					//                                 sap.ui.commons.MessageBox.alert("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status +"," + jqXHR.statusText, null, "Error");
				};
			},

		});

		var members = "";
		var senders = "";
		var persons = result.d.results;

		for (var i in persons) {
			if (persons[i].Grpmember != "") {
				members = members + persons[i].Grpmember + ";";
			}
			if (persons[i].Authsender != "") {
				senders = senders + persons[i].Authsender + ";";
			}
		}
		if (senders == "") {
			sap.ui.getCore().byId("authSenders").setText("No restriction");
		} else {
			sap.ui.getCore().byId("authSenders").setText(senders);
		}
		sap.ui.getCore().byId("grpMembers").setText(members);

	},

	convertDateBack: function (date) {
		var time = new Date(date);
		var yyyy = time.getFullYear();
		var mm = time.getMonth() + 1;
		var dd = time.getDate();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var result = mm + "/" + dd + "/" + yyyy;
		return result;
	},
	getUrl: function (sUrl) {
		if (sUrl == "") {
			return sUrl;
		}
		if (window.location.hostname == "localhost") {
			return "https://kstcigwdq1.kaust.edu.sa:8006" + sUrl;
		} else {
			return sUrl;
		}
	},
	cancelRq: function () {
		var helpModel = this.getView().getModel("helpModel");
		var helpItems = helpModel.getProperty("/helpItems");
		var serviceName = helpItems.serviceOpened;
		var oModel = "";
		var msg = "";
		switch (serviceName) {
		case 'Audio Visual Services':
			oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");

			//    INCTURE 01-18-2018: START---------------------------------------------------------------------------------------------
			var startDate;
			//    The start date does not consider the meeting start time, hence below is commented
			//    var startDate = new Date(oModel.oData.Ldate).getTime();
			//    For putting the check that past requests are not cancelled - considering meeting start time for this scenario
			if (oModel.oData.Ldate) {
				if (!oModel.oData.Starttime) { // For Scenarios in which Start Time is missing
					oModel.oData.Starttime = "00:00:00";
				}
				startDate = new Date(oModel.oData.Ldate.split("T")[0] + "T" + oModel.oData.Starttime).getTime();
			} else { // In case Meeting Date is missing - cancellation is not possible
				sap.m.MessageBox.show("Missing Event Information. Please contact your administrator.", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Warning",
					actions: [sap.m.MessageBox.Action.OK],
				});
				return;
			}
			var today = new Date().getTime();

			//      Removing the 24 Hour Cancellation Check  
			//      if ((today + 24 * 60 * 60 * 1000) > startDate) {
			//        sap.m.MessageBox.show("The request could not be cancelled less than 24h before the meeting date ", {
			//          icon : sap.m.MessageBox.Icon.WARNING,
			//          title : "Warning",
			//          actions : [ sap.m.MessageBox.Action.OK ],
			//        });
			//        return;
			//      }

			//    Adding the check for meeting cancellation - after the meeting has started
			if (today >= startDate) {
				sap.m.MessageBox.show("The request could not be cancelled post meeting start time", {
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Warning",
					actions: [sap.m.MessageBox.Action.OK],
				});
				return;
			}
			//    INCTURE 01-18-2018: END-----------------------------------------------------------------------------------

			msg =
				"By cancelling room booking, you are also cancelling all assosiated Audio and Visual services. Are you sure you want to cancel your room booking?";
			break;
		case 'Loan Equipment':
			oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
			msg = "Are you sure you want to cancel your Loan Equipment request?";
			break;
		}

		//    INCTURE 01-18-2018: START----------------------------------------------------------------------
		//    Request Can be cancelled if status is 013 for AV
		var bValue = true; // Boolean variable to handle Loan Equipment and AV Status check
		if (serviceName === "Loan Equipment") { // No change in status for Loan Equipment
			bValue = (oModel.oData.Status == "013" || oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status ==
				"016" || oModel.oData.Status == "018");
		} else if (serviceName === "Audio Visual Services") { // Status 013 (Resolved) is removed for AV
			bValue = (oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status == "016" || oModel.oData.Status ==
				"018");
		}
		// The below if condition is replaced based on the Service Name
		//  if (oModel.oData.Status == "013" || oModel.oData.Status == "015" || oModel.oData.Status == "011" || oModel.oData.Status == "016" || oModel.oData.Status == "018") {
		if (bValue) {
			//  INCTURE 01-18-2018: END-------------------------------------------------------------------------
			sap.m.MessageBox.show("The request is already Resolved, no cancellation more possible", {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: "Warning",
				actions: [sap.m.MessageBox.Action.OK],
			});
		} else {
			sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				function (oAction) {
					if (sap.m.MessageBox.Action.OK === oAction) {
						var oModel = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
						var oAVData = oModel.getProperty("/");
						var token = sap.ui.getCore().byId("app").getController().getGateWayToken();
						var url = helpModel.getProperty("/url");
						var requestId = helpItems.requestId;
						//          INCTURE 01-30-2018: Cancellation of AV Request via Common OData Service
						//          if((serviceName === "Audio Visual Services") && (url.indexOf("Vsm")!=-1)) {
						//            url="/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/Vsm(RequestId='" + requestId + "',KaustId='',ConfRoom='')";
						//          }
						var serviceCode = helpItems.serviceCode;
						var subServiceCode = helpItems.subServiceCode;
						var data = new Object();
						data["Status"] = "015";
						data["RequestId"] = requestId;
						data["ServiceCode"] = serviceCode;
						data["SubServiceCode"] = subServiceCode;
						data["Wftrigger"] = "X";
						data["Servicecall"] = "X";

						//          INCTURE 01-30-2018: Cancellation of AV Request via Common OData Service
						//          In case of AV the cancellation used the OData Service as mentioned in above if block for AV URL
						//          Changing this service to a common cancellation OData Service which requires request ID, Service call and status
						//          No changes have been made for the Loan Equipment hence for Loan Equipment there is a else block.
						if (serviceName === "Audio Visual Services") {
							var oPayload = new Object();
							//  var sUrl = "CancelRequestSet(RequestId='" + requestId + "')";
							var sUrl = "CancelRequestSet(RequestId='" + requestId + "',Option='F',List='0')";
							var oKITSModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");

							oPayload["RequestId"] = requestId;
							oPayload["Status"] = "015";
							oPayload["ServiceCall"] = "X";
							oPayload["ServiceCall"] = "X";
							oPayload["Stage"] = oAVData.Stage;

							oKITSModel.update(sUrl, oPayload, {
								success: function (oData, oResponse) {
									sap.m.MessageBox.show("Your Request '" + requestId + "' has been cancelled.", {
										icon: sap.m.MessageBox.Icon.SUCCESS,
										title: "Success",
										actions: [sap.m.MessageBox.Action.OK],
									});
									sap.ui.getCore().byId("cancelRq").setEnabled(false);
								},
								error: function (oError) {
									sap.m.MessageBox.show("Failed to cancel the request. Please try again later", {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error",
										actions: [sap.m.MessageBox.Action.OK],
									});
								}
							});

							/*data["Adapter"] = oAVData.Adapter;
							data["Adevent"] = oAVData.Adevent;
							data["Agree"] = oAVData.Agree;
							data["Attendees"] = oAVData.Attendees;
							data["Avsupport"] = oAVData.Avsupport;
							data["Bldglevel"] = oAVData.Bldglevel;
							data["Bldgname"] = oAVData.Bldgname;
							data["Cemail"] = oAVData.Cemail;
							data["Clicker"] = oAVData.Clicker;
							data["ConfRoom"] = oAVData.ConfRoom;
							data["Confrecord"] = oAVData.Confrecord;
							data["Contact"] = oAVData.Contact;
							data["Costcenter"] = oAVData.Costcenter;
							data["Daily"] = oAVData.Daily;
							data["Department"] = oAVData.Department;
							data["Deptname"] = oAVData.Deptname;
							data["Email"] = oAVData.Email;
							data["Endtime"] = oAVData.Endtime;
							data["EventLocation"] = oAVData.EventLocation;
							data["Eventname"] = oAVData.Eventname;
							data["Externalmail"] = oAVData.Externalmail;
							data["FirstName"] = oAVData.FirstName;
							data["Flipchart"] = oAVData.Flipchart;
							data["Foodservices"] = oAVData.Foodservices;
							data["Friday"] = oAVData.Friday;
							data["HostUserName"] = oAVData.HostUserName;
							data["Hostuserid"] = oAVData.Hostuserid;
							data["Ipaddress"] = oAVData.Ipaddress;
							data["Ishost"] = oAVData.Ishost;
							data["Itmsequence"] = oAVData.Itmsequence;
							data["KaustId"] = oAVData.KaustId;
							data["Laptop"] = oAVData.Laptop;
							data["LastName"] = oAVData.LastName;
							data["Layout"] = oAVData.Layout;
							data["Ldate"] = oAVData.Ldate;
							data["Mcomments"] = oAVData.Mcomments;
							data["MiddleName"] = oAVData.MiddleName;
							data["Mobile"] = oAVData.Mobile;
							data["Monday"] = oAVData.Monday;
							data["Monitor"] = oAVData.Monitor;
							data["Monthly"] = oAVData.Monthly;
							data["Mphone"] = oAVData.Mphone;
							data["Office"] = oAVData.Office;
							data["Onbehalf"] = oAVData.Onbehalf;
							data["Others"] = oAVData.Others;
							data["Positiontext"] = oAVData.Positiontext;
							data["Presentation"] = oAVData.Presentation;
							data["Presenter"] = oAVData.Presenter;
							data["Private"] = oAVData.Private;
							data["ProcessId"] = oAVData.ProcessId;
							data["Projector"] = oAVData.Projector;
							data["Protocol"] = oAVData.Protocol;
							data["Public"] = oAVData.Public;
							data["RManager"] = oAVData.RManager;
							data["Rdevent"] = oAVData.Rdevent;
							data["Recording"] = oAVData.Recording;
							data["Renddate"] = oAVData.Renddate;
							data["Rstartdate"] = oAVData.Rstartdate;
							data["Saturday"] = oAVData.Saturday;
							data["Speakers"] = oAVData.Speakers;
							data["Stage"] = oAVData.Stage;
							data["Starttime"] = oAVData.Starttime;
							data["Sunday"] = oAVData.Sunday;
							data["Thursday"] = oAVData.Thursday;
							data["Title"] = oAVData.Title;
							data["Tuesday"] = oAVData.Tuesday;
							data["UserId"] = oAVData.UserId;
							data["Videowebconf"] = oAVData.Videowebconf;
							data["Wboard"] = oAVData.Wboard;
							data["Webex"] = oAVData.Webex;
							data["Wednesday"] = oAVData.Wednesday;
							data["Weekly"] = oAVData.Weekly;
							data["activityType"] = oAVData.activityType;
							data["country"] = oAVData.country;
							data["flow"] = oAVData.flow;
							data["requestType"] = oAVData.requestType;
							data["roomno"] = oAVData.roomno;
							data["lastTaskStatus"] = oAVData.lastTaskStatus;
							data["onBehalfUserId"] = oAVData.onBehalfUserId;
							data["buildingCode"] = oAVData.buildingCode;*/

						} else {
							var jsonData = JSON.stringify(data);
							$.ajax({
								url: url,
								dataType: 'json',
								contentType: "application/json",
								async: false,
								data: jsonData,
								type: "PUT",
								beforeSend: function (xhr) {
									xhr.setRequestHeader("X-CSRF-Token", token);
								},
								success: function (oResponse, textStatus, jqXHR) {
									sap.m.MessageBox.show("Your Request '" + requestId + "' has been cancelled.", {
										icon: sap.m.MessageBox.Icon.SUCCESS,
										title: "Success",
										actions: [sap.m.MessageBox.Action.OK],
									});
									sap.ui.getCore().byId("cancelRq").setEnabled(false);

								},
								error: function (jqXHR, textStatus, errorThrown) {

									if (textStatus === "timeout") {
										sap.m.MessageBox.show("Connection timed out", {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "Error",
											actions: [sap.m.MessageBox.Action.OK],
											// styleClass: bCompact ? "sapUiSizeCompact" : ""
										});
										// sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
									} else {
										sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," +
											jqXHR.statusText, {
												icon: sap.m.MessageBox.Icon.ERROR,
												title: "Error",
												actions: [sap.m.MessageBox.Action.OK],
												// styleClass: bCompact ? "sapUiSizeCompact" : ""
											});
										jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," +
											jqXHR.statusText);
									};
								},
								complete: function () {}
							});
						}
					}
				});
		}
	},

	submitRq: function () {
		var helpModel = this.getView().getModel("helpModel");
		var helpItems = helpModel.getProperty("/helpItems");
		var serviceName = helpItems.serviceOpened;
		var oModel = "";
		var msg = "Are you sure you want to submit request";
		var that = this;
		sap.m.MessageBox.show(msg, sap.m.MessageBox.Icon.QUESTION, "Confirmation", [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
			function (oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					var token = sap.ui.getCore().byId("app").getController().getGateWayToken();
					var url = helpModel.getProperty("/url");
					var requestId = helpItems.requestId;
					var serviceCode = helpItems.serviceCode;
					var subServiceCode = helpItems.subServiceCode;
					/*var data = new Object();
					data["Status"] = "005";
					data["RequestId"] = requestId;
					data["ServiceCode"] = serviceCode;
					data["SubServiceCode"] = subServiceCode;
					var comment = sap.ui.getCore().byId("commentText");
					data["Comments"] = comment.getValue();*/
					//data["Wftrigger"] = "X";
					//data["Servicecall"] = "X";
					//var jsonData = JSON.stringify(data);

					var oModelGasc = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/")); // Darshna - this.getUrl added
					oEntryData = {};
					oEntry = [];
					reqData = sap.ui.getCore().byId("Detail").getModel("IqamaDetailsModel").getData()[0];
					oEntryData = that.assignData(reqData);
					oEntryData.ReqComment = sap.ui.getCore().byId("commentText").getValue();

					if (oEntryData.SubServiceCode == '0202' && oEntryData.Status == '006') {
						var requestId = oEntryData.RequestId;
						var utext = "UserDependents(UserId='" + oEntryData.UserId + "',RequestId='" + oEntryData.RequestId + "',KaustId='" + oEntryData.KaustId +
							"')";
						oModelGasc.update(utext, oEntryData, null, function (response) {
							sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: [sap.m.MessageBox.Action.OK],
							});
							sap.ui.getCore().byId("submitRq").setEnabled(false);
							sap.ui.getCore().byId("commentText").setEditable(false);

						}, function (error) {
							var errorMsg = jQuery(error.response.body).find('message').text().replace("RFC Error:", "");
							if (errorMsg) {
								sap.m.MessageBox.alert(errorMsg, {
									title: "Error",
									icon: sap.m.MessageBox.Icon.ERROR
								});
							} else {
								alert(error.response.body);
							}
							return;
						});
					} else {
						oEntry.push(oModelGasc.createBatchOperation("UserDependents", "POST", oEntryData));

						var requestId = oEntryData.RequestId;
						oModelGasc.addBatchChangeOperations(oEntry);
						oModelGasc.setUseBatch(true);
						oModelGasc.submitBatch(function (data, response) {
							sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: "Success",
								actions: [sap.m.MessageBox.Action.OK],
							});
							sap.ui.getCore().byId("submitRq").setEnabled(false);
							sap.ui.getCore().byId("commentText").setEditable(false);
						}, function (oError) {
							sap.m.MessageBox.show("The following problem occurred: " + oError.responseText, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								actions: [sap.m.MessageBox.Action.OK],
								// styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
						});
					}

					//          $.ajax({
					//            url : url,
					//            dataType : 'json',
					//            contentType : "application/json",
					//            async : false,
					//            data : jsonData,
					//            type : "PUT",
					//            beforeSend : function(xhr) {
					//              xhr.setRequestHeader("X-CSRF-Token", token);
					//            },
					//            success : function(oResponse, textStatus, jqXHR) {
					//              sap.m.MessageBox.show("Your Request '" + requestId + "' has been submitted.", {
					//                icon : sap.m.MessageBox.Icon.SUCCESS,
					//                title : "Success",
					//                actions : [ sap.m.MessageBox.Action.OK ],
					//              });
					//              sap.ui.getCore().byId("submitRq").setEnabled(false);
					//
					//            },
					//            error : function(jqXHR, textStatus, errorThrown) {
					//
					//              if (textStatus === "timeout") {
					//                sap.m.MessageBox.show("Connection timed out", {
					//                  icon : sap.m.MessageBox.Icon.ERROR,
					//                  title : "Error",
					//                  actions : [ sap.m.MessageBox.Action.OK ],
					//                // styleClass: bCompact ? "sapUiSizeCompact" : ""
					//                });
					//                // sap.ui.commons.MessageBox.alert("Connection timed out: too much data to retrieve. Please select a shorter period of time.", null, "Error");
					//              } else {
					//                sap.m.MessageBox.show("The following problem occurred: " + textStatus, jqXHR.responseText.data + "," + jqXHR.status + "," + jqXHR.statusText, {
					//                  icon : sap.m.MessageBox.Icon.ERROR,
					//                  title : "Error",
					//                  actions : [ sap.m.MessageBox.Action.OK ],
					//                // styleClass: bCompact ? "sapUiSizeCompact" : ""
					//                });
					//                jQuery.sap.log.fatal("The following problem occurred: " + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);
					//              }
					//              ;
					//            },
					//            complete : function() {
					//            }
					//          });
				}
			});
	},

	assignData: function (reqdata) {
		var requestorDetails = reqdata;

		oEntryData = {};
		oEntryData.KaustId = reqdata.KaustId;
		oEntryData.UserId = requestorDetails.UserId;
		oEntryData.RequestId = reqdata.RequestId;
		oEntryData.Categorytype = reqdata.Categorytype;
		oEntryData.RequestorKaustID = reqdata.KaustID;
		oEntryData.Cendda = this.setdateToJson(this.getDateFromJson(reqdata.Cendda));
		oEntryData.SubServiceCode = reqdata.SubServiceCode;
		oEntryData.ServiceCode = reqdata.ServiceCode;
		oEntryData.Status = "006";
		oEntryData.ProcessId = reqdata.ProcessId;
		oEntryData.Stage = reqdata.Stage;
		oEntryData.ExpDate = this.setdateToJson(this.getDateFromJson(reqdata.ExpDate));
		oEntryData.Comments = reqdata.Comments;
		oEntryData.GAComments = reqdata.GAComments;
		oEntryData.FinComments = reqdata.FinComments;

		oEntryData.Currency = reqdata.Currency;
		oEntryData.age = reqdata.age;
		oEntryData.ArabicFirstName = reqdata.ArabicFirstName;
		oEntryData.ArabicLastName = reqdata.ArabicLastName;
		oEntryData.ArabicMiddleName = reqdata.ArabicMiddleName;
		oEntryData.BorderNumber = reqdata.BorderNumber;

		oEntryData.IqamaNo = reqdata.IqamaNo;
		oEntryData.Fname = reqdata.Fname;
		oEntryData.Mname = reqdata.Mname;
		oEntryData.Lname = reqdata.Lname;
		oEntryData.SaudiNo = reqdata.SaudiNo;
		oEntryData.Iqmarenew = reqdata.Iqmarenew;
		oEntryData.IqamaEdate = reqdata.IqamaEdate; //"2014-08-38T00:00:00";//reqdata.IqamaEdate;
		oEntryData.Costcenter = reqdata.Costcenter;
		oEntryData.HIqamaEdate = reqdata.HIqamaEdate;
		oEntryData.PassEdate = this.setdateToJson(this.getDateFromJson(reqdata.PassEdate));
		oEntryData.SequenceNumber = "0000000001";

		oEntryData.TimeStamp = this.setdateToJson(this.getDateFromJson(reqdata.TimeStamp));
		oEntryData.Expeditor = reqdata.Expeditor;
		oEntryData.Nationality = reqdata.Nationality;
		oEntryData.Passport = reqdata.Passport;
		oEntryData.Gender = reqdata.Gender;
		oEntryData.Relationship = reqdata.Relationship;
		oEntryData.Dob = this.setdateToJson(this.getDateFromJson(reqdata.Dob));

		oEntryData.FileName = reqdata.FileName;
		oEntryData.Url = reqdata.Url;
		oEntryData.Onbehalf = reqdata.Onbehalf; //submitted by Requestor
		oEntryData.MsgTyp1 = reqdata.MsgTyp1;
		oEntryData.Msg1 = reqdata.Msg1;
		oEntryData.MsgTyp2 = reqdata.MsgTyp2;
		oEntryData.Msg2 = reqdata.Msg2;
		oEntryData.MsgTyp3 = reqdata.MsgTyp3;
		oEntryData.Msg3 = reqdata.Msg3;
		oEntryData.MsgTyp4 = reqdata.MsgTyp4;
		oEntryData.Msg4 = reqdata.Msg4;
		oEntryData.MsgTyp5 = reqdata.MsgTyp5;
		oEntryData.Msg5 = reqdata.Msg5;

		oEntryData.DependantOnly = reqdata.DependantOnly;
		return oEntryData;

	},
	getDateFromJson: function (jsonDate) {
		if (jsonDate == null || jsonDate.trim() == "" || jsonDate == "0000-00-00") {
			return null;
		}
		if (jsonDate.match(/\/Date\((.*?)\)\//gi)) {
			return new Date(parseInt(jsonDate.substr(6)));
		}

		return jsonDate;
	},

	setdateToJson: function (dateValue) {
		if (dateValue == null || dateValue == "") {
			return null;
		}
		if (dateValue instanceof Date) {
			dateValue = dateValue.toJSON();
		}

		if (dateValue.indexOf('.') != -1) {
			dateValue = dateValue.split('.')[0];
		}

		return dateValue;
	},

	getGateWayToken: function () {
		var metadataEmail = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AccessRequest(RequestId='',KaustId='')");
		var token = null;
		$.ajax({
			url: metadataEmail,
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
				dataModel = data;
				token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
			},
			error: function (data, textStatus, XMLHttpRequest) {
				alert("Error message");
			}

		});
		return token;
	},
	back: function (pageId) {
		this.getView().app.backToPage(pageId);
	},

	/**
	 * Darshna - Editing Starts
	 * 
	 * Methods related to my preference tab 
	 */
	loadPreferenceData: function (KaustId, SubServiceCode) {
		this.k
		var oPreferenceModel = this.getView().getModel("oPreferenceModel");
		var preferenceModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(preferenceModel, "preferenceModel");
		var that = this;
		oPreferenceModel.read("/MyPreferencesCollection(KaustID='" + KaustId + "',SubServiceCode='" + SubServiceCode + "')", {
			success: function (oData) {
				that.getView().getModel("preferenceModel").setData(oData);
				if (oData && oData.KaustID != "" && oData.SubServiceCode != "") {}
			},
			error: function (oError) {

			}
		});
	},
	/** Darshna - Editing ends*/
	/**Pavithra -Data center*/
	getDataCenterDetails: function (requestId, detailsFragment) {
		var oDataModel = new sap.ui.model.json.JSONModel();
		var url = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/DataCenterSet?$filter=RequestId eq '" + requestId +
			"'&$expand=DCToTemplate&$format=json");
		oDataModel.loadData(url, null, false);
		var data = oDataModel.getData().d.results[0];
		this.getView().setModel(oDataModel, "dataCenter");
		this.setDataCenterDetails(data, detailsFragment);
	},

	setDataCenterDetails: function (data) {
		var reqData = {};
		var justificationModel = new sap.ui.model.json.JSONModel();
		justificationModel.loadData("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/userJustRequestStatusSet?$filter=userId eq '" + data.userId + "'",
			null, false);
		if (justificationModel.getData().d.results.length > 0) {
			if (justificationModel.getData().d.results[0].approverStatus == 1 || data.stage == "Requester") { //pending for approval need to show the justification UI
				reqData.justfVisibility = true;
				reqData.otherVisibility = false;
				reqData.justification = data.justification;
			} else if (justificationModel.getData().d.results[0].approverStatus == 2) {
				// Approved need to show the Data center UI
				reqData.justfVisibility = false;
				reqData.otherVisibility = true;
			}
		} else {
			reqData.justfVisibility = true;
			reqData.otherVisibility = false;
			reqData.justification = data.justification;
		}
		reqData.enableField = false;
		if (reqData.otherVisibility) {
			if (data.DCToTemplate.results.length > 0) {
				for (var i = 0; i < data.DCToTemplate.results.length; i++) {
					if (data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Data Center team".toUpperCase()) {
						reqData.itDataCenter = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase() == "IT-Exchange Building".toUpperCase()) {
						reqData.itExchangeBuild = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i]
						.templateType.toUpperCase() == "Building-14 templates".toUpperCase()) {
						reqData.itBuldingHigh = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType
						.toUpperCase() == "Building-14 templates".toUpperCase()) {
						reqData.itBuldingLow = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[
							i].templateType.toUpperCase() == "Building-14 templates".toUpperCase()) {
						reqData.itBuldingMedium = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT Test Room".toUpperCase())) {
						reqData.itBuildingTest = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-IN-Camps Maintenance".toUpperCase())) {
						reqData.itInCmps = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-OUT-Camps Maintenance".toUpperCase())) {
						reqData.itOutCmps = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-High Density".toUpperCase()) && data.DCToTemplate.results[i]
						.templateType.toUpperCase() == "Building 1 templates".toUpperCase()) {
						reqData.itBuildingTempHighDesity = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Low Density".toUpperCase()) && data.DCToTemplate.results[i].templateType
						.toUpperCase() == "Building 1 templates".toUpperCase()) {
						reqData.itBuildingTempLowDensity = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Medium Density".toUpperCase()) && data.DCToTemplate.results[
							i].templateType.toUpperCase() == "Building 1 templates".toUpperCase()) {
						reqData.itBuildingTempMedium = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Stock Room".toUpperCase())) {
						reqData.itBuildingTempItStock = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-1".toUpperCase())) {
						reqData.itBuildingTempItMeter = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-MTER-2".toUpperCase())) {
						reqData.itBuidingTempItMeter2 = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Security Room".toUpperCase())) {
						reqData.itSecurityRoom = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Front and Back Stairs-BDC".toUpperCase())) {
						reqData.otherTempItFront = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-BDC".toUpperCase())) {
						reqData.otherTempItSpain = true;
					}
					if (data.DCToTemplate.results[i].templateField.toUpperCase().match("IT-Spine Access-SCC".toUpperCase())) {
						reqData.otherTempItSpainscc = true;
					}
				}
				if (data.attachment) {
					reqData.fileLink = data.attachment;
				}
				reqData.reqDate = new Date(parseInt(data.requestDate.split("(")[1].split(")")[0])).toISOString().split("T")[0];
				if (data.accessType == "X") {
					sap.ui.getCore().byId("dataCenter_escorted").setSelected(true);
				} else {
					sap.ui.getCore().byId("dataCenter_unEscorted").setSelected(true);
				}
				var userData = {
					d: {
						results: [{
							FirstName: data.FirstName,
							LastName: data.LastName,
							KaustID: data.kaustId,
							Email: data.Email,
							Position: data.Position,
							Deptname: data.Deptname,
							Office: data.Office,
							Mobile: data.Mobile,

						}]
					}
				};
				var oUserModel = new sap.ui.model.json.JSONModel();
				oUserModel.setData(userData);
				//    this.getView().byId('userInfoTab').setModel(oUserModel);
				////    userData.=data.FirstName;
				//    this.getView().byId("Aggreement1").setVisible(false);
				//    this.getView().byId("AggreeCheck").setVisible(false);
				//    this.getView().byId("AggreeLink").setVisible(false);
				var requestModel = new sap.ui.model.json.JSONModel();
				var url = "/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/FileRead?$filter=UNIQUE_ID eq '" + data.RequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
				var oFileModel = new sap.ui.model.json.JSONModel();
				oFileModel.loadData(url, null, false);
				if (oFileModel.getData().d.results[0].URL != "") {
					sap.ui.getCore().byId('fileUrl').setHref(oFileModel.getData().d.results[0].URL);
				}

				requestModel.setData(reqData);
				this.getView().setModel(requestModel, "dataRequestData");

			} else {
				var requestModel = new sap.ui.model.json.JSONModel();
				requestModel.setData({});
				this.getView().setModel(requestModel, "dataRequestData");
			}
		} else {
			var requestModel = new sap.ui.model.json.JSONModel();
			requestModel.setData(reqData);
			this.getView().setModel(requestModel, "dataRequestData");
		}
	},
	/** Pavithra - Editing Done*/

	/** Edited for GASC Modules - Darshna*/
	/** GASC Processes*/
	getNewsPaperDetails: function (sRequestId, oSubCode) {
		var that = this;
		var specificUrl;
		sap.ui.getCore().byId("CarLicenseIssue").setVisible(false);
		sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(false);
		sap.ui.getCore().byId("DivingLicenseRenew").setVisible(false);
		sap.ui.getCore().byId("Sponsortransfer").setVisible(false);
		sap.ui.getCore().byId("policeClearance").setVisible(false);
		sap.ui.getCore().byId("PetsImportExport").setVisible(false);
		sap.ui.getCore().byId("zakatLetter").setVisible(false);
		sap.ui.getCore().byId("idBirthCertificateDetails").setVisible(false);
		sap.ui.getCore().byId("idMandanSalehForm").setVisible(false);
		sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(false);
		// sap.ui.getCore().byId("idInfoCorrect").setVisible(false);
		sap.ui.getCore().byId("idCarPlateChange").setVisible(false);
		var oNewsPaperModel = new sap.ui.model.json.JSONModel();
		var oGAComments = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().byId("Detail").setModel(oNewsPaperModel, "oNewsPaperModel");
		if ((oSubCode === "0036") || (oSubCode === "0207") || (oSubCode === "1701") || (oSubCode === "1702") || (oSubCode === "0101") || (oSubCode === "1704") || (
				oSubCode === "1705") || (oSubCode === "0204") || (oSubCode === "0205") || (oSubCode === "0503") || (oSubCode === "1912") || (
				oSubCode === "1708") || (oSubCode === "1709") || (oSubCode === "0102")) {
			specificUrl = "HeaderToGUD";
		}
		//    Dikhu edit starts
		else if (oSubCode === "0504" || oSubCode === "0503" || oSubCode === "0501" || oSubCode === "1706" || oSubCode === "1707" || oSubCode ===
			"0502" || oSubCode ===
			"0505") {
			specificUrl = "HeaderToDL";
		}
		//    Dikhu edit ends
		// navin editing starts
		else if (oSubCode === "0104") {
			specificUrl = "HeaderToFPC";
		} else if (oSubCode === "1700") {
			specificUrl = "HeaderToPet";
		} else if (oSubCode === "0206") {
			specificUrl = "HeaderToDHS";
		} else if (oSubCode === "0105") {
			specificUrl = "HeaderToTAX";
		}
		// navin editing ends
		else if (oSubCode === "0302" || oSubCode === "0303") {
			//	specificUrl = "HeaderToBC";
		} else if (oSubCode === "1703") {
			specificUrl = "HeaderToMadaEn";
		} else if (oSubCode === "0507" || oSubCode === "0506") {
			specificUrl = "HeaderToOwnChg";
		} else if (oSubCode === "0402") {
			specificUrl = "HeaderToIc";
		} else if (oSubCode === "0304") {
			specificUrl = "HeaderToFamilyCard";
		}
		var sUrl = "GASC_HeaderSet?$filter=Request_ID eq '" + sRequestId + "'&$expand=" + specificUrl + ",HeaderToComm";
		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if ((oSubCode === "0036") || (oSubCode === "0207") || (oSubCode === "1701") || (oSubCode === "1702") || (oSubCode === "1704") || (
						oSubCode === "1705") || (oSubCode === "0503") || (oSubCode === "0204") || (oSubCode === "0205") ||  (oSubCode === "0101") || (oSubCode === "0102")) {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToGUD.results);
					sap.ui.getCore().byId("idTable").setMode("None");
					//        Dikhu edit starts
				} else if (oSubCode === "0303") {
					// oNewsPaperModel.setProperty("/", oData.results[0].HeaderToBC.results);
					// sap.ui.getCore().byId("idTable").setMode("None");
				} else if (oSubCode === "0504") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("CarLicenseIssue").setVisible(true);
					sap.ui.getCore().byId("CarLicenseIssue").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("CarLicenseIssue").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0501") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("MotorcycleLicenseIssue").setVisible(true);
					sap.ui.getCore().byId("MotorcycleLicenseIssue").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("MotorcycleLicenseIssue").setBindingContext(firstItem.getBindingContext());
				} else if ((oSubCode === "1707") || (oSubCode === "0502") || (oSubCode === "0505")) {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("None");
				} else if (oSubCode === "1706") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDL.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("DivingLicenseRenew").setVisible(true);
					sap.ui.getCore().byId("DivingLicenseRenew").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("DivingLicenseRenew").setBindingContext(firstItem.getBindingContext());
				}
				//          Dikhu edit ends
				else if (oSubCode === "0206") {
					// oNewsPaperModel.setProperty("/", oData.results[0].HeaderToDHS.results);
					// sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					// sap.ui.getCore().byId("Sponsortransfer").setVisible(true);
					// sap.ui.getCore().byId("Sponsortransfer").setModel(oNewsPaperModel);
					// sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					// var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					// sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					// sap.ui.getCore().byId("Sponsortransfer").setBindingContext(firstItem.getBindingContext());

				} else if (oSubCode === "0104") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToFPC.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("policeClearance").setVisible(true);
					sap.ui.getCore().byId("policeClearance").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("None");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("policeClearance").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0105") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToTAX.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("zakatLetter").setVisible(true);
					sap.ui.getCore().byId("zakatLetter").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("zakatLetter").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0302") {
					// oNewsPaperModel.setProperty("/", oData.results[0].HeaderToBC.results);
					// sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					// sap.ui.getCore().byId("idBirthCertificateDetails").setVisible(true);
					// sap.ui.getCore().byId("idBirthCertificateDetails").setModel(oNewsPaperModel);
					// sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					// var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					// sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					// sap.ui.getCore().byId("idBirthCertificateDetails").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "1703") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToMadaEn.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("None");
					sap.ui.getCore().byId("idMandanSalehForm").setVisible(true);
					sap.ui.getCore().byId("idMandanSalehForm").setModel(oNewsPaperModel);
				} else if (oSubCode === "0507") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToOwnChg.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idCarOwnershipTransfer").setVisible(true);
					sap.ui.getCore().byId("idCarOwnershipTransfer").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("idCarOwnershipTransfer").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0402") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToIc.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					//   sap.ui.getCore().byId("idInfoCorrect").setVisible(true);
					//   sap.ui.getCore().byId("idInfoCorrect").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					//    sap.ui.getCore().byId("idInfoCorrect").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0506") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToOwnChg.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idCarPlateChange").setVisible(true);
					sap.ui.getCore().byId("idCarPlateChange").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("idCarPlateChange").setBindingContext(firstItem.getBindingContext());
				} else if (oSubCode === "0304") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToFamilyCard.results);
					sap.ui.getCore().byId("idTable").setMode("None");
				} else if (oSubCode === "1700") {
					oNewsPaperModel.setProperty("/", oData.results[0].HeaderToPet.results);
					sap.ui.getCore().byId("idTable").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("PetsImportExport").setVisible(true);
					sap.ui.getCore().byId("PetsImportExport").setModel(oNewsPaperModel);
					sap.ui.getCore().byId("idTable").setMode("SingleSelectLeft");
					var firstItem = sap.ui.getCore().byId("idTable").getItems()[0];
					sap.ui.getCore().byId("idTable").setSelectedItem(firstItem);
					sap.ui.getCore().byId("PetsImportExport").setBindingContext(firstItem.getBindingContext());
				}

				// Comments 
				oGAComments.setData(oData.results[0].HeaderToComm.results);
				that.getView().setModel(oGAComments, "GAComments");
				/*oNewsPaperModel.setProperty("/GAComments", oData.results[0].Gasc_Agent_Comments);
				oNewsPaperModel.setProperty("/FinComments", oData.results[0].Fin_Comments);
				oNewsPaperModel.setProperty("/ReqComments", oData.results[0].Req_Comment);*/
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
	},

	getVOTDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("VOTCPrefBody").setVisible(false);
		oView.byId("VOTDPrefBody").setVisible(false);
		oView.byId("VOTTracking").setVisible(false);
		oView.byId("VOTReject").setVisible(false);
		var PrefCJson;
		var PrefDJson;
		var EmpJson;
		var VOTJson;
		var BuyJson;
		var SAtt1Json;
		var SAtt2Json;
		var SAtt3Json;
		var SAtt4Json;

		//    var ovotReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		//    var votfilter = "Requests?$filter=RequestId eq '" + sRequestId + "'";
		var ovotReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var votfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		ovotReqModel.read(votfilter, null, null, false, function (data, response) {
			var votReqModel = new sap.ui.model.json.JSONModel();
			votReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var ovotReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var reqtxt = "CartransferSet('" + sRequestId + "')";
		ovotReqModel.read(reqtxt, null, null, false, function (data, response) {
				var votReqModel = new sap.ui.model.json.JSONModel();
				votReqModel.setData(data);
				VOTJson = data;
			},
			function (response) {
				return "";
			});

		var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oModelGasc.read("UserDetail(KaustID='" + VOTJson.BKaustId + "',UserId='')", null, null, false, function (data, response) {
				var oDetailsModel = new sap.ui.model.json.JSONModel();
				oDetailsModel.setData(data);
				BuyJson = data;
			},
			function (response) {
				return "";
			});

		var ovotCPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + VOTJson.SKaustId + "',SubServiceCode='" + oSubCode + "')";
		ovotCPrefModel.read(opctxt, null, null, false, function (data, response) {
				var votCPrefModel = new sap.ui.model.json.JSONModel();
				votCPrefModel.setData(data);
				PrefCJson = data;
			},
			function (response) {
				return "";
			});

		var ovotDPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opdtxt = "MyPreferencesCollection(KaustID='" + VOTJson.BKaustId + "',SubServiceCode='" + oSubCode + "')";
		ovotDPrefModel.read(opdtxt, null, null, false, function (data, response) {
				var votDPrefModel = new sap.ui.model.json.JSONModel();
				votDPrefModel.setData(data);
				PrefDJson = data;
			},
			function (response) {
				return "";
			});

		var oExpeditor = VOTJson.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			//      oExpeditor = that.getExpeditorDetails(oExpeditor);
			oView.byId("idVOTExpeditor").setText(oExpeditor);
		}

		// Populate Vehicle Ownership Transfer Details - Begin
		if (oSubCode == "0507") {
			oView.byId("idskaustid").setText(VOTJson.SKaustId);
			oView.byId("idsname").setText(VOTJson.SName);
			oView.byId("idsemail").setText(VOTJson.SEmail);
			oView.byId("idsmobile").setText(VOTJson.SMobile);

			oView.byId("idbkaustid").setText(VOTJson.BKaustId);
			oView.byId("idbname").setText(VOTJson.BName);
			oView.byId("idbemail").setText(VOTJson.BEmail);
			oView.byId("idbmobile").setText(VOTJson.BMobile);

			oView.byId("idcbrand").setText(VOTJson.BrandCode);
			oView.byId("idcmodel").setText(VOTJson.ModelCode);
			oView.byId("idccolor").setText(VOTJson.ColorCode);
			oView.byId("idcplate").setText(VOTJson.PlateNo);
			oView.byId("idcyear").setText(VOTJson.CarYear);
			oView.byId("idcprice").setText(VOTJson.CarPrice + " SAR");

			var oAttachModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + VOTJson.SKaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '15'";
			oAttachModel1.read(attxt1, null, null, false, function (data1, response) {
					var attachModel1 = new sap.ui.model.json.JSONModel();
					attachModel1.setData(data1);
					SAtt1Json = data1;
				},
				function (response) {
					return "";
				});

			var oAttachModel2 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt2 = "FileRead?$filter=UNIQUE_ID eq '" + VOTJson.SKaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '35'";
			oAttachModel2.read(attxt2, null, null, false, function (data2, response) {
					var attachModel2 = new sap.ui.model.json.JSONModel();
					attachModel2.setData(data2);
					SAtt2Json = data2;
				},
				function (response) {
					return "";
				});

			oView.byId("idvvehsticker").setText("No");
			if (VOTJson.VehicleSticker != null && VOTJson.VehicleSticker == "X") {
				oView.byId("idvvehsticker").setText("Yes");
			}

			//      oView.byId("sevenseater").setVisible(false);
			//      if (BuyJson.Nationality != "Saudi Arabian") {
			//        oView.byId("sevenseater").setVisible(true);
			//        oView.byId("idvsevenseater").setText("No");
			//        if (VOTJson.IsSevenSeater != null && VOTJson.IsSevenSeater == "X") {
			//          oView.byId("idvsevenseater").setText("Yes");
			//        }
			//      }

			if (SAtt1Json.results.length > 0) {
				oView.byId("idvotatt1").setText(SAtt1Json.results[0].FILENAME);
				oView.byId("idvotatt1").setHref(SAtt1Json.results[0].URL);
			}

			if (SAtt2Json.results.length > 0) {
				oView.byId("idvotatt2").setText(SAtt2Json.results[0].FILENAME);
				oView.byId("idvotatt2").setHref(SAtt2Json.results[0].URL);
			}

			if (VOTJson.Status == "011") {
				oView.byId("VOTReject").setVisible(true);
				oView.byId("idbcomments").setText(VOTJson.Bcomments);
			}
			oView.byId("idAmtRecdInp").setText(VOTJson.Amount);

			oView.byId("idvotCollection").setSelectedIndex(0);
			if (VOTJson.CollectionMtd != null && VOTJson.CollectionMtd == "1") {
				oView.byId("idvotCollection").setSelectedIndex(1);
				oView.byId("VOTCPrefBody").setVisible(true);
				oView.byId("VOTTracking").setVisible(true);
			}

			oView.byId("idvotDelivery").setSelectedIndex(0);
			if (VOTJson.DeliveryMtd != null && VOTJson.DeliveryMtd == "1") {
				oView.byId("idvotDelivery").setSelectedIndex(1);
				oView.byId("VOTDPrefBody").setVisible(true);
				oView.byId("VOTTracking").setVisible(true);
			}

			oView.byId("idcpdname").setText(PrefCJson.FirstName + " " + PrefCJson.MiddleName + " " + PrefCJson.LastName);
			oView.byId("idcpdkaustid").setText(PrefCJson.KaustID);
			oView.byId("idcpdmobile").setText(PrefCJson.Mobile);
			oView.byId("idcpdbldno").setText(PrefCJson.BuildingNo);
			oView.byId("idcpdlevel").setText(PrefCJson.levelb);
			oView.byId("idcpdbldname").setText(PrefCJson.BuildingName);

			oView.byId("iddpdname").setText(PrefDJson.FirstName + " " + PrefDJson.MiddleName + " " + PrefDJson.LastName);
			oView.byId("iddpdkaustid").setText(PrefDJson.KaustID);
			oView.byId("iddpdmobile").setText(PrefDJson.Mobile);
			oView.byId("iddpdbldno").setText(PrefDJson.BuildingNo);
			oView.byId("iddpdlevel").setText(PrefDJson.levelb);
			oView.byId("iddpdbldname").setText(PrefDJson.BuildingName);
			oView.byId("idvotTrackingNum").setText(VOTJson.TrackingId);
			// Populate VOT Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json",
				null, false);
			//      oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
			//        "'&$format=json",
			//        null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryVOT");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End       
		}
	},

	getExitRentryVisaDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		var EREJson;

		//    var EmpJson;
		//    var oEmpReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		//    var empfilter = "Requests?$filter=RequestId eq '" + sRequestId + "'";
		//    oEmpReqModel.read(empfilter, null, null, false, function (data, response) {
		//      var empReqModel = new sap.ui.model.json.JSONModel();
		//      empReqModel.setData(data.results);
		//      if (data.results.length > 0) {
		//        EmpJson = data.results[0];
		//      }
		//    }, function (response) {
		//      return "";
		//    });

		var oEREReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		var reqtxt = "UserDependents?$filter=RequestId eq '" + sRequestId + "'";
		oEREReqModel.read(reqtxt, null, null, false, function (data, response) {
				var ereReqModel = new sap.ui.model.json.JSONModel();
				ereReqModel.setData(data);
				EREJson = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = EREJson.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			//      oExpeditor = that.getExpeditorDetails(oExpeditor);
			oView.byId("idereExpeditor").setText(oExpeditor);
		}

		// Populate Exit Re Entry Visa Details - Begin
		oView.byId("lblretbefdate").setVisible(false);
		oView.byId("idereretbefdate").setVisible(false);
		oView.byId("lblvisaduration").setVisible(false);
		oView.byId("iderevisaduration").setVisible(false);

		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var oIqamaDate = new Date(EREJson.IqamaEdate);
		var oIqamaExpText = oIqamaDate.getDate() + " " + months[oIqamaDate.getMonth()] + " " + (oIqamaDate.getYear() + 1900);

		oView.byId("idereiqamano").setText(EREJson.IqamaNo);
		oView.byId("idereiqamaexpdate").setText(oIqamaExpText);
		oView.byId("iderevisaclass").setText(EREJson.Type);
		if (EREJson.NewExpDate == null) {
			oView.byId("iderevisaduration").setText(parseInt(EREJson.Duration, 10) + " Day(s)");
			oView.byId("lblvisaduration").setVisible(true);
			oView.byId("iderevisaduration").setVisible(true);
		} else {
			var oRetBefDate = new Date(EREJson.NewExpDate);
			var oRetBefDateText = oRetBefDate.getDate() + " " + months[oRetBefDate.getMonth()] + " " + (oRetBefDate.getYear() + 1900);
			oView.byId("idereretbefdate").setText(oRetBefDateText);
			oView.byId("lblretbefdate").setVisible(true);
			oView.byId("idereretbefdate").setVisible(true);
		}

		// Populate Exit Re Entry Visa Details - End

		// Populate Comments Details - Begin    
		var oDataApproverModel = new sap.ui.model.json.JSONModel();
		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'&$format=json",
			null, false);
		var data = oDataApproverModel.getData().d.results;
		oDataApproverModel.setData(data);
		this.getView().setModel(oDataApproverModel, "GAComments");
		// Populate Comments details - End        

		// Populate History details - Begin       
		if (sRequestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
			var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistoryERE");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
				table.getBinding('items').filter(oCombineFilters);
			}, function (response) {
				return "";
			});
		}
		// Populate History details - End       
	},

	getAttestationDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("COCDetails").setVisible(false);
		oView.byId("FCONDetails").setVisible(false);
		oView.byId("MOFADetails").setVisible(false);
		oView.byId("MOFAFCDetails").setVisible(false);
		oView.byId("MOFAAttachments").setVisible(false);
		oView.byId("AttestPrefHead").setVisible(false);
		oView.byId("AttestPrefBody").setVisible(false);
		oView.byId("GenAttDetails").setVisible(false);

		var PrefJson;
		var EmpJson;
		var MofaJson;
		var Att1Json;
		var Att2Json;
		var ConsJson;
		var DepJson;

		//    var omofaReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		//    var mofafilter = "Requests?$filter=RequestId eq '" + sRequestId + "'";
		var omofaReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var mofafilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";
		omofaReqModel.read(mofafilter, null, null, false, function (data, response) {
			var mofaReqModel = new sap.ui.model.json.JSONModel();
			mofaReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var omofaPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var optxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		omofaPrefModel.read(optxt, null, null, false, function (data, response) {
				var mofaPrefModel = new sap.ui.model.json.JSONModel();
				mofaPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var omofaReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var reqtxt = "DocumentAttestationSet('" + sRequestId + "')";
		omofaReqModel.read(reqtxt, null, null, false, function (data, response) {
				var mofaReqModel = new sap.ui.model.json.JSONModel();
				mofaReqModel.setData(data);
				MofaJson = data;
			},
			function (response) {
				return "";
			});

		var oConsulateModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oConsulateModel.read("ConsulatesSet", null, null, false, function (data, response) {
				var consulateModel = new sap.ui.model.json.JSONModel();
				consulateModel.setData(data);
				ConsJson = data;
			},
			function (response) {
				return "";
			});

		var oExpeditor = MofaJson.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			//      oExpeditor = that.getExpeditorDetails(oExpeditor);
			oView.byId("idExpeditor").setText(oExpeditor);
		}

		// Populate Attestation Details - Begin
		if (oSubCode == "1701") {
			oView.byId("MOFADetails").setVisible(true);
			oView.byId("MOFAAttachments").setVisible(true);

			var oAttachModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
			oAttachModel1.read(attxt1, null, null, false, function (data1, response) {
					var attachModel1 = new sap.ui.model.json.JSONModel();
					attachModel1.setData(data1);
					Att1Json = data1;
				},
				function (response) {
					return "";
				});

			var oAttachModel2 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt2 = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
			oAttachModel2.read(attxt2, null, null, false, function (data2, response) {
					var attachModel2 = new sap.ui.model.json.JSONModel();
					attachModel2.setData(data2);
					Att2Json = data2;
				},
				function (response) {
					return "";
				});

			oView.byId("idmissuedksa").setText("No");
			if (MofaJson.MIssuedKsa != null && MofaJson.MIssuedKsa == "X") {
				oView.byId("idmissuedksa").setText("Yes");
			}

			oView.byId("idmattestedksa").setText("No");
			if (MofaJson.MAttestedKsa != null && MofaJson.MAttestedKsa == "X") {
				oView.byId("idmattestedksa").setText("Yes");
			}

			oView.byId("idmforcon").setText("No");
			oView.byId("idmforeignconsulates").setText("");
			oView.byId("idmforeignconsulates").setVisible(false);
			oView.byId("idmmofatitle").setText("MOFA Attestation");
			if (MofaJson.MForeignConsulates != null && MofaJson.MForeignConsulates.length > 0) {
				oView.byId("idmforeignconsulates").setVisible(true);
				oView.byId("MOFAFCDetails").setVisible(true);
				oView.byId("idmmofatitle").setText("MOFA and Foreign Consulate Attestation");
				oView.byId("idmforcon").setText("Yes");
				for (var i = 0; i < ConsJson.results.length; i++) {
					if (ConsJson.results[i].Code == MofaJson.MForeignConsulates) {
						oView.byId("idmforeignconsulates").setText(ConsJson.results[i].Description);
						i = ConsJson.results.length + 2;
					}
				}
			}

			if (Att1Json.results.length > 0) {
				oView.byId("idmofaatt").setText(Att1Json.results[0].FILENAME);
				oView.byId("idmofaatt").setHref(Att1Json.results[0].URL);
			}

			if (Att2Json.results.length > 0) {
				oView.byId("idsadadatt").setText(Att2Json.results[0].FILENAME);
				oView.byId("idsadadatt").setHref(Att2Json.results[0].URL);
			}

		}

		if (oSubCode == "1704") {
			oView.byId("COCDetails").setVisible(true);
			oView.byId("idcnoofattestation").setText(MofaJson.CNoOfAttestation);
			oView.byId("idckaustissued").setText("No");
			if (MofaJson.CKaustIssued != null && MofaJson.CKaustIssued == "X") {
				oView.byId("idckaustissued").setText("Yes");
			}
		}

		if (oSubCode == "1705") {
			oView.byId("FCONDetails").setVisible(true);
			oView.byId("idfattestedmofa").setText("No");
			oView.byId("idfforeignconsulates").setText("");
			if (MofaJson.FAttestedMofa != null && MofaJson.FAttestedMofa == "X") {
				oView.byId("idfattestedmofa").setText("Yes");
			}
			for (var i = 0; i < ConsJson.results.length; i++) {
				if (ConsJson.results[i].Code == MofaJson.FForeignConsulates) {
					oView.byId("idfforeignconsulates").setText(ConsJson.results[i].Description);
					i = ConsJson.results.length + 2;
				}
			}
		}

		oView.byId("GenAttDetails").setVisible(true);
		var DependentsName = "";
		var depkid = MofaJson.DependentsKaustid.split(".");
		for (var k = 0; k < depkid.length; k++) {
			for (var i = 0; i < DepJson["results"].length; i++) {
				if (DepJson["results"][i].KaustId == depkid[k]) {
					if (DependentsName.length == 0)
						DependentsName = DependentsName + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					else
						DependentsName = DependentsName + ", " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					i = DepJson["results"].length + 1;
				}
			}
		}

		oView.byId("idSelectedReq").setText(DependentsName);
		oView.byId("idAmtRecdInp").setText(MofaJson.Amount);

		oView.byId("AttestPrefHead").setVisible(true);
		oView.byId("idmofaCollection").setSelectedIndex(0);
		if (MofaJson.CollectionMtd != null && MofaJson.CollectionMtd == "1") {
			oView.byId("idmofaCollection").setSelectedIndex(1);
			oView.byId("AttestPrefBody").setVisible(true);
		}

		oView.byId("idmofaDelivery").setSelectedIndex(0);
		if (MofaJson.DeliveryMtd != null && MofaJson.DeliveryMtd == "1") {
			oView.byId("idmofaDelivery").setSelectedIndex(1);
			oView.byId("AttestPrefBody").setVisible(true);
		}

		oView.byId("idmpmname").setValue(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
		oView.byId("idmpmkaustid").setValue(PrefJson.KaustID);
		oView.byId("idmpmmobile").setValue(PrefJson.Mobile);
		oView.byId("idmpmbldno").setValue(PrefJson.BuildingNo);
		oView.byId("idmpmlevel").setValue(PrefJson.levelb);
		oView.byId("idmpmbldname").setValue(PrefJson.BuildingName);
		oView.byId("idmofaTrackingNum").setValue(MofaJson.TrackingId);
		// Populate Attestation Details - End

		// Populate Comments Details - Begin    
		var oDataApproverModel = new sap.ui.model.json.JSONModel();
		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'&$format=json",
			null, false);
		var data = oDataApproverModel.getData().d.results;
		oDataApproverModel.setData(data);
		this.getView().setModel(oDataApproverModel, "GAComments");

		//    var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		//      var oGAComments = new sap.ui.model.json.JSONModel();        
		//      var filterstrComment = "CommentSet?$filter=Request_ID eq '" + sRequestId + "'";
		//      oModelGasc.read(filterstrComment, null, null, false, function (data, response) 
		//    {
		//        oGAComments.setData(data.results);
		//      this.getView().setModel(oGAComments, "GAComments");
		//    }, 
		//    function (response) {
		//      return "";
		//    });
		// Populate Comments details - End        

		// Populate History details - Begin       
		if (sRequestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
			var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistory");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
				table.getBinding('items').filter(oCombineFilters);
			}, function (response) {
				return "";
			});
		}
		// Populate History details - End       
	},

	// Expeditor details -start
	getExpeditorDetails: function (oExpeditor) {
		var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
				var expeditorModel = new sap.ui.model.json.JSONModel();
				expeditorModel.setData(data);
				oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				return oExpeditor;
			},
			function (response) {
				return "";
			});
	},
	// Expeditor details -end

	//		chandra edit starts
	getTaxLetterDetails: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idTaxLetter").setVisible(true);
		var odetails;
		var sUrl = "GASC_HeaderSet?$filter=Request_ID eq '" + requestId + "'&$expand=HeaderToTAX,HeaderToComm";
		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0105") {
					var oDataModel = oData.results[0].HeaderToTAX.results;
					odetails = oData.results[0].HeaderToTAX.results[0];

					if (oDataModel.length === 2) {
						if (oDataModel[0].Relationship === "") {
							sap.ui.getCore().byId("id1").setVisible(true);
							sap.ui.getCore().byId("idKaust").setText(oDataModel[0].KaustId);
							sap.ui.getCore().byId("idName").setText(oDataModel[0].Fname + " " + oDataModel[0].Mname + " " + oDataModel[0].Lname);
							sap.ui.getCore().byId("idGender").setText(oDataModel[0].Gender);
							sap.ui.getCore().byId("idNationality").setText(oDataModel[0].Nationality);
							sap.ui.getCore().byId("idIqamaNo").setText(oDataModel[0].IqamaNo);
							sap.ui.getCore().byId("idYear1").setText(oDataModel[0].taxYear1);
							sap.ui.getCore().byId("idYear2").setText(oDataModel[0].taxYearto);
							sap.ui.getCore().byId("id2").setVisible(true);
							sap.ui.getCore().byId("idKaustDep").setText(oDataModel[1].KaustId);
							sap.ui.getCore().byId("idNameDep").setText(oDataModel[1].Fname + " " + oDataModel[1].Mname + " " + oDataModel[1].Lname);
							sap.ui.getCore().byId("idGenderDep").setText(oDataModel[1].Gender);
							sap.ui.getCore().byId("idNationalityDep").setText(oDataModel[1].Nationality);
							sap.ui.getCore().byId("idIqamaNoDep").setText(oDataModel[1].IqamaNo);
							sap.ui.getCore().byId("idYearDep1").setText(oDataModel[1].taxYear1);
							sap.ui.getCore().byId("idYearDep2").setText(oDataModel[1].taxYearto);
						} else if (oDataModel[0].Relationship === "Spouse") {
							sap.ui.getCore().byId("id1").setVisible(true);
							sap.ui.getCore().byId("idKaust").setText(oDataModel[1].KaustId);
							sap.ui.getCore().byId("idName").setText(oDataModel[1].Fname + " " + oDataModel[1].Mname + " " + oDataModel[1].Lname);
							sap.ui.getCore().byId("idGender").setText(oDataModel[1].Gender);
							sap.ui.getCore().byId("idNationality").setText(oDataModel[1].Nationality);
							sap.ui.getCore().byId("idIqamaNo").setText(oDataModel[1].IqamaNo);
							sap.ui.getCore().byId("idYear1").setText(oDataModel[1].taxYear1);
							sap.ui.getCore().byId("idYear2").setText(oDataModel[1].taxYearto);
							sap.ui.getCore().byId("id2").setVisible(true);
							sap.ui.getCore().byId("idKaustDep").setText(oDataModel[0].KaustId);
							sap.ui.getCore().byId("idNameDep").setText(oDataModel[0].Fname + " " + oDataModel[0].Mname + " " + oDataModel[0].Lname);
							sap.ui.getCore().byId("idGenderDep").setText(oDataModel[0].Gender);
							sap.ui.getCore().byId("idNationalityDep").setText(oDataModel[0].Nationality);
							sap.ui.getCore().byId("idIqamaNoDep").setText(oDataModel[0].IqamaNo);
							sap.ui.getCore().byId("idYearDep1").setText(oDataModel[0].taxYear1);
							sap.ui.getCore().byId("idYearDep2").setText(oDataModel[0].taxYearto);
						}
					} else if (oDataModel.length === 1) {
						if (oDataModel[0].Relationship === "") {
							sap.ui.getCore().byId("id1").setVisible(true);
							sap.ui.getCore().byId("id2").setVisible(false);
							sap.ui.getCore().byId("idKaust").setText(oDataModel[0].KaustId);
							sap.ui.getCore().byId("idName").setText(oDataModel[0].Fname + " " + oDataModel[0].Mname + " " + oDataModel[0].Lname);
							sap.ui.getCore().byId("idGender").setText(oDataModel[0].Gender);
							sap.ui.getCore().byId("idNationalityDep").setText(oDataModel[0].Nationality);
							sap.ui.getCore().byId("idIqamaNo").setText(oDataModel[0].IqamaNo);
							sap.ui.getCore().byId("idYear1").setText(oDataModel[0].taxYear1);
							sap.ui.getCore().byId("idYear2").setText(oDataModel[0].taxYearto);
						} else if (oDataModel[0].Relationship === "Spouse") {
							sap.ui.getCore().byId("id2").setVisible(true);
							sap.ui.getCore().byId("id1").setVisible(false);
							sap.ui.getCore().byId("idKaustDep").setText(oDataModel[0].KaustId);
							sap.ui.getCore().byId("idNameDep").setText(oDataModel[0].Fname + " " + oDataModel[0].Mname + " " + oDataModel[0].Lname);
							sap.ui.getCore().byId("idGenderDep").setText(oDataModel[0].Gender);
							sap.ui.getCore().byId("idNationality").setText(oDataModel[0].Nationality);
							sap.ui.getCore().byId("idIqamaNoDep").setText(oDataModel[0].IqamaNo);
							sap.ui.getCore().byId("idYearDep1").setText(oDataModel[0].taxYear1);
							sap.ui.getCore().byId("idYearDep2").setText(oDataModel[0].taxYearto);
						}
					}
				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.Deliverymtd));
		if (odetails.Deliverymtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});
	},
	//chandra edit ends
	// Transfer of Information - Start
	getTransferInfo: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idTransferInfo").setVisible(true);
		var nations, odetails;
		var t = this;
		// Nationality
		var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
		oNatModel.read("/COUNTRY", {
			async: false,
			success: function (oData, response) {
				nations = oData.results;
			}
		});

		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var sUrl = "GASC_HeaderSet?$filter=RequestId eq '" + requestId + "'&$expand=HeadertoInfo";
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0401") {
					var oICJson = new sap.ui.model.json.JSONModel();
					oICJson.setData(oData.results[0].HeadertoInfo);
					odetails = oData.results[0].HeadertoInfo.results[0];
					var idata = oData.results[0].HeadertoInfo.results;
					
					var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
					var urlFile2 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
						"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '3'";
					var data = "";
					filesData.read(urlFile2, {
						async: false,
						success: function (oData1, response) {
							data = oData1.results;
						}
					});
					var attachs = [];
					var urls = "";
					for (var it = 0; it < idata.length; it++) {
						for (var c = 0; c < nations.length; c++) {
							if (idata[it].CountryOfIssue === nations[c].LAND1) {
								idata[it].CountryOfIssue = nations[c].LANDX;
							}
						}
						idata[it].PpExpiryDate = t.formatDate(idata[it].PpExpiryDate);
						var str = "";
						str = "<strong>Passport No.: </strong>" + idata[it].NewPassport + "<br>" +
							"<strong>Place of Issue: </strong>" + idata[it].PlaceOfIssue + "<br>" +
							"<strong>Expiry Date: </strong>" + t.formatDate(idata[it].NewExpiryDate) + "<br><strong>Issue Date: </strong>" + t.formatDate(
								idata[it].DateOfIssue) + "<br>" + "<strong>Country: </strong>" + idata[it].CountryOfIssue;
						idata[it].newDetails = str;
						for (var tc = 0; tc < data.length; tc++) {
							if (data[tc].FILENAME.includes(idata[it].KaustId)) {
								var uname = idata[it].KaustId + " - " + idata[it].FirstName + " " + idata[it].MiddleName + " " + idata[it].LastName;
								urls = "<strong>" + uname + "</strong><br><br><a href='" + data[tc].URL + "' target='_blank'>" + data[tc].FILENAME.replace(
									idata[it].KaustId, "") + "</a><br>";
								attachs.push(urls);
							}
						}
					}
					t.Url = "";
					for (var a = 0; a < attachs.length; a++) {
						t.Url = t.Url + "<br>" + attachs[a];
					}
					sap.ui.getCore().byId("idUrl").setHtmlText(t.Url);
					t.getView().setModel(oICJson, "oTIJson");
					sap.ui.getCore().setModel(oICJson, "oTIJson");
				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.CollectionMtd));
		if (odetails.DeliveryMtd === "1" || odetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		if (odetails.CollectionMtd === "2") {
			sap.ui.getCore().byId("idCollection").setVisible(false);
			sap.ui.getCore().byId("idCollectionType").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

	},
	// Transfer of Information - End

	// getSponsershipTransferInfo : function(requestId, oSubCode){

	// },

	// Saudi Passport pickup - Start
	getSaudiPassport: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idSaudiPP").setVisible(true);
		var odetails;
		var t = this;
		var DepJson;
		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var sUrl = "GASC_HeaderSet?$filter=RequestId eq '" + requestId + "'&$expand=Headertoid";
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0310") {
					var oSPJson = new sap.ui.model.json.JSONModel();
					oSPJson.setData(oData.results[0].Headertoid);
					odetails = oData.results[0].Headertoid.results[0];
					var idata = oData.results[0].Headertoid.results;
					var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
					var urlFile2 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
						"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
					var data = "";
					filesData.read(urlFile2, {
						async: false,
						success: function (oData1, response) {
							data = oData1.results;
						}
					});
					for (var it = 0; it < idata.length; it++) {
						var dob = idata[it].DateOfBirth;
						var db = dob.split("T")[0].split("-");
						oData.results[0].Headertoid.results[it].birthd = db[2] + "-" + db[1] + "-" + db[0];
						for (var fn = 0; fn < data.length; fn++) {
							var filename = data[fn].FILENAME.split("-");
							for (var dep = 0; dep < DepJson.results.length; dep++) {
								if (DepJson.results[dep].KaustId === idata[it].KaustId) {
									if (filename[0].includes(dep)) {
										oData.results[0].Headertoid.results[it].fileName = filename[1];
										oData.results[0].Headertoid.results[it].url = data[fn].URL;
									}
								}
							}
						}
					}
					t.getView().setModel(oSPJson, "oSPJson");
					sap.ui.getCore().setModel(oSPJson, "oSPJson");

					var date = oData.results[0].RepDate;
					var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
					oDataModel.read("KaustrepsSet?$filter=Location eq " + oData.results[0].Location + " and RepDate eq datetime'" + date + "'", {
						async: false,
						success: function (oData1, response) {
							var result = oData1.results[0];
							if (result) {
								var today = result.DateOfBirth;
								if (today) {
									var dd = today.getDate();
									var mm = today.getMonth() + 1;
									var yyyy = today.getFullYear();
									if (dd < 10) {
										dd = '0' + dd;
									}
									if (mm < 10) {
										mm = '0' + mm;
									}
									today = dd + '-' + mm + '-' + yyyy;
								}
								var repDate = date.split("T")[0].split("-");
								sap.ui.getCore().byId("idSType").setText(oData.results[0].PickupType === "1" ? "Issuance" : "Renewal");
								sap.ui.getCore().byId("idRepName").setText(result.Name);
								sap.ui.getCore().byId("idNumber").setText(result.IdNumber);
								sap.ui.getCore().byId("idRepLoc").setText(oData.results[0].Location === "1" ? "Jeddah" : "Rabigh");
								sap.ui.getCore().byId("idRepDate").setText(repDate[2] + "-" + repDate[1] + "-" + repDate[0]);
								sap.ui.getCore().byId("idRepDob").setText(today);
							}
						}
					});
				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.CollectionMtd));
		if (odetails.DeliveryMtd === "1" || odetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		if (odetails.CollectionMtd === "2") {
			sap.ui.getCore().byId("idCollection").setVisible(false);
			sap.ui.getCore().byId("idCollectionType").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

	},
	// Saudi Passport pickup - End

	// Saudi National ID pickup - Start
	getSaudiIdData: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idSaudiId").setVisible(true);
		var odetails;
		var t = this;
		var DepJson;
		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var sUrl = "GASC_HeaderSet?$filter=RequestId eq '" + requestId + "'&$expand=Headertoid";
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0306") {
					var oSPJson = new sap.ui.model.json.JSONModel();
					oSPJson.setData(oData.results[0].Headertoid);
					odetails = oData.results[0].Headertoid.results[0];
					var idata = oData.results[0].Headertoid.results;
					for (var it = 0; it < idata.length; it++) {
						var dob = idata[it].DateOfBirth;
						var db = dob.split("T")[0].split("-");
						oData.results[0].Headertoid.results[it].birthd = db[2] + "-" + db[1] + "-" + db[0];
					}
					t.getView().setModel(oSPJson, "oSPJson");
					sap.ui.getCore().setModel(oSPJson, "oSPJson");

					var date = oData.results[0].RepDate;
					var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
					oDataModel.read("KaustrepsSet?$filter=Location eq " + oData.results[0].Location + " and RepDate eq datetime'" + date + "'", {
						async: false,
						success: function (oData1, response) {
							var result = oData1.results[0];
							if (result) {
								var today = result.DateOfBirth;
								if (today) {
									var dd = today.getDate();
									var mm = today.getMonth() + 1;
									var yyyy = today.getFullYear();
									if (dd < 10) {
										dd = '0' + dd;
									}
									if (mm < 10) {
										mm = '0' + mm;
									}
									today = dd + '-' + mm + '-' + yyyy;
								}
								var repDate = date.split("T")[0].split("-");
								sap.ui.getCore().byId("idSType").setText(oData.results[0].PickupType === "1" ? "Issuance" : "Renewal");
								sap.ui.getCore().byId("idRepName").setText(result.Name);
								sap.ui.getCore().byId("idNumber").setText(result.IdNumber);
								sap.ui.getCore().byId("idRepLoc").setText(oData.results[0].Location === "1" ? "Jeddah" : "Rabigh");
								sap.ui.getCore().byId("idRepDate").setText(repDate[2] + "-" + repDate[1] + "-" + repDate[0]);
								sap.ui.getCore().byId("idRepDob").setText(today);
							}
						}
					});
				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.CollectionMtd));
		if (odetails.DeliveryMtd === "1" || odetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		if (odetails.CollectionMtd === "2") {
			sap.ui.getCore().byId("idCollection").setVisible(false);
			sap.ui.getCore().byId("idCollectionType").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});
	},
	// Saudi National ID pickup - End

	//Sponsership transfer Information
	getSponsershipTransferInfo: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idsponTransferInfo").setVisible(true);
		var nations, odetails;
		var t = this;
		// Nationality
		var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
		oNatModel.read("/COUNTRY", {
			async: false,
			success: function (oData, response) {
				nations = oData.results;
			}
		});

		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		var sUrl = "GASC_HeaderSet?$filter=Request_ID eq '" + requestId + "'&$expand=HeaderToDHS,HeaderToComm";
		var t = this;
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0206") {
					var oICJson = new sap.ui.model.json.JSONModel();
					// oData.results[0].HeaderToDHS.results[0].KaustId = oData.results[0].KaustId;
					oICJson.setData(oData.results[0].HeaderToDHS.results);
					// odetails = oData.results[0].HeadertoInfo.results[0];
					odetails = oData.results[0].HeaderToDHS.results[0];
					var idata = oData.results[0].HeaderToDHS.results[0];
					
					var dob = idata.Birthdate;
					if (dob) {
						var db = dob.split("T")[0].split("-");
						oData.results[0].HeaderToDHS.results[0].birthd = db[2] + "-" + db[1] + "-" + db[0];
					}

					sap.ui.getCore().byId("dh_religion").setText("Muslim");
					if(idata.Religion == "2")
						sap.ui.getCore().byId("dh_religion").setText("Non-Muslim");

					var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
					var domIqa, domDomestic, domCurrent, domSame;
					if (odetails.Nationality === "SA" && odetails.Old_Nationality === "SA") {
						sap.ui.getCore().byId("idCurrentLabel").setText("Saudi ID");
						sap.ui.getCore().byId("idDomesticLabel").setText("Saudi ID");
						domSame = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "19");
					} else if (odetails.Nationality !== "SA" && odetails.Old_Nationality !== "SA") {
						sap.ui.getCore().byId("idCurrentLabel").setText("Iqama");
						sap.ui.getCore().byId("idDomesticLabel").setText("Iqama");
						domSame = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "5");

					} else if (odetails.Nationality === "SA" && odetails.Old_Nationality !== "SA") {
						sap.ui.getCore().byId("idCurrentLabel").setText("Iqama");
						sap.ui.getCore().byId("idDomesticLabel").setText("Saudi ID");
						domDomestic = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "19");
						domCurrent = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "5");

					} else if (odetails.Nationality !== "SA" && odetails.Old_Nationality === "SA") {
						sap.ui.getCore().byId("idCurrentLabel").setText("Saudi ID");
						sap.ui.getCore().byId("idDomesticLabel").setText("Iqama");
						domDomestic = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "5");
						domCurrent = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "19");
					}

					if (domSame !== undefined && domSame.length > 0) {
						for (var ki = 0; ki < domSame.length; ki++) {
							if (domSame[ki].FILENAME.split("-")[0] === "DH") {
								sap.ui.getCore().byId("idDomesticLink").setText(domSame[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idDomesticLink").setHref(domSame[ki].URL);
							} else if (domSame[ki].FILENAME.split("-")[0] === "OLD") {
								sap.ui.getCore().byId("idCurrentLink").setText(domSame[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idCurrentLink").setHref(domSame[ki].URL);
							}
						}
					}

					if (domCurrent !== undefined && domCurrent.length > 0) {
						for (var ki = 0; ki < domCurrent.length; ki++) {
							if (domCurrent[ki].FILENAME.split("-")[0] === "DH") {
								sap.ui.getCore().byId("idCurrentLink").setText(domCurrent[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idCurrentLink").setHref(domCurrent[ki].URL);
							} else if (domCurrent[ki].FILENAME.split("-")[0] === "OLD") {
								sap.ui.getCore().byId("idCurrentLink").setText(domCurrent[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idCurrentLink").setHref(domCurrent[ki].URL);
							}
						}
					}

					if (domDomestic !== undefined && domDomestic.length > 0) {
						for (var ki = 0; ki < domDomestic.length; ki++) {
							if (domDomestic[ki].FILENAME.split("-")[0] === "DH") {
								sap.ui.getCore().byId("idDomesticLink").setText(domDomestic[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idDomesticLink").setHref(domDomestic[ki].URL);
							} else if (domSame[ki].FILENAME.split("-")[0] === "OLD") {
								sap.ui.getCore().byId("idDomesticLink").setText(domDomestic[ki].FILENAME.split("-")[1]);
								sap.ui.getCore().byId("idDomesticLink").setHref(domDomestic[ki].URL);
							}
						}
					}

					//Code for passport and Saudi Visa

					var dompp = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "3");
					if (dompp) {
						sap.ui.getCore().byId("idDomPp").setText(dompp[0].FILENAME.split("-")[1]);
						sap.ui.getCore().byId("idDomPp").setHref(dompp[0].URL);
					}

					var domsv = t.getFileAttachmentRequestDetails(null, odetails.Request_ID, "7");
					if (domsv) {
						sap.ui.getCore().byId("idDomSv").setText(domsv[0].FILENAME.split("-")[1]);
						sap.ui.getCore().byId("idDomSv").setHref(domsv[0].URL);
					}

					// Country Start
					var Nationality = nations.filter(function (curretValue, index) {
						return curretValue.LAND1 === odetails.Nationality;

					});

					var Old_Nationality = nations.filter(function (curretValue, index) {
						return curretValue.LAND1 === odetails.Old_Nationality;

					});

					oICJson.setProperty('/0/Nationality', Nationality[0].LANDX);
					oICJson.setProperty('/0/Old_Nationality', Old_Nationality[0].LANDX);
					oICJson.updateBindings(true);

					//Country END

					t.getView().setModel(oICJson, "oTIJson");
					sap.ui.getCore().setModel(oICJson, "oTIJson");

					//CHECKBOX

					sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.Deliverymtd));
					sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.Collectionmtd));
					if (odetails.Deliverymtd === "1" || odetails.Collectionmtd === "1") {
						sap.ui.getCore().byId("idUpsForm").setVisible(true);
					} else {
						sap.ui.getCore().byId("idUpsForm").setVisible(false);
					}
					if (odetails.Collectionmtd === "2") {
						sap.ui.getCore().byId("idCollection").setVisible(false);
						sap.ui.getCore().byId("idCollectionType").setVisible(false);
					}

				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		// sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.DeliveryMtd));
		// sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.CollectionMtd));
		// if (odetails.DeliveryMtd === "1" || odetails.CollectionMtd === "1") {
		// 	sap.ui.getCore().byId("idUpsForm").setVisible(true);
		// } else {
		// 	sap.ui.getCore().byId("idUpsForm").setVisible(false);
		// }
		// if (odetails.CollectionMtd === "2") {
		// 	sap.ui.getCore().byId("idCollection").setVisible(false);
		// 	sap.ui.getCore().byId("idCollectionType").setVisible(false);
		// }
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histDataSH");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentDataSH");
			}
		});

	},

	// Code to get all the File Attachment Detail
	// Part of Sponsership Transfer
	getFileAttachmentRequestDetails: function (oEvent, kaustid, Doctype) {
		var filechk = false;
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
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
	// End of Sponsfership transfer Information

	//Birth Certificate - Start
	getBirthCertificate: function (requestId, oSubCode) {
		sap.ui.getCore().byId("idBCInfo").setVisible(true);
		var t = this;
		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		var filterstr = "GASC_HeaderSet?$filter=Request_ID eq '" + requestId + "'&$expand=HeaderToBC,HeaderToComm";
		var odetails;
		var nations;
		var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
		oNatModel.read("/COUNTRY", {
			async: false,
			success: function (oData, response) {
				nations = oData.results;
			}
		});
		oNewsPaperOdataModel.read(filterstr, null, null, false, function (rdata, response) {
			var hcDetails = rdata.results[0].HeaderToBC.results;
			odetails = rdata.results[0].HeaderToBC.results[0];
			for (var nt = 0; nt < hcDetails.length; nt++) {
				for (var ct = 0; ct < nations.length; ct++) {
					if (hcDetails[nt].Bcountry === nations[ct].LAND1) {
						rdata.results[0].HeaderToBC.results[nt].bcountry = nations[ct].LANDX;
					}
				}
			}
			var data;
			var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
			filesData.read("/FileRead?$filter=UNIQUE_ID eq '" + requestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '13'", {
					async: false,
					success: function (oData) {
						data = oData.results;
						var seqnums = [];
						for (var bc = 0; bc < data.length; bc++) {
							seqnums.push(data[bc].FILENAME.split("-")[1]);
						}
						var uniqueNames = [];
						$.each(seqnums, function (i, el) {
							if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
						});
						for (bc = 0; bc < uniqueNames.length; bc++) {
							var u = "";
							for (var h = 0; h < data.length; h++) {
								var filename = data[h].FILENAME.split("-");
								if (filename[1] === uniqueNames[bc]) {
									if (filename[0] === "ARABIC") {
										u = u + "<a href=" + data[h].URL + "><strong>Arabic Notice</strong></a><br>";
									} else if (filename[0] === "ENGLISH") {
										u = u + "<a href=" + data[h].URL + "><strong>English Notice</strong></a><br>";
									}
								}
							}
							rdata.results[0].HeaderToBC.results[bc].url = u;
							rdata.results[0].HeaderToBC.results[bc].birthDate = t.formatDate(rdata.results[0].HeaderToBC.results[bc].birthDate);
						}
					}
				});
			var oBCJson = new sap.ui.model.json.JSONModel();
			oBCJson.setData(rdata.results[0].HeaderToBC);
			sap.ui.getCore().setModel(oBCJson, "oBCJson");
			t.getView().setModel(oBCJson, "oBCJson");
		}, function (response) {
			return "";
		});

		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.Deliverymtd));
		//	sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.Collectionmtd));
		if (odetails.Deliverymtd === "1") { //|| odetails.Collectionmtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});
	},
	//Birth Certificate - End
	// Information Correction - start 
	getInfoCorrect: function (requestId, oSubCode) {
		var t = this;
		sap.ui.getCore().byId("idInfoCrt").setVisible(true);
		var odetails;
		var nations, religions;

		// Nationality
		var oNatModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/", true);
		oNatModel.read("/COUNTRY", {
			async: false,
			success: function (oData, response) {
				nations = oData.results;
			}
		});

		// Religion
		// var oRelModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
		// oRelModel.read("/ReligionSet", {
		// 	async: false,
		// 	success: function (oData, response) {
		// 		religions = oData.results;
		// 	}
		// });
		religions = [{
			"key": "1",
			"text": "Muslim"
		}, {
			"key": "2",
			"text": "Non-Muslim"
		}];

		var sUrl = "GASC_HeaderSet?$filter=Request_ID eq '" + requestId + "'&$expand=HeaderToIc,HeaderToComm";
		var oNewsPaperOdataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oNewsPaperOdataModel.read(sUrl, null, null, false,
			function (oData) {
				if (oSubCode === "0402") {
					var dataIC = oData.results[0].HeaderToIc.results;
					var oICJson = new sap.ui.model.json.JSONModel();
					oICJson.setData(oData.results[0].HeaderToIc);
					odetails = oData.results[0].HeaderToIc.results[0];
					for (var i = 0; i < oData.results[0].HeaderToIc.results.length; i++) {
						if (dataIC[i].Relationship === "") {
							dataIC[i].Relationship = "Self";
						}
						var fie = "",
							doc = "";
						var a = dataIC[i].CArabicname === 'X' ? 'Name Arabic' : '';
						var b = dataIC[i].CEnglishname === 'X' ? 'Name English' : '';
						var c = dataIC[i].CDob === 'X' ? 'Date of Birth' : '';
						var d = dataIC[i].CNationality === 'X' ? 'Nationality' : '';
						var e = dataIC[i].CReligion === 'X' ? 'Religion' : '';
						var f = dataIC[i].CBabyname === 'X' ? 'Baby Name' : '';
						var g = dataIC[i].CPlaceofbirth === 'X' ? 'Place of Birth' : '';
						var h = dataIC[i].CMaritalstatus === 'X' ? 'Marital Status' : '';
						var d1 = dataIC[i].Siqama === 'X' ? 'Iqama' : '';
						var d2 = dataIC[i].Sdriving === 'X' ? 'Driving License' : '';
						var d3 = dataIC[i].Sbirthcertificate === 'X' ? 'Birth Certificate' : '';
						for (var kk = 0; kk < nations.length; kk++) {
							if (dataIC[i].Nationality === nations[kk].LAND1) {
								dataIC[i].Nation = nations[kk].LANDX;
							}
						}
						for (var ij = 0; ij < religions.length; ij++) {
							if (dataIC[i].Religion === religions[ij].key) {
								dataIC[i].Region = religions[ij].text;
							}
						}
						var data = "";
						if (a) {
							fie = fie + '\n' + a;
							data = data + '<br>' + a + ' : <strong>' + dataIC[i].Arabicname + '</strong>';
						}
						if (b) {
							fie = fie + '\n' + b;
							data = data + '<br>' + b + ' : <strong>' + dataIC[i].Englishname + '</strong>';
						}
						if (c) {
							fie = fie + '\n' + c;
							if (dataIC[i].Dob === "00000000") {
								dataIC[i].Dob = "";
								//	data = data + '<br>' + c + ' : <strong>' + dataIC[i].Dob+ '</strong>';
							}
							if (dataIC[i].Dob != "00000000") {
								data = data + '<br>' + c + ' : <strong>' + t.formatDate(dataIC[i].Dob) + '</strong>';
							}
						}
						if (d) {
							fie = fie + '\n' + d;
							data = data + '<br>' + d + ' : <strong>' + (dataIC[i].Nation ? dataIC[i].Nation : "") + '</strong>';
						}
						if (e) {
							fie = fie + '\n' + e;
							data = data + '<br>' + e + ' : <strong>' + (dataIC[i].Region ? dataIC[i].Region : "") + '</strong>';
						}
						if (f) {
							fie = fie + '\n' + f;
							data = data + '<br>' + f + ' : <strong>' + dataIC[i].Babyname + '</strong>';
						}
						if (g) {
							fie = fie + '\n' + g;
							data = data + '<br>' + g + ' : <strong>' + dataIC[i].Placeofbirth + '</strong>';
						}
						if (h) {
							fie = fie + '\n' + h;
							data = data + '<br>' + h + ' : <strong>' + dataIC[i].Maritalstatus + '</strong>';
						}
						if (d1) {
							doc = doc + '\n' + d1;
						}
						if (d2) {
							doc = doc + '\n' + d2;
						}
						if (d3) {
							doc = doc + '\n' + d3;
						}
						dataIC[i].Fields = fie ? fie.substring(1) : fie;
						dataIC[i].Doctype = doc ? doc.substring(1) : doc;
						dataIC[i].data = data ? data.substring(4) : data;
					}
					t.getView().setModel(oICJson, "oICJson");
					sap.ui.getCore().setModel(oICJson, "oICJson");
				}
			},
			function (oError) {
				jQuery.sap.log.error(oError.response.statusCode + ": " + oError.response.statusText + " - " + oError.message);
			});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails.Deliverymtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails.Collectionmtd));
		if (odetails.Deliverymtd === "1" || odetails.Collectionmtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}
		var that = this;
		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});
	},
	// Information Correction - End

	formatDate: function (date) {
		if (date) {
			var d = date.split("T");
			var d1 = d[0].split("-");
			return d1[2] + "-" + d1[1] + "-" + d1[0];
		}
	},

	// Seven seater details -start
	getSevenSeaterDetails: function (requestId, oSubCode) {
		var that = this;
		var carDetails;
		var sevenseats = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);
		var optxt = "/sevenseaterSet(RequestId='" + requestId + "')";
		sevenseats.read(optxt, {
			async: false,
			success: function (oData, response) {
				var sevenSeat = new sap.ui.model.json.JSONModel();
				sevenSeat.setData(oData);
				carDetails = oData;
				that.getView().setModel(sevenSeat, "sevenseats");
			}
		});

		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(carDetails.DeliveryMtd));
		if (carDetails.DeliveryMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}

		var filesData = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT", true);
		// var urlFile1 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
		//  "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
		// var urlFile2 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
		//  "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
		var urlFile3 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '21'";
		var urlFile4 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '15'";
		var urlFile5 = "/FileRead?$filter=UNIQUE_ID eq '" + requestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '13'";
		// filesData.read(urlFile1, {
		//  async: true,
		//  success: function (oData, response) {
		//    var data = new sap.ui.model.json.JSONModel();
		//    data.setData(oData.results[0]);
		//    that.getView().setModel(data, "fileData1");
		//  }
		// });
		// filesData.read(urlFile2, {
		//  async: true,
		//  success: function (oData, response) {
		//    var data = new sap.ui.model.json.JSONModel();
		//    data.setData(oData.results[0]);
		//    that.getView().setModel(data, "fileData2");
		//  }
		// });
		filesData.read(urlFile3, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData(oData.results[0]);
				that.getView().setModel(data, "fileData3");
			}
		});
		filesData.read(urlFile4, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData(oData.results[0]);
				that.getView().setModel(data, "fileData4");
			}
		});
		filesData.read(urlFile5, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData(oData.results[0]);
				that.getView().setModel(data, "fileData5");
			}
		});

		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

		sap.ui.getCore().byId("idSevenSeater").setVisible(true);
	},
	// Seven seater details - end

	//Foreign Visa Details start
	getForeignVisaDetails: function (requestId, oSubCode) {
		var that = this;
		var visaDetails;
		var countryName;
		var foreignVisa = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);

		var optxt = "/FoeignVisaSet(RequestId='" + requestId + "')";
		foreignVisa.read(optxt, {
			async: false,
			success: function (oData, response) {
				var visaModel = new sap.ui.model.json.JSONModel();
				var country = "/CountrylistSet('" + oData.CountrySlt + "')";
				foreignVisa.read(country, {
					async: false,
					success: function (oData1, response1) {
						countryName = oData1.Landx50;
					}
				});
				if (oData.Attendence === "X") {
					oData.Attendence = "No";
				} else {
					oData.Attendence = "Yes";
				}
				oData.CountrySlt = countryName;
				visaModel.setData(oData);
				visaDetails = oData;
				that.getView().setModel(visaModel, "visaSet");
			}
		});

		var DepJson;
		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var DependentsName = "";
		var depkid = visaDetails.DependentsKaustid.split(".");
		for (var k = 0; k < depkid.length; k++) {
			for (var i = 0; i < DepJson["results"].length; i++) {
				if (DepJson["results"][i].KaustId == depkid[k]) {
					if (DependentsName.length == 0)
						DependentsName = DependentsName + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					else
						DependentsName = DependentsName + ", " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					i = DepJson["results"].length + 1;
				}
			}
		}
		sap.ui.getCore().byId("idSelectedReq").setText(DependentsName);

		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(visaDetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(visaDetails.CollectionMtd));

		if (visaDetails.DeliveryMtd === "1" || visaDetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}

		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

		sap.ui.getCore().byId("idApplyVisaSet").setVisible(true);
	},
	// Foreign visa details - end

	// Passport pickup - start
	getPassportPickupDetails: function (requestId, oSubCode) {
		var that = this;
		var passportDetails;
		var countryName;
		var passportPick = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);

		var optxt = "/PassportpickupSet(RequestId='" + requestId + "')";
		passportPick.read(optxt, {
			async: false,
			success: function (oData, response) {
				var passportModel = new sap.ui.model.json.JSONModel();
				var country = "/CountrylistSet('" + oData.CountryVisa + "')";
				passportPick.read(country, {
					async: false,
					success: function (oData1, response1) {
						countryName = oData1.Landx50;
					}
				});
				if (oData.Attendence === "X") {
					oData.Attendence = "No";
				} else {
					oData.Attendence = "Yes";
				}
				oData.CountryVisa = countryName;
				passportModel.setData(oData);
				passportDetails = oData;
				that.getView().setModel(passportModel, "passport");
			}
		});

		var DepJson;
		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var DependentsName = "";
		var depkid = passportDetails.DependentsKaustid.split(".");
		for (var k = 0; k < depkid.length; k++) {
			for (var i = 0; i < DepJson["results"].length; i++) {
				if (DepJson["results"][i].KaustId == depkid[k]) {
					if (DependentsName.length == 0)
						DependentsName = DependentsName + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					else
						DependentsName = DependentsName + ", " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
					i = DepJson["results"].length + 1;
				}
			}
		}
		sap.ui.getCore().byId("idSelectedReq").setText(DependentsName);

		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(passportDetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(passportDetails.CollectionMtd));

		if (passportDetails.DeliveryMtd === "1" || passportDetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}

		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

		sap.ui.getCore().byId("idPassportPickupSet").setVisible(true);
	},
	// Passport pickup - end

	// Job Title Change - Start
	getJobTitleDetails: function (requestId, oSubCode) {
		var JobTitleDetails;
		var that = this;
		var JobModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01", true);
		var optxt = "/JobtitlechangeSet(RequestId='" + requestId + "')";
		JobModel.read(optxt, {
			async: false,
			success: function (oData, response) {
				var dataModel = new sap.ui.model.json.JSONModel();
				dataModel.setData(oData);
				JobTitleDetails = oData;
				that.getView().setModel(dataModel, "jobModel");
				JobModel.read("IqamaprofessionSet('" + JobTitleDetails.JobTitle + "')", null, null, false, function (oData, response) {
					var oDetails = new sap.ui.model.json.JSONModel();
					oDetails.setData(oData);
					that.getView().setModel(oDetails, 'JobDetails');
				});
				sap.ui.getCore().byId("idDC").setSelectedIndex(JobTitleDetails.DegCertificate - 1);
				sap.ui.getCore().byId("idAC").setSelectedIndex(JobTitleDetails.CertAttested - 1);
				sap.ui.getCore().byId("idTC").setSelectedIndex(JobTitleDetails.CertTranslated - 1);
				sap.ui.getCore().byId("idMC").setSelectedIndex(JobTitleDetails.CertMofa - 1);
				if (JobTitleDetails.DegCertificate === "1") {
					sap.ui.getCore().byId("idAC").setVisible(false);
					sap.ui.getCore().byId("idTC").setVisible(false);
					sap.ui.getCore().byId("idMC").setVisible(false);
					sap.ui.getCore().byId("idAClbl").setVisible(false);
					sap.ui.getCore().byId("idTClbl").setVisible(false);
					sap.ui.getCore().byId("idMClbl").setVisible(false);
				} else {
					sap.ui.getCore().byId("idAC").setVisible(true);
					sap.ui.getCore().byId("idTC").setVisible(true);
					sap.ui.getCore().byId("idMC").setVisible(true);
					sap.ui.getCore().byId("idAClbl").setVisible(true);
					sap.ui.getCore().byId("idTClbl").setVisible(true);
					sap.ui.getCore().byId("idMClbl").setVisible(true);
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
				var filereadModel = new sap.ui.model.json.JSONModel({
					attestedDegree: attestedDegree,
					translatedDegree: translatedDegree
				});
				that.getView().setModel(filereadModel, "filereadModel");
			}
		});
		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(JobTitleDetails.DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(JobTitleDetails.CollectionMtd));

		if (JobTitleDetails.DeliveryMtd === "1" || JobTitleDetails.CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}

		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

		sap.ui.getCore().byId("idJobTitle").setVisible(true);
	},
	// Job Title Change - End

	// Family Residency Visa - start
	getFamilyResidencyDetails: function (requestId, oSubCode) {
		var that = this;
		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var str = "GASC_HeaderSet?$filter=RequestId eq '" + requestId + "'&$expand=Headertovisa";
		var odetails;
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
		oModel.read(str, {
			async: false,
			success: function (oData, response) {
				var oDegJson = new sap.ui.model.json.JSONModel();
				oDegJson.setData(oData.results[0]);
				that.getView().setModel(oDegJson, "oDegJson");
				var oVisaJson = new sap.ui.model.json.JSONModel();
				oVisaJson.setData(oData.results[0].Headertovisa.results[0]);
				that.getView().setModel(oVisaJson, "oVisaJson");
				odetails = oData.results[0].Headertovisa.results;
				var oUserModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
				oUserModel.read("UserDetail(KaustID='" + oData.results[0].KaustId + "',UserId='')", null, null, false, function (data) {
					var oReqJson = new sap.ui.model.json.JSONModel();
					oReqJson.setData(data);
					that.getView().setModel(oReqJson, "oReqJson");
					if (data.Nationality === "Saudi Arabian") {
						sap.ui.getCore().byId("idIqamalbl").setValue("Saudi ID");
						sap.ui.getCore().byId("idIqamaval").setValue(data.SaudiID);
					} else {
						sap.ui.getCore().byId("idIqamalbl").setValue("Iqama");
						sap.ui.getCore().byId("idIqamaval").setValue(data.Iqama);
					}
					sap.ui.getCore().byId("idVisaNo").setValue(oData.results[0].VisaNumber);
				});
				for (var k = 0; k < odetails.length; k++) {
					if (odetails[k].Relationship === "Child") {
						kidsTotal.push(odetails[k]);
					}
					if (odetails[k].Relationship === "Spouse") {
						isSpouse.push(odetails[k]);
					}
					if (odetails[k].Religion === 2) {
						oData.results[0].Headertovisa.results[k].ReliName = "Non-Muslim";
					} else {
						oData.results[0].Headertovisa.results[k].ReliName = "Muslim";
					}

					for (var nat = 0; nat < nations.length; nat++) {
						if (odetails[k].Nationality === nations[nat].LAND1) {
							oData.results[0].Headertovisa.results[k].nation = nations[nat].LANDX;
						}
					}
				}
				var familyData = new sap.ui.model.json.JSONModel();
				familyData.setData(oData.results[0].Headertovisa);
				that.getView().setModel(familyData, "frJson");
			}
		});
		var passportForms = that.getFileAttachmentRequestDetails(null, requestId, 3);
		var birthCertificates = that.getFileAttachmentRequestDetails(null, requestId, 13);
		var mrgCertificates = that.getFileAttachmentRequestDetails(null, requestId, 11);
		var hb = sap.ui.getCore().byId("idhb");
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

		var hb1 = sap.ui.getCore().byId("idhb1");
		var kidFiles;
		if (kidsTotal.length > 0) {
			for (var i = 0; i < kidsTotal.length; i++) {
				var hbox = new sap.m.VBox();
				var vb1 = new sap.m.VBox();
				vb1.addStyleClass("destilPartHeaderDSTStyle");
				var kidname = "<strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i].LastName +
					"</strong>";
				if (i > 0) {
					kidname = "<br><br><strong>Child " + (i + 1) + " - " + kidsTotal[i].FirstName + " " + kidsTotal[i].MiddleName + " " + kidsTotal[i].LastName +
						"</strong>";
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
		var filereadModel = new sap.ui.model.json.JSONModel({
			attestedDegree: attestedDegree,
			translatedDegree: translatedDegree
		});
		that.getView().setModel(filereadModel, "filereadModel");

		sap.ui.getCore().byId("idDeliveryType").setSelectedIndex(parseInt(odetails[0].DeliveryMtd));
		sap.ui.getCore().byId("idCollectionType").setSelectedIndex(parseInt(odetails[0].CollectionMtd));

		if (odetails[0].DeliveryMtd === "1" || odetails[0].CollectionMtd === "1") {
			sap.ui.getCore().byId("idUpsForm").setVisible(true);
		} else {
			sap.ui.getCore().byId("idUpsForm").setVisible(false);
		}

		var histModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var histData = "Requestlog?$filter=RequestId eq '" + requestId + "'";
		histModel.read(histData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					historyInfo: oData.results
				});
				that.getView().setModel(data, "histData");
			}
		});

		var commentModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC", true);
		var commentData = "CommentSet?$filter=Request_ID eq '" + requestId + "'";
		commentModel.read(commentData, {
			async: true,
			success: function (oData, response) {
				var data = new sap.ui.model.json.JSONModel();
				data.setData({
					CommentsInfo: oData.results
				});
				that.getView().setModel(data, "commentData");
			}
		});

		sap.ui.getCore().byId("idFamilyResVisa").setVisible(true);
	},
	// Family Residency Visa - End

	// Begin of Sponsorship transfer Staff / Student
	getDSTDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("DSTPrefBody").setVisible(false);
		oView.byId("DSTTracking").setVisible(false);
		oView.byId("DSTReject").setVisible(false);
		var PrefJson;
		var EmpJson;
		var DSTJson;
		var JobJson;
		var DSTAttJson;

		var odstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var dstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		odstReqModel.read(dstfilter, null, null, false, function (data, response) {
			var dstReqModel = new sap.ui.model.json.JSONModel();
			dstReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var odstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var reqtxt = "SponsorshiptransferSet('" + sRequestId + "')";
		odstReqModel.read(reqtxt, null, null, false, function (data, response) {
				var dstReqModel = new sap.ui.model.json.JSONModel();
				dstReqModel.setData(data);
				DSTJson = data;
			},
			function (response) {
				return "";
			});

		var odstPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		odstPrefModel.read(opctxt, null, null, false, function (data, response) {
				var dstPrefModel = new sap.ui.model.json.JSONModel();
				dstPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oJobtitleModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var jobtxt = "IqamaprofessionSet?$orderby=MhnNameLatini%20asc";
		oJobtitleModel.read(jobtxt, null, null, false, function (data, response) {
				var jobtitleModel = new sap.ui.model.json.JSONModel();
				jobtitleModel.setData(data);
				jobtitleModel.setSizeLimit(data.results.length);
				JobJson = data;
			},
			function (response) {
				return "";
			});

		var oExpeditor = DSTJson.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			//      oExpeditor = that.getExpeditorDetails(oExpeditor);
			oView.byId("idDSTExpeditor").setText(oExpeditor);
		}

		// Populate Sponsorship Transfer Details - Staff / Student - Begin
		if (oSubCode == "0413") {
			oView.byId("dst_firstname").setText(DSTJson.CandFirstName);
			oView.byId("dst_middlename").setText(DSTJson.CandMiddleName);
			oView.byId("dst_lastname").setText(DSTJson.CandLastName);
			oView.byId("dst_arfirstname").setText(DSTJson.ArFirstName);
			oView.byId("dst_armiddlename").setText(DSTJson.ArMiddleName);
			oView.byId("dst_arlastname").setText(DSTJson.ArLastName);
			oView.byId("dst_iqama").setText(DSTJson.CanIqamaNo);
			oView.byId("dst_costcenter").setText(DSTJson.Costcenter);
			oView.byId("dst_nation").setText(DSTJson.Nationality);
			oView.byId("dst_religion").setText(DSTJson.Religion);
			oView.byId("dst_currsponsornum").setText(DSTJson.SponsorNumber);
			oView.byId("dst_currsponsorname").setText(DSTJson.SponsorName);
			oView.byId("dst_arcurrsponsorname").setText(DSTJson.SponsorNameAr);
			oView.byId("dst_newsponsornum").setText(DSTJson.NewSponsorNum);
			oView.byId("dst_newsponsorname").setText(DSTJson.NewSponsorName);
			oView.byId("dst_arnewsponsorname").setText(DSTJson.NewSponsorNameAr);

			var dps_Dob = DSTJson.Dob.split("T")[0];
			if(dps_Dob)
			{
				var chdd =  dps_Dob.split("-");
				var ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
				oView.byId("dst_birthdate").setText(ch_dt);
			}
			
			for (var i = 0; i < JobJson.results.length; i++) {
				if (JobJson.results[i].MhnCodeAll == DSTJson.JobTitle) {
					oView.byId("dst_currjobtitle").setText(JobJson.results[i].MhnNameLatini);
					oView.byId("dst_arcurrjobtitle").setText(JobJson.results[i].MhnName);
					i = JobJson.results.length + 2;
				}
			}

			for (var i = 0; i < JobJson.results.length; i++) {
				if (JobJson.results[i].MhnCodeAll == DSTJson.NewJobTitle) {
					oView.byId("dst_newjobtitle").setText(JobJson.results[i].MhnNameLatini);
					oView.byId("dst_arnewjobtitle").setText(JobJson.results[i].MhnName);
					i = JobJson.results.length + 2;
				}
			}

			if (DSTJson.JobChange == "X") {
				oView.byId("dst_jobchange").setText("Yes");
				oView.byId("dst_vbnewjob").setVisible(true);
				oView.byId("dst_vbennewjob").setVisible(true);
				oView.byId("dst_vbarnewjob").setVisible(true);
			} else {
				oView.byId("dst_jobchange").setText("No");
				oView.byId("dst_vbnewjob").setVisible(false);
				oView.byId("dst_vbennewjob").setVisible(false);
				oView.byId("dst_vbarnewjob").setVisible(false);
			}

			var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					var attachModel = new sap.ui.model.json.JSONModel();
					attachModel.setData(data);
					DSTAttJson = data;
				},
				function (response) {
					return "";
				});

			if (DSTAttJson.results.length > 0) {
				for (var i = 0; i < DSTAttJson.results.length; i++) {
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "RELEASE_LETTER_KAUST") {
						oView.byId("idDSTatt1").setText("Release Letter to KAUST");
						oView.byId("idDSTatt1").setHref(DSTAttJson.results[i].URL);
					}
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
						oView.byId("idDSTatt2").setText("NOL to Passport");
						oView.byId("idDSTatt2").setHref(DSTAttJson.results[i].URL);
					}
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "IQAMA") {
						oView.byId("idDSTatt3").setText("Iqama");
						oView.byId("idDSTatt3").setHref(DSTAttJson.results[i].URL);
					}
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "PASSPORT") {
						oView.byId("idDSTatt4").setText("Passport");
						oView.byId("idDSTatt4").setHref(DSTAttJson.results[i].URL);
					}
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "ATTESTED_DEGREE") {
						oView.byId("idDSTatt5").setText("Attested Degree");
						oView.byId("idDSTatt5").setHref(DSTAttJson.results[i].URL);
					}
					if (DSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "TRANSLATED_DEGREE") {
						oView.byId("idDSTatt6").setText("Translated Degree");
						oView.byId("idDSTatt6").setHref(DSTAttJson.results[i].URL);
					}
				}
			}

			if (DSTJson.Status == "011") {
				oView.byId("DSTReject").setVisible(true);
				oView.byId("iddstfincomments").setText(DSTJson.Fincomments);
			}

			oView.byId("idDSTCollection").setSelectedIndex(0);
			if (DSTJson.CollectionMtd != null && DSTJson.CollectionMtd == "1") {
				oView.byId("idDSTCollection").setSelectedIndex(1);
				oView.byId("DSTPrefBody").setVisible(true);
				oView.byId("DSTTracking").setVisible(true);
			}

			oView.byId("idDSTDelivery").setSelectedIndex(0);
			if (DSTJson.DeliveryMtd != null && DSTJson.DeliveryMtd == "1") {
				oView.byId("idDSTDelivery").setSelectedIndex(1);
				oView.byId("DSTPrefBody").setVisible(true);
				oView.byId("DSTTracking").setVisible(true);
			}

			oView.byId("dstcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
			oView.byId("dstcpdkaustid").setText(PrefJson.KaustID);
			oView.byId("dstcpdmobile").setText(PrefJson.Mobile);
			oView.byId("dstcpdbldno").setText(PrefJson.BuildingNo);
			oView.byId("dstcpdlevel").setText(PrefJson.levelb);
			oView.byId("dstcpdbldname").setText(PrefJson.BuildingName);
			oView.byId("idDSTTrackingNum").setText(DSTJson.TrackingId);
			// Populate DST Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryDST");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End       
		}
	}, // end of Sponsorship transfer Staff / Student

	// Begin of Sponsorship transfer - Spouse
	getSSTDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("SSTPrefBody").setVisible(false);
		oView.byId("SSTTracking").setVisible(false);
		oView.byId("SSTReject").setVisible(false);
		var PrefJson;
		var EmpJson;
		var NatJson;
		var SSTJson;
		var SSTAttJson;

		var osstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var sstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		osstReqModel.read(sstfilter, null, null, false, function (data, response) {
			var sstReqModel = new sap.ui.model.json.JSONModel();
			sstReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var osstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		var reqtxt = "SponsorshiptransferspouseSet('" + sRequestId + "')";
		osstReqModel.read(reqtxt, null, null, false, function (data, response) {
				var sstReqModel = new sap.ui.model.json.JSONModel();
				sstReqModel.setData(data);
				SSTJson = data;
			},
			function (response) {
				return "";
			});

		var osstPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		osstPrefModel.read(opctxt, null, null, false, function (data, response) {
				var sstPrefModel = new sap.ui.model.json.JSONModel();
				sstPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oNationModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRVTS0001_COUNTRY_LIST/");
		oNationModel.read("COUNTRY", null, null, false, function (data, response) {
				var nationModel = new sap.ui.model.json.JSONModel();
				nationModel.setData(data);
				nationModel.setSizeLimit(data.results.length);
				sap.ui.getCore().setModel(nationModel, 'NationDetails');
				NatJson = data;
			},
			function (response) {
				return "";
			});

		var oExpeditor = SSTJson.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			//      oExpeditor = that.getExpeditorDetails(oExpeditor);
			oView.byId("idSSTExpeditor").setText(oExpeditor);
		}

		// Populate Sponsorship Transfer (Spouse) Details - Begin
		if (oSubCode == "0415") {
			oView.byId("sst_firstname").setText(SSTJson.FirstName);
			oView.byId("sst_middlename").setText(SSTJson.MiddleName);
			oView.byId("sst_lastname").setText(SSTJson.LastName);
			oView.byId("sst_arfirstname").setText(SSTJson.ArFirstName);
			oView.byId("sst_armiddlename").setText(SSTJson.ArMiddleName);
			oView.byId("sst_arlastname").setText(SSTJson.ArLastName);
			oView.byId("sst_iqama").setText(SSTJson.IqamaNo);
			oView.byId("sst_nation").setText(SSTJson.Nationality);
			oView.byId("sst_gender").setText(SSTJson.Gender);
			oView.byId("sst_religion").setText(SSTJson.Religion);
			oView.byId("sst_currsponsornum").setText(SSTJson.SponsorNumber);
			oView.byId("sst_currsponsorname").setText(SSTJson.SponsorName);
			oView.byId("sst_arcurrsponsorname").setText(SSTJson.SponsorNameAr);
			oView.byId("sst_jobtitle").setText(SSTJson.JobTitle);

			var sps_Dob = SSTJson.Dob.split("T")[0];
			if(sps_Dob)
			{
				var chdd =  sps_Dob.split("-");
				var ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
				oView.byId("sst_birthdate").setText(ch_dt);
			}
			
			if(SSTJson.SponKaustId.length > 0)
			{
				var NsdJson;
				var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
				oModelGasc.read("UserDetail(KaustID='"+SSTJson.SponKaustId+"',UserId='')", null, null, false, function(data, response) {
					NsdJson = data;
				}, 
				function(response) 
				{
					return "";
				});
				
				oView.byId("sst_newsponsornum").setText(NsdJson.Iqama);
				oView.byId("sst_newsponsorname").setText(NsdJson.FirstName + " " + NsdJson.MiddleName + " " + NsdJson.LastName);
				oView.byId("sst_arnewsponsorname").setText(NsdJson.ArabicFirstName + " " + NsdJson.ArabicMiddleName + " " + NsdJson.ArabicLastName);
			}

			oView.byId("sst_certattested").setText("No");
			oView.byId("sst_certtranslated").setText("No");
			oView.byId("sst_certmofa").setText("No");
			oView.byId("SSTMCDetails").setVisible(false);

			oView.byId("sst_transferfee").setText("SAR " + SSTJson.Amount);
			if (SSTJson.Transfercount == "0")
				oView.byId("sst_transfertype").setText("First");
			if (SSTJson.Transfercount == "1")
				oView.byId("sst_transfertype").setText("Second");
			if (SSTJson.Transfercount == "2")
				oView.byId("sst_transfertype").setText("Third & Above");

			oView.byId("sst_sponsortype").setText("No");
			if (SSTJson.SponsorType == "X")
				oView.byId("sst_sponsortype").setText("Yes");

			oView.byId("sst_kaustid").setText(SSTJson.KaustId);
			oView.byId("sps_kaustid").setVisible(false);
			oView.byId("sst_kaustflg").setText("No");
			if (SSTJson.KaustId.length > 0) {
				oView.byId("sps_kaustid").setVisible(true);
				oView.byId("sst_kaustflg").setText("Yes");
			}

			if (SSTJson.MarCertificate == "") {
				oView.byId("sst_marcertificate").setText("No");
				//				oView.byId("SSTMCDetails").setVisible(true);
				if (SSTJson.CertAttested == "X")
					oView.byId("sst_certattested").setText("Yes");
				if (SSTJson.CertTranslated == "X")
					oView.byId("sst_certtranslated").setText("Yes");
				if (SSTJson.CertMofa == "X")
					oView.byId("sst_certmofa").setText("Yes");
			} else {
				oView.byId("sst_marcertificate").setText("Yes");
			}

			var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					if (data.results.length > 0) {
						oView.byId("idSSTatt1").setText("Iqama");
						oView.byId("idSSTatt1").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});

			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					if (data.results.length > 0) {
						oView.byId("idSSTatt2").setText("Passport");
						oView.byId("idSSTatt2").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});

			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					if (data.results.length > 0) {
						oView.byId("idSSTatt3").setText("Saudi Visa");
						oView.byId("idSSTatt3").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});

			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + SSTJson.KaustId +
				"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '9'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					if (data.results.length > 0) {
						oView.byId("idSSTatt5").setText("Marriage Certificate");
						oView.byId("idSSTatt5").setHref(data.results[0].URL);
					}
				},
				function (response) {
					return "";
				});

			var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
				"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
			oAttachModel.read(attxt, null, null, false, function (data, response) {
					var attachModel = new sap.ui.model.json.JSONModel();
					attachModel.setData(data);
					SSTAttJson = data;
				},
				function (response) {
					return "";
				});

			if (SSTAttJson.results.length > 0) {
				for (var i = 0; i < SSTAttJson.results.length; i++) {
					if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
						oView.byId("idSSTatt4").setText("NOL to Passport");
						oView.byId("idSSTatt4").setHref(SSTAttJson.results[i].URL);
					}
					if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "ATTESTED_MARRIAGE") {
						oView.byId("idSSTatt6").setText("Attested Marriage Certificate");
						oView.byId("idSSTatt6").setHref(SSTAttJson.results[i].URL);
					}
					if (SSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "TRANSLATED_MARRIAGE") {
						oView.byId("idSSTatt7").setText("Translated Marriage Certificate");
						oView.byId("idSSTatt7").setHref(SSTAttJson.results[i].URL);
					}
				}
			}

			if (SSTJson.Status == "011") {
				oView.byId("SSTReject").setVisible(true);
				oView.byId("idsstfincomments").setText(SSTJson.Fincomments);
			}

			oView.byId("idSSTCollection").setSelectedIndex(0);
			if (SSTJson.CollectionMtd != null && SSTJson.CollectionMtd == "1") {
				oView.byId("idSSTCollection").setSelectedIndex(1);
				oView.byId("SSTPrefBody").setVisible(true);
				oView.byId("SSTTracking").setVisible(true);
			}

			oView.byId("idSSTDelivery").setSelectedIndex(0);
			if (SSTJson.DeliveryMtd != null && SSTJson.DeliveryMtd == "1") {
				oView.byId("idSSTDelivery").setSelectedIndex(1);
				oView.byId("SSTPrefBody").setVisible(true);
				oView.byId("SSTTracking").setVisible(true);
			}

			oView.byId("sstcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
			oView.byId("sstcpdkaustid").setText(PrefJson.KaustID);
			oView.byId("sstcpdmobile").setText(PrefJson.Mobile);
			oView.byId("sstcpdbldno").setText(PrefJson.BuildingNo);
			oView.byId("sstcpdlevel").setText(PrefJson.levelb);
			oView.byId("sstcpdbldname").setText(PrefJson.BuildingName);
			oView.byId("idSSTTrackingNum").setText(SSTJson.TrackingId);
			// Populate SST Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistorySST");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End       
		}
	}, // end of Sponsorship transfer- Spouse

	// Start of Sponsorship transfer- Child
	getCSTDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("CSTPrefBody").setVisible(false);
		oView.byId("CSTTracking").setVisible(false);
		oView.byId("CSTReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var CSTJson;
		var DepJson;
		var CSTHead;
		var CSTAttJson;

		var ocstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		ocstReqModel.read(cstfilter, null, null, false, function (data, response) {
			var cstReqModel = new sap.ui.model.json.JSONModel();
			cstReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var ocstPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		ocstPrefModel.read(opctxt, null, null, false, function (data, response) {
				var cstPrefModel = new sap.ui.model.json.JSONModel();
				cstPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents?$filter=KaustId eq '" + EmpJson.KaustId + "'", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				that.getView().setModel(oDepDetailsModel, "DepDetails");
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var oChildModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oChildModel.read("GASC_HeaderSet?$filter=RequestId eq '" + sRequestId + "'&$expand=Headertochild", null, null, false, function (data,
				response) {
				var childData = new sap.ui.model.json.JSONModel();
				childData.setData(data.results[0].Headertochild);
				that.getView().setModel(childData, "cstJson");
				sap.ui.getCore().setModel(childData, "cstJson");
				CSTJson = data.results[0].Headertochild;
				CSTHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = CSTHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("idCSTExpeditor").setText(oExpeditor);
		}

		// Populate Sponsorship Transfer (Child) Details - Begin
		if (oSubCode == "0416") {
			if (CSTJson.results.length > 0) {
				oView.byId("cst_certattested").setText("No");
				oView.byId("cst_certtranslated").setText("No");
				oView.byId("cst_certmofa").setText("No");
				oView.byId("CSTBCDetails").setVisible(false);

				oView.byId("cst_sponsortype").setText("No");
				if (CSTJson.results[0].SponsorType == "X")
					oView.byId("cst_sponsortype").setText("Yes");

				if (CSTJson.results[0].BirthCertificate == "") {
					oView.byId("cst_birthcertificate").setText("No");
					//					oView.byId("CSTBCDetails").setVisible(true);
					if (CSTJson.results[0].CertAttested == "X")
						oView.byId("cst_certattested").setText("Yes");
					if (CSTJson.results[0].CertTranslated == "X")
						oView.byId("cst_certtranslated").setText("Yes");
					if (CSTJson.results[0].CertMofa == "X")
						oView.byId("cst_certmofa").setText("Yes");
				} else {
					oView.byId("cst_birthcertificate").setText("Yes");
				}

				oView.byId("nsp_kaust").setVisible(false);
				if (CSTJson.results[0].SponsorType == "X")
					oView.byId("nsp_kaust").setVisible(true);

				oView.byId("nsp_kaustid").setText(CSTJson.results[0].SponKaustId);
				oView.byId("nsp_fname").setText(CSTJson.results[0].SponFirstName);
				oView.byId("nsp_mname").setText(CSTJson.results[0].SponMiddleName);
				oView.byId("nsp_lname").setText(CSTJson.results[0].SponLastName);
				oView.byId("nsp_arfname").setText(CSTJson.results[0].SponArFirstName);
				oView.byId("nsp_armname").setText(CSTJson.results[0].SponArMiddleName);
				oView.byId("nsp_arlname").setText(CSTJson.results[0].SponArLastName);
				oView.byId("nsp_iqama").setText(CSTJson.results[0].SponIqamaNo);
				oView.byId("nsp_nation").setText(CSTJson.results[0].SponNationality);

				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						if (data.results.length > 0 && data.results[0].URL.length > 0) {
							oView.byId("idCSTatt1").setText("Iqama - " + EmpJson.Fname + " " + EmpJson.Lname);
							oView.byId("idCSTatt1").setHref(data.results[0].URL);
						}
					},
					function (response) {
						return "";
					});

				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						if (data.results.length > 0 && data.results[0].URL.length > 0) {
							oView.byId("idCSTatt2").setText("Saudi Visa Page - " + EmpJson.Fname + " " + EmpJson.Lname);
							oView.byId("idCSTatt2").setHref(data.results[0].URL);
						}
					},
					function (response) {
						return "";
					});

				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						if (data.results.length > 0 && data.results[0].URL.length > 0) {
							oView.byId("idCSTatt3").setText("Passport - " + EmpJson.Fname + " " + EmpJson.Lname);
							oView.byId("idCSTatt3").setHref(data.results[0].URL);
						}
					},
					function (response) {
						return "";
					});

				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						CSTAttJson = data;
					},
					function (response) {
						return "";
					});

				if (CSTAttJson.results.length > 0) {
					for (var i = 0; i < CSTAttJson.results.length; i++) {
						if (CSTAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "NOL_PASSPORT") {
							oView.byId("idCSTatt4").setText("NOL to Passport");
							oView.byId("idCSTatt4").setHref(CSTAttJson.results[i].URL);
						}

					}
				}

				for (var j = 0; j < CSTJson.results.length; j++) {
					for (var i = 1; i < DepJson["results"].length; i++) {
						if (DepJson["results"][i].KaustId == CSTJson.results[j].KaustId) {
							//		    				oView.byId("CSTRIDetails").getItems()[j].getCells()[4].mProperties.text=DepJson["results"][i].age;
							oView.getModel("cstJson").getProperty("/results")[j].Age = DepJson["results"][i].age;
							var chd_birthdate = CSTJson.results[j].Dob;
							if(chd_birthdate != null)
							{
								var chd_Dob = chd_birthdate.split("T")[0];
								if(chd_Dob)
								{
									var chdd =  chd_Dob.split("-");
									ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
									oView.getModel("cstJson").getProperty("/results")[j].Dob = ch_dt;
								}
							}
							//		    				for (var k = 0; k < CSTAttJson.results.length; k++) 
							//		    				{
							//		    					if(CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[0] == "ATTESTEDBIRTH")
							//		    					{
							//	    			    			if(DepJson["results"][i].KaustId == CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[1].split(".")[0])
							//	    							{
							////	    			    				oView.byId("CSTRIDetails").getItems()[j].getCells()[6].mProperties.href=CSTAttJson.results[k].URL;
							//	    			    				oView.getModel("cstJson").getProperty("/results")[j].AttLink=CSTAttJson.results[k].URL;
							//	    							}
							//		    					}
							//		    					if(CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[0] == "TRANSLATEDBIRTH")
							//		    					{
							//	    			    			if(DepJson["results"][i].KaustId == CSTAttJson.results[k].FILENAME.toUpperCase().split("_")[1].split(".")[0])
							//	    							{
							////	    			    				oView.byId("CSTRIDetails").getItems()[j].getCells()[7].mProperties.href=CSTAttJson.results[k].URL;
							//	    			    				oView.getModel("cstJson").getProperty("/results")[j].TrnLink=CSTAttJson.results[k].URL;
							//	    							}
							//		    					}
							//		    				}
							i = DepJson["results"].length + 1;
						}
					}
				}
			}

			if (CSTHead.Status == "011") {
				oView.byId("CSTReject").setVisible(true);
				oView.byId("idcstfincomments").setText(CSTHead.Fincomments);
			}

			oView.byId("idCSTCollection").setSelectedIndex(0);
			if (CSTJson.results[0].CollectionMtd != null && CSTJson.results[0].CollectionMtd == "1") {
				oView.byId("idCSTCollection").setSelectedIndex(1);
				oView.byId("CSTPrefBody").setVisible(true);
				oView.byId("CSTTracking").setVisible(true);
			}

			oView.byId("idCSTDelivery").setSelectedIndex(0);
			if (CSTJson.results[0].DeliveryMtd != null && CSTJson.results[0].DeliveryMtd == "1") {
				oView.byId("idCSTDelivery").setSelectedIndex(1);
				oView.byId("CSTPrefBody").setVisible(true);
				oView.byId("CSTTracking").setVisible(true);
			}

			oView.byId("cstcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
			oView.byId("cstcpdkaustid").setText(PrefJson.KaustID);
			oView.byId("cstcpdmobile").setText(PrefJson.Mobile);
			oView.byId("cstcpdbldno").setText(PrefJson.BuildingNo);
			oView.byId("cstcpdlevel").setText(PrefJson.levelb);
			oView.byId("cstcpdbldname").setText(PrefJson.BuildingName);
			oView.byId("idCSTTrackingNum").setText(CSTHead.TrackingId);
			// Populate CST Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryCST");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Sponsorship transfer- Child 

	// Start of Iqama Cancellation (ENR)
	getIQMCANDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("IQMCANPrefBody").setVisible(false);
		oView.byId("IQMCANTracking").setVisible(false);
		oView.byId("IQMCNCLReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var IQMCANJson;
		var DepJson;
		var IQMCANHead;
		var IQMCANAttJson;

		var ocstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		ocstReqModel.read(cstfilter, null, null, false, function (data, response) {
			var cstReqModel = new sap.ui.model.json.JSONModel();
			cstReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var ocstPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		ocstPrefModel.read(opctxt, null, null, false, function (data, response) {
				var cstPrefModel = new sap.ui.model.json.JSONModel();
				cstPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents?$filter=KaustId eq '" + EmpJson.KaustId + "'", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				that.getView().setModel(oDepDetailsModel, "DepDetails");
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var oIqamaModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oIqamaModel.read("GASC_HeaderSet?$filter=RequestId eq '" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var iqamaData = new sap.ui.model.json.JSONModel();
				iqamaData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(iqamaData, "iqmcanJson");
				sap.ui.getCore().setModel(iqamaData, "iqmcanJson");
				IQMCANJson = data.results[0].Headertoiqama;
				IQMCANHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = IQMCANHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("idIQMCANExpeditor").setText(oExpeditor);
		}

		// Populate Iqama Cancel Details - Begin
		if (oSubCode == "0404" || oSubCode == "0408") {
			if (IQMCANJson.results.length > 0) {
				for (var j = 0; j < IQMCANJson.results.length; j++) {
					for (var i = 0; i < DepJson["results"].length; i++) {
						if (DepJson["results"][i].KaustId == IQMCANJson.results[j].KaustId) 
						{
							oView.getModel("iqmcanJson").getProperty("/results")[j].Relation = IQMCANJson.results[j].Relationship;
							if(IQMCANJson.results[j].Relationship.length == 0)
								oView.getModel("iqmcanJson").getProperty("/results")[j].Relation = "Self";
							
//							oView.getModel("iqmcanJson").getProperty("/results")[j].Location = "Outside KSA";
//							if(IQMCANJson.results[j].InsideKingdomFlag == "X")
//								oView.getModel("iqmcanJson").getProperty("/results")[j].Location = "Inside KSA";
							
							var iqmcan_visadate = IQMCANJson.results[j].VisaExpiryDate;
							if(iqmcan_visadate != null)
							{
								var chd_Dob = iqmcan_visadate.split("T")[0];
								if(chd_Dob)
								{
									var chdd =  chd_Dob.split("-");
									ch_dt = chdd[2] + "." + chdd[1] + "." + chdd[0];
									oView.getModel("iqmcanJson").getProperty("/results")[j].VisaDate = ch_dt;
								}
							}
							
							var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
							var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + IQMCANJson.results[j].KaustId +
								"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
							oAttachModel.read(attxt1, null, null, false, function (data, response) {
								oView.getModel("iqmcanJson").getProperty("/results")[j].IqamaLink = data.results[0].URL;
							},
							function (response) {
								return "";
							});

							i = DepJson["results"].length + 1;
						}
					}
				}
			}

			if (IQMCANHead.Status == "011") {
				oView.byId("IQMCNCLReject").setVisible(true);
				oView.byId("idiqmcnclfincomments").setText(IQMCANHead.Fincomments);
			}

			oView.byId("idIQMCANCollection").setSelectedIndex(0);
			if (IQMCANJson.results[0].CollectionMtd != null && IQMCANJson.results[0].CollectionMtd == "1") {
				oView.byId("idIQMCANCollection").setSelectedIndex(1);
				oView.byId("IQMCANPrefBody").setVisible(true);
				oView.byId("IQMCANTracking").setVisible(true);
			}

			oView.byId("idIQMCANDelivery").setSelectedIndex(0);
			if (IQMCANJson.results[0].DeliveryMtd != null && IQMCANJson.results[0].DeliveryMtd == "1") {
				oView.byId("idIQMCANDelivery").setSelectedIndex(1);
				oView.byId("IQMCANPrefBody").setVisible(true);
				oView.byId("IQMCANTracking").setVisible(true);
			}

			oView.byId("iqmcancpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
			oView.byId("iqmcancpdkaustid").setText(PrefJson.KaustID);
			oView.byId("iqmcancpdmobile").setText(PrefJson.Mobile);
			oView.byId("iqmcancpdbldno").setText(PrefJson.BuildingNo);
			oView.byId("iqmcancpdlevel").setText(PrefJson.levelb);
			oView.byId("iqmcancpdbldname").setText(PrefJson.BuildingName);
			oView.byId("idIQMCANTrackingNum").setText(IQMCANHead.TrackingId);
			// Populate Iqama Cancel Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryIQMCAN");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Iqama Cancellation (ENR) 

	// Start of Iqama Replacement (LDR)
	getIQMLDRDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("IQMLDRPrefBody").setVisible(false);
		oView.byId("IQMLDRTracking").setVisible(false);
		oView.byId("IQMLDRReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var IQMLDRJson;
		var DepJson;
		var IQMLDRHead;
		var IQMLDRAttJson;

		var ocstReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		ocstReqModel.read(cstfilter, null, null, false, function (data, response) {
			var cstReqModel = new sap.ui.model.json.JSONModel();
			cstReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var ocstPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		ocstPrefModel.read(opctxt, null, null, false, function (data, response) {
				var cstPrefModel = new sap.ui.model.json.JSONModel();
				cstPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oDependentsModel.read("UserDependents?$filter=KaustId eq '" + EmpJson.KaustId + "'", null, null, false, function (data, response) {
				var oDepDetailsModel = new sap.ui.model.json.JSONModel();
				oDepDetailsModel.setData(data);
				that.getView().setModel(oDepDetailsModel, "DepDetails");
				sap.ui.getCore().setModel(oDepDetailsModel, "DepDetails");
				DepJson = data;
			},
			function (response) {
				return "";
			});

		var oIqamaModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oIqamaModel.read("GASC_HeaderSet?$filter=RequestId eq '" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var iqamaData = new sap.ui.model.json.JSONModel();
				iqamaData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(iqamaData, "iqmldrJson");
				sap.ui.getCore().setModel(iqamaData, "iqmldrJson");
				IQMLDRJson = data.results[0].Headertoiqama;
				IQMLDRHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = IQMLDRHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("idIQMLDRExpeditor").setText(oExpeditor);
		}

		// Populate Iqama Replacement Details - Begin
		if (oSubCode == "0410" || oSubCode == "9410") {
			if (IQMLDRJson.results.length > 0) {
				oView.byId("iqmldr_gareportflag").setText("No");
				if(IQMLDRJson.results[0].GaCenterReportFlag == "X")
					oView.byId("iqmldr_gareportflag").setText("Yes");
				
				oView.byId("iqmldr_ilp").setVisible(true);
				if(IQMLDRJson.results[0].IqamaLostPlaceFlag == "L")
				{
					oView.byId("iqmldr_lstdmgflag").setText("Lost");
					oView.byId("iqmldr_ilp").setVisible(true);
				}
				else if(IQMLDRJson.results[0].IqamaLostPlaceFlag == "D")
					oView.byId("iqmldr_lstdmgflag").setText("Damaged");
				
				oView.byId("iqmldr_inkflag").setText("Outside KSA");
				if(IQMLDRJson.results[0].InsideKingdomFlag == "X")
					oView.byId("iqmldr_inkflag").setText("Inside KSA");
				
				if(IQMLDRJson.results[0].RequestTypeFlag == "S")
					oView.byId("iqmldr_reqtypeflag").setText("Self");
				else if(IQMLDRJson.results[0].RequestTypeFlag == "D")
					oView.byId("iqmldr_reqtypeflag").setText("Dependents");
				else if(IQMLDRJson.results[0].RequestTypeFlag == "B")
					oView.byId("iqmldr_reqtypeflag").setText("Both");

				for (var j = 0; j < IQMLDRJson.results.length; j++) {
					for (var i = 0; i < DepJson["results"].length; i++) {
						if (DepJson["results"][i].KaustId == IQMLDRJson.results[j].KaustId) 
						{
							var oVboxIQMLDR = oView.byId("iqmldr_attach");
							oView.getModel("iqmldrJson").getProperty("/results")[j].Relation = IQMLDRJson.results[j].Relationship;
							if(IQMLDRJson.results[j].Relationship.length == 0)
								oView.getModel("iqmldrJson").getProperty("/results")[j].Relation = "Self";
							
							var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

							var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + IQMLDRJson.results[j].KaustId +
								"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '3'";
							oAttachModel.read(attxt1, null, null, false, function (data, response) {
								var oHboxIQMLDR = new sap.m.FlexBox({height:"1.5rem" , alignitems:"flex-end", wrap: sap.m.FlexWrap.Wrap,direction: sap.m.FlexDirection.Column,backgroundDesign: sap.m.BackgroundDesign.Transparent, items: []});
						    	var lnktxt = "Iqama - " + DepJson["results"][i].KaustId + " - " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
								oHboxIQMLDR.addItem(new sap.m.Link({text:lnktxt, href:data.results[0].URL, emphasized: true}));
						    	oVboxIQMLDR.addItem(oHboxIQMLDR);
							},
							function (response) {
								return "";
							});

							var attxt2 = "FileRead?$filter=UNIQUE_ID eq '" + IQMLDRJson.results[j].KaustId +
								"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '1'";
							oAttachModel.read(attxt2, null, null, false, function (data, response) {
								var oHboxIQMLDR = new sap.m.FlexBox({height:"1.5rem", alignitems:"flex-end", wrap: sap.m.FlexWrap.Wrap,direction: sap.m.FlexDirection.Column,backgroundDesign: sap.m.BackgroundDesign.Transparent, items: []});
						    	var lnktxt = "Passport - " + DepJson["results"][i].KaustId + " - " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
								oHboxIQMLDR.addItem(new sap.m.Link({text:lnktxt, href:data.results[0].URL, emphasized: true}));
						    	oVboxIQMLDR.addItem(oHboxIQMLDR);
							},
							function (response) {
								return "";
							});

							var attxt3 = "FileRead?$filter=UNIQUE_ID eq '" + IQMLDRJson.results[j].KaustId +
								"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '5'";
							oAttachModel.read(attxt3, null, null, false, function (data, response) {
								var oHboxIQMLDR = new sap.m.FlexBox({height:"1.5rem", alignitems:"flex-end", wrap: sap.m.FlexWrap.Wrap,direction: sap.m.FlexDirection.Column,backgroundDesign: sap.m.BackgroundDesign.Transparent, items: []});
						    	var lnktxt = "Saudi Visa - " + DepJson["results"][i].KaustId + " - " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
								oHboxIQMLDR.addItem(new sap.m.Link({text:lnktxt, href:data.results[0].URL, emphasized: true}));
						    	oVboxIQMLDR.addItem(oHboxIQMLDR);
							},
							function (response) {
								return "";
							});
							
							if(IQMLDRJson.results[0].RequestTypeFlag == "S" || IQMLDRJson.results[0].RequestTypeFlag == "B")
							{
								var attxt4 = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
									"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
								oAttachModel.read(attxt4, null, null, false, function (data, response) {
									var oHboxIQMLDR = new sap.m.FlexBox({height:"1.5rem", alignitems:"flex-end", wrap: sap.m.FlexWrap.Wrap,direction: sap.m.FlexDirection.Column,backgroundDesign: sap.m.BackgroundDesign.Transparent, items: []});
							    	var lnktxt = "Payment Receipt - " + DepJson["results"][i].KaustId + " - " + DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
									oHboxIQMLDR.addItem(new sap.m.Link({text:lnktxt, href:data.results[0].URL, emphasized: true}));
							    	oVboxIQMLDR.addItem(oHboxIQMLDR);
								},
								function (response) {
									return "";
								});
							}
					    	oVboxIQMLDR.addItem(new sap.m.FlexBox({height:"1rem", alignitems:"flex-end", wrap: sap.m.FlexWrap.Wrap,direction: sap.m.FlexDirection.Column,backgroundDesign: sap.m.BackgroundDesign.Transparent, items: []}));
							i = DepJson["results"].length + 1;
						}
					}
				}
			}

			if (IQMLDRHead.Status == "011") {
				oView.byId("IQMLDRReject").setVisible(true);
				oView.byId("idiqmldrfincomments").setText(IQMLDRHead.Fincomments);
			}

			oView.byId("LDR_Collec").setVisible(false);
			if(IQMLDRJson.results[0].IqamaLostPlaceFlag == "D")
			{
				oView.byId("LDR_Collec").setVisible(true);
				oView.byId("idIQMLDRCollection").setSelectedIndex(0);
				if (IQMLDRJson.results[0].CollectionMtd != null && IQMLDRJson.results[0].CollectionMtd == "1") {
					oView.byId("idIQMLDRCollection").setSelectedIndex(1);
					oView.byId("IQMLDRPrefBody").setVisible(true);
					oView.byId("IQMLDRTracking").setVisible(true);
				}
			}
			
			oView.byId("idIQMLDRDelivery").setSelectedIndex(0);
			if (IQMLDRJson.results[0].DeliveryMtd != null && IQMLDRJson.results[0].DeliveryMtd == "1") {
				oView.byId("idIQMLDRDelivery").setSelectedIndex(1);
				oView.byId("IQMLDRPrefBody").setVisible(true);
				oView.byId("IQMLDRTracking").setVisible(true);
			}

			oView.byId("iqmldrcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
			oView.byId("iqmldrcpdkaustid").setText(PrefJson.KaustID);
			oView.byId("iqmldrcpdmobile").setText(PrefJson.Mobile);
			oView.byId("iqmldrcpdbldno").setText(PrefJson.BuildingNo);
			oView.byId("iqmldrcpdlevel").setText(PrefJson.levelb);
			oView.byId("iqmldrcpdbldname").setText(PrefJson.BuildingName);
			oView.byId("idIQMLDRTrackingNum").setText(IQMLDRHead.TrackingId);
			// Populate Iqama replacement Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryIQMLDR");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Iqama Replacement (LDR) 
	
	// Start of Iqama Issuance
	getIQMISSDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("IQMISSPrefBody").setVisible(false);
		oView.byId("IQMISSTracking").setVisible(false);
		oView.byId("IQMISSReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var IQMISSJson;
		var IQMISSHead;
		var IQMISSAttJson;

		var oiqmissReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		oiqmissReqModel.read(cstfilter, null, null, false, function (data, response) {
			var iqmissReqModel = new sap.ui.model.json.JSONModel();
			iqmissReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var oiqmissPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		oiqmissPrefModel.read(opctxt, null, null, false, function (data, response) {
				var iqmissPrefModel = new sap.ui.model.json.JSONModel();
				iqmissPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oIqmIssModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oIqmIssModel.read("GASC_HeaderSet?$filter=RequestId eq '" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var iqmissData = new sap.ui.model.json.JSONModel();
				iqmissData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(iqmissData, "iqmissJson");
				sap.ui.getCore().setModel(iqmissData, "iqmissJson");
				IQMISSJson = data.results[0].Headertoiqama;
				IQMISSHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = IQMISSHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("idIQMISSExpeditor").setText(oExpeditor);
		}

		// Populate Iqama Issuance Details - Begin
		if (oSubCode == "0103" || oSubCode == "9103") {
			if (IQMISSJson.results.length > 0) {
				oView.byId("iqmiss_kaustid").setText(IQMISSJson.results[0].KaustId);
				oView.byId("iqmiss_fname").setText(IQMISSJson.results[0].FirstName);
				oView.byId("iqmiss_mname").setText(IQMISSJson.results[0].MiddleName);
				oView.byId("iqmiss_lname").setText(IQMISSJson.results[0].LastName);
				oView.byId("iqmiss_arfname").setText(IQMISSJson.results[0].ArFirstName);
				oView.byId("iqmiss_armname").setText(IQMISSJson.results[0].ArMidName);
				oView.byId("iqmiss_arlname").setText(IQMISSJson.results[0].ArLastName);
				oView.byId("iqmiss_nation").setText(IQMISSJson.results[0].Nationality);
				oView.byId("iqmiss_gender").setText(IQMISSJson.results[0].Gender);
				oView.byId("iqmiss_bordernum").setText(IQMISSJson.results[0].BorderNo);
				oView.byId("iqmiss_costcenter").setText(IQMISSJson.results[0].CostCenter);
				oView.byId("iqmiss_wbs").setText(IQMISSHead.Wbs);
				
				oView.byId("iqmiss_medtst").setText("No");
				if (IQMISSJson.results[0].MedicalTestFlag == "X")
					oView.byId("iqmiss_medtst").setText("Yes");

				if (IQMISSHead.IqamaDuration == "1")
					oView.byId("iqmiss_duration").setText("1 Year");
				else if (IQMISSHead.IqamaDuration == "2")
					oView.byId("iqmiss_duration").setText("2 Years");

				// Populate Attachment Details - Begin
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						IQMISSAttJson = data;
					},
					function (response) {
						return "";
					});

				if (IQMISSAttJson.results.length > 0) {
					for (var i = 0; i < IQMISSAttJson.results.length; i++) {
						if (IQMISSAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "PASSPORT") {
							oView.byId("idIQMISSatt1").setText("Passport");
							oView.byId("idIQMISSatt1").setHref(IQMISSAttJson.results[i].URL);
						}
						if (IQMISSAttJson.results[i].FILENAME.toUpperCase().split(".")[0] == "SAUDI_VISA") {
							oView.byId("idIQMISSatt2").setText("Saudi Visa");
							oView.byId("idIQMISSatt2").setHref(IQMISSAttJson.results[i].URL);
						}
					}
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (IQMISSHead.Status == "011") {
					oView.byId("IQMISSReject").setVisible(true);
					oView.byId("idiqamissfincomments").setText(IQMISSHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				//				if (oSubCode == "0103") {
				oView.byId("iqmiss_collec").setVisible(false);
				//				} else {
				//					oView.byId("iqmiss_collec").setVisible(true);
				//					oView.byId("idIQMISSCollection").setSelectedIndex(0);
				//					if (IQMISSJson.results[0].CollectionMtd != null && IQMISSJson.results[0].CollectionMtd == "1") {
				//						oView.byId("idIQMISSCollection").setSelectedIndex(1);
				//						oView.byId("IQMISSPrefBody").setVisible(true);
				//						oView.byId("IQMISSTracking").setVisible(true);
				//					}
				//				}

				oView.byId("idIQMISSDelivery").setSelectedIndex(0);
				if (IQMISSJson.results[0].DeliveryMtd != null && IQMISSJson.results[0].DeliveryMtd == "1") {
					oView.byId("idIQMISSDelivery").setSelectedIndex(1);
					oView.byId("IQMISSPrefBody").setVisible(true);
					oView.byId("IQMISSTracking").setVisible(true);

				}
				oView.byId("iqmisscpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("iqmisscpdkaustid").setText(PrefJson.KaustID);
				oView.byId("iqmisscpdmobile").setText(PrefJson.Mobile);
				oView.byId("iqmisscpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("iqmisscpdlevel").setText(PrefJson.levelb);
				oView.byId("iqmisscpdbldname").setText(PrefJson.BuildingName);
				oView.byId("idIQMISSTrackingNum").setText(IQMISSHead.TrackingId);
				// Populate Collection / Delivery Details - End
			}
			// Populate IQMISS Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
				"'&$format=json", null, false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryIQMISS");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Iqama Issuance 
	// Govt Visit Visa Extension Begin 26.04.2021
	getGVVEXTDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("GVVEXTSReject").setVisible(false);
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern: "dd-MM-yyyy" //"yyyy-MM-ddTHH:mm:ss"

		});
		var PrefJson;
		var EmpJson;
		var FEVCANCELJson;
		var FEVCANCELHead;
		var FEVtJson;

		var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHRTRS0001TSR_GASC", true);
		var cstfilter = "UserDetail";

		odlrReqModel.read(cstfilter, null, null, false, function (data, response) {
			var dlrReqModel = new sap.ui.model.json.JSONModel();
			dlrReqModel.setData(data.results);
			// var oDetailsModel = new sap.ui.model.json.JSONModel();
			// oDetailsModel.setData(data.results[0]);
			// sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
			if (data.results.length > 0) {
				// EmpJson = data.results[0];
				// oView.byId("idSKaustid").setValue(EmpJson.KaustID);
				// oView.byId("idSFname").setValue(EmpJson.FirstName);
				// oView.byId("idSMname").setValue(EmpJson.MiddleName);
				// oView.byId("idSLname").setValue(EmpJson.LastName);
				// oView.byId("idSGender").setValue(EmpJson.Gender);
				// oView.byId("GNationality").setValue(EmpJson.Nationality);
				// oView.byId("Costcenter").setValue(EmpJson.Position);
				// oView.byId("DateEntr").setValue(EmpJson.Position);

			}

		}, function (response) {
			return "";
		});

		// var odlrReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		// var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		// odlrReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
		// 		var dlrPrefModel = new sap.ui.model.json.JSONModel();
		// 		dlrPrefModel.setData(data);
		// 		PrefJson = data;
		// 	},
		// 	function (response) {
		// 		return "";
		// 	});

		var odlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		odlrModel.read("GASC_HeaderSet?$filter=RequestId eq'" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var dlrData = new sap.ui.model.json.JSONModel();
				dlrData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(dlrData, "FEVNEWJson");
				sap.ui.getCore().setModel(dlrData, "FEVNEWJson");
				FEVCANCELJson = data.results[0].Headertoiqama;
				FEVCANCELHead = data.results[0];
				var dataHeader = data.results[0].Headertoiqama["results"];
				EmpJson = data.results[0].Headertoiqama.results[0];
				oView.byId("idSKaustid").setValue(EmpJson.KaustId);
				oView.byId("idSFname").setValue(EmpJson.FirstName);
				oView.byId("idSMname").setValue(EmpJson.MiddleName);
				oView.byId("idSLname").setValue(EmpJson.LastName);
				oView.byId("idSGender").setValue(EmpJson.Gender);
				oView.byId("GNationality").setValue(EmpJson.Nationality);
				oView.byId("Costcenter").setValue(EmpJson.CostCenter);
				oView.byId("idBoarderNum").setValue(EmpJson.BorderNo);

				oView.byId("idpassportNuber").setValue(EmpJson.Passport);
				oView.byId("PassportIssuseplc").setValue(EmpJson.PlaceOfIssue);
				
				var DateOfEntrance = new Date(EmpJson.DateOfEntrance);
				var Dte = oDateFormat.format(new Date(DateOfEntrance));
				oView.byId("DateEntr").setValue(Dte);
				
				var DateOfIssue = new Date(EmpJson.DateOfIssue);
				var Dofisue = oDateFormat.format(new Date(DateOfIssue));
				oView.byId("idpassportdatee").setValue(Dofisue);

				var PpExpiryDate = new Date(EmpJson.PpExpiryDate);
				var PPexp = oDateFormat.format(new Date(PpExpiryDate));
				oView.byId("idpassportExpdate").setValue(PPexp);

				var VisaExpiryDate = new Date(EmpJson.VisaExpiryDate);
				var visaexp = oDateFormat.format(new Date(VisaExpiryDate));
				oView.byId("VisaErpDate").setValue(visaexp);
			}.bind(this),
			function (response) {
				return "";
			});

		var oExpeditor = FEVCANCELHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("GVVEXTExpeditor").setText(oExpeditor);
		}

		if (FEVCANCELHead.Status == "011") {
			oView.byId("FEVCancelSReject").setVisible(true);
			oView.byId("idFEVCancelfincomments").setText(FEVCANCELHead.Fincomments);
		}
		var doctype;
		var empnation;
		var GVVAttJson1;
		var GVVEXTAttJson;
		// Populate Attachment Details - Begin
		var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
		var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
			"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
		oAttachModel.read(attxt, null, null, false, function (data, response) {
				var attachModel = new sap.ui.model.json.JSONModel();
				attachModel.setData(data);
				GVVEXTAttJson = data;
			},
			function (response) {
				return "";
			});

		if (GVVEXTAttJson.results.length > 0) {
		  for(var i=0;i<GVVEXTAttJson.results.length;i++){
		  	var type = GVVEXTAttJson.results[i].FILENAME;
		  	var split = type.split("_");
		  	if(split[0] === "NOL"){
			oView.byId("GVPassport").setHref(GVVEXTAttJson.results[i].URL);
			}else{
			oView.byId("GVSaudiB").setHref(GVVEXTAttJson.results[i].URL);
			}
		  }
		}
		// / Populate Attachment Details - End
		// Populate Rejection Details - End

		// Populate Comments Details - Begin    
		var oDataApproverModel = new sap.ui.model.json.JSONModel();
		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
			"'&$format=json", null, false);
		var data = oDataApproverModel.getData().d.results;
		oDataApproverModel.setData(data);
		this.getView().setModel(oDataApproverModel, "GAComments");
		// Populate Comments details - End        

		// Populate History details - Begin       
		if (sRequestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
			var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistoryFEV");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
				table.getBinding('items').filter(oCombineFilters);
			}, function (response) {
				return "";
			});
		}
		// Populate History details - End 	
	},

	// Govt Visit Visa Extension End 26.04.2021
	// Final  Exit Visa Cancellation - Begin //
	getFEVCANDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("FEVCANCELSReject").setVisible(false);
		// oView.byId("DLRENEWTracking").setVisible(false);
		// oView.byId("DLRENEWReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var FEVCANCELJson;
		var FEVCANCELHead;
		var FEVtJson;

		// var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		// var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHRTRS0001TSR_GASC", true);
		var cstfilter = "UserDetail";

		odlrReqModel.read(cstfilter, null, null, false, function (data, response) {
			var dlrReqModel = new sap.ui.model.json.JSONModel();
			dlrReqModel.setData(data.results);
			// var oDetailsModel = new sap.ui.model.json.JSONModel();
			// oDetailsModel.setData(data.results[0]);
			// sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
			if (data.results.length > 0) {
				EmpJson = data.results[0];
				oView.byId("idSKaustid").setValue(EmpJson.KaustID);
				oView.byId("idSFname").setValue(EmpJson.FirstName);
				oView.byId("idSMname").setValue(EmpJson.MiddleName);
				oView.byId("idSLname").setValue(EmpJson.LastName);
				oView.byId("idSGender").setValue(EmpJson.Gender);
				oView.byId("idIqValue").setValue(EmpJson.Nationality);
				oView.byId("idReqType").setValue(EmpJson.Position);
				//				oView.byId("idDateofEntrance").setValue(EmpJson.Position);
				oView.byId("idiqamano").setValue(EmpJson.Iqama);
				oView.byId("idpassportNuber").setValue(EmpJson.Passport);
				//				oView.byId("idBoarderNum").setValue(EmpJson.BorderNumber);

				//				var Kt = EmpJson.IqamaExpDate;
				//				var mt = EmpJson.KaustIdExpiry;
				//				var dt = new Date(Kt).getDate();
				//				var Mnth = new Date(Kt).getMonth();
				//				var Fyr = new Date(Kt).getFullYear();
				//				var tt = new Date(Kt).getDate() + "-" + new Date(Kt).getMonth() + "-" + new Date(Kt).getFullYear();
				//				var mt = new Date(mt).getDate() + "-" + new Date(mt).getMonth() + "-" + new Date(mt).getFullYear();
				//				oView.byId("idpassportdatee").setValue(mt);
				//				oView.byId("idpassportExpdate").setValue(tt);;
			}

		}, function (response) {
			return "";
		});

		var odlrReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		odlrReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var dlrPrefModel = new sap.ui.model.json.JSONModel();
				dlrPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var odlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		odlrModel.read("GASC_HeaderSet?$filter=RequestId eq'" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var dlrData = new sap.ui.model.json.JSONModel();
				dlrData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(dlrData, "FEVNEWJson");
				sap.ui.getCore().setModel(dlrData, "FEVNEWJson");

				FEVCANCELJson = data.results[0].Headertoiqama;

				FEVCANCELHead = data.results[0];
				var dataHeader = data.results[0].Headertoiqama["results"];
				// 				for (var i = 0; i <= dataHeader.length - 1; i++) {
				// 					var RequestorTypeFlag = dataHeader[i].RequestorTypeFlag;
				// 					if (RequestorTypeFlag === "" || RequestorTypeFlag === null) {
				// 						sap.ui.getCore().byId("fev_requstorflag").setText("Both");
				// //						sap.ui.getCore().byId("idDateofEntrance").setValue(day);
				// //						sap.ui.getCore().byId("idBoarderNum").setValue(dataHeader[i].BorderNo);
				// //						sap.ui.getCore().byId("idpassportIssplace").setValue(dataHeader[i].IqamaNo);

				// 						var sponsFlag = dataHeader[i].SponsorshipCheckFlag;
				// 						sap.ui.getCore().byId("fev_sps").setVisible(true);
				// 						sap.ui.getCore().byId("fev_car").setVisible(true);
				// 						sap.ui.getCore().byId("fev_vis").setVisible(true);

				// 						if (sponsFlag === "" || sponsFlag === null) {
				// 							sap.ui.getCore().byId("fev_sponsorshipflag").setText("No");
				// 						} else if (sponsFlag === "X") {
				// 							sap.ui.getCore().byId("fev_sponsorshipflag").setText("Yes");
				// 						}

				// 						var carFlag = dataHeader[i].RequestTypeFlag;
				// 						if (carFlag === "" || sponsFlag === null) {
				// 							sap.ui.getCore().byId("fev_carflag").setText("No");
				// 						} else if (carFlag === "X") {
				// 							sap.ui.getCore().byId("fev_carflag").setText("Yes");
				// 						}

				// 						var key = dataHeader[i].VisitorCheckFlag;
				// 						if (key === "" || key === null) {
				// 							sap.ui.getCore().byId("fev_visitorflag").setText("No");
				// //							var date = new Date(dataHeader[i].DateOfEntrance);
				// //							var month = date.getMonth() + 1;
				// //							var day = date.getDate() + "-" + month + "-" + date.getFullYear();
				// 						} else if (key === "X") {
				// 							sap.ui.getCore().byId("fev_visitorflag").setText("Yes");
				// 						}

				// 					} else if (RequestorTypeFlag === "D") {
				// 						sap.ui.getCore().byId("fev_requstorflag").setText("Dependent");
				// //						sap.ui.getCore().byId("idbDateofEntrance").setVisible(false);
				// 						sap.ui.getCore().byId("idbBoarderNum").setVisible(false);
				// 						sap.ui.getCore().byId("idbiqamano").setVisible(false);
				// 						sap.ui.getCore().byId("fev_sps").setVisible(false);
				// 						sap.ui.getCore().byId("fev_car").setVisible(false);
				// 						sap.ui.getCore().byId("fev_vis").setVisible(false);

				// 					}
				// 					break;
				// 				}
				// var dataHeader = data.results[0].Headertoiqama["results"];

				for (var i = 0; i <= dataHeader.length - 1; i++) {
					var RequestorTypeFlag = dataHeader[i].RequestorTypeFlag;

					if (RequestorTypeFlag === "" || RequestorTypeFlag === "S") {

						var RequestTypeFlag = dataHeader[i].RequestTypeFlag;
						if (RequestorTypeFlag === "S") {
							sap.ui.getCore().byId("fevCancel_requstorflag").setText("Self");
						} else {
							sap.ui.getCore().byId("fevCancel_requstorflag").setText("Both");
						}
					} else if (RequestorTypeFlag === "D") {
						sap.ui.getCore().byId("fevCancel_requstorflag").setText("Dependent");

					}
					break;
				}

			}.bind(this),
			function (response) {
				return "";
			});

		var oExpeditor = FEVCANCELHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("FEVECancelExpeditor").setText(oExpeditor);
		}

		if (FEVCANCELHead.Status == "011") {
			oView.byId("FEVCancelSReject").setVisible(true);
			oView.byId("idFEVCancelfincomments").setText(FEVCANCELHead.Fincomments);
		}
		// Populate Rejection Details - End

		// Populate Comments Details - Begin    
		var oDataApproverModel = new sap.ui.model.json.JSONModel();
		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
			"'&$format=json", null, false);
		var data = oDataApproverModel.getData().d.results;
		oDataApproverModel.setData(data);
		this.getView().setModel(oDataApproverModel, "GAComments");
		// Populate Comments details - End        

		// Populate History details - Begin       
		// Populate History details - Begin       
		if (sRequestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
			var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistoryFEV");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
				table.getBinding('items').filter(oCombineFilters);
			}, function (response) {
				return "";
			});
		}
		// Populate History details - End 	
	},
	// Final Exit Visa Cancellation End here //
	// Final  Exit Visa - Begin 
	getFEVDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("FEVSReject").setVisible(false);
		// oView.byId("DLRENEWTracking").setVisible(false);
		// oView.byId("DLRENEWReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var FEVJson;
		var FEVHead;
		var FEVtJson;

		// var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		// var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHRTRS0001TSR_GASC", true);
		var cstfilter = "UserDetail";

		odlrReqModel.read(cstfilter, null, null, false, function (data, response) {
			var dlrReqModel = new sap.ui.model.json.JSONModel();
			dlrReqModel.setData(data.results);
			// var oDetailsModel = new sap.ui.model.json.JSONModel();
			// oDetailsModel.setData(data.results[0]);
			// sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
			if (data.results.length > 0) {
				EmpJson = data.results[0];
				oView.byId("idSKaustid").setValue(EmpJson.KaustID);
				oView.byId("idSFname").setValue(EmpJson.FirstName);
				oView.byId("idSMname").setValue(EmpJson.MiddleName);
				oView.byId("idSLname").setValue(EmpJson.LastName);
				oView.byId("idSGender").setValue(EmpJson.Gender);
				oView.byId("idIqValue").setValue(EmpJson.Nationality);
				oView.byId("idReqType").setValue(EmpJson.Position);
				//				oView.byId("idDateofEntrance").setValue(EmpJson.Position);
				oView.byId("idiqamano").setValue(EmpJson.Iqama);
				oView.byId("idpassportNuber").setValue(EmpJson.Passport);
				//				oView.byId("idBoarderNum").setValue(EmpJson.BorderNumber);

				//				var Kt = EmpJson.IqamaExpDate;
				//				var mt = EmpJson.KaustIdExpiry;
				//				var dt = new Date(Kt).getDate();
				//				var Mnth = new Date(Kt).getMonth();
				//				var Fyr = new Date(Kt).getFullYear();
				//				var tt = new Date(Kt).getDate() + "-" + new Date(Kt).getMonth() + "-" + new Date(Kt).getFullYear();
				//				var mt = new Date(mt).getDate() + "-" + new Date(mt).getMonth() + "-" + new Date(mt).getFullYear();
				//				oView.byId("idpassportdatee").setValue(mt);
				//				oView.byId("idpassportExpdate").setValue(tt);;
			}

		}, function (response) {
			return "";
		});

		var odlrReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		odlrReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var dlrPrefModel = new sap.ui.model.json.JSONModel();
				dlrPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var odlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		odlrModel.read("GASC_HeaderSet?$filter=RequestId eq'" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var dlrData = new sap.ui.model.json.JSONModel();
				dlrData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(dlrData, "FEVNEWJson");
				sap.ui.getCore().setModel(dlrData, "FEVNEWJson");

				FEVJson = data.results[0].Headertoiqama;

				FEVHead = data.results[0];
				var dataHeader = data.results[0].Headertoiqama["results"];
				for (var i = 0; i <= dataHeader.length - 1; i++) {
					var RequestorTypeFlag = dataHeader[i].RequestorTypeFlag;
					if (RequestorTypeFlag === "" || RequestorTypeFlag === "S") {
						sap.ui.getCore().byId("fev_requstorflag").setText("Both");
						if (RequestorTypeFlag === "S")
							sap.ui.getCore().byId("fev_requstorflag").setText("Self");
						//						sap.ui.getCore().byId("idDateofEntrance").setValue(day);
						//						sap.ui.getCore().byId("idBoarderNum").setValue(dataHeader[i].BorderNo);
						//						sap.ui.getCore().byId("idpassportIssplace").setValue(dataHeader[i].IqamaNo);

						var sponsFlag = dataHeader[i].SponsorshipCheckFlag;
						sap.ui.getCore().byId("fev_sps").setVisible(true);
						sap.ui.getCore().byId("fev_car").setVisible(true);
						sap.ui.getCore().byId("fev_vis").setVisible(true);

						if (sponsFlag === "" || sponsFlag === null) {
							sap.ui.getCore().byId("fev_sponsorshipflag").setText("No");
						} else if (sponsFlag === "X") {
							sap.ui.getCore().byId("fev_sponsorshipflag").setText("Yes");
						}

						var carFlag = dataHeader[i].RequestTypeFlag;
						if (carFlag === "" || sponsFlag === null) {
							sap.ui.getCore().byId("fev_carflag").setText("No");
						} else if (carFlag === "X") {
							sap.ui.getCore().byId("fev_carflag").setText("Yes");
						}

						var key = dataHeader[i].VisitorCheckFlag;
						if (key === "" || key === null) {
							sap.ui.getCore().byId("fev_visitorflag").setText("No");
							//							var date = new Date(dataHeader[i].DateOfEntrance);
							//							var month = date.getMonth() + 1;
							//							var day = date.getDate() + "-" + month + "-" + date.getFullYear();
						} else if (key === "X") {
							sap.ui.getCore().byId("fev_visitorflag").setText("Yes");
						}

					} else if (RequestorTypeFlag === "D") {
						sap.ui.getCore().byId("fev_requstorflag").setText("Dependent");
						//						sap.ui.getCore().byId("idbDateofEntrance").setVisible(false);
						sap.ui.getCore().byId("idbBoarderNum").setVisible(false);
						//						sap.ui.getCore().byId("idbiqamano").setVisible(false);
						sap.ui.getCore().byId("fev_sps").setVisible(false);
						sap.ui.getCore().byId("fev_car").setVisible(false);
						sap.ui.getCore().byId("fev_vis").setVisible(false);

					}
					break;
				}

			}.bind(this),
			function (response) {
				return "";
			});

		var oExpeditor = FEVHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("FEVExpeditor").setText(oExpeditor);
		}

		if (FEVHead.Status == "011") {
			oView.byId("FEVSReject").setVisible(true);
			oView.byId("idFEVfincomments").setText(FEVHead.Fincomments);
		}
		// Populate Rejection Details - End

		// Populate Comments Details - Begin    
		var oDataApproverModel = new sap.ui.model.json.JSONModel();
		oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId +
			"'&$format=json", null, false);
		var data = oDataApproverModel.getData().d.results;
		oDataApproverModel.setData(data);
		this.getView().setModel(oDataApproverModel, "GAComments");
		// Populate Comments details - End        

		// Populate History details - Begin       
		// Populate History details - Begin       
		if (sRequestId) {
			var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
			var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
			var model = new sap.ui.model.json.JSONModel();
			var table = sap.ui.getCore().byId("TblHistoryFEV");
			table.setModel(model, "historyModel");
			oModel.read(filterstr, null, null, false, function (data, response) {
				table.getModel("historyModel").setData(data.results);
				var aFilter = [];
				var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
				var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
				var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
				var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
				var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
				var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
				table.getBinding('items').filter(oCombineFilters);
			}, function (response) {
				return "";
			});
		}
		// Populate History details - End 	
	},
	//  Final  Exit Visa - End
	//Driving License Renewal
	getDLRDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("DLRENEWPrefBody").setVisible(false);
		oView.byId("DLRENEWTracking").setVisible(false);
		oView.byId("DLRENEWReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var DLRJson;
		var DLRHead;
		var DLRAttJson;

		var odlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		odlrReqModel.read(cstfilter, null, null, false, function (data, response) {
			var dlrReqModel = new sap.ui.model.json.JSONModel();
			dlrReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var odlrReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		odlrReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var dlrPrefModel = new sap.ui.model.json.JSONModel();
				dlrPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var odlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		odlrModel.read("GASC_HeaderSet?$filter=Request_ID eq'" + sRequestId + "'&$expand=HeaderToDL", null, null, false, function (data,
				response) {
				var dlrData = new sap.ui.model.json.JSONModel();
				dlrData.setData(data.results[0].HeaderToDL);
				that.getView().setModel(dlrData, "DLRENEWJson");
				sap.ui.getCore().setModel(dlrData, "DLRENEWJson");
				DLRJson = data.results[0].HeaderToDL;
				DLRHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = DLRHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("DLRENEWExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "0502") {
			if (DLRJson.results.length > 0) {

				oView.byId("txt_DLR").setText("No");
				if (DLRJson.results[0].Moiabsher === "true")
					oView.byId("txt_DLR").setText("Yes");
				//				if (DLRJson.results[0].Moiabsher === "true") {
				//					oView.byId("rbgDLR").setText(true);
				//				} else {
				//					oView.byId("RBDLR-2").setSelected(true);
				//				}

				// Populate Attachment Details - Begin
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						DLRAttJson = data;
					},
					function (response) {
						return "";
					});

				if (DLRAttJson.results.length > 0) {
					oView.byId("DLRatt").setHref(DLRAttJson.results[0].URL);
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (DLRHead.Status == "011") {
					oView.byId("DLRENEWReject").setVisible(true);
					oView.byId("DLRENEWfincomments").setText(DLRHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				oView.byId("DLRENEWCollection").setSelectedIndex(0);
				if (DLRJson.results[0].Collectionmtd != null && DLRJson.results[0].Collectionmtd == "1") {
					oView.byId("DLRENEWCollection").setSelectedIndex(1);
					oView.byId("DLRENEWPrefBody").setVisible(true);
					oView.byId("DLRENEWTracking").setVisible(true);
				}

				oView.byId("DLRENEWDelivery").setSelectedIndex(0);
				if (DLRJson.results[0].Deliverymtd != null && DLRJson.results[0].Deliverymtd == "1") {
					oView.byId("DLRENEWDelivery").setSelectedIndex(1);
					oView.byId("DLRENEWPrefBody").setVisible(true);
					oView.byId("DLRENEWTracking").setVisible(true);

				}
				oView.byId("dlrenewcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("dlrenewcpdkaustid").setText(PrefJson.KaustID);
				oView.byId("dlrenewcpdmobile").setText(PrefJson.Mobile);
				oView.byId("dlrenewcpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("dlrenewcpdlevel").setText(PrefJson.levelb);
				oView.byId("dlrenewcpdbldname").setText(PrefJson.BuildingName);
				oView.byId("DLRENEWTrackingNum").setText(DLRHead.Tracking_ID);
				// Populate Collection / Delivery Details - End
			}
			// Populate Driving License Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryDLRENEW");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Driving License Renewal

	//MotorCycle Driving License Renewal
	getMCDLRDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("MCDLRENEWPrefBody").setVisible(false);
		oView.byId("MCDLRENEWTracking").setVisible(false);
		oView.byId("MCDLRENEWReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var MCDLRJson;
		var MCDLRHead;
		var MCDLRAttJson;

		var omcdlrReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		omcdlrReqModel.read(cstfilter, null, null, false, function (data, response) {
			var mcdlrReqModel = new sap.ui.model.json.JSONModel();
			mcdlrReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var omcdlrReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		omcdlrReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var mcdlrPrefModel = new sap.ui.model.json.JSONModel();
				mcdlrPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var omcdlrModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		omcdlrModel.read("GASC_HeaderSet?$filter=Request_ID eq'" + sRequestId + "'&$expand=HeaderToDL", null, null, false, function (data,
				response) {
				var mcdlrData = new sap.ui.model.json.JSONModel();
				mcdlrData.setData(data.results[0].HeaderToDL);
				that.getView().setModel(mcdlrData, "MCDLRENEWJson");
				sap.ui.getCore().setModel(mcdlrData, "MCDLRENEWJson");
				MCDLRJson = data.results[0].HeaderToDL;
				MCDLRHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = MCDLRHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("MCDLRENEWExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "0505") {
			if (MCDLRJson.results.length > 0) {

				oView.byId("txt_MCDLR").setText("No");
				if (MCDLRJson.results[0].Moiabsher === "true")
					oView.byId("txt_MCDLR").setText("Yes");
				//				if (DLRJson.results[0].Moiabsher === "true") {
				//					oView.byId("rbgDLR").setText(true);
				//				} else {
				//					oView.byId("RBDLR-2").setSelected(true);
				//				}

				// Populate Attachment Details - Begin
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '29'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						MCDLRAttJson = data;
					},
					function (response) {
						return "";
					});

				if (MCDLRAttJson.results.length > 0) {
					oView.byId("MCDLRatt").setHref(MCDLRAttJson.results[0].URL);
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (MCDLRHead.Status == "011") {
					oView.byId("MCDLRENEWReject").setVisible(true);
					oView.byId("MCDLRENEWfincomments").setText(MCDLRHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				oView.byId("MCDLRENEWCollection").setSelectedIndex(0);
				if (MCDLRJson.results[0].Collectionmtd != null && MCDLRJson.results[0].Collectionmtd == "1") {
					oView.byId("MCDLRENEWCollection").setSelectedIndex(1);
					oView.byId("MCDLRENEWPrefBody").setVisible(true);
					oView.byId("MCDLRENEWTracking").setVisible(true);
				}

				oView.byId("MCDLRENEWDelivery").setSelectedIndex(0);
				if (MCDLRJson.results[0].Deliverymtd != null && MCDLRJson.results[0].Deliverymtd == "1") {
					oView.byId("MCDLRENEWDelivery").setSelectedIndex(1);
					oView.byId("MCDLRENEWPrefBody").setVisible(true);
					oView.byId("MCDLRENEWTracking").setVisible(true);

				}
				oView.byId("MCDLrenewcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("MCDLrenewcpdkaustid").setText(PrefJson.KaustID);
				oView.byId("MCDLrenewcpdmobile").setText(PrefJson.Mobile);
				oView.byId("MCDLrenewcpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("MCDLrenewcpdlevel").setText(PrefJson.levelb);
				oView.byId("MCDLrenewcpdbldname").setText(PrefJson.BuildingName);
				oView.byId("MCDLRENEWTrackingNum").setText(MCDLRHead.Tracking_ID);
				// Populate Collection / Delivery Details - End
			}
			// Populate Motorcycle Driving License Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryDLRENEW");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of MotorCycle Driving License Renewal

	//MotorCycle Driving License Issue
	getMCDLIssDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("MCDLISSPrefBody").setVisible(false);
		oView.byId("MCDLISSTracking").setVisible(false);
		oView.byId("MCDLISSReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var MCDLISSJson;
		var MCDLISSHead;
		var MCDLISSAttJson;

		var omcdlissReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		omcdlissReqModel.read(cstfilter, null, null, false, function (data, response) {
			var mcdlissReqModel = new sap.ui.model.json.JSONModel();
			mcdlissReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var omcdlissReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		omcdlissReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var mcdlissPrefModel = new sap.ui.model.json.JSONModel();
				mcdlissPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var omcdlissModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		omcdlissModel.read("GASC_HeaderSet?$filter=Request_ID eq'" + sRequestId + "'&$expand=HeaderToDL", null, null, false, function (data,
				response) {
				var mcdlissData = new sap.ui.model.json.JSONModel();
				mcdlissData.setData(data.results[0].HeaderToDL);
				that.getView().setModel(mcdlissData, "MCDLISSJson");
				sap.ui.getCore().setModel(mcdlissData, "MCDLISSJson");
				MCDLISSJson = data.results[0].HeaderToDL;
				MCDLISSHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = MCDLISSHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("MCDLISSExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "0501") {
			if (MCDLISSJson.results.length > 0) {

				oView.byId("txt_MCDLFP").setText("No");
				if (MCDLISSJson.results[0].Fingerprintletter === "X") {
					oView.byId("txt_MCDLFP").setText("Yes");
				}

				oView.byId("txt_MCDLMor").setText("No");
				if (MCDLISSJson.results[0].Morrorpass === "X") {
					oView.byId("txt_MCDLMor").setText("Yes");
				}

				//				if (DLRJson.results[0].Moiabsher === "true") {
				//					oView.byId("rbgDLR").setText(true);
				//				} else {
				//					oView.byId("RBDLR-2").setSelected(true);
				//				}

				// Populate Attachment Details - Begin
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						MCDLISSAttJson = data;
					},
					function (response) {
						return "";
					});

				if (MCDLISSAttJson.results.length > 0) {
					// oView.byId("MCDLISSFPatt").setHref(MCDLISSAttJson.results[1].URL);
					oView.byId("MCDLISSMoratt").setHref(MCDLISSAttJson.results[0].URL);
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (MCDLISSHead.Status == "011") {
					oView.byId("MCDLISSReject").setVisible(true);
					oView.byId("MCDLISSfincomments").setText(MCDLISSHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				/*	oView.byId("MCDLRENEWCollection").setSelectedIndex(0);
					if (MCDLRJson.results[0].Collectionmtd != null && MCDLRJson.results[0].Collectionmtd == "1") {
						oView.byId("MCDLRENEWCollection").setSelectedIndex(1);
						oView.byId("MCDLRENEWPrefBody").setVisible(true);
						oView.byId("MCDLRENEWTracking").setVisible(true);
					}*/

				oView.byId("MCDLISSDelivery").setSelectedIndex(0);
				if (MCDLISSJson.results[0].Deliverymtd != null && MCDLISSJson.results[0].Deliverymtd == "1") {
					oView.byId("MCDLISSDelivery").setSelectedIndex(0);
					oView.byId("MCDLISSPrefBody").setVisible(true);
					oView.byId("MCDLISSTracking").setVisible(true);

				}
				oView.byId("MCDLISScpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("MCDLISScpdkaustid").setText(PrefJson.KaustID);
				oView.byId("MCDLISScpdmobile").setText(PrefJson.Mobile);
				oView.byId("MCDLISScpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("MCDLISScpdlevel").setText(PrefJson.levelb);
				oView.byId("MCDLISScpdbldname").setText(PrefJson.BuildingName);
				oView.byId("MCDLISSTrackingNum").setText(MCDLISSHead.Tracking_ID);
				// Populate Collection / Delivery Details - End
			}
			// Populate Motorcycle Driving License Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryDLISS");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of MotorCycle Driving License Issue

	// Begin of Car Driving License Issue
	getDLIssDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("DLISSPrefBody").setVisible(false);
		oView.byId("DLISSTracking").setVisible(false);
		oView.byId("DLISSReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var DLISSJson;
		var DLISSHead;
		var DLISSAttJson;

		var odlissReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter1 = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		odlissReqModel.read(cstfilter1, null, null, false, function (data, response) {
			var dlissReqModel = new sap.ui.model.json.JSONModel();
			dlissReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var odlissReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		odlissReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var dlissPrefModel = new sap.ui.model.json.JSONModel();
				dlissPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var odlissModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		odlissModel.read("GASC_HeaderSet?$filter=Request_ID eq'" + sRequestId + "'&$expand=HeaderToDL", null, null, false, function (data,
				response) {
				var dlissData = new sap.ui.model.json.JSONModel();
				dlissData.setData(data.results[0].HeaderToDL);
				that.getView().setModel(dlissData, "DLISSJson");
				sap.ui.getCore().setModel(dlissData, "DLISSJson");
				DLISSJson = data.results[0].HeaderToDL;
				DLISSHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = DLISSHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("DLISSExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "0504") {
			if (DLISSJson.results.length > 0) {

				oView.byId("txt_DLISSFP").setText("No");
				if (DLISSJson.results[0].Fingerprintletter === "X") {
					oView.byId("txt_DLISSFP").setText("Yes");
				}

				oView.byId("txt_DLISSMor").setText("No");
				if (DLISSJson.results[0].Morrorpass === "X") {
					oView.byId("txt_DLISSMor").setText("Yes");
				}

				//				if (DLRJson.results[0].Moiabsher === "true") {
				//					oView.byId("rbgDLR").setText(true);
				//				} else {
				//					oView.byId("RBDLR-2").setSelected(true);
				//				}

				// Populate Attachment Details - Begin
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						DLISSAttJson = data;
					},
					function (response) {
						return "";
					});

				if (DLISSAttJson.results.length > 0) {
					//oView.byId("DLISSFPatt").setHref(DLISSAttJson.results[1].URL);
					oView.byId("DLISSMoratt").setHref(DLISSAttJson.results[0].URL);
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (DLISSHead.Status == "011") {
					oView.byId("DLISSReject").setVisible(true);
					oView.byId("DLISSfincomments").setText(DLISSHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				/*	oView.byId("MCDLRENEWCollection").setSelectedIndex(0);
					if (MCDLRJson.results[0].Collectionmtd != null && MCDLRJson.results[0].Collectionmtd == "1") {
						oView.byId("MCDLRENEWCollection").setSelectedIndex(1);
						oView.byId("MCDLRENEWPrefBody").setVisible(true);
						oView.byId("MCDLRENEWTracking").setVisible(true);
					}*/

				oView.byId("DLISSDelivery").setSelectedIndex(0);
				if (DLISSJson.results[0].Deliverymtd != null && DLISSJson.results[0].Deliverymtd == "1") {
					oView.byId("DLISSDelivery").setSelectedIndex(0);
					oView.byId("DLISSPrefBody").setVisible(true);
					oView.byId("DLISSTracking").setVisible(true);

				}
				oView.byId("DLISScpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("DLISScpdkaustid").setText(PrefJson.KaustID);
				oView.byId("DLISScpdmobile").setText(PrefJson.Mobile);
				oView.byId("DLISScpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("DLISScpdlevel").setText(PrefJson.levelb);
				oView.byId("DLISScpdbldname").setText(PrefJson.BuildingName);
				oView.byId("DLISSTrackingNum").setText(DLISSHead.Tracking_ID);
				// Populate Collection / Delivery Details - End
			}
			// Populate Motorcycle Driving License Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryCDLISS");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Car Driving License Issue
	//Begin of Car Registration Renewal
	getCARRegRenewDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("CARREGRENEWPrefBody").setVisible(false);
		oView.byId("CARREGRENEWTracking").setVisible(false);
		oView.byId("CARREGRENEWReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var CARREGRENEWJson;
		var CARREGRENEWHead;
		var CARREGRENEWAttJson;

		var oCARREGRENEWReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter1 = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		oCARREGRENEWReqModel.read(cstfilter1, null, null, false, function (data, response) {
			var CARREGRENEWReqModel = new sap.ui.model.json.JSONModel();
			CARREGRENEWReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var oCARREGRENEWReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		oCARREGRENEWReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var CARREGRENEWPrefModel = new sap.ui.model.json.JSONModel();
				CARREGRENEWPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oCARREGRENEWModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
		oCARREGRENEWModel.read("GASC_HeaderSet?$filter=Request_ID eq'" + sRequestId + "'&$expand=HeaderToDL", null, null, false, function (
				data,
				response) {
				var CARREGRENEWData = new sap.ui.model.json.JSONModel();
				CARREGRENEWData.setData(data.results[0].HeaderToDL);
				that.getView().setModel(CARREGRENEWData, "CARREGRENEWJson");
				sap.ui.getCore().setModel(CARREGRENEWData, "CARREGRENEWJson");
				CARREGRENEWJson = data.results[0].HeaderToDL;
				CARREGRENEWHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = CARREGRENEWHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("CARREGRENEWExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "0503") {
			if (CARREGRENEWJson.results.length > 0) {

				oView.byId("txt_CARREGRENEWExpDate").setText("No");
				if (CARREGRENEWJson.results[0].Cardexpired === "X") {
					oView.byId("txt_CARREGRENEWExpDate").setText("Yes");
				}

				oView.byId("txt_CARREGRENEWFees").setText("No");
				if (CARREGRENEWJson.results[0].Feespaid === "X") {
					oView.byId("txt_CARREGRENEWFees").setText("Yes");
				}

				// Populate Attachment Details - Begin
				var doctype;
				var empnation;
				var CARRegAttJson1;
				var oModelCarReg = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
				oModelCarReg.read("UserDetail(KaustID='" + EmpJson.KaustId + "',UserId='')", null, null, false, function (data, response) {
						empnation = data.Nationality;
					},
					function (response) {
						return "";
					});
				if (empnation != null && empnation.toUpperCase() == "SAUDI ARABIAN") {
					doctype = "17";
					oView.byId("CARREGRENEWatt").setText("Saudi ID");
				} else {
					doctype = "3";
					oView.byId("CARREGRENEWatt").setText("Iqama");
				}

				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");

				var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + EmpJson.KaustId +
					"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + doctype + "'";
				oAttachModel.read(attxt1, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						CARRegAttJson1 = data;
					},
					function (response) {
						return "";
					});

				if (CARRegAttJson1.results.length > 0) {
					oView.byId("CARREGRENEWatt").setHref(CARRegAttJson1.results[0].URL);
				}
				var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
				var attxt = "FileRead?$filter=UNIQUE_ID eq '" + sRequestId +
					"' and APPLICATION_TYPE eq '23' and DOCCLASS eq 'ZCUUTLD02' and DOCTYPE eq '27'";
				oAttachModel.read(attxt, null, null, false, function (data, response) {
						var attachModel = new sap.ui.model.json.JSONModel();
						attachModel.setData(data);
						CARREGRENEWAttJson = data;
					},
					function (response) {
						return "";
					});

				if (CARREGRENEWAttJson.results.length > 0) {
					oView.byId("CARREGRENEWExpatt").setHref(CARREGRENEWAttJson.results[1].URL);
					oView.byId("CARREGRENEWFeeatt").setHref(CARREGRENEWAttJson.results[0].URL);
				}
				// Populate Attachment Details - End

				// Populate Rejection Details - Begin
				if (CARREGRENEWHead.Status == "011") {
					oView.byId("CARREGRENEWReject").setVisible(true);
					oView.byId("CARREGRENEWfincomments").setText(CARREGRENEWHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				oView.byId("CARREGRENEWCollection").setSelectedIndex(0);
				if (CARREGRENEWJson.results[0].Collectionmtd != null && CARREGRENEWJson.results[0].Collectionmtd == "1") {
					oView.byId("CARREGRENEWCollection").setSelectedIndex(0);
					oView.byId("CARREGRENEWPrefBody").setVisible(true);
					oView.byId("CARREGRENEWTracking").setVisible(true);
				}

				oView.byId("CARREGRENEWDelivery").setSelectedIndex(0);
				if (CARREGRENEWJson.results[0].Deliverymtd != null && CARREGRENEWJson.results[0].Deliverymtd == "1") {
					oView.byId("CARREGRENEWDelivery").setSelectedIndex(0);
					oView.byId("CARREGRENEWPrefBody").setVisible(true);
					oView.byId("CARREGRENEWTracking").setVisible(true);

				}
				oView.byId("CARREGRENEWcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("CARREGRENEWcpdkaustid").setText(PrefJson.KaustID);
				oView.byId("CARREGRENEWcpdmobile").setText(PrefJson.Mobile);
				oView.byId("CARREGRENEWcpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("CARREGRENEWcpdlevel").setText(PrefJson.levelb);
				oView.byId("CARREGRENEWcpdbldname").setText(PrefJson.BuildingName);
				oView.byId("CARREGRENEWTrackingNum").setText(CARREGRENEWHead.Tracking_ID);
				// Populate Collection / Delivery Details - End
			}
			// Populate Motorcycle Driving License Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryCCARREGRENEW");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of Car Driving License Issue

	//Start of MOE 
	getMoeDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
		oView.byId("MOEPrefBody").setVisible(false);
		oView.byId("MOETracking").setVisible(false);
		oView.byId("MOEReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var MOEJson;
		var MOEHead;
		//var CARREGRENEWAttJson;

		var MOEReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter1 = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		MOEReqModel.read(cstfilter1, null, null, false, function (data, response) {
			var MOEReqModel = new sap.ui.model.json.JSONModel();
			MOEReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var oMOEReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		oMOEReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var MOEPrefModel = new sap.ui.model.json.JSONModel();
				MOEPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oMOEModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oMOEModel.read("GASC_HeaderSet?$filter=RequestId eq'" + sRequestId + "'&$expand=Headertomoe", null, null, false, function (data,
				response) {
				var MOEData = new sap.ui.model.json.JSONModel();
				var ReqData = [];
				var Reqobj = {};
				data.results.forEach(function (val, index) {
					Reqobj.KaustId = val.KaustId;
					Reqobj.FirstName = val.FirstName;
					Reqobj.MiddleName = val.MiddleName;
					Reqobj.LastName = val.LastName;
					Reqobj.Nationality = val.Nationality;
					Reqobj.SaudiNo = val.IdNumber;
					Reqobj.IqamaNo = val.IqamaNo;
					ReqData.push(Reqobj);

				});
				MOEData.setData(ReqData);
				var MOEItemData = new sap.ui.model.json.JSONModel();
				MOEItemData.setData(data.results[0].Headertomoe);
				that.getView().setModel(MOEData, "MOEJson");
				sap.ui.getCore().setModel(MOEData, "MOEJson");
				that.getView().setModel(MOEItemData, "MOEItemJson");
				sap.ui.getCore().setModel(MOEItemData, "MOEItemJson");
				MOEJson = data.results[0].Headertomoe;
				MOEHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = MOEHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("MOEExpeditor").setText(oExpeditor);
		}

		// Populate Driving License Details - Begin
		if (oSubCode == "1702") {
			if (MOEJson.results.length > 0) {

				if (MOEJson.results[0].ServiceType === "1") {
					oView.byId("txt_MOEReq").setText("Sponsor");
				} else if (MOEJson.results[0].ServiceType === "2") {
					oView.byId("txt_MOEReq").setText("Dependents");
				} else {
					oView.byId("txt_MOEReq").setText("Both");
				}

				// Populate Rejection Details - Begin
				if (MOEHead.Status == "011") {
					oView.byId("MOEReject").setVisible(true);
					oView.byId("MOEfincomments").setText(MOEHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
				oView.byId("MOECollection").setSelectedIndex(0);
				if (MOEJson.results[0].CollectionMtd != null && MOEJson.results[0].CollectionMtd == "1") {
					oView.byId("MOECollection").setSelectedIndex(0);
					oView.byId("MOEPrefBody").setVisible(true);
					oView.byId("MOETracking").setVisible(true);
				}

				oView.byId("MOEDelivery").setSelectedIndex(0);
				if (MOEJson.results[0].DeliveryMtd != null && MOEJson.results[0].DeliveryMtd == "1") {
					oView.byId("MOEDelivery").setSelectedIndex(0);
					oView.byId("MOEPrefBody").setVisible(true);
					oView.byId("MOETracking").setVisible(true);

				}
				oView.byId("MOEcpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("MOEcpdkaustid").setText(PrefJson.KaustID);
				oView.byId("MOEcpdmobile").setText(PrefJson.Mobile);
				oView.byId("MOEcpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("MOEcpdlevel").setText(PrefJson.levelb);
				oView.byId("MOEcpdbldname").setText(PrefJson.BuildingName);
				oView.byId("MOETrackingNum").setText(MOEHead.TrackingId);
				// Populate Collection / Delivery Details - End
			}
			// Populate MOE Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryCMOE");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, // end of moe
	
	//Start of IQAMA Renewal
	getIqamaRenDetails: function (sRequestId, oSubCode) {
		var that = this;
		var oView = sap.ui.getCore();
//		oView.byId("IqamaRenPrefBody").setVisible(false);
//		oView.byId("IqamaRenTracking").setVisible(false);
		oView.byId("IqamaRenReject").setVisible(false);

		var PrefJson;
		var EmpJson;
		var IqamaRenJson;
		var IqamaRenHead;
		//var CARREGRENEWAttJson;

		var IqamaRenReqModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");
		var cstfilter1 = "AllRequests?$filter=RequestId eq '" + sRequestId + "'";

		IqamaRenReqModel.read(cstfilter1, null, null, false, function (data, response) {
			var IqamaRenReqModel = new sap.ui.model.json.JSONModel();
			IqamaRenReqModel.setData(data.results);
			if (data.results.length > 0) {
				EmpJson = data.results[0];
			}
		}, function (response) {
			return "";
		});

		var oIqamaRenReqModelPrefModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
		var opctxt = "MyPreferencesCollection(KaustID='" + EmpJson.KaustId + "',SubServiceCode='" + oSubCode + "')";
		oIqamaRenReqModelPrefModel.read(opctxt, null, null, false, function (data, response) {
				var IqamaRenPrefModel = new sap.ui.model.json.JSONModel();
				IqamaRenPrefModel.setData(data);
				PrefJson = data;
			},
			function (response) {
				return "";
			});

		var oIqamaRenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
		oIqamaRenModel.read("GASC_HeaderSet?$filter=RequestId eq'" + sRequestId + "'&$expand=Headertoiqama", null, null, false, function (data,
				response) {
				var IqamaRenData = new sap.ui.model.json.JSONModel();
				var ReqData = [];
				var Reqobj = {};
				data.results.forEach(function (val, index) {
					Reqobj.KaustId = val.KaustId;
					Reqobj.FirstName = val.FirstName;
					Reqobj.MiddleName = val.MiddleName;
					Reqobj.LastName = val.LastName;
					Reqobj.Nationality = val.Nationality;
					Reqobj.SaudiNo = val.IdNumber;
					Reqobj.IqamaNo = val.IqamaNo;
					Reqobj.ExpiryDate  = val.ExpiryDate;
					ReqData.push(Reqobj);

				});
				IqamaRenData.setData(ReqData);
				var IqamaRenItemData = new sap.ui.model.json.JSONModel();
				IqamaRenItemData.setData(data.results[0].Headertoiqama);
				that.getView().setModel(IqamaRenData, "IqamaRenJson");
				sap.ui.getCore().setModel(IqamaRenData, "IqamaRenJson");
				that.getView().setModel(IqamaRenItemData, "IqamaRenItemJson");
				sap.ui.getCore().setModel(IqamaRenItemData, "IqamaRenItemJson");
				IqamaRenJson = data.results[0].Headertoiqama;
				IqamaRenHead = data.results[0];
			},
			function (response) {
				return "";
			});

		var oExpeditor = IqamaRenHead.Expeditor;
		if (oExpeditor.length > 0) {
			var oExpeditorModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			oExpeditorModel.read("UserDetail(KaustID='',UserId='" + oExpeditor + "')", null, null, false, function (data, response) {
					var expeditorModel = new sap.ui.model.json.JSONModel();
					expeditorModel.setData(data);
					oExpeditor = data.FirstName + " " + data.MiddleName + " " + data.LastName + " (" + data.UserId + ")";
				},
				function (response) {
					return "";
				});
			oView.byId("IqamaRenExpeditor").setText(oExpeditor);
		}

		// Populate Iqama Renewal Details - Begin
		if (oSubCode == "0101") {
			if (IqamaRenJson.results.length > 0) {

				if (IqamaRenJson.results[0].RequestorTypeFlag === "S") {
					oView.byId("txt_IqamaRenReq").setText("Self");
				} else if (IqamaRenJson.results[0].RequestorTypeFlag === "D") {
					oView.byId("txt_IqamaRenReq").setText("Dependents");
				} else {
					oView.byId("txt_IqamaRenReq").setText("Both");
				}

				if (IqamaRenHead.Duration === "001") 
					oView.byId("txt_IqamaDuration").setText("One Year");
				else if (IqamaRenHead.Duration === "002") 
					oView.byId("txt_IqamaDuration").setText("Two Years");
				
				// Populate Rejection Details - Begin
				if (IqamaRenHead.Status == "011") {
					oView.byId("IqamaRenReject").setVisible(true);
					oView.byId("IqamaRenfincomments").setText(IqamaRenHead.Fincomments);
				}
				// Populate Rejection Details - End

				// Populate Collection / Delivery Details - Begin
			/*	oView.byId("MOECollection").setSelectedIndex(0);
				if (MOEJson.results[0].CollectionMtd != null && MOEJson.results[0].CollectionMtd == "1") {
					oView.byId("MOECollection").setSelectedIndex(0);
					oView.byId("MOEPrefBody").setVisible(true);
					oView.byId("MOETracking").setVisible(true);
				}

				oView.byId("IqamaRenDelivery").setSelectedIndex(0);
				if (IqamaRenJson.results[0].DeliveryMtd != null && IqamaRenJson.results[0].DeliveryMtd == "1") {
					oView.byId("IqamaRenDelivery").setSelectedIndex(0);
					oView.byId("IqamaRenPrefBody").setVisible(true);
					oView.byId("IqamaRenTracking").setVisible(true);

				}
				oView.byId("IqamaRencpdname").setText(PrefJson.FirstName + " " + PrefJson.MiddleName + " " + PrefJson.LastName);
				oView.byId("IqamaRencpdkaustid").setText(PrefJson.KaustID);
				oView.byId("IqamaRencpdmobile").setText(PrefJson.Mobile);
				oView.byId("IqamaRencpdbldno").setText(PrefJson.BuildingNo);
				oView.byId("IqamaRencpdlevel").setText(PrefJson.levelb);
				oView.byId("IqamaRencpdbldname").setText(PrefJson.BuildingName);
				oView.byId("IqamaRenTrackingNum").setText(IqamaRenHead.TrackingId);*/
				// Populate Collection / Delivery Details - End
			}
			// Populate Iqama renewal Details - End

			// Populate Comments Details - Begin    
			var oDataApproverModel = new sap.ui.model.json.JSONModel();
			oDataApproverModel.loadData("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/CommentSet?$filter=Request_ID eq '" + sRequestId + "'", null,
				false);
			var data = oDataApproverModel.getData().d.results;
			oDataApproverModel.setData(data);
			this.getView().setModel(oDataApproverModel, "GAComments");
			// Populate Comments details - End        

			// Populate History details - Begin       
			if (sRequestId) {
				var oModel = new sap.ui.model.odata.ODataModel(this.getUrl("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/"));
				var filterstr = "Requestlog?$filter=RequestId eq '" + sRequestId + "'";
				var model = new sap.ui.model.json.JSONModel();
				var table = sap.ui.getCore().byId("TblHistoryCIqamaRen");
				table.setModel(model, "historyModel");
				oModel.read(filterstr, null, null, false, function (data, response) {
					table.getModel("historyModel").setData(data.results);
					var aFilter = [];
					var oFilter1 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '056');
					var oFilter2 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '057');
					var oFilter3 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '058');
					var oFilter4 = new sap.ui.model.Filter('Status', sap.ui.model.FilterOperator.NE, '059');
					var corFilter = [oFilter1, oFilter2, oFilter3, oFilter4];
					var oCombineFilters = new sap.ui.model.Filter(corFilter, true);
					table.getBinding('items').filter(oCombineFilters);
				}, function (response) {
					return "";
				});
			}
			// Populate History details - End 			
		}
	}, 
	//end of iqama renewal
	//Roopali(12-07-2018) - open fragment to select dates to cancel (CR - Cancellation recurring event) 
	individualSlotsFrg: function () {
		var oDateModel = new sap.ui.model.json.JSONModel();
		var dates = this.getAllDates();
		if (!this.cancelIndividualSlots) {
			this.cancelIndividualSlots = sap.ui.xmlfragment("kaust.ui.kits.myRequest.view.cancelIndividualSlots", this);
		}
		this.getView().addDependent(this.cancelIndividualSlots);
		this.cancelIndividualSlots.open();
		oDateModel.setData(dates);
		this.cancelIndividualSlots.setModel(oDateModel, "oDateModel");
	},

	closeIndividuaSlotFrg: function () {
		this.cancelIndividualSlots.close();
	},

	getAllDates: function () {
		var that = this;
		var oReccData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();
		var Rstartdate = oReccData.Rstartdate;
		var Renddate = oReccData.Renddate;
		var reccPattern = sap.ui.getCore().byId("reccPattern").getText();
		if (reccPattern === "Daily") {
			var date = that.getAllDatesForDailyRecurr(Rstartdate, Renddate);
		} else if (reccPattern === "Weekly") {
			var date = that.getAllDatesForWeeklyRecurr(Rstartdate, Renddate);
		} else if (reccPattern === "Monthly") {
			var date = that.getAllDatesForMonthlyRecurr(Rstartdate, Renddate);
		}
		var dates = {};
		dates.dates = date;
		return dates;
	},

	getAllDatesForDailyRecurr: function (Rstartdate, Renddate) {
		var arr = [],
			obj = {},
			day = ["sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			oStartDate = new Date(Rstartdate),
			oEndDate = new Date(Renddate),
			oCurrentDate = new Date(),
			oTimeDiff = Math.abs(oStartDate.getTime() - oEndDate.getTime()),
			numOfDays = Math.ceil(oTimeDiff / (1000 * 60 * 60 * 24)),
			oDeletedDates = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData().DeletedDastes;
		for (var i = 0; i <= numOfDays; i++) {
			var oDate = new Date(oStartDate.getTime() + i * 24 * 60 * 60 * 1000);
			//  var oDateEnd = new Date(oEndDate.getTime() + i * 24 * 60 * 60 * 1000);
			//      if ((oCurrentDate <= oDate) && (oDeletedDates.indexOf(this.convertDateBack(oDate)) < 0) && (oDate <= oEndDate)) {
			if ((new Date(oCurrentDate.toDateString()) <= new Date(oDate.toDateString())) && (oDeletedDates.indexOf(this.convertDateBack(oDate)) <
					0) && (new Date(oDate.toDateString()) <= new Date(oEndDate.toDateString()))) {
				obj = {};
				obj.date = this.convertDateBack(oDate);
				obj.day = day[oDate.getDay()];
				arr.push(obj);
			}
		}
		return arr;
	},

	getAllDatesForWeeklyRecurr: function (Rstartdate, Renddate) {
		var arr = [],
			obj = {},
			day = ["sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			eventStartDate = new Date(Rstartdate),
			eventEndDate = new Date(Renddate),
			eventStartDay = eventStartDate.getDay(),
			startDate = eventStartDate.getTime(),
			oCurrentDate = new Date(),
			oDeletedDates = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData().DeletedDastes;
		// var oEndDate = new Date(Renddate);
		var i = 0;
		while (i < 105) {
			var k = 0;
			for (var j = 0; j < this.days.length; j++) {
				if (eventStartDay > this.days[j]) {
					k = i + (7 - (eventStartDay - this.days[j]));
				} else {
					k = i + (this.days[j] - eventStartDay);
				}
				var oDate = new Date(startDate + k * 24 * 60 * 60 * 1000);
				//  var oDateEnd = new Date(oEndDate.getTime() + i * 24 * 60 * 60 * 1000);
				//        if((oCurrentDate <= oDate) && (oDeletedDates.indexOf(this.convertDateBack(oDate))<0) && (oDate <= eventEndDate)){
				if ((new Date(oCurrentDate.toDateString()) <= new Date(oDate.toDateString())) && (oDeletedDates.indexOf(this.convertDateBack(oDate)) <
						0) && (new Date(oDate.toDateString()) <= new Date(eventEndDate.toDateString()))) {
					obj = {};
					obj.date = this.convertDateBack(oDate);
					obj.day = day[oDate.getDay()];
					arr.push(obj);
				}
			}
			i = i + 7;
		}
		return arr;
	},

	getAllDatesForMonthlyRecurr: function (Rstartdate, Renddate) {
		var arr = [],
			obj = {},
			day = ["sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			oStartDate = new Date(Rstartdate),
			oEndDate = new Date(Renddate);
		month = new Date(oStartDate).getMonth() + 1,
			year = new Date(oStartDate).getFullYear(),
			noOfDays = new Date(year, month, 0).getDate(),
			noOfDaysNextMonth = new Date(year, month + 1, 0).getDate(),
			oDeletedDates = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData().DeletedDastes;
		var i = 0;
		while (i <= 180) {
			if (new Date(oStartDate).getDate() === 31) {
				i = i + noOfDaysNextMonth;
			} else {
				i = i + noOfDays;
			}
			var oDate = new Date(oStartDate.getTime() + i * 24 * 60 * 60 * 1000);
			//  var oDateEnd = new Date(oEndDate.getTime() + i * 24 * 60 * 60 * 1000);
			//      if ((oCurrentDate <= oDate) && (oDeletedDates.indexOf(this.convertDateBack(oDate)) < 0) && (oDate <= oEndDate)) {
			if ((new Date(oCurrentDate.toDateString()) <= new Date(oDate.toDateString())) && (oDeletedDates.indexOf(this.convertDateBack(oDate)) <
					0) && (new Date(oDate.toDateString()) <= new Date(oEndDate.toDateString()))) {
				obj = {};
				obj.date = this.convertDateBack(oDate);
				obj.day = day[oDate.getDay()];
				arr.push(obj);
			}
			month = new Date(oDate).getMonth() + 1;
			year = new Date(oDate).getFullYear();
			noOfDays = new Date(year, month, 0).getDate();
			noOfDaysNextMonth = new Date(year, month + 1, 0).getDate();
		}
		return arr;
	},
	/*Roopali(INCTURE - 16-11-2018) - cancel individual slots of recurring event*/
	onPressCancelIndividual: function () {
		var len = sap.ui.getCore().byId("allDatesList").getSelectedItems().length,
			that = this,
			oModelVScan = sap.ui.getCore().byId("Detail").getModel("confRoomModel");
		if (len === 0) {
			sap.m.MessageBox.show("Please select atleast one date to cancel", {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error",
				actions: [sap.m.MessageBox.Action.OK],
			});
		} else {
			var items = sap.ui.getCore().byId("allDatesList").getSelectedItems(),
				selectedIndexes = sap.ui.getCore().byId("allDatesList").getSelectedContextPaths(),
				datesIndex = "",
				/*dates = "", timeStamp,*/
				requestId = this.getView().getModel('helpModel').getData().helpItems.requestId,
				oAVData = sap.ui.getCore().byId("Detail").getModel("confRoomModel").getData();

			for (var i = 0; i < len; i++) {
				/*timeStamp = new Date(items[i].getProperty("title")).getTime();
				dates = dates+"or"+timeStamp;*/
				datesIndex = datesIndex + "A" + selectedIndexes[i].slice(7);
			}
			datesIndex = datesIndex.substring(1, datesIndex.length);
			var oPayload = new Object();
			var sUrl = "CancelRequestSet(RequestId='" + requestId + "',Option='P',List='" + datesIndex + "')";
			var oKITSModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/");

			oPayload["RequestId"] = requestId;
			oPayload["Status"] = "015";
			oPayload["ServiceCall"] = "X";
			oPayload["ServiceCall"] = "X";
			oPayload["Stage"] = oAVData.Stage;
			oPayload["Option"] = 'P';
			oPayload["List"] = datesIndex;

			oKITSModel.update(sUrl, oPayload, {
				success: function (oData, oResponse) {
					that.cancelIndividualSlots.close();
					sap.m.MessageBox.show("The selected date(s) has been canceled.", {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						actions: [sap.m.MessageBox.Action.OK],
					});
					that.getDeletedDates(requestId, oModelVScan);
					sap.ui.getCore().byId("cancelRq").setEnabled(false);
				},
				error: function (oError) {
					this.cancelIndividualSlots.close();
					sap.m.MessageBox.show("Failed to cancel the request. Please try again later", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
					});
				}
			});
		}
	}
});