sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, Filter, FilterOperator, ODataModel, MessageBox, JSONModel) {
        "use strict";

        var d_kaustid;
        var kaustId;
        var name;
        var NatJson = [];
        var PrefJson = [];
        var bCompact;
        var oTokenModel;
        var TableData = [];
        var TableData1 = [];
        var attachdata = [];
        var attachcount = 0;
        var Requestid;
        var counter = 1;

        return Controller.extend("com.kaust.zgamoeattest.controller.MOEATTEST", {
            onInit: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var that = this;
                var Nationality = [];
                var FinalData = [];
                bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oDetailsModel = new sap.ui.model.json.JSONModel();
                // var oData = {
                //     "results": [
                //         {
                //             "KaustID": "100039",
                //             "FirstName": "Umar",
                //             "MiddleName": "Mid",
                //             "LastName": "Mehboob",
                //             "EMailAddress": "NAVYA.Krishna@cognizant.com",
                //             "UserID": "TST_EMPLOYEE",
                //             "MobileNo": "",
                //             "OfficeNo": "",
                //             "LandlineNo": "8026427",
                //             "EmployeeGender": "Male",
                //             "Nationality": "American",
                //             "SecurityCategory": "STAFF",
                //             "PassportNo": "X9876543",
                //             "IQAMANumber": "2329526368",
                //             "NationalSaudi_ID": "1006062473",
                //             "PositionShortText": "End User",
                //             "DepartmentName": "IT Services",
                //             "CostCenter": "0000040350",
                //             "OrganizationalUnit": "30000288",
                //             "OrgUnitShortText": "End User Computing",
                //             "ReptManagerKAUSTID": "100476",
                //             "ReptManager": "LINDA MID ROBERTS",
                //             "ReptManagerEmail": "",
                //             "ReptManagerUserID": "SHAGHRYA",
                //             "DeptManagerKAUSTID": "100066",
                //             "DeptManager": "JOHN MID JENSEN",
                //             "DeptManagerEmail": "mohammed.najran@kaust.edu.sa",
                //             "DeptManagerUserID": "FAYADLG",
                //             "DegreeType": "",
                //             "StudentStatus": "",
                //             "IQAMAExpiryDate": "/Date(1574035200000)/",
                //             "KaustID_ExpDate": "/Date(1715817600000)/",
                //             "Manager": "M",
                //             "SubCategoryType": "Non-Academic",
                //             "VendorNumber": "",
                //             "VendorName": "",
                //             "VendorDescription": ""
                //         }
                //     ]
                // };

                // var oDetailsModel = new sap.ui.model.json.JSONModel();
                // oDetailsModel.setData(oData.results[0]);
                // sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
                // that.getView().setModel(oDetailsModel, "EmpDetails");
                // kaustId = oData.results[0].KaustID;
                // name = oData.results[0].FirstName + " " + oData.results[0].MiddleName + " " + oData.results[0].LastName;
                // that.EmpJson = sap.ui.getCore().getModel("EmpDetails").getData();
                // d_kaustid = that.EmpJson.KaustID;
                // var title = oBundle.getText("WELCOME") + that.EmpJson.FirstName;
                // that.getView().byId("idTitle").setText(title);


                // var oDataModel = new ODataModel("/sap/opu/odata/SAP/ZHRTRS0001TSR_GASC", true);
                //Fetch the user detail
                // this.getUserDetails();
                // oDataModel.read("/UserDetail", {
                //     async: false,
                //     success: function (oData, response) {
                // var oData1 = oData.results;
                //	FinalData = oData.results;
                // var oDetailsModel = new sap.ui.model.json.JSONModel();
                // oDetailsModel.setData(oData);
                // sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
                // that.getView().setModel(oDetailsModel, "EmpDetails");
                // kaustId = oData.results[0].KaustID;
                // name = oData.results[0].FirstName + " " + oData.results[0].MiddleName + " " + oData.results[0].LastName;
                // that.EmpJson = sap.ui.getCore().getModel("EmpDetails").getProperty("/").results[0];
                // d_kaustid = that.EmpJson.KaustID;
                // var title = "Welcome " + that.EmpJson.FirstName;
                // that.getView().byId("idTitle").setText(title);
                //     }
                // });





                // var oTableModel = new ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/", true);
                // //	var filter = "UserDependents?$filter=(Fasttrack eq 'X' and Relationship eq 'X' and Purpose eq 'DL')";
                // var filter = "UserDependents";
                // oTableModel.read(filter, {
                //     async: false,
                //     success: function (oData, response) {
                //         FinalData = oData.results[0];
                //         TableData = oData;
                //         TableData1 = oData;
                //     }
                // });

                // var finData = {
                //     "results": [{
                //         "Amount": "0.0000",
                //         "ArabicFirstName": "",
                //         "ArabicLastName": "",
                //         "ArabicMiddleName": "",
                //         "BorderNumber": "",
                //         "Categorytype": "PERNR",
                //         "Cendda": null,
                //         "Comments": "",
                //         "Costcenter": "",
                //         "Countryofissue": "",
                //         "Currency": "",
                //         "DMANAGERID": "",
                //         "Dateofissue": "",
                //         "DegreeType": "",
                //         "DependantOnly": false,
                //         "Dob": "",
                //         "Duration": "000",
                //         "Email": "NAVYA.Krishna@cognizant.com",
                //         "ExpDate": null,
                //         "Expeditor": "",
                //         "Fasttrack": "",
                //         "FileName": "",
                //         "FinComments": "",
                //         "Fine": "0.0000",
                //         "Fname": "Navya",
                //         "GAComments": "",
                //         "Gender": "Female",
                //         "HIqamaEdate": "1441/03/20",
                //         "HijriExpDate": "",
                //         "IndvAmount": "0.0000",
                //         "IqamaDuration": 0,
                //         "IqamaEdate": "",
                //         "IqamaJobTitle": "فني حاسب آلي",
                //         "IqamaNo": "2329526222",
                //         "Iqmarenew": "",
                //         "Iskaustemp": false,
                //         "KaustId": "101010",
                //         "Lastrecord": false,
                //         "Lname": "Krishna",
                //         "Lock": "",
                //         "Mname": "B",
                //         "Msg1": "Record already exists",
                //         "Msg2": "",
                //         "Msg3": "",
                //         "Msg4": "",
                //         "Msg5": "",
                //         "MsgTyp1": "E",
                //         "MsgTyp2": "",
                //         "MsgTyp3": "",
                //         "MsgTyp4": "",
                //         "MsgTyp5": "",
                //         "Nation": "",
                //         "Nationality": "American",
                //         "NationalityCode": "US",
                //         "NewExpDate": null,
                //         "NewPassport": "",
                //         "Onbehalf": "",
                //         "PassEdate": "",
                //         "Passport": "X9876111",
                //         "PassportExpiry": null,
                //         "PassportLost": false,
                //         "Placeofissue": "",
                //         "Position": "End User Computing",
                //         "ProcessId": "",
                //         "Purpose": "",
                //         "Relationship": "",
                //         "ReqComment": "",
                //         "RequestId": "0010079258",
                //         "RequestorKaustID": "",
                //         "SaudiNo": "",
                //         "SequenceNumber": 0,
                //         "ServiceCall": "",
                //         "ServiceCode": "",
                //         "Stage": "",
                //         "Status": "005",
                //         "StudentVisitor": false,
                //         "SubServiceCode": "",
                //         "TimeStamp": null,
                //         "Trackingid": "",
                //         "Type": "STAFF",
                //         "Url": "",
                //         "UserId": "TST_EMPLOYEE",
                //         "VisaExpired": false,
                //         "Wbs": "",
                //         "age": 54,
                //         "apply_for": "0 ",
                //         "date_of_birth": null,
                //         "gaFileName": "",
                //         "gaUrl": "",
                //         "id_number": "",
                //         "location": "0 ",
                //         "name": "",
                //         "org_name": "End User Computing",
                //         "org_unit": "30000288",
                //         "pickup_type": "0 ",
                //         "rep_date": null,
                //         "rescheduled": "",
                //         "service": "0 ",
                //         "service_type": "0 ",
                //         "t_kaustid": "",
                //         "t_name": "",
                //         "t_role": "",
                //         "t_userid": "",
                //         "visitors": "0 "
                //     },
                //     {
                //         "Amount": "0.0000",
                //         "ArabicFirstName": "",
                //         "ArabicLastName": "",
                //         "ArabicMiddleName": "",
                //         "BorderNumber": "",
                //         "Categorytype": "PERNR",
                //         "Cendda": null,
                //         "Comments": "",
                //         "Costcenter": "",
                //         "Countryofissue": "",
                //         "Currency": "",
                //         "DMANAGERID": "",
                //         "Dateofissue": "",
                //         "DegreeType": "",
                //         "DependantOnly": false,
                //         "Dob": "",
                //         "Duration": "000",
                //         "Email": "NAVYA.Krishna@cts.com",
                //         "ExpDate": null,
                //         "Expeditor": "",
                //         "Fasttrack": "",
                //         "FileName": "",
                //         "FinComments": "",
                //         "Fine": "0.0000",
                //         "Fname": "esakki",
                //         "GAComments": "",
                //         "Gender": "Female",
                //         "HIqamaEdate": "1441/03/20",
                //         "HijriExpDate": "",
                //         "IndvAmount": "0.0000",
                //         "IqamaDuration": 0,
                //         "IqamaEdate": "",
                //         "IqamaJobTitle": "فني حاسب آلي",
                //         "IqamaNo": "2329521122",
                //         "Iqmarenew": "",
                //         "Iskaustemp": false,
                //         "KaustId": "212121",
                //         "Lastrecord": false,
                //         "Lname": "S",
                //         "Lock": "",
                //         "Mname": "S",
                //         "Msg1": "Record already exists",
                //         "Msg2": "",
                //         "Msg3": "",
                //         "Msg4": "",
                //         "Msg5": "",
                //         "MsgTyp1": "E",
                //         "MsgTyp2": "",
                //         "MsgTyp3": "",
                //         "MsgTyp4": "",
                //         "MsgTyp5": "",
                //         "Nation": "",
                //         "Nationality": "American",
                //         "NationalityCode": "US",
                //         "NewExpDate": null,
                //         "NewPassport": "",
                //         "Onbehalf": "",
                //         "PassEdate": "",
                //         "Passport": "X9876111",
                //         "PassportExpiry": null,
                //         "PassportLost": false,
                //         "Placeofissue": "",
                //         "Position": "End User Computing",
                //         "ProcessId": "",
                //         "Purpose": "",
                //         "Relationship": "Child",
                //         "ReqComment": "",
                //         "RequestId": "0010079258",
                //         "RequestorKaustID": "",
                //         "SaudiNo": "",
                //         "SequenceNumber": 0,
                //         "ServiceCall": "",
                //         "ServiceCode": "",
                //         "Stage": "",
                //         "Status": "005",
                //         "StudentVisitor": false,
                //         "SubServiceCode": "",
                //         "TimeStamp": null,
                //         "Trackingid": "",
                //         "Type": "STAFF",
                //         "Url": "",
                //         "UserId": "TST_EMPLOYEE",
                //         "VisaExpired": false,
                //         "Wbs": "",
                //         "age": 54,
                //         "apply_for": "0 ",
                //         "date_of_birth": null,
                //         "gaFileName": "",
                //         "gaUrl": "",
                //         "id_number": "",
                //         "location": "0 ",
                //         "name": "",
                //         "org_name": "End User Computing",
                //         "org_unit": "30000288",
                //         "pickup_type": "0 ",
                //         "rep_date": null,
                //         "rescheduled": "",
                //         "service": "0 ",
                //         "service_type": "0 ",
                //         "t_kaustid": "",
                //         "t_name": "",
                //         "t_role": "",
                //         "t_userid": "",
                //         "visitors": "0 "

                //     }
                //     ]
                // };

                FinalData = finData.results[0];
                TableData = finData;
                TableData1 = finData;

                if (TableData) {
                    if (TableData.results.length === 1) {
                        sap.ui.getCore().attachInit(function () {
                            sap.m.MessageBox.show(oBundle.getText("SERAPPCHILDDEP"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: oBundle.getText("ERROR"),
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    try {
                                        var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                                    } catch (Exception) {
                                        return;
                                    }

                                }
                            });
                        });
                    } else {

                    }
                }
                var DegreeArr = [{
                    "Type": "Elementary Degree"
                }, {
                    "Type": "Middle Degree"
                }, {
                    "Type": "High School Degree"
                }];
                var FinalData1 = [],
                    FinalDat = [];
                FinalDat.push(FinalData);
                FinalData1.results = FinalDat;
                FinalData1.Degree = DegreeArr;

                var oJsonModel = new sap.ui.model.json.JSONModel(FinalData1);
                this.getView().setModel(oJsonModel, "RequestorModel");

                this.getView().byId("idKaust").setText(kaustId);
                this.getView().byId("idName").setText(name);
                this.getView().byId("idProductsTable").selectAll(true);
                var table = this.getView().byId("idProductsTable");
                this.onSelect();
                //			table.getItems()[0].getCells()[0].setSelected(true);
                //	table.setSelectedItem(table.getItems()[0]);
            },

            getPrefDetails: function (d_kaustid) {
                var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                var sReadRequestURL = "/MyPreferencesCollection";
                var that = this;

                var mHeaders = {};
                mHeaders.kaust_id = d_kaustid;
                mHeaders.sub_service_code = "1702";


                oDataModel.setHeaders(mHeaders);

                oDataModel.read(sReadRequestURL, {

                    success: function (oData1, oResponse) {
                        var preferenceModel = new sap.ui.model.json.JSONModel();
                        preferenceModel.setData(oData1.results[0]);
                        sap.ui.getCore().setModel(preferenceModel, "PrefDetails");
                        that.getView().setModel(preferenceModel, "PrefDetails");
                        var PrefJson = oData1;
                    }, error: function (jqXHR, textStatus) { }
                });
            },

            fileCheck: function (EmpJson, d_kaustid) {
                var doctype = "";
                var errmsg = "";
                var infmsg = "";
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                if (EmpJson.Nationality != null && EmpJson.Nationality.toUpperCase() == "SAUDI ARABIAN") {
                    doctype = "17";
                    errmsg = oBundle.getText("SAUDINATIDNOTUPLOAD");
                    infmsg = oBundle.getText("SAUDINATIDKINENLAT");
                } else {
                    doctype = "3";
                    errmsg = oBundle.getText("IQAMANOTUPLOAD");
                    infmsg = oBundle.getText("LATIQAMAUPLOADED");
                }

                var filechk = false;
                var filechk1 = false;
                filechk = this.getFileAttachmentDetails(null, d_kaustid, doctype);
                //	filechk = "jh";
                if (filechk) { } else {
                    //	if (filechk1) {
                    sap.ui.getCore().attachInit(function () {
                        sap.m.MessageBox.show(errmsg, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oBundle.getText("DOCNOTFOUND"),
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

                };

                this.getPrefDetails(d_kaustid);
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
                        console.log(oData);
                        oDetailsModel.setProperty("/oData", oData.results[0]);
                        that.getView().setModel(oDetailsModel, "oDetailsModel");
                        oDetailsModel.refresh(true);

                        var oDetailsModel = new sap.ui.model.json.JSONModel();
                        oDetailsModel.setData(oData.results[0]);
                        sap.ui.getCore().setModel(oDetailsModel, "EmpDetails");
                        that.getView().setModel(oDetailsModel, "EmpDetails");
                        kaustId = oData.results[0].KaustID;
                        name = oData.results[0].FirstName + " " + oData.results[0].MiddleName + " " + oData.results[0].LastName;
                        that.EmpJson = sap.ui.getCore().getModel("EmpDetails").getData();
                        d_kaustid = that.EmpJson.KaustID;
                        var title = oBundle.getText("WELCOME") + that.EmpJson.FirstName;
                        that.getView().byId("idTitle").setText(title);

                        that.fileCheck(that.EmpJson, d_kaustid);
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



            handleLinkPress: function (oevent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var Path = oevent.getSource().getParent().getBindingContextPath();
                var TblData = this.getView().getModel("TableModel");
                var Linkobj = TblData.getProperty(Path);
                var doctype1 = "";
                var errmsg, infmsg;
                if (Linkobj.Nationality != null && Linkobj.Nationality.toUpperCase() == "SAUDI ARABIAN") {
                    doctype1 = "17";
                    errmsg = oBundle.getText("SAUDINATIDNOTUPLOAD");
                    infmsg = oBundle.getText("SAUDINATIDKINENLAT");
                } else {
                    doctype1 = "3";
                    errmsg = oBundle.getText("IQAMANOTUPLOAD");
                    infmsg = oBundle.getText("LATIQAMAUPLOADED");
                }

                var Linkfilechk = false;
                Linkfilechk = this.getFileAttachmentDetails(null, Linkobj.KaustId, doctype1);
                if (Linkfilechk) {
                    window.open(Linkfilechk.URL);
                } else {
                    sap.ui.getCore().attachInit(function () {
                        sap.m.MessageBox.show(errmsg, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oBundle.getText("DOCNOTFOUND"),
                            actions: [sap.m.MessageBox.Action.OK, "Close"],
                            onClose: function (oAction) {
                                //	if (oAction === "OK") {
                                try {
                                    var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                    window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaattach/index.html";
                                } catch (Exception) {
                                    return;
                                }
                                //	} else {

                                //	}
                            }
                        });
                    });
                }
            },
            onCheckBoxSelect: function (oevent) {
                var selected = oevent.getSource().getSelected();
                var Flag = "";
                //if(selected === false){
                var items = this.getView().byId("idProductsTable").getItems();
                for (var i = 0; i < items.length; i++) {
                    var CheckSelected = items[i].getCells()[0].getSelected();
                    if (CheckSelected === true) {
                        Flag = "X";
                    }
                }

                if (Flag !== "X") {
                    this.handlevisibility(false);
                    //this.getView().byId("rbg2").setSelectedIndex(null);
                    this.byId("ProductTypeStep").setValidated(false);
                    this.byId("idDelivery").setValidated(false);

                } else {
                    this.handlevisibility(true);

                }

                //	}
            },

            onVerify: function (oevent) {
                var items = this.getView().byId("idProductsTable1").getItems();
                /*	var Tabidx = oevent.getSource().getParent().getBindingContextPath();
                        Tabidx = Tabidx.split("/").pop();
                            var Path = oevent.getSource().getParent().getBindingContextPath();
                                var TblData = this.getView().getModel("TableModel");
                            var Linkobj = TblData.getProperty(Path);*/
                var Flag = "";
                var Count = 0;
                for (var i = 0; i < items.length; i++) {
                    var CheckSelected = items[i].getCells()[0].getSelected();
                    if (CheckSelected === true) {
                        Count = Count + 1;
                    }
                }

                if (Count > 0 && items.length > 1) {
                    for (var i = 0; i < items.length; i++) {
                        var CheckSelected = items[i].getCells()[0].getSelected();
                        if (CheckSelected === true) {
                            var SelectedKey = items[i].getCells()[7].getSelectedKey();
                            var file = items[i].getCells()[8].getValue();
                            if (SelectedKey === "" || file === "") {
                                Flag = "X";
                            } else if (file !== "") {
                                items[i].getCells()[8].setValueState("None");
                            }
                        }
                    }
                } else if (items.length === 1 && Count > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var CheckSelected = items[i].getCells()[0].getSelected();
                        if (CheckSelected === true) {
                            var SelectedKey = items[i].getCells()[7].getSelectedKey();
                            var file = items[i].getCells()[8].getValue();
                            if (SelectedKey === "" || file === "") {
                                Flag = "X";
                            }
                        }
                    }
                } else {
                    Flag = "X";
                }

                if (Flag !== "X") {
                    this.byId("ProductTypeStep").setValidated(true);
                    this.byId("idDelivery").setValidated(false);
                    this.wizard.setShowNextButton(true);
                    this.upsDeliveryForm();
                } else {
                    this.byId("ProductTypeStep").setValidated(false);
                    this.byId("idDelivery").setValidated(false);
                    this.wizard.setShowNextButton(false);
                }
            },

            onCheckBoxSelect1: function (oevent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                //	var Radiobtn = this.getView().byId("rbg2").getSelectedIndex();
                var items = this.getView().byId("idProductsTable1").getItems();
                if (oevent) {
                    var Tabidx = oevent.getSource().getParent().getBindingContextPath();
                    Tabidx = Tabidx.split("/").pop();
                    if (oevent.getSource().getSelected() === true) {
                        var Path = oevent.getSource().getParent().getBindingContextPath();
                        var TblData = this.getView().getModel("TableModel");
                        var Linkobj = TblData.getProperty(Path);
                        var doctype1 = "";
                        var errmsg, infmsg;
                        if (Linkobj.Nationality != null && Linkobj.Nationality.toUpperCase() == "SAUDI ARABIAN") {
                            doctype1 = "17";
                            errmsg = oBundle.getText("SAUDINATIDNOTUPLOAD");
                            infmsg = oBundle.getText("SAUDINATIDKINENLAT");
                        } else {
                            doctype1 = "3";
                            errmsg = oBundle.getText("IQAMANOTUPLOAD");
                            infmsg = oBundle.getText("LATIQAMAUPLOADED");
                        }

                        var Linkfilechk = false;
                        Linkfilechk = this.getFileAttachmentDetails(null, Linkobj.KaustId, doctype1);
                        //	Linkfilechk = "hg";
                        if (Linkfilechk) {
                            items[Tabidx].getCells()[7].setEditable(true);
                            items[Tabidx].getCells()[7].setSelectedKey("");
                            items[Tabidx].getCells()[8].setEnabled(true);
                            items[Tabidx].getCells()[8].setValue("");
                        } else {
                            MessageBox.show(
                                errmsg, {
                                icon: MessageBox.Icon.INFORMATION,
                                title: oBundle.getText("CONFIRM"),
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function (sAction) {
                                    if (sAction == "OK") {
                                        if (window.location.href.indexOf("SBY") == -1) {
                                            var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                            window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                                        }
                                    } else {
                                        items[Tabidx].getCells()[0].setSelected(false);
                                    }
                                }
                            }
                            );

                        }

                    } else {
                        items[Tabidx].getCells()[7].setEditable(false);
                        items[Tabidx].getCells()[7].setSelectedKey("");
                        items[Tabidx].getCells()[8].setEnabled(false);
                        items[Tabidx].getCells()[8].setValue("");
                        items[Tabidx].getCells()[8].setValueState("Error");
                    }
                }
                //	var selected = oevent.getSource().getSelected();
                var Flag = "";
                var Count = 0;

                for (var i = 0; i < items.length; i++) {
                    var CheckSelected = items[i].getCells()[0].getSelected();
                    if (CheckSelected === true) {
                        Count = Count + 1;
                    }
                }

                if (Count > 0 && items.length > 1) {
                    for (var i = 0; i < items.length; i++) {
                        var CheckSelected = items[i].getCells()[0].getSelected();
                        if (CheckSelected === true) {
                            var SelectedKey = items[i].getCells()[7].getSelectedKey();
                            var file = items[i].getCells()[8].getValue();
                            if (SelectedKey === "" || file === "") {
                                Flag = "X";
                            }
                        }
                    }
                } else if (items.length === 1 && Count > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var CheckSelected = items[i].getCells()[0].getSelected();
                        if (CheckSelected === true) {
                            var SelectedKey = items[i].getCells()[7].getSelectedKey();
                            var file = items[i].getCells()[8].getValue();
                            if (SelectedKey === "" || file === "") {
                                Flag = "X";
                            }
                        }
                    }
                } else {
                    Flag = "X";
                }

                if (Flag !== "X") {
                    this.byId("ProductTypeStep").setValidated(true);
                    this.byId("idDelivery").setValidated(false);
                    this.wizard.setShowNextButton(true);
                    this.upsDeliveryForm();
                } else {
                    this.byId("ProductTypeStep").setValidated(false);
                    this.byId("idDelivery").setValidated(false);
                    this.wizard.setShowNextButton(false);
                }
            },

            handlevisibility: function (visible) {
                /*	this.getView().byId("RbgLabel").setVisible(visible);
                    this.getView().byId("rbg2").setVisible(visible);
                    if (visible !== true) {
                        this.getView().byId("rbg2").setSelectedIndex(null);
                    }*/

            },
            handleAttachVisible: function (visbile) {
                this.getView().byId("AttachPanel").setVisible(visbile);
                if (visbile === false) {
                    this.wizard.invalidateStep(this.byId("ProductTypeStep"));
                    this.wizard.invalidateStep(this.byId("idDelivery"));
                }
            },

            onRowChange: function (oevent) {
                //	var key = oevent.getSource().getSelectedKey();
                //	var selectedBtn = this.getView().byId("rbg2").getSelectedIndex();
                this.wizard = this.getView().byId("CreateProductWizard");
                var table = this.getView().byId("idProductsTable1");
                this.onCheckBoxSelect1();

            },

            onSelect: function (oevent, sel) {
                var that = this;
                var FinalTableData = [];
                var FinalTableData1 = [];
                this.getView().byId("idProductsTable1").setVisible(true);
                var FinalAr = [];
                TableData.results.forEach(function (val, index) {
                    //delete val.ScanTstmp1;
                    if (index !== 0 && val.Relationship === "Child") {
                        FinalAr.push(val);
                    }
                });
                // if (FinalAr.length > 0) {
                FinalTableData.results = FinalAr;
                var DegreeArr = [{
                    "Type": "Elementary Degree"
                }, {
                    "Type": "Middle Degree"
                }, {
                    "Type": "High School Degree"
                }];
                FinalTableData.Degree = DegreeArr;
                FinalTableData.results.forEach(function (val, index) {
                    val.Msg5 = "";
                });
                var oJsonModel1 = new sap.ui.model.json.JSONModel(FinalTableData);
                this.getView().setModel(oJsonModel1, "TableModel");
                //	this.TableSelection(selectedBtn);
                this.wizard = this.getView().byId("CreateProductWizard");
                this.byId("ProductTypeStep").setValidated(false);
                this.byId("idDelivery").setValidated(false);
                this.wizard.setShowNextButton(false);
                // } else {
                //     sap.ui.getCore().attachInit(function () {
                //         sap.m.MessageBox.show("This service is applicable only for child dependents(Son / Daughter)", {
                //             icon: sap.m.MessageBox.Icon.ERROR,
                //             title: "Error",
                //             actions: [sap.m.MessageBox.Action.OK],
                //             onClose: function (oAction) {
                //                 try {
                //                     var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                //                     window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                //                 } catch (Exception) {
                //                     return;
                //                 }

                //             }
                //         });
                //     });
                // }
            },

            TableSelection: function (Btn) {
                var table = this.getView().byId("idProductsTable1");
                if (table.getItems()[0]) {
                    if (Btn === 0) {
                        table.getItems()[0].getCells()[0].setSelected(true);
                        table.getItems()[0].getCells()[0].setEditable(false);
                        table.getItems()[0].getCells()[7].setEditable(true);
                    } else if (Btn === 1) {
                        table.getItems()[0].getCells()[0].setSelected(false);
                        table.getItems()[0].getCells()[0].setEditable(true);
                        table.getItems()[0].getCells()[7].setEditable(false);
                    } else {
                        table.getItems()[0].getCells()[0].setSelected(true);
                        table.getItems()[0].getCells()[0].setEditable(false);
                        table.getItems()[0].getCells()[7].setEditable(true);
                    }
                }
            },

            onAtt: function () {
                var doctype;
                var empnation;
                var CarAttJson = [];
                var oView = this.getView();
                // var oModelGasc = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
                // oModelGasc.read("UserDetail(KaustID='" + this.EmpJson.KaustId + "',UserId='')", null, null, false, function (data, response) {
                //     empnation = data.Nationality;
                // },
                //     function (response) {
                //         return "";
                //     });
                empnation = this.getView().getModel("EmpDetails").getData().Nationality;
                if (empnation != null && empnation.toUpperCase() == "SAUDI ARABIAN") {
                    doctype = "17";
                    oView.byId("MCDLISSatt1").setText("Saudi ID");
                    //	oView.byId("Atttext").setText("Saudi ID");

                } else {
                    doctype = "3";
                    oView.byId("MCDLISSatt1").setText("Iqama");
                    //	oView.byId("Atttext").setText("Iqama");
                }

                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                // var attxt1 = "FileRead?$filter=UNIQUE_ID eq '" + this.EmpJson.KaustId +
                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + doctype + "'";
                // oAttachModel.read(attxt1, null, null, false, function (data, response) {
                //     var attachModel = new sap.ui.model.json.JSONModel();
                //     attachModel.setData(data);
                //     CarAttJson = data;
                // },
                //     function (response) {
                //         return "";
                //     });

                if (CarAttJson.results.length > 0) {
                    //	oView.byId("MCDLISSatt1").setHref(CarAttJson.results[0].URL);
                }
            },
            onClose: function (oevent) {
                this._oPopover.close();
                this._oPopover.destroy();
            },

            onBackPress: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                MessageBox.show(
                    oBundle.getText("ALLUNSAVEDDATALOSTCONT"), {
                    icon: MessageBox.Icon.INFORMATION,
                    title: oBundle.getText("CONFIRM"),
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            if (window.location.href.indexOf("SBY") == -1) {
                                var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                            } else {
                                location.reload(true);
                            }
                        }
                    }
                }
                );
            },

            wizardCompletedHandler: function (oevent) {
                var DepJson = [];
                var items = this.getView().byId("idProductsTable1").getItems();
                var TableModel = this.getView().getModel("TableModel").getData();
                for (var i = 0; i < items.length; i++) {
                    var CheckSelected = items[i].getCells()[0].getSelected();
                    if (CheckSelected === true) {
                        var obj = TableModel.results[i];
                        DepJson.push(obj);
                    }
                }
                this.onSubmit(oevent, this.EmpJson, DepJson, NatJson, PrefJson);
            },

            uploadfile: function (request) {
                var items = this.getView().byId("idProductsTable1").getItems();
                //attachdata = items;
                var TableModel = this.getView().getModel("TableModel").getData();

                for (var i = 0; i < items.length; i++) {
                    //	var oFileUploaderCHDS1 = this.getView().byId("idLicenseAttach");
                    //var sDocNames1 = oFileUploaderCHDS1.getValue();
                    if (items[i].getCells()[0].getSelected() === true) {
                        var sDocNames1 = items[i].getCells()[8].getValue();
                        var obj = items[i].getCells()[1].getText();
                        attachdata.push(obj);

                        sDocNames1 = items[i].getCells()[1].getText() + "_MOE" + sDocNames1.substr(sDocNames1.indexOf("."));
                        var uploader = items[i].getCells()[8];
                        this.fileUpload(sDocNames1, uploader, oTokenModel, "params1", "slugs1", request, "29");
                        break;
                    }
                }
                //	oBusyDialogCreate.close();
            },

            onSubmit: function (oEvent, EmpJson, DepJson, NatJson, PrefJson) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                var collectionmtd = "0";
                var deliverymtd = "0";
                var ReqType = "";
                var Feespaid = "";
                var category;
                //	ReqType = this.getView().byId("rbg2").getSelectedIndex();
                /*if () {
                    Cardexpired = "X";
                }*/

                if (this.getView().byId("Delivery").getSelected()) {
                    deliverymtd = "1";
                }

                if (this.getView().byId("Collection").getSelected()) {
                    collectionmtd = "1";
                }
                // oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/");
                // //	oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
                // oTokenModel.refreshSecurityToken();
                if (this.byId("ProductTypeStep").getValidated()) {
                    var Headertochild = [];
                    var chind = [];
                    var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "yyyy-MM-dd HH:mm:ss"
                    });
                    var DateStmp = oDateFormat1.format(new Date());
                    DateStmp = DateStmp.split(" ");
                    //	category = this.getView().byId("rbg2").getSelectedIndex();

                    category = 2;
                    var Timestmp = DateStmp[0] + "T" + DateStmp[1];
                    for (var i = 0; i < DepJson.length; i++) {
                        var arr = {};
                        arr = {
                            kaust_id: DepJson[i].KaustID,
                            first_name: DepJson[i].FirstName,
                            last_name: DepJson[i].LastName,
                            middle_name: DepJson[i].MiddleName,
                            iqama_no: DepJson[i].IQAMANumber,
                            // saudi_id_no: DepJson[i].SaudiNo,
                            gender: DepJson[i].Gender,
                            nationality: DepJson[i].Nationality,
                            collection_mtd: collectionmtd,
                            delivery_mtd: deliverymtd,
                            service_type: category,
                            degree: DepJson[i].Msg5

                        }

                        // arr = {
                        //     "KaustId": DepJson[i].KaustId,
                        //     "RequestId": "",
                        //     "FirstName": DepJson[i].Fname,
                        //     "LastName": DepJson[i].Lname,
                        //     "MiddleName": DepJson[i].Mname,
                        //     "IqamaNo": DepJson[i].IqamaNo,
                        //     "IdNumber": DepJson[i].SaudiNo,
                        //     "Type": DepJson[i].Gender,
                        //     "Nationality": DepJson[i].Nationality,
                        //     "CollectionMtd": collectionmtd,
                        //     "DeliveryMtd": deliverymtd,
                        //     "ServiceType": category,
                        //     "Degree": DepJson[i].Msg5

                        // };
                        Headertochild.push(arr);
                        chind.push(i);
                        //}
                    }

                    var oBusyDialogCreate = new sap.m.BusyDialog({
                        text: oBundle.getText("CREATENEWREQ")
                    });
                    oBusyDialogCreate.open();
                    jQuery.sap.delayedCall(100, this, function () {
                        try {
                            var that = this;
                            var preferenceData = this.formatPreferenceData(PrefJson);
                            preferenceData.deliv_flag = "1";
                            if (!this.validatePreferenceData(preferenceData)) {
                                oBusyDialogCreate.close();
                                return;
                            }

                            var oHeader = {
                                request_id: "",
                                on_behalf: "",
                                sub_service_code: "1702",
                                service_code: "0017",
                                status: 1,
                                process_id: "MOE",
                                first_name: EmpJson.FirstName,
                                middle_name: EmpJson.MiddleName,
                                last_name: EmpJson.LastName,
                                email: EmpJson.EMailAddress,
                                log: [oLog]

                            };

                            var oLog = {
                                sequence_number: 1,
                                timestamp: new Date().toString(),
                                status: 1
                            };


                            var oEntryData = {
                                kaust_id: EmpJson.KaustID,
                                name: EmpJson.FirstName + " " + EmpJson.MiddleName + " " + EmpJson.LastName,
                                MOEAttest: Headertochild
                            };


                            // var oEntryData = {

                            //     "KaustId": EmpJson.KaustID,
                            //     "RequestId": "",
                            //     "IqamaNo": EmpJson.Iqama,
                            //     "SubServiceCode": "1702",
                            //     "ServiceCode": "0017",
                            //     "Status": "001",
                            //     "FirstName": EmpJson.FirstName,
                            //     "MiddleName": EmpJson.MiddleName,
                            //     "LastName": EmpJson.LastName,
                            //     "Email": EmpJson.Email,
                            //     "IdNumber": EmpJson.SaudiID,
                            //     "Nationality": EmpJson.Nationality,
                            //     "Process": "MOE",
                            //     "Headertomoe": Headertochild
                            // };

                            attachcount = Headertochild.length;

                            var that = this;
                            var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                            var sRequestURL = "/GASC_HeaderSet";


                            oDataModel.create(sRequestURL, oEntryData, {

                                success: function (data, response) {
                                    that.requestId = oResponse.data.request_id;
                                    var reqId = oResponse.data.request_id;
                                    oHeader.request_id = reqId;
                                    that.createHeader(oHeader, that, oBusyDialogCreate);
                                    // oBusyDialogCreate.close();
                                    // that.requestId = data.request_id;

                                    // if (preferenceData.deliv_flag == "1") {
                                    //     that.updatePreferenceData(preferenceData);
                                    // }
                                    // that.closeSubmit(oEvent);
                                },
                                error: function (jqXHR, textStatus) {
                                    oBusyDialogCreate.close();
                                    jQuery.sap.require("sap.m.MessageBox");
                                    if (textStatus === "timeout") {
                                        sap.m.MessageBox.show(oBundle.getText("TIMEOUT"), {
                                            icon: sap.m.MessageBox.Icon.ERROR,
                                            title: oBundle.getText("ERROR"),
                                            actions: [sap.m.MessageBox.Action.OK],
                                        });
                                    } else {
                                        jQuery.sap.log.fatal("PROBLEM" + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);
                                    };
                                }
                            });

                            //	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/", true);
                            // var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
                            // var that = this;
                            // oModel.create("GASC_HeaderSet", oEntryData, null, function (response) {
                            //     that.requestId = response.RequestId;
                            //     Requestid = response.RequestId;
                            //     if (preferenceData.deliv_flag == "1") {
                            //         that.updatePreferenceData(preferenceData);
                            //     }
                            //     that.uploadfile(that.requestId);
                            //     //fncall.closeSubmit(oEvent, PrefJson);
                            // },
                            //     function () {
                            //         oBusyDialogCreate.close();
                            //         alert("Request creation failed");
                            //         return;
                            //     });
                        } catch (Exception) {
                            oBusyDialogCreate.close();
                            alert(Exception.message);
                        }
                    });
                } else {
                    MessageBox.error(oBundle.getText("KINDFILLMISSREQFIL"), {
                        styleClass: bCompact ? "sapUiSizeCompact" : "",
                        icon: MessageBox.Icon.ERROR,
                    });
                }
            },
            createHeader: function (header, that, busyDialog) {
                var oResourceModel = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oCommonModel = that.getOwnerComponent().getModel("oCommonModel");
                var sURL = "/ReqHeader";
                oCommonModel.create(sURL, header, {
                    success: function (data, oResponse) {
                        busyDialog.destroy();

                        var sWFResponse = that.initiateRequestApprovalProcess(that, header);
                        if (sWFResponse) {
                            that.closeSubmit(oEvent);
                            // jQuery.sap.require("sap.m.MessageBox");
                            // sap.m.MessageBox.show(
                            //     oResourceModel.getText("THANK_REQ") +
                            //     oResponse.data.request_id + oResourceModel.getText("THANK_REQ1"), {
                            //     icon: sap.m.MessageBox.Icon.SUCCESS,
                            //     title: oResourceModel.getText("SUCCESS"),
                            //     actions: [sap.m.MessageBox.Action.OK],
                            //     onClose: function (oAction) {
                            //         window.history.go(-1);
                            //     }
                            // });

                            // that.getView().byId("submitButton").setEnabled(false);
                        }
                        else {
                            busyDialog.destroy();
                            jQuery.sap.require("sap.m.MessageBox");

                            sap.m.MessageBox.show(oResourceModel.getText("UNSUCCESS"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: oResourceModel.getText("ERROR"),
                                actions: [sap.m.MessageBox.Action.OK],
                            });

                        }

                    },
                    error: function (jqXHR, textStatus) {
                        busyDialog.destroy();
                        jQuery.sap.require("sap.m.MessageBox");
                        if (textStatus === "timeout") {
                            sap.m.MessageBox.show(oResourceModel.getText("TIMEOUT"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: oResourceModel.getText("ERROR"),
                                actions: [sap.m.MessageBox.Action.OK],
                            });
                        } else {
                            jQuery.sap.log.fatal(oResourceModel.getText("PROBLEM") + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);
                        };
                    }
                })

            },
            _getWorkflowRuntimeBaseURL: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                return appModulePath + "/CAPM_Common/commonlib/js";
            },

            initiateRequestApprovalProcess: function (that, header) {
                that.getView().setBusy(true);
                var baseURL = that._getWorkflowRuntimeBaseURL();

                var oWflow = sap.ui.getCore().loadLibrary("reuselibrary", baseURL);
                var wfResponse = oWflow.triggerWF(header.on_behalf, header.request_id, header.sub_service_code, "X", that);

                if (wfResponse.status !== null && wfResponse.id !== null) {
                    return true;
                }
                else {

                    $.ajax({
                        url: that._getBaseURL(that) + "/CAPM/v2/commonservice/DeleteTable()?request_id='" + that.requestId + "'&header=true",
                        method: "GET",
                        success: function (s, i, a) {

                        },
                        error: function () {

                        }
                    })


                    return false;
                }
            },
            _getBaseURL: function (that) {
                var e = that.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                return jQuery.sap.getModulePath(e)
            },

            handleUploadComplete: function (oevent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fileStatus = oevent.getParameters("status");
                if (fileStatus.status !== 201) {
                    MessageBox.error(fileStatus.fileName + oBundle.getText(" FILEUPLOADFAIL"), {
                        styleClass: bCompact ? "sapUiSizeCompact" : "",
                        icon: MessageBox.Icon.ERROR,
                    });
                } else {
                    var items = this.getView().byId("idProductsTable1").getItems();
                    if (attachcount === attachdata.length) {
                        this.closeSubmit(oevent, PrefJson);
                    } else {
                        for (var k = 0; k < items.length; k++) {
                            //	var oFileUploaderCHDS1 = this.getView().byId("idLicenseAttach");
                            //var sDocNames1 = oFileUploaderCHDS1.getValue();
                            if (items[k].getCells()[0].getSelected() === true) {
                                var sDocNames1 = items[k].getCells()[8].getValue();
                                if (attachdata.includes(items[k].getCells()[1].getText())) {

                                } else {
                                    var obj = items[k].getCells()[1].getText();
                                    attachdata.push(obj);
                                    sDocNames1 = items[k].getCells()[1].getText() + "_MOE" + sDocNames1.substr(sDocNames1.indexOf("."));
                                    var uploader = items[k].getCells()[8];
                                    this.fileUpload(sDocNames1, uploader, oTokenModel, "params1", "slugs1", Requestid, "29");
                                    break;

                                }

                            }
                        }
                    }
                }

                //this.closeSubmit(oevent, PrefJson);
            },
            fileUpload: function (sDocName, oFileUploader, oTokenModel1, param, slug, requestId, DocType) {
                var that = this;
                sDocName = sDocName.replace(/[^a-zA-Z0-9-_\.]/g, "");
                oFileUploader.setValue(sDocName);
                /*	var par2 = oFileUploader.getHeaderParameters()[0].getId();
                    var par1 = par2.split("idMOEATTEST--");
                    var par = par1[1];
                    var slg2 = oFileUploader.getHeaderParameters()[1].getId();
                    var slg1 = slg2.split("idMOEATTEST--");
                    var slg = slg1[1];
                    console.log(par + ',' + slg);
                    console.log(oFileUploader.getValue());*/
                var abc = oFileUploader.getId();
                /*	var ui = abc.split("idMOEATTEST--");
                    var io = ui[1];*/
                oFileUploader = sap.ui.getCore().byId(abc);
                oFileUploader.setUseMultipart(false);
                oFileUploader.setName("uploadAttachment");
                // oFileUploader.setSendXHR(true);
                // oFileUploader.setUploadUrl("/sap/opu/odata/SAP/ZCUSRV0005TS_ATTACHMENT/FileAttachCollection");
                // oFileUploader.removeAllHeaderParameters();
                // var oTokenModel1 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                // //	oTokenModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01/", true);
                // oTokenModel.refreshSecurityToken();

                // oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                //     name: "x-csrf-token",
                //     value: oTokenModel1.getSecurityToken()
                // }));

                // oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                //     name: "SLUG",
                //     value: oFileUploader.getValue() + "," + requestId + "," + DocType + ",99991231"
                // }));
                // oFileUploader.upload();

            },

            getFileAttachmentDetails: function (oEvent, kaustid, Doctype) {
                // sap.ui.core.BusyIndicator.show(0);
                // var filechk = false;
                // var oAttachModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZCUSRV0005TS_ATTACHMENT/");
                // var attxt = "FileRead?$filter=UNIQUE_ID eq '" + kaustid +
                //     "' and APPLICATION_TYPE eq '22' and DOCCLASS eq 'ZCUUTLD01' and DOCTYPE eq '" + Doctype + "'";
                // oAttachModel.read(attxt, null, null, false, function (data, response) {
                //     var attachModel = new sap.ui.model.json.JSONModel();
                //     attachModel.setData(data);
                //     sap.ui.core.BusyIndicator.hide();
                //     if (data.results.length > 0) {
                //         if (data.results[0].URL.length > 0) {
                //             filechk = data.results[0];
                //         }
                //     }
                // },
                //     function (response) {
                //         return "";
                //     });
                // return filechk;
                return true;
            },

            closeSubmit: function (oEvent) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var fncall = this;
                jQuery.sap.delayedCall(100, this, function () {
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(oBundle.getText("YOURREQIDIS") + fncall.requestId + "'.", // +
                        {
                            icon: sap.m.MessageBox.Icon.SUCCESS,
                            title: oBundle.getText("REQSUBMITSUCCESS"),
                            styleClass: bCompact ? "sapUiSizeCompact" : "",
                            actions: [sap.m.MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === "OK") {
                                    if (window.location.href.indexOf("SBY") == -1) {
                                        var gaurl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
                                        window.location.href = gaurl + "/sap/bc/ui5_ui5/sap/zui5_gaoverview/index.html";
                                    } else {
                                        try {
                                            window.location.assign("about:blank");
                                        } catch (Exception) { }
                                    }
                                    fncall.oBusyDialogCreate.close();
                                }
                            }
                        });
                });
            },

            formatPreferenceData: function (PrefJson) {
                var userData = sap.ui.getCore().getModel("EmpDetails").getData();
                var preferenceData = this.getView().getModel("PrefDetails").getData();
                preferenceData.sub_service_code = "1702";
                preferenceData.first_name = userData.FirstName;
                preferenceData.middle_name = userData.MiddleName;
                preferenceData.last_name = userData.LastName;
                preferenceData.deliv_flag = 0;
                preferenceData.no_serv_code = PrefJson.no_serv_code;
                if (preferenceData.kaust_id == "") {
                    preferenceData.kaust_id = userData.KaustID;
                }
                preferenceData.mobile_no = this.getView().byId("idMobile").getValue();
                preferenceData.building_name = this.getView().byId("idRoomNo").getValue();
                preferenceData.building_no = this.getView().byId("idBuilding").getValue();
                preferenceData.level_b = this.getView().byId("idLevel").getValue();
                return preferenceData;
            },

            upsDeliveryForm: function () {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.wizard = this.getView().byId("CreateProductWizard");
                var mobile = this.getView().byId("idMobile");
                var level = this.getView().byId("idLevel");
                var buildingNo = this.getView().byId("idBuilding");
                var buildingName = this.getView().byId("idRoomNo");

                if (mobile.getValue() === "") {
                    mobile.setValueState("Error");
                    mobile.setValueStateText(oBundle.getText("PLSENTERMOBNUM"));
                } else {
                    mobile.setValueState("None");
                }

                if (level.getValue() === "") {
                    level.setValueState("Error");
                    level.setValueStateText(oBundle.getText("PLEENTERLEV"));
                } else {
                    level.setValueState("None");
                }

                if (buildingNo.getValue() === "") {
                    buildingNo.setValueState("Error");
                    buildingNo.setValueStateText(oBundle.getText("PLEENTERBUILDNAMENUM"));
                } else {
                    buildingNo.setValueState("None");
                }

                if (buildingName.getValue() === "") {
                    buildingName.setValueState("Error");
                    buildingName.setValueStateText(oBundle.getText("PLEROONNOCUB"));
                } else {
                    buildingName.setValueState("None");
                }

                if ((mobile.getValue() != "") && (buildingName.getValue() != "") && (buildingNo.getValue() != "") && (level.getValue() != "")) {
                    this.wizard.validateStep(this.byId("idDelivery"));
                } else {
                    this.wizard.invalidateStep(this.byId("idDelivery"));
                    return;
                }

            },

            updatePreferenceData: function (preferenceData) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                // var oPreferenceModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0003TSR_GASC_PREF/");
                // sap.ui.getCore().setModel(oPreferenceModel, "oPreferenceModel");
                var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                // var oPreferenceModel1 = sap.ui.getCore().getModel("oPreferenceModel");
                if (preferenceData.kaust_id && preferenceData.sub_service_code) {
                    if (preferenceData.no_serv_code == "X") {
                        oDataModel.create("/MyPreferencesCollection",
                            preferenceData, null,
                            function () { },
                            function (oError) {
                                sap.m.MessageBox.alert(oBundle.getText("ERRORSAVPREFDET"), {
                                    title: oBundle.getText("ERROR"),
                                    onClose: null,
                                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                                    textDirection: sap.ui.core.TextDirection.Inherit
                                });
                            });
                    } else {
                        oDataModel.update("/MyPreferencesCollection(kaust_id='" + preferenceData.kaust_id + "',sub_service_code='0416')",
                            preferenceData, null,
                            function () { },
                            function (oError) {
                                sap.m.MessageBox.alert(oBundle.getText("ERRORUPDPREFSET"), {
                                    title: oBundle.getText("ERROR"),
                                    onClose: null,
                                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                                    textDirection: sap.ui.core.TextDirection.Inherit
                                });
                            });
                    }
                }
            },

            validatePreferenceData: function (data) {
                var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                if (!this.validateTelephoneNum(null, data.mobile_no)) {
                    sap.m.MessageBox.alert(oBundle.getText("INVALIDTELPNUM"), {
                        title: oBundle.getText("ERROR"),
                        styleClass: bCompact ? "sapUiSizeCompact" : "",
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
                    sap.m.MessageBox.alert(oBundle.getText("PLEROONNOCUB"), {
                        title: oBundle.getText("ERROR"),
                        onClose: null,
                        textDirection: sap.ui.core.TextDirection.Inherit
                    });
                    return false;
                }
                if (!this.validateBuildingNum(null, data.building_no)) {
                    sap.m.MessageBox.alert(oBundle.getText("PLEENTERBUILDNAMENUM"), {
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
                var reg =
                    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
                } else {
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
                } else {
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
                } else {
                    if (oEvent) {
                        oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    }
                    return true;
                }
            }
        });
    });
