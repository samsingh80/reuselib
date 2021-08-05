const cds = require('@sap/cds');
const SequenceHelper = require("./lib/SequenceHelper");

class Gaservice extends cds.ApplicationService {
    init() {

        this.before('INSERT', ['ForeignVisaSet', 'PassportpickupSet', 'CartransferSet', 'InformationCorrection',
            'GASC_HeaderSet', 'SponsorshiptransferspouseSet', 'JobtitlechangeSet',
            'SponsorshiptransferSet'], async req => {
                //If Request ID is initial assign a request id
                const db = await cds.connect.to("db");
                let oData = req.data;
                if (oData.request_id === undefined || oData.request_id.length === 0) {
                    // oData.request_id = "R" + Date.now();
                    const SeqReq = new SequenceHelper({
                        sequence: "REQ_ID",
                        db: db
                    });
                    let aa = await SeqReq.getNextNumber();
                    var reqid = aa.toString();
                    oData.request_id = reqid.padStart(10, '0');
                }
            });

        // Overwrite Get for Requestlog to fetch data based on custom data        
        this.on('READ', 'Requestlog', async (req, next) => {
            let request_id = req.headers.request_id;

            const { Requestlog } = this.entities();

            if (request_id === undefined) {
                let data = await next();
                return data;
            } else {
                const dataSel = await cds.tx(req).run(SELECT.from(Requestlog).where({ request_id: request_id }))
                return dataSel;
            }

        });

        // Overwrite Get for CommentSet to fetch data based on custom data        
        this.on('READ', 'CommentSet', async (req, next) => {
            let request_id = req.headers.request_id;

            const { CommentSet } = this.entities();

            if (request_id === undefined) {
                let data = await next();
                return data;
            } else {
                const dataSel = await cds.tx(req).run(SELECT.from(CommentSet).where({ request_id: request_id }))
                return dataSel;
            }

        });

        // Overwrite Get for MyPreferencesCollection to fetch data based on custom data        
        this.on('READ', 'MyPreferencesCollection', async (req, next) => {
            var kaust_id = req.headers.kaust_id;
            var sub_service_code = req.headers.sub_service_code;
            if (kaust_id === undefined && sub_service_code === undefined) {
                var kaust_id = req.data.kaust_id;
                var sub_service_code = req.data.sub_service_code;
            }

            const { MyPreferencesCollection } = this.entities();

            if (kaust_id === undefined && sub_service_code === undefined) {
                let data = await next();
                return data;
            } else if (kaust_id !== undefined && sub_service_code === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(MyPreferencesCollection).where({ kaust_id: kaust_id }))
                return dataSel;
            } else if (kaust_id !== undefined && sub_service_code !== undefined) {
                var dataSel = await cds.tx(req).run(SELECT.one.from(MyPreferencesCollection).where({ kaust_id: kaust_id, sub_service_code: sub_service_code }))
                if (!dataSel) {
                    sub_service_code = '0000';
                    dataSel = await cds.tx(req).run(SELECT.one.from(MyPreferencesCollection).where({ kaust_id: kaust_id, sub_service_code: sub_service_code }))
                    if (!dataSel) {
                        let data = {
                            deliv_flag: '2',
                            no_serv_code: 'X',
                        }
                        return data;
                    } else {
                        dataSel.no_serv_code = 'X';
                    }
                }
                return dataSel;
            }

        });

        // Overwrite Get for CheckRequestSet to fetch data based on custom data        
        this.on('CheckRequest', async (req, next) => {
            //Get the parameters
            let { kaust_id, sub_service_code, userid } = req.data;
            const { CheckRequestSet } = this.entities();
            try {
                if (kaust_id && sub_service_code && userid) {
                    // Select the header details to fetch the service and subservice req no
                    let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ sub_service_code: sub_service_code, userid: userid, status: { '!=': 11, '!=': 13, '!=': 15 } }))
                    if (headerSel) {
                        let serviceSel = await cds.tx(req).run(SELECT.one.from('Common.db.GASCService').where({ sub_service_code: sub_service_code, updation_type: 'I' }))
                        if (serviceSel) {
                            let tableName = serviceSel.model_name + '.db.' + serviceSel.table_name;
                            let dataSel = await cds.tx(req).run(SELECT.one.from(tableName).where({ request_id: headerSel.request_id }))
                            if (dataSel.kaust_id === undefined || dataSel.kaust_id === null) {
                                kaust_id = "X";
                            } else {
                                kaust_id = dataSel.kaust_id;
                            }
                            if (dataSel) {
                                var oData = {
                                    request_id: headerSel.request_id,
                                    userid: userid,
                                    kaust_id: kaust_id,
                                    sub_service_code: sub_service_code,
                                    msg1: "Request Exist"
                                };
                                return oData;
                            }
                        }

                    }
                    let data = {
                        userid: userid,
                        kaust_id: kaust_id,
                        sub_service_code: sub_service_code,
                        msg1: "Request Not Exist"
                    };
                    return data;
                } else {
                    let data = {
                        msg1: "Request Not Exist"
                    };
                    return data;
                }
            } catch (e) {
                console.log(e);
            }

        });

        // Overwrite Get for KaustrepsSet to fetch data based on custom data        
        this.on('READ', 'KaustrepsSet', async (req, next) => {
            let location = req.headers.location;
            let from_date = req.headers.from_date;
            let to_date = req.headers.to_date;

            const { KaustrepsSet } = this.entities();

            if (location === undefined && from_date === undefined && to_date === undefined) {
                let data = await next();
                return data;
            } else if (location !== undefined && from_date !== undefined && to_date === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(KaustrepsSet).where({ location: location, rep_date: from_date }));
                return dataSel;
            } else if (location !== undefined && from_date !== undefined && to_date !== undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(KaustrepsSet).where({ location: location, and: { rep_date: { between: from_date, and: to_date } } }));
                return dataSel;
            } else if (location !== undefined && from_date === undefined && to_date === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(KaustrepsSet).where({ location: location }));
                return dataSel;
            }

        });

        /**DocumentAttestationSet After creating a request
         * if foreign consulate attestation is checked 
         * create another seprate req for foreign consoate
         **/
        this.before('INSERT', 'DocumentAttestationSet', async (req, next) => {
            //If Request ID is initial assign a request id
            let { DocumentAttestationSet, SponsorshiptransferSet } = this.entities();
            let oData = req.data;
            if (oData.request_id === undefined) {
                oData.request_id = "R" + Date.now();
            }
            else if (oData.request_id.length === 0) {
                oData.request_id = "R" + Date.now();
            }
            if (oData.m_foreign_consulates) {
                oData.ref_request_id = "RF" + Date.now();
                let fData = Object.assign({}, oData);
                fData.request_id = oData.ref_request_id;
                fData.header.sub_service_code = '1705';
                fData.header.status = 61;
                fData.log[0].status = 61;
                fData.header.request_id = fData.request_id;
                fData.GAHeader.request_id = fData.request_id;
                fData.log[0].request_id = fData.request_id;
                let rdata = await cds.tx(req).run(INSERT.into('GA.db.Attestation').entries(fData));
            }

        });

        return super.init()
    }
}

module.exports = { Gaservice }