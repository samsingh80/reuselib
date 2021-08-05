namespace GA.db;

using {Common.db as Common} from '../db/Common-model';
using {managed} from '@sap/cds/common';


//GASC Request header specific table
entity GAHeader {
    key request_id           : String(30);
        kaust_id             : String(15);
        expiry_date          : Date;
        comments             : String;
        amount               : Decimal;
        currency             : String(3);
        iqama_duration       : Integer;
        costcenter           : String(10);
        wbs                  : String(24);
        cendda               : Date;
        new_expiry_date      : Date;
        fincomments          : String;
        gacomments           : String;
        category_type        : String(10);
        hijri_exp_date       : String(10);
        fast_track           : String(1);
        tracking_id          : String(40);
        type                 : String(8);
        duration             : String(3);
        purpose              : String(8);
        dmanagerid           : String(12);
        fine                 : Decimal(23);
        stud_visitor         : String(1);
        degree_type          : String(4);
        dependant_only       : String(1);
        reqcomment           : String;
        department_request   : String(1);
        rescheduled          : String(1);
        ga_url               : String;
        isdepwithoutkaustid  : String(1);
        ga_file_name         : String(255);
        service              : Integer;
        service_type         : Integer;
        pickup_type          : Integer;
        apply_for            : Integer;
        id_number            : String(10);
        location             : Integer;
        date_of_birth        : Date;
        rep_date             : Date;
        name                 : String(25);
        visitors             : Integer;
        visa_number          : String(15);
        ksadegree            : String(1);
        attesteddegree       : String(1);
        translateddegree     : String(1);
        mofadegree           : String(1);
        kids                 : String(1);
        process_type         : String(1);
        moi_request_no       : String(30);
        createdAt            : Timestamp @cds.on.insert : $now;
         header             : Association to Common.ReqHeader
                                 on header.request_id = request_id;
        log                  : Association to many Common.LogHistory
                                   on log.request_id = request_id;
        BirthCertificate     : Composition of many BirthCertificate
                                   on BirthCertificate.request_id = request_id;
        InfoCorrection       : Composition of many InfoCorrection
                                   on InfoCorrection.request_id = request_id;
        ZakatLetter          : Composition of many ZakatLetter
                                   on ZakatLetter.request_id = request_id;
        Iqama                : Composition of many Iqama
                                   on Iqama.request_id = request_id;
        VisitVisa            : Composition of many VisitVisa
                                   on VisitVisa.request_id = request_id;
        SponsorTransferChild : Composition of many SponsorTransferChild
                                   on SponsorTransferChild.request_id = request_id;
        DHSponsorTransfer    : Composition of many DHSponsorTransfer
                                   on DHSponsorTransfer.request_id = request_id;
        SaudiID              : Composition of many SaudiID
                                   on SaudiID.request_id = request_id;
        DrivingLicense       : Composition of many DrivingLicense
                                   on DrivingLicense.request_id = request_id;
        MOEAttest            : Composition of many MOEAttest
                                   on MOEAttest.request_id = request_id;
        JobtitleChange       : Composition of many JobtitleChange
                                   on JobtitleChange.request_id = request_id;
};

//Foreign Visa Request
entity Fvisa {
    key request_id         : String(30);
        collection_mtd     : String(1);
        delivery_mtd       : String(1);
        country_slt        : String(3);
        attendence         : String(1);
        dependents_kaustid : String;
        createdAt          : Timestamp @cds.on.insert : $now;
        GAHeader           : Association to one GAHeader
                                 on GAHeader.request_id = request_id;
        header             : Association to one Common.ReqHeader
                                 on header.request_id = request_id;
        log                : Association to many Common.LogHistory
                                 on log.request_id = request_id;
};


//My Preferences
entity Mypreferences {
    key kaust_id         : String(15);
    key sub_service_code : String(4);
        userid           : String(12);
        first_name       : String(40);
        middle_name      : String(40);
        last_name        : String(40);
        email            : String(241);
        mobile_no        : String(30);
        office_no        : String(30);
        level_b          : String(60);
        building_name    : String(120);
        building_no      : String(40);
        deliv_flag       : String(1);
};


