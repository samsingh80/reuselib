using {KITS.db as KITS} from '../db/KITS-model';
using {Common.db as Common} from '../db/Common-model';

service Kitservice
// @(requires : 'authenticated-user')
{

    //Header
    entity ReqHeader                 as projection on Common.ReqHeader;
    //Log
    entity Log                       as projection on Common.LogHistory;
    //Log
    entity Status                    as projection on Common.StatusDesc;
    entity solmanreq                 as projection on KITS.DCWPDetail;

    //Access Request Entity
    entity AccessRequest             as
        select from KITS.KITSHeader {

            *
        };

    //Gemail Entity
    entity Gemail                    as
        select from KITS.DistEmail {
            *
        };

    //SecurityIncidentRequest Entity
    entity SecurityIncidentRequest   as
        select from KITS.SecIncident {
            *
        };

    //PortActivationRequest Entity
    entity PortActivationRequest     as
        select from KITS.PortActivation {
            *
        };

    //Email Entity
    entity Email                     as
        select from KITS.GenericEmail {
            *
        };

    //Email Entity
    entity AdminRightsReq            as
        select from KITS.AdminRights {
            *
        };

    //VPNRequest
    entity VPNRequest                as
        select from KITS.vpnextdetails {
            *
        };

    //Transferequipment
    entity Transferequipments        as
        select from KITS.TransferEqu {
            *
        };

    //Vulnerabilityscan
    entity Vulnerabilityscan         as
        select from KITS.Vscan {
            *
        };

    //TERRequest
    entity TERRequest                as
        select from KITS.TERDetails {
            *
        };

    //AllRequests
    entity AllRequests               as
        select from Common.HeaderLog {
            *
        };

    //Infra_DetailSet
    entity Infra_DetailSet           as projection on KITS.TEREquipments;

    //Vsm
    entity Vsm                       as
        select from KITS.AVBooking {
            *
        };

    //Replenish
    entity Replenish                 as
        select from KITS.Replenish {
            *
        };

    //Loan Equipment
    entity Loanequip                 as
        select from KITS.LoanEqu {
            *
        };

    //KFS OrderItem
    entity OrderItem                 as
        select from KITS.KFSOrderHeader {
            *
        };

    //ItBldgSet
    entity ItBldgSet                 as
        select from KITS.DCWPBuildings {
            *
        };

    //VPNReqType
    entity VPNReqType                as projection on KITS.VPNReqType;

    /**
     * \*_******Function******_
     */

    //Function to Cancel the Conference room booking
    function AVCancelRequest(request_id : String(90), option : String(1), status : Integer, stage : String(50), list : String) returns String;


    /**
     * \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*Reports OData
     * \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
     */

    //PortReportSet
    entity PortReportSet             as
        select from KITS.PortActivation as port
        left outer join Common.ReqHeader as head
            on port.request_id = head.request_id
        left outer join Common.PortReqTypeDesc
            on port.requesttype = request_type
        {
            key port.request_id,
                port.first_name as applicant_name,
                port.middle_name,
                port.last_name,
                kaust_id,
                createdAt,
                department_name,
                sub_service_code,
                port_tag_number,
                service_type,
                l_building,
                l_level,
                l_room,
                ip_address,
                crmsrno,
                reqtypedesc
        };

    //AdminReportSet
    entity AdminReportSet            as
        select from KITS.AdminRights as admin
        left outer join Common.ReqHeader as head
            on admin.request_id = head.request_id
        left outer join Common.CommentsLog as log
            on admin.request_id = log.request_id
        {
            key admin.request_id,
                admin.first_name as applicant_name,
                admin.middle_name,
                admin.last_name,
                custodian_usrid,
                justification,
                tagnumber,
                operatingsys,
                expirydate,
                linux_ip,
                createdAt,
                log.status
        };

    //TerReportSet
    entity TerReportSet              as
        select from KITS.TERDetails as TER
        left outer join Common.ReqHeader as head
            on TER.request_id = head.request_id
        left outer join Common.LogHistory as hist
            on TER.request_id = hist.request_id
        left outer join KITS.TERSOW as sow
            on TER.request_id = sow.request_id
        left outer join KITS.TERPOW as pow
            on TER.request_id = pow.request_id
        left outer join KITS.TERMembers as members
            on TER.request_id = members.request_id
        {
            key TER.request_id,
                TER.first_name as applicant_name,
                TER.middle_name,
                TER.last_name,
                itncteamapprover,
                l_building,
                l_room,
                powerinterrupt,
                workpermit,
                TER.startdate  as startdateandtime,
                TER.starttime,
                createdAt
        };

    //ReportsCollection
    entity ReportsCollection         as
        select from KITS.KFSOrderItem as item
        inner join Common.ReqHeader as head
            on item.request_id = head.request_id
        inner join KITS.KFSOrderHeader as header
            on item.request_id = header.request_id
        {
            key item.request_id,
                item.linno,
                item.codno,
                item.dishs,
                dshqy,
                waers,
                dispc,
                menu_type,
                menue_price,
                imgurl,
                requester_id,
                delivery_location,
                header.delivery_date as delivery_timestamp,
                header.delivery_time,
                no_days,
                header.status,
                costcenter,
                service_provider_code,
                initiator,
                service_provider,
                item.mycarts,
                item.actualprice,
                billingdate,
                fcomments,
                dishcategory,
                wbselement,
                contestedbill,
                userid,
                service_code,
                sub_service_code,
                kaust_id,
                stage,
                head.last_name,
                head.first_name      as requester,
                head.middle_name,
                email,
                on_behalf,
                is_plated,
                on_behalf_ld,
                event_name,
                single_price,
                change_timestamp,
                request_date,
                c_comment,
                subheading
        };

    //ReportsrestrictCollection
    entity ReportsrestrictCollection as
        select from KITS.KFSOrderItem as item
        inner join Common.ReqHeader as head
            on item.request_id = head.request_id
        inner join KITS.KFSOrderHeader as header
            on item.request_id = header.request_id
        {
            key item.request_id,
                item.linno,
                item.codno,
                item.dishs,
                dshqy,
                waers,
                dispc,
                menu_type,
                menue_price,
                imgurl,
                requester_id,
                delivery_location,
                header.delivery_date as delivery_timestamp,
                header.delivery_time,
                no_days,
                header.status,
                costcenter,
                service_provider_code,
                initiator,
                service_provider,
                header.mycarts,
                header.actualprice,
                billingdate,
                fcomments,
                dishcategory,
                wbselement,
                contestedbill,
                userid,
                service_code,
                sub_service_code,
                kaust_id,
                stage,
                head.last_name,
                head.first_name      as requester,
                head.middle_name,
                email,
                on_behalf,
                is_plated,
                on_behalf_ld,
                event_name,
                single_price,
                change_timestamp,
                request_date,
                c_comment
        };


    //to be removed created to see data for testing
    //AVTimeSlots
    entity AVTimeSlots               as projection on KITS.AVTimeSlots;
    //AVBookingLock
    entity AVBookingLock             as projection on KITS.AVBookingLock;

}
