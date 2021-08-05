namespace KITS.db;

using {Common.db as Common} from '../db/Common-model';
using {
    managed,
    User,
    Currency
} from '@sap/cds/common';

//Table for Library
entity KITSHeader {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        comments        : String;
        location        : String;
        data2enc        : String;
        data2oth        : String(1);
        datasize        : String;
        locationin      : String;
        isagree         : String(1);
        efirst_name     : String(40);
        emiddle_name    : String(40);
        elast_name      : String(40);
        eemail          : String(241);
        destsys         : String;
        vpnexpdate      : Date;
        sr_number       : String(18);
        createdAt       : Timestamp @cds.on.insert : $now;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//KITS Group Email Creation -Request Specific details Header
entity DistEmail {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        grpdisplayname  : String(90);
        grpemail        : String(241);
        owneremail      : String(90);
        coowneremail    : String(90);
        mcomments       : String;
        accountdesc     : String;
        createdAt       : Timestamp @cds.on.insert : $now;
        item            : Composition of many DistEmailMembers
                              on item.request_id = request_id;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//KITS Group Email Creation -Request Specific details Item
entity DistEmailMembers {
    key request_id   : String(90);
    key itm_sequence : Integer;
        grpmember    : String(241);
        authsender   : String(241);
};

// Security Incident Request Service Details
entity SecIncident {
    key request_id       : String(90);
        first_name       : String(40);
        middle_name      : String(40);
        last_name        : String(40);
        email            : String(241);
        mobile_no        : String(30);
        office_no        : String(30);
        rept_manager     : String(40);
        department_name  : String(40);
        position_text    : String(25);
        comments         : String;
        location         : String;
        incident_type    : String;
        suspected_source : String;
        scan_priority    : String(10);
        sr_number        : String(18);
        ip_address       : String;
        createdAt        : Timestamp @cds.on.insert : $now;
        header           : Association to one Common.ReqHeader
                               on header.request_id = request_id;
        log              : Association to many Common.LogHistory
                               on log.request_id = request_id;
};

// KITS Generic Port Activation Details
entity PortActivation {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        requesttype     : Integer;
        port_tag_number : String;
        service_type    : String;
        crmsrno         : String(20);
        l_building      : String(40);
        l_level         : String(30);
        l_room          : String(30);
        ip_address      : String(20);
        createdAt       : Timestamp @cds.on.insert : $now;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//KITS Generic Email Creation -Request Specific details Header
entity GenericEmail {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        requesttype     : String;
        remail          : String(241);
        displayname     : String;
        owneremail      : String(90);
        accountdesc     : String;
        ruserid         : String(90);
        mcomments       : String;
        createdAt       : Timestamp @cds.on.insert : $now;
        item            : Composition of many GenericEmailDelegate
                              on item.request_id = request_id;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//KITS Group Email Creation -Request Specific details Item
entity GenericEmailDelegate {
    key request_id   : String(90);
    key itm_sequence : Integer;
        delegates    : String(241);
};

//KITS Generic AdminRights Reque Details->VPN Specific detail
entity AdminRights {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        custodian       : String(1);
        justification   : String;
        tagnumber       : String(80);
        operatingsys    : String(15);
        expirydate      : Date;
        custodian_usrid : String(12);
        linux_ip        : String(20);
        crmsrno         : String(20);
        userid_ext      : String(20);
        createdAt       : Timestamp @cds.on.insert : $now;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};


//KITS Generic VPN Details ->VPN Specific detail
entity vpnextdetails {
    key request_id         : String(90);
        name               : String(100);
        email              : String(241);
        mobile_no          : String(30);
        office_no          : String(30);
        rept_manager       : String(40);
        department_name    : String(40);
        position_text      : String(25);
        requesttype        : Integer;
        kaust_id           : String(40);
        efirst_name        : String(40);
        emiddle_name       : String(40);
        elast_name         : String(40);
        eemail             : String(241);
        eipaddress         : String;
        vpnexpirydate      : Date;
        vpn_access         : String(1);
        attachment         : String;
        justification      : String;
        adid               : String(30);
        vpnrenewaldate     : Date;
        infosecmanager     : String(120);
        secmanagercomments : String;
        msgteam            : String(120);
        msgteamcomments    : String;
        suggested_userid   : String(20);
        provisioned_userid : String(20);
        idm_action         : String(1);
        idm_change_date    : Date;
        issuguseridchng    : String(1);
        crmsrno            : String(20);
        dob_pass           : Date;
        createdAt          : Timestamp @cds.on.insert : $now;
        header             : Association to one Common.ReqHeader
                                 on header.request_id = request_id;
        log                : Association to many Common.LogHistory
                                 on log.request_id = request_id;
        reqtypetext        : Association to one VPNReqType
                                 on reqtypetext.requesttype = requesttype;
};

//VPN Request type
entity VPNReqType {
    key requesttype : Integer;
        text        : String(30);
};


// KITS Transfer Equipment->Request Specific Header
entity TransferEqu {
    key request_id       : String(90);
        first_name       : String(40);
        middle_name      : String(40);
        last_name        : String(40);
        email            : String(241);
        mobile_no        : String(30);
        office_no        : String(30);
        rept_manager     : String(40);
        department_name  : String(40);
        position_text    : String(25);
        costcenter       : String(10);
        comments         : String;
        justification    : String;
        disclaimer       : String(1);
        employeenotes    : String;
        tfirst_name      : String(40);
        tlast_name       : String(40);
        temail           : String(241);
        tmobile_no       : String(30);
        toffice_no       : String(30);
        tdepartment_name : String(40);
        tposition_text   : String(25);
        tcostcenter      : String(10);
        tkaust_id        : String(15);
        equip_billed     : String(1);
        mcomments        : String;
        rec_man_notes    : String;
        rec_user_id      : String(12);
        total_equip      : Integer;
        it_support       : String(1);
        it_support_txt   : String(80);
        dmanagerid       : String(12);
        rec_managerid    : String(12);
        send_man         : String(1);
        rec_man          : String(1);
        borrower_id      : String(15);
        borrower_name    : String(80);
        createdAt        : Timestamp @cds.on.insert : $now;
        items            : Composition of many TransferEquItem
                               on items.request_id = request_id;
        header           : Association to one Common.ReqHeader
                               on header.request_id = request_id;
        log              : Association to many Common.LogHistory
                               on log.request_id = request_id;
};

// KITS Transfer Equipment->Request Specific Item Details
entity TransferEquItem {
    key request_id    : String(90);
    key itm_sequence  : Integer;
        replenisheqip : String;
        equip_billed  : String(1);
        equip_cat     : String(40);
        equip_num     : String(18);
};

//Vulnerability Scan Service Details
entity Vscan {
    key request_id       : String(90);
        first_name       : String(40);
        middle_name      : String(40);
        last_name        : String(40);
        email            : String(241);
        mobile_no        : String(30);
        office_no        : String(30);
        rept_manager     : String(40);
        department_name  : String(40);
        position_text    : String(25);
        comments         : String;
        location         : String;
        scan_type        : String;
        scan_start       : Date;
        scan_end         : Date;
        scan_time        : Time;
        operating_system : String;
        ip_address       : String;
        sr_number        : String(18);
        scan_priority    : String(10);
        createdAt        : Timestamp @cds.on.insert : $now;
        header           : Association to one Common.ReqHeader
                               on header.request_id = request_id;
        log              : Association to many Common.LogHistory
                               on log.request_id = request_id;
};

//KITS Generic TER Details ->TER Specific detail
entity TERDetails {
    key request_id        : String(90);
        first_name        : String(40);
        middle_name       : String(40);
        last_name         : String(40);
        email             : String(241);
        mobile_no         : String(30);
        office_no         : String(30);
        rept_manager      : String(40);
        department_name   : String(40);
        position_text     : String(25);
        workpermit        : String(30);
        startdate         : Date;
        starttime         : Time;
        enddate           : Date;
        endtime           : Time;
        l_building        : String(40);
        l_level           : String;
        l_room            : String;
        powerinterrupt    : String(1);
        ac_interruption   : String(1);
        isreqtaccreq      : String(1);
        isotherteamaccreq : String(1);
        itncteamapprover  : String(120);
        itncteamcomments  : String;
        vendor_presence   : String(1);
        ven_ext_activity  : String(1);
        tool_missing_ven  : String(1);
        feedback_comment  : String;
        itncagentcomment  : String;
        itncagentapprover : String(120);
        netagent_approver : String(120);
        netagent_uid      : String(12);
        netagent_kid      : String(15);
        crmsrno           : String(20);
        createdAt         : Timestamp @cds.on.insert : $now;
        members           : Composition of many TERMembers
                                on members.request_id = request_id;
        pow               : Composition of many TERPOW
                                on pow.request_id = request_id;
        sow               : Composition of many TERSOW
                                on sow.request_id = request_id;
        header            : Association to one Common.ReqHeader
                                on header.request_id = request_id;
        log               : Association to many Common.LogHistory
                                on log.request_id = request_id;
};

//  TER other member required Access details
entity TERMembers {
    key sequence_number : Integer;
    key request_id      : String(90);
        kaustid         : String(15);
        vms_control_num : String(20);
        name            : String(60);
};


//TER POWER INTERRUPTION Severity
entity TERPOW {
    key request_id       : String(90);
    key sequence_number  : Integer;
        circuittype      : String(30);
        equipmentnumbner : String;
};

//TER Scope of work
entity TERSOW {
    key sow          : String(40);
    key request_id   : String(90);
        sow_comments : String;
        power_backup : String(1);
};


//TER , Building, Level and Equipment Data table
entity TEREquipments {
    key sequence_number : Integer;
        k_level         : String(3);
        k_room          : String(30);
        k_building      : String(90);
        bpc_equip       : String(40);
        ec_equip        : String(40);
        pc_equip        : String(40);
};

//KITS New Equipment request ->Request Specific AVM details
entity AVBooking {
    key request_id         : String(90);
    key itm_sequence       : Integer;
        first_name         : String(40);
        middle_name        : String(40);
        last_name          : String(40);
        email              : String(241);
        mobile_no          : String(30);
        office_no          : String(30);
        rept_manager       : String(40);
        department_name    : String(40);
        position_text      : String(25);
        ishost             : String(1);
        eventname          : String;
        eventlocation      : String(40);
        ldate              : Date;
        starttime          : String;
        endtime            : String;
        adevent            : String(1);
        rdevent            : String(1);
        attendees          : String;
        wboard             : String(1);
        flipchart          : String(1);
        others             : String;
        avsupport          : String(1);
        laptop             : String(1);
        clicker            : String(1);
        adapter            : String(1);
        mphone             : String(1);
        speakers           : String(1);
        projector          : String(1);
        monitor            : String(1);
        videowebconf       : String(1);
        protocol           : String(20);
        ipaddress          : String;
        contact            : String;
        cemail             : String;
        webex              : String(1);
        externalmail       : String;
        confrecord         : String(1);
        lpublic            : String(1);
        lprivate           : String(1);
        title              : String(20);
        presenter          : String(20);
        department         : String(20);
        agree              : String(1);
        daily              : String(1);
        monthly            : String(1);
        weekly             : String(1);
        sunday             : String(1);
        monday             : String(1);
        tuesday            : String(1);
        wednesday          : String(1);
        thursday           : String(1);
        friday             : String(1);
        saturday           : String(1);
        rstartdate         : Date;
        renddate           : Date;
        comments           : String;
        roomno             : String;
        country            : String;
        bldglevel          : String(255);
        bldgname           : String(255);
        layout             : String(255);
        foodservices       : String(1);
        recording          : String(1);
        presentation       : String(1);
        mcomments          : String;
        crmsrno            : String(20);
        hostuserid         : String(12);
        confroom           : String(20);
        service_quality    : String(1);
        feedback_comments  : String;
        hostusername       : String(120);
        av_standby_support : String(1);
        code               : String(4);
        av_agent_amount    : String(3);
        aemail             : String;
        createdAt          : Timestamp @cds.on.insert : $now;
        header             : Association to one Common.ReqHeader
                                 on header.request_id = request_id;
        log                : Association to many Common.LogHistory
                                 on log.request_id = request_id;
        timeslots          : Association to many AVTimeSlots
                                 on timeslots.request_id = request_id;
};

// Table to lock entries for AV Services
entity AVBookingLock {
    key code      : String(4);
    key startdate : Date;
        lockby    : String(12);
};

entity AVTimeSlots {
    key request_id     : String(30);
    key starttimestamp : DateTime;
    key endtimestamp   : DateTime;
        deleted        : String(1);
        rec_request    : String(1);
        request_no     : String(30);
};


//Replenish
entity Replenish {
    key request_id      : String(90);
        first_name      : String(40);
        middle_name     : String(40);
        last_name       : String(40);
        email           : String(241);
        mobile_no       : String(30);
        office_no       : String(30);
        rept_manager    : String(40);
        department_name : String(40);
        position_text   : String(25);
        costcenter      : String(10);
        replenisheqip   : String;
        replenisheqname : String(70);
        comments        : String;
        justification   : String;
        disclaimer      : String(1);
        employeenotes   : String;
        custodianusrid  : String(12);
        neweqpno        : String(40);
        createdAt       : Timestamp @cds.on.insert : $now;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//KITS New Equipment request ->Request Specific details
entity LoanEqu {
    key request_id        : String(90);
        first_name        : String(40);
        middle_name       : String(40);
        last_name         : String(40);
        email             : String(241);
        mobile_no         : String(30);
        office_no         : String(30);
        rept_manager      : String(40);
        department_name   : String(40);
        position_text     : String(25);
        on_behalf         : String(1);
        delivery          : String;
        inci_report       : String;
        costcenter        : String(10);
        eventname         : String;
        eventlocation     : String;
        eventtype         : String;
        startdate         : Date;
        starttime         : Time;
        enddate           : Date;
        endtime           : Time;
        justification     : String;
        pasystem          : String(1);
        projector         : String(1);
        speaker           : String(1);
        screen            : String(1);
        clicker           : String(1);
        appledviconnector : String(1);
        hdmidviconnector  : String(1);
        visualizer        : String(1);
        vgaconnector      : String(1);
        reason            : String;
        imacworkstation   : String(1);
        quantity          : Integer;
        printer           : String(1);
        quantity1         : Integer;
        lmacbookair       : String(1);
        quantity2         : Integer;
        scanner           : String(1);
        quantity3         : Integer;
        applemonitor      : String(1);
        quantity4         : Integer;
        others            : String;
        quantity5         : Integer;
        lmacair           : String(1);
        quantity6         : Integer;
        disclaimer        : String(1);
        mcomments         : String;
        avteamcomments    : String;
        euteamcomments    : String;
        createdAt         : Timestamp @cds.on.insert : $now;
        header            : Association to one Common.ReqHeader
                                on header.request_id = request_id;
        log               : Association to many Common.LogHistory
                                on log.request_id = request_id;
};


//Building and Rooms for Data center work permit
entity DCWPBuildings {
    key bldgcode  : String(4);
        bldgname  : String(80);
        bldglevel : String(1);
        room_desc : String(80);
};


//KFS - Order Header
entity KFSOrderHeader {
    key request_id            : String(30);
        dshqy                 : Integer;
        waers                 : Currency;
        dispc                 : Decimal(11, 2);
        menu_type             : String(1);
        menue_price           : Decimal(11, 2);
        imgurl                : String(300);
        requester_id          : String(15);
        delivery_location     : String(100);
        delivery_date         : Date;
        delivery_time         : Time;
        no_days               : Integer;
        status                : String(10);
        costcenter            : String(10);
        service_provider_code : String(4);
        initiator             : String(15);
        mycarts               : String(1);
        actualprice           : Decimal(11, 2);
        billingdate           : Date;
        fcomments             : String(980);
        dishcategory          : String(300);
        wbselement            : String(24);
        is_plated             : String(1);
        on_behalf_ld          : String;
        event_name            : String;
        change_timestamp      : Date;
        request_date          : Date;
        c_comment             : String;
        order_by              : String(30);
        sort_by               : String(4);
        kfscomments           : String;
        contestedbill         : String(1);
        createdAt             : Timestamp @cds.on.insert : $now;
        items                 : Composition of many KFSOrderItem
                                    on items.request_id = request_id;
        header                : Association to one Common.ReqHeader
                                    on header.request_id = request_id;
        log                   : Association to many Common.LogHistory
                                    on log.request_id = request_id;
};

//KFS - Order Item
entity KFSOrderItem {
    key request_id       : String(30);
    key linno            : Integer;
        codno            : String(20);
        dishs            : String(1000);
        comments         : String(1000);
        service_provider : String(20);
        mcomments        : String(1000);
        mycarts          : String(1);
        actualprice      : Decimal(11, 2);
        single_price     : String;
        subheading       : String(300);
};


//Data center work permit
entity DCWPDetail {
    key request_id      : String(30);
    key sequence_number : Integer;
        r_first_name    : String(40);
        r_last_name     : String(40);
        mobile_no       : String(30);
        start_date      : Date;
        start_time      : Time;
        end_date        : Date;
        end_time        : Time;
        bldglevel       : String(1);
        bldgname        : String(80);
        rooms           : String(80);
        cold_wrk        : String(1);
        hot_work        : String(1);
        hse_wrk_permit  : String(20);
        dis_fire_supp   : String(1);
        prop_f_name     : String(40);
        prop_l_name     : String(40);
        prop_kaust_id   : String(15);
        prop_userid     : String(12);
        prop_mobile     : String(241);
        prop_dep        : String(80);
        email           : String(241);
        job_desc        : String(1000);
        req_company     : String(80);
        req_email       : String(241);
        req_kaust_id    : String(15);
        created_date    : Date;
        created_by      : String(12);
        deleted         : String(1);
        status_text     : String(30);
        dc_approver     : String(80);
        comments        : String(1000);
        createdAt       : Timestamp @cds.on.insert : $now;
};


//Data center work permit man power details
entity DCWPManpower {
    key request_id    : String(30);
    key itm_sequence  : Integer;
        appl_name     : String(80);
        contrct_emp   : String(80);
        job_title     : String(25);
        kaust_id      : String(15);
        dc_access_req : String(20);
        nationality   : String(50);
        id_type       : String(2);
        id_number     : String(30);
        deleted       : String(1);
        created_by    : String(12);
        created_date  : Date;
        url           : String(1024);
        docid         : String(32);
        createdAt     : Timestamp @cds.on.insert : $now;
};
