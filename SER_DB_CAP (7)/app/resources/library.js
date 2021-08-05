
sap.ui.define([], function () {
    "use strict"; jQuery.sap.declare("reuselibrary");
    /**     * @alias crossmta.provider */

    sap.ui.getCore().initLibrary(
        {
            name: "reuselibrary",
            version: "1.0.0",
            dependencies: ["sap.ui.core"],
            types: [],
            interfaces: [],
            controls: [],
            elements: [],
            noLibraryCSS: true,

            tiggerworkflow: function () {
                alert("tiggerworkflow library loaded successfully");
            }
        });

    var ologin = reuselibrary;
    console.log("reuselibrary Loaded."); return ologin;
}, false);