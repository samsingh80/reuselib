using {KITS.db as KITS} from '../db/KITS-model';
using {GA.db as GA} from '../db/GA-model';
using {Common.db as Common} from '../db/Common-model';
using {solman as solmanService} from '../srv/external/solman.csn';
using {Ticket as Ticket} from '../srv/external/Ticket.csn';

service Commonservice
// @(requires : 'authenticated-user')
{

    //Header
    entity ReqHeader                            as projection on Common.ReqHeader;
    //Service Request Table
    entity ServiceTable                         as projection on Common.GASCService;

    //Get the table entries dynamically based on Request id
    type tableReq {
        request_id : String(90);
        header     : Boolean
    };

    //SubService
    entity SubService                           as projection on Common.SubService;
    //Function to get the respective table data based on request id
    function ReadTable(request_id : String(90), header : Boolean) returns String;
    //Function to get the respective table data based on request id
    function DeleteTable(request_id : String(90), header : Boolean) returns String;
    //Function to get the commecnt from GA header table based on request id
    function ReadComment(request_id : String(90)) returns String;
    //Function to get the Onbehalf and Custodian based on request id
    function ReadOnBehalf(request_id : String(90), sub_service_code : String(4)) returns String;

    // Entity from solman service
    entity OrderMaintain                        as
        select from solmanService.OrderMaintainSet {
            *
        };

    entity TicketSet                            as
        select from Ticket.TicketSet {
            *
        };

    //PortReqTypeDesc
    entity PortReqTypeDesc                      as projection on Common.PortReqTypeDesc;
    //NeoConfig
    entity NeoConfig                            as projection on Common.NeoConfig;

    // Common type to get KAUST Req based on status
    type kaustReqType {
        request_id       : String(30);
        kaust_id         : String(15);
        status           : Integer;
        sub_service_code : String(4);
        service_code     : String(4);
        request_name     : String(70);
    };

    //get KAUST Req based on status
    function getKaustReq(kaust_id : String(15), sub_service_code : String(4), status : Integer) returns kaustReqType;

    //HR Aprroving for SLCM data without KaustId
    entity bpm_hr_appr(request_id : String(30)) as
        select from GA.GAHeader as GAHead
        inner join Common.ReqHeader as ReqHead
            on GAHead.request_id = ReqHead.request_id
        {
            key GAHead.request_id,
                GAHead.category_type       as e_type,
                sub_service_code           as e_sub_service_code,
                GAHead.isdepwithoutkaustid as e_isdepwithoutkaustid
        }
        where
            GAHead.request_id = : request_id;

    //Used in workflow to fetch network engineer
    type TERNotification {
        e_reqname         : String(80);
        e_contact         : String(90);
        e_vms_control_num : String;
        e_activity_date   : String(10);
        e_activity_time   : String;
        e_building        : String(40);
        e_level           : String;
        e_room            : String;
        e_power_actv      : String(10);
        e_ac_maint        : String(10);
        e_ter_cleaning    : String(10);
        e_cable_pulling   : String(10);
        e_hse_insp        : String(10);
        e_others          : String(10);
        e_names           : String(300);
    };

    function ReadTERNotification(request_id : String(30)) returns TERNotification;
    //Function to update the Status in header and Log table
    function UpdateStatus(request_id : String(30), status : Integer, userid : String(12), header_x : String(1), stage : String(50)) returns String;
    //Function to read details for Notification to HR for newly added Dependents
    function ReadDepHRNotification(request_id : String(30), sub_service_code : String(4)) returns String;
    //Function to update the crmno and equip number to the respective tables
    function UpdateTable(request_id : String(30), crmsrno : String(20), equip_num : String(18)) returns String;

}
