(function(global) {
    var app = global.app = global.app || {};

    app.changeStatusService = {
        createItem: function(jobId, pStatus) {
            //var newStatus = Status;
            var that = app.jobService.viewModel;
            //console.debug("gotoAccept context: " + e.context);
            var JBs = app.jobService.viewModel.get("jobDataSource");
            var selectProblemC = app.jobService.viewModel.get("selectProblemC");
            var selectProblemCM = app.jobService.viewModel.get("selectProblemCM");
            var selectProblemS = app.jobService.viewModel.get("selectProblemS");

            var itemList = [];
            JBs.filter({
                field: "jobId",
                operator: "eq",
                value: jobId
            });

            JBs.fetch(function() {
                // console.log("#### JBs Fetch ##### ");
                // console.log(app.jobService.viewModel.get("selectItem").status);
                var view = JBs.view();
                var selectItem
                if (view[0] == undefined) {
                    selectItem = app.jobService.viewModel.get("selectItem");
                    // console.log(JSON.stringify(app.jobService.viewModel.get("selectItem")));
                } else {
                    // selectItem = app.jobService.viewModel.get("selectItem");
                    selectItem = view[0]; //Save More No Data Cr.MOO 20160830
                    // console.log(JSON.stringify(view[0]));
                }
                var jobId = selectItem.jobId;
                var statusId = pStatus;
                var newStatus = pStatus;
                var oldStatus
                if (that.get("oStatus") == "OK") {
                    that.set("oStatus", that.get("selectedStatus"));
                    oldStatus = selectItem.statusId;
                } else if (that.get("oStatus") != null && that.get("oStatus") != "OK" && that.get("oStatus") != pStatus) {
                    oldStatus = that.get("oStatus");
                    that.set("oStatus", that.get("selectedStatus"));
                } else {
                    oldStatus = selectItem.statusId;
                }

                if (app.jobService.viewModel.get("selectItem") == null) {
                    var report = selectItem.report;
                    var reasonOverdue = selectItem.reasonOverdueDesc;
                    //jigkoh3 add remarkOverDue 19/11/2015
                    var remarkOverDue = selectItem.remarkOverDue;
                    var reportTypeId = selectItem.reportTypeId;
                    var reportType = selectItem.reportType;
                    var trId = selectItem.trId;
                    var faultAlarmNumber = selectItem.faultAlarmNumber;
                } else {
                    var report = app.jobService.viewModel.get("selectItem").report;
                    var reasonOverdue = app.jobService.viewModel.get("selectItem").reasonOverdueDesc;
                    //jigkoh3 add remarkOverDue 19/11/2015
                    var remarkOverDue = app.jobService.viewModel.get("selectItem").remarkOverDue;
                    var reportTypeId = app.jobService.viewModel.get("selectItem").reportTypeId;
                    var reportType = app.jobService.viewModel.get("selectItem").reportType;
                    var trId = app.jobService.viewModel.get("selectItem").trId;
                    var faultAlarmNumber = app.jobService.viewModel.get("selectItem").faultAlarmNumber;
                }


                var ttId = selectItem.ttId;
                var jbLat = selectItem.latitude;
                var jbLong = selectItem.longtitude;
                var updateDate = moment().unix() * 1000;

                var aamShow;
                if (selectItem.aamShow == undefined) {
                    aamShow = null;
                } else {
                    aamShow = selectItem.aamShow;
                }



                var problemCause = null;
                var problemSolve = null;
                var problemSolveProcess = null;
                var problemCauseMulti = null;



                if (pStatus == "05" && selectItem.statusId != "10") {

                    // var reasonOverdue = app.jobService.viewModel.get("selectItem").reasonOverdueDesc;
                    var reportTypeId = app.jobService.viewModel.get("jobReportType");

                    if (selectItem.reportType == "01") {

                        if (selectProblemC.data().length == 0) {
                            navigator.notification.alert("Please select Problem Cause",
                                function() {}, "Change Status : incomplete", 'OK');
                            return false;
                        }

                        selectProblemC.fetch(function() {
                            problemCause = [];
                            var PC = selectProblemC.view();

                            for (var i = 0; i < PC.length; i++) {
                                var str = PC[i].problemCauseMainId + "|" + PC[i].problemCauseSubId;

                                problemCause.push(str);
                            }
                        });


                        selectProblemS.fetch(function() {
                            problemSolve = [];
                            problemSolveProcess = [];
                            var PS = selectProblemS.view();

                            for (var i = 0; i < PS.length; i++) {
                                var str = PS[i].problemSolveId + "|" + PS[i].process + "|N|" + PS[i].subProblemCauseId;

                                problemSolve.push(str);

                                if (PS[i].processDesc != null && PS[i].processDesc != undefined && PS[i].processDesc != "") {

                                    str = PS[i].problemSolveId + "|" + PS[i].processDesc;

                                    problemSolveProcess.push(str);
                                }
                            }
                        });

                    } else if (selectItem.reportType == "02") {

                        if (selectProblemCM.data().length == 0) {
                            navigator.notification.alert("Please select Problem Cause",
                                function() {}, "Change Status : incomplete", 'OK');
                            return false;
                        }

                        selectProblemCM.fetch(function() {
                            problemCauseMulti = [];
                            var PCM = selectProblemCM.view();

                            for (var i = 0; i < PCM.length; i++) {

                                var arrMulti = PCM[i].multiCauseIds.split("|");
                                var result = [];
                                for (var j = 0; j < arrMulti.length; j++) {
                                    var str = arrMulti[j] + "#" + (j + 1);

                                    result.push(str);
                                }

                                var str = result.join("|");

                                problemCauseMulti.push(str);
                            }
                        });


                        selectProblemS.fetch(function() {
                            problemSolve = [];
                            var PS = selectProblemS.view();

                            for (var i = 0; i < PS.length; i++) {
                                var str = PS[i].problemSolveId + "|" + PS[i].process + "|N|" + PS[i].subProblemCauseId;

                                problemSolve.push(str);
                            }
                        });
                    }
                }

                // >>>> JB
                var jbList = [];
                var itemsAttr = {};
                itemsAttr.jobId = jobId;
                itemsAttr.statusId = statusId; //newstatus

                itemsAttr.newStatus = newStatus;
                itemsAttr.oldStatus = oldStatus;

                itemsAttr.report = report;

                itemsAttr.reasonOverdue = reasonOverdue;
                //jigkoh3 add remarkOverDue 19/11/2015
                itemsAttr.remarkOverdue = remarkOverDue;

                itemsAttr.reportTypeId = reportTypeId;
                itemsAttr.reportType = reportType;

                itemsAttr.trId = trId;
                itemsAttr.faultAlarmNumber = faultAlarmNumber;
                itemsAttr.jbLat = jbLat;
                itemsAttr.jbLong = jbLong;
                itemsAttr.aamShow = aamShow;

                itemsAttr.updateDate = updateDate;

                jbList.push(itemsAttr);
                // <<<<

                // >>>> TT
                var ttList = [];
                var itemsAttr = {};
                itemsAttr.ttId = ttId;
                ttList.push(itemsAttr);
                // <<<<

                // >>>> problemSolve
                var problemSolveList = [];
                var itemsAttr = {};
                itemsAttr.problemSolve = problemSolve;
                problemSolveList.push(itemsAttr);
                // <<<<

                // >>>> problemCause
                var problemCauseList = [];
                var itemsAttr = {};
                itemsAttr.problemCause = problemCause;
                problemCauseList.push(itemsAttr);
                // <<<<

                // >>>> equipment
                var equipmentList = [];
                var itemsAttr = {};
                equipmentList.push(itemsAttr);
                // <<<<

                // >>>> problemCauseMulti
                var problemCauseMultiList = [];
                var itemsAttr = {};
                itemsAttr.problemCauseMulti = problemCauseMulti;
                problemCauseMultiList.push(itemsAttr);
                // <<<<

                // >>>> problemCauseMulti
                var problemSolveProcessList = [];
                var itemsAttr = {};
                itemsAttr.problemSolveProcess = problemSolveProcess;
                problemSolveProcessList.push(itemsAttr);
                // <<<<

                // >>>> paramList (all parameter from page)
                var paramList = [];
                var itemsAttr = {};
                paramList.push(itemsAttr);
                // <<<<

                var dataValue = {};
                dataValue.token = localStorage.getItem("token");
                dataValue.version = '2';
                dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

                itemList = {};
                itemList.paramList = paramList;
                itemList.jbList = jbList;
                itemList.ttList = ttList;
                itemList.problemCauseList = problemCauseList;
                itemList.problemSolveList = problemSolveList;
                itemList.equipmentList = equipmentList;
                itemList.problemCauseMultiList = problemCauseMultiList;
                itemList.problemSolveProcessList = problemSolveProcessList;
            });
            console.log('create itemList complete');
            return itemList;

        },
        createItemMulti: function(jobId, pStatus) {
            //var newStatus = Status;
            var that = app.jobService.viewModel;
            //console.debug("gotoAccept context: " + e.context);
            var JBs = app.multiService.viewModel.get("jobMultiDataSource");
            var selectProblemC = []; //app.jobService.viewModel.get("selectProblemC");
            var selectProblemCM = []; //app.jobService.viewModel.get("selectProblemCM");
            var selectProblemS = []; //app.jobService.viewModel.get("selectProblemS");

            var itemList = [];
            JBs.filter({
                field: "jobId",
                operator: "eq",
                value: jobId
            });

            JBs.fetch(function() {
                var view = JBs.view();

                var selectItem = view[0];
                var jobId = selectItem.jobId;
                var statusId = pStatus;
                var newStatus = pStatus;
                var oldStatus = selectItem.statusId;
                var report = selectItem.report;
                var reasonOverdue = "";
                var reportTypeId = "";
                var reportType = "";

                var ttId = selectItem.ttId;
                var trId = selectItem.trId;
                var jbLat = selectItem.latitude;
                var jbLong = selectItem.longtitude;
                var aamShow = selectItem.aamShow;

                var updateDate = moment().unix() * 1000;

                var faultAlarmNumber = selectItem.faultAlarmNumber;

                var problemCause = null;
                var problemSolve = null;
                var problemSolveProcess = null;
                var problemCauseMulti = null;


                // >>>> JB
                var jbList = [];
                var itemsAttr = {};
                itemsAttr.jobId = jobId;
                itemsAttr.statusId = statusId; //newstatus

                itemsAttr.newStatus = newStatus;
                itemsAttr.oldStatus = oldStatus;

                itemsAttr.report = report;

                itemsAttr.reasonOverdue = reasonOverdue;
                itemsAttr.reportTypeId = reportTypeId;
                itemsAttr.reportType = reportType;

                itemsAttr.trId = trId;
                itemsAttr.jbLat = jbLat;
                itemsAttr.jbLong = jbLong;
                itemsAttr.aamShow = aamShow;

                itemsAttr.updateDate = updateDate;

                jbList.push(itemsAttr);
                // <<<<

                // >>>> TT
                var ttList = [];
                var itemsAttr = {};
                itemsAttr.ttId = ttId;
                ttList.push(itemsAttr);
                // <<<<

                // >>>> problemSolve
                var problemSolveList = [];
                var itemsAttr = {};
                itemsAttr.problemSolve = problemSolve;
                problemSolveList.push(itemsAttr);
                // <<<<

                // >>>> problemCause
                var problemCauseList = [];
                var itemsAttr = {};
                itemsAttr.problemCause = problemCause;
                problemCauseList.push(itemsAttr);
                // <<<<

                // >>>> equipment
                var equipmentList = [];
                var itemsAttr = {};
                equipmentList.push(itemsAttr);
                // <<<<

                // >>>> problemCauseMulti
                var problemCauseMultiList = [];
                var itemsAttr = {};
                itemsAttr.problemCauseMulti = problemCauseMulti;
                problemCauseMultiList.push(itemsAttr);
                // <<<<

                // >>>> problemCauseMulti
                var problemSolveProcessList = [];
                var itemsAttr = {};
                itemsAttr.problemSolveProcess = problemSolveProcess;
                problemSolveProcessList.push(itemsAttr);
                // <<<<

                // >>>> paramList (all parameter from page)
                var paramList = [];
                var itemsAttr = {};
                paramList.push(itemsAttr);
                // <<<<

                var dataValue = {};
                dataValue.token = localStorage.getItem("token");
                dataValue.version = '2';
                dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

                itemList = {};
                itemList.paramList = paramList;
                itemList.jbList = jbList;
                itemList.ttList = ttList;
                itemList.problemCauseList = problemCauseList;
                itemList.problemSolveList = problemSolveList;
                itemList.equipmentList = equipmentList;
                itemList.problemCauseMultiList = problemCauseMultiList;
                itemList.problemSolveProcessList = problemSolveProcessList;
            });

            return itemList;

        },
        checkReq: function(pStatus) {
            console.log("###### checkReq #########");
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            var loadReportType = that.get("loadReportType");
            if (pStatus == "05" && selectItem.statusId == "10") {

                if (selectItem.report == undefined || selectItem.report == null || selectItem.report == "") {
                    navigator.notification.alert("Please fill Report Detail",
                        function() {}, "Change Status Job : Save incomplete!", 'OK');
                    console.log("Report Detail Require!");
                    return false;
                } else {
                    return true;
                }

            } else if (pStatus == "05") {
                console.log("###### checkReq Job Report Type#########");
                if (jobReportType == undefined || jobReportType == null || jobReportType == "") {
                    navigator.notification.alert("Please select Job Report Type",
                        function() {}, "Change Status Job : Save incomplete!", 'OK');

                    console.log("Job Report Type Require!");
                    return false;
                }

                console.log("###### checkReq Job Report Type 1#########");
                if (selectItem.reportType == "01") {
                    var selectProblemC = that.get("selectProblemC");
                    console.log("###### checkReq selectProblemC#########");
                    var flag = true;
                    selectProblemC.fetch(function() {
                        var view = selectProblemC.view();
                        if (view.length == 0) {
                            navigator.notification.alert("Please select Problem Cause.",
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                            flag = false;
                        }
                    });

                    if (!flag) {
                        return false;
                    }
                    // console.log("###### checkReq selectProblem Solve#########");
                    // if (!app.changeStatusService.checkProblemSolve()) {
                    //     navigator.notification.alert("Please select problem solve.",
                    //         function() {
                    //             return false;
                    //         }, "Change Status Job : Save incomplete!", 'OK');
                    //     return false;
                    // }
                } else {
                    //                  console.log("###### check problemCm #########");
                    //                  var selectProblemCM = that.get("selectProblemCM");
                    //
                    //                  selectProblemCM.fetch(function() {
                    //                      var view = selectProblemCM.view();
                    //                      if (view.length == 0) {
                    //                          navigator.notification.alert("Please select Problem Cause.",
                    //                              function() {}, "Change Status Job : Save incomplete!", 'OK');
                    //                          console.log("#### Problem Cause Multi Require! 4");
                    //                          return false;
                    //                      }
                    //                  });

                    //if (!app.changeStatusService.checkProblemSolve()) {
                    //  return false;
                    //}
                }

                var isReason;


                //var that = app.jobService.viewModel;

                //var selectItem = that.get("selectItem");
                var selectedStatus = that.get("selectedStatus");


                //24/02/2016 change biz logic --> original --> selectItem.statusId < "05" && selectedStatus == "05"
                if (selectItem.statusId < "05" && selectedStatus == "05") {
                    if ((selectItem.finishDate / 1000) < moment().unix()) {
                        isReason = true;
                    }
                } else if (selectItem.statusId == "05") {
                    //24/02/2016  comment line  --> isReason = true;
                    isReason = true;
                } else {
                    isReason = false;
                }

                console.log("###### checkReq Reason#########");
                if (isReason) {
                    if (selectItem.flagOverDue == "Y") {
                        if (selectItem.reasonOverdueDesc == undefined || selectItem.reasonOverdueDesc == null || selectItem.reasonOverdueDesc == "") {
                            navigator.notification.alert("Please select Reason over Due",
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                            ////console.log("Reason over Due Require!");
                            return false;
                        }
                    }
                }

                console.log("###### checkReq report#########");
                if (selectItem.report == undefined || selectItem.report == null || selectItem.report == "") {
                    navigator.notification.alert("Please fill Report Detail",
                        function() {}, "Change Status Job : Save incomplete!", 'OK');
                    ////console.log("Report Detail Require!");
                    return false;
                }
            }
            console.log("###### checkReq pass#########");
            return true;
        },
        checkProblemSolve: function() {
            var that = app.jobService.viewModel;
            var flag = false;

            var selectProblemC = that.get("selectProblemC");
            var selectProblemCM = that.get("selectProblemCM");

            var selectProblemS = that.get("selectProblemS");

            var problemSolveData = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        operation.success(JSON.parse(localStorage.getItem("problemSolveData")));
                    }
                },
                filter: {
                    logic: "and",
                    filters: [{
                        field: "description",
                        operator: function(left, fieldExpression) {
                            return left.indexOf(fieldExpression()) < 0;
                        },
                        value: function(a) {
                            return "Permanent";
                        }
                    }, {
                        field: "description",
                        operator: function(left, fieldExpression) {
                            return left.indexOf(fieldExpression()) < 0;
                        },
                        value: function(a) {
                            return "Temporary";
                        }
                    }]

                },
                schema: {
                    data: "problemSolves"
                }
            });

            problemSolveData.fetch(function() {
                problemSolveFilter = new kendo.data.DataSource({
                    data: problemSolveData.view()
                });

                var filter = {
                    logic: "or",
                    filters: []
                }

                if (selectProblemC != undefined && selectProblemC != null) {

                    var data = selectProblemC.data();
                    for (var i = 0; i < data.length; i++) {
                        var filters = {
                            field: "subproblemCauseId",
                            operator: "eq",
                            value: data[i].problemCauseSubId
                        };
                        filter.filters.push(filters);
                    }
                }

                if (selectProblemCM != undefined && selectProblemCM != null) {

                    var data = selectProblemCM.data();
                    for (var i = 0; i < data.length; i++) {
                        var filters = {
                            field: "subproblemCauseId",
                            operator: "eq",
                            value: data[i].problemCauseSubId
                        };
                        filter.filters.push(filters);
                    }

                }

                if ((selectProblemC != undefined && selectProblemC != null) || (selectProblemCM != undefined && selectProblemCM != null)) {

                    problemSolveFilter.filter(filter);
                    problemSolveFilter.group({
                        field: "subproblemCauseId",
                        aggregates: [{
                            field: "subproblemCauseId",
                            aggregate: "count"
                        }]
                    });

                    ////console.log(JSON.stringify(problemSolveFilter));

                    problemSolveFilter.fetch(function() {
                        var temp = problemSolveFilter.view();

                        if (temp.length == 0) {
                            flag = true;
                        }
                        if (!flag) {
                            var selectS;
                            var ds;
                            selectProblemS.fetch(function() {
                                selectS = selectProblemS.data();
                                ds = new kendo.data.DataSource({
                                    data: selectS
                                });

                            });

                            var arr = [];
                            for (var i = 0; i < temp.length; i++) {

                                if (temp[i].aggregates.subproblemCauseId.count > 0) {
                                    ds.filter({
                                        logic: "and",
                                        filters: [{
                                            field: "problemSolveDesc",
                                            operator: function(left, fieldExpression) {
                                                return left.indexOf(fieldExpression()) < 0;
                                            },
                                            value: function(a) {
                                                return "Permanent";
                                            }
                                        }, {
                                            field: "problemSolveDesc",
                                            operator: function(left, fieldExpression) {
                                                return left.indexOf(fieldExpression()) < 0;
                                            },
                                            value: function(a) {
                                                return "Temporary";
                                            }
                                        }, {
                                            field: "subProblemCauseId",
                                            operator: "eq",
                                            value: temp[i].value
                                        }]
                                    });

                                    ds.fetch(function() {
                                        var view = ds.view();

                                        arr.push(view.length)
                                    });
                                }
                            }

                            flag = true;

                            for (var j = 0, l = arr.length; j < l; j++) {
                                if (arr[j] == 0) {
                                    flag = false;
                                }
                            };
                        }
                        return flag;
                    });
                }

                ////console.log("checkProblemSolve fail!");
            });
            return flag;
        }
    }
})(window);
