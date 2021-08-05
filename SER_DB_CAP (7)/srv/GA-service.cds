using {Common.db as Common} from '../db/Common-model';
using {GA.db as GA} from '../db/GA-model';

service Gaservice {

    //Header
    entity ReqHeader                    as projection on Common.ReqHeader;

    //Requestlog
    entity Requestlog                   as
        select from Common.LogHistory as log
        left outer join Common.StatusDesc as status
            on log.status = status.status
        {
            key request_id,
            key sequence_number,
            key timestamp,
                log.status,
                userid,
                desc as statusdesc
        };

    //CommentSet
    entity CommentSet                   as
        select from Common.CommentsLog {
            *
        }
        order by
            timestamp desc;

    //MyPreferences
    entity MyPreferences                as
        select from GA.Mypreferences {
            *
        };

    //MyPreferencesCollection
    entity MyPreferencesCollection      as
        select from GA.Mypreferences {
            *,
            null as no_serv_code : String(1)
        };

    //ForeignVisaSet
    entity ForeignVisaSet               as
        select from GA.Fvisa {
            *
        };

    //PassportpickupSet
    entity PassportpickupSet            as
        select from GA.PassportPick {
            *
        };

    //CartransferSet
    entity CartransferSet               as
        select from GA.CarOwnership {
            *
        };

    //GASC_HeaderSet
    entity GASC_HeaderSet               as
        select from GA.GAHeader {
            *
        };

    //BirthCertificationSet
    entity BirthCertificationSet        as
        select from GA.BirthCertificate {
            *
        };

    //InformationCorrection
    entity InformationCorrection        as
        select from GA.InfoCorrection {
            *
        };

    // SponsorshiptransferSet
    entity SponsorshiptransferSet       as
        select from GA.SponsorTransfer {
            *
        };

    // SponsorshiptransferspouseSet
    entity SponsorshiptransferspouseSet as
        select from GA.SponsorTransferSpouse {
            *
        };

    // JobtitlechangeSet
    entity JobtitlechangeSet            as
        select from GA.JobtitleChange {
            *
        };

    //IqamaprofessionSet
    entity IqamaprofessionSet           as
        select from GA.JobTitleList {
            *
        };

    //KaustrepsSet
    entity KaustrepsSet                 as
        select from GA.KAUSTRep {
            *
        };

    //ConsulatesSet
    entity ConsulatesSet                as
        select from GA.Consulates {
            *
        };

    //DocumentAttestationSet
    entity DocumentAttestationSet       as
        select from GA.Attestation {
            *
        };

    //  CheckRequestSet
    type CheckRequestSet {
        request_id       : String(30);
        userid           : String(12);
        kaust_id         : String(15);
        sub_service_code : String(4);
        msg1             : String(220);
    };


    function CheckRequest(kaust_id : String(15), userid : String(12), sub_service_code : String(4)) returns CheckRequestSet;


};
