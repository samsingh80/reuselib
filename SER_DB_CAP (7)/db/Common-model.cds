namespace Common.db;

using {KITS.db as KITS} from '../db/KITS-model';
using {GA.db as GA} from '../db/GA-model';
using {solman as solmanService} from '../srv/external/solman.csn';
using {
    managed,
    User
} from '@sap/cds/common';

entity ReqHeader {
    key request_id            : String(90);
        userid                : String(12);
        sub_service_code      : String(4);
        service_code          : String(4);
        status                : Integer;
        process_id            : String(30);
        kaust_id              : String(15);
        stage                 : String(50);
        last_name             : String(40);
        first_name            : String(40);
        middle_name           : String(40);
        email                 : String(241);
        expeditor             : String(12);
        on_behalf             : String(1);
        role                  : String(30);
        requestor_kaustid     : String(15);
        onbehalfuserid        : String(15);
        request_type          : String(20);
        activity_type         : String(20);
        flow                  : String(20);
        previous_step_process : String(20);
        createdBy             : User @cds.on.insert : $user;
        DCWPDetail            : Composition of many KITS.DCWPDetail
                                    on DCWPDetail.request_id = request_id;
        DCWPManpower          : Composition of many KITS.DCWPManpower
                                    on DCWPManpower.request_id = request_id;
        log             : Composition of many LogHistory
                              on log.request_id = request_id;   
        GAHeader :  Composition of one GA.GAHeader
                              on GAHeader.request_id = request_id;                                              
};

entity LogHistory {
    key request_id      : String(90);
    key sequence_number : Integer;
    key timestamp       : Timestamp @cds.on.insert : $now;
        status          : Integer;
        userid          : String(12);
};


//Status and Description
entity StatusDesc {
    key status : Integer;
        desc   : String;
};


view HeaderLog as
    select from ReqHeader as head
    inner join LogHistory as log
        on head.request_id = log.request_id
    {
        key head.request_id,
            head.userid,
            sub_service_code,
            service_code,
            head.status,
            kaust_id,
            stage,
            last_name,
            middle_name,
            first_name,
            email,
            on_behalf,
            requestor_kaustid,
            expeditor,
            timestamp,
            sequence_number
    }
    where
        log.status = 1;

//Comments Log
entity CommentsLog {
    key request_id : String(90);
    key timestamp  : Timestamp @cds.on.insert : $now;
        status     : Integer;
        t_userid   : String(12);
        stage      : String(50);
        comments   : String;
        t_name     : String;
        t_kaust_id : String(15);
        org_unit   : String(8);
        org_name   : String(25);
        t_role     : String(30);
}


//Service Table entries
entity GASCService {
    key service_code     : String(4);
    key sub_service_code : String(4);
    key model_name       : String(30);
    key table_name       : String(90);
        updation_type    : String(1);
}

//Port Request type
entity PortReqTypeDesc {
    key requesttype : Integer;
        reqtypedesc : String;
};


//NeoConfig Table it controls dynamic content
entity NeoConfig {
    key applictaion : String(30);
    key type        : String(30);
    key id          : String(30);
        name        : String;
        icon        : String(100);
        URL         : String;
        count       : Integer;
        order       : Integer;
        student     : String(1);
        employee    : String(1);
        ptsa        : String(1);
        contractor  : String(1);
        external    : String(1);
        consultant  : String(1);
};



// Details Sub Services in GASC
entity SubService {
    key service_code     : String(4);
    key sub_service_code : String(4);
        sub_service_desc : String(155);
};