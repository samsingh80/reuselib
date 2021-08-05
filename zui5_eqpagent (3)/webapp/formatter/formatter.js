sap.ui.define([], function () {
    "use strict";
    return {

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
            "041": '',
            "042": '',
            "043": '',
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
        statusCodeText: function (value) {
            // value = "013";
            var map = this.formatter._statusMap;
            return (value && map[value]) ? map[value] : "None";
            value
        },
        subServiceDescription: function (value) {            
            return "Transfer Equipment Services";

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
        fnNoComments: function (sComment) {
		if (sComment) {
			return true;
		} else {
			return false;
		}
	},
        /**
             * Checks if one of the collections contains items.
             * @param {object} oCollection First array or object to check
             * @return {boolean} true if one of the collections is not empty, otherwise - false.
             */
        hasItems: function (oCollection) {
            var bCollection1Filled = !!(oCollection && Object.keys(oCollection).length);

            return bCollection1Filled;
        }
    };
});