//Passport Pick up Service
entity PassportPick {
    key request_id         : String(30);
        collection_mtd     : String(1);
        delivery_mtd       : String(1);
        country_visa       : String(3);
        attendence         : String(1);
        vfs_reference      : String(50);
        consulate_name     : String(40);
        aramex_number      : String(40);
        dependents_kaustid : String;
        createdAt          : Timestamp @cds.on.insert : $now;
        GAHeader           : Association to one GAHeader
                                 on GAHeader.request_id = request_id;
        header             : Association to one Common.ReqHeader
                                 on header.request_id = request_id;
        log                : Association to many Common.LogHistory
                                 on log.request_id = request_id;
}


//Car Ownership transfer
entity CarOwnership {
    key request_id      : String(30);
        brand_code      : String(20);
        model_code      : String(20);
        plate_no        : String(10);
        collection_mtd  : String(1);
        delivery_mtd    : String(1);
        color_code      : String;
        s_kaust_id      : String(15);
        s_name          : String(80);
        s_email         : String(241);
        s_mobile        : String(30);
        b_kaust_id      : String(15);
        b_name          : String(80);
        b_email         : String(241);
        b_userid        : String(15);
        b_mobile        : String(30);
        is_seven_seater : String(1);
        vehicle_sticker : String(1);
        car_price       : Decimal(23);
        car_year        : String(4);
        bcomments       : String;
        dnflag          : String(1);
        createdAt       : Timestamp @cds.on.insert : $now;
        GAHeader        : Association to one GAHeader
                              on GAHeader.request_id = request_id;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
}

//Birth Certificate
entity BirthCertificate {
    key request_id      : String(30);
    key sequence_number : Integer;
        first_name      : String(40);
        nationality     : String(40);
        birthdate       : Date;
        iqama_no        : String(20);
        passport        : String(20);
        relationship    : String(40);
        requested_for   : String;
        justification   : String;
        file_name       : String(255);
        url             : String;
        passport_lost   : String(1);
        middle_name     : String(40);
        age             : Integer;
        process         : String(10);
        kaust_id        : String(15);
        gender          : String(10);
        saudi_id_no     : String(10);
        nation_id       : String(3);
        isdepnew        : String(1);
        last_name       : String(40);
        collection_mtd  : String(1);
        delivery_mtd    : String(1);
        a_first_name    : String(40);
        a_middle_name   : String(40);
        a_last_name     : String(40);
        birth_place     : String(40);
        birth_country   : String(3);
        in_campus       : String(1);
        sponsor_name    : String(40);
        createdAt       : Timestamp @cds.on.insert : $now;
};

//Information Correction
entity InfoCorrection {
    key kaustid          : String(15);
    key request_id       : String(30);
        gender           : String(10);
        saudi_id_no      : String(10);
        iqama_no         : String(20);
        passport         : String(20);
        relationship     : String(40);
        request_comment  : String;
        requested_for    : String;
        wrong_info       : String;
        other            : String;
        document_type    : Integer;
        last_name        : String(40);
        first_name       : String(40);
        middle_name      : String(40);
        passport_lost    : String(1);
        age              : Integer;
        file_name        : String(255);
        url              : String;
        collection_mtd   : String(1);
        delivery_mtd     : String(1);
        ck_arabic_name   : String(1);
        ck_english_name  : String(1);
        ck_dob           : String(1);
        ck_nationality   : String(1);
        ck_religion      : String(1);
        ck_babyname      : String(1);
        ck_pob           : String(1);
        ck_maritalstatus : String(1);
        select_iqama     : String(1);
        select_drvlic    : String(1);
        select_bc        : String(1);
        arabic_name      : String(80);
        english_name     : String(80);
        dob              : Date;
        nationality      : String(3);
        religion         : String(2);
        babyname         : String(80);
        pob              : String(80);
        maritalstatus    : String(80);
        createdAt        : Timestamp @cds.on.insert : $now;
};

//ZakatLetter
entity ZakatLetter {
    key request_id     : String(30);
    key kaust_id       : String(15);
        gender         : String(10);
        saudi_id_no    : String(10);
        passport       : String(20);
        relationship   : String(40);
        nationality    : String(40);
        requested_for  : String;
        file_name      : String(255);
        url            : String;
        passport_lost  : String(1);
        last_name      : String(40);
        first_name     : String(40);
        middle_name    : String(40);
        age            : Integer;
        tax_year1      : String(4);
        tax_year_to    : String(4);
        collection_mtd : String(1);
        delivery_mtd   : String(1);
        iqama_no       : String(20);
        createdAt      : Timestamp @cds.on.insert : $now;
};


