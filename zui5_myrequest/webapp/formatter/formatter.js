sap.ui.define([], function () {
    "use strict";
    return {

        _statusStateMap: {
            "In Process": "Success",
            "New": "Warning"
        },

        _statusMap: {
            "1": "Initiated",
            "2": "Pending Approval",
            "3": "Pending Payment",
            "4": "Payment Done",
            "5": "Pending Drop-off",
            "6": "In Process",
            "7": "Pending Government",
            "8": "Assigned",
            "9": "Checked Out",
            "10": "Pending Pick-up",
            "11": "Rejected",
            "12": "Approved",
            "13": "Resolved",
            "14": 'Correction',
            "15": 'Cancelled',
            "16": 'Out for Delivery',
            "17": 'Pending Customer Schedule',
            "18": 'Delivered',
            "19": 'Closed',
            "20": 'Pending return old equipment',
            "21": 'Error Handling',
            "22": 'Pending Assignment',
            "23": 'Next Availability',
            "24": 'Pending Hotel Booking',
            "25": 'Hotel Booked',
            "26": 'Next Hotel Availability',
            "27": 'Pending Ticket Scheduling',
            "28": 'Ticket Scheduled',
            "30": 'Pending Acknowledgement',
            "41": '',
            "42": '',
            "43": '',
            "46": 'Pending Medical',
            "47": '',
            "48": 'Sent for Delivery',
            "99": 'Pending Requestor',
            "51": 'Pending Requester Feedback',
            "52": 'Pending Security',
            "53": 'Pending Feedback',
            "55": 'In Process',
            "56": 'Check In K-Safe',
            "57": 'Check Out K-Safe',
            "58": 'Check In J-Safe',
            "59": 'Check Out J-Safe',
            "60": 'Government Process Complete',
            "61": 'Pending Other'
        },
        statusCodeText: function (value, that) {
            if (that) {
                var map = that.formatter._statusMap;
            }
            else {
                map = this.formatter._statusMap;
            }
            return (value && map[value]) ? map[value] : "None";
        },
        subServiceDescription: function (value, that) {
            if (that) {
                var oModel = that.getOwnerComponent().getModel("ServiceDescriptions");
            }
            else {
                oModel = this.getOwnerComponent().getModel("ServiceDescriptions");
            }
            if (oModel) {
                var arr = oModel.getData();
                var description = "";
                jQuery.each(arr, function (index, obj) {
                    if (obj["sub_service_code"] === value) {

                        description = obj["sub_service_desc"];
                        if (description === "Copyright Infringement Notice-Reconnection Service") {
                            description = "Copyright Notice Service";
                        }

                    }
                });
            }
            return description;

        },

        valueControlVisibility: function (value) {
            var result = false;
            if (value && value.trim() != "") {
                result = true;
            }

            return result;
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

        convertStatusText: function (status) {
            return status;
        },
        convertDateDefault: function (date) {
            if (date) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "dd.MM.yyyy"
                });
                return oDateFormat.format(new Date(date));
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
        convertDateTime: function (date) {
            if (date) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd hh:mm a"
                });
                return oDateFormat.format(new Date(date));
            }
            return date;
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

        }
    };
});