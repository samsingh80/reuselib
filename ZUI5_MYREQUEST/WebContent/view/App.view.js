sap.ui.jsview("kaust.ui.kits.myRequest.view.App", {

	getControllerName: function () {
		return "kaust.ui.kits.myRequest.view.App";
	},
	
	createContent: function (oController) {		
		// to avoid scroll bars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		// create app
		this.app = new sap.m.SplitApp();

		// load the master page
		var master = sap.ui.xmlview("Master", "kaust.ui.kits.myRequest.view.Master");
		master.getController().nav = this.getController();
		this.app.addPage(master, true);
		
		// load the detail page
		var detail = sap.ui.xmlview("Detail", "kaust.ui.kits.myRequest.view.Detail");
		detail.getController().nav = this.getController();
		this.app.addPage(detail, false);
		
		// load the empty page
		var empty = sap.ui.xmlview("Empty", "kaust.ui.kits.myRequest.view.Empty");
		this.app.addPage(empty, false);
		
		return this.app;
	}
});