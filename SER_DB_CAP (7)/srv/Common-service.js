const cds = require('@sap/cds')
cds.env.features.fetch_csrf = true;


class Commonservice extends cds.ApplicationService {
    init() {

        // Services for the Cloud workflow - starts here
        // Read table service is used in the cloud Workflow
        this.on('ReadTable', async (req) => {
            try {
                //Get the paramfdeleeters
                let { request_id, header } = req.data;
                // Select the header details to fetch the service and subservice req no
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                if (headerSel) {
                    // If header is true  return the header details
                    if (header === "true") {
                        return headerSel;
                    } else {
                        let serviceSel = await cds.tx(req).run(SELECT.one.from('Common.db.GASCService').where({ service_code: headerSel.service_code, sub_service_code: headerSel.sub_service_code, updation_type: 'I' }))
                        if (serviceSel) {
                            let tableName = serviceSel.model_name + '.db.' + serviceSel.table_name;
                            let dataSel = await cds.tx(req).run(SELECT.one.from(tableName).where({ request_id: request_id }))
                            return dataSel;
                        }
                        else {
                            return req.reject(
                                400,
                                "No Table Name found."
                            );
                        }

                    }
                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        // Delete table service is used in the cloud Workflow
        this.on('DeleteTable', async (req) => {
            try {
                //Get the paramfdeleeters
                let { request_id, header } = req.data;
                // Select the header details to fetch the service and subservice req no
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                if (headerSel) {
                    // If header is true  return the header details
                    if (header === "true") {
                        cds.tx(req).run(DELETE.from('Common.db.ReqHeader').where({ request_id: request_id }));                        
                    }
                    let serviceSel = await cds.tx(req).run(SELECT.one.from('Common.db.GASCService').where({ service_code: headerSel.service_code, sub_service_code: headerSel.sub_service_code, updation_type: 'I' }))
                    if (serviceSel) {
                        let tableName = serviceSel.model_name + '.db.' + serviceSel.table_name;
                        cds.tx(req).run(DELETE.from(tableName).where({ request_id: request_id }));
                        if (serviceSel.model_name === 'GA') {
                            cds.tx(req).run(DELETE.from('GA.db.GAHeader').where({ request_id: request_id }));
                        }
                        var dataSel = {
                            msg: "Successfully Deleted"
                        }
                        return dataSel;
                    }
                    else {
                        return req.reject(
                            400,
                            "No Table Name found."
                        );
                    }


                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        // Update table service is used in the cloud Workflow
        this.on('UpdateTable', async (req) => {
            try {
                //Get the parameters
                let { request_id, crmsrno, equip_num } = req.data;
                var data, error;
                // Select the header details to fetch the service and subservice req no
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                if (headerSel) {
                    let serviceSel = await cds.tx(req).run(SELECT.one.from('Common.db.GASCService').where({ service_code: headerSel.service_code, sub_service_code: headerSel.sub_service_code, updation_type: 'I' }))
                    if (serviceSel) {
                        let tName = serviceSel.table_name;
                        let tableName = serviceSel.model_name + '.db.' + serviceSel.table_name;
                        // if it is a CRM no update
                        if (crmsrno && serviceSel.model_name === 'KITS' && (tName === 'TERDetails' || tName === 'AVBooking' || tName === 'PortActivation' || tName === 'AdminRights' || tName === 'vpnextdetails')) {
                            await cds.tx(req).run(UPDATE(tableName).set({ crmsrno: crmsrno }).where({ request_id: request_id }))
                        }
                        // if it is Equip number  update
                        else if (equip_num && serviceSel.model_name === 'KITS' && tName === 'TransferEquItem') {
                            await cds.tx(req).run(UPDATE(tableName).set({ equip_num: equip_num }).where({ request_id: request_id }))
                        }
                        else {
                            error = 'X';
                        }
                    }
                    else {
                        error = 'X';
                    }
                } else {
                    error = 'X';

                }
                if (error === 'X') {
                    data = {
                        type: 'E',
                        message: 'Incorrect Request number'
                    };
                } else {
                    data = {
                        type: 'S',
                        message: 'Successfully updated'
                    };
                }
                return data;

            } catch (e) {
                console.log(e);
            }

        });

        // READ_COMMENTS from Header table
        this.on('ReadComment', async (req) => {
            try {
                //Get parameters
                let comment = "";
                let data;
                let { request_id } = req.data;
                // Select the header details to fetch the service and subservice req no
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                if (headerSel) {
                    // Read Comments from GASC header(Read Rejection Comments for old GASC Services)
                    let commentSel = await cds.tx(req).run(SELECT.one.from('GA.db.GAHeader').where({ request_id: request_id }))
                    //Read comments
                    if (commentSel.comments) {
                        comment = commentSel.comments;
                    }
                    //Read GA or Fin Comments
                    else if (commentSel.gacomments) {
                        comment = commentSel.gacomments;
                    } else {
                        comment = commentSel.fincomments;
                    }
                    data = {
                        gacomments: comment
                    }
                    return data;

                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        //    Read OnBehalf USER ID from table ReqHeader and Custodian USER ID from AdminRights for Admin Rights process
        //    "if sub service code is 0054 Get UserID else it fetches onbehalf userid for all kits process
        this.on('ReadOnBehalf', async (req) => {
            try {
                //Get input parameters
                let ONBEHALF = {
                    "OnBehalfUser": "",
                    "CustodianUser": ""
                };
                let OnbehalfSel, CustodianSel;
                let { request_id, sub_service_code } = req.data;

                if (sub_service_code === "0054") {
                    OnbehalfSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                    if (OnbehalfSel) {
                        ONBEHALF.OnBehalfUser = OnbehalfSel.onbehalfuserid;
                    }
                    CustodianSel = await cds.tx(req).run(SELECT.one.from('KITS.db.AdminRights').where({ request_id: request_id }))
                    if (OnbehalfSel) ONBEHALF.CustodianUser = CustodianSel.custodian_usrid;
                }
                else {

                    OnbehalfSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                    if (OnbehalfSel) {
                        ONBEHALF.OnBehalfUser = OnbehalfSel.onbehalfuserid;
                    }
                }

                if ((ONBEHALF.OnBehalfUser != null && ONBEHALF.OnBehalfUser != "") || (ONBEHALF.CustodianUser != null && ONBEHALF.CustodianUser != ""))
                    return ONBEHALF;
                else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });



        // getKaustReq     get KAUST Req based on status 
        this.on('getKaustReq', async (req, next) => {
            //Get the parameters
            let { kaust_id, sub_service_code, status } = req.data;
            const { getKaustReq } = this.entities();
            let headerSel;
            try {
                if (kaust_id !== undefined && sub_service_code !== undefined && status === 0) {
                    // Select the header details to fetch the service and subservice req no
                    headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ sub_service_code: sub_service_code, kaust_id: kaust_id, status: {
                            '!=': 11,
                            '!=': 15
                        } }).orderBy({ ref: ['request_id'], sort: 'desc' }))
                    if (!headerSel) {
                        return req.reject(
                            400,
                            "No Data found."
                        );
                    }
                } else if (kaust_id !== undefined && sub_service_code !== undefined && status !== 0) {
                    headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ sub_service_code: sub_service_code, kaust_id: kaust_id, status: status }).orderBy({ ref: ['request_id'], sort: 'desc' }))
                }

                if (headerSel) {
                    //Fetch the service code description   
                    let subServDesc = await cds.tx(req).run(SELECT.one.from('Common.db.SubService').where({ service_code: headerSel.service_code, sub_service_code: sub_service_code }))
                    if (subServDesc) {
                        var sReqName = subServDesc.sub_service_desc;
                    } else {
                        sReqName = "";
                    }
                    var oData = {
                        request_id: headerSel.request_id,
                        status: headerSel.status,
                        kaust_id: kaust_id,
                        sub_service_code: sub_service_code,
                        service_code: headerSel.service_code,
                        request_name: sReqName
                    };
                    return oData;
                } else {
                    var oData = {
                        request_name: "No Data"
                    };
                    return oData;
                }

            } catch (e) {
                console.log(e);
            }

        });

        // Used in ReadTERNotification workflow to fetch network engineer
        this.on('ReadTERNotification', async (req) => {
            try {
                //Get parameters
                let comment = "";
                let { request_id } = req.data;

                // Select the TER Details based on request number
                let TERDetails = await cds.tx(req).run(SELECT.one.from('KITS.db.TERDetails').where({ request_id: request_id }));
                if (TERDetails) {
                    //Fetch the TER Members
                    let TERMem = await cds.tx(req).run(SELECT.from('KITS.db.TERMembers').where({ request_id: request_id }).orderBy({ ref: ['vms_control_num'] }));
                    if (TERMem.length > 0) {
                        var TERSOW = await cds.tx(req).run(SELECT.from('KITS.db.TERSOW').where({ request_id: request_id }));

                        //Loop the Ter member
                        var control_num = '',
                            e_names = '';
                        TERMem.forEach((Mem, index) => {
                            e_names = e_names + '/' + Mem.name;
                            if (control_num) {
                                control_num = control_num + ',' + Mem.vms_control_num;
                            }
                        });
                    }

                    let e_activity_time = actTime(TERDetails.starttime);

                    // let  e_ac_maint = e_cable_pulling = e_hse_insp = e_others = "False";
                    if (TERSOW.length > 0) {
                        var e_power_actv = (TERSOW.find(TSOW => TSOW.sow === 'Power Activity/ Survey')) ? 'True' : 'False';
                        var e_ac_maint = (TERSOW.find(TSOW => TSOW.sow === 'A/C Maintenance')) ? 'True' : 'False';
                        var e_ter_cleaning = (TERSOW.find(TSOW => TSOW.sow === 'TER Cleaning')) ? 'True' : 'False';
                        var e_cable_pulling = (TERSOW.find(TSOW => TSOW.sow === 'Cable Pulling and Testing')) ? 'True' : 'False';
                        var e_hse_insp = (TERSOW.find(TSOW => TSOW.sow === 'HSE Inspection')) ? 'True' : 'False';
                        var e_others = (TERSOW.find(TSOW => TSOW.sow === 'Others')) ? 'True' : 'False';
                    }

                    //Assign the data
                    let oData = {
                        e_reqname: TERDetails.first_name + " " + TERDetails.last_name,
                        e_vms_control_num: control_num,
                        e_activity_date: TERDetails.startdate.slice(8) + '/' + TERDetails.startdate.slice(5, 7) + '/' + TERDetails.startdate.slice(0, 4),
                        e_activity_time: e_activity_time,
                        e_building: TERDetails.l_building,
                        e_level: TERDetails.l_level,
                        e_room: TERDetails.l_room,
                        e_contact: TERDetails.mobile_no,
                        e_power_actv: e_power_actv,
                        e_ac_maint: e_ac_maint,
                        e_ter_cleaning: e_ter_cleaning,
                        e_cable_pulling: e_cable_pulling,
                        e_hse_insp: e_hse_insp,
                        e_others: e_others,
                        e_names: e_names

                    };
                    return oData;


                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        // Used in UpdateStatus workflow to update the Status in header and Log table
        this.on('UpdateStatus', async (req) => {
            try {
                //Get parameters
                let { request_id, status, userid, header_x, stage } = req.data;
                var data;

                if (request_id) {
                    // Select the header details to fetch the service and subservice req no
                    let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                    if (headerSel) {
                        //If header flag is given mentioned then update Reqheader table
                        if (header_x === 'X') {
                            headerSel.status = status;
                            headerSel.stage = stage;
                            await cds.tx(req).run(UPDATE('Common.db.ReqHeader').set({ status: status, stage: stage }).where({ request_id: request_id }))
                        }
                        //Update the log table before fetch the last seq no from log tab;e
                        let logSel = await cds.tx(req).run(SELECT.one.from('Common.db.LogHistory').where({ request_id: request_id }).orderBy({ ref: ['sequence_number'], sort: 'desc' }))
                        if (logSel) {
                            var seqNo = logSel.sequence_number + 1;
                        } else {
                            seqNo = 1;
                        }

                        let logUpd = {
                            request_id: request_id,
                            sequence_number: seqNo,
                            status: status,
                            userid: userid
                        };
                        //Insert log table
                        var logIns = await cds.tx(req).run(INSERT.into('Common.db.LogHistory').entries(logUpd));
                        if (logIns) {
                            data = {
                                type: 'S',
                                message: 'Successfully updated'
                            }
                        } else {
                            data = {
                                type: 'E',
                                message: 'Incorrect Request number'
                            }
                        }
                        return data;

                    } else {
                        data = {
                            type: 'E',
                            message: 'Incorrect Request number'
                        }
                        return data;
                    }
                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        // Function to read details for Notification to HR for newly added Dependents
        this.on('ReadDepHRNotification', async (req) => {
            try {
                //Get parameters
                let { request_id, sub_service_code } = req.data;
                var data = {
                    e_emp_name: '',
                    e_kaustid: '',
                    e_dep_det: [],
                    e_category: '',
                    e_flag: ''
                };

                if (request_id) {
                    // Select the header details to fetch the service and subservice req no
                    let userId = await cds.tx(req).run(SELECT.one.columns('userid').from('Common.db.ReqHeader').where({ request_id: request_id }))
                    if (userId) {
                        //Dependents Sponser
                        if (sub_service_code === '0206') {
                            let SponserSel = await cds.tx(req).run(SELECT.from('GA.db.DHSponsorTransfer').where({ request_id: request_id, isdepnew: 'X' }))
                            if (SponserSel.length > 0) {
                                SponserSel.forEach((Spon, index) => {
                                    let depDet = {
                                        firstname: Spon.first_name,
                                        lastname: Spon.last_name,
                                        kaust_id: Spon.kaust_id,
                                        relationship: Spon.relationship,
                                        sex: Spon.gender,
                                        nationality: Spon.nationality,
                                        old_sponshor_fname: Spon.old_first_name,
                                        old_sponshor_lname: Spon.old_last_name,
                                        old_sponshor_mname: Spon.old_middle_name,
                                        old_sponshor_kaustid: Spon.old_sponsor_id
                                    };
                                    data.e_dep_det.push(depDet);
                                });
                                data.e_flag = 'X';
                            }
                        }
                        //Birth Certificate
                        else if (sub_service_code === '0302') {
                            let bcSel = await cds.tx(req).run(SELECT.from('GA.db.BirthCertificate').where({ request_id: request_id, isdepnew: 'X' }))
                            if (bcSel.length > 0) {
                                bcSel.forEach((bc, index) => {
                                    let bcDet = {
                                        firstname: bc.first_name,
                                        lastname: bc.last_name,
                                        kaust_id: bc.kaust_id,
                                        sex: bc.gender,
                                        nationality: bc.nationality,
                                        birthdate: bc.birthdate,
                                        filename: '',
                                        url: ''
                                    };
                                    if(bc.file_name){
                                    if (bc.file_name.includes('HOSPITAL_CERTIFICATE')) {
                                        let aFilename = bc.file_name.split(',');
                                        let aURL = bc.url.split(',');
                                        aFilename.forEach((dFileName, fIndex) => {
                                            if (dFileName.includes('HOSPITAL_CERTIFICATE')) {
                                                bcDet.filename = dFileName;
                                                if (fIndex < aURL.length) {
                                                    bcDet.url = aURL[fIndex];
                                                    data.e_dep_det.push(bcDet);
                                                }

                                            }
                                        });


                                    }
                                }

                                });
                                data.e_flag = 'X';
                            }
                        }
                        return data;

                    } else {
                        data = {
                            type: 'E',
                            message: 'Incorrect Request number'
                        }
                        return data;
                    }
                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
                }

            } catch (e) {
                console.log(e);
            }

        });

        //Common method
        //Method to format 12 hour time format
        const actTime = (time12) => {
            const [sHours, minutes] = time12.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
            const period = +sHours < 12 ? 'AM' : 'PM';
            const hours = +sHours % 12 || 12;
            const time = hours + ':' + minutes + ' ' + period;
            return time;
        };


        // Services for the Cloud workflow - Ends here


        // Overwrite Get for OrderMaintain to fetch data based on custom data        
        this.on('READ', 'OrderMaintain', async (req, next) => {

            const solmanservice = await cds.connect.to('solman');
            const tx = solmanservice.transaction(req);
            const data = {
                "ImUrgency": "04",
                "ImStatus": "E0001",
                "ImSource": "401",
                "ImRequestor": "145989",
                "ImImpact": "08",
                "ImFlag": "T",
                "ImDescription": "Audio - From API",
                "ImCategortyCode": "1350",
                "ImAssgnTeam": "1851",
                "ImAffectedLoc": "02",
                "NavDescText": [
                    {
                        "Tdformat": "*",
                        "Tdline": "Test CAP "
                    }
                ]
            };
            let response = await tx.send({ method: 'POST', path: '/OrderMaintainSet', data });
            console.log("Thajjjj:" + response);
            return response;


        });
        // Overwrite Get for OrderMaintain to fetch data based on custom data        
        this.on('READ', 'TicketSet', async (req, next) => {
            // try {
            // const solmanservice = await cds.connect.to('Ticket');
            // const tx = solmanservice.transaction(req);
            // const response = await tx.get("/TicketSet('SD20004505')");
            // console.log(response);
            // return response;
            const solmanservice = await cds.connect.to('S4HANA');
            const tx = solmanservice.transaction(req);
            const response = await tx.get("/ZCUUTLO0003_CAL_CALENDAR_DATES_SRV/calendarDateSet?$filter=(EndDate eq '2021-06-03' and EndTime eq '020202' and Recurring eq 'X' and StartDate eq '2021-06-01' and StartTime eq '010101' and Daily eq 'X')&$format=json");
            console.log(response);
            var data = {
                ProcessTypeTxt: response[0].Starttimestamp,
                PriorityTxt: response[0].Endtimestamp
            }
            return data;
        });
        return super.init()
    }


}

module.exports = { Commonservice }