jQuery.sap.require("kaust.ui.kits.myRequest.util.Formatter");
jQuery.sap.require("sap.ui.layout.form.SimpleForm");

sap.ui.controller("kaust.ui.kits.myRequest.view.Master", {

	onInit : function() {
		this.initialize();
	},
	
	onExit : function() {
		page.destroy(); 
	},
	
	handleListItemPress : function(evt) {
		var context = evt.getSource();
		this.nav.to("Detail", context);
	},
	
	handleSearch : function(evt) {
		// create model filter
		query = evt.getParameter("query");
		if (query && query.length > 0) {
			var filterKaustId = new sap.ui.model.Filter("KaustId", sap.ui.model.FilterOperator.Contains, query);
			var filterRequestId = new sap.ui.model.Filter("RequestId", sap.ui.model.FilterOperator.Contains, query);
			var filterStatus = new sap.ui.model.Filter("Status", function(oValue) {
				var result = false;
				var map = kaust.ui.kits.myRequest.util.Formatter._statusMap;
				var status = map[oValue];
				if (status) {
					result = (status.toLowerCase().indexOf(query.toLowerCase()) > -1);
				}
				return result;
			});
			
			var filterSubServiceCode = new sap.ui.model.Filter("SubServiceCode", function(oValue) {
				var result = false;
				var arr = sap.ui.getCore().byId("Master").getModel("ServiceDescriptions").oData;
				description = "";
				jQuery.each(arr, function(index, obj) {
					if (obj["SubServiceCode"] === oValue) {
						description = obj["SubServiceDesc"];
						if (description.indexOf(query) > -1) {
							result = true;
						}
					}
				});
				
				return result;
			});
			var filter = new sap.ui.model.Filter({
				filters : [ filterKaustId, filterRequestId, filterStatus, filterSubServiceCode ],
				and : false
			});
		}
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filter);
		var refreshPressed = evt.getParameter("refreshButtonPressed");
		if (refreshPressed) {
			this.initialize();
			sap.ui.getCore().byId("app").app.destroyDetailPages();
			sap.ui.getCore().byId("app").app.removeAllDetailPages();
		}
	},
	
	handleListSelect : function(evt) {
		sap.ui.getCore().byId("app").app.destroyDetailPages();
		sap.ui.getCore().byId("app").app.removeAllDetailPages();
		var context = evt.getParameter("listItem");
		this.nav.to("Detail", context);
	},
	
	initialize : function() {
		var oDataURLMyRequests = "/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/";
		var oModelMyRequests = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests));  // Darshna - this.getUrl added
		this.getView().setModel(oModelMyRequests, "MyRequests");
		this.getServiceDescriptions();
		this.getRequestList();
		this.initilizeServiceInformationModel();
	},
	
	getServiceDescriptions : function() {
		var oDataURLGasc = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
		var oModelGasc = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLGasc));  // Darshna - this.getUrl added
		oModelGasc.read("DetailSrv", null, null, false, function(data, response) {
			var oModelList = new sap.ui.model.json.JSONModel();
			oModelList.setData(data.results);
			sap.ui.getCore().byId("Master").setModel(oModelList, "ServiceDescriptions");
		}, function(response) {
			return "";
		});
	},
	
	initilizeServiceInformationModel : function() {
		var oDataURLMyRequests = "/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
		var oModelRequest = new sap.ui.model.odata.ODataModel(this.getUrl(oDataURLMyRequests));  // Darshna - this.getUrl added
		oModelRequest.read("UserDetail", null, null, false, function(data, response) {
			var oModelIREERequest = new sap.ui.model.json.JSONModel();
			oModelIREERequest.setData(data.results);
			sap.ui.getCore().byId("Master").setModel(oModelIREERequest, "RequesterInformationModel");
		}, function(response) {
			return "";
		});
	},
	
	getRequestList : function() {
		var oModelList = new sap.ui.model.json.JSONModel();
		// Darshna - Editing starts
		// Using variable sUrl to invoke getUrl method
		var sUrl = this.getUrl("/sap/opu/odata/sap/ZCUUTILC0001TS_KITS/AllRequests");
		// Darshna - Editing ends
		$.ajax({
			url : sUrl,
			async : false,
			dataType : "json",
			contentType : "application/json",
			success : function(data, response) {
				oModelList.setData(data.d.results);
			},
			error : function() {
			}
		});
		this.getView().setModel(oModelList, "listModel");
	},
	
	/** Darshna - Editing starts */
	// getUrl Method
	getUrl : function(sUrl) {
		if (sUrl == "") {
			return sUrl;
		}
		if (window.location.hostname == "localhost") {
			return "https://kstcigwdq1.kaust.edu.sa:8006" + sUrl;
		} else {
			return sUrl;
		}
	},
	/** Darshna - Editing ends */
});