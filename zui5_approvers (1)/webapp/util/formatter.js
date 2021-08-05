jQuery.sap.declare("kaust.ui.kits.approvers.util.formatter");
kaust.ui.kits.approvers.util.formatter = {
  getTimeFormat: function (oValue) {
    var sValue = "";
    if (oValue) {
      var aVal = oValue.split(":");
      aVal.pop();
      sValue = aVal.join(":");
      return sValue;
    } else {
      return sValue;
    }
  },
  date2: function (value) {
    if (value) {
      var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: "dd-MM-yyyy"
      });
      return oDateFormat.format(new Date(value));
    } else {
      return value;
    }
  },
  fnDateFormatter: function (sVal) {
    var sDate = "";
    if (sVal) {
      sDate = sVal.split("(")[1].split(")")[0];
      var iDate = new Date(parseInt(sDate));
      var yyyy = iDate.getFullYear();
      var mm = iDate.getMonth() + 1;
      var dd = iDate.getDate();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }

      sDate = mm + "/" + dd + "/" + yyyy;
      return sDate;
    } else {
      return sDate;
    }
  },

  getDisplayFormat: function (value) {
    if (value) {
      value = value.replace(/#/g, '\n');
      return value;
    } else {
      return value;
    }
  },

  commentDate: function (value) {
    if (value) {
      var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: "dd-MMMM-yyyy"
      });
      var oDateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({
        pattern: "hh:mm a"
      });
      return oDateFormat1.format(new Date(value)) + " " + oDateFormat2.format(new Date(new Date(value).getTime() + 10800000));
    } else {
      return value;
    }
  }
}