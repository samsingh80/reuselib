const cds = require('@sap/cds');
const SequenceHelper = require("./lib/SequenceHelper");
cds.env.features.fetch_csrf = true


class Kitservice extends cds.ApplicationService {
    init() {

        //Request ID creation
        this.before('INSERT', ['ReqHeader'], async req => {
            //If Request ID is initial assign a request id
            let oData = req.data;
            // if (!oData.request_id) {
            //     oData.request_id = "R" + Date.now();
            // }
            if (!oData.request_id) {
                //Fetch the service code description   
                let subServDesc = await cds.tx(req).run(SELECT.one.from('Common.db.SubService').where({
                    service_code: oData.service_code,
                    sub_service_code: oData.sub_service_code
                }))
                if (subServDesc) {
                    var sHeaderText = subServDesc.sub_service_desc;
                    if (sHeaderText.length > 40) {
                        sHeaderText = sHeaderText.substring(0, 40);
                    }
                } else {
                    sHeaderText = "KITS Request Creation";
                }

                const solmanservice = await cds.connect.to('solman');
                const tx = solmanservice.transaction(req);
                const data = {
                    "ImUrgency": "03",
                    "ImSource": "701",
                    "ImRequestor": oData.requestor_kaustid,
                    "ImImpact": "07",
                    "ImDescription": sHeaderText,
                    "ImCategortyCode": "2900",
                    "ImAffectedLoc": "03",
                    "NavDescText": [{
                        "Tdformat": "*",
                        "Tdline": sHeaderText
                    }]
                };
                let response = await tx.send({
                    method: 'POST',
                    path: '/OrderMaintainSet',
                    data
                });
                var reqId = response.ChIntNo.slice(2);
                oData.request_id = reqId.padStart(10, '0');
            }
        });


        //Request based on the number sequence 
        this.before('INSERT', ['ReqHeader', 'OrderItem'], async req => {
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

        // Overwrite Get ftor Infra_DetailSet to fetch data based on custom data        
        this.on('READ', 'Infra_DetailSet', async (req, next) => {
            let k_building = req.headers.k_building;
            let k_level = req.headers.k_level;
            let k_room = req.headers.k_room;

            const {
                Infra_DetailSet
            } = this.entities();

            if (k_building === undefined && k_level === undefined && k_room === undefined) {
                let data = await next();
                return data;
            } else if (k_building !== undefined && k_level === undefined && k_room === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(Infra_DetailSet).where({
                    k_building: k_building
                }))
                return dataSel;
            } else if (k_building !== undefined && k_level !== undefined && k_room === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(Infra_DetailSet).where({
                    k_building: k_building,
                    k_level: k_level
                }))
                return dataSel;
            } else if (k_building !== undefined && k_level !== undefined && k_room !== undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(Infra_DetailSet).where({
                    k_building: k_building,
                    k_level: k_level,
                    k_room: k_room
                }))
                return dataSel;
            }

        });

