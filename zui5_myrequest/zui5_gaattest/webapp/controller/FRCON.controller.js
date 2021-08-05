sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageBox'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.kaust.zui5gaattest.controller.FRCON", {
            onInit: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var that = this;
                var EmpJson;
                var DepJson;
                var PrefJson;
                var ConsJson;
                var d_kaustid;

                this.oWizardF = new sap.m.Wizard({
                    id: "FRCONAttestation",
                    finishButtonText: oBundle.getText("SUBREQ"),
                    enableBranching: true,
                    height: "95%",
                    complete: function (oEvent) {
                        fncall.onSubmit(oEvent, PrefJson, DepJson);
                    }
                });

                this.oWizardStepf1 = new sap.m.WizardStep({
                    id: "FRCONStep",
                    nextStep: "FCDDOCStep",
                    title: oBundle.getText("FORCONREQ")
                });

                this.oWizardStepf2 = new sap.m.WizardStep({
                    id: "FCDDOCStep",
                    title: oBundle.getText("COLLDELDOC"),
                    showNextButton: false
                });

                this._wizard = sap.ui.getCore().byId("FRCONAttestation");
                this._oNavContainer = this.getView().byId("FRCONContainer");
                this._oWizardContentPage = this.getView().byId("FRCONAttestPage");

                //Fetch User Details
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

                EmpJson = {
                    "KaustID": "100039",
                    "FirstName": "Umar",
                    "MiddleName": "Mid",
                    "LastName": "Mehboob",
                    "Email": "NAVYA.Krishna@cognizant.com",
                    "UserId": "TST_EMPLOYEE",
                    "Mobile": "",
                    "Office": "",
                    "Landline": "8026427",
                    "Gender": "Male",
                    "Nationality": "American",
                    "Type": "STAFF",
                    "Passport": "X9876543",
                    "Iqama": "2329526368",
                    "SaudiID": "1006062473",
                    "Position": "End User Computing Support",
                    "Deptname": "IT Services",
                    "Costcenter": "0000040350",
                    "Orgunit": "30000288",
                    "Orgname": "End User Computing",
                    "RManagerKid": "100476",
                    "RManager": "LINDA MID ROBERTS",
                    "RManagerMail": "",
                    "RManagerId": "SHAGHRYA",
                    "DManagerKid": "100066",
                    "DManager": "JOHN MID JENSEN",
                    "DManagerMail": "mohammed.najran@kaust.edu.sa",
                    "DManagerId": "FAYADLG",
                    "DegreeType": "",
                    "StudentStatus": "",
                    "IqamaExpDate": "/Date(1574035200000)/",
                    "KaustIdExpiry": "/Date(1715817600000)/",
                    "Manager": "M",
                    "Subcategorytype": "Non-Academic",
                    "VendorNumber": "",
                    "VendorName": "",
                    "VendorDescription": ""
                };
                oDetailsModel.setData(EmpJson);
                this.getView().setModel(oDetailsModel, "EmpDetails");
                oDetailsModel.refresh(true);
                d_kaustid = EmpJson.KaustID;
                this.EmpJson = EmpJson;

                //Fetch dependent details
                var data;
                // var oDependentsModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                // oDependentsModel.read("UserDependents", null, null, false, function(data, response) {
                var oDepDetailsModel = new sap.ui.model.json.JSONModel();
                oDepDetailsModel.setData(data);
                this.getView().setModel(oDepDetailsModel, "DepDetails");
                DepJson = data;
                DepJson = this.getDeepData();
                this.DepJson = DepJson;
                // }, 
                // function(response) 
                // {
                // 	return "";
                // });

                //File Check
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

                filechk = this.getFileAttachmentDetails(null, d_kaustid, doctype);
                if (filechk) {
                    var filechk1 = false;
                    var doctype1 = "1";
                    var errmsg1 = oBundle.getText("PASSNOTUPLAOAD");
                    var filechk1 = this.getFileAttachmentDetails(null, d_kaustid, doctype);
                    if (filechk1) {
                        //Get the preference data
                        this.getPrefData(d_kaustid, EmpJson, DepJson);

                    }
                    else {
                        this.getView().attachInit(function () {
                            sap.m.MessageBox.show(errmsg1, {
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
                }
                else {
                    this.getView().attachInit(function () {
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

            onExit: function () {
                page.destroy();
            },

            /** Fetch the preference data */
            getPrefData: function (KaustID, EmpJson, DepJson) {
                if (KaustID) {
                    var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                    var preferenceModel = new sap.ui.model.json.JSONModel();
                    var sRequestURL = "/MyPreferencesCollection";
                    var that = this;

                    oGAModel.read(sRequestURL, {
                        headers: {
                            "kaust_id": KaustID,
                            "sub_service_code": "1705"
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

            // Get Attachment file URL 
            getFileAttachmentDetails: function (oEvent, kaustid, Doctype) {
                var fncall = this;
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

            // 	Get User Details from the Backend
            getDetailedPage: function (fncall, EmpJson, DepJson, PrefJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oPageF = this.getView().byId("FRCONAttestPage");
                oPageF.addContent(new sap.m.VBox({ height: "10px" }));
                var titletxt = oBundle.getText("WELCOME") + EmpJson.FirstName;
                var oTitle = new sap.m.Title({ text: titletxt, wrapping: true, textAlign: "End", level: "H1", width: "95%" });
                oPageF.addContent(oTitle);
                oPageF.addContent(new sap.m.VBox({ height: "10px" }));

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
                    var oVboxF0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    var oHboxF0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    this.oWizardStepf1.addContent(oVboxF0);
                    oVboxF0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("SELREQ") + "</strong></p>" })
                        ]
                    }));
                    for (var i = 0; i < DepJson["results"].length; i++) {
                        var idc = "chboxf" + i;
                        var textc = DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
                        if (i == 0) {
                            oHboxF0.addItem(new sap.m.CheckBox({ id: idc, text: textc, selected: true }));
                        }
                        else {
                            oHboxF0.addItem(new sap.m.CheckBox({ id: idc, text: textc }));
                        }
                    }
                    oVboxF0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            oHboxF0
                        ]
                    }));
                }

                var oVboxF11 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });

                var oHboxF11 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxF11.addItem(new sap.m.RadioButton({
                    id: "rbf11",
                    groupName: "CollectionF11", text: oBundle.getText("YES"), selected: true,
                    select: function () {
                        oVboxF12.setVisible(true);
                        sap.ui.getCore().byId("FRCONStep").setValidated(true);
                        sap.ui.getCore().byId("FCDDOCStep").setValidated(true);
                        fncall.validateCollecInf();
                    }
                }));
                oHboxF11.addItem(new sap.m.RadioButton({
                    id: "rbf12",
                    groupName: "CollectionF11", text: oBundle.getText("NO"),
                    select: function () {
                        if (oVboxF12.getVisible()) {
                            oVboxF12.setVisible(false);
                            sap.ui.getCore().byId("FRCONStep").setValidated(false);
                            sap.ui.getCore().byId("FCDDOCStep").setValidated(false);
                            sap.m.MessageBox.show(oBundle.getText("MOFAATTEMANDT"), {
                                icon: sap.m.MessageBox.Icon.INFORMATION,
                                title: oBundle.getText("INFO"),
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    try {
                                        var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaattest/MOFAAttest.html";
                                    } catch (Exception) { return; }
                                }
                            });
                        }
                    }
                }));
                oVboxF11.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("LETATTMOFA") + "</strong></p>" }),
                        oHboxF11
                    ]
                }));

                var oVboxF12 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxF12 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });

                var oComboBoxF12 = new sap.m.ComboBox({
                    id: "oFCBConsul",
                    selectionChange: function (oEvent) {
                        var fforeignconsulates = sap.ui.getCore().byId("oFCBConsul");
                        fforeignconsulates.setValueState(sap.ui.core.ValueState.None);
                        if (fforeignconsulates.getValue().length == 0) {
                            MessageBox.error(oBundle.getText("KINCONDROP"), {
                                icon: MessageBox.Icon.ERROR,
                            });
                            fforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                            sap.ui.getCore().byId("FRCONStep").setValidated(false);
                            sap.ui.getCore().byId("FCDDOCStep").setValidated(false);
                        }
                        else {
                            var CBvalchk = 0;
                            for (var i = 0; i < fforeignconsulates.getItems().length; i++) {
                                if (fforeignconsulates.getItems()[i].getText() == fforeignconsulates.getValue()) {
                                    CBvalchk = 1;
                                    i = fforeignconsulates.getItems().length + 1;
                                }
                            }
                            if (CBvalchk == 0) {
                                MessageBox.error(oBundle.getText("ENTVALNOALLOWDRDOW"), {
                                    icon: MessageBox.Icon.ERROR,
                                });
                                fforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                                sap.ui.getCore().byId("FRCONStep").setValidated(false);
                                sap.ui.getCore().byId("FCDDOCStep").setValidated(false);
                            }
                            else {
                                sap.ui.getCore().byId("FRCONStep").setValidated(true);
                                sap.ui.getCore().byId("FCDDOCStep").setValidated(true);
                                fncall.validateCollecInf();
                            }
                        }
                    }
                });
                oComboBoxF12.setModel(consulateModel);
                var oListItemF12 = new sap.ui.core.ListItem();
                oListItemF12.bindProperty("key", "code");
                oListItemF12.bindProperty("text", "description");
                oComboBoxF12.bindItems("/results", oListItemF12);
                oHboxF12.addItem(oComboBoxF12);
                oVboxF12.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("SELCONS") + "</strong></p>" }),
                        oHboxF12
                    ]
                }));

                var oVboxF13 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxF13.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("POSTDOCGACEN") })
                    ]
                }));
                oVboxF13.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong> " + oBundle.getText("COLL") + "</strong>" })
                    ]
                }));
                var oHboxF13 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxF13.addItem(new sap.m.RadioButton({
                    id: "rbf13",
                    groupName: "CollectionF12", text: oBundle.getText("DROPOFFMYSELF"), visible: false, // selected:true,
                    select: function () {
                        sap.ui.getCore().byId("isFCPickup").setVisible(false);
                        if (sap.ui.getCore().byId("rbf15").getSelected()) {
                            oFormf2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxF13.addItem(new sap.m.RadioButton({
                    id: "rbf14",
                    groupName: "CollectionF12", text: oBundle.getText("UPSPICKUP"), selected: true,
                    select: function () {
                        sap.ui.getCore().byId("isFCPickup").setVisible(true);
                        oFormf2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oHboxF13.addItem(new sap.m.Text({ id: "isFCPickup", visible: true, text: oBundle.getText("COLLTIME") }));
                oVboxF13.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxF13
                    ]
                }));

                oVboxF13.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("DELIV") + "</strong>" })
                    ]
                }));
                var oHboxF14 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxF14.addItem(new sap.m.RadioButton({
                    id: "rbf15",
                    groupName: "DeliveryF13", text: oBundle.getText("PICUPMYSELF"), visible: false, // selected:true,
                    select: function () {
                        if (sap.ui.getCore().byId("rbf13").getSelected()) {
                            oFormf2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxF14.addItem(new sap.m.RadioButton({
                    id: "rbf16",
                    groupName: "DeliveryF13", text: oBundle.getText("UPSDELV"), selected: true,
                    select: function () {
                        oFormf2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oVboxF13.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxF14
                    ]
                }));

                var oLayoutf2 = new sap.ui.layout.form.ResponsiveGridLayout({
                    columnsL: 2,
                    columnsM: 2,
                    breakpointM: 800
                });

                var oFormf2 = new sap.ui.layout.form.Form({
                    layout: oLayoutf2,
                    editable: true,
                    formContainers: [
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("Name", "Bold"),
                                    fields: [fncall.crFInput("ff_name", EmpJson.FirstName + " " + EmpJson.MiddleName + " " + EmpJson.LastName, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("KAUST ID", "Bold"),
                                    fields: [fncall.crFInput("ff_kaustid", EmpJson.KaustID, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("Mobile Number", "Bold"),
                                    fields: [fncall.crFInput("ff_mobile", PrefJson.mobile_no, true)]
                                })
                            ]
                        }),
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("Building Name/No", "Bold"),
                                    fields: [fncall.crFInput("ff_bnum", PrefJson.building_no, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("Level", "Bold"),
                                    fields: [fncall.crFInput("ff_level", PrefJson.level_b, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crFLabel("Room No/Cubicle", "Bold"),
                                    fields: [fncall.crFInput("ff_bname", PrefJson.building_name, true)]
                                })
                            ]
                        })
                    ]
                });

                if (sap.ui.getCore().byId("ff_mobile").getValue().length > 0) {
                    var mobileval = sap.ui.getCore().byId("ff_mobile").getValue().match(/(\d+)/);
                    if (mobileval != null) {
                        sap.ui.getCore().byId("ff_mobile").setValue(mobileval[0]);
                    }
                }
                sap.ui.getCore().byId("ff_mobile").setType("Number");
                oVboxF13.addItem(oFormf2);
                sap.ui.getCore().byId("isFCPickup").addStyleClass("redClass");

                //		oFormf2.setVisible(false);
                sap.ui.getCore().byId("FRCONStep").setValidated(false);
                sap.ui.getCore().byId("FCDDOCStep").setValidated(false);

                sap.ui.getCore().byId("rbf11").setSelected(true);
                //		sap.ui.getCore().byId("rbf13").setSelected(true);
                //		sap.ui.getCore().byId("rbf15").setSelected(true);

                this.oWizardStepf1.addContent(oVboxF11);
                this.oWizardStepf1.addContent(oVboxF12);
                this.oWizardStepf2.addContent(oVboxF13);

                this.oWizardF.addStep(this.oWizardStepf1);
                this.oWizardF.addStep(this.oWizardStepf2);

                oPageF.addContent(this.oWizardF);
                fncall.validateCollecInf();
            },

            function(response) {
                return "";
            },

            validateCollecInf: function (oEvent) {
                var fncall = this;
                sap.ui.getCore().byId("ff_mobile").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("ff_bnum").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("ff_level").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("ff_bname").setValueState(sap.ui.core.ValueState.None);
                var fforeignconsulates = sap.ui.getCore().byId("oFCBConsul");
                fforeignconsulates.setValueState(sap.ui.core.ValueState.None);

                if (fforeignconsulates.getValue().length == 0 || ((sap.ui.getCore().byId("rbf14").getSelected() || sap.ui.getCore().byId("rbf16").getSelected()) &&
                    (sap.ui.getCore().byId("ff_bnum").getValue().length == 0 || sap.ui.getCore().byId("ff_level").getValue().length == 0 ||
                        sap.ui.getCore().byId("ff_bname").getValue().length == 0 || !this.validateTelephoneNum(null, sap.ui.getCore().byId("ff_mobile").getValue()) ||
                        isNaN(sap.ui.getCore().byId("ff_mobile").getValue())))) {
                    if (!this.validateTelephoneNum(null, sap.ui.getCore().byId("ff_mobile").getValue()) || isNaN(sap.ui.getCore().byId("ff_mobile").getValue()))
                        sap.ui.getCore().byId("ff_mobile").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("ff_bnum").getValue().length == 0)
                        sap.ui.getCore().byId("ff_bnum").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("ff_level").getValue().length == 0)
                        sap.ui.getCore().byId("ff_level").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("ff_bname").getValue().length == 0)
                        sap.ui.getCore().byId("ff_bname").setValueState(sap.ui.core.ValueState.Error);
                    if (fforeignconsulates.getValue().length == 0)
                        fforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("FCDDOCStep").setValidated(false);
                }
                else {
                    sap.ui.getCore().byId("FRCONStep").setValidated(true);
                    sap.ui.getCore().byId("FCDDOCStep").setValidated(true);
                }
            },

            crFLabel: function (oLtext, oLDesc) //, oLWidth)
            {
                var oLabel = new sap.m.Label();
                oLabel.setText(oLtext);
                oLabel.setDesign(oLDesc);
                oLabel.addStyleClass("myLabel");
                oLabel.setTextAlign("Begin");
                return oLabel;
            },

            crFInput: function (sid, value, type) {
                var fncall = this;
                if (sid == "ff_bnum" || sid == "ff_level" || sid == "ff_mobile" || sid == "ff_bname") {
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


            /** Function called while submitting */
            onSubmit: function (oEvent, PrefJson, DepJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var collectionmtd = "0";
                var deliverymtd = "0";
                var fattestedmofa = "";
                var fconsulateattestation = "X";
                var EmpJson = this.EmpJson;
                var fforeignconsulates = sap.ui.getCore().byId("oFCBConsul");
                if (sap.ui.getCore().byId("rbf11").getSelected()) {
                    fattestedmofa = "X";
                }
                if (sap.ui.getCore().byId("rbf14").getSelected()) {
                    collectionmtd = "1";
                }
                if (sap.ui.getCore().byId("rbf16").getSelected()) {
                    deliverymtd = "1";
                }

                var DependentsKaustid = "";
                for (var i = 0; i < DepJson["results"].length; i++) {
                    var idc = "chboxf" + i;
                    if (sap.ui.getCore().byId(idc).getSelected()) {
                        if (DependentsKaustid.length == 0)
                            DependentsKaustid = DependentsKaustid + DepJson["results"][i].KaustId;
                        else
                            DependentsKaustid = DependentsKaustid + "." + DepJson["results"][i].KaustId;
                    }
                }

                var userdata = this.getView().getModel("EmpDetails").getData();


                fforeignconsulates.setValueState(sap.ui.core.ValueState.None);
                if (fforeignconsulates.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("KINCONDROP"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                    fforeignconsulates.setValueState(sap.ui.core.ValueState.Error);
                }
                else if (DependentsKaustid.length == 0) {
                    MessageBox.error(oBundle.getText("KINDSELATONEREQ"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                }
                else {
                    var oBusyDialogCreate = new sap.m.BusyDialog({ text: oBundle.getText("CREATENEWREQ") });
                    oBusyDialogCreate.open();
                    jQuery.sap.delayedCall(100, this, function () {
                        try {
                            var that = this;
                            var oPreferenceModel = this.getView().getModel('PrefDetails');
                            var oPrefData = oPreferenceModel.getData();
                            var preferenceData = this.formatPreferenceData(oPrefData);
                            if ((sap.ui.getCore().byId("rbf14").getSelected()) == true || (sap.ui.getCore().byId("rbf16").getSelected()) == true) {
                                preferenceData.deliv_flag = "1";
                                if (!this.validatePreferenceData(preferenceData)) {
                                    oBusyDialogCreate.close();
                                    return;
                                }
                            }
                            var data =
                            {
                                "c_kaust_issued": "",
                                "c_outside_ksa": "",
                                "c_no_of_attestation": "",
                                "m_issuesd_ksa": "",
                                "m_attested_ksa": "",
                                "m_foreign_consulates": "",
                                "f_attested_mofa": fattestedmofa,
                                "f_foreign_consulates": fforeignconsulates.getSelectedKey(),
                                "f_consulate_attestation": fconsulateattestation,
                                "collection_mtd": collectionmtd,
                                "delivery_mtd": deliverymtd,
                                "dependents_kaustid": DependentsKaustid,
                                "GAHeader": {
                                    "comments": "Documents Attestation from MOFA Service Request",
                                    "kaust_id": EmpJson.KaustID
                                },
                                "header": {
                                    "sub_service_code": "1705",
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

                            };


                            //Create an entry in DocumentAttestationSet
                            var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                            var preferenceModel = new sap.ui.model.json.JSONModel();
                            var sRequestURL = "/DocumentAttestationSet";
                            var that = this;
                            oGAModel.create(sRequestURL, data, {
                                success: function (oData, oResponse) {
                                    that.requestId = oData.request_id;
                                    jQuery.sap.require("sap.m.MessageBox");
                                    sap.m.MessageBox.show(oBundle.getText("YOUREQID") + oData.request_id + "'. \n\n" +
                                        oBundle.getText("PAYMENTGAAGENT"), {
                                        icon: sap.m.MessageBox.Icon.SUCCESS,
                                        title: oBundle.getText("REQSUBSUCCESS"),
                                        actions: [sap.m.MessageBox.Action.OK]
                                        // onClose: function (oAction) {
                                        //     try {
                                        //         if (window.location.href.indexOf("SBY") == -1) {
                                        //             var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        //             window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                                        //         }
                                        //         else {
                                        //             try { window.location.assign("about:blank"); }
                                        //             catch (Exception) { }
                                        //         }
                                        //     } catch (Exception) { return; }
                                        // }
                                    });
                                    if (preferenceData.deliv_flag == "1") {
                                        that.updatePreferenceData(preferenceData);
                                    }
                                    oBusyDialogCreate.close();
                                },
                                error: function (jqXHR, textStatus) {
                                    oBusyDialogCreate.close();
                                    alert(oBundle.getText("REQCREFAIL"));
                                    return;
                                }
                            });


                        } catch (Exception) {
                            oBusyDialogCreate.close();
                            alert(Exception.message);
                        }

                    });
                }
            },

            getTodayDate: function (oDateVal) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
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


            checkExistingProcesses: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                UserId
                var oModelGasc = this.getView().getModel("EmpDetails");
                var userdata = oModelGasc.getData();
                var that = this;
                var sKaustIds = "";
                sKaustIds = sKaustIds + "KaustId eq '" + userdata.KaustID;
                var oResult;
                var sRequestURL = this._getBaseURL() + "/v2/CheckRequest()?kaust_id='" + userdata.KaustID + "'&userid='" + userdata.UserId + "'&sub_service_code='1705'";

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
                            sub_service_code: "1705"
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
                preferenceData.sub_service_code = "1705";
                preferenceData.first_name = userData.FirstName;
                preferenceData.middle_name = userData.MiddleName;
                preferenceData.last_name = userData.LastName;
                preferenceData.deliv_flag = "0";
                preferenceData.no_serv_code = PrefJson.no_serv_code;
                if (preferenceData.kaust_id == "") {
                    preferenceData.kaust_id = userData.kaust_id;
                }
                preferenceData.userid = userData.UserId;
                preferenceData.mobile_no = sap.ui.getCore().byId("ff_mobile").getValue();
                preferenceData.building_name = sap.ui.getCore().byId("ff_bname").getValue();
                preferenceData.building_no = sap.ui.getCore().byId("ff_bnum").getValue();
                preferenceData.level_b = sap.ui.getCore().byId("ff_level").getValue();
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
            }
        });
    });

//oVboxF11.addItem(new sap.m.FormattedText({htmlText:"<p> Is the letter attested by MOFA? </p>"}));