//Iqama
entity Iqama {
    key request_id             : String(30);
    key kaust_id               : String(15);
        iqama_no               : String(20);
        first_name             : String(40);
        middle_name            : String(40);
        last_name              : String(40);
        saudi_id_no            : String(10);
        iqama_edate            : Date;
        iqma_renew             : String(5);
        nationality            : String(40);
        passport               : String(20);
        gender                 : String(10);
        relationship           : String(40);
        age                    : Integer;
        indvamount             : Decimal(23);
        hijri_exp_date         : String(10);
        file_name              : String(255);
        url                    : String;
        ar_first_name          : String(40);
        ar_last_name           : String(40);
        ar_mid_name            : String(40);
        iqama_job_title        : String(50);
        border_no              : String(15);
        requestor_kaustid      : String(15);
        new_expiry_date        : Date;
        passport_lost          : String(1);
        new_passport           : String(20);
        pp_expiry_date         : Date;
        place_of_issue         : String(40);
        country_of_issue       : String(3);
        date_of_issue          : Date;
        visa_expired           : String(1);
        dmanagerid             : String(12);
        delivery_mtd           : String(1);
        collection_mtd         : String(1);
        medical_test_flag      : String(1);
        religion               : String(30);
        date_of_birth          : Date;
        place_of_birth         : String(30);
        requestor_type_flag    : String(1);
        inside_kingdom_flag    : String(1);
        request_type_flag      : String(1);
        ga_center_report_flag  : String(1);
        iqama_lost_place_flag  : String(1);
        visa_number            : String(30);
        visa_expiry_date       : Date;
        date_of_entrance       : Date;
        sponsorship_check_flag : String(1);
        visitor_check_flag     : String(1);
        cost_center            : String(30);
        createdAt              : Timestamp @cds.on.insert : $now;
};

//Sponsorship Change Staff/Student
entity SponsorTransfer {
    key request_id        : String(30);
        job_title         : String;
        cand_first_name   : String(40);
        cand_last_name    : String(40);
        cand_middle_name  : String(40);
        can_iqama_no      : String(20);
        sponsor_name      : String(40);
        sponsor_number    : String(40);
        new_job_title     : String;
        job_change        : String(1);
        collection_mtd    : String(1);
        delivery_mtd      : String(1);
        ar_last_name      : String(40);
        ar_first_name     : String(40);
        ar_middle_name    : String(40);
        dob               : Date;
        religion          : String(40);
        religion_ar       : String(40);
        nationality_ar    : String(15);
        nationality       : String(15);
        new_sponsor_no    : String(40);
        new_spnsr_name    : String(80);
        new_spnsr_name_ar : String(80);
        sponsor_name_ar   : String(80);
        createdAt         : Timestamp @cds.on.insert : $now;
        GAHeader          : Association to one GAHeader
                                on GAHeader.request_id = request_id;
        header            : Association to one Common.ReqHeader
                                on header.request_id = request_id;
        log               : Association to many Common.LogHistory
                                on log.request_id = request_id;
};


//Sponsorship Transfer Spouse
entity SponsorTransferSpouse {
    key request_id      : String(30);
        mar_certificate : String(1);
        cert_attested   : String(1);
        cert_translated : String(1);
        cert_mofa       : String(1);
        job_title       : String;
        first_name      : String(40);
        last_name       : String(40);
        middle_name     : String(40);
        iqama_no        : String(20);
        wbs             : String(24);
        costcenter      : String(10);
        kaust_id        : String(15);
        sponsor_type    : String(1);
        ar_first_name   : String(40);
        ar_last_name    : String(40);
        ar_middle_name  : String(40);
        sponsor_name    : String(25);
        sponsor_number  : String(15);
        gender          : String(10);
        nationality     : String(15);
        collection_mtd  : String(1);
        delivery_mtd    : String(1);
        transfercount   : Integer;
        createdAt       : Timestamp @cds.on.insert : $now;
        GAHeader        : Association to one GAHeader
                              on GAHeader.request_id = request_id;
        header          : Association to one Common.ReqHeader
                              on header.request_id = request_id;
        log             : Association to many Common.LogHistory
                              on log.request_id = request_id;
};

