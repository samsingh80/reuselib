sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.kaust.zui5security.controller.SecurityFormView", {
            onInit: function () {
                var requestId = jQuery.sap.getUriParameters().get("requestId");
                //	 requestId ="0020005636";
                var sUrl = "";
                var userModel = new sap.ui.model.json.JSONModel();



                if (!requestId) {
                    //Fetch the user detail
                    this.getUserDetails();
                    //     //-- Read Only Mode --\&nbsp; 
                } else {
                    var oUserModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oUserModel, "oUserModel");

                    sUrl = this.getUrl("/SecurityIncidentRequest(request_id='" + requestId + "')");
                    var expand = "header,log";
                    var oModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                    var that = this;
                    oDataModel.read(sUrl, {
                        urlParameters: {
                            "$expand": expand
                        },
                        success: function (data, response) {
                            userModel.setData(data);
                            that.setRequestDetails(userModel, that);
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

                            }
                        }
                    });
                }

            },
            setRequestDetails: function (userModel, that) {
                //handle OnBehalf behavior
                var onbehalf = userModel.oData.on_behalf;
                if (onbehalf == "X") {
                    var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                    that.getView().byId("onBehalf").setSelected(true);
                    var requestorForm = that.getView().byId("formData");
                    var label = new sap.m.Label({ text: oResourcebundle.getText("REQ_INITIATOR") });
                    var text = new sap.m.Text().setText(userModel.oData.userid);
                    requestorForm.addContent(label);
                    requestorForm.addContent(text);
                }
                that.getView().byId("onBehalf").setEnabled(false);
                that.getView().byId("pickButton").setVisible(false);

                // hide buttons  	
                that.getView().byId("footerbar").setVisible(false);
                that.getView().byId("cancelButton").setVisible(false);
                //			this.getView().byId("resetButton").setVisible(false);
                that.getView().byId("submitButton").setVisible(false);

                // change bindingPath for the Requestor Information tab   	
                var kaustId = userModel.oData.header.kaust_id;
                that.getUserData(kaustId, userModel);



            },



            //Get the User Details
            getUserDetails: function () {
                var oUserModel = new sap.ui.model.json.JSONModel();
                var ohelpModel = new sap.ui.model.json.JSONModel();
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
                        oUserModel.setProperty("/oUserData", oData.results[0]);
                        that.getView().setModel(oUserModel, "oUserModel");
                        var helpData = JSON.parse(JSON.stringify(oData.results[0]));
                        ohelpModel.setData(helpData);
                        that.getView().setModel(ohelpModel, "helpModel");
                        ohelpModel.refresh(true);
                        oUserModel.refresh(true);
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
            _setDetailstoView: function (userModel) {

                var location = userModel.oData.location;
                if (location == "Residence") {
                    that.getView().byId("loc").setSelectedIndex(1);
                }
                this.getView().byId("loc").setEnabled(false);
                this.getView().byId("idTypeOfIncidentSelect").setEnabled(false);
                this.getView().byId("idIPOfAffectedSystemInput").setEditable(false).setPlaceholder("");
                this.getView().byId("idAdditionalInformationArea").setEditable(false).setPlaceholder("");
                this.getView().byId("idSuspectedSourceArea").setEditable(false).setPlaceholder("");



                this.getView().setModel(userModel);

                var form = this.getView().byId("encryptionSimpleForm");
                form.setModel(userModel);

            },

            getUserData: function (kaustId, userModel) {

                this._setDetailstoView(userModel);

            },
            handlePick: function () {

                var checkBox = this.getView().byId("onBehalf");
                var selected = checkBox.getSelected();
                if (selected) {

                    var oDialog1 = new sap.m.Dialog("pickDialog");
                    sap.ui.getCore().setModel(oi18nModel, "i18n");
                    var oResourcebundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                    var title = oResourcebundle.getText("PEOPLE_SEARCH");
                    oDialog1.setTitle(title);
                    oDialog1.setModel(oi18nModel, "i18n");
                    var that = this;
                    var simpleForm = new sap.ui.layout.form.SimpleForm({


                        maxContainerCols: 2,
                        content: [
                            new sap.m.Label({ text: oResourcebundle.getText("KAUST_BADGE_NUM"), required: true }),
                            new sap.m.Input({ id: "inputSearch" }),
                            new sap.m.Button({
                                text: oResourcebundle.getText("SEARCH"), icon: "sap-icon://search", press: function (evt) {

                                    var param = sap.ui.getCore().byId("inputSearch").getValue();

                                    if (param != "") {
                                        that.fetchOnBehalf(param);
                                    } else {
                                        var oResourcebundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
                                        jQuery.sap.require("sap.m.MessageBox");
                                        sap.m.MessageBox.show(oResourcebundle.getText("DEFINE_USERNAME"), {
                                            icon: sap.m.MessageBox.Icon.WARNING,
                                            title: oResourcebundle.getText("WARNING"),
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
                            new sap.ui.core.Title({ text: oResourcebundle.getText("SEARCH_RESULT") })
                        ],
                        visible: true,
                        maxContainerCols: 2,
                        content: [
                            new sap.m.Label({ text: "First Name" }),
                            new sap.m.Text({ text: "{/FirstName}" }),
                            new sap.m.Label({ text: "Last Name" }),
                            new sap.m.Text({ text: "{/LastName}" }),
                            new sap.m.Label({ text: "Email" }),
                            new sap.m.Text({ text: "{/EMailAddress}" }),
                            new sap.m.Label({ text: "Mobile No." }),
                            new sap.m.Text({ text: "{/MobileNo}" }),
                            new sap.m.Label({ text: "Office Tel." }),
                            new sap.m.Text({ text: "{/OfficeNo}" }),
                            new sap.m.Label({ text: "Cost Center" }),
                            new sap.m.Text({ text: "{/CostCenter}" })
                        ]
                    });

                    oDialog1.addContent(simpleForm);

                    // Pick the user from the search and copy it to main sceen

                    oDialog1.addButton(new sap.m.Button({
                        id: "pickButton", enabled: false, text: oResourcebundle.getText("PICK"), type: "Accept", icon: "sap-icon://cause", press: function () {

                            var oModel = that.oView.getModel("oUserModel");
                            var searchModel = that.oView.getModel("searchModel");
                            oModel.setProperty("/oUserData/FirstName", searchModel.oData.FirstName, null);
                            oModel.setProperty("/oUserData/LastName", searchModel.oData.LastName, null);
                            oModel.setProperty("/oUserData/KaustID", searchModel.oData.KaustID, null);
                            oModel.setProperty("/oUserData/EMailAddress", searchModel.oData.EMailAddress, null);
                            oModel.setProperty("/oUserData/OfficeNo", searchModel.oData.OfficeNo, null);
                            oModel.setProperty("/oUserData/MobileNo", searchModel.oData.MobileNo, null);
                            oModel.setProperty("/oUserData/CostCenter", searchModel.oData.CostCenter, null);
                            oModel.setProperty("/oUserData/PositionShortText", searchModel.oData.PositionShortText, null);
                            oModel.setProperty("/oUserData/DepartmentName", searchModel.oData.DepartmentName, null);

                            oModel.updateBindings();
                            that.getView().byId("onBehalf").setEditable(false);
                            oDialog1.destroy();
                        }
                    }));

                    // Cancel the popUP  	

                    oDialog1.addButton(new sap.m.Button({
                        text: oResourcebundle.getText("CANCEL"), icon: "sap-icon://sys-cancel", type: "Reject", press: function () {
                            sap.ui.getCore().byId("sForm2").destroy();
                            oDialog1.destroy();

                        }
                    }));



                    oDialog1.open();

                } else {
                    var oi18nModel = new sap.ui.model.resource.ResourceModel({
                        bundleUrl: "/sap/fiori/zui5security/i18n/i18n.properties"
                    });
                    sap.ui.getCore().setModel(oi18nModel, "i18n");

                    var that = this;
                    var oResourcebundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                    jQuery.sap.require("sap.m.MessageBox");

                    sap.m.MessageBox.show(oResourcebundle.getText("ONBEHALF_SELECTION_CHECK"), {
                        icon: sap.m.MessageBox.Icon.WARNING,
                        title: oResourcebundle.getText("WARNING"),
                        actions: [sap.m.MessageBox.Action.OK],
                        //	              	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                    }
                    );

                }


            },
            fetchOnBehalf: function (param) {
                var that = this;
                var oUserModel = new sap.ui.model.json.JSONModel();
                var osearchModel = new sap.ui.model.json.JSONModel();
                that.oView.setModel(osearchModel, "searchModel");

                var form = sap.ui.getCore().byId("sForm2");
                var dialog = sap.ui.getCore().byId("pickDialog");
                var pickButton = sap.ui.getCore().byId("pickButton");
                var aFilters = this.getOnbehalfFilter(param);
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
                        if (data.KaustID != "") {
                            var oModel = that.oView.getModel("searchModel");
                            oModel.setData(data);
                            var form = sap.ui.getCore().byId("sForm2");
                            form.setModel(oModel);
                            pickButton.setEnabled(true);
                            dialog.addContent(form);
                            //--User Not Found--\\
                        } else {

                            jQuery.sap.require("sap.m.MessageBox");

                            sap.m.MessageBox.show(oResourceModel.getText("NO_USER_FOUND"), {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: oResourceModel.getText("ERROR"),
                                actions: [sap.m.MessageBox.Action.OK],
                            }
                            );
                            pickButton.setEnabled(false);
                            dialog.removeContent(form);

                        }
                    },
                    error: function (data, textStatus, XMLHttpRequest) {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(oResourceModel.getText("NO_USER_FOUND"), {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: oResourceModel.getText("ERROR"),
                            actions: [sap.m.MessageBox.Action.OK],
                        });
                    }
                });

            },
            getOnbehalfFilter: function (param) {
                {
                    var aFilters = [],
                        aFilterIds = ["UserType", "KaustID", "DisplayDependents"],
                        aFilterValues = ["STUDENT", param, "X"],
                        i;
                    for (i = 0; i < aFilterIds.length; i = i + 1) {
                        aFilters.push(new Filter(aFilterIds[i], FilterOperator.EQ, aFilterValues[i], ""));

                    }
                    return aFilters;

                };
            },
            validateOnBehalf: function () {
                var oResourcebundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var canContinue = true;
                var onBehalfButton = this.getView().byId("onBehalf");
                if (onBehalfButton.getSelected()) {
                    var currKaustId = this.getView().byId("kaustID").getText();
                    var initKaustId = this.getView().getModel("helpModel").getData().KaustID;
                    if (currKaustId == initKaustId) {
                        canContinue = false;
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(oResourcebundle.getText("CHOOSE_DIFF_REQUESTOR"), {
                            icon: sap.m.MessageBox.Icon.WARNING,
                            title: oResourcebundle.getText("WARNING"),
                            actions: [sap.m.MessageBox.Action.OK],
                            //		                  	        styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                    } else {
                        canContinue = true;
                    }

                }

                return canContinue;

            },
            handleSubmit: function (evt) {
                var token = null;
                var typeOfIncidentSelect = this.getView().byId("idTypeOfIncidentSelect");
                var ipOfAffectedInput = this.getView().byId("idIPOfAffectedSystemInput");
                var additionalInformationArea = this.getView().byId("idAdditionalInformationArea");
                var suspectedSourceArea = this.getView().byId("idSuspectedSourceArea");
                var dataModel = null;
                var inputs = {};
                inputs = [ipOfAffectedInput];

                var validOnBehalf = this.validateOnBehalf();

                if (!validOnBehalf) {
                    return;
                }


                jQuery.each(inputs, function (i, input) {
                    if (!input.getValue()) {
                        input.setValueState("Error");
                    }
                    else {
                        input.setValueState("None");
                    }
                });
                var canContinue = true;
                jQuery.each(inputs, function (i, input) {
                    if ("Error" === input.getValueState()) {
                        canContinue = false;
                        return false;
                    }
                });
                if (canContinue) {

                    this.submitRequest(this.getView());

                } else {
                    var oResourcebundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.alert(oResourcebundle.getText("COMPLETE_INPUT"), {
                        title: oResourcebundle.getText("ERROR"),
                        icon: sap.m.MessageBox.Icon.ERROR
                    });
                }


            },
            prepareJsonData: function () {

                var obj = {};
                var oUserModel = this.getView().getModel("oUserModel");
                var typeOfIncidentSelect = this.getView().byId("idTypeOfIncidentSelect");
                var ipOfAffectedInput = this.getView().byId("idIPOfAffectedSystemInput");
                var additionalInformationArea = this.getView().byId("idAdditionalInformationArea");
                var suspectedSourceArea = this.getView().byId("idSuspectedSourceArea");
                var location = this.getView().byId("loc").getSelectedButton().getText();
                var onBehalfButton = this.getView().byId("onBehalf");
                var oUserSecData = oUserModel.getData().oUserData;
                // var oUserSecData = {
                //     FirstName: "UMAR",
                //     LastName: "Mid",
                //     MiddleName: "Mehboob",
                //     EMailAddress: "umar@yahoo.com",
                //     MobileNo: "9955454666",
                //     OfficeNo: "7567576",
                //     DepartmentName: "IT",
                //     PositionShortText: "End User",
                //     UserID: "EMP",
                //     KaustID: "100039"
                // }
                // //   oUserModel.setData(oUserSecData);
                // oUserModel.setProperty("/oUserData", oUserSecData);
                // this.getView().setModel(oUserModel, "oUserModel");


                //handle onbehalf
                var sOnbehalf;
                if (onBehalfButton.getSelected()) {
                    sOnbehalf = "X";
                    // obj["Onbehalf"] = "X";
                    // obj["UserId"] = this.getView().getModel("helpModel").getProperty("/userId");
                } else {
                    // obj["Onbehalf"] = "";
                    sOnbehalf = "";
                }
                var oSecurityForm =
                {
                    request_id: "",
                    first_name: oUserSecData.FirstName,
                    middle_name: oUserSecData.MiddleName,
                    last_name: oUserSecData.LastName,
                    email: oUserSecData.EMailAddress,
                    mobile_no: oUserSecData.MobileNo,
                    office_no: oUserSecData.OfficeNo,
                    department_name: oUserSecData.DepartmentName,
                    position_text: oUserSecData.PositionShortText,
                    comments: additionalInformationArea.getValue(),
                    location: location,
                    incident_type: typeOfIncidentSelect.getSelectedKey(),
                    suspected_source: suspectedSourceArea.getValue(),
                    ip_address: ipOfAffectedInput.getValue()
                };

                return oSecurityForm;

            },
            //SUBMISSION OF REQUEST
            submitRequest: function (view) {
                var busyDialog = new sap.m.BusyDialog();
                busyDialog.open();
                var oUserModel = new sap.ui.model.json.JSONModel();
                // var oUserSecData = {
                //     FirstName: "UMAR",
                //     LastName: "Mid",
                //     MiddleName: "Mehboob",
                //     EMailAddress: "umar@yahoo.com",
                //     MobileNo: "9955454666",
                //     OfficeNo: "7567576",
                //     DepartmentName: "IT",
                //     PositionShortText: "End User",
                //     UserID: "EMP",
                //     KaustID: "100039"
                // };
                oUserModel.setData(oUserSecData);
                // oUserModel.setProperty("/oUserData", oUserSecData);
                // this.getView().setModel(oUserModel, "oUserModel");
                // var token = this.getGateWayToken();

                var that = this;

                var oTestModel = this.getOwnerComponent().getModel("oTestModel");
                // var data = oTestModel.getData();
                //CREATING AN ENTRY ON SECURITYINCIDENTREQUEST WITH PAYLOAD DATA
                var oResourceModel = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oDataModel = this.getOwnerComponent().getModel("oDataModel");
                var oUserModel = this.getView().getModel("oUserModel");
                var typeOfIncidentSelect = this.getView().byId("idTypeOfIncidentSelect");
                var ipOfAffectedInput = this.getView().byId("idIPOfAffectedSystemInput");
                var additionalInformationArea = this.getView().byId("idAdditionalInformationArea");
                var suspectedSourceArea = this.getView().byId("idSuspectedSourceArea");
                var location = this.getView().byId("loc").getSelectedButton().getText();
                var onBehalfButton = this.getView().byId("onBehalf");
                var oUserSecData = oUserModel.getData().oUserData;

                //handle onbehalf
                var sOnbehalf, sUserId;
                if (onBehalfButton.getSelected()) {
                    sOnbehalf = "X";
                    sUserId = this.getView().getModel("helpModel").getData().UserID;
                } else {
                    sOnbehalf = "";
                    sUserId = oUserSecData.UserID
                }
                var data = this.prepareJsonData();
                var oLog =
                {
                    sequence_number: 1,
                    status: 1,
                    userid: sUserId
                };
                var oHeader = {
                    userid: sUserId,
                    service_code: "0010",
                    sub_service_code: "0019",
                    status: 1,
                    process_id: "",
                    kaust_id: oUserSecData.KaustID,
                    stage: "",
                    first_name: oUserSecData.FirstName,
                    middle_name: oUserSecData.MiddleName,
                    last_name: oUserSecData.LastName,
                    email: oUserSecData.EMailAddress,
                    on_behalf: sOnbehalf,
                    log: [oLog]
                };
                var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                var sRequestURL = "/ReqHeader";

                oDataModel.create(sRequestURL, oHeader, {
                    success: function (oResponse, textStatus, jqXHR) {
                        that.requestId = oResponse.request_id;
                        var reqId = oResponse.request_id;
                        data.request_id = reqId;
                        that.createRequest(data, oHeader, that, busyDialog, view, oDataModel);
                        // var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                        // busyDialog.destroy();
                        // that.resetFormContent(view);


                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        busyDialog.destroy();
                        if (textStatus === "timeout") {
                            var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            sap.m.MessageBox.alert(oResourcebundle.getText("CONNECTION_RETRIEVE"), {
                                title: oResourcebundle.getText("ERROR"),
                                icon: sap.m.MessageBox.Icon.ERROR
                            });
                        } else {
                            var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            jQuery.sap.log.fatal(oResourcebundle.getText("PROBLEM_OCCURRED") + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);

                        };
                    },
                    complete: function () {
                    }
                });
            },
            //function to create Table entry
            createRequest: function (data, oHeader, that, busyDialog, view, oDataModel) {
                var oResourceModel = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                var sURL = "/SecurityIncidentRequest";
                oDataModel.create(sURL, data, {
                    success: function (data, oResponse) {

                        var sWFResponse = that.initiateRequestApprovalProcess(that, oHeader, data);
                        if (sWFResponse) {
                            busyDialog.destroy();
                            var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            that.resetFormContent(view);
                            jQuery.sap.require("sap.m.MessageBox");
                            sap.m.MessageBox.show(oResourcebundle.getText("THANKS_REQ") +
                                oResponse.data.request_id + oResourcebundle.getText("FUTURE_REF"), {
                                icon: sap.m.MessageBox.Icon.SUCCESS,
                                title: oResourcebundle.getText("SUCCESS"),
                                actions: [sap.m.MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    window.history.go(-1);
                                }
                            }
                            );

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
                        if (textStatus === "timeout") {
                            var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            sap.m.MessageBox.alert(oResourcebundle.getText("CONNECTION_RETRIEVE"), {
                                title: oResourcebundle.getText("ERROR"),
                                icon: sap.m.MessageBox.Icon.ERROR
                            });
                        } else {
                            var oResourcebundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
                            jQuery.sap.log.fatal(oResourcebundle.getText("PROBLEM_OCCURRED") + textStatus, jqXHR.responseText + "," + jqXHR.status + "," + jqXHR.statusText);

                        };
                    },
                    complete: function () {
                    }
                })

            },
            _getWorkflowRuntimeBaseURL: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                return appModulePath + "/CAPM_Common/commonlib/js";
            },

            initiateRequestApprovalProcess: function (that, oHeader, data) {
                var baseURL = that._getWorkflowRuntimeBaseURL();

                var oWflow = sap.ui.getCore().loadLibrary("reuselibrary", baseURL);
                var wfResponse = oWflow.triggerWF(oHeader.on_behalf, data.request_id, oHeader.sub_service_code, "X", that);

                if (wfResponse.status !== null && wfResponse.id !== null) {
                    return true;
                }
                else {

                    $.ajax({
                        url: that._getBaseURL(that) + "/CAPM/v2/commonservice/DeleteTable()?request_id='" + that.requestId + "'&header=true",
                        // url: "v2/commonservice/DeleteTable()?request_id='" + that.requestId + "'&header=true",
                        method: "GET",
                        success: function (s, i, a) {
                            console.log("success");
                        },
                        error: function () {
                            console.log("error");
                        }
                    })


                    return false;
                }
            },
            _getBaseURL: function (that) {
                var e = that.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                return jQuery.sap.getModulePath(e)
            },

            getUrl: function (sUrl) {
                if (sUrl == "") {
                    return sUrl;
                }
                if (window.location.hostname == "localhost") {
                    return "proxy" + sUrl;
                }
                else {
                    return sUrl;
                }

            },
            resetForm: function (evt) {
                view = this.getView();
                this.resetFormContent(view);

            },
            getSelectedRadioButton: function (radioButtonIds, view) {
                jQuery.each(radioButtonIds, function (i, radioButtonId) {
                    var radioButton = view.byId(radioButtonId);
                    if (radioButton.getSelected()) {
                        return radioButton.getText();
                    }
                });
            },

            resetFormContent: function (view) {
                var select = view.byId("idTypeOfIncidentSelect");
                select.setSelectedKey("Malicious Code/ Virus/ Worm/ Trojan");
                var affectedSustemInput = view.byId("idIPOfAffectedSystemInput");
                affectedSustemInput.setValue("");
                var additionalInformationArea = view.byId("idAdditionalInformationArea");
                additionalInformationArea.setValue("");
                var suspectedSourceArea = view.byId("idSuspectedSourceArea");
                suspectedSourceArea.setValue("");
                view.byId("loc").setSelectedIndex(0);
            },

            goBack: function () {

                window.history.go(-1);
            },
            onAfterRendering: function () {
                var oi18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleUrl: "/sap/fiori/zui5security/i18n/i18n.properties"
                });
                sap.ui.getCore().setModel(oi18nModel, "i18n");
                var oResourcebundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                //	$('#'+this.getView().byId("txtSupport").sId).html("For assistance, please  log a ticket via:<br /> <a href='http://servicedesk.kaust.edu.sa'>the self-service  portal</a> <br /> or contact IT Service Desk on <br /> (+966) (12) 808-0900, option 1  <br /> or email <a href='mailto:ithelpdesk@kaust.edu.sa' target='_top'>ithelpdesk@kaust.edu.sa</a>");
                //	$('#'+this.getView().byId("txtTraining").sId).html("Click <a href='https://sbf.kaust.edu.sa/IT%20Service%20Catalog%20Training/Information%20Security%20Training%20Videos/How%20to%20raise%20a%20security%20incident%20report.mp4'>here</a>&nbsp; for&nbsp; training video");
                $('#' + this.getView().byId("txtServiceDecs1").sId).html(oResourcebundle.getText("SECURITY_DESC1") + '<br/>&nbsp;&nbsp;&nbsp;' + oResourcebundle.getText("SECURITY_DESC2") + "<ul><li>" + oResourcebundle.getText("COMP_INTRUSION") + "</li><li>" + oResourcebundle.getText("UNAUTHORIZED_ACCESS") + "</li><li>" + oResourcebundle.getText("UNAUTHORIZED_CHANGES") + "</li></ul>");
                $('#' + this.getView().byId("txtServiceDecs2").sId).html("<ul/><li>" + oResourcebundle.getText("LOSS_THEFT") + '</li><li>' + oResourcebundle.getText("DENIAL_SERVICE") + "</li><li>" + oResourcebundle.getText("INTERFERENCE_IT") + "</li><li>" + oResourcebundle.getText("COMPROMISED_USER") + "</li></ul>" + oResourcebundle.getText("SERVICE_INVESTIGATION"));

            }

        });
    });

