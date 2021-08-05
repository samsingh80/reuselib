sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel',
    'sap/ui/unified/FileUploader',
    'sap/ui/unified/FileUploaderParameter',
    'sap/ui/model/odata/ODataModel',
    'sap/m/Title',
    'sap/m/MessageBox'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, Filter, JSONModel, ODataModel, FileUploader, FileUploaderParameter, Title, MessageBox) {
        "use strict";

        return Controller.extend("com.kaust.zui5gaattest.controller.MOFA", {
            onInit: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var that = this;
                var EmpJson;
                var DepJson;
                var PrefJson;
                var d_kaustid;

                this.oWizardM = new sap.m.Wizard({
                    id: "MOFAAttestation",
                    finishButtonText: oBundle.getText("SUBREQ"),
                    enableBranching: true,
                    height: "95%",
                    complete: function (oEvent) {
                        fncall.onSubmit(oEvent, PrefJson, DepJson, EmpJson);
                    }
                });
                this.oWizardStepm1 = new sap.m.WizardStep({
                    id: "MOFAStep",
                    nextStep: "SADADStep",
                    title: oBundle.getText("MOFAREQ")
                });
                this.oWizardStepm2 = new sap.m.WizardStep({
                    id: "SADADStep",
                    nextStep: "MCDDOCStep",
                    title: oBundle.getText("SADADBILLPAY")
                });
                this.oWizardStepm3 = new sap.m.WizardStep({
                    id: "MCDDOCStep",
                    title: oBundle.getText("COLLDELDOC"),
                    showNextButton: false
                });

                this._wizard = sap.ui.getCore().byId("MOFAAttestation");
                this._oNavContainer = this.getView().byId("MOFAContainer");
                this._oWizardContentPage = this.getView().byId("MOFAAttestPage");

                //Fetch user details
                // var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                // oModelGasc.read("UserDetail", null, null, false, function(data, response) {
                // 	var oData1 = data.results;
                var oDetailsModel = new sap.ui.model.json.JSONModel();
                // 	oDetailsModel.setData(oData1[0]);
                // 	this.getView().setModel(oDetailsModel,"EmpDetails");
                // 	EmpJson = this.getView().getModel("EmpDetails").getProperty("/");
                // 	d_kaustid = EmpJson.KaustID;
                // }, 
                // function(response) 
                // {
                // 	return "";
                // });

                // EmpJson = {
                //     "KaustID": "100039",
                //     "FirstName": "Umar",
                //     "MiddleName": "Mid",
                //     "LastName": "Mehboob",
                //     "Email": "NAVYA.Krishna@cognizant.com",
                //     "UserId": "TST_EMPLOYEE",
                //     "Mobile": "",
                //     "Office": "",
                //     "Landline": "8026427",
                //     "Gender": "Male",
                //     "Nationality": "American",
                //     "Type": "STAFF",
                //     "Passport": "X9876543",
                //     "Iqama": "2329526368",
                //     "SaudiID": "1006062473",
                //     "Position": "End User Computing Support",
                //     "Deptname": "IT Services",
                //     "Costcenter": "0000040350",
                //     "Orgunit": "30000288",
                //     "Orgname": "End User Computing",
                //     "RManagerKid": "100476",
                //     "RManager": "LINDA MID ROBERTS",
                //     "RManagerMail": "",
                //     "RManagerId": "SHAGHRYA",
                //     "DManagerKid": "100066",
                //     "DManager": "JOHN MID JENSEN",
                //     "DManagerMail": "mohammed.najran@kaust.edu.sa",
                //     "DManagerId": "FAYADLG",
                //     "DegreeType": "",
                //     "StudentStatus": "",
                //     "IqamaExpDate": "/Date(1574035200000)/",
                //     "KaustIdExpiry": "/Date(1715817600000)/",
                //     "Manager": "M",
                //     "Subcategorytype": "Non-Academic",
                //     "VendorNumber": "",
                //     "VendorName": "",
                //     "VendorDescription": ""
                // };
                // oDetailsModel.setData(EmpJson);
                // this.getView().setModel(oDetailsModel, "EmpDetails");
                // oDetailsModel.refresh(true);
                // d_kaustid = EmpJson.KaustID;
                // this.EmpJson = EmpJson;

                // //Fetch dependent details
                // var data;
                // // var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                // // oDependentsModel.read("UserDependents", null, null, false, function(data, response) {
                // var oDepDetailsModel = new sap.ui.model.json.JSONModel();
                // oDepDetailsModel.setData(data);
                // this.getView().setModel(oDepDetailsModel, "DepDetails");
                // DepJson = data;
                // DepJson = this.getDeepData();
                // this.DepJson = DepJson;
                // }, 
                // function(response) 
                // {
                // 	return "";
                // });



            },


            //Get the User Details
            getUserDetails: function () {
                var oDetailsModel = new sap.ui.model.json.JSONModel();
                var that = this;
                var aFilters = this.getFilter();
                var sRequestURL = "/userDetailsSet";
                var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oHanaModel = this.getOwnerComponent().getModel("oHanaModel");
                oHanaModel.read(sRequestURL, {
                    filters: aFilters,
                    urlParameters: {
                        "$expand": "UserDetailsToDependentDetails"
                    },
                    success: function (oData, oResponse) {
                        var data = oData.results[0];
                        var oDetailsModel = new sap.ui.model.json.JSONModel();
                        oDetailsModel.setData(data);
                        this.getView().setModel(oDetailsModel, "EmpDetails");
                        oDetailsModel.refresh(true);
                        var d_kaustid = data.KaustID;
                        that.EmpJson = data;
                        //Fetch dependent details
                        var oDepDetailsModel = new sap.ui.model.json.JSONModel();
                        oDepDetailsModel.setData(data);
                        this.getView().setModel(oDepDetailsModel, "DepDetails");
                        DepJson = data.UserDetailsToDependentDetails.results;
                        that.DepJson = DepJson;
                        that.fileCheck(that.EmpJson, d_kaustid,that);
                    },
                    error: function (data, textStatus, XMLHttpRequest) {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(oResourceModel.getText("ERROR_MSG"), {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oResourceModel.getText("ERROR"),
                            actions: [sap.m.MessageBox.Action.OK],
                        });
                    }
                });
            },

            getFilter: function () {
                {
                    var aFilters = [],
                        aFilterIds = ["UserType", "UserName", "DisplayDependents"],
                        aFilterValues = ["STUDENT", "GHANIMA", "X"],
                        i;
                    for (i = 0; i < aFilterIds.length; i = i + 1) {
                        aFilters.push(new Filter(aFilterIds[i], FilterOperator.EQ, aFilterValues[i], ""));

                    }
                    return aFilters;

                };
            },

            /** File Check */
            fileCheck: function (EmpJson, d_kaustid,that) {
                var filechk = false;
                var doctype = "";
                var errmsg = "";
                var infmsg = "";
                if (EmpJson.Nationality != null && EmpJson.Nationality.toUpperCase() == "SAUDI ARABIAN") {
                    doctype = "17";
                    errmsg = oBundle.getText("SAUDINATIDNOTUPLOAD");
                    infmsg = oBundle.getText("KINENSLASAUDINATID");
                }
                else {
                    doctype = "3";
                    errmsg = oBundle.getText("IQAMANOTUPLAOD");
                    infmsg = oBundle.getText("KINLATIQAMAPASSUP");
                }

                filechk = that.getFileAttachmentDetails(null, d_kaustid, doctype);
                if (filechk) {
                    that.getPrefData(d_kaustid, EmpJson, DepJson,that);
                }
                else {
                    that.getView().attachInit(function () {
                        sap.m.MessageBox.show(errmsg, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oBundle.getText("DOCNOTFOU"),
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                try {
                                    var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                    window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaattach/index.html";
                                } catch (Exception) { return; }
                            }
                        });
                    });
                }
            },

            /** Fetch the preference data */
            getPrefData: function (KaustID, EmpJson, DepJson,that) {
                if (KaustID) {
                    var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                    var preferenceModel = new sap.ui.model.json.JSONModel();
                    var sRequestURL = "/MyPreferencesCollection";
                    // var that = this;

                    oGAModel.read(sRequestURL, {
                        headers: {
                            "kaust_id": KaustID,
                            "sub_service_code": "1701"
                        },
                        success: function (data, response) {
                            var PrefJson = data.results[0];
                            preferenceModel.setData(PrefJson);
                            that.getView().setModel(preferenceModel, 'PrefDetails');
                            that.PrefJson = PrefJson;
                            that.getDetailedPage(that, EmpJson, DepJson, PrefJson);

                        },
                        error: function (response) {

                        }

                    });
                }
            },


            onExit: function () {
                page.destroy();
            },

            // Get Attachment file URL 
            getFileAttachmentDetails: function (oEvent, kaustid, Doctype) {
                // var this = this;
                var filechk = false;
                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
                // 	"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '"+Doctype+ "'";
                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                // 	var attachModel = new sap.ui.model.json.JSONModel();
                // 	attachModel.setData(data);
                // 	if(data.results.length > 0)
                // 	{
                // 		if(data.results[0].URL.length > 0)
                // 		{
                // 			filechk = true;
                // 		}
                // 	}
                // },
                // function (response) {
                // 	return "";
                // });
                filechk = true;
                return filechk;
            },

            onBack: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                MessageBox.confirm(
                    oBundle.getText("ALLUNSAVDATALSTCON"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            if (window.location.href.indexOf("SBY") == -1) {
                                var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                            }
                            else {
                                window.location.assign("about:blank");
                            }
                        }
                    }
                }
                );
            },



            //	Get User Details from the Backend
            getDetailedPage: function (fncall, EmpJson, DepJson, PrefJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oPageM = this.getView().byId("MOFAAttestPage");
                oPageM.addContent(new sap.m.VBox({ height: "10px" }));
                var titletxt = oBundle.getText("WELCOME") + EmpJson.FirstName;
                var oTitle = new sap.m.Title({ text: titletxt, wrapping: true, textAlign: "End", level: "H1", width: "95%" });
                oPageM.addContent(oTitle);
                oPageM.addContent(new sap.m.VBox({ height: "10px" }));

                $.sap.require("sap.ui.layout.form.Form");
                $.sap.require("sap.ui.layout.form.ResponsiveGridLayout");

                //Fetch the Consolate Details
                var consulateModel = new sap.ui.model.json.JSONModel();
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var preferenceModel = new sap.ui.model.json.JSONModel();
                var sRequestURL = "/ConsulatesSet";
                var that = this;
                oGAModel.read(sRequestURL, {
                    success: function (data, response) {
                        consulateModel.setData(data);;
                        that.getOwnerComponent().setModel(consulateModel, 'ConsDetails');

                    },
                    error: function (response) {

                    }
                });
                if (DepJson["results"].length > 0) {
                    var oVboxM0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    var oHboxM0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    this.oWizardStepm1.addContent(oVboxM0);
                    oVboxM0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("SELREQ") + "</strong></p>" })
                        ]
                    }));
                    for (var i = 0; i < DepJson["results"].length; i++) {
                        var idc = "chboxm" + i;
                        var textc = DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
                        if (i == 0) {
                            oHboxM0.addItem(new sap.m.CheckBox({ id: idc, text: textc, selected: true }));
                        }
                        else {
                            oHboxM0.addItem(new sap.m.CheckBox({ id: idc, text: textc }));
                        }
                    }
                    oVboxM0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            oHboxM0
                        ]
                    }));
                }

                var oVboxM11 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxM1 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxM1.addItem(new sap.m.RadioButton({
                    id: "rbm11",
                    groupName: "CollectionM11", text: oBundle.getText("YES"), selected: true,
                    select: function () {
                        oVboxM12.setVisible(true);
                        oVboxM111.setVisible(false);
                    }
                }));
                oHboxM1.addItem(new sap.m.RadioButton({
                    id: "rbm12",
                    groupName: "CollectionM11", text: oBundle.getText("NO"),
                    select: function () {
                        oVboxM111.setVisible(true);
                    }
                }));
                oVboxM11.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p> <strong>" + oBundle.getText("LETISSAUDIAR") + "</strong></p>" }),
                        oHboxM1
                    ]
                }));

                var oVboxM111 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxM2 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxM2.addItem(new sap.m.RadioButton({
                    id: "rbm21",
                    groupName: "CollectionM12", text: oBundle.getText("YES"), selected: true,
                    select: function () {
                        oVboxM12.setVisible(true);
                    }
                }));
                oHboxM2.addItem(new sap.m.RadioButton({
                    id: "rbm22",
                    groupName: "CollectionM12", text: oBundle.getText("NO"),
                    select: function () {
                        if (oVboxM12.getVisible()) {
                            oVboxM12.setVisible(false);
                            oVboxM2.setVisible(false);
                            oVboxM31.setVisible(false);
                            oVboxM32.setVisible(false);
                            oVboxM33.setVisible(false);
                            sap.ui.getCore().byId("MOFAStep").setValidated(false);
                            sap.ui.getCore().byId("SADADStep").setValidated(false);
                            sap.ui.getCore().byId("MCDDOCStep").setValidated(false);
                            sap.m.MessageBox.show(oBundle.getText("LETATTSAUDIMOFA"), {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: oBundle.getText("INFO"),
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    if (window.location.href.indexOf("SBY") == -1) {
                                        var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                                    }
                                    else {
                                        try { window.location.assign("about:blank"); }
                                        catch (Exception) { }
                                    }
                                }
                            });
                        }
                    }
                }));
                oVboxM111.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p>  <strong>" + oBundle.getText("LETATTSAUDI") + " </strong></p>" }),
                        oHboxM2
                    ]
                }));

                var oVboxM12 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxM12.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        //					new sap.m.FormattedText({htmlText:"<p>1. Kindly go to <a href=\"https://www.mofa.gov.sa/sites/mofaen/EServ/CitizenAndResidence/Attestation/Pages/Agreement.aspx\" target = \"_blank\"> <strong> Ministry of Foreign Affairs (MOFA) Website </strong> </a> to request for the attestation service </p>"})
                        new sap.m.FormattedText({ htmlText: "<p>1. Kindly go to <a href=\"https://www.mofa.gov.sa/sites/mofaen/EServ/ServiceCatalog/Pages/serviceDetails.aspx?svc=128\" target = \"_blank\"> <strong> Ministry of Foreign Affairs (MOFA) Website </strong> </a> to request for the attestation service </p>" })
                    ]
                }));
                oVboxM12.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("ATTSCRMOFAREQ") })
                    ]
                }));
                var oMofaImg = new sap.m.Image({
                    id: "mofaimage",
                    src: "images/MOFAScreen.PNG",
                    alt: "MOFA Request image",
                    densityAware: true,
                    decorative: false,
                    height: "300px",
                    width: "300px",
                    press: function (oEvent) {
                        fncall.handleMofaPress(oEvent);
                    }
                });
                oVboxM12.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oMofaImg
                    ]
                }));

                var oHeaderParameterM11 = new sap.ui.unified.FileUploaderParameter({ id: "param1", name: "x-csrf-token" });
                var oHeaderParameterM12 = new sap.ui.unified.FileUploaderParameter({ id: "slug1", name: "slug" });
                var oHeaderParameterM13 = new sap.ui.unified.FileUploaderParameter({ name: "X-Requested-With1", value: "XMLHttpRequest" });
                var oHeaderParameterM14 = new sap.ui.unified.FileUploaderParameter({ name: "Content-Type1", value: "text/rtf" });
                var oFileUploaderM1 = new sap.ui.unified.FileUploader({
                    id: "fileUploaderm1",
                    name: "myFileUploadm1",
                    uploadOnChange: false,
                    sendXHR: true,
                    useMultipart: false,
                    placeholder: oBundle.getText("UPLOADMOFAREQ"),
                    buttonText: oBundle.getText("UPLOAD"),
                    headerParameters: [oHeaderParameterM11, oHeaderParameterM12, oHeaderParameterM13, oHeaderParameterM14],
                    uploadComplete: function (oEvent) {
                        fncall.handleUpload1Complete(oEvent);
                    },
                    change: function (oEvent) {
                        fncall.mofaAttach(oEvent);
                    }
                });
                oVboxM12.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oFileUploaderM1
                    ]
                }));

                var oVboxM2 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("ONLBANKSER") })
                    ]
                }));
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "&nbsp;&nbsp;&nbsp;&nbsp;A. Add the bill" })
                    ]
                }));
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. SAMBA: (SADAD Bills > Define Bills > Add bills > Government Sectors > MOFA Services) </strong>" })
                    ]
                }));
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. SABB: (SADAD Bills > Biller number 101 for MOFA) </strong>" })
                    ]
                }));
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "&nbsp;&nbsp;&nbsp;&nbsp;B. Pay the bill and attach the screenshot as below" })
                    ]
                }));
                var sadadimg = new sap.m.Image({
                    id: "sadadimage",
                    src: "images/SADADPayment.png",
                    alt: "MOFA Invoice image",
                    densityAware: true,
                    decorative: false,
                    width: "300px",
                    press: function (oEvent) {
                        fncall.handleSadadPress(oEvent);
                    }
                });
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        sadadimg
                    ]
                }));
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("ATTPROOFPAY") })
                    ]
                }));

                var oHeaderParameterM21 = new sap.ui.unified.FileUploaderParameter({ id: "param2", name: "x-csrf-token" });
                var oHeaderParameterM22 = new sap.ui.unified.FileUploaderParameter({ id: "slug2", name: "slug" });
                var oHeaderParameterM23 = new sap.ui.unified.FileUploaderParameter({ name: "X-Requested-With2", value: "XMLHttpRequest" });
                var oHeaderParameterM24 = new sap.ui.unified.FileUploaderParameter({ name: "Content-Type2", value: "text/rtf" });
                var oFileUploaderM2 = new sap.ui.unified.FileUploader({
                    id: "fileUploaderm2",
                    name: "myFileUploadm2",
                    uploadOnChange: false,
                    sendXHR: true,
                    useMultipart: false,
                    placeholder: oBundle.getText("UPLOADSADADREC"),
                    buttonText: oBundle.getText("UPLOAD"),
                    headerParameters: [oHeaderParameterM21, oHeaderParameterM22, oHeaderParameterM23, oHeaderParameterM24],
                    uploadComplete: function (oEvent) {
                        fncall.handleUpload2Complete(oEvent, PrefJson);
                    },
                    change: function (oEvent) {
                        fncall.sadadAttach(oEvent);
                    }
                });
                oVboxM2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oFileUploaderM2
                    ]
                }));

                var oVboxM31 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxM31.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("FORCON") + "</strong>" })
                    ]
                }));
                var oHboxM31 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxM31.addItem(new sap.m.RadioButton({
                    id: "rbm311",
                    groupName: "CollectionM31", text: oBundle.getText("YES"),
                    select: function () {
                        oVboxM32.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oHboxM31.addItem(new sap.m.RadioButton({
                    id: "rbm312",
                    groupName: "CollectionM31", text: oBundle.getText("NO"), selected: true,
                    select: function () {
                        oVboxM32.setVisible(false);
                        sap.ui.getCore().byId("oMCBConsul").setValue("");
                        sap.ui.getCore().byId("oMCBConsul").setSelectedKey("");
                        fncall.validateCollecInf();
                    }
                }));
                oVboxM31.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p> <strong>" + oBundle.getText("FORCONATTES") + "</strong></p>" }),
                        oHboxM31
                    ]
                }));

                var oVboxM32 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxM32 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oComboBoxM32 = new sap.m.ComboBox({
                    id: "oMCBConsul", width: "200px",
                    selectionChange: function (oEvent) {
                        var mforeignconsulates = sap.ui.getCore().byId("oMCBConsul");
                        mforeignconsulates.setValueState(sap.ui.core.ValueState.None);
                        if (mforeignconsulates.getValue().length == 0) {
                            MessageBox.error(oBundle.getText("KINCONDRO"), {
                                icon: MessageBox.Icon.ERROR,
                            });
                            mforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                            sap.ui.getCore().byId("MOFAStep").setValidated(false);
                            sap.ui.getCore().byId("SADADStep").setValidated(false);
                            sap.ui.getCore().byId("MCDDOCStep").setValidated(false);
                        }
                        else {
                            var CBvalchk = 0;
                            for (var i = 0; i < mforeignconsulates.getItems().length; i++) {
                                if (mforeignconsulates.getItems()[i].getText() == mforeignconsulates.getValue()) {
                                    CBvalchk = 1;
                                    i = mforeignconsulates.getItems().length + 1;
                                }
                            }
                            if (CBvalchk == 0) {
                                MessageBox.error(oBundle.getText("ENTVALNOALLOWDRDOW"), {
                                    icon: MessageBox.Icon.ERROR,
                                });
                                mforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                                sap.ui.getCore().byId("MOFAStep").setValidated(false);
                                sap.ui.getCore().byId("SADADStep").setValidated(false);
                                sap.ui.getCore().byId("MCDDOCStep").setValidated(false);
                            }
                            else {
                                fncall.validateCollecInf();
                            }
                        }
                    }
                });
                oComboBoxM32.setModel(consulateModel);
                var oListItemM32 = new sap.ui.core.ListItem();
                oListItemM32.bindProperty("key", "code");
                oListItemM32.bindProperty("text", "description");
                oComboBoxM32.bindItems("/results", oListItemM32);
                oHboxM32.addItem(oComboBoxM32);
                oVboxM32.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p> <strong>" + oBundle.getText("SELCONS") + "</strong></p>" }),
                        oComboBoxM32
                    ]
                }));

                var oVboxM33 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxM33.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("POSTDOCGACEN") })
                    ]
                }));
                oVboxM33.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("COLL") + " </strong>" })
                    ]
                }));
                var oHboxM31 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxM31.addItem(new sap.m.RadioButton({
                    id: "rbm31",
                    groupName: "CollectionM32", text: oBundle.getText("DROPOFFMYSELF"), visible: false, // selected:true,
                    select: function () {
                        sap.ui.getCore().byId("isMOFAPickup").setVisible(false);
                        if (sap.ui.getCore().byId("rbm33").getSelected()) {
                            oFormm2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxM31.addItem(new sap.m.RadioButton({
                    id: "rbm32",
                    groupName: "CollectionM32", text: oBundle.getText("UPSPICKUP"), selected: true,
                    select: function () {
                        sap.ui.getCore().byId("isMOFAPickup").setVisible(true);
                        oFormm2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oHboxM31.addItem(new sap.m.Text({ id: "isMOFAPickup", visible: true, text: oBundle.getText("COLLTIME") }));
                oVboxM33.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxM31
                    ]
                }));

                oVboxM33.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("DELIV") + "</strong>" })
                    ]
                }));
                var oHboxM32 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxM32.addItem(new sap.m.RadioButton({
                    id: "rbm33",
                    groupName: "DeliveryM11", text: oBundle.getText("PICUPMYSELF"), visible: false, // selected:true,
                    select: function () {
                        if (sap.ui.getCore().byId("rbm31").getSelected()) {
                            oFormm2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxM32.addItem(new sap.m.RadioButton({
                    id: "rbm34",
                    groupName: "DeliveryM11", text: oBundle.getText("UPSDELV"), selected: true,
                    select: function () {
                        oFormm2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oVboxM33.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxM32
                    ]
                }));

                var oLayoutm2 = new sap.ui.layout.form.ResponsiveGridLayout({
                    columnsL: 2,
                    columnsM: 2,
                    breakpointM: 800
                });

                var oFormm2 = new sap.ui.layout.form.Form({
                    layout: oLayoutm2,
                    editable: true,
                    formContainers: [
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("Name", "Bold"),
                                    fields: [fncall.crMInput("fm_name", EmpJson.FirstName + " " + EmpJson.MiddleName + " " + EmpJson.LastName, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("KAUST ID", "Bold"),
                                    fields: [fncall.crMInput("fm_kaustid", EmpJson.KaustID, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("Mobile Number", "Bold"),
                                    fields: [fncall.crMInput("fm_mobile", PrefJson.mobile_no, true)]
                                })
                            ]
                        }),
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("Building Name/No", "Bold"),
                                    fields: [fncall.crMInput("fm_bnum", PrefJson.building_no, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("Level", "Bold"),
                                    fields: [fncall.crMInput("fm_level", PrefJson.level_b, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crMLabel("Room No/Cubicle", "Bold"),
                                    fields: [fncall.crMInput("fm_bname", PrefJson.building_name, true)]
                                })
                            ]
                        })
                    ]
                });

                if (sap.ui.getCore().byId("fm_mobile").getValue().length > 0) {
                    var mobileval = sap.ui.getCore().byId("fm_mobile").getValue().match(/(\d+)/);
                    if (mobileval != null) {
                        sap.ui.getCore().byId("fm_mobile").setValue(mobileval[0]);
                    }
                }
                sap.ui.getCore().byId("fm_mobile").setType("Number");
                oVboxM33.addItem(oFormm2);
                sap.ui.getCore().byId("isMOFAPickup").addStyleClass("redClass");

                //			oFormm2.setVisible(false);
                oVboxM111.setVisible(false);
                oVboxM32.setVisible(false);
                sap.ui.getCore().byId("rbm11").setSelected(true);
                sap.ui.getCore().byId("rbm21").setSelected(true);
                //			sap.ui.getCore().byId("rbm31").setSelected(true);
                //			sap.ui.getCore().byId("rbm33").setSelected(true);
                sap.ui.getCore().byId("rbm312").setSelected(true);

                this.oWizardStepm1.setValidated(false);
                this.oWizardStepm2.setValidated(false);
                this.oWizardStepm3.setValidated(false);

                this.oWizardStepm1.addContent(oVboxM11);
                this.oWizardStepm1.addContent(oVboxM111);
                this.oWizardStepm1.addContent(oVboxM12);
                this.oWizardStepm2.addContent(oVboxM2);
                this.oWizardStepm3.addContent(oVboxM31);
                this.oWizardStepm3.addContent(oVboxM32);
                this.oWizardStepm3.addContent(oVboxM33);

                this.oWizardM.addStep(this.oWizardStepm1);
                this.oWizardM.addStep(this.oWizardStepm2);
                this.oWizardM.addStep(this.oWizardStepm3);

                oPageM.addContent(this.oWizardM);
                fncall.validateCollecInf();
            },

            function(response) {
                return "";
            },

            handleMofaPress: function (oEvent) {
                if (!this._oPopover1) {
                    this._oPopover1 = sap.ui.xmlfragment("zui5_ga_attest.mofapop", this);
                    this.getView().addDependent(this._oPopover1);
                }
                this._oPopover1.openBy(oEvent.getSource());
            },

            handleSadadPress: function (oEvent) {
                if (!this._oPopover2) {
                    this._oPopover2 = sap.ui.xmlfragment("zui5_ga_attest.sadadpop", this);
                    this.getView().addDependent(this._oPopover2);
                }
                this._oPopover2.openBy(oEvent.getSource());
            },

            validateCollecInf: function (oEvent) {
                var fncall = this;
                sap.ui.getCore().byId("fm_mobile").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fm_bnum").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fm_level").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fm_bname").setValueState(sap.ui.core.ValueState.None);
                var mforeignconsulates = sap.ui.getCore().byId("oMCBConsul");
                mforeignconsulates.setValueState(sap.ui.core.ValueState.None);
                var oFileUploaderM1 = sap.ui.getCore().byId("fileUploaderm1");
                var oFileUploaderM2 = sap.ui.getCore().byId("fileUploaderm2");
                sap.ui.getCore().byId("MOFAStep").setValidated(false);
                sap.ui.getCore().byId("SADADStep").setValidated(false);
                sap.ui.getCore().byId("MCDDOCStep").setValidated(false);

                if (oFileUploaderM1.getValue().length > 0)
                    sap.ui.getCore().byId("MOFAStep").setValidated(true);
                if (oFileUploaderM1.getValue().length > 0 && oFileUploaderM2.getValue().length > 0)
                    sap.ui.getCore().byId("SADADStep").setValidated(true);
                if ((sap.ui.getCore().byId("rbm311").getSelected() && mforeignconsulates.getValue().length == 0) || ((sap.ui.getCore().byId("rbm32").getSelected() ||
                    sap.ui.getCore().byId("rbm34").getSelected()) && (sap.ui.getCore().byId("fm_bnum").getValue().length == 0 ||
                        sap.ui.getCore().byId("fm_level").getValue().length == 0 || sap.ui.getCore().byId("fm_bname").getValue().length == 0 ||
                        !this.validateTelephoneNum(null, sap.ui.getCore().byId("fm_mobile").getValue()) || isNaN(sap.ui.getCore().byId("fm_mobile").getValue()))) ||
                    oFileUploaderM1.getValue().length == 0 || oFileUploaderM2.getValue().length == 0) {
                    if (!this.validateTelephoneNum(null, sap.ui.getCore().byId("fm_mobile").getValue()) || isNaN(sap.ui.getCore().byId("fm_mobile").getValue()))
                        sap.ui.getCore().byId("fm_mobile").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fm_bnum").getValue().length == 0)
                        sap.ui.getCore().byId("fm_bnum").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fm_level").getValue().length == 0)
                        sap.ui.getCore().byId("fm_level").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fm_bname").getValue().length == 0)
                        sap.ui.getCore().byId("fm_bname").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("rbm311").getSelected() && mforeignconsulates.getValue().length == 0)
                        mforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("MCDDOCStep").setValidated(false);
                }
                else {
                    sap.ui.getCore().byId("MCDDOCStep").setValidated(true);
                }
            },

            crMLabel: function (oLtext, oLDesc) //, oLWidth)
            {
                var oLabel = new sap.m.Label();
                oLabel.setText(oLtext);
                oLabel.setDesign(oLDesc);
                oLabel.addStyleClass("myLabel");
                oLabel.setTextAlign("Begin");
                return oLabel;
            },

            crMInput: function (sid, value, type) {
                var fncall = this;
                if (sid == "fm_bnum" || sid == "fm_level" || sid == "fm_mobile" || sid == "fm_bname") {
                    var oInput = new sap.m.Input({
                        id: sid,
                        liveChange: function (oEvent) {
                            fncall.validateCollecInf();
                        }
                    });
                }
                else {
                    var oInput = new sap.m.Input({ id: sid });
                }
                oInput.setValue(value);
                oInput.setEditable(type);
                oInput.setWidth("90%");
                return oInput;
            },

            handleUpload1Complete: function (oEvent) {
                var fncall = this;
                var fileStatus = oEvent.getParameters("status");
                // if (fileStatus.status !== 201) {
                // 	MessageBox.error(fileStatus.fileName + " file Upload Failed", {
                // 		icon: MessageBox.Icon.ERROR,
                // 	});
                // }
                // else
                // {
                var oFileUploaderM2 = sap.ui.getCore().byId("fileUploaderm2");
                var oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                oTokenModel.refreshSecurityToken();
                if (oFileUploaderM2.getValue().length !== 0) {
                    var sDocName2 = oFileUploaderM2.getValue().toUpperCase();
                    fncall.fileUpload(sDocName2, oFileUploaderM2, oTokenModel, "param2", "slug2", this.requestId, "29");
                }
                // }
            },

            handleUpload2Complete: function (oEvent, PrefJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var fileStatus = oEvent.getParameters("status");
                // if (fileStatus.status !== 201) 
                // {
                // 	MessageBox.error(fileStatus.fileName + " file Upload Failed", {
                // 		icon: MessageBox.Icon.ERROR,
                // 	});
                // }
                var preferenceData = this.formatPreferenceData(PrefJson);
                if ((sap.ui.getCore().byId("rbm32").getSelected()) == true || (sap.ui.getCore().byId("rbm34").getSelected()) == true) {
                    preferenceData.deliv_flag = "1";
                    if (!this.validatePreferenceData(preferenceData)) {
                        this.oBusyDialogCreate.close();
                        return;
                    }
                }
                if (preferenceData.deliv_flag = "1") {
                    fncall.updatePreferenceData(preferenceData);
                }

                jQuery.sap.delayedCall(100, this, function () {
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(oBundle.getText("YOUREQID") + fncall.requestId + "'.", {
                        //						"Please put your money with the documents and we will be confirming the amount immediately upon receiving the application on the portal", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: oBundle.getText("REQSUBSUCCESS"),
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (oAction) {
                            try {
                                // if(window.location.href.indexOf("SBY") == -1)
                                // {
                                // 	var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                // 	window.location.href =  gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html" ;
                                // }
                                // else
                                // {
                                // 	try	{ window.location.assign("about:blank"); }
                                // 	catch(Exception) {  }
                                // }
                            } catch (Exception) { return; }
                        }
                    });
                    this.oBusyDialogCreate.close();
                });
            },

            mofaAttach: function (oEvent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var oFileUploaderM1 = sap.ui.getCore().byId("fileUploaderm1");
                var oFileUploaderM2 = sap.ui.getCore().byId("fileUploaderm2");
                if (oFileUploaderM1.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("MOFAREQSCRATMISS"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                    this.oWizardStepm1.setValidated(false);
                    this.oWizardStepm2.setValidated(false);
                    this.oWizardStepm3.setValidated(false);
                }
                else {
                    this.oWizardStepm1.setValidated(true);
                }
                fncall.validateCollecInf();
            },

            sadadAttach: function (oEvent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var oFileUploaderM1 = sap.ui.getCore().byId("fileUploaderm1");
                var oFileUploaderM2 = sap.ui.getCore().byId("fileUploaderm2");
                if (oFileUploaderM2.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("SADADPRPAYATT"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                    this.oWizardStepm1.setValidated(false);
                    this.oWizardStepm2.setValidated(false);
                    this.oWizardStepm3.setValidated(false);
                }
                else {
                    this.oWizardStepm2.setValidated(true);
                }
                fncall.validateCollecInf();
            },

            onSubmit: function (oEvent, PrefJson, DepJson, EmpJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var collectionmtd = "0";
                var deliverymtd = "0";
                var missuedksa = "";
                var mattestedksa = "";
                var mforeignconsulates = sap.ui.getCore().byId("oMCBConsul").getSelectedKey();
                if (sap.ui.getCore().byId("rbm11").getSelected()) {
                    missuedksa = "X";
                }
                if (sap.ui.getCore().byId("rbm21").getSelected()) {
                    mattestedksa = "X";
                }
                if (sap.ui.getCore().byId("rbm32").getSelected()) {
                    collectionmtd = "1";
                }
                if (sap.ui.getCore().byId("rbm34").getSelected()) {
                    deliverymtd = "1";
                }

                var DependentsKaustid = "";
                for (var i = 0; i < DepJson["results"].length; i++) {
                    var idc = "chboxm" + i;
                    if (sap.ui.getCore().byId(idc).getSelected()) {
                        if (DependentsKaustid.length == 0)
                            DependentsKaustid = DependentsKaustid + DepJson["results"][i].KaustId;
                        else
                            DependentsKaustid = DependentsKaustid + "." + DepJson["results"][i].KaustId;
                    }
                }

                var userdata = this.getView().getModel("EmpDetails").getData();
                var oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                oTokenModel.refreshSecurityToken();
                var oFileUploaderM1 = sap.ui.getCore().byId("fileUploaderm1");
                var oFileUploaderM2 = sap.ui.getCore().byId("fileUploaderm2");

                if (oFileUploaderM1.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("MOFAREQSCRATMISS"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                }
                else if (oFileUploaderM2.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("SADADPRPAYATT"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                }
                else if (sap.ui.getCore().byId("rbm311").getSelected() && mforeignconsulates.length == 0) {
                    MessageBox.error(oBundle.getText("KINCONDROP"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                }
                else if (DependentsKaustid.length == 0) {
                    MessageBox.error(oBundle.getText("KINDSELATONEREQ"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                }
                else {
                    this.oBusyDialogCreate = new sap.m.BusyDialog({ text: oBundle.getText("CREATENEWREQ") });
                    this.oBusyDialogCreate.open();
                    jQuery.sap.delayedCall(100, this, function () {
                        try {
                            var that = this;
                            var data =
                            {
                                "c_kaust_issued": "",
                                "c_outside_ksa": "",
                                "c_no_of_attestation": "",
                                "m_issuesd_ksa": missuedksa,
                                "m_attested_ksa": mattestedksa,
                                "m_foreign_consulates": mforeignconsulates,
                                "f_attested_mofa": "",
                                "f_foreign_consulates": "",
                                "f_consulate_attestation": "",
                                "collection_mtd": collectionmtd,
                                "delivery_mtd": deliverymtd,
                                "dependents_kaustid": DependentsKaustid,


                            };

                            var header = {
                                "GAHeader": {
                                    "comments": "Documents Attestation from MOFA Service Request",
                                    "kaust_id": EmpJson.KaustID
                                },
                                "header": {
                                    "sub_service_code": "1701",
                                    "service_code": "0017",
                                    "status": 1
                                }
                                ,
                                "log": [{
                                    "sequence_number": 1,
                                    "timestamp": "8",
                                    "status": 1,
                                    "userid": EmpJson.UserId
                                }]
                            }


                            //Create an entry in DocumentAttestationSet
                            var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                            var preferenceModel = new sap.ui.model.json.JSONModel();
                            var sRequestURL = "/DocumentAttestationSet";
                            var that = this;
                            oGAModel.create(sRequestURL, data, {
                                success: function (oData, oResponse) {
                                    that.requestId = oData.request_id;
                                    if (oFileUploaderM1.getValue().length !== 0) {
                                        var sDocName1 = oFileUploaderM1.getValue().toUpperCase();
                                        that.fileUpload(sDocName1, oFileUploaderM1, oTokenModel, "param1", "slug1", that.requestId, "27");
                                    }
                                    else {
                                        if (oFileUploaderM2.getValue().length !== 0) {
                                            var sDocName2 = oFileUploaderM2.getValue().toUpperCase();
                                            that.fileUpload(sDocName2, oFileUploaderM2, oTokenModel, "param2", "slug2", that.requestId, "29");
                                        }
                                    }
                                },
                                error: function (jqXHR, textStatus) {
                                    that.oBusyDialogCreate.close();
                                    alert(oBundle.getText("REQCREFAIL"));
                                    return;
                                }
                            });
                        } catch (Exception) {
                            this.oBusyDialogCreate.close();
                            alert(Exception.message);
                        }

                    });
                }
            },

            fileUpload: function (sDocName, oFileUploader, oTokenModel, param, slug, requestId, DocType) {
                var that = this;
                sDocName = sDocName.replace(/[^a-zA-Z0-9-_\.]/g, "");
                oFileUploader.setValue(sDocName);
                sap.ui.getCore().byId(param).setValue(oTokenModel.getHeaders()["x-csrf-token"]);
                sap.ui.getCore().byId(slug).setValue(oFileUploader.getValue() + "," + requestId + "," + DocType + ",99991231");
                // oFileUploader.setUploadUrl("/sap/opu/odata/SAP/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
                oFileUploader.upload();
            },

            getTodayDate: function (oDateVal) {
                var sMonth = oDateVal.getMonth() + 1;
                sMonth = sMonth.toString();
                var sDate = oDateVal.getDate().toString();
                if (sMonth.length !== 2) {
                    sMonth = "0" + sMonth;
                }
                if (sDate.length !== 2) {
                    sDate = "0" + sDate;
                }
                return oDateVal.getFullYear().toString() + "-" + sMonth + "-" + sDate + "T00:00:00";
            },

            _getBaseURL: function () {
                var e = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                return jQuery.sap.getModulePath(e);
            },

            checkExistingProcesses: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                UserId
                var oModelGasc = this.getView().getModel("EmpDetails");
                var userdata = oModelGasc.getData();
                var that = this;
                var sKaustIds = "";
                sKaustIds = sKaustIds + "KaustId eq '" + userdata.KaustID;
                var oResult;
                var sRequestURL = this._getBaseURL() + "/v2/CheckRequest()?kaust_id='" + userdata.KaustID + "'&userid='" + userdata.UserId + "'&sub_service_code='1701'";

                $.ajax({
                    url: sRequestURL,
                    method: "GET",
                    success: function (oData, response) {
                        var oLength = oData.results.length;
                        var sMsg = oBundle.getText("REQALEXIKAUSTID");
                        if (oLength > 0) {
                            for (var j = 0; j < oLength; j++) {
                                var sMsg = sMsg + oData.results[j].KaustId + " and ";
                            }
                            sMsg = sMsg.substring(0, sMsg.length - 5);
                            sap.m.MessageBox.show(sMsg, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: oBundle.getText("ERROR"),
                                actions: [sap.m.MessageBox.Action.OK],
                            });
                            oResult = false;
                        }
                    }
                });



                var oModelGasc1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                var sURL = "CheckRequestSet?$filter=SubServiceCode eq '1701' and KaustId eq '" + userdata.KaustID + "'";
                oModelGasc1.read(sURL, null, null, false, function (oData, response) {
                    var oLength = oData.results.length;
                    var sMsg = oBundle.getText("REQALEXIKAUSTID");
                    if (oLength > 0) {
                        for (var j = 0; j < oLength; j++) {
                            var sMsg = sMsg + oData.results[j].KaustId + " and ";
                        }
                        sMsg = sMsg.substring(0, sMsg.length - 5);
                        sap.m.MessageBox.show(sMsg, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oBundle.getText("ERROR"),
                            actions: [sap.m.MessageBox.Action.OK],
                        });
                        oResult = false;
                    }
                    else {
                        oResult = true;
                    }
                });
                return oResult;
            },

            /** If there is change in the preference data
                * update in respective tables */
            updatePreferenceData: function (preferenceData) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var preferenceModel = new sap.ui.model.json.JSONModel();
                var sRequestURL = "/MyPreferencesCollection";
                var that = this;

                if (preferenceData.kaust_id && preferenceData.sub_service_code) {
                    if (preferenceData.no_serv_code == "X") {
                        oGAModel.create(sRequestURL, preferenceData, {

                            success: function (oData, oResponse) {
                            },
                            error: function (jqXHR, textStatus) {
                                sap.m.MessageBox.alert(oBundle.getText("ERRORSAVPREFDET"), {
                                    title: oBundle.getText("ERROR"),
                                    onClose: null,
                                    textDirection: sap.ui.core.TextDirection.Inherit
                                });
                            }
                        });
                    }
                    else {
                        sRequestURL = oGAModel.createKey("/MyPreferencesCollection", {
                            kaust_id: preferenceData.kaust_id,
                            sub_service_code: "1701"
                        });
                        oGAModel.update(sRequestURL,
                            preferenceData, null, function () {
                            },
                            function (oError) {
                                sap.m.MessageBox.alert(oBundle.getText("ERRORUPPREFDET"), {
                                    title: oBundle.getText("ERROR"),
                                    onClose: null,
                                    textDirection: sap.ui.core.TextDirection.Inherit
                                });
                            });
                    }
                }
            },

            formatPreferenceData: function (PrefJson) {
                var userData = this.getView().getModel("EmpDetails").getData();
                var preferenceData = this.getView().getModel("PrefDetails").getData();
                preferenceData.sub_service_code = "1701";
                preferenceData.first_name = userData.FirstName;
                preferenceData.middle_name = userData.MiddleName;
                preferenceData.last_name = userData.LastName;
                preferenceData.deliv_flag = "0";
                preferenceData.no_serv_code = PrefJson.no_serv_code;
                if (preferenceData.kaust_id == "") {
                    preferenceData.kaust_id = userData.kaust_id;
                }
                preferenceData.userid = userData.UserId;
                preferenceData.mobile_no = sap.ui.getCore().byId("fm_mobile").getValue();
                preferenceData.building_name = sap.ui.getCore().byId("fm_bname").getValue();
                preferenceData.building_no = sap.ui.getCore().byId("fm_bnum").getValue();
                preferenceData.level_b = sap.ui.getCore().byId("fm_level").getValue();
                return preferenceData;
            },

            validatePreferenceData: function (data) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                if (!this.validateTelephoneNum(null, data.mobile_no)) {
                    sap.m.MessageBox.alert(oBundle.getText("INVTELPNUM"), {
                        title: oBundle.getText("ERROR"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return false;
                }
                if (!this.validateLevel(null, data.level_b)) {
                    sap.m.MessageBox.alert(oBundle.getText("PLEENTERLEV"), {
                        title: oBundle.getText("ERROR"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return false;
                }
                if (!this.validateBuildingName(null, data.building_name)) {
                    sap.m.MessageBox.alert(oBundle.getText("PLEROOMCUB"), {
                        title: oBundle.getText("ERROR"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return false;
                }
                if (!this.validateBuildingNum(null, data.building_no)) {
                    sap.m.MessageBox.alert(oBundle.getText("PLEBUILNAMENO"), {
                        title: oBundle.getText("ERROR"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return false;
                }
                return true;
            },


            validateTelephoneNum: function (oEvent, mobileNum) {
                if (!mobileNum && mobileNum != "") {
                    mobileNum = oEvent.getSource().getValue();
                }
                if (mobileNum !== "" && mobileNum !== undefined) {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                } else {
                    if (mobileNum == "") {
                        if (oEvent) {
                            oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                        }
                        return false;
                    }
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    }
                    return false;
                }
            },

            validateEmail: function (oEvent, email) {
                if (!email && email != "") {
                    email = oEvent.getSource().getValue();
                }
                var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (reg.test(email)) {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                } else {
                    if (email == "") {
                        if (oEvent) {
                            oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                        }
                        return true;
                    }
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    }
                    return false;
                }
            },

            validateLevel: function (oEvent, level) {
                if (!level && level != "") {
                    level = oEvent.getSource().getValue();
                }
                if (level == "") {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    }
                    return false;
                }
                else {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                }
            },

            validateBuildingName: function (oEvent, buildingName) {
                if (!buildingName && buildingName != "") {
                    buildingName = oEvent.getSource().getValue();
                }
                if (buildingName == "") {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    }
                    return false;
                }
                else {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                }
            },

            validateBuildingNum: function (oEvent, buildingNum) {
                if (!buildingNum && buildingNum != "") {
                    buildingNum = oEvent.getSource().getValue();
                }
                if (buildingNum == "") {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    }
                    return false;
                }
                else {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                }
            },
            getDeepData: function () {
                var data = {
                    "results": [{
                        Amount: "0.0000",
                        ArabicFirstName: "",
                        ArabicLastName: "",
                        ArabicMiddleName: "",
                        BorderNumber: "",
                        Categorytype: "PERNR",
                        Cendda: null,
                        Comments: "",
                        Costcenter: "0000040350",
                        Countryofissue: "",
                        Currency: "",
                        DMANAGERID: "",
                        Dateofissue: "2017-05-01T00:00:00",
                        DegreeType: "",
                        DependantOnly: "false",
                        Dob: "1967-01-19T00:00:00",
                        Duration: "000",
                        Email: "NAVYA.Krishna@cognizant.com",
                        ExpDate: null,
                        Expeditor: "",
                        Fasttrack: "",
                        FileName: "",
                        FinComments: "",
                        Fine: "0.0000",
                        Fname: "Umar",
                        GAComments: "",
                        Gender: "Male",
                        HIqamaEdate: "1441/03/20",
                        HijriExpDate: "",
                        IndvAmount: "0.0000",
                        IqamaDuration: "0",
                        IqamaEdate: "2023-11-11T00:00:00",
                        IqamaJobTitle: "فني حاسب آلي",
                        IqamaNo: "2329526368",
                        Iqmarenew: "",
                        Iskaustemp: "false",
                        KaustId: "100039",
                        Lastrecord: "false",
                        Lname: "Mehboob",
                        Lock: "",
                        Mname: "Mid",
                        Msg1: "Record already exists",
                        Msg2: "",
                        Msg3: "",
                        Msg4: "",
                        Msg5: "",
                        MsgTyp1: "E",
                        MsgTyp2: "",
                        MsgTyp3: "",
                        MsgTyp4: "",
                        MsgTyp5: "",
                        Nation: "",
                        Nationality: "American",
                        NationalityCode: "US",
                        NewExpDate: null,
                        NewPassport: "",
                        Onbehalf: "",
                        PassEdate: "2027-04-30T00:00:00",
                        Passport: "X9876543",
                        PassportExpiry: null,
                        PassportLost: "false",
                        Placeofissue: "",
                        Position: "End User Computing Suppor",
                        ProcessId: "",
                        Purpose: "",
                        Relationship: "",
                        ReqComment: "",
                        RequestId: "0010079258",
                        RequestorKaustID: "",
                        SaudiNo: "",
                        SequenceNumber: "0",
                        ServiceCall: "",
                        ServiceCode: "",
                        Stage: "",
                        Status: "005",
                        StudentVisitor: "false",
                        SubServiceCode: "",
                        TimeStamp: null,
                        Trackingid: "",
                        Type: "STAFF",
                        Url: "",
                        UserId: "TST_EMPLOYEE",
                        VisaExpired: "false",
                        Wbs: "",
                        age: "54",
                        apply_for: "0 ",
                        date_of_birth: null,
                        gaFileName: "",
                        gaUrl: "",
                        id_number: "",
                        location: "0 ",
                        name: "",
                        org_name: "End User Computing",
                        org_unit: "30000288",
                        pickup_type: "0 ",
                        rep_date: null,
                        rescheduled: "",
                        service: "0 ",
                        service_type: "0 ",
                        t_kaustid: "",
                        t_name: "",
                        t_role: "",
                        t_userid: "",
                        visitors: "0 ",

                    },
                    {
                        Amount: "0.0000",
                        ArabicFirstName: "",
                        ArabicLastName: "",
                        ArabicMiddleName: "",
                        BorderNumber: "",
                        Categorytype: "",
                        Cendda: null,
                        Comments: "",
                        Costcenter: "",
                        Countryofissue: "",
                        Currency: "",
                        DMANAGERID: "",
                        Dateofissue: null,
                        DegreeType: "",
                        DependantOnly: "false",
                        Dob: null,
                        Duration: "000",
                        Email: "",
                        ExpDate: null,
                        Expeditor: "",
                        Fasttrack: "",
                        FileName: "",
                        FinComments: "",
                        Fine: "0.0000",
                        Fname: "Mathilde",
                        GAComments: "",
                        Gender: "Unknown",
                        HIqamaEdate: "1441/03/20",
                        HijriExpDate: "",
                        IndvAmount: "0.0000",
                        IqamaDuration: "0",
                        IqamaEdate: "2023-11-11T00:00:00",
                        IqamaJobTitle: "",
                        IqamaNo: "",
                        Iqmarenew: "",
                        Iskaustemp: "false",
                        KaustId: "101054",
                        Lastrecord: "false",
                        Lname: "Jensen",
                        Lock: "",
                        Mname: "",
                        Msg1: "",
                        Msg2: "",
                        Msg3: "",
                        Msg4: "",
                        Msg5: "",
                        MsgTyp1: "",
                        MsgTyp2: "",
                        MsgTyp3: "",
                        MsgTyp4: "",
                        MsgTyp5: "",
                        Nation: "Blue",
                        Nationality: "",
                        NationalityCode: "",
                        NewExpDate: null,
                        NewPassport: "",
                        Onbehalf: "",
                        PassEdate: null,
                        Passport: "",
                        PassportExpiry: null,
                        PassportLost: "false",
                        Placeofissue: "",
                        Position: "",
                        ProcessId: "",
                        Purpose: "",
                        Relationship: "Spouse",
                        ReqComment: "",
                        RequestId: "",
                        RequestorKaustID: "",
                        SaudiNo: "",
                        SequenceNumber: "0",
                        ServiceCall: "",
                        ServiceCode: "",
                        Stage: "",
                        Status: "000",
                        StudentVisitor: "false",
                        SubServiceCode: "",
                        TimeStamp: null,
                        Trackingid: "",
                        Type: "",
                        Url: "",
                        UserId: "",
                        VisaExpired: "false",
                        Wbs: "",
                        age: "0",
                        apply_for: "0 ",
                        date_of_birth: null,
                        gaFileName: "",
                        gaUrl: "",
                        id_number: "",
                        location: "0 ",
                        name: "",
                        org_name: "",
                        org_unit: "00000000",
                        pickup_type: "0 ",
                        rep_date: null,
                        rescheduled: "",
                        service: "0 ",
                        service_type: "0 ",
                        t_kaustid: "",
                        t_name: "",
                        t_role: "",
                        t_userid: "",
                        visitors: "0 "
                    }
                    ]
                };

                return data;
            },

        });
    });


//-----------------------------------------------------------------------------------------------------------------------------------------------------