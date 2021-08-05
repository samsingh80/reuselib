jQuery.sap.declare("kaust.ui.kits.myRequest.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

kaust.ui.kits.myRequest.util.Formatter = {

	_statusStateMap: {
		"In Process": "Success",
		"New": "Warning"
	},

	_statusMap: {
		"001": "Initiated",
		"002": "Pending Approval",
		"003": "Pending Payment",
		"004": "Payment Done",
		"005": "Pending Drop-off",
		"006": "In Process",
		"007": "Pending Government",
		"008": "Assigned",
		"009": "Checked Out",
		"010": "Pending Pick-up",
		"011": "Rejected",
		"012": "Approved",
		"013": "Resolved",
		"014": 'Correction',
		"015": 'Cancelled',
		"016": 'Out for Delivery',
		"017": 'Pending Customer Schedule',
		"018": 'Delivered',
		"019": 'Closed',
		"020": 'Pending return old equipment',
		"021": 'Error Handling',
		"022": 'Pending Assignment',
		"023": 'Next Availability',
		"024": 'Pending Hotel Booking',
		"025": 'Hotel Booked',
		"026": 'Next Hotel Availability',
		"027": 'Pending Ticket Scheduling',
		"028": 'Ticket Scheduled',
		"030": 'Pending Acknowledgement',
		"041": '',
		"042": '',
		"043": '',
		"046": 'Pending Medical',
		"047": '',
		"048": 'Sent for Delivery',
		"099": 'Pending Requestor',
		"051": 'Pending Requester Feedback',
		"052": 'Pending Security',
		"053": 'Pending Feedback',
		"055": 'In Process',
		"056": 'Check In K-Safe',
		"057": 'Check Out K-Safe',
		"058": 'Check In J-Safe',
		"059": 'Check Out J-Safe',
		"060": 'Government Process Complete',
		"061": 'Pending Other'
	},

	valueControlVisibility: function (value) {
		var result = false;
		if (value && value.trim() != "") {
			result = true;
		}

		return result;
	},

	commentControlVisibility: function (status, serviceCode, subServiceCode) {
		var result = false;
		if (serviceCode == "0002" && subServiceCode == "0202") {
			if (status == "099") {
				result = true;
			}
		}

		return result;
	},

	displayFullNameForFinalExit: function (value, lname, serviceCode, subServiceCode) {
		var result = value;
		if (serviceCode == "0002" && subServiceCode == "0202") {
			result = value + " " + lname;
		}
		return result;
	},

	statusCodeText: function (value) {
		var map = kaust.ui.kits.myRequest.util.Formatter._statusMap;
		return (value && map[value]) ? map[value] : "None";
	},

	statusText: function (value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	subServiceDescription: function (value) {
		var arr = sap.ui.getCore().byId("Master").getModel("ServiceDescriptions").oData;
		description = "";
		jQuery.each(arr, function (index, obj) {
			if (obj["SubServiceCode"] === value) {

				description = obj["SubServiceDesc"];
				if (description === "Copyright Infringement Notice-Reconnection Service") {
					description = "Copyright Notice Service";
				}

			}
		});
		return description;

	},

	statusState: function (value) {
		var map = kaust.ui.kits.myRequest.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	date: function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
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
	quantity: function (value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	},
	checkValue: function (value) {
		if (value) {
			return true;
		}

		return false;
	},
	checkEmptyValue: function (value) {
		if (!value) {
			return true;
		}

		return false;
	},

	commentDate: function (value) {
		if (value) {
			//			var oDate = new Date(value);
			//			return oDate.toLocaleString();
			var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
				//				pattern: "yyyy-MMMM-dd"
				pattern: "dd-MMMM-yyyy"
			});
			var oDateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "hh:mm a"
			});
			var timeval = value.match(/(\d+)/);
			timeval1 = parseInt(timeval[0]);
			return oDateFormat1.format(new Date(timeval1)) + " " + oDateFormat2.format(new Date(timeval1));
		} else {
			return value;
		}
	},
	commentDate1: function (date) {
		if (date) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd-MMMM-yyyy"
			});
			var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "hh:mm a"
			});
			return oDateFormat.format(new Date(date)) + " " + oDateFormat1.format(new Date(date));
		}
		return date;

	},
	convertDate: function (date) {
		if (date) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MMMM-dd"
			});
			return oDateFormat.format(new Date(date));
		}
		return date;
	},
	convertTime: function (time) {
		if (time) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "hh:mm a"
			});
			return oDateFormat.format(new Date(time));
		}
		return time;
	},
	convertStatusText: function (status) {
		return status;
	},
	checkPassportLost: function (passportLost) {
		if (passportLost == "true") {
			return true;
		}
		return false;
	},
	checkPassportLostVisibility: function (subServiceCode) {
		if (subServiceCode == '0401') {
			return true;
		}
		return false;
	},

	/**
	 * Darshna - Editing starts
	 * Adding formatter methods for my preference tab 
	 * */

	RadioButtonSelf: function (DelivFlag) {
		if (DelivFlag == "1") {
			return 1;
		}
		return 0;
	},

	FormatFullName: function (fname, mname, lname) {
		return fname + " " + mname + " " + lname;
	},

	// Shailesh - Birth Certificate - Start 
	formatRequestType: function (requestType) {
		if (requestType == "replacement") {
			return "Replacement";
		} else {
			return "Issue";
		}
	},

	formatDisplayDate: function (sVal) {
		if (!sVal) return;
		var sParsedDate = new Date(sVal);
		var dateFormat = sap.ui.core.format.DateFormat.getInstance({
			pattern: "MMM d, y"
		});
		return dateFormat.format(sParsedDate);
	},

	checkAvailable: function (oVal) {
		if ((oVal === null) || (oVal === ""))
			return "-";
		else
			return oVal;

	},

	formatDisplayDateSrv: function (sVal) {
		if ((sVal === null) || (sVal === "")) {
			return "-";
		} else {
			var sParsedDate = new Date(sVal);
			var dateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "MMM d, y"
			});
			return dateFormat.format(sParsedDate);
		}
	},

	formatDisplayInfoCorrectOther: function (oValue) {
		if (oValue) {
			return true;
		} else {
			return false;
		}
	},

	// Shailesh - Birth Certificate - End 

	// Darshna - Adding Wife to Family Card Formatter
	fnColVisibility: function (oValue) {
		if (oValue) {
			return true;
		} else {
			return false;
		}
	},

	fnMarriageDateFormat: function (oValue) {
		if (oValue) {
			var aDate = oValue.split("T")[0].split("-");
			return aDate[2] + "-" + aDate[1] + "-" + aDate[0];
		}
	},

	AppointmentDateFormat: function (dVal) {
		debugger;
		if (!dVal) return;
		var sParsedDate = new Date(dVal);
		var dateFormat = sap.ui.core.format.DateFormat.getInstance();
		return dateFormat.format(sParsedDate);
	},

	getTimeFormat: function (oValue) {
		var sValue = "";
		if (oValue) {
			if (oValue.length === 8) {
				var aVal = oValue.split(":");
				aVal.pop();
				sValue = aVal.join(":");
			} else {
				sValue = oValue;
			}
			return sValue;
		} else {
			return sValue;
		}
	},

	fnNoComments: function (sComment) {
		if (sComment) {
			return true;
		} else {
			return false;
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
	}
};