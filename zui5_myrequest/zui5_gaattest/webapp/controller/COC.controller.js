sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("com.kaust.zui5gaattest.controller.COC", {
            onInit: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var that = this;
                var EmpJson;
                var DepJson;
                var PrefJson;
                var d_kaustid;

                this.oWizardC = new sap.m.Wizard({
                    id: "COCAttestation",
                    finishButtonText: oBundle.getText("SUBREQ"),
                    enableBranching: true,
                    height: "95%",
                    complete: function (oEvent) {
                        fncall.onSubmit(oEvent, PrefJson, DepJson,EmpJson);
                    }
                });

                this.oWizardStepc1 = new sap.m.WizardStep({
                    id: "COCStep",
                    nextStep: "CCDDOCStep",
                    title: oBundle.getText("HAMCOMREQ")
                });

                this.oWizardStepc2 = new sap.m.WizardStep({
                    id: "CCDDOCStep",
                    title: oBundle.getText("COLLDELDOC"),
                    showNextButton: false
                });

                this._wizard = sap.ui.getCore().byId("COCAttestation");
                this._oNavContainer = this.getView().byId("COCContainer");
                this._oWizardContentPage = this.getView().byId("COCAttestPage");

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

                //Get the preference data
                // this.getPrefData(d_kaustid);



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
                    infmsg = oBundle.getText("KINDLATIQAMAUP");
                }

                filechk = this.getFileAttachmentDetails(null, d_kaustid, doctype);
                if (filechk) {
                    //Get the preference data
                    this.getPrefData(d_kaustid, EmpJson, DepJson);
                }
                else {
                    sap.ui.getCore().attachInit(function () {
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
            getPrefData: function (KaustID, EmpJson, DepJson) {
                if (KaustID) {
                    var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                    var preferenceModel = new sap.ui.model.json.JSONModel();
                    var sRequestURL = "/MyPreferencesCollection";
                    var that = this;

                    oGAModel.read(sRequestURL, {
                        headers: {
                            "kaust_id": KaustID,
                            "sub_service_code": "1704"
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
                                location.reload(true);
                            }
                        }
                    }
                }
                );
            },

            // 	Get User Details from the Backend
            getDetailedPage: function (fncall, EmpJson, DepJson, PrefJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oPageC = this.getView().byId("COCAttestPage");
                oPageC.addContent(new sap.m.VBox({ height: "10px" }));
                var titletxt = oBundle.getText("WELCOME") + EmpJson.FirstName;
                var oTitle = new sap.m.Title({ text: titletxt, wrapping: true, textAlign: "End", level: "H1", width: "95%" });
                oPageC.addContent(oTitle);
                oPageC.addContent(new sap.m.VBox({ height: "10px" }));

                $.sap.require("sap.ui.layout.form.Form");
                $.sap.require("sap.ui.layout.form.ResponsiveGridLayout");

                var oAttModel = new sap.ui.model.json.JSONModel();
                oAttModel.setData({
                    values: [
                        { attval: "1" }, { attval: "2" }, { attval: "3" }, { attval: "4" }, { attval: "5" },
                        { attval: "6" }, { attval: "7" }, { attval: "8" }, { attval: "9" }, { attval: "10" },
                        { attval: "11" }, { attval: "12" }, { attval: "13" }, { attval: "14" }, { attval: "15" }
                    ]
                });
                this.getView().setModel(oAttModel);

                if (DepJson["results"].length > 0) {
                    var oVboxC0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    var oHboxC0 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                    this.oWizardStepc1.addContent(oVboxC0);
                    for (var i = 0; i < DepJson["results"].length; i++) {
                        var idc = "chboxc" + i;
                        var textc = DepJson["results"][i].Fname + " " + DepJson["results"][i].Lname;
                        if (i == 0) {
                            oHboxC0.addItem(new sap.m.CheckBox({ id: idc, text: textc, selected: true }));
                        }
                        else {
                            oHboxC0.addItem(new sap.m.CheckBox({ id: idc, text: textc }));
                        }
                    }
                    oVboxC0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("SELREQ") + "</strong></p>" }),
                        ]
                    }));
                    //    		oVboxC0.addItem(oHboxC0);
                    oVboxC0.addItem(new sap.ui.layout.form.SimpleForm({
                        layout: "ResponsiveGridLayout", editable: true,
                        labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                        emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                            oHboxC0
                        ]
                    }));
                }
                var oVboxC1 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxC1 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxC1.addItem(new sap.m.RadioButton({
                    id: "rbc11",
                    groupName: "CollectionC11", text: oBundle.getText("YES"),
                    select: function () {
                        oVboxC2.setVisible(true);
                        oVboxC21.setVisible(true);
                        oVboxC3.setVisible(false);
                        oVboxC4.setVisible(false);
                        sap.ui.getCore().byId("COCStep").setValidated(false);
                        sap.ui.getCore().byId("CCDDOCStep").setValidated(false);
                    }
                }));
                oHboxC1.addItem(new sap.m.RadioButton({
                    id: "rbc12",
                    groupName: "CollectionC11", text: oBundle.getText("NO"), selected: true,
                    select: function () {
                        sap.ui.getCore().byId("COCStep").setValidated(true);
                        sap.ui.getCore().byId("CCDDOCStep").setValidated(true);
                        oVboxC21.setVisible(false);
                        oVboxC2.setVisible(false);
                        oVboxC3.setVisible(true);
                        oVboxC4.setVisible(true);
                    }
                }));
                oVboxC1.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("KAUSTISSLETT") + "</strong></p>" }),
                        oHboxC1
                    ]
                }));

                var oVboxC2 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxC2 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxC2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p>" + oBundle.getText("NOATTKAUSTREG") + "</p>" })
                    ]
                }));
                oHboxC2.addItem(new sap.m.RadioButton({
                    id: "rbc21",
                    groupName: "CollectionC12", text: oBundle.getText("YES"),
                    select: function () {
                        sap.ui.getCore().byId("COCStep").setValidated(false);
                        sap.ui.getCore().byId("CCDDOCStep").setValidated(false);
                        oVboxC3.setVisible(false);
                        oVboxC4.setVisible(false);
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(oBundle.getText("CLOKCONMOFAAPP"), {
                            icon: sap.m.MessageBox.Icon.INFORMATION,
                            title: oBundle.getText("INFOMSG"),
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                try {
                                    var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                    window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaattest/MOFAAttest.html";
                                } catch (Exception) { return; }
                            }
                        });
                    }
                }));
                oHboxC2.addItem(new sap.m.RadioButton({
                    id: "rbc22",
                    groupName: "CollectionC12", text: oBundle.getText("NO"), selected: true,
                    select: function () {
                        if (sap.ui.getCore().byId("rbc12").getSelected()) {
                            oVboxC3.setVisible(true);
                            oVboxC4.setVisible(true);
                            sap.ui.getCore().byId("COCStep").setValidated(true);
                            sap.ui.getCore().byId("CCDDOCStep").setValidated(true);
                        }
                    }
                }));
                oVboxC2.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("USEOUTSAUDI") + "</strong></p>" }),
                        oHboxC2
                    ]
                }));

                var oVboxC21 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var C21Text = oBundle.getText("REFRESH");
                if (window.location.href.indexOf("SBY") == -1) {
                    C21Text = oBundle.getText("BACKOVERPAGE");
                }

                oVboxC21.addItem(new sap.m.Button({
                    id: "oBOverview", emphasized: "true", text: C21Text,
                    press: function () {
                        try {
                            if (window.location.href.indexOf("SBY") == -1) {
                                var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                            }
                            else {
                                window.location.assign("about:blank");
                            }
                        } catch (Exception) { return; }
                    }
                }));

                var oVboxC3 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                var oHboxC3 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });

                var oComboBoxC1 = new sap.m.ComboBox({
                    id: "oCBAttest", width: "150px",
                    selectionChange: function (oEvent) {
                        var cnoofattestation = sap.ui.getCore().byId("oCBAttest");
                        cnoofattestation.setValueState(sap.ui.core.ValueState.None);
                        if (cnoofattestation.getValue().length == 0) {
                            MessageBox.error(oBundle.getText("KINSELNUMATT"), {
                                icon: MessageBox.Icon.ERROR,
                            });
                            cnoofattestation.setValueState(sap.ui.core.ValueState.Error);
                            sap.ui.getCore().byId("COCStep").setValidated(false);
                            sap.ui.getCore().byId("CCDDOCStep").setValidated(false);
                        }
                        else {
                            var CBvalchk = 0;
                            for (var i = 0; i < cnoofattestation.getItems().length; i++) {
                                if (cnoofattestation.getItems()[i].getText() == cnoofattestation.getValue()) {
                                    CBvalchk = 1;
                                    i = cnoofattestation.getItems().length + 1;
                                }
                            }
                            if (CBvalchk == 0) {
                                MessageBox.error(oBundle.getText("ENTVALNOALLOWDRDOW"), {
                                    icon: MessageBox.Icon.ERROR,
                                });
                                cnoofattestation.setValueState(sap.ui.core.ValueState.Error);
                                sap.ui.getCore().byId("COCStep").setValidated(false);
                                sap.ui.getCore().byId("CCDDOCStep").setValidated(false);
                            }
                            else {
                                sap.ui.getCore().byId("COCStep").setValidated(true);
                                sap.ui.getCore().byId("CCDDOCStep").setValidated(true);
                                fncall.validateCollecInf();
                            }
                        }
                    }
                });
                oComboBoxC1.setModel(oAttModel);
                var oListItemC1 = new sap.ui.core.ListItem();
                oListItemC1.bindProperty("key", "attval");
                oListItemC1.bindProperty("text", "attval");
                oComboBoxC1.bindItems("/values", oListItemC1);
                oComboBoxC1.setSelectedKey("1");
                oHboxC3.addItem(oComboBoxC1);
                oVboxC3.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 2, columnsL: 2, columnsM: 2, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<p><strong>" + oBundle.getText("NUMATTE") + "</strong></p>" }),
                        oHboxC3
                    ]
                }));

                oVboxC3.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("NOTESARST") })
                    ]
                }));

                var oVboxC4 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Column, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oVboxC4.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: oBundle.getText("POSTDOCGACEN") })
                    ]
                }));
                oVboxC4.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("COLL") + "</strong>" })
                    ]
                }));

                var oHboxC41 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxC41.addItem(new sap.m.RadioButton({
                    id: "rbc31",
                    groupName: "CollectionC13", text: oBundle.getText("DROPOFFMYSELF"), visible: false, //selected:true,
                    select: function () {
                        sap.ui.getCore().byId("isCOCPickup").setVisible(false);
                        if (sap.ui.getCore().byId("rbc33").getSelected()) {
                            oFormc2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxC41.addItem(new sap.m.RadioButton({
                    id: "rbc32",
                    groupName: "CollectionC13", text: oBundle.getText("UPSPICKUP"), selected: true,
                    select: function () {
                        sap.ui.getCore().byId("isCOCPickup").setVisible(true);
                        oFormc2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oHboxC41.addItem(new sap.m.Text({ id: "isCOCPickup", visible: true, text: oBundle.getText("COLLTIME") }));
                oVboxC4.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxC41
                    ]
                }));

                oVboxC4.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        new sap.m.FormattedText({ htmlText: "<strong>" + oBundle.getText("DELIV") + "</strong>" })
                    ]
                }));

                var oHboxC42 = new sap.m.FlexBox({ wrap: sap.m.FlexWrap.Wrap, direction: sap.m.FlexDirection.Row, backgroundDesign: sap.m.BackgroundDesign.Transparent, items: [] });
                oHboxC42.addItem(new sap.m.RadioButton({
                    id: "rbc33",
                    groupName: "DeliveryC11", text: oBundle.getText("PICUPMYSELF"), visible: false, //selected:true,
                    select: function () {
                        if (sap.ui.getCore().byId("rbc31").getSelected()) {
                            oFormc2.setVisible(false);
                            fncall.validateCollecInf();
                        }
                    }
                }));
                oHboxC42.addItem(new sap.m.RadioButton({
                    id: "rbc34", selected: true,
                    groupName: "DeliveryC11", text: oBundle.getText("UPSDELV"),
                    select: function () {
                        oFormc2.setVisible(true);
                        fncall.validateCollecInf();
                    }
                }));
                oVboxC4.addItem(new sap.ui.layout.form.SimpleForm({
                    layout: "ResponsiveGridLayout", editable: true,
                    labelSpanXL: 8, labelSpanL: 8, labelSpanM: 14, labelSpanS: 14, adjustLabelSpan: false, emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0,
                    emptySpanS: 0, columnsXL: 1, columnsL: 1, columnsM: 1, singleContainerFullSize: false, content: [
                        oHboxC42
                    ]
                }));

                var oLayoutc2 = new sap.ui.layout.form.ResponsiveGridLayout({
                    columnsL: 2,
                    columnsM: 2,
                    breakpointM: 800
                });

                var oFormc2 = new sap.ui.layout.form.Form({
                    layout: oLayoutc2,
                    editable: true,
                    formContainers: [
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("Name", "Bold"),
                                    fields: [fncall.crCInput("fc_name", EmpJson.FirstName + " " + EmpJson.MiddleName + " " + EmpJson.LastName, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("KAUST ID", "Bold"),
                                    fields: [fncall.crCInput("fc_kaustid", EmpJson.KaustID, false)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("Mobile Number", "Bold"),
                                    fields: [fncall.crCInput("fc_mobile", PrefJson.mobile_no, true)]
                                })
                            ]
                        }),
                        new sap.ui.layout.form.FormContainer({
                            formElements: [
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("Building Name/No", "Bold"),
                                    fields: [fncall.crCInput("fc_bnum", PrefJson.building_no, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("Level", "Bold"),
                                    fields: [fncall.crCInput("fc_level", PrefJson.level_b, true)]
                                }),
                                new sap.ui.layout.form.FormElement({
                                    label: fncall.crCLabel("Room No/Cubicle", "Bold"),
                                    fields: [fncall.crCInput("fc_bname", PrefJson.building_name, true)]
                                })
                            ]
                        })
                    ]
                });

                var attNum = sap.ui.getCore().byId("oCBAttest");
                attNum.addDelegate({
                    onAfterRendering: function () {
                        attNum.$().find('INPUT').attr('disabled', true).css('color', '#000000');
                    }
                }, attNum);

                if (sap.ui.getCore().byId("fc_mobile").getValue().length > 0) {
                    var mobileval = sap.ui.getCore().byId("fc_mobile").getValue().match(/(\d+)/);
                    if (mobileval != null) {
                        sap.ui.getCore().byId("fc_mobile").setValue(mobileval[0]);
                    }
                }
                sap.ui.getCore().byId("fc_mobile").setType("Number");
                oVboxC4.addItem(oFormc2);
                sap.ui.getCore().byId("isCOCPickup").addStyleClass("redClass");

                //		oFormc2.setVisible(false);
                oVboxC2.setVisible(false);
                oVboxC21.setVisible(false);

                sap.ui.getCore().byId("rbc12").setSelected(true);

                this.oWizardStepc1.setValidated(true);
                //		sap.ui.getCore().byId("rbc31").setSelected(true);
                //		sap.ui.getCore().byId("rbc33").setSelected(true);

                this.oWizardStepc1.addContent(oVboxC1);
                this.oWizardStepc1.addContent(oVboxC2);
                this.oWizardStepc1.addContent(oVboxC21);
                this.oWizardStepc1.addContent(oVboxC3);

                this.oWizardStepc2.addContent(oVboxC4);

                this.oWizardC.addStep(this.oWizardStepc1);
                this.oWizardC.addStep(this.oWizardStepc2);

                oPageC.addContent(this.oWizardC);
                fncall.validateCollecInf();
            },

            function(response) {
                return "";
            },

            validateCollecInf: function (oEvent) {
                var fncall = this;
                sap.ui.getCore().byId("fc_mobile").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fc_bnum").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fc_level").setValueState(sap.ui.core.ValueState.None);
                sap.ui.getCore().byId("fc_bname").setValueState(sap.ui.core.ValueState.None);
                var cnoofattestation = sap.ui.getCore().byId("oCBAttest");
                cnoofattestation.setValueState(sap.ui.core.ValueState.None);


                if (cnoofattestation.getValue().length == 0 || ((sap.ui.getCore().byId("rbc32").getSelected() || sap.ui.getCore().byId("rbc34").getSelected()) &&
                    (sap.ui.getCore().byId("fc_bnum").getValue().length == 0 || sap.ui.getCore().byId("fc_level").getValue().length == 0 ||
                        sap.ui.getCore().byId("fc_bname").getValue().length == 0 || !this.validateTelephoneNum(null, sap.ui.getCore().byId("fc_mobile").getValue()) ||
                        isNaN(sap.ui.getCore().byId("fc_mobile").getValue())))) {
                    if (!this.validateTelephoneNum(null, sap.ui.getCore().byId("fc_mobile").getValue()) || isNaN(sap.ui.getCore().byId("fc_mobile").getValue()))
                        sap.ui.getCore().byId("fc_mobile").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fc_bnum").getValue().length == 0)
                        sap.ui.getCore().byId("fc_bnum").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fc_level").getValue().length == 0)
                        sap.ui.getCore().byId("fc_level").setValueState(sap.ui.core.ValueState.Error);
                    if (sap.ui.getCore().byId("fc_bname").getValue().length == 0)
                        sap.ui.getCore().byId("fc_bname").setValueState(sap.ui.core.ValueState.Error);
                    if (cnoofattestation.getValue().length == 0)
                        cnoofattestation.setValueState(sap.ui.core.ValueState.Error);
                    sap.ui.getCore().byId("CCDDOCStep").setValidated(false);
                }
                else {
                    sap.ui.getCore().byId("COCStep").setValidated(true);
                    sap.ui.getCore().byId("CCDDOCStep").setValidated(true);
                }
            },

            crCLabel: function (oLtext, oLDesc) //, oLWidth)
            {
                var oLabel = new sap.m.Label();
                oLabel.setText(oLtext);
                oLabel.setDesign(oLDesc);
                oLabel.addStyleClass("myLabel");
                oLabel.setTextAlign("Begin");
                return oLabel;
            },

            crCInput: function (sid, value, type) {
                var fncall = this;
                if (sid == "fc_bnum" || sid == "fc_level" || sid == "fc_mobile" || sid == "fc_bname") {
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

            onSubmit: function (oEvent, PrefJson, DepJson,EmpJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                PrefJson = this.PrefJson;
                var collectionmtd = "0";
                var deliverymtd = "0";
                var ckaustissued = "";
                var coutsideksa = "";
                var cnoofattestation = sap.ui.getCore().byId("oCBAttest");
                if (sap.ui.getCore().byId("rbc11").getSelected()) {
                    ckaustissued = "X";
                }
                if (sap.ui.getCore().byId("rbc21").getSelected()) {
                    coutsideksa = "X";
                }
                if (sap.ui.getCore().byId("rbc32").getSelected()) {
                    collectionmtd = "1";
                }
                if (sap.ui.getCore().byId("rbc34").getSelected()) {
                    deliverymtd = "1";
                }

                var DependentsKaustid = "";
                for (var i = 0; i < DepJson["results"].length; i++) {
                    var idc = "chboxc" + i;
                    if (sap.ui.getCore().byId(idc).getSelected()) {
                        if (DependentsKaustid.length == 0)
                            DependentsKaustid = DependentsKaustid + DepJson["results"][i].KaustId;
                        else
                            DependentsKaustid = DependentsKaustid + "." + DepJson["results"][i].KaustId;
                    }
                }

                var userdata = this.getView().getModel("EmpDetails").getData();
                // var oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                // oTokenModel.refreshSecurityToken();

                cnoofattestation.setValueState(sap.ui.core.ValueState.None);
                if (cnoofattestation.getValue().length == 0) {
                    MessageBox.error(oBundle.getText("KINSELNUMATT"), {
                        icon: MessageBox.Icon.ERROR,
                    });
                    cnoofattestation.setValueState(sap.ui.core.ValueState.Error);
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
                            var preferenceData = this.formatPreferenceData(PrefJson);
                            if (sap.ui.getCore().byId("rbc32").getSelected() || sap.ui.getCore().byId("rbc34").getSelected()) {
                                preferenceData.deliv_flag = "1";
                                if (!this.validatePreferenceData(preferenceData)) {
                                    oBusyDialogCreate.close();
                                    return;
                                }
                            }

                            var data =
                            {
                                "c_kaust_issued": ckaustissued,
                                "c_outside_ksa": coutsideksa,
                                "c_no_of_attestation": cnoofattestation.getSelectedKey(),
                                "m_issuesd_ksa": "",
                                "m_attested_ksa": "",
                                "m_foreign_consulates": "",
                                "f_attested_mofa": "",
                                "f_foreign_consulates": "",
                                "f_consulate_attestation": "",
                                "collection_mtd": collectionmtd,
                                "delivery_mtd": deliverymtd,
                                "dependents_kaustid": DependentsKaustid,
                                "GAHeader": {
                                    "comments": "Documents Attestation from MOFA Service Request",
                                    "kaust_id": EmpJson.KaustID
                                },
                                "header": {
                                    "sub_service_code": "1704",
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
                                        oBundle.getText("PLEMONDOCIM"), {
                                        icon: sap.m.MessageBox.Icon.SUCCESS,
                                        title: oBundle.getText("REQSUBSUCCESS"),
                                        actions: [sap.m.MessageBox.Action.OK]
                                        // 	onClose : function(oAction) {
                                        // 		try
                                        // 		{
                                        // 			if(window.location.href.indexOf("SBY") == -1)
                                        // 			{
                                        // 				var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        // 				window.location.href =  gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html" ;
                                        // 			}
                                        // 			else
                                        // 			{

                                        // 				try	{ window.location.assign("about:blank"); }
                                        // 				catch(Exception) { }
                                        // 			}
                                        // 		} catch(Exception){ return; }
                                        //     }
                                    }
                                    );
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
                var oModelGasc = this.getView().getModel("EmpDetails");
                var userdata = oModelGasc.getData();
                var that = this;

                var oGAModel = this.getOwnerComponent().getModel("oGAModel");
                var sRequestURL = "/CheckRequest()?kaust_id='" + userdata.KaustID + "'&userid='" + userdata.UserId + "'&sub_service_code='1704'";
                oGAModel.read(sRequestURL, null, null, false, function (oData, response) {
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
                            sub_service_code: "1704"
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
                preferenceData.sub_service_code = "1704";
                preferenceData.first_name = userData.FirstName;
                preferenceData.middle_name = userData.MiddleName;
                preferenceData.last_name = userData.LastName;
                preferenceData.deliv_flag = 0;
                preferenceData.no_serv_code = PrefJson.no_serv_code;
                if (preferenceData.KaustID == "") {
                    preferenceData.KaustID = userData.KaustID;
                }
                preferenceData.mobile_no = sap.ui.getCore().byId("fc_mobile").getValue();
                preferenceData.building_name = sap.ui.getCore().byId("fc_bname").getValue();
                preferenceData.building_no = sap.ui.getCore().byId("fc_bnum").getValue();
                preferenceData.level_b = sap.ui.getCore().byId("fc_level").getValue();
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


//oVboxC1.addItem(new sap.m.FormattedText({htmlText:"<p> KAUST Issued Letter </p>"}));
//oHboxC1.addItem(new sap.m.FormattedText({width: "250px", htmlText:"<p> KAUST Issued Letter </p>"}));
//oVboxC1.addItem(oHboxC1);
//oVboxC2.addItem(new sap.m.FormattedText({htmlText:"<p> Use outside Saudi Arabia? </p>"}));
//oHboxC2.addItem(new sap.m.FormattedText({width: "250px", htmlText:"<p> Use outside Saudi Arabia? </p>"}));
//oVboxC2.addItem(oHboxC2);
//oVboxC3.addItem(new sap.m.FormattedText({htmlText:"<p> Number of attestations </p>"}));
//oHboxC3.addItem(new sap.m.FormattedText({width: "250px", htmlText:"<p> Number of attestations </p>"}));
//oVboxC3.addItem(oHboxC3);


//	var oEntryData =
//	{
//		"KaustId":userdata.KaustID,
//		"Request_ID":"",
//		"UserId":"",
//		"Comments":"",
//		"Amount":"344.88",
//		"Currency":"",
//		"Iqamaduaration":1,
//		"Costcenter":"",
//		"WBSElement":"",
//		"ContractEndDate":"2016-03-15T00:00:00",
//		"New_Expiry_Date":"2016-03-15T00:00:00",
//		"Fin_Comments":"",
//		"Gasc_Agent_Comments":"",
//		"Category_Type":"",
//		"Hijri_Exp_Date":"",
//		"Fast_Track":"",
//		"Tracking_ID":"",
//		"Type_Of_Visa":"",
//		"Duration":"",
//		"Purpose":"",
//		"DmanagerID":"",
//		"Fine":"44.9",
//		"Stud_Visitor":false,
//		"Degree_Type":"",
//		"Dependant_Only":true,
//		"Req_Comment":"",
//		"subServiceCode":"1704",
//		"Service_Code":"0017",
//		"Status":"001",
//		"Process_ID":"",
//		"Stage":"",
//		"Fname":userdata.FirstName,
//		"Mname":userdata.MiddleName,
//		"Lname":userdata.LastName,
//		"Email":"",
//		"Expeditor":"",
//		"On_Behalf":"",
//		"Role":"",
//		"Requestor_KaustID":"",
//		"requestedFor":"",
//		"Nationality":userdata.Nationality,
//		"Relationship":userdata.Type,
//		"Passport":userdata.Passport,
//		"IqamaNo":userdata.Iqama,
//		"saudiIdNum":"",
//		"Gender":userdata.Gender,
//		"Expirydate":"2016-03-15T00:00:00",
//		"TimeStamp":this.getTodayDate(new Date()),
//		"process":"COMMON",
//		"HeaderToGUD" : [],
//	};
//
//	var sDocName1 = oFileUploader1.getValue().toUpperCase();
//	if (sDocName1.length > 50) {	// If existing file name is more than 50 characters
//		sDocName1 = sDocName1.split(".PDF")[0].substring(0, 46) + ".PDF";
//	}
//	oFileUploader1.setValue(sDocName1);
//	sap.ui.getCore().byId("param1").setValue(oTokenModel.getHeaders()["x-csrf-token"]);
//	sap.ui.getCore().byId("slug1").setValue(sDocName1.split(".PDF")[0] + "," + userdata.KaustID + ",27,99991231");
//	var attachvalue = sap.ui.getCore().byId("slug1").getValue();
//	oFileUploader1.setUploadUrl("/sap/opu/odata/SAP/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
//	oFileUploader1.upload();
//	
//	var sDocName2 = oFileUploader2.getValue().toUpperCase();
//	if (sDocName2.length > 50) {	// If existing file name is more than 50 characters
//		sDocName2 = sDocName2.split(".PDF")[0].substring(0, 46) + ".PDF";
//	}
//	oFileUploader2.setValue(sDocName2);
//	sap.ui.getCore().byId("param2").setValue(oTokenModel.getHeaders()["x-csrf-token"]);
//	sap.ui.getCore().byId("slug2").setValue(sDocName2.split(".PDF")[0] + "," + userdata.KaustID + ",27,99991231");
//	var attachvalue = sap.ui.getCore().byId("slug1").getValue();
//	oFileUploader2.setUploadUrl("/sap/opu/odata/SAP/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
//	oFileUploader2.upload();
//
//	var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
//	var attxt = "FileRead?$filter=UNIQUE_ID eq '"+userdata.KaustID+"' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '27'";
//	oAttachModel.read(attxt, null, null, false, function(data, response) {
//		var attachModel=new sap.ui.model.json.JSONModel();
//		attachModel.setData(data);
//		sap.ui.getCore().setModel(attachModel,'AttachDetails');
//	}, 
//	function(response) 
//	{
//		return "";
//	});
//
//	var attachUrl1;
//	var attachdata = sap.ui.getCore().getModel("AttachDetails").getData();
//	for(var i = 0; i < attachdata.results.length; i++)
//	{
//		if(attachdata.results[i].FILENAME.toUpperCase() === sDocName1.toUpperCase())
//		{
//			attachUrl1 = attachdata.results[i].URL;
//			i = attachdata.results.length + 1;
//		}
//	}
//	var obj1={};
//	obj1.KaustId =userdata.KaustID;
//	obj1.Request_ID ="";
////		obj1.subServiceCode ="1704";
////		obj1.requestType ="new";
//	obj1.justification ="";
//    obj1.Gender =userdata.Gender;
//	obj1.saudiIdNum ="";
//	obj1.IqamaNo ="";
//	obj1.Passport =userdata.Passport;
//	obj1.Relationship =userdata.Type;
//	obj1.Nationality =userdata.Nationality;
//	obj1.requestedFor ="";
//	obj1.Fname =userdata.FirstName;
//	obj1.Mname =userdata.MiddleName;
//	obj1.Lname =userdata.LastName;
//	obj1.PassportLost ="";
//	obj1.age ="";
//	obj1.fileName =sDocName1;
//	obj1.url =attachUrl1;
//	oEntryData.HeaderToGUD.push(obj1);
//
//	var attachUrl2;
//	for(var i = 0; i < attachdata.results.length; i++)
//	{
//		if(attachdata.results[i].FILENAME.toUpperCase() === sDocName2.toUpperCase())
//		{
//			attachUrl2 = attachdata.results[i].URL;
//			i = attachdata.results.length + 1;
//		}
//	}
//	var obj2={};
//	obj2.KaustId =userdata.KaustID;
//	obj2.Request_ID ="";
////		obj2.subServiceCode ="1704";
////		obj2.requestType ="new";
//	obj2.justification ="";
//    obj2.Gender =userdata.Gender;
//	obj2.saudiIdNum ="";
//	obj2.IqamaNo ="";
//	obj2.Passport =userdata.Passport;
//	obj2.Relationship =userdata.Type;
//	obj2.Nationality =userdata.Nationality;
//	obj2.requestedFor ="";
//	obj2.Fname =userdata.FirstName;
//	obj2.Mname =userdata.MiddleName;
//	obj2.Lname =userdata.LastName;
//	obj2.PassportLost ="";
//	obj2.age ="";
//	obj2.fileName =sDocName1;
//	obj2.url =attachUrl2;
//	oEntryData.HeaderToGUD.push(obj2);
//
//	var result = "";
//	var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
//	oModelGasc.create('GASC_HeaderSet',oEntryData,null,function(response) {
//		jQuery.sap.require("sap.m.MessageBox");
//		sap.m.MessageBox.show("Your Request id is:'" + response.Request_ID + "'.Please remember it for future references.", {
//			icon : sap.m.MessageBox.Icon.SUCCESS,
//			title : "Request Created Successfully",
//			actions : [ sap.m.MessageBox.Action.OK ],
//			onClose : function(oAction) {
//				var app = sap.ui.getCore().byId("cocApp");
//				app.to("idOverview");
//			}
//		});
//		that.requestId = response.Request_ID;
//		if(preferenceData.DelivFlag == 1)
//		{
//			that.updatePreferenceData(preferenceData);
//		}
//		oBusyDialogCreate.close();
//	}, 
//	function() 
//	{
//		oBusyDialogCreate.close();
//		alert("Request creation failed");
//		return;
//	});
//} catch (Exception) {
//	oBusyDialogCreate.close();
//	alert(Exception.message);
//}


//*****************************************************************************************************************************************
//oVboxC0.addItem(new sap.m.FormattedText({htmlText:"<p><strong>&nbsp; &nbsp; &nbsp;Select Requestors</strong></p>"}));
//oHboxC0.addItem(new sap.m.FormattedText({htmlText:"<p><strong>&nbsp; &nbsp;</strong></p>"}));
//sap.ui.getCore().attachInit(function(){
//sap.m.MessageBox.show(infmsg, {
//		icon : sap.m.MessageBox.Icon.SUCCESS,
//		title : "Document Update",
//		actions : [ sap.m.MessageBox.Action.OK ],
//		onClose : function(oAction) {
//		}
//	});
//});
//location.reload(true);
//var app = sap.ui.getCore().byId("GAApp");
//app.to("idOverview");

//oVboxC1.addItem(new sap.m.FormattedText({htmlText:"<p><strong>1. COC Information</strong></p>"}));
//if(oVboxC3.getVisible())
//{
//var app = sap.ui.getCore().byId("GAApp");
//app.to("idMOFAAttest");
//sap.ui.getCore().byId("rbc22").setSelected(true);
//oVboxC3.setVisible(true);
//oVboxC4.setVisible(true);
//}
//location.reload(true);
//var app = sap.ui.getCore().byId("GAApp");
//app.to("idOverview");
//oVboxC3.addItem(fncall.crCLabel("   ","Standard"));
//oVboxC3.addItem(fncall.crCLabel("   ","Standard"));
//oVboxC4.addItem(fncall.crCLabel("   ","Standard"));
//oVboxC4.addItem(fncall.crCLabel("   ","Standard"));
//new sap.ui.layout.form.FormElement({
//	label: fncall.crCLabel("Email Address:","Bold"),
//	fields: [fncall.crCInput("fc_email",PrefJson.Email,true)]
//}),
//if (!this.checkExistingProcesses()) 
//{
//	return;
//}
//"Key":"",

//location.reload(true);
//var app = sap.ui.getCore().byId("GAApp");
//app.to("idOverview");
//var sURL = "CheckRequestSet?$filter=SubServiceCode eq '1704' and ("+sKaustIds+")";
//preferenceData.Email = sap.ui.getCore().byId("fc_email").getValue();
//if(!this.validateEmail(null,data.Email)){
//	sap.m.MessageBox.alert("Invalid Email", {
//		title: "Error",                                      
//		onClose: null,                                       
//		textDirection: sap.ui.core.TextDirection.Inherit     
//	});
//	return false;
//}

//*****************************************************************************************************************************************