//Sponsorship Transfer Child
entity SponsorTransferChild {
    key request_id          : String(30);
    key sequence_number     : Integer;
        mar_certificate     : String(1);
        cert_attested       : String(1);
        cert_translated     : String(1);
        birth_certificate   : String(1);
        cert_mofa           : String(1);
        job_title           : String;
        first_name          : String(40);
        last_name           : String(40);
        middle_name         : String(40);
        iqama_no            : String(20);
        wbs                 : String(24);
        costcenter          : String(10);
        kaust_id            : String(15);
        sponsor_type        : String(1);
        ar_first_name       : String(40);
        ar_last_name        : String(40);
        ar_middle_name      : String(40);
        sponsor_name        : String(25);
        sponsor_number      : String(15);
        gender              : String(10);
        nationality         : String(15);
        collection_mtd      : String(1);
        delivery_mtd        : String(1);
        transfercount       : Integer;
        spon_first_name     : String(40);
        spon_last_name      : String(40);
        spon_middle_name    : String(40);
        spon_nationality    : String(15);
        spon_kaust_id       : String(15);
        spon_iqama_no       : String(20);
        spon_ar_first_name  : String(40);
        spon_ar_last_name   : String(40);
        spon_ar_middle_name : String(40);
        dob                 : Date;
        religion            : String(40);
        religion_ar         : String(40);
        nationality_ar      : String(50);
        createdAt           : Timestamp @cds.on.insert : $now;
};

//Domestic helper sposnshorship request
entity DHSponsorTransfer {
    key request_id        : String(30);
    key iqama_no          : String(20);
        kaust_id          : String(15);
        first_name        : String(40);
        middle_name       : String(40);
        last_name         : String(40);
        saudi_id_no       : String(10);
        gender            : String(10);
        passport          : String(20);
        email             : String(241);
        nationality       : String(40);
        file_name         : String(255);
        url               : String;
        nation_id         : String(3);
        old_last_name     : String(40);
        old_first_name    : String(40);
        old_middle_name   : String(40);
        old_sponsor_id    : String(15);
        relationship      : String(40);
        isdepnew          : String(1);
        old_nationality   : String(40);
        old_gender        : String(10);
        old_saudi_id_no   : String(10);
        old_iqama_no      : String(20);
        collection_mtd    : String(1);
        delivery_mtd      : String(1);
        a_first_name      : String(40);
        a_middle_name     : String(40);
        a_last_name       : String(40);
        old_a_first_name  : String(40);
        old_a_middle_name : String(40);
        old_a_last_name   : String(40);
        date_of_birth     : Date;
        religion          : Integer;
        job_title         : String(70);
        company_number    : String(20);
        a_job_title       : String(70);
        religion_ar       : String(40);
        nationality_ar    : String(50);
        createdAt         : Timestamp @cds.on.insert : $now;
};


//Visit Visa and Residency Visa Request
entity VisitVisa {
    key request_id        : String(30);
    key sequence_number   : Integer;
        gender            : String(10);
        passport          : String(20);
        relationship      : String(40);
        nationality       : String(3);
        last_name         : String(40);
        first_name        : String(40);
        middle_name       : String(40);
        age               : Integer;
        date_of_birth     : Date;
        religion          : Integer;
        request_status    : Integer;
        place_of_birth    : String(40);
        pass_issue_date   : Date;
        pass_expiry_date  : Date;
        place_of_issue    : String(40);
        arrival_date      : Date;
        country_of_origin : String(40);
        mofadegree        : String(1);
        ksamarriage       : String(1);
        attestmarriage    : String(1);
        translatmarriage  : String(1);
        mofamarriage      : String(1);
        ksabirth          : String(1);
        attestbirth       : String(1);
        translatebirth    : String(1);
        mofabirth         : String(1);
        collection_mtd    : String(1);
        delivery_mtd      : String(1);
        createdAt         : Timestamp @cds.on.insert : $now;
};


//Job Title Change
entity JobtitleChange {
    key request_id      : String(30);
    key kaust_id        : String(15);
        deg_certificate : String(1);
        cert_attested   : String(1);
        cert_translated : String(1);
        cert_mofa       : String(1);
        job_title       : String;
        iqama_no        : String(20);
        nationality     : String(40);
        gender          : String(10);
        collection_mtd  : String(1);
        delivery_mtd    : String(1);
        createdAt       : Timestamp @cds.on.insert : $now;
};


//GA Job Title Info
entity JobTitleList {
    key mhn_code_all    : String(10);
        mhn_name        : String(128);
        mhn_name_latini : String(128);
};

//Table Maintanence for KAUST Representatives
entity KAUSTRep {
    key rep_date      : Date;
    key location      : Integer;
        id_number     : String(10);
        name          : String(25);
        date_of_birth : Date;
};

