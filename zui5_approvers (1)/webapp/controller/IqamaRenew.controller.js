sap.ui.define([
    "sap/ui/core/mvc/Controller",
    
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

sap.ui.controller("com.kaust.zui5approvers.controller.IqamaRenew", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zui5_approvers.BirthCertificate
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		
		var that = this;
		var oModel = sap.ui.getCore().byId("app").getModel();
		var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
		var requestId = helpModel.getProperty("/requestId");
		this.getView().byId("IqamaRen_requestid").setText(requestId);
		var subserviceCode = oModel.getData().d.results[0].subServiceCode;
		var kaustId = oModel.getData().d.results[0].KaustId;
		var data = [];
		
		  if (subserviceCode == "0101") {
			data = oModel.getData().d.results[0].Headertoiqama.results;
		}
		if(data!=null){
			
				var IqamaRenJson =[];
				IqamaRenJson = oModel.getData().d.results[0].Headertoiqama;
				var IqamaRenHead = oModel.getData().d.results[0];
					var IqamaRenItemData = new sap.ui.model.json.JSONModel();
					IqamaRenItemData.setData(IqamaRenJson);
					that.getView().setModel(IqamaRenItemData, "IqamaRenItemJson");
					sap.ui.getCore().setModel(IqamaRenItemData, "IqamaRenItemJson");
					
			var oUserModel = new sap.ui.model.json.JSONModel();
				if (IqamaRenJson.results.length > 0) {

				if (IqamaRenJson.results[0].RequestorTypeFlag === "S") {
					this.getView().byId("txt_IqamaRenReq").setText("Self");
				} else if (IqamaRenJson.results[0].RequestorTypeFlag === "D") {
						this.getView().byId("txt_IqamaRenReq").setText("Dependents");
				} else {
						this.getView().byId("txt_IqamaRenReq").setText("Both");
				}
				
				if (IqamaRenHead.Duration === "001") 
					this.getView().byId("txt_IqamaDuration").setText("One Year");
				else if (IqamaRenHead.Duration === "002") 
					this.getView().byId("txt_IqamaDuration").setText("Two Years");


			}
			oUserModel.setProperty("/oUserDep", data);
			//this.getView().byId("idTable").setModel(oUserModel,'oUserModel');
		//	this.getView().byId("idRequesterForm").setModel(oUserModel,'oUserModel');
			var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/");
			var oDetailsModel = new sap.ui.model.json.JSONModel();
			oGASCModel.read("UserDetail(KaustID='"+kaustId+"',UserId='')", null, null, false, function(oData, response) {
				oDetailsModel.setData(oData);
				that.getView().setModel(oDetailsModel,'Details');
			});
			this.getView().setModel(oGASCModel, "oGASCModel");
			var hederData = oModel.getData().d.results[0];
			oUserModel.setProperty("/oUserData", hederData);
			
			/*var afilters = [];
			var afilter = new sap.ui.model.Filter("KaustId", sap.ui.model.FilterOperator.EQ, "");
			afilters.push(afilter);
			var tableId = this.getView().byId("idTable");
			tableId.getBinding("items").filter(new sap.ui.model.Filter({
				filters: afilters,
				and: true
			}), "Application");*/

			// Populate Comments Details - Begin
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
		      // Populate Comments details - End
		}
	},
	
	
		formatDisplayDate: function (sVal) {
		if (!sVal) return;
		var sParsedDate = new Date(parseInt(sVal.split("(")[1].split(")")[0]));
			jQuery.sap.require("sap.ui.core.format.DateFormat");
		var dateFormat = sap.ui.core.format.DateFormat.getInstance({
			pattern: "dd.MM.yyyy",
		});
		return dateFormat.format(sParsedDate);
	},
	
 changeComment: function (evt)
  {
    var that = this;
    var action = evt.oSource.mProperties.text;
    var mngrComment = this.getView().byId("commentMngr");

    mngrComment.setValueState("None");
    that.getView().byId("IqamaRen_action").setEnabled(true);

    if(this.getView().byId("IqamaRen_select").getSelectedIndex() == 1 || this.getView().byId("IqamaRen_select").getSelectedIndex() == 2)
    {
      if(mngrComment.getValue().trim() == "")
      {
        mngrComment.setValueState("Error");
        that.getView().byId("IqamaRen_action").setEnabled(false);
      }
      else
      {
        that.getView().byId("IqamaRen_action").setEnabled(true);
      }
    }
  },

  onIqamaRenSelect: function (evt)
  {
    var that = this;
    var action = evt.oSource.mProperties.text;
    var mngrComment = this.getView().byId("commentMngr");

    mngrComment.setValueState("None");
    that.getView().byId("IqamaRen_action").setEnabled(false);
    mngrComment.setEnabled(false);

    if(action == "Approve")
    {
      that.getView().byId("IqamaRen_action").setEnabled(true);
      mngrComment.setEnabled(true);
    }
    else if(action == "Reject" || action == "Modify")
    {
      mngrComment.setEnabled(true);
      if(mngrComment.getValue().trim() == "")
      {
        mngrComment.setValueState("Error");
      }
      else
      {
        that.getView().byId("IqamaRen_action").setEnabled(true);
      }
    }
  },

  onIqamaRenAction: function (evt)
  {
    var oModel = sap.ui.getCore().byId("app").getModel();
    var action = this.getView().byId("IqamaRen_select").getSelectedIndex();
    var helpModel = sap.ui.getCore().byId("app").getModel("helpModel");
    var requestId = helpModel.getProperty("/requestId");
    var taskId = helpModel.getProperty("/taskId");
    var that = this;
    var mngrComment = this.getView().byId("commentMngr").getValue().trim();
    var data = "";

    var oGASCModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHRTRC0001MC_GASC_II_SRV_01");
    oGASCModel.read("/GASC_HeaderSet?$filter=RequestId  eq  '" + requestId + "'", null, null, false, function (rdata, response) {
      data = rdata.results[0];
      delete data["Headertovisa"];
      delete data["HeadertoInfo"];
      delete data["Headertoid"];
      delete data["Headertochild"];
      delete data["__metadata"];
    });

    if (action == "-1") {
      sap.m.MessageBox.show(
        "Please select an action to submit", {
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
          "Please add a reason for rejection", {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
            actions: [sap.m.MessageBox.Action.OK],
          }
        );
        return;
      } else {
        this.getView().byId("commentMngr").setValueState("None");
        data.Comments = mngrComment;
        data.Status = "011";
        oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
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
          "Please add a reason for modification", {
            icon: sap.m.MessageBox.Icon.ERROR,
            title: "Error",
            actions: [sap.m.MessageBox.Action.OK],
          }
        );
        return;
      } else {
        this.getView().byId("commentMngr").setValueState("None");
        data.Comments = mngrComment;
        data.Status = "099";
        oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
          success: function (data1, response) {
            that.completeTheGASCTask(taskId, action);
          },
          error: function (oError) {}
        });
      }
    } else {
      data.Comments = mngrComment;
      data.Status = "012";
      oGASCModel.update("/GASC_HeaderSet(RequestId='" + requestId + "')", data, {
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
    var submitButton = that.getView().byId("IqamaRen_action");
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
        submitButton.setVisible(false);
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
  }
});
    });