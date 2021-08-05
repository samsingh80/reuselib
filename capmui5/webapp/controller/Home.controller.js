sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("ns.capmui5.controller.Home", {
			onInit: function () {
                this.getData();

            },            
    _getBaseURL: function() {
      var e = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
      return jQuery.sap.getModulePath(e)
    },

    getData: function() {
     
      $.ajax({
        url: this._getBaseURL() + "/CAPM/v2/catalog/BookPrice",
        method: "GET",        
        success: function(s, i, a) {
          console.log("Success");
         
        },
        error: function(){
            console.log("Error");
        }
      })
    }
  })
		
	});