//Saudi Passport/National ID Service Details
entity SaudiID {
    key request_id        : String(30);
    key kaust_id          : String(15);
        iqama_no          : String(20);
        first_name        : String(40);
        middle_name       : String(40);
        last_name         : String(40);
        saudi_id_no       : String(10);
        iqama_edate       : Date;
        iqma_renew        : String(5);
        nationality       : String(40);
        passport          : String(20);
        gender            : String(10);
        relationship      : String(40);
        age               : Integer;
        indvamount        : Decimal(23);
        hijri_exp_date    : String(10);
        file_name         : String(255);
        url               : String;
        ar_first_name     : String(40);
        ar_last_name      : String(40);
        ar_mid_name       : String(40);
        iqama_job_title   : String(50);
        border_no         : String(15);
        requestor_kaustid : String(15);
        new_expiry_date   : Date;
        passport_lost     : String(1);
        new_passport      : String(20);
        pp_expiry_date    : Date;
        place_of_issue    : String(40);
        country_of_issue  : String(3);
        date_of_issue     : Date;
        visa_expired      : String(1);
        dmanagerid        : String(12);
        delivery_mtd      : String(1);
        collection_mtd    : String(1);
        date_of_birth     : Date;
        createdAt         : Timestamp @cds.on.insert : $now;
};


//Country codes for Maintaining Consulates
entity Consulates {
    key code        : String(3);
        description : String(15);
};


//Document & Permit Service -> Document Attestation
entity Attestation {
    key request_id              : String(30);
        c_kaust_issued          : String(1);
        c_outside_ksa           : String(1);
        c_no_of_attestation     : String(2);
        m_issuesd_ksa           : String(1);
        m_attested_ksa          : String(1);
        m_foreign_consulates    : String(3);
        f_attested_mofa         : String(1);
        f_foreign_consulates    : String(3);
        f_consulate_attestation : String(1);
        collection_mtd          : String(1);
        delivery_mtd            : String(1);
        indvamount              : Decimal(23);
        ref_request_id          : String(30);
        dependents_kaustid      : String;
        createdAt               : Timestamp @cds.on.insert : $now;
        GAHeader                : Association to one GAHeader
                                      on GAHeader.request_id = request_id;
        header                  : Association to one Common.ReqHeader
                                      on header.request_id = request_id;
        log                     : Association to many Common.LogHistory
                                      on log.request_id = request_id;
};


//GASC Driving/Diving License Details
entity DrivingLicense {
    key kaust_id            : String(15);
    key request_id          : String(30);
        gender              : String(10);
        saudi_id_no         : String(10);
        iqama_no            : String(20);
        passport            : String(20);
        relationship        : String(40);
        nationality         : String(40);
        requested_for       : String;
        license_langu       : String(12);
        license_num         : String(40);
        automobile_type     : Integer;
        license_iss_country : String(3);
        license_iss_date    : Date;
        license_exp_date    : Date;
        birth_date          : Date;
        blood_type          : Integer;
        appointment_date    : Date;
        file_name           : String(255);
        url                 : String;
        passport_lost       : String(1);
        last_name           : String(40);
        first_name          : String(40);
        middle_name         : String(40);
        age                 : Integer;
        process             : String(10);
        moi_absher          : String(1);
        card_expired        : String(1);
        fees_paid           : String(1);
        delivery_mtd        : String(1);
        collection_mtd      : String(1);
        finger_letter       : String(1);
        morror_pass         : String(1);
        createdAt           : Timestamp @cds.on.insert : $now;
};


//Ministry of Education - Documents
entity MOEAttest {
    key request_id     : String(30);
    key kaust_id       : String(10);
        first_name     : String(40);
        last_name      : String(40);
        middle_name    : String(40);
        iqama_no       : String(20);
        wbs            : String(24);
        costcenter     : String(10);
        sponsor_type   : String(1);
        ar_first_name  : String(40);
        ar_last_name   : String(40);
        ar_middle_name : String(40);
        sponsor_name   : String(25);
        sponsor_number : String(15);
        gender         : String(10);
        nationality    : String(15);
        collection_mtd : String(1);
        delivery_mtd   : String(1);
        transfercount  : Integer;
        service_type   : Integer;
        degree_type    : String(4);
        degree         : String(45);
        createdAt      : Timestamp @cds.on.insert : $now;
};
