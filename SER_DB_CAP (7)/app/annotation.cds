using {Kitservice as KITS} from '../srv/KITS-service';


//PORT Report Annotation
annotate KITS.PortReportSet with @UI.HeaderInfo : {
    TypeName       : '{i18n>Cat.TypeName}',
    TypeNamePlural : '{i18n>Cat.TypeNamePlural}',
    Title          : {
        $Type : 'UI.DataField',
        Value : request_id
    }
};

annotate KITS.PortReportSet with @UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Value : request_id,
        Label : 'Request ID'
    },
    {
        $Type : 'UI.DataField',
        Value : applicant_name,
        Label : 'Requester'
    },
    {
        $Type : 'UI.DataField',
        Value : reqtypedesc,
        Label : 'Request Type'
    },
    {
        $Type : 'UI.DataField',
        Value : service_type,
        Label : 'Service Type'
    },
    {
        $Type : 'UI.DataField',
        Value : port_tag_number,
        Label : 'Port/Tag Number'
    },
    {
        $Type : 'UI.DataField',
        Value : l_building,
        Label : 'Building'
    },
    {
        $Type : 'UI.DataField',
        Value : l_level,
        Label : 'Level'
    },
    {
        $Type : 'UI.DataField',
        Value : department_name,
        Label : 'Workstation/Office Number'
    },
    {
        $Type : 'UI.DataField',
        Value : ip_address,
        Label : 'IP Address'
    },
    {
        $Type : 'UI.DataField',
        Value : createdAt,
        Label : 'Creation Date'
    },
    {
        $Type : 'UI.DataField',
        Value : crmsrno,
        Label : 'Ticket No.'
    }
];

annotate KITS.PortReportSet with @UI.SelectionFields : [createdAt];

//Admin Report Annotation

annotate KITS.AdminReportSet with @UI.HeaderInfo : {
    TypeName       : '{i18n>Cat.TypeName}',
    TypeNamePlural : '{i18n>Cat.TypeNamePlural}',
    Title          : {
        $Type : 'UI.DataField',
        Value : request_id
    }
};

annotate KITS.AdminReportSet with @UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Value : request_id,
        Label : 'Request ID'
    },
    {
        $Type : 'UI.DataField',
        Value : applicant_name,
        Label : 'Requester'
    },
    {
        $Type : 'UI.DataField',
        Value : custodian_usrid,
        Label : 'Custodian'
    },
    {
        $Type : 'UI.DataField',
        Value : justification,
        Label : 'Justification'
    },
    {
        $Type : 'UI.DataField',
        Value : tagnumber,
        Label : 'Tag Number'
    },
    {
        $Type : 'UI.DataField',
        Value : operatingsys,
        Label : 'Operating System'
    },
    {
        $Type : 'UI.DataField',
        Value : expirydate,
        Label : 'Expiry Date'
    },
    {
        $Type : 'UI.DataField',
        Value : linux_ip,
        Label : 'IP Address'
    },
    {
        $Type : 'UI.DataField',
        Value : createdAt,
        Label : 'Creation Date'
    },
    {
        $Type : 'UI.DataField',
        Value : status,
        Label : 'Status'
    }
];

annotate KITS.AdminReportSet with @UI.SelectionFields : [createdAt];

//TERReport Annotations
annotate TerReportSet with @UI.HeaderInfo : {
    TypeName       : '{i18n>Cat.TypeName}',
    TypeNamePlural : '{i18n>Cat.TypeNamePlural}',
    Title          : {
        $Type : 'UI.DataField',
        Value : request_id
    }
};

annotate TerReportSet with @UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Value : request_id,
        Label : 'Request ID'
    },
    {
        $Type : 'UI.DataField',
        Value : applicant_name,
        Label : 'Requester'
    },
    {
        $Type : 'UI.DataField',
        Value : itncteamapprover,
        Label : 'ITNC Operation Team'
    },
    {
        $Type : 'UI.DataField',
        Value : l_building,
        Label : 'Location (Building)'
    },
    {
        $Type : 'UI.DataField',
        Value : l_room,
        Label : 'Location (TER Room Number)'
    },
    {
        $Type : 'UI.DataField',
        Value : powerinterrupt,
        Label : 'Power Interruption'
    },
    {
        $Type : 'UI.DataField',
        Value : workpermit,
        Label : 'Work Permit Number'
    },
    {
        $Type : 'UI.DataField',
        Value : startdateandtime,
        Label : 'Start Date and Time'
    },
    {
        $Type : 'UI.DataField',
        Value : createdAt,
        Label : 'Creation Date'
    }
];

annotate TerReportSet with @UI.SelectionFields : [createdAt];

annotate TerReportSet with {
    createdAt @(Common : {Label : 'Creation Date'});
}


//ReportsCollection
annotate ReportsCollection with @UI.HeaderInfo : {
    TypeName       : '{i18n>Cat.TypeName}',
    TypeNamePlural : '{i18n>Cat.TypeNamePlural}',
    Title          : {
        $Type : 'UI.DataField',
        Value : request_id
    }
};

annotate ReportsCollection with @UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Value : request_id,
        Label : 'Request ID'
    },
    {
        $Type : 'UI.DataField',
        Value : requester,
        Label : 'Requester Name'
    },
    {
        $Type : 'UI.DataField',
        Value : codno,
        Label : 'Dishes Per Req'
    },
    {
        $Type : 'UI.DataField',
        Value : dshqy,
        Label : 'Dishes QTY'
    },
    {
        $Type : 'UI.DataField',
        Value : dispc,
        Label : 'Dish Price'
    },
    {
        $Type : 'UI.DataField',
        Value : actualprice,
        Label : 'Actual Price'
    },
    {
        $Type : 'UI.DataField',
        Value : menue_price,
        Label : 'Estimated Price'
    },
    {
        $Type : 'UI.DataField',
        Value : requester_id,
        Label : 'Requester KAUST ID'
    },
    {
        $Type : 'UI.DataField',
        Value : delivery_location,
        Label : 'Delivery Location'
    },
    {
        $Type : 'UI.DataField',
        Value : delivery_timestamp,
        Label : 'Delivery Date Time'
    },
    {
        $Type : 'UI.DataField',
        Value : status,
        Label : 'Order Status'
    },
    {
        $Type : 'UI.DataField',
        Value : costcenter,
        Label : 'Cost Center'
    },
    {
        $Type : 'UI.DataField',
        Value : wbselement,
        Label : 'WBS'
    },
    {
        $Type : 'UI.DataField',
        Value : dishcategory,
        Label : 'Dish Category'
    },
    {
        $Type : 'UI.DataField',
        Value : subheading,
        Label : 'Dish Sub Category'
    },
    {
        $Type : 'UI.DataField',
        Value : comments,
        Label : 'Comments'
    }
];

annotate ReportsCollection with @UI.SelectionFields : [
    request_id,
    requester_id,
    status,
    wbselement,
    costcenter,
    delivery_timestamp,
    request_date
];

annotate ReportsCollection with {
    request_id         @(Common : {Label : 'Request ID'});
    requester_id       @(Common.Label : 'Requester KAUST ID');
    status             @(Common.Label : 'Status');
    wbselement         @(Common.Label : 'WBS');
    costcenter         @(Common.Label : 'Cost Center');
    delivery_timestamp @(Common.Label : 'Delivery Date');
    request_date       @(Common.Label : 'Request Date');
}

//ReportsrestrictCollection
annotate ReportsrestrictCollection with @UI.HeaderInfo : {
    TypeName       : '{i18n>Cat.TypeName}',
    TypeNamePlural : '{i18n>Cat.TypeNamePlural}',
    Title          : {
        $Type : 'UI.DataField',
        Value : request_id
    }
};

annotate ReportsrestrictCollection with @UI.LineItem : [
    {
        $Type : 'UI.DataField',
        Value : request_id,
        Label : 'Request ID'
    },
    {
        $Type : 'UI.DataField',
        Value : requester,
        Label : 'Requester Name'
    },
    {
        $Type : 'UI.DataField',
        Value : codno,
        Label : 'Dishes Per Req'
    },
    {
        $Type : 'UI.DataField',
        Value : dshqy,
        Label : 'Dishes QTY'
    },
    {
        $Type : 'UI.DataField',
        Value : dispc,
        Label : 'Dish Price'
    },
    {
        $Type : 'UI.DataField',
        Value : actualprice,
        Label : 'Actual Price'
    },
    {
        $Type : 'UI.DataField',
        Value : menue_price,
        Label : 'Estimated Price'
    },
    {
        $Type : 'UI.DataField',
        Value : requester_id,
        Label : 'Requester KAUST ID'
    },
    {
        $Type : 'UI.DataField',
        Value : delivery_location,
        Label : 'Delivery Location'
    },
    {
        $Type : 'UI.DataField',
        Value : delivery_timestamp,
        Label : 'Delivery Date Time'
    },
    {
        $Type : 'UI.DataField',
        Value : status,
        Label : 'Order Status'
    },
    {
        $Type : 'UI.DataField',
        Value : costcenter,
        Label : 'Cost Center'
    },
    {
        $Type : 'UI.DataField',
        Value : wbselement,
        Label : 'WBS'
    },
    {
        $Type : 'UI.DataField',
        Value : dishcategory,
        Label : 'Dish Category'
    },
    {
        $Type : 'UI.DataField',
        Value : service_provider,
        Label : 'Claimed By'
    },
    {
        $Type : 'UI.DataField',
        Value : comments,
        Label : 'Comments'
    }
];

annotate ReportsrestrictCollection with @UI.SelectionFields : [
    request_id,
    requester_id,
    status,
    wbselement,
    costcenter,
    delivery_timestamp,
    request_date,
    service_provider
];

annotate ReportsrestrictCollection with {
    request_id         @(Common : {Label : 'Request ID'});
    requester_id       @(Common.Label : 'Requester KAUST ID');
    status             @(Common.Label : 'Status');
    wbselement         @(Common.Label : 'WBS');
    costcenter         @(Common.Label : 'Cost Center');
    delivery_timestamp @(Common.Label : 'Delivery Date');
    request_date       @(Common.Label : 'Request Date');
    service_provider   @(Common.Label : 'Claimed By');
}