        // Overwrite Get for Vsm Data creation       
        this.on('INSERT', 'Vsm', async (req, next) => {
            try {
                var oData = req.data;
                var sError;
                var oCommon = {
                    msg1: ""
                }
                const {
                    Vsm
                } = this.entities();
                var aLockDates = [];
                let currDate = getDate(req.timestamp);
                // let userid = req.user.toString();
                // console.log("User:" + req.user + userid)
                // userid = "TST_EMPLOYEE";
                // let kaustid = "100039";

                // Fetch the user and kaust id fromthe header
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({
                    request_id: oData.request_id
                }));
                if (headerSel) {
                    var userid = headerSel.userid;
                    var kaustid = headerSel.kaust_id;
                }

                //Check the booked dates and find the date intervals
                if (oData.ldate <= oData.renddate && oData.ldate >= currDate) {

                    // Call the S4HANA  to get the days between the start date and end date                    
                    const s4hanaservice = await cds.connect.to('S4HANA');
                    const hanatx = s4hanaservice.transaction(req);
                    let sCalStartTime = oData.starttime.split(':').join('');
                    let sCalEndTime = oData.endtime.split(':').join('');;
                    let sFliterCal = "$filter=(EndDate eq '" + oData.renddate + "'and EndTime eq '" + sCalEndTime
                        + "'and Recurring eq '" + oData.rdevent + "' and StartDate eq '" + oData.rstartdate
                        + "' and StartTime eq '" + sCalStartTime + "' and Daily eq '" + oData.daily +
                        "'and Sunday eq '" + oData.sunday + "'and Monday eq '" + oData.monday +
                        "'and Tuesday eq '" + oData.tuesday + "'and Wednesday eq '" + oData.wednesday +
                        "'and Thursday eq '" + oData.thursday + "'and Friday eq '" + oData.friday +
                        "'and Saturday eq '" + oData.saturday + "'and Weekly eq '" + oData.weekly +
                        "'and Monthly eq '" + oData.monthly + "')";
                    let sCalUrl = "/ZCUUTLO0003_CAL_CALENDAR_DATES_SRV/calendarDateSet?" + sFliterCal + "&$format=json";

                    var oCalDate = await hanatx.get(sCalUrl);
                    // const oCalDate = await hanatx.get("/ZCUUTLO0003_CAL_CALENDAR_DATES_SRV/calendarDateSet?$filter=(EndDate eq '2021-06-03' and EndTime eq '020202' and Recurring eq 'X' and StartDate eq '2021-06-01' and StartTime eq '010101' and Daily eq 'X')&$format=json");


                    // var oCalDate = [{
                    //     "Startdate": "20210710",
                    //     "Enddate": "20210711",
                    //     "Starttimestamp": "20210710010101",
                    //     "Endtimestamp": "20210710020202"
                    // },
                    // {
                    //     "Startdate": "20210717",
                    //     "Enddate": "20210718",
                    //     "Starttimestamp": "20210717010101",
                    //     "Endtimestamp": "20210718020202"
                    // },
                    // {
                    //     "Startdate": "20210724",
                    //     "Enddate": "20210725",
                    //     "Starttimestamp": "20210724010101",
                    //     "Endtimestamp": "20210725020202"
                    // }
                    // ];

                    var aForDate = [];

                    //Check the buliding name is not initial
                    if (oData.bldgname) {
                        oCalDate.forEach((CalDate) => {
                            //Format Date
                            CalDate.Startdate = getFormatDate(CalDate.Startdate);
                            CalDate.Enddate = getFormatDate(CalDate.Enddate);
                            CalDate.Starttimestamp = getTimeStamp(CalDate.Starttimestamp);
                            CalDate.Endtimestamp = getTimeStamp(CalDate.Endtimestamp);
                            aForDate.push(CalDate);

                            let lockDate = {
                                code: oData.code,
                                startdate: CalDate.Startdate,
                                lockby: userid
                            }
                            cds.tx(req).run(INSERT.into('KITS.db.AVBookingLock').entries(lockDate));
                            aLockDates.push(lockDate);


                        });
                    }

                    //If the item seq is less than or equal to 1
                    if (oData.itm_sequence <= 1) {
                        let headerSel = await cds.tx(req).run(SELECT.from('Common.db.ReqHeader').columns('request_id').where({
                            sub_service_code: '0011',
                            status: {
                                '!=': 11,
                                '!=': 15
                            }
                        }))
                        if (headerSel.length > 0) {
                            var aReqId = [];
                            headerSel.forEach((head) => {
                                aReqId.push(head.request_id);
                            });
                            var avmSel;
                            // check whether the building name is not null
                            if (oData.bldgname !== null) {

                                avmSel = await cds.tx(req).run(SELECT.from`KITS.db.AVBooking`.columns`request_id`.where`(
                                                            request_id in ${aReqId}
                                                            and bldglevel = ${oData.bldglevel}
                                                            and bldgname = ${oData.bldgname}
                                                            and confroom = ${oData.confroom}
                                                            and  ( ldate >= ${currDate} or renddate >= ${currDate} )
                                                            )`);



                            } else {

                                avmSel = await cds.tx(req).run(SELECT.from`KITS.db.AVBooking`.columns`request_id`.where`(
                                                            request_id in ${aReqId}
                                                            and eventlocation = ${oData.eventlocation}
                                                            and  ( ldate >= ${currDate} or renddate >= ${currDate} )
                                                            )`);

                            }

                            //Check whether the dates are alreading booked for location    
                            if (avmSel.length > 0 && oCalDate.length > 0) {
                                aReqId = [];
                                avmSel.forEach((avm) => {
                                    aReqId.push(avm.request_id);
                                });
                                await oCalDate.reduce(async (memo, CalDate) => {
                                    await memo;
                                    var lv_deleted = '';
                                    var lv_sdate = new Date(CalDate.Starttimestamp);
                                    lv_sdate.setSeconds(lv_sdate.getSeconds() + 1); // adding a millisecond for cases when already booked end time match with this
                                    lv_sdate = getDateTime(lv_sdate);
                                    var lv_edate = new Date(CalDate.Endtimestamp);
                                    lv_edate.setSeconds(lv_edate.getSeconds() - 1); //subtracting a millisecond for cases when already booked start time match with this
                                    lv_edate = getDateTime(lv_edate);
                                    if (oCommon.msg1 === '') {
                                        let avmTimeSlot = await cds.tx(req).run(SELECT.one.from`KITS.db.AVTimeSlots`.columns`request_id`.where`(
                                                            request_id in ${aReqId}
                                                            and starttimestamp <= ${lv_sdate}
                                                            and endtimestamp >= ${lv_edate}
                                                            and deleted = ${lv_deleted}
                                                            )`);
                                        if (avmTimeSlot) {
                                            oCommon.msg1 = "Unfortunately your room is booked now, please do another booking";
                                        } else {
                                            oCommon.msg1 = "Available";
                                        }
                                    }
                                }, undefined);
                            } else {
                                oCommon.msg1 = "Available";
                            }
                        }
                    }

                } else {
                    oCommon.msg1 = "Start date should be greater the todays date";
                }

                //If message is available
                if (oCommon.msg1 === "Available" || oData.itm_sequence >= 2) {

                    //Check the difference of meeting less than 72 hrs
                    await aForDate.reduce(async (memo, fDate) => {
                        await memo;
                        var oCDate = req.timestamp;
                        var oSDate = new Date(fDate.Starttimestamp);
                        var res = Math.abs(oCDate - oSDate) / 1000;
                        var days = Math.floor(res / 86400);
                        var hours = Math.floor(res / 3600) % 24;
                        hours += (days * 24);
                        if (hours <= 72) {

                            //Generate the request id and insert entries in AVTimeSlots
                            const solmanservice = await cds.connect.to('solman');
                            const solmantx = solmanservice.transaction(req);
                            const data = {
                                "ImUrgency": "99",
                                "ImSource": "401",
                                "ImRequestor": kaustid,
                                "ImImpact": "50",
                                "ImDescription": "Audio - From API",
                                "ImCategortyCode": "1350",
                                "ImAssgnTeam": "10005",
                                "ImAffectedLoc": "02",
                                "ImStatus": "E0001",
                                "ImFlag": "S",
                                "NavDescText": [
                                    {
                                        "Tdformat": "*",
                                        "Tdline": "Audio - From API"
                                    }
                                ]
                            };
                            let sReq_no = await solmantx.send({
                                method: 'POST',
                                path: '/OrderMaintainSet',
                                data
                            });
                            // let sReq_no = "R123";
                            var oTimeSlot = {
                                request_id: oData.request_id,
                                starttimestamp: fDate.Starttimestamp,
                                endtimestamp: fDate.Endtimestamp,
                                deleted: "",
                                rec_request: "X",
                                request_no: sReq_no
                            }
                            cds.tx(req).run(INSERT.into('KITS.db.AVTimeSlots').entries(oTimeSlot));

                        }
                    });

                } else {
                    sError = "X";

                }

                // Delete the lock entries
                if (aLockDates.length > 0) {
                    aLockDates.forEach((lData) => {
                        cds.tx(req).run(DELETE.from('KITS.db.AVBookingLock').where({
                            code: lData.code,
                            startdate: lData.startdate
                        }));
                    });

                }

                if (sError === "X") {
                    return req.reject(
                        400,
                        oCommon.msg1
                    );
                } else {
                    let data = await next();
                    return data;
                }

            } catch (e) {
                return req.reject(
                    400,
                    e
                );
            }


        });

        // Overwrite Get for Vsm to fetch data based on custom data        
        this.on('READ', 'Vsm', async (req, next) => {
            let request_id = req.headers.request_id;

            const {
                Vsm
            } = this.entities();

            if (request_id === undefined) {
                let data = await next();
                return data;
            } else {
                const dataSel = await cds.tx(req).run(SELECT.one.from(Vsm).where({
                    request_id: request_id
                }));
                if (dataSel) {
                    let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }));
                    let timeslots = await cds.tx(req).run(SELECT.from('KITS.db.AVTimeSlots').where({ request_id: request_id }));
                    dataSel.header = headerSel;
                    dataSel.timeslots = timeslots;
                }
                return dataSel;
            }

        });

        // Read table service is used in the cloud Workflow
        this.on('AVCancelRequest', async (req) => {
            try {
                //Get the paramfdeleeters
                let { request_id, option, status, stage, list } = req.data;

                //Check whether it is partial or full cancellation
                if(option === 'P'){

                }else{
                    
                }
                // Select the header details to fetch the service and subservice req no
                let headerSel = await cds.tx(req).run(SELECT.one.from('Common.db.ReqHeader').where({ request_id: request_id }))
                if (headerSel) {

                } else {
                    return req.reject(
                        400,
                        "No Data found."
                    );
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
                return req.reject(
                    400,
                    e
                );
            }

        });

        // Overwrite Get for AllRequests to fetch data based on custom data        
        this.on('READ', 'AllRequests', async (req, next) => {
            let request_id = req.headers.request_id;
            let subservcode = req.headers.sub_service_code;
            let userid = req.headers.userid;

            const {
                AllRequests
            } = this.entities();

            if (request_id === undefined && subservcode === undefined && userid === undefined) {
                let data = await next();
                return data;
            } else if (request_id === undefined && subservcode !== undefined && userid === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(AllRequests).where({
                    sub_service_code: subservcode
                }))
                return dataSel;
            } else if (request_id !== undefined && subservcode !== undefined && userid === undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(AllRequests).where({
                    sub_service_code: subservcode,
                    request_id: request_id
                }))
                return dataSel;
            } else if (request_id === undefined && subservcode !== undefined && userid !== undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(AllRequests).where({
                    sub_service_code: subservcode,
                    userid: userid
                }))
                return dataSel;
            } else if (request_id !== undefined && subservcode !== undefined && userid !== undefined) {
                const dataSel = await cds.tx(req).run(SELECT.from(AllRequests).where({
                    sub_service_code: subservcode,
                    request_id: request_id,
                    userid: userid
                }))
                return dataSel;
            }

        });

        //Create for Transfer Equipment
        this.on('INSERT', 'Transferequipment', async (req) => {
            var oData = req.data;
            const {
                Transferequipment
            } = this.entities();
            //Check the equip_num field has multiple values concatenated with &&
            //If so assign to the respective fields
            if (oData.equip_num.includes("&&")) {
                var aequip_num = oData.equip_num.split("&&");
                var aequip_cat = oData.equip_cat.split("&&");
                var aequip_billed = oData.equip_billed.split("&&");
                var areplenisheqip = oData.replenisheqip.split("&&");
            }
            //If multiple equip numbers are there then creqte mltiple entries
            // if sequence number in the transfer equipment table
            if (aequip_num.length > 1) {
                await cds.tx(req).run(INSERT.into(Transferequipment).entries(oData));
            } else {
                INSERT.into(Transferequipment).entries(oData);
            }
            // Inse    
            var oHeader = oData.header;
            if (oHeader) {
                oHeader.request_id = oData.request_id;
                // await cds.tx(req).run(INSERT .into('Common.db.ReqHeader') .entries(oHeader));

            }

            return oData;
        });

        //Delete
        // this.on('DELETE', 'AccessRequest', async (req, next) => {
        //     let { request_id } = req.data;
        //     cds.tx(req).run(DELETE.from('KITS.db.KITSHeader').where({ request_id: request_id }));
        // });

        // Overwrite Get for AllRequests to fetch data based on custom data        
        this.on('DELETE', 'OrderItem', async (req, next) => {
            //Get the parameters
            let {
                request_id
            } = req.data;
            let {
                linno
            } = req.headers;

            if (request_id !== null && linno === undefined) {
                cds.tx(req).run(DELETE.from('KITS.db.KFSOrderHeader').where({
                    request_id: request_id
                }));
            }
            // Before deleting records from Header table check whether all the line Items have been deleted or Not
            //  if the last record in KFS table also is deleted then Delete the header record too
            else if (request_id !== null && linno !== null && linno !== '99999') {
                cds.tx(req).run(DELETE.from('KITS.db.KFSOrderItem').where({
                    request_id: request_id,
                    linno: linno,
                    mycarts: 'X'
                }));
                let KFSItemSel = await cds.tx(req).run(SELECT.one.from('KITS.db.KFSOrderItem').where({
                    request_id: request_id
                }));
                if (!KFSItemSel) {
                    cds.tx(req).run(DELETE.from('KITS.db.KFSOrderHeader').where({
                        request_id: request_id
                    }));
                    cds.tx(req).run(DELETE.from('Common.db.ReqHeader').where({
                        request_id: request_id
                    }));
                }
            } else if (request_id !== null && linno === '99999') {
                cds.tx(req).run(DELETE.from('KITS.db.KFSOrderItem').where({
                    request_id: request_id,
                    mycarts: 'X'
                }));
                let KFSItemSel = await cds.tx(req).run(SELECT.one.from('KITS.db.KFSOrderItem').where({
                    request_id: request_id
                }));
                if (!KFSItemSel) {
                    cds.tx(req).run(DELETE.from('KITS.db.KFSOrderHeader').where({
                        request_id: request_id
                    }));
                    cds.tx(req).run(DELETE.from('Common.db.ReqHeader').where({
                        request_id: request_id
                    }));
                }
            }
        });

        /**********************************Reports OData **************************/

        // Overwrite Get for PortReportSet to fetch data based on custom data        
        this.on('READ', 'PortReportSet', async (req, next) => {
            let aData = await next();
            if (aData) {
                aData.forEach((data, index) => {
                    if (data.middle_name) {
                        data.applicant_name = data.applicant_name + " " + data.middle_name;
                    }
                    if (data.last_name) {
                        data.applicant_name = data.applicant_name + " " + data.last_name;
                    }

                    if (data.reqtypedesc === null || data.reqtypedesc === "") {
                        data.reqtypedesc = "NA";
                    }
                    if (data.port_tag_number === null || data.port_tag_number === "") {
                        data.port_tag_number = "NA";
                    }
                    if (data.service_type === null || data.service_type === "") {
                        data.service_type = "NA";
                    }
                    if (data.applicant_name === null || data.applicant_name === "") {
                        data.applicant_name = "NA";
                    }
                    if (data.l_building === null || data.l_building === "") {
                        data.l_building = "NA";
                    }
                    if (data.l_level === null || data.l_level === "") {
                        data.l_level = "NA";
                    }
                    if (data.l_room === null || data.l_room === "") {
                        data.l_room = "NA";
                    }
                    if (data.crmsrno === null || data.crmsrno === "") {
                        data.crmsrno = "NA";
                    }
                    if (data.ip_address === null || data.ip_address === "") {
                        data.ip_address = "NA";
                    }
                    if (data.department_name === null || data.department_name === "") {
                        data.department_name = "NA";
                    }
                    aData[index] = data;
                });
            }
            return aData;
        });

        // Overwrite Get for AdminReportSet to fetch data based on custom data        
        this.on('READ', 'AdminReportSet', async (req, next) => {
            let aData = await next();
            if (aData) {
                aData.forEach((data, index) => {
                    data.applicant_name = data.applicant_name + " " + data.middle_name + " " + data.last_name;
                    if (data.request_id === null || data.request_id === "") {
                        data.request_id = "NA";
                    }
                    if (data.tagnumber === null || data.tagnumber === "") {
                        data.tagnumber = "NA";
                    }
                    if (data.createdAt === null || data.createdAt === "") {
                        data.createdAt = "NA";
                    }
                    if (data.applicant_name === null || data.applicant_name === "") {
                        data.applicant_name = "NA";
                    }
                    if (data.custodian_usrid === null || data.custodian_usrid === "") {
                        data.custodian_usrid = "NA";
                    }
                    if (data.expirydate === null || data.expirydate === "") {
                        data.expirydate = "NA";
                    }
                    if (data.status === null || data.status === "") {
                        data.status = "NA";
                    }
                    if (data.justification === null || data.justification === "") {
                        data.justification = "NA";
                    }
                    if (data.operatingsys === null || data.operatingsys === "") {
                        data.operatingsys = "NA";
                    }
                    if (data.linux_ip === null || data.linux_ip === "") {
                        data.linux_ip = "NA";
                    }
                    aData[index] = data;
                });
            }
            return aData;
        });

        // Overwrite Get for TerReportSet to fetch data based on custom data        
        this.on('READ', 'TerReportSet', async (req, next) => {
            let aData = await next();
            if (aData) {
                aData.forEach((data, index) => {
                    data.applicant_name = data.applicant_name + " " + data.middle_name + " " + data.last_name;
                    data.startdateandtime = data.startdateandtime + " " + data.starttime;
                    if (data.request_id === null || data.request_id === "") {
                        data.request_id = "NA";
                    }
                    if (data.itncteamapprover === null || data.itncteamapprover === "") {
                        data.itncteamapprover = "NA";
                    }
                    if (data.createdAt === null || data.createdAt === "") {
                        data.createdAt = "NA";
                    }
                    if (data.applicant_name === null || data.applicant_name === "") {
                        data.applicant_name = "NA";
                    }
                    if (data.l_building === null || data.l_building === "") {
                        data.l_building = "NA";
                    }
                    if (data.l_room === null || data.l_room === "") {
                        data.l_room = "NA";
                    }
                    if (data.powerinterrupt === null || data.powerinterrupt === "") {
                        data.powerinterrupt = "NA";
                    }
                    if (data.vworkpermit === null || data.workpermit === "") {
                        data.workpermit = "NA";
                    }
                    if (data.startdateandtime === null || data.startdateandtime === "") {
                        data.startdateandtime = "NA";
                    }
                    aData[index] = data;
                });
            }
            return aData;
        });

        // Overwrite Get for ReportsCollection to fetch data based on custom data        
        this.on('READ', 'ReportsCollection', async (req, next) => {
            let aData = await next();
            if (aData) {
                aData.forEach((data, index) => {
                    data.requester = data.requester + " " + data.middle_name + " " + data.last_name;
                    data.delivery_timestamp = data.delivery_timestamp + " " + data.delivery_time;
                    if (data.request_id === null || data.request_id === "") {
                        data.request_id = "NA";
                    }
                    if (data.requester === null || data.requester === "") {
                        data.requester = "NA";
                    }
                    if (data.dshqy === null || data.dshqy === "") {
                        data.dshqy = "NA";
                    }
                    if (data.dispc === null || data.dispc === "") {
                        data.dispc = "NA";
                    }
                    if (data.actualprice === null || data.actualprice === "") {
                        data.actualprice = "NA";
                    }
                    if (data.menue_price === null || data.menue_price === "") {
                        data.menue_price = "NA";
                    }
                    if (data.requester_id === null || data.requester_id === "") {
                        data.requester_id = "NA";
                    }
                    if (data.delivery_location === null || data.delivery_location === "") {
                        data.delivery_location = "NA";
                    }
                    if (data.delivery_timestamp === null || data.delivery_timestamp === "") {
                        data.delivery_timestamp = "NA";
                    }
                    if (data.status === null || data.status === "") {
                        data.status = "NA";
                    }
                    if (data.costcenter === null || data.costcenter === "") {
                        data.costcenter = "NA";
                    }
                    if (data.wbselement === null || data.wbselement === "") {
                        data.wbselement = "NA";
                    }
                    if (data.dishcategory === null || data.dishcategory === "") {
                        data.dishcategory = "NA";
                    }
                    if (data.subheading === null || data.subheading === "") {
                        data.subheading = "NA";
                    }
                    if (data.comments === null || data.comments === "") {
                        data.comments = "NA";
                    }
                    aData[index] = data;
                });
            }
            return aData;
        });

        // Overwrite Get for ReportsrestrictCollection to fetch data based on custom data        
        this.on('READ', 'ReportsrestrictCollection', async (req, next) => {
            let aData = await next();
            if (aData) {
                aData.forEach((data, index) => {
                    data.requester = data.requester + " " + data.middle_name + " " + data.last_name;
                    data.delivery_timestamp = data.delivery_timestamp + " " + data.delivery_time;
                    if (data.request_id === null || data.request_id === "") {
                        data.request_id = "NA";
                    }
                    if (data.requester === null || data.requester === "") {
                        data.requester = "NA";
                    }
                    if (data.dshqy === null || data.dshqy === "") {
                        data.dshqy = "NA";
                    }
                    if (data.dispc === null || data.dispc === "") {
                        data.dispc = "NA";
                    }
                    if (data.actualprice === null || data.actualprice === "") {
                        data.actualprice = "NA";
                    }
                    if (data.menue_price === null || data.menue_price === "") {
                        data.menue_price = "NA";
                    }
                    if (data.requester_id === null || data.requester_id === "") {
                        data.requester_id = "NA";
                    }
                    if (data.delivery_location === null || data.delivery_location === "") {
                        data.delivery_location = "NA";
                    }
                    if (data.delivery_timestamp === null || data.delivery_timestamp === "") {
                        data.delivery_timestamp = "NA";
                    }
                    if (data.status === null || data.status === "") {
                        data.status = "NA";
                    }
                    if (data.costcenter === null || data.costcenter === "") {
                        data.costcenter = "NA";
                    }
                    if (data.wbselement === null || data.wbselement === "") {
                        data.wbselement = "NA";
                    }
                    if (data.dishcategory === null || data.dishcategory === "") {
                        data.dishcategory = "NA";
                    }
                    if (data.service_provider === null || data.service_provider === "") {
                        data.service_provider = "NA";
                    }
                    if (data.comments === null || data.comments === "") {
                        data.comments = "NA";
                    }
                    aData[index] = data;
                });
            }
            return aData;
        });

        //Common method
        //Method to Date in YYYY-MM-DD format
        const getDate = (sDate) => {
            // date
            // adjust 0 before single digit date
            let date = ("0" + sDate.getDate()).slice(-2);
            // month
            let month = ("0" + (sDate.getMonth() + 1)).slice(-2);
            // year
            let year = sDate.getFullYear();
            var sFDate = year + "-" + month + "-" + date;
            return sFDate;
        };

        //Method to DateTime in YYYY-MM-DD HH:MM:SS format
        const getDateTime = (sDate) => {
            // date
            // adjust 0 before single digit date
            let date = ("0" + sDate.getDate()).slice(-2);
            // month
            let month = ("0" + (sDate.getMonth() + 1)).slice(-2);
            // year
            let year = sDate.getFullYear();

            var hours = ("0" + sDate.getHours()).slice(-2);
            var min = ("0" + sDate.getMinutes()).slice(-2);
            var sec = ("0" + sDate.getSeconds()).slice(-2);
            let time = hours + ":" + min + ":" + sec;
            var sFDateTime = year + "-" + month + "-" + date + " " + time;
            return sFDateTime;
        };

        //Method to format Date time formate
        const getTimeStamp = (sDate) => {
            // date
            // adjust 0 before single digit date
            let date = sDate.substr(6, 2);
            // month
            let month = sDate.substr(4, 2);
            // year
            let year = sDate.substr(0, 4);
            var sFDate = year + "-" + month + "-" + date;
            var sTimestamp = sDate.substr(8, 2) + ":" + sDate.substr(10, 2) + ":" + sDate.substr(12, 2);
            var sFTimeStamp = sFDate + " " + sTimestamp;
            return sFTimeStamp;
        };

        //Method to format Date formate
        const getFormatDate = (sDate) => {
            // date
            // adjust 0 before single digit date
            let date = sDate.substr(6, 2);
            // month
            let month = sDate.substr(4, 2);
            // year
            let year = sDate.substr(0, 4);
            var sFDate = year + "-" + month + "-" + date;
            return sFDate;
        };

        return super.init()
    }
}

module.exports = {
    Kitservice
}