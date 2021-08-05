function initModel() {
	var sUrl = "/HANAXS/com/merckgroup/ecomm/webshop/services/odata/Service_Access.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}