sap.ui.define([], function () {
    "use strict";
    jQuery.sap.declare("reuselibrary");
    /**  * @alias crossmta.provider
     */
    sap.ui.getCore().initLibrary({
        name: "reuselibrary",
        version: "1.0.0",
        dependencies: ["sap.ui.core"],
        types: [],
        interfaces: [],
        controls: [],
        elements: [],
        noLibraryCSS: true,
        triggerWF: function (onbehalf, requestId, serviceCode, specialcheck, that) {

            var oThisController = that;
            var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            appModulePath = appModulePath + "/bpmworkflowruntime/v1";
            var response = {
                status: null,
                id: null
            };
            $.ajax({
                url: appModulePath + "/xsrf-token",
                method: "GET",
                async: false,
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (result, xhr, data) {
                    // After retrieving the xsrf token successfully
                    var workflowtoken = data.getResponseHeader("X-CSRF-Token");

                    // Values entered by the user stored in the payload and push to the server.
                    var sUrl = appModulePath + "/workflow-instances";

                    var sPayload = {
                        "definitionId": "SER_Hdr_ProcessManagement",
                        "context": {
                            "StartMainProcess": {
                                "OnBehalf": onbehalf,
                                "RequestId": requestId,
                                "ServiceCode": serviceCode,
                                "NoOfStep": "1",
                                "StepNo": "1",
                                "SpecialCheck": specialcheck
                            }
                        }
                    };
                    $.ajax({
                        url: sUrl,
                        method: "POST",
                        async: false,
                        dataType: "json",
                        crossDomain: false,
                        contentType: "application/json",
                        data: JSON.stringify(sPayload),
                        cache: true,
                        headers: { // pass the xsrf token retrieved earlier
                            "X-CSRF-Token": workflowtoken
                        },
                        success: function (data) {
                            var workflowId = data.id;
                            response.id = data.id;
                            response.status = data.status;
                        },
                        error: function (jqXHR, textStatus, errorThrown) {

                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
            return response;
        }
    });
    var ologin = reuselibrary;
    console.log("reuselibrary Loaded.");
    return ologin;
}, false);