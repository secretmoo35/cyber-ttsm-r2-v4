(function(global) {
    var jobViewModel,
        app = global.app = global.app || {};

    jobViewModel = kendo.data.ObservableObject.extend({
        jobDataSource: null,
        jobProblemCDataSource: null,
        jobProblemCMDataSource: null,
        jobProblemSDataSource: null,
        jobProblemSPDataSource: null,
        memberDataSource: null,
        photoDataSource: null,
        selectId: null,
        selectItem: null,
        selectProblemC: null,
        selectProblemCM: null,
        selectProblemS: null,
        selectProblemSP: null,
        priority: null,
        lastupdateassign: null,
        lastupdatereaccept: null,
        rejectremark: null,
        rejectReturnUrl: null,
        _isLoading: true,
        fileSystem: null,
        showType: null,
        selectPage: null,
        isSearch: false,
        returnUrl: null,
        selectedStatus: null,
        reportdetail: null,
        jobReportType: null,
        cntSiteAffect: null,
        cntSiteAccess: null,
        tmpName: null,
        searchtxt: '',
        alarmJobId: '',
        assignFilter: '',
        countBy: 'finishDates',
        siteAlarmType: 'Site Access Alarm',
        isDirectFromMap: false,
        isNotfound: false,
        oStatus: null,
        // isTemp: true,
        goSiteAssessView: function() {
            app.siteAccessService.viewModel.set("returnUrl", "#tabstrip-display");
            app.application.navigate('#job-site-access');
        },
        goSiteAssess: function() {
            var returnUrl = app.siteAccessService.viewModel.set("returnUrl", "#tabstrip-edit");
            app.application.navigate('#job-site-access');
        },
        goSiteAffectView: function() {
            app.siteAffectService.viewModel.set("returnUrl", "#tabstrip-display");
            app.application.navigate('#siteAffect');
        },
        goSiteAffect: function() {
            app.siteAffectService.viewModel.set("returnUrl", "#tabstrip-edit");
            app.application.navigate('#siteAffect');
        },
        backToMap: function() {
            //alert("backToMap");
            app.mapService.viewModel.set("mapFromMode", "A");
            //app.mapService.viewModel.set("latitude", e.dataItem.latitude);
            //app.mapService.viewModel.set("longitude", e.dataItem.longitude);
            app.application.navigate(
                '#tabstrip-map'
            );
        },
        isReason: function() {
            var that = app.jobService.viewModel;

            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");

            if (selectItem.statusId < "05" && selectedStatus == "05" && selectItem.flagOverDue == "Y") {
                return true;
            } else if (selectItem.statusId == "05" && selectItem.flagOverDue == "Y") {
                return true;
            } else {
                return false;
            }
        },
        isVisible: function(fldName) {
            if (app.jobService.viewModel.get("countBy") == fldName) {
                return true;
            } else {
                return false;
            }
        },
        isReasonDesc: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            if (selectItem.reasonOverdueDesc != null && selectItem.reasonOverdueDesc != undefined && selectItem.reasonOverdueDesc != "") {
                if (selectItem.statusId == "10") {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        allowAcceptReject: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            if (selectItem.statusId == "01" && selectItem.assignTo == JSON.parse(localStorage.getItem("profileData")).userId) {
                return true;
            }
        },
        formatInitialDate: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            return format_time_date(selectItem.initiateDate);
        },
        formatFinishDate: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            return format_time_date(selectItem.finishDate);
        },
        isReportType: function() {
            var that = this;

            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");

            if (selectItem.statusId == "05" || selectedStatus == "05") {
                return true;

            } else {
                return false;
            }

        },
        isProblemC: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");


            if ((selectItem.statusId > "04" || selectedStatus == "05") && (selectItem.statusId != "10")) {
                if (selectItem.reportType == "01") {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isProblemCM: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");
            if ((selectItem.statusId > "04" || selectedStatus == "05") && (selectItem.statusId != "10")) {
                if (selectItem.reportType == "02") {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isProblemS: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");
            if ((selectItem.statusId > "04" || selectedStatus == "05") && (selectItem.statusId != "10")) {
                if (selectItem.reportType == "01") {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isProblemSR: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");
            var selectProblemS = that.get("selectProblemS");

            var flag = false;

            if ((selectItem.statusId > "04" || selectedStatus == "05") && (selectItem.statusId != "10")) {
                //selectProblemS.fetch(function() {
                if (selectProblemS != undefined && selectProblemS != null) {

                    for (var i = 0; i < selectProblemS.data().length; i++) {
                        if (selectProblemS.at(i).problemSolveDesc.indexOf("Temporary") > 0 || selectProblemS.at(i).problemSolveDesc.indexOf("Permanent") > 0) {
                            flag = true;
                            return true;

                        }
                    }
                }
                //});
            }

            return flag;

        },
        isProcess: function() {
            var that = this;
            //var rtn = false;
            var selectItem = that.get("selectItem");
            var selectedStatus = that.get("selectedStatus");
            var selectProblemS = that.get("selectProblemS");
            var flag = false;

            if ((selectItem.statusId > "04" || selectedStatus == "05") && (selectItem.statusId != "10")) {
                if (selectProblemS != undefined && selectProblemS != null) {
                    //selectProblemS.fetch(function() {
                    for (var i = 0; i < selectProblemS.data().length; i++) {
                        if (selectProblemS.at(i).processDesc != null) {
                            flag = true;
                            return true;
                        }
                    }

                }
            }
            return flag;
        },
        cntProblemCause: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            return selectItem.cntProblemCause;
        },
        cntProblemSolve: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            return selectItem.cntProblemSolve;
        },
        isAccept: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId == "02") {
                return true;
            } else {
                return false;
            }
        },
        isInit: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId == "03") {
                return true;
            } else {
                return false;
            }
        },
        isOnsite: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId == "04") {
                return true;
            } else {
                return false;
            }
        },
        isReport: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId == "10" || selectItem.statusId == "05") {
                return true;
            } else {
                return false;
            }
        },
        isMoreDetail: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId == "10") {
                return true;
            } else {
                return false;
            }
        },
        isAMM: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (selectItem.aamShow == "Y") {
                return true;
            } else {
                return false;
            }
        },
        imageSrc: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            return "images/" + selectItem.priorityName + ".png";

        },
        loadReportType: function() {
            var that = app.jobService.viewModel;
            //var body = $(".km-pane");
            //////console.logug(localStorage.getItem("teamData"));
            if (kendo.ui.DropDownList) {
                $("#ddReportType").kendoDropDownList({
                    dataBound: function() {
                        ////console.log("default report type");
                        var value = this.value();
                        jobReportType = value;

                        that.set("jobReportType", jobReportType);
                    },
                    change: function(e) {
                        ////console.log("change report type");
                        var value = this.value();
                        jobReportType = value;

                        that.set("jobReportType", jobReportType);
                    },
                    dataTextField: "reportType",
                    dataValueField: "typeId",
                    dataSource: new kendo.data.DataSource({
                        transport: {
                            read: function(operation) {
                                operation.success(JSON.parse(localStorage.getItem("reportTypeData")));
                            }
                        },
                        schema: {
                            data: "jobReportTypes"
                        }
                    })
                });
            }
        },
        onSwitchChange: function(e) {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");

            if (e.checked) {
                selectItem.aamShow = "Y";
            } else {
                selectItem.aamShow = null;
            }
        },
        loadassignlist: function() {
            var that = this,
                JBs,
                Photo;

            that.showLoading();
            //////console.log(JSON.stringify(JSON.parse(localStorage.getItem("jbData")).jobs));

            JBs = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbData")));
                            var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                            that.countAssign();
                            that.set("lastupdateassign", format_time_date(new Date()));
                            that.hideLoading();
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    operation.success(response);
                                    //that.hideLoading();
                                    localStorage.setItem("jbData", JSON.stringify(response));
                                    ////console.log("fetch My Job : Complete");
                                    var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                                    //app.jobService.viewModel.showLoading();
                                    //app.jobService.viewModel.loadassignlist();
                                    //app.jobService.viewModel.filterassign(btnGroup.current().index());
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("Get My Job from cache failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Job failed", 'OK');
                                        return;
                                    }
                                },
                                complete: function() {
                                    that.countAssign();
                                    that.set("lastupdateassign", format_time_date(new Date()));
                                    that.hideLoading();
                                    return;
                                }
                            });
                        }
                    }
                },
                schema: {
                    data: "jobs"
                },
                model: {
                    id: "jobId"
                }
            });

            JBs.bind("error", function(e) {
                ////console.log("Get my jobs failed");
                ////console.log(e.status);
                ////console.log(e.xhr);
                navigator.notification.alert(e.status,
                    function() {}, "Get jobs failed", 'OK');
                return;
            });


            if ($("#lvAssignList").data("kendoMobileListView") == undefined || $("#lvAssignList").data("kendoMobileListView") == null) {
                $("#lvAssignList").kendoMobileListView({
                    dataSource: JBs,
                    //style: "inset",
                    template: $("#assign-template").html(),
                    pullToRefresh: true,
                    virtualViewSize: 40,
                    endlessScroll: true,
                    // filterable: {
                    //     field: "jobId",
                    //     operator: "startswith"
                    // },
                    //serverPaging: true,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
                setTimeout(function() {
                    app.jobService.viewModel.filterassign(0);
                    //that.hideLoading();
                }, 5000);
            } else {
                $("#lvAssignList").data("kendoMobileListView").setDataSource(JBs);
                // $("#lvAssignList").kendoMobileListView({
                //     dataSource: JBs,
                //     template: $("#assign-template").html(),
                //     filterable: {
                //         field: "jobId",
                //         operator: "startswith"
                //     },
                //     endlessScroll: true
                // });
                that.hideLoading();
            }

            //$("#lvAssignList").data("kendoMobileListView").refresh();
            //$("#lvAssignList").data("kendoMobileListView").reset();

            that.set("jobDataSource", JBs);

            that.loadProblemAssign();
        },
        loadacceptlist: function() {
            var that = this,
                JBs,
                Photo;

            that.showLoading();
            //var networkState = navigator.connection.type;

            var isOffline = app.loginService.viewModel.get("isOffline");

            if (!isOffline) {
                JBs = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            if (app.configService.isMorkupData) {
                                operation.success(JSON.parse(localStorage.getItem("jbData")));
                                var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                that.countAccept();
                                that.set("lastupdateaccept", format_time_date(new Date()));
                                that.hideLoading();
                            } else {
                                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                    type: "POST",
                                    timeout: 180000,
                                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
                                    data: JSON.stringify({
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "priority": "",
                                        "statusId": "",
                                        "type": "",
                                        "version": "2"
                                    }),
                                    dataType: "json",
                                    contentType: 'application/json',
                                    success: function(response) {
                                        //store response
                                        operation.success(response);

                                        //that.hideLoading();
                                        localStorage.setItem("jbData", JSON.stringify(response))
                                            ////console.log("fetch My Job : Complete");
                                            ////console.log("My Job Data :" + JSON.stringify(response));

                                        var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                        //app.jobService.viewModel.showLoading();
                                        //app.jobService.viewModel.loadassignlist();
                                        //app.jobService.viewModel.filteraccept(btnGroup.current().index());
                                    },
                                    error: function(xhr, error) {
                                        that.hideLoading();
                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            cache = localStorage.getItem("jbData");

                                            if (cache != null && cache != undefined) {
                                                operation.success(JSON.parse(cache));
                                            } else {
                                                ////console.log("Get My Job failed");
                                                ////console.log(xhr);
                                                ////console.log(error);
                                                navigator.notification.alert(xhr.status + error,
                                                    function() {}, "Get My Job failed", 'OK');
                                                return;
                                            }
                                        }
                                    },
                                    complete: function() {
                                        that.countAccept();
                                        that.set("lastupdateaccept", format_time_date(new Date()));
                                        that.hideLoading();
                                    }
                                });
                            }

                        }
                    },
                    schema: {
                        data: "jobs"
                    },
                    model: {
                        id: "jobId"
                    }
                });
            } else {
                JBs = new kendo.data.DataSource({
                    data: JSON.parse(localStorage.getItem("jbData")),

                    schema: {
                        data: "jobs"
                    },
                    model: {
                        id: "jobId"
                    }

                });
                that.hideLoading();
            }


            if ($("#lvAcceptList").data("kendoMobileListView") == undefined || $("#lvAcceptList").data("kendoMobileListView") == null) {
                $("#lvAcceptList").kendoMobileListView({
                    dataSource: JBs,
                    //style: "inset",
                    template: $("#accept-template").html(),
                    pullToRefresh: true,
                    virtualViewSize: 40,
                    endlessScroll: true,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
                setTimeout(function() {
                    app.jobService.viewModel.filteraccept(0);
                }, 5000);
            } else {
                $("#lvAcceptList").data("kendoMobileListView").setDataSource(JBs);
                that.hideLoading();
            }

            //$("#lvAcceptList").data("kendoMobileListView").refresh();
            //$("#lvAcceptList").data("kendoMobileListView").reset();

            that.set("jobDataSource", JBs);
            //////console.log(JSON.stringify(dataSource));
            that.loadProblemAccept();

        },
        countAssign: function() {
            var that = this;

            var dataSource;


            var tabstripParam = app.application.view().element.find(".mytabstrip").data("kendoMobileTabStrip");
            //that.showLoading();

            var dataSource = new kendo.data.DataSource({
                data: JSON.parse(localStorage.getItem("jbData")),
                filter: {
                    field: "statusId",
                    operator: "eq",
                    value: "01"

                },
                group: {
                    field: "priorityId",
                    aggregates: [{
                        field: "priority",
                        aggregate: "count"
                    }]
                },
                schema: {
                    data: "jobs",
                    model: {
                        id: "jobId"
                    }
                }
            });

            var badgeNone = 0,
                badgeMinor = 0,
                badgeMajor = 0,
                badgeCritical = 0;
            var assignCount = 0,
                acceptCount = 0;
            var assigngroup = $("#assigngroup").data("kendoMobileButtonGroup");
            //var aggregates = dataSource.view().aggregate();
            dataSource.fetch(function() {
                var view = dataSource.view();

                for (var i = 0; i < view.length; i++) {
                    //////console.log("View value : " + view[i].value);
                    if (view[i].value == "1") {
                        //none
                        badgeNone = view[i].aggregates.priority.count;
                        assignCount += badgeNone;

                        ////console.log("gNone : " + view[i].aggregates.priority.count);
                    } else if (view[i].value == "2") {
                        //minor
                        var assigngroup = $("#assigngroup").data("kendoMobileButtonGroup");
                        badgeMinor = view[i].aggregates.priority.count;
                        assignCount += badgeMinor;

                        ////console.log("gMinor : " + view[i].aggregates.priority.count);
                    } else if (view[i].value == "3") {
                        //major
                        var assigngroup = $("#assigngroup").data("kendoMobileButtonGroup");
                        badgeMajor = view[i].aggregates.priority.count;
                        assignCount += badgeMajor;

                        ////console.log("gMajor : " + view[i].aggregates.priority.count);
                    } else if (view[i].value == "4") {
                        //critical
                        var assigngroup = $("#assigngroup").data("kendoMobileButtonGroup");
                        badgeCritical = view[i].aggregates.priority.count;
                        assignCount += badgeCritical;

                        ////console.log("gCritical : " + view[i].aggregates.priority.count);
                    }
                }



                //var tabstrip = $("#mytabstrip").data("kendoMobileTabStrip");
                //tabstrip.badge("a[id='tAssign']", assignCount);


                var dataSourceAccept = new kendo.data.DataSource({
                    data: JSON.parse(localStorage.getItem("jbData")),
                    filter: {
                        field: "statusId",
                        operator: "neq",
                        value: "01"
                    },
                    aggregate: {
                        field: "status",
                        aggregate: "count"
                    },
                    schema: {
                        data: "jobs",
                        model: {
                            id: "jobId"
                        }
                    }
                });
                dataSourceAccept.fetch(function() {
                    var results = dataSourceAccept.aggregates().status;

                    if (results != undefined && results != null) {
                        acceptCount = results.count;
                    } else {
                        acceptCount = 0;

                    }
                });
                //////console.log("aggregates : " + JSON.stringify(dataSource.view()));

            });
            assigngroup.badge(3, badgeNone);
            assigngroup.badge(2, badgeMinor);
            assigngroup.badge(1, badgeMajor);
            assigngroup.badge(0, badgeCritical);
            setTimeout(function() {
                app.jobService.viewModel.setCount(assignCount, acceptCount);
            }, 2000);


        },
        filterassign: function(i) {
            var that = this;

            var index = 4 - i;
            var lvAssignList = $("#lvAssignList").data("kendoMobileListView");
            ////console.log("Assign Filter : " + index);
            //that.showLoading();
            lvAssignList.dataSource.filter({
                logic: "and",
                filters: [{
                    field: "statusId",
                    operator: "eq",
                    value: "01"
                }, {
                    field: "priorityId",
                    operator: "eq",
                    value: index
                }]
            });
            //lvAssignList.dataSource.read();
            lvAssignList.refresh();
            app.application.view().scroller.reset();

            //$("#lvAssignList").data("kendoMobileListView").refresh();
            //that.hideLoading();
        },
        countAccept: function() {
            //var tabstripParam = app.application.view().element.find(".mytabstrip").data("kendoMobileTabStrip");

            var dataSource = null;


            //that.showLoading();

            dataSource = new kendo.data.DataSource({
                data: JSON.parse(localStorage.getItem("jbData")),
                group: {
                    field: "statusId",
                    aggregates: [{
                        field: "status",
                        aggregate: "count"
                    }]
                },
                schema: {
                    data: "jobs"
                }
            });

            var assignCount = 0;
            var acceptCount = 0;
            var badgeAccept = 0,
                badgeInitial = 0,
                badgeOnsite = 0,
                badgeWaitReport = 0,
                badgeWaitDetail = 0;
            var acceptgroup = $("#acceptgroup").data("kendoMobileButtonGroup");
            //var aggregates = dataSource.view().aggregate();
            dataSource.fetch(function() {
                var view = dataSource.view();

                for (var i = 0; i < view.length; i++) {
                    //////console.log("View value : " + view[i].value);
                    if (view[i].value == "01") {
                        //Assign
                        assignCount = view[i].aggregates.status.count;
                    } else if (view[i].value == "02") {
                        //Accept
                        badgeAccept = view[i].aggregates.status.count;
                        acceptCount += view[i].aggregates.status.count;
                        ////console.log("gAccept : " + view[i].aggregates.status.count);
                    } else if (view[i].value == "03") {
                        //Initial
                        badgeInitial = view[i].aggregates.status.count;
                        acceptCount += view[i].aggregates.status.count;
                        ////console.log("gInitial : " + view[i].aggregates.status.count);
                    } else if (view[i].value == "04") {
                        //Onsite
                        badgeOnsite = view[i].aggregates.status.count
                        acceptCount += view[i].aggregates.status.count;
                        ////console.log("gOnsite : " + view[i].aggregates.status.count);
                    } else if (view[i].value == "05") {
                        //WaitReport
                        badgeWaitReport = view[i].aggregates.status.count;
                        acceptCount += view[i].aggregates.status.count;
                        ////console.log("gWaitReport : " + view[i].aggregates.status.count);
                    } else if (view[i].value == "10") {
                        //WaitDetail
                        badgeWaitDetail = view[i].aggregates.status.count;
                        acceptCount += view[i].aggregates.status.count;
                        ////console.log("gWaitDetail : " + view[i].aggregates.status.count);
                    }
                }



            });

            acceptgroup.badge(0, badgeAccept);
            acceptgroup.badge(1, badgeInitial);
            acceptgroup.badge(2, badgeOnsite);
            acceptgroup.badge(3, badgeWaitReport);
            acceptgroup.badge(4, badgeWaitDetail);

            setTimeout(function() {
                app.jobService.viewModel.setCount(assignCount, acceptCount);
            }, 2000);

        },
        filteraccept: function(i) {
            var that = this;
            var index = i;
            //that.showLoading();
            ////console.log("Accept Filter : " + index);

            if (index == 0) {
                //accept
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "02"
                    }]
                };
            } else if (index == 1) {
                //initial
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "03"
                    }]
                };
            } else if (index == 2) {
                //onsite
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "04"
                    }]
                };
            } else if (index == 3) {
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "05"
                    }]
                };
            } else if (index == 4) {
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "10"
                    }]
                };
            }

            var lvAcceptList = $("#lvAcceptList").data("kendoMobileListView");

            lvAcceptList.dataSource.filter(filter);
            //lvAcceptList.dataSource.read();
            lvAcceptList.refresh();
            app.application.view().scroller.reset();


            //$("#lvAcceptList").data("kendoMobileListView").refresh();

        },
        loadProblemAssign: function() {
            var that = this;

            //var jobId = that.get("selectItem").jobId;

            var dataSourcePC = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCause.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    operation.success(response);
                                    //that.hideLoading();
                                    ////console.log("fetch My Problem Cause : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("Get My Problem Cause failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Problem Cause failed", 'OK');

                                    }
                                    return;
                                },
                                complete: function() {}
                            });
                        }

                    }
                },
                //filter: {
                //  field: "jobId",
                //  operator: "eq",
                //  value: jobId
                //},
                schema: {
                    data: "jobProblems"
                }
            });

            var dataSourcePCM = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCauseM.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //localStorage.setItem("jbCauseMData", JSON.stringify(response));
                                    //that.hideLoading();
                                    operation.success(response);
                                    ////console.log("fetch My Problem Cause Multi : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {

                                        ////console.log("Get My Problem Cause Multi failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Problem Cause Multi failed", 'OK');

                                    }
                                    return;
                                },
                                complete: function() {


                                }
                            });
                        }


                    }
                },
                //filter: {
                //  field: "jobId",
                //  operator: "eq",
                //  value: jobId
                //},
                schema: {
                    data: "jobProblems"
                }
            });

            var dataSourcePS = new kendo.data.DataSource({

                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemSolve.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //localStorage.setItem("jbSolveData", JSON.stringify(response));
                                    operation.success(response);
                                    //that.hideLoading();
                                    ////console.log("fetch My Problem Solve : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {

                                        ////console.log("Get My Problem Solve failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Problem Solve failed", 'OK');

                                    }
                                    return;
                                },
                                complete: function() {}
                            });
                        }

                    }
                },
                //filter: {
                //  field: "jobId",
                //  operator: "eq",
                //  value: jobId
                //},
                schema: {
                    data: "jobProblems"
                }
            });

            var dataSourcePSP = new kendo.data.DataSource({

                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemSolve.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //localStorage.setItem("jbSolveData", JSON.stringify(response));
                                    operation.success(response);
                                    that.hideLoading();
                                    ////console.log("fetch My Problem Solve Process : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {

                                        ////console.log("Get My Problem Solve Process failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Problem Solve Process failed", 'OK');

                                    }
                                    return;
                                },
                                complete: function() {}
                            });
                        }

                    }
                },
                filter: {
                    field: "processDesc",
                    operator: "neq",
                    value: ""
                },
                schema: {
                    data: "jobProblems"
                }
            });

            that.set("jobProblemCDataSource", dataSourcePC);
            that.set("jobProblemCMDataSource", dataSourcePCM);
            that.set("jobProblemSDataSource", dataSourcePS);
            //dataSourcePSP
            //dataSourcePSP.fetch(function(){
            //////console.log("");      
            //});

            that.set("jobProblemSPDataSource", dataSourcePSP);

        },
        loadProblemAccept: function() {
            var that = this;

            //var jobId = that.get("selectItem").jobId;
            var isOffline = app.loginService.viewModel.get("isOffline");

            var dataSourcePC = null;
            if (!isOffline) {
                dataSourcePC = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            if (app.configService.isMorkupData) {
                                operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                            } else {
                                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                    beforeSend: app.loginService.viewModel.checkOnline,
                                    type: "POST",
                                    timeout: 180000,
                                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCause.json',
                                    data: JSON.stringify({
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "priority": "",
                                        "statusId": "",
                                        "version": "2"
                                    }),
                                    async: false,
                                    dataType: "json",
                                    contentType: 'application/json',
                                    success: function(response) {
                                        //store response
                                        operation.success(response);
                                        //that.hideLoading();
                                        ////console.log("fetch My Problem Cause : Complete");
                                        //////console.log("My Job Data :" + JSON.stringify(response));
                                    },
                                    error: function(xhr, error) {
                                        that.hideLoading();
                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            var cache = localStorage.getItem("jbCauseData");

                                            if (cache == null || cache == undefined) {
                                                ////console.log("Get My Problem Cause failed");
                                                ////console.log(xhr);
                                                ////console.log(error);
                                                navigator.notification.alert(xhr.status + error,
                                                    function() {}, "Get My Problem Cause failed", 'OK');
                                            } else {
                                                operation.success(JSON.parse(cache));
                                            }
                                        }
                                        return;
                                    },
                                    complete: function() {}
                                });
                            }
                        }
                    },
                    //filter: {
                    //  field: "jobId",
                    //  operator: "neq",
                    //  value: jobId
                    //},
                    schema: {
                        data: "jobProblems"
                    }
                });
            } else {
                dataSourcePC = new kendo.data.DataSource({
                    data: JSON.parse(localStorage.getItem("jbCauseData")),
                    schema: {
                        data: "jobProblems"
                    }
                });
            }

            var dataSourcePCM = null;
            if (!isOffline) {
                dataSourcePCM = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCauseM.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //localStorage.setItem("jbCauseMData", JSON.stringify(response));
                                    //that.hideLoading();
                                    operation.success(response);
                                    ////console.log("fetch My Problem Cause Multi : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        var cache = localStorage.getItem("jbCauseMData");

                                        if (cache == null || cache == undefined) {
                                            ////console.log("Get My Problem Cause Multi failed");
                                            ////console.log(xhr);
                                            ////console.log(error);
                                            navigator.notification.alert(xhr.status + error,
                                                function() {}, "Get My Problem Cause Multi failed", 'OK');
                                        } else {
                                            operation.success(JSON.parse(cache));
                                        }
                                    }
                                    return;
                                },
                                complete: function() {


                                }
                            });

                        }
                    },
                    //filter: {
                    //  field: "jobId",
                    //  operator: "neq",
                    //  value: jobId
                    //},
                    schema: {
                        data: "jobProblems"
                    }
                });
            } else {
                dataSourcePCM = new kendo.data.DataSource({
                    data: JSON.parse(localStorage.getItem("jbCauseMData")),
                    schema: {
                        data: "jobProblems"
                    }
                });
            }

            var dataSourcePS = null;
            if (!isOffline) {
                dataSourcePS = new kendo.data.DataSource({

                    transport: {
                        read: function(operation) {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemSolve.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": "",
                                    "statusId": "",
                                    "version": "2"
                                }),
                                async: false,
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //localStorage.setItem("jbSolveData", JSON.stringify(response));
                                    operation.success(response);
                                    //that.hideLoading();
                                    ////console.log("fetch My Problem Solve : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        var cache = localStorage.getItem("jbSolveData");

                                        if (cache == null || cache == undefined) {
                                            ////console.log("Get My Problem Solve failed");
                                            ////console.log(xhr);
                                            ////console.log(error);
                                            navigator.notification.alert(xhr.status + error,
                                                function() {}, "Get My Problem Solve failed", 'OK');
                                        } else {
                                            operation.success(JSON.parse(cache));

                                        }
                                    }
                                    return;
                                },
                                complete: function() {}
                            });
                        }
                    },
                    //filter: {
                    //  field: "jobId",
                    //  operator: "neq",
                    //  value: jobId
                    //},
                    schema: {
                        data: "jobProblems"
                    }
                });
            } else {
                dataSourcePS = new kendo.data.DataSource({
                    data: JSON.parse(localStorage.getItem("jbSolveData")),
                    schema: {
                        data: "jobProblems"
                    }
                });
            }


            that.set("jobProblemCDataSource", dataSourcePC);
            that.set("jobProblemCMDataSource", dataSourcePCM);
            that.set("jobProblemSDataSource", dataSourcePS);
        },
        setCount: function(assignCount, acceptCount, tabstripParam) {

            var tabstrip = app.application.view().element.find(".mytabstrip").data("kendoMobileTabStrip");
            //if (tabstrip != null || tabstrip != undefined) {
            tabstrip.badge('.tAssign', assignCount);
            tabstrip.badge('.tAccept', acceptCount);
            //} else {
            //  if (tabstripParam != null || tabstripParam != undefined) {
            //      tabstripParam.badge('.tAssign', assignCount);
            //      tabstripParam.badge('.tAccept', acceptCount);
            //  }
            //}
        },
        setCountAssign: function(assignCount, tabstripParam) {

            var tabstrip = $(".mytabstrip").data("kendoMobileTabStrip");
            if (tabstrip != null || tabstrip != undefined) {
                tabstrip.badge('.tAssign', assignCount);
            } else {
                if (tabstripParam != null || tabstripParam != undefined) {
                    tabstripParam.badge('.tAssign', assignCount);
                }
            }
        },
        setCountAccept: function(assignCount, acceptCount, tabstripParam) {

            var tabstrip = $(".mytabstrip").data("kendoMobileTabStrip");
            if (tabstrip != null || tabstrip != undefined) {
                tabstrip.badge('.tAccept', acceptCount);
            } else {
                if (tabstripParam != null || tabstripParam != undefined) {
                    tabstripParam.badge('.tAccept', acceptCount);
                }
            }
        },
        onCickAcceptReject: function() {
            var that = this;

            var ddlStatusDisplay = $("#ddlStatusDisplay").data("kendoDropDownList");
            var selectItem = that.get("selectItem");

            if (ddlStatusDisplay.current().index() == "1") {

                that.exeAcceptJob()

            } else if (ddlStatusDisplay.current().index() == "2") {

                that.set("rejectReturnUrl", "#tabstrip-assign");

                ////console.log("Reject selectItem :" + JSON.stringify(selectItem));

                //that.set("selectItem", selectItem);
                //$("#assignActionSheet").data("kendoMobileActionSheet").close();
                app.application.replace(
                    '#tabstrip-reject' //or whichever transition you like
                );

            } else {
                navigator.notification.alert("Please select action!",
                    function() {}, "Save incomplete", 'OK');
            }
        },
        gotoReject: function(e) {
            //setTimeout(function () {
            var that = app.jobService.viewModel;
            that.set("rejectremark", "");

            if (e.context != undefined && e.context != null) {

                ////console.log("gotoReject context: " + e.context);
                var JBs = that.get("jobDataSource");
                ////console.log(JSON.stringify(JBs));

                JBs.filter({
                    field: "jobId",
                    operator: "eq",
                    value: e.context,
                });

                JBs.fetch(function() {
                    var view = JBs.view();

                    var selectItem = view[0];





                    $("#assignActionSheet").data("kendoMobileActionSheet").close();

                    if (selectItem != null && selectItem != undefined) {
                        that.set("rejectReturnUrl", "#tabstrip-assign");
                        ////console.log("Reject selectItem :" + JSON.stringify(selectItem));

                        that.set("selectItem", selectItem);
                        app.application.replace(
                            '#tabstrip-reject' //or whichever transition you like
                        );
                    }
                });

            }
            //}, 0);
        },
        loadreject: function() {
            var that = this;
            //rejectremark
            //var selectId = that.get("selectId");
            ////console.log("Reject Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + that.get("selectItem.jobId"));
        },
        rejectjob: function() {
            var that = app.jobService.viewModel;
            that.exeReject();
        },
        exeReject: function() {
            ////console.log("Reject Job");
            var that = app.jobService.viewModel;

            var rejectremark = that.get("rejectremark");
            if (rejectremark == null || rejectremark == null || rejectremark == "") {
                ////console.log("Reject : Remark require!");
                navigator.notification.alert("Remark require!",
                    function() {}, "Reject", 'OK');
                return false;
            } else {
                that.showLoading();
                ////console.log("Reject Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + that.get("selectItem.jobId") + ", rejectremark : " + rejectremark);
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    beforeSend: app.loginService.viewModel.checkOnline,
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=rejectJob.json',
                    data: JSON.stringify({
                        "token": localStorage.getItem("token"),
                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                        "jobIds": [that.get("selectItem.jobId")],
                        "rejectReason": rejectremark,
                        "version": "2"
                    }),
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        that.hideLoading();
                        if (response.status == "TRUE") {
                            ////console.log("Reject job : Save complete!");
                            navigator.notification.alert(that.get("selectItem.jobId"),
                                function() {
                                    that.set("rejectremark", "");
                                    if (that.get("rejectReturnUrl") == "#Multi") {
                                        app.application.navigate(
                                            '#Multi' //or whichever transition you like
                                        );
                                    } else {
                                        app.application.navigate(
                                            '#tabstrip-assign' //or whichever transition you like
                                        );

                                        //JSON.parse(localStorage.getItem("profileData")).userIdapp.jobService.viewModel.loadassignlist();
                                    }
                                }, "Reject job : Save complete!", 'OK');

                            return true;
                        } else {
                            navigator.notification.alert(response.msg,
                                function() {}, "Reject job : Save incomplete!", 'OK');

                            return false;
                        }
                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Reject : Save incomplete!");
                            ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                            navigator.notification.alert(error,
                                function() {}, "Reject job : Save incomplete!", 'OK');
                        }
                        return false;
                    },
                    complete: function() {

                    }
                });

            }

        },
        exeRejectSingle: function() {
            ////console.log("Reject Job");
            var that = app.jobService.viewModel;

            var rejectremark = that.get("rejectremark");
            if (rejectremark == null || rejectremark == null || rejectremark == "") {
                ////console.log("Reject : Remark require!");
                navigator.notification.alert("Remark require!",
                    function() {}, "Reject", 'OK');
                return false;
            } else {
                that.showLoading();
                ////console.log("Reject Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + that.get("selectItem.jobId") + ", rejectremark : " + rejectremark);
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    beforeSend: app.loginService.viewModel.checkOnline,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=rejectJob.json',
                    data: JSON.stringify({
                        "token": localStorage.getItem("token"),
                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                        "jobIds": [that.get("selectItem.jobId")],
                        "rejectReason": rejectremark,
                        "version": "2"
                    }),
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        that.hideLoading();
                        if (response.status == "TRUE") {
                            that.set("rejectremark", "");
                            ////console.log("Reject job single: Save complete!");
                            navigator.notification.alert(that.get("selectItem.jobId"),
                                function() {

                                    app.application.navigate(
                                        '#Multi' //or whichever transition you like
                                    );
                                }, "Reject job : Save complete!", 'OK');

                            return true;
                        } else {
                            navigator.notification.alert(response.msg,
                                function() {}, "Reject job single: Save incomplete!", 'OK');

                            return false;
                        }
                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Reject : Save incomplete! ");
                            ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                            navigator.notification.alert(error,
                                function() {}, "Reject job single: Save incomplete!", 'OK');
                        }
                        return false;
                    }
                });

            }

        },
        exeRejectMulti: function() {
            //console.log("#### exeRejectMulti #####");
            var that = app.jobService.viewModel;

            var selected = app.multiService.viewModel.get("selected");

            var rejectremark = that.get("rejectremark");
            if (rejectremark == null || rejectremark == null || rejectremark == "") {
                ////console.log("Reject : Remark require!");
                navigator.notification.alert("Remark require!",
                    function() {}, "Reject", 'OK');
                return false;
            } else {
                that.showLoading();

                //////console.log(JSON.stringify({
                //      "token": localStorage.getItem("token"),
                //      "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                //      "jobIds": selected,
                //      "rejectReason": rejectremark,
                //      "version": "2"
                //  }));
                ////console.log("Reject Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + selected + ", rejectremark : " + rejectremark);
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    beforeSend: app.loginService.viewModel.checkOnline,
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=rejectJob.json',
                    data: JSON.stringify({
                        "token": localStorage.getItem("token"),
                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                        "jobIds": selected,
                        "rejectReason": rejectremark,
                        "version": "2"
                    }),
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        that.hideLoading();
                        //console.log("#### response.status #####>:"+response.status);
                        if (response.status == "TRUE") {
                            //that.set("rejectremark", "");
                            app.multiService.viewModel.set("rejectremark", "");
                            app.multiService.viewModel.set("selected", []);
                            ////console.log("Reject job multi : Save complete!");
                            navigator.notification.alert(selected.join(','),
                                function() {
                                    app.application.navigate(
                                        '#TT' //or whichever transition you like
                                    );
                                }, "Reject job multi : Save complete!", 'OK');

                            return true;
                        } else {
                            navigator.notification.alert(response.msg,
                                function() {}, "Reject job multi : Save incomplete!", 'OK');

                            return false;
                        }
                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Reject : Save incomplete! ");
                            ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                            navigator.notification.alert(error,
                                function() {}, "Reject job multi : Save incomplete!", 'OK');
                        }
                        return false;
                    }
                });

            }

        },
        acceptJob: function(e) {
            var that = app.jobService.viewModel;

            if (e.context != undefined && e.context != null) {
                ////console.log("gotoAccept context: " + e.context);
                var JBs = app.jobService.viewModel.get("jobDataSource");
                //////console.log(JSON.stringify(JBs));
                JBs.filter({
                    field: "jobId",
                    operator: "eq",
                    value: e.context,
                });
                JBs.fetch(function() {
                    var view = JBs.view();

                    var selectItem = view[0];


                    if (selectItem != undefined && selectItem != null) {

                        that.set("selectItem", selectItem);

                        that.exeAcceptJob(e)
                    }
                });
            }

        },
        exeAcceptJob: function(e) {
            var that = app.jobService.viewModel;
            app.jobService.viewModel.showLoading();
            var selectItem = that.get("selectItem");
            ////console.log("Accept selectItem :" + JSON.stringify(selectItem));

            ////console.log("Accept Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + selectItem.jobId);
            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                beforeSend: app.loginService.viewModel.checkOnline,
                type: "POST",
                timeout: 180000,
                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=acceptJob.json',
                data: JSON.stringify({
                    "token": localStorage.getItem("token"),
                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                    "jobIds": [selectItem.jobId],
                    "version": "2"
                }),
                dataType: "json",
                async: false,
                contentType: 'application/json',
                success: function(response) {
                    that.hideLoading();
                    var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                    if (response.status == "TRUE") {
                        ////console.log("Accept job : Save complete!");

                        navigator.notification.alert(selectItem.jobId,
                            function() {

                            }, "Accept job : Save complete!", 'OK');

                    } else {
                        ////console.log("Accept job : Save incomplete!" + response.msg);
                        navigator.notification.alert(response.msg,
                            function() {}, "Accept Job : Save incomplete!", 'OK');
                        //return false;
                    }
                },
                error: function(xhr, error) {
                    that.hideLoading();
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        ////console.log("Accept : Save incomplete! ");
                        ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                        navigator.notification.alert(error,
                            function() {}, "Reject Save incomplete!", 'OK');
                    }
                    //return false;
                },
                complete: function() {
                    var assignActionSheet = $("#assignActionSheet").data("kendoMobileActionSheet");
                    if (assignActionSheet != undefined && assignActionSheet != null) {
                        $("#assignActionSheet").data("kendoMobileActionSheet").close();
                    }

                    app.application.navigate(
                        '#tabstrip-assign' //or whichever transition you like
                    );

                    var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");

                    app.jobService.viewModel.loadassignlist();

                    ////console.log("load inbox");


                    app.jobService.viewModel.filterassign(btnGroup.current().index());
                }
            });
            //}, 0);
        },

        exeAcceptJobSingle: function(e) {
            //setTimeout(function () {
            var that = app.jobService.viewModel;
            app.jobService.viewModel.showLoading();
            var selectItem = that.get("selectItem");
            ////console.log("Accept selectItem :" + JSON.stringify(selectItem));

            //that.set("selectItem", selectItem);

            ////console.log("Accept Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + selectItem.jobId);
            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                beforeSend: app.loginService.viewModel.checkOnline,
                type: "POST",
                timeout: 180000,
                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=acceptJob.json',
                data: JSON.stringify({
                    "token": localStorage.getItem("token"),
                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                    "jobIds": [selectItem.jobId],
                    "version": "2"
                }),
                dataType: "json",
                async: false,
                contentType: 'application/json',
                success: function(response) {
                    that.hideLoading();
                    var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                    if (response.status == "TRUE") {
                        ////console.log("Accept job : Save complete!");
                        $("#MultiAssignActions").data("kendoMobileActionSheet").close();
                        //setTimeout(function() {

                        //  ////console.log("Accept job : Refresh!");
                        //}, 0);

                        ////console.log("alert result");

                        navigator.notification.alert(selectItem.jobId,
                            function() {
                                $("#lvMultiList").data("kendoMobileListView").dataSource.read();
                                $("#lvMultiList").data("kendoMobileListView").refresh();
                                $("#lvSingleList").data("kendoMobileListView").dataSource.read();
                                $("#lvSingleList").data("kendoMobileListView").refresh();
                            }, "Accept job : Save complete!", 'OK');

                        //that.showLoading();
                        //$("#listView").data("kendoMobileListView").refresh()

                    } else {
                        ////console.log("Accept job : Save incomplete!" + response.msg);
                        $("#MultiAssignActions").data("kendoMobileActionSheet").close();
                        navigator.notification.alert(response.msg,
                            function() {}, "Accept Job : Save incomplete!", 'OK');
                        //return false;
                    }
                },
                error: function(xhr, error) {
                    that.hideLoading();
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        ////console.log("Accept : Save incomplete! ");
                        ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                        navigator.notification.alert(error,
                            function() {}, "Reject Save incomplete!", 'OK');
                    }
                    //return false;
                },
                complete: function() {

                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                    //$("#lvMultiList").data("kendoMobileListView").refresh();
                    //$("#lvSingleList").data("kendoMobileListView").refresh();


                }
            });
            //}, 0);
        },
        exeAcceptJobMulti: function(e) {
            //setTimeout(function () {
            var that = app.multiService.viewModel;
            app.jobService.viewModel.showLoading();
            var selectList = that.get("selected");

            ////console.log("Accept Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + selectList);
            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                beforeSend: app.loginService.viewModel.checkOnline,
                type: "POST",
                timeout: 180000,
                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=acceptJob.json',
                data: JSON.stringify({
                    "token": localStorage.getItem("token"),
                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                    "jobIds": selectList,
                    "version": "2"
                }),
                dataType: "json",
                async: false,
                contentType: 'application/json',
                success: function(response) {
                    app.jobService.viewModel.hideLoading();
                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                    if (response.status == "TRUE") {
                        ////console.log("Accept job : Save complete!");

                        navigator.notification.alert(selectList.join(),
                            function() {
                                $("#MultiAssignActions").data("kendoMobileActionSheet").close();
                                app.multiService.viewModel.set("selected", []);
                                app.multiService.viewModel.loadMultiDetail();
                                //var mlistView = $("#lvMultiList").data("kendoMobileListView");
                                //var slistView = $("#lvSingleList").data("kendoMobileListView");
                                //mlistView.dataSource.read();
                                //mlistView.refresh();
                                //slistView.dataSource.read();
                                //slistView.refresh();

                            }, "Accept job : Save complete!", 'OK');

                    } else {
                        ////console.log("Accept job : Save incomplete!" + response.msg);
                        navigator.notification.alert(response.msg,
                            function() {}, "Accept Job : Save incomplete!", 'OK');
                        //return false;
                    }
                },
                error: function(xhr, error) {
                    app.jobService.viewModel.hideLoading();
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        ////console.log("Reject : Save incomplete! ");
                        ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                        navigator.notification.alert(error,
                            function() {}, "Accept Save incomplete!", 'OK');
                    }
                    //return false;
                }
            });
            //}, 0);
        },
        initJobNoDetail: function(e) {

            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {
                var that = app.jobService.viewModel;
                var jobId = e.context;

                var allItemList = [];
                var itemList = app.changeStatusService.createItem(jobId, "03");

                allItemList.push(itemList);

                var dataValue = {};
                dataValue.token = localStorage.getItem("token");
                dataValue.version = '2';
                dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                dataValue.allItemList = allItemList;
                that.set("returnUrl", "#tabstrip-accept");
                that.exeChangeStatusJob(dataValue);
            } else {
                navigator.notification.alert("offline \n You can report job only",
                    function() {}, "Internet Connection", 'OK');
            }

        },
        onSiteJobNoDetail: function(e) {
            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {
                var that = app.jobService.viewModel;
                var jobId = e.context;

                var allItemList = [];
                var itemList = app.changeStatusService.createItem(jobId, "04");

                allItemList.push(itemList);

                var dataValue = {};
                dataValue.token = localStorage.getItem("token");
                dataValue.version = '2';
                dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                dataValue.allItemList = allItemList;
                that.set("returnUrl", "#tabstrip-accept");
                that.exeChangeStatusJob(dataValue);
            } else {
                navigator.notification.alert("offline \n You can report job only",
                    function() {}, "Internet Connection", 'OK');
            }
        },
        exeInitJobSingle: function(e) {
            var that = app.jobService.viewModel;
            var jobId = e.context;

            var allItemList = [];
            var itemList = app.changeStatusService.createItemMulti(jobId, "03");

            allItemList.push(itemList);

            var dataValue = {};
            dataValue.token = localStorage.getItem("token");
            dataValue.version = '2';
            dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
            dataValue.allItemList = allItemList;
            that.set("returnUrl", "#Multi");
            that.exeChangeStatusJob(dataValue);
        },
        exeOnsiteJobSingle: function(e) {
            var that = app.jobService.viewModel;
            var jobId = e.context;
            var allItemList = [];
            var itemList = app.changeStatusService.createItemMulti(jobId, "04");

            allItemList.push(itemList);

            var dataValue = {};
            dataValue.token = localStorage.getItem("token");
            dataValue.version = '2';
            dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
            dataValue.allItemList = allItemList;
            that.set("returnUrl", "#Multi");
            that.exeChangeStatusJob(dataValue);

        },
        isSave: function() {
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            if (selectItem && selectItem.assignTo && selectItem.assignTo == JSON.parse(localStorage.getItem("profileData")).userId) {
                return true;
            } else {
                return false;
            }
        },

        changeStatus: function() {

            console.log("########### changeStatus ######## ");
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            var jobId = selectItem.jobId;
            var selectedStatus = that.get("selectedStatus");
            var flag = "true"
            that.set("oStatus", null);

            var isOffline = app.loginService.viewModel.get("isOffline");
            if (isOffline && selectedStatus != "05") {
                navigator.notification.alert("offline \n You can report job only",
                    function() {}, "Internet Connection", 'OK');

            } else {
                if (selectItem.aamShow == "Y") {

                    if (selectItem.statusId == "05") {

                        navigator.notification.confirm("Do you want to continue?",
                            function(i) {
                                if (i == 1) {
                                    if (app.changeStatusService.checkReq(selectedStatus)) {

                                        var allItemList = [];
                                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                                        allItemList.push(itemList);

                                        var dataValue = {};
                                        dataValue.token = localStorage.getItem("token");
                                        dataValue.version = '2';
                                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                                        dataValue.allItemList = allItemList;


                                        that.set("returnUrl", "#tabstrip-accept");


                                        that.exeChangeStatusJob(dataValue);
                                    }
                                }
                            }, "This job will be changed to Wait for report \n because there is no Move Equipment Document");

                    } else if (selectedStatus == "05") {



                        navigator.notification.confirm("Do you want to continue ?",
                            function(i) {
                                if (i == 1) {
                                    if (app.changeStatusService.checkReq(selectedStatus)) {

                                        var allItemList = [];
                                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                                        allItemList.push(itemList);

                                        var dataValue = {};
                                        dataValue.token = localStorage.getItem("token");
                                        dataValue.version = '2';
                                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                                        dataValue.allItemList = allItemList;


                                        that.set("returnUrl", "#tabstrip-accept");


                                        that.exeChangeStatusJob(dataValue);
                                    } else {
                                        //navigator.notification.alert("Please select problem solve.",
                                        //  function() {}, "Change Status Job : Save incomplete!", 'OK');
                                    }
                                } else {
                                    app.jobService.viewModel.hideLoading();
                                }
                            }, "This job will be changed to Wait for report \n because there is no Move Equipment Document");




                    } else {

                        if (app.changeStatusService.checkReq(selectedStatus)) {


                            var allItemList = [];
                            var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                            allItemList.push(itemList);

                            var dataValue = {};
                            dataValue.token = localStorage.getItem("token");
                            dataValue.version = '2';
                            dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                            dataValue.allItemList = allItemList;


                            that.set("returnUrl", "#tabstrip-accept");

                            console.log('exeChangeStatusJob');
                            that.exeChangeStatusJob(dataValue);
                        } else {
                            //navigator.notification.alert("Please select problem solve.",
                            //  function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }
                    }

                } else {

                    if (app.changeStatusService.checkReq(selectedStatus)) {

                        var allItemList = [];
                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                        allItemList.push(itemList);

                        var dataValue = {};
                        dataValue.token = localStorage.getItem("token");
                        dataValue.version = '2';
                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                        dataValue.allItemList = allItemList;


                        that.set("returnUrl", "#tabstrip-accept");

                        console.log("update status");
                        that.exeChangeStatusJob(dataValue);
                    } else {
                        navigator.notification.alert("Please select problem solve.",
                            function() {}, "Change Status Job : Save incomplete!", 'OK');
                        //alert("Please select problem solve.");
                    }
                }

                var selectNewSite = app.siteAccessService.viewModel.get("selectNewSite");
                var mnimssiteIds = [];
                var isMnimssiteIdExist = false;
                if (selectNewSite != null && selectNewSite != undefined) {
                    selectNewSite.fetch(function() {
                        var data = selectNewSite.data();
                        for (var i = 0; i < data.length; i++) {
                            mnimssiteIds.push(data[i].siteId);
                            isMnimssiteIdExist = true;
                        }
                        if (isMnimssiteIdExist) {
                            app.siteAccessService.viewModel.createSiteAccess(mnimssiteIds);
                        }
                    })
                }
            }
        },
        changeStatusMore: function() {
            //console.log("########### changeStatus ######## ");
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            var jobId = selectItem.jobId;
            var selectedStatus = that.get("selectedStatus");
            var flag = "true"
            if (that.get("oStatus") != null && that.get("oStatus") != "OK") {

            } else {
                that.set("oStatus", "OK");
            }
            var isOffline = app.loginService.viewModel.get("isOffline");
            if (isOffline && selectedStatus != "05") {
                navigator.notification.alert("offline \n You can report job only",
                    function() {}, "Internet Connection", 'OK');

            } else {
                if (selectItem.aamShow == "Y") {

                    if (selectItem.statusId == "05") {

                        navigator.notification.confirm("Do you want to continue?",
                            function(i) {
                                if (i == 1) {
                                    if (app.changeStatusService.checkReq(selectedStatus)) {

                                        var allItemList = [];
                                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                                        allItemList.push(itemList);

                                        var dataValue = {};
                                        dataValue.token = localStorage.getItem("token");
                                        dataValue.version = '2';
                                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                                        dataValue.allItemList = allItemList;


                                        that.set("returnUrl", "#tabstrip-accept");


                                        that.exeChangeStatusJobMore(dataValue);
                                    }
                                }
                            }, "This job will be changed to Wait for report \n because there is no Move Equipment Document");

                    } else if (selectedStatus == "05") {
                        navigator.notification.confirm("Do you want to continue ?",
                            function(i) {
                                if (i == 1) {
                                    if (app.changeStatusService.checkReq(selectedStatus)) {

                                        var allItemList = [];
                                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                                        allItemList.push(itemList);

                                        var dataValue = {};
                                        dataValue.token = localStorage.getItem("token");
                                        dataValue.version = '2';
                                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                                        dataValue.allItemList = allItemList;


                                        that.set("returnUrl", "#tabstrip-accept");


                                        that.exeChangeStatusJobMore(dataValue);
                                    } else {
                                        //navigator.notification.alert("Please select problem solve.",
                                        //  function() {}, "Change Status Job : Save incomplete!", 'OK');
                                    }
                                } else {
                                    app.jobService.viewModel.hideLoading();
                                }
                            }, "This job will be changed to Wait for report \n because there is no Move Equipment Document");
                    } else {

                        if (app.changeStatusService.checkReq(selectedStatus)) {
                            var allItemList = [];
                            var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                            allItemList.push(itemList);

                            var dataValue = {};
                            dataValue.token = localStorage.getItem("token");
                            dataValue.version = '2';
                            dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                            dataValue.allItemList = allItemList;
                            that.set("returnUrl", "#tabstrip-accept");
                            console.log('exeChangeStatusJob');
                            that.exeChangeStatusJobMore(dataValue);
                        } else {
                            //navigator.notification.alert("Please select problem solve.",
                            //  function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }
                    }

                } else {
                    if (app.changeStatusService.checkReq(selectedStatus)) {

                        var allItemList = [];
                        var itemList = app.changeStatusService.createItem(jobId, selectedStatus);

                        allItemList.push(itemList);

                        var dataValue = {};
                        dataValue.token = localStorage.getItem("token");
                        dataValue.version = '2';
                        dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                        dataValue.allItemList = allItemList;

                        //jigkoh comment enhance submit more re-load in this page
                        //that.set("returnUrl", "#tabstrip-accept");

                        console.log("update status");
                        that.exeChangeStatusJobMore(dataValue);
                    } else {
                        //navigator.notification.alert("Please select problem solve.",
                        //  function() {}, "Change Status Job : Save incomplete!", 'OK');
                    }
                }

                var selectNewSite = app.siteAccessService.viewModel.get("selectNewSite");
                var mnimssiteIds = [];
                var isMnimssiteIdExist = false;
                if (selectNewSite != null && selectNewSite != undefined) {
                    selectNewSite.fetch(function() {
                        var data = selectNewSite.data();
                        for (var i = 0; i < data.length; i++) {
                            mnimssiteIds.push(data[i].siteId);
                            isMnimssiteIdExist = true;
                        }
                        if (isMnimssiteIdExist) {
                            app.siteAccessService.viewModel.createSiteAccess(mnimssiteIds);
                        }
                    })
                }
            }
        },
        exeChangeStatusJob: function(dataValue) {
            //console.log("########### exeChangeStatusJob ######## ");

            //setTimeout(function () {
            var that = app.jobService.viewModel;

            var selectItem = that.get("selectItem");

            //var networkState = navigator.connection.type;
            var isOffline = app.loginService.viewModel.get("isOffline");

            that.showLoading();



            if (!isOffline) {

                // $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                //     type: "POST",
                //     timeout: 180000,
                //     url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=createJBRemarkOverDue.json',
                //     data: JSON.stringify({
                //         token: localStorage.getItem("token"),
                //         jobId: selectItem.jobId,
                //         remarkOverDue: selectItem.remarkOverDue,
                //         version: "2"
                //     }),
                //     dataType: "json",
                //     //async: false,
                //     contentType: 'application/json',
                //     success: function(response) {

                //         //console.log("#### datavalue : " + JSON.stringify(dataValue));
                //         $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                //             type: "POST",
                //             timeout: 180000,
                //             url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=changeStatusJob.json',
                //             data: JSON.stringify(dataValue),
                //             dataType: "json",
                //             //async: false,
                //             contentType: 'application/json',
                //             success: function(response) {
                //                 //alert('SUCCESS:' + response.status);
                //                 that.hideLoading();

                //                 if (response.status == "TRUE") {
                //                     var returnUrl = that.get("returnUrl");

                //                     if (returnUrl == "#tabstrip-accept") {
                //                         ////console.log("start upload");

                //                         if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                //                             app.jobService.viewModel.uploadPhoto(dataValue.allItemList[0].jbList[0].jobId);
                //                         }

                //                         navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                //                             function() {
                //                                 if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                //                                     app.jobService.viewModel.deleteFolder(dataValue.allItemList[0].jbList[0].jobId);
                //                                 }
                //                                 //app.jobService.viewModel.set("selectItem",null);

                //                                 app.application.navigate(
                //                                     '#tabstrip-accept'
                //                                 );
                //                                 app.jobService.viewModel.loadacceptlist();

                //                                 ////console.log("load inbox");

                //                                 var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                //                                 app.jobService.viewModel.filteraccept(btnGroup.current().index());
                //                             }, "Change Status Job : Save complete!", 'OK');
                //                     } else if (returnUrl == "#Multi") {
                //                         navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                //                             function() {
                //                                 app.application.navigate('#Multi');
                //                                 app.multiService.viewModel.set("selected", []);
                //                                 app.multiService.viewModel.loadMultiDetail();
                //                             }, "Change Status Job : Save complete!", 'OK');

                //                     } else {

                //                         //app.jobService.viewModel.loadacceptlist();
                //                         navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                //                             function() {
                //                                 var AcceptActions = $("#AcceptActions").data("kendoMobileActionSheet");
                //                                 var InitialActions = $("#InitialActions").data("kendoMobileActionSheet");
                //                                 var OnsiteActions = $("#OnsiteActions").data("kendoMobileActionSheet");
                //                                 var ReportActions = $("#ReportActions").data("kendoMobileActionSheet");

                //                                 AcceptActions.close();
                //                                 InitialActions.close();
                //                                 OnsiteActions.close();
                //                                 ReportActions.close();
                //                                 app.jobService.viewModel.loadacceptlist();
                //                                 app.jobService.viewModel.filteraccept(btnGroup.current().index());
                //                             }, "Change Status Job : Save complete!", 'OK');
                //                         ////console.log("load inbox");

                //                         //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");

                //                     }


                //                 } else {
                //                     navigator.notification.alert(response.msg,
                //                         function() {}, "Change Status Job : Save incomplete!", 'OK');
                //                 }

                //             },
                //             error: function(xhr, error) {
                //                 that.hideLoading();
                //                 if (!app.ajaxHandlerService.error(xhr, error)) {
                //                     navigator.notification.alert(error,
                //                         function() {}, "Change Status Job : Save incomplete!", 'OK');
                //                 }
                //                 ////console.log(JSON.stringify(xhr));
                //             },
                //             complete: function() {}
                //         });
                //     },
                //     error: function(xhr, error) {
                //         that.hideLoading();
                //         if (!app.ajaxHandlerService.error(xhr, error)) {
                //             navigator.notification.alert(error,
                //                 function() {}, "Change Status Job : Save incomplete!", 'OK');
                //         }
                //         ////console.log(JSON.stringify(xhr));
                //     },
                //     complete: function() {}
                // });

                //jigkoh3 add remarkOverDue in changeStatus service 19/11/2015 
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=changeStatusJob.json',
                    data: JSON.stringify(dataValue),
                    dataType: "json",
                    //async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        //alert('SUCCESS:' + response.status);
                        that.hideLoading();
                        that.set("oStatus", null);
                        // alert(that.get("selectedStatus"));
                        // var changeStatusId = that.get("selectItem");
                        // changeStatusId.statusId = that.get("selectedStatus");

                        if (response.status == "TRUE") {
                            var returnUrl = that.get("returnUrl");

                            if (returnUrl == "#tabstrip-accept") {
                                ////console.log("start upload");

                                if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                                    app.jobService.viewModel.uploadPhoto(dataValue.allItemList[0].jbList[0].jobId);
                                }

                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                    function() {
                                        if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                                            app.jobService.viewModel.deleteFolder(dataValue.allItemList[0].jbList[0].jobId);
                                        }
                                        //app.jobService.viewModel.set("selectItem",null);

                                        app.application.navigate(
                                            '#tabstrip-accept'
                                        );
                                        app.jobService.viewModel.loadacceptlist();

                                        ////console.log("load inbox");

                                        var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                        app.jobService.viewModel.filteraccept(btnGroup.current().index());
                                    }, "Change Status Job : Save complete!", 'OK');
                            } else if (returnUrl == "#Multi") {
                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                    function() {
                                        app.application.navigate('#Multi');
                                        app.multiService.viewModel.set("selected", []);
                                        app.multiService.viewModel.loadMultiDetail();
                                    }, "Change Status Job : Save complete!", 'OK');

                            } else {

                                //app.jobService.viewModel.loadacceptlist();
                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                    function() {
                                        var AcceptActions = $("#AcceptActions").data("kendoMobileActionSheet");
                                        var InitialActions = $("#InitialActions").data("kendoMobileActionSheet");
                                        var OnsiteActions = $("#OnsiteActions").data("kendoMobileActionSheet");
                                        var ReportActions = $("#ReportActions").data("kendoMobileActionSheet");

                                        AcceptActions.close();
                                        InitialActions.close();
                                        OnsiteActions.close();
                                        ReportActions.close();
                                        app.jobService.viewModel.loadacceptlist();
                                        app.jobService.viewModel.filteraccept(btnGroup.current().index());
                                    }, "Change Status Job : Save complete!", 'OK');
                                ////console.log("load inbox");

                                //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");

                            }


                        } else {
                            navigator.notification.alert(response.msg,
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }


                        // alert(that.get("selectedStatus"));
                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            navigator.notification.alert(error,
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }
                        ////console.log(JSON.stringify(xhr));
                    },
                    complete: function() {}
                });

            } else {
                console.log('alert offline');
                navigator.notification.confirm("Do you want to continue(offline)?",
                    function(i) {
                        if (i == 1) {


                            var allItemList = [];
                            var itemList = app.changeStatusService.createItem(selectItem.jobId, "05");

                            allItemList.push(itemList);
                            console.log("set item offline");
                            //var dataValue = {};
                            //dataValue.token = localStorage.getItem("token");
                            //dataValue.version = '2';
                            //dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                            //dataValue.allItemList = allItemList;
                            var offline = [];
                            if (localStorage.getItem("offline") != undefined && localStorage.getItem("offline") != null) {
                                offline = JSON.parse(localStorage.getItem("offline"));
                            }

                            var jbObj = JSON.parse(localStorage.getItem("jbData"));


                            var jbData = new kendo.data.DataSource({
                                data: JSON.parse(localStorage.getItem("jbData")),
                                schema: {
                                    data: "jobs",
                                    model: {
                                        id: "jobId"
                                    }
                                }
                            });





                            jbData.fetch(function() {


                                jbData.pushDestroy(selectItem);


                                //console.log(selectItem);

                                jbObj.jobs = jbData.data();

                                localStorage.setItem("jbData", JSON.stringify(jbObj));

                                if (offline == undefined || offline == null) {
                                    offline = [];
                                }

                                offline.push(allItemList[0]);
                                console.log("set item to local storage");
                                localStorage.setItem("offline", JSON.stringify(offline));
                                //app.jobService.viewModel.set("selectItem",null);
                                //app.jobService.viewModel.onOnline();
                                that.set("returnUrl", "#tabstrip-accept");

                                navigator.notification.alert('',
                                    function() {}, "Save Job Offline: Save complete!", 'OK');

                                app.application.navigate(
                                    '#tabstrip-accept'
                                );
                                //app.jobService.viewModel.loadacceptlist();

                                ////console.log("load inbox");
                            });


                            //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                            //app.jobService.viewModel.filteraccept(btnGroup.current().index());



                        }
                    }, "No internet connection");

            }
            //}, 0);
        },

        exeChangeStatusJobMore: function(dataValue) {
            //console.log("########### exeChangeStatusJob ######## ");

            //setTimeout(function () {
            var that = app.jobService.viewModel;

            var selectItem = that.get("selectItem");

            //var networkState = navigator.connection.type;
            var isOffline = app.loginService.viewModel.get("isOffline");

            that.showLoading();



            if (!isOffline) {
                // console.log("#### datavalue : " + JSON.stringify(dataValue));
                //jigkoh3 add remarkOverDue in changeStatus service 19/11/2015 
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=changeStatusJob.json',
                    data: JSON.stringify(dataValue),
                    dataType: "json",
                    //async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        //alert('SUCCESS:' + response.status);
                        that.hideLoading();

                        // var changeStatusId = that.get("selectItem");
                        // changeStatusId.statusId = that.get("selectedStatus");
                        if (response.status == "TRUE") {
                            var returnUrl = that.get("returnUrl");

                            if (returnUrl == "#tabstrip-accept" || returnUrl =='#powerService') {
                                ////console.log("start upload");

                                if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                                    app.jobService.viewModel.uploadPhoto(dataValue.allItemList[0].jbList[0].jobId);
                                }

                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                    function() {
                                if (dataValue.allItemList[0].jbList[0].newStatus == "05") {
                                    app.jobService.viewModel.deleteFolder(dataValue.allItemList[0].jbList[0].jobId);
                                }
                                //app.jobService.viewModel.set("selectItem",null);


                                app.jobService.viewModel.loadacceptlist();

                                ////console.log("load inbox");

                                var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                app.jobService.viewModel.filteraccept(btnGroup.current().index());
                                //tabstrip-edit
                                // app.application.navigate('#tabstrip-edit');
                                //jigkoh3 
                                //selectItem.status = "On-Site";
                                selectItem.statusId = dataValue.allItemList[0].jbList[0].newStatus;
                                that.set("selectItem", selectItem);



                                kendo.bind($(".act-bind"), app.jobService.viewModel);
                                if (selectItem.statusId == '02') {
                                    var djbstatusAssign = $("#djbstatusAssign").data("kendoDropDownList");
                                    djbstatusAssign.select(0);
                                } else if (selectItem.statusId == '03') {
                                    var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                                    djbstatusInit.select(0);
                                } else if (selectItem.statusId == '04') {
                                    var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                                    djbstatusOnsite.select(1);
                                } else {
                                    var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                                    djbstatusReport.select(0);
                                }

                                // console.log(document.getElementById('djbstatusAssign').value);
                                // console.log(document.getElementById('djbstatusInit').value);
                                console.log(document.getElementById('djbstatusOnsite').value);
                                // console.log(document.getElementById('djbstatusReport').value);
                                // document.getElementById('djbstatusAssign').style.display = "none";
                                // document.getElementById('djbstatusInit').style.display = "none";
                                // document.getElementById('djbstatusOnsite').style.display = "none";
                                // document.getElementById('djbstatusReport').style.display = "none";
                                // $('#djbstatusAssign').hide();
                                // $('#djbstatusInit').hide();
                                // $('#djbstatusOnsite').hide();
                                // $('#djbstatusReport').hide();
                                // if(selectItem.statusId == '02'){
                                //     document.getElementById('djbstatusAssign').style.visibility = "visible";
                                // }else if(selectItem.statusId == '03'){
                                //     document.getElementById('djbstatusInit').style.visibility = "visible";
                                // }else if(selectItem.statusId == '04'){
                                //     document.getElementById('djbstatusOnsite').style.visibility = "visible";
                                // }else{
                                //     document.getElementById('djbstatusReport').style.visibility = "visible";
                                // }     
                                }, "Change Status Job : Save complete!", 'OK');
                            } else if (returnUrl == "#Multi") {
                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                    function() {
                                        // app.application.navigate('#Multi');
                                        // app.multiService.viewModel.set("selected", []);
                                        // app.multiService.viewModel.loadMultiDetail();
                                    }, "Change Status Job : Save complete!", 'OK');

                            } else {

                                //app.jobService.viewModel.loadacceptlist();
                                navigator.notification.alert(dataValue.allItemList[0].jbList[0].jobId,
                                function() {
                                var AcceptActions = $("#AcceptActions").data("kendoMobileActionSheet");
                                var InitialActions = $("#InitialActions").data("kendoMobileActionSheet");
                                var OnsiteActions = $("#OnsiteActions").data("kendoMobileActionSheet");
                                var ReportActions = $("#ReportActions").data("kendoMobileActionSheet");

                                AcceptActions.close();
                                InitialActions.close();
                                OnsiteActions.close();
                                ReportActions.close();
                                app.jobService.viewModel.loadacceptlist();
                                var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                console.log(btnGroup);
                                if (btnGroup) {
                                    app.jobService.viewModel.filteraccept(btnGroup.current().index());
                                }


                                }, "Change Status Job : Save complete!", 'OK');
                                ////console.log("load inbox");

                                //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");

                            }
                            //that.reloadChangeMore();

                        } else {
                            navigator.notification.alert(response.msg,
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }

                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            navigator.notification.alert(error,
                                function() {}, "Change Status Job : Save incomplete!", 'OK');
                        }
                        ////console.log(JSON.stringify(xhr));
                    },
                    complete: function() {}
                });

            } else {
                console.log('alert offline');
                navigator.notification.confirm("Do you want to continue(offline)?",
                    function(i) {
                        if (i == 1) {


                            var allItemList = [];
                            var itemList = app.changeStatusService.createItem(selectItem.jobId, "05");

                            allItemList.push(itemList);
                            console.log("set item offline");
                            //var dataValue = {};
                            //dataValue.token = localStorage.getItem("token");
                            //dataValue.version = '2';
                            //dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                            //dataValue.allItemList = allItemList;
                            var offline = [];
                            if (localStorage.getItem("offline") != undefined && localStorage.getItem("offline") != null) {
                                offline = JSON.parse(localStorage.getItem("offline"));
                            }

                            var jbObj = JSON.parse(localStorage.getItem("jbData"));


                            var jbData = new kendo.data.DataSource({
                                data: JSON.parse(localStorage.getItem("jbData")),
                                schema: {
                                    data: "jobs",
                                    model: {
                                        id: "jobId"
                                    }
                                }
                            });





                            jbData.fetch(function() {


                                jbData.pushDestroy(selectItem);


                                //console.log(selectItem);

                                jbObj.jobs = jbData.data();

                                localStorage.setItem("jbData", JSON.stringify(jbObj));

                                if (offline == undefined || offline == null) {
                                    offline = [];
                                }

                                offline.push(allItemList[0]);
                                console.log("set item to local storage");
                                localStorage.setItem("offline", JSON.stringify(offline));
                                //app.jobService.viewModel.set("selectItem",null);
                                //app.jobService.viewModel.onOnline();
                                that.set("returnUrl", "#tabstrip-accept");

                                navigator.notification.alert('',
                                    function() {}, "Save Job Offline: Save complete!", 'OK');

                                // app.application.navigate(
                                //     '#tabstrip-accept'
                                // );
                                //app.jobService.viewModel.loadacceptlist();

                                ////console.log("load inbox");
                            });


                            //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                            //app.jobService.viewModel.filteraccept(btnGroup.current().index());



                        }
                    }, "No internet connection");

            }
            //}, 0);
        },
        deleteFolder: function(jobId) {
            var fileSystem = null;
            if (gFileSystem != undefined && gFileSystem != null) {
                fileSystem = gFileSystem;
            }

            if (fileSystem.root != null && fileSystem.root != undefined) {
                ////console.log("delete file step 1");
                fileSystem.root.getDirectory("TTSM/" + jobId, {
                    create: false,
                }, function(entry) {
                    ////console.log("delete file step 2");
                    entry.removeRecursively(function() {
                        ////console.log("Remove Recursively Succeeded");
                    }, app.fileService.viewModel.onFileSystemError);
                }, app.fileService.viewModel.onFileSystemError);

            } else {
                ////console.log("fileSystem undefind");
            }
        },
        exeChangeStatusJobOffline: function(dataValue) {
            console.log("exeChangeStatusJobOffline");
            console.log(dataValue);
            dataValue.token = localStorage.getItem("token");
            dataValue.version = '2';
            dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

            var jobIds = [];

            var offline = JSON.parse(localStorage.getItem("offline"));
            if (offline != null && offline != undefined) {
                for (var i = 0, l = dataValue.allItemList.length; i < l; i++) {
                    //var item = offline[i];

                    //for (var j = 0, k = offline.length; j < k; j++) {
                    //  if (offline[i].jbList[0].jobId == dataValue.allItemList[j].jbList[0].jobId) {
                    //      ret.splice(1, i);
                    //  }
                    //}
                    jobIds.push(offline[i].jbList[0].jobId);
                }


                console.log(jobIds.join());

                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=changeStatusJob.json',
                    data: JSON.stringify(dataValue),
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    success: function(response) {
                        if (response.status == "TRUE") {
                            //dataValue.allItemList[0].jbList[0].jobId;


                            var ret = offline;
                            console.log('##upload photo offline##');
                            if (offline != null && offline != undefined) {
                                for (var i = 0, l = dataValue.allItemList.length; i < l; i++) {
                                    //var item = offline[i];

                                    //for (var j = 0, k = offline.length; j < k; j++) {
                                    //  if (offline[i].jbList[0].jobId == dataValue.allItemList[j].jbList[0].jobId) {
                                    //      ret.splice(1, i);
                                    //  }
                                    //}
                                    console.log('##start upload photo offline##');
                                    app.jobService.viewModel.uploadPhoto(offline[i].jbList[0].jobId);
                                }


                            }

                            console.log('##clear offline data true##');
                            localStorage.setItem("offline", null);
                            navigator.notification.alert(jobIds.join(),
                                function() {
                                    app.jobService.viewModel.loadacceptlist();
                                    //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                    app.jobService.viewModel.filteraccept(0);

                                }, "Sycn Job: Save complete!", 'OK');

                            ////console.log("load inbox");

                            app.jobService.viewModel.hideLoading();

                        } else {
                            console.log('##clear offline data false##');
                            localStorage.setItem("offline", null);
                            app.jobService.viewModel.hideLoading();
                            navigator.notification.alert(jobIds.join(),
                                function() {
                                    app.jobService.viewModel.loadacceptlist();
                                    //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                    app.jobService.viewModel.filteraccept(0);

                                }, "Sycn Job: Save incomplete!", 'OK');
                        }
                    },
                    error: function(xhr, error) {
                        //that.hideLoading();
                        console.log('##clear offline data error##');
                        localStorage.setItem("offline", null);
                        app.jobService.viewModel.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {


                            ////console.log("load inbox");


                            navigator.notification.alert(jobIds.join(),
                                function() {
                                    //var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
                                    app.jobService.viewModel.loadacceptlist();
                                    app.jobService.viewModel.filteraccept(0);
                                }, "Sycn Job: Save complete!", 'OK');
                        }
                    }
                });
            }

        },
        exeChangeStatusJobMulti: function(dataValue) {
            //console.log("#### exeChangeStatusJobMulti ####");
            var that = app.jobService.viewModel;

            ////console.log("Change Status selectItem :" + JSON.stringify(dataValue));
            that.showLoading();
            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                beforeSend: app.loginService.viewModel.checkOnline,
                type: "POST",
                timeout: 180000,
                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=changeStatusJob.json',
                data: JSON.stringify(dataValue),
                dataType: "json",
                //async: false,
                contentType: 'application/json',
                success: function(response) {
                    //alert('SUCCESS:' + response.status);


                    //console.log("### response.status >>:"+response.status);
                    if (response.status == "TRUE") {


                        var selected = app.multiService.viewModel.get("selected");
                        var returnUrl = app.jobService.viewModel.get("returnUrl");

                        //if (returnUrl != "#Multi") {



                        //var MultiAssignActions = $("#MultiAssignActions").data("kendoMobileActionSheet");
                        //var MultiAcceptActions = $("#MultiAcceptActions").data("kendoMobileActionSheet");
                        //var MultiInitialActions = $("#MultiInitialActions").data("kendoMobileActionSheet");
                        //var MultiOnsiteActions = $("#MultiOnsiteActions").data("kendoMobileActionSheet");
                        //var MultiReportActions = $("#MultiReportActions").data("kendoMobileActionSheet");


                        //if (MultiAssignActions != undefined && MultiAssignActions != null) {
                        //  MultiAssignActions.close();
                        //}

                        //if (MultiAcceptActions != undefined && MultiAcceptActions != null) {
                        //  MultiAcceptActions.close();
                        //}

                        //if (MultiInitialActions != undefined && MultiInitialActions != null) {
                        //  MultiInitialActions.close();
                        //}

                        //if (MultiOnsiteActions != undefined && MultiOnsiteActions != null) {
                        //  MultiOnsiteActions.close();
                        //}

                        //if (MultiReportActions != undefined && MultiReportActions != null) {
                        //  MultiReportActions.close();
                        //}





                        //app.multiService.viewModel.set("selected", []);
                        //app.multiService.viewModel.set("reportdetail", "");

                        //app.jobService.viewModel.filteraccept(btnGroup.current().index());

                        //$("#lvMultiList").data("kendoMobileListView").refresh();
                        //$("#lvSingleList").data("kendoMobileListView").refresh();
                        //}


                        //app.multiService.viewModel.loadMultilist();



                        //var mlistView = $("#lvMultiList").data("kendoMobileListView");
                        //var slistView = $("#lvSingleList").data("kendoMobileListView");
                        //mlistView.dataSource.read();
                        //mlistView.refresh();
                        //slistView.dataSource.read();
                        //slistView.refresh();
                        //}

                        app.multiService.viewModel.set("selected", []);
                        app.multiService.viewModel.set("reportdetail", "");

                        navigator.notification.alert(selected.join(),
                            function() {

                                //if (returnUrl == "#TT") {
                                that.hideLoading();
                                setTimeout(function() {
                                    app.application.navigate(
                                        "#TT"
                                    );
                                }, 0);

                                //}else{
                                //  that.hideLoading();
                                //  app.multiService.viewModel.loadMultiDetail();
                                //}
                            }, "Change Status Job : Save complete!", 'OK');






                    } else {
                        console.log("return error");
                        that.hideLoading();
                        navigator.notification.alert(response.msg,
                            function() {}, "Change Status Job : Save incomplete!", 'OK');
                    }

                },
                error: function(xhr, error) {
                    that.hideLoading();
                    console.log("ajax error");
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        navigator.notification.alert(error,
                            function() {}, "Change Status Job : Save incomplete!", 'OK');
                    }
                },
                complete: function() {

                }
            });
        },
        gotoAssignDetail: function(e) {
            //console.log("##### gotoAssignDetail ########");

            var that = app.jobService.viewModel;
            that.set("selectPage", "0");
            //////console.log("gotoDisplay : " + e.context);
            //setTimeout(function () {
            //that.set("selectId", e.selectId);
            JBs = that.get("jobDataSource");

            app.siteAccessService.viewModel.set("selectSite", null);
            app.siteAccessService.viewModel.set("selectNewSite", null);
            var assignActionSheet = $("#assignActionSheet").data("kendoMobileActionSheet");
            this.close();
            that.showLoading();

            var MultiAssignActions = $("#MultiAssignActions").data("kendoMobileActionSheet");
            var MultiAcceptActions = $("#MultiAcceptActions").data("kendoMobileActionSheet");
            var MultiInitialActions = $("#MultiInitialActions").data("kendoMobileActionSheet");
            var MultiOnsiteActions = $("#MultiOnsiteActions").data("kendoMobileActionSheet");
            var MultiReportActions = $("#MultiReportActions").data("kendoMobileActionSheet");

            if (assignActionSheet != undefined && assignActionSheet != null) {
                assignActionSheet.close();
                //assignActionSheet.destroy();
                //$("#assignActionSheet").html('<li><a data-action="app.jobService.viewModel.acceptJob">Accept</a></li><li><a data-action="app.jobService.viewModel.gotoReject">Reject</a></li><li><a data-action="app.jobService.viewModel.gotoAssignDetail">Go to detail</a></li>');

                //kendo.init($("#assignActionSheet"), kendo.mobile.ui);
                //$("#assignActionSheet").kendoMobileActionSheet();
            }




            if (MultiAssignActions != undefined && MultiAssignActions != null) {
                MultiAssignActions.close();
            }
            if (MultiAcceptActions != undefined && MultiAcceptActions != null) {
                MultiAcceptActions.close();
            }
            if (MultiInitialActions != undefined && MultiInitialActions != null) {
                MultiInitialActions.close();
            }
            if (MultiOnsiteActions != undefined && MultiOnsiteActions != null) {
                MultiOnsiteActions.close();
            }
            if (MultiReportActions != undefined && MultiReportActions != null) {
                MultiReportActions.close();
            }

            if (e.context != undefined && e.context != null) {
                if (JBs != null && JBs != undefined) {
                    JBs.filter({
                        field: "jobId",
                        operator: "eq",
                        value: e.context,
                    });
                }

                JBs.fetch(function() {
                    var view = JBs.view();

                    var selectItem = view[0];


                    if (selectItem != undefined && selectItem != null) {
                        that.set("selectItem", selectItem);
                        that.set("showType", "view");

                        var dataSourcePC = that.get("jobProblemCDataSource"),
                            dataSourcePCM = that.get("jobProblemCMDataSource"),
                            dataSourcePS = that.get("jobProblemSDataSource");
                        //dataSourcePSP = that.get("jobProblemSPDataSource");
                        if (dataSourcePC != null && dataSourcePC != undefined) {
                            dataSourcePC.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }
                        if (dataSourcePC != null && dataSourcePC != undefined) {
                            dataSourcePCM.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }
                        if (dataSourcePC != null && dataSourcePC != undefined) {
                            dataSourcePS.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }


                        //dataSourcePSP.filter({
                        //logic: "and",
                        //filters: [{
                        //field: "jobId",
                        //operator: "eq",
                        //value: selectItem.jobId
                        //}]

                        //});
                        if (dataSourcePC != null && dataSourcePC != undefined) {
                            dataSourcePC.fetch(function() {

                                var tempPC = new kendo.data.DataSource({
                                    data: dataSourcePC.view()
                                });

                                that.set("selectProblemC", tempPC);
                            });
                        }
                        if (dataSourcePCM != null && dataSourcePCM != undefined) {
                            dataSourcePCM.fetch(function() {

                                var tempPCM = new kendo.data.DataSource({
                                    data: dataSourcePCM.view()
                                });

                                that.set("selectProblemCM", tempPCM);
                            });
                        }
                        if (dataSourcePS != null && dataSourcePS != undefined) {
                            dataSourcePS.fetch(function() {

                                var tempPS = new kendo.data.DataSource({
                                    data: dataSourcePS.view()
                                });

                                that.set("selectProblemS", tempPS);
                            });
                        }


                        that.set("returnUrl", app.application.view().id);
                        //that.set("selectProblemSP", dataSourcePSP);


                        //////console.log("dataSourcePC : " + JSON.stringify(dataSourcePC));
                        //////console.log("dataSourcePCM : " + JSON.stringify(dataSourcePCM));
                        //////console.log("dataSourcePS : " + JSON.stringify(dataSourcePS));
                        //////console.log("dataSourceSP : " + JSON.stringify(dataSourcePSP));

                        ////console.log("gotodisplay");

                        app.application.navigate(
                            '#tabstrip-display'
                        );
                    }

                });

            }
            //prevent `swipe`
            //this.events.cancel();
            //e.event.stopPropagation();
            //e.preventDefault();


        },
        gotoReportDetail: function(e) {
            var that = app.jobService.viewModel;
            that.set("selectPage", "1");
            that.gotoAcceptDetail(e);
        },
        gotoDetail: function(e) {
            var that = app.jobService.viewModel;
            that.set("selectPage", "0");
            that.gotoAcceptDetail(e);
        },
        gotoAcceptDetail: function(e) {
            //console.log("##### gotoAcceptDetail ########");
            var that = app.jobService.viewModel;

            that.set("selectedStatus", "");
            ////console.log("gotoDisplay : " + e.context);



            that.showLoading();
            app.siteAccessService.viewModel.set("selectSite", null);
            app.siteAccessService.viewModel.set("selectNewSite", null);
            var AcceptActions = $("#AcceptActions").data("kendoMobileActionSheet");
            var InitialActions = $("#InitialActions").data("kendoMobileActionSheet");
            var OnsiteActions = $("#OnsiteActions").data("kendoMobileActionSheet");
            var ReportActions = $("#ReportActions").data("kendoMobileActionSheet");

            var MultiAssignActions = $("#MultiAssignActions").data("kendoMobileActionSheet");
            var MultiAcceptActions = $("#MultiAcceptActions").data("kendoMobileActionSheet");
            var MultiInitialActions = $("#MultiInitialActions").data("kendoMobileActionSheet");
            var MultiOnsiteActions = $("#MultiOnsiteActions").data("kendoMobileActionSheet");
            var MultiReportActions = $("#MultiReportActions").data("kendoMobileActionSheet");

            if (AcceptActions != undefined && AcceptActions != null) {
                AcceptActions.close();
            }
            if (InitialActions != undefined && InitialActions != null) {
                InitialActions.close();
            }
            if (OnsiteActions != undefined && OnsiteActions != null) {
                OnsiteActions.close();
            }
            if (ReportActions != undefined && ReportActions != null) {
                ReportActions.close();
            }

            if (MultiAssignActions != undefined && MultiAssignActions != null) {
                MultiAssignActions.close();
            }
            if (MultiAcceptActions != undefined && MultiAcceptActions != null) {
                MultiAcceptActions.close();
            }
            if (MultiInitialActions != undefined && MultiInitialActions != null) {
                MultiInitialActions.close();
            }
            if (MultiOnsiteActions != undefined && MultiOnsiteActions != null) {
                MultiOnsiteActions.close();
            }
            if (MultiReportActions != undefined && MultiReportActions != null) {
                MultiReportActions.close();
            }
            //setTimeout(function () {
            //that.set("selectId", e.selectId);
            JBs = that.get("jobDataSource");


            if (e.context != undefined && e.context != null) {
                JBs.filter({
                    field: "jobId",
                    operator: "eq",
                    value: e.context,
                });

                JBs.fetch(function() {
                    var view = JBs.view();

                    var selectItem = view[0];


                    if (selectItem != undefined && selectItem != null) {
                        that.set("selectItem", selectItem);
                        that.set("showType", "");

                        var dataSourcePC = that.get("jobProblemCDataSource"),
                            dataSourcePCM = that.get("jobProblemCMDataSource"),
                            dataSourcePS = that.get("jobProblemSDataSource");
                        //dataSourcePSP = that.get("jobProblemSPDataSource");
                        if (dataSourcePC != null && dataSourcePC != undefined) {
                            dataSourcePC.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }

                        if (dataSourcePCM != null && dataSourcePCM != undefined) {
                            dataSourcePCM.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }
                        if (dataSourcePCM != null && dataSourcePCM != undefined) {
                            dataSourcePS.filter({
                                field: "jobId",
                                operator: "eq",
                                value: selectItem.jobId
                            });
                        }
                        // if (dataSourcePSP != null && dataSourcePSP != undefined) {
                        //  dataSourcePSP.filter({
                        //      logic: "and",
                        //      filters: [{
                        //          field: "jobId",
                        //          operator: "eq",
                        //          value: selectItem.jobId
                        //      }]
                        //  });
                        // }
                        that.set("selectProblemC", null);
                        that.set("selectProblemCM", null);
                        that.set("selectProblemS", null);
                        if (dataSourcePCM != null && dataSourcePCM != undefined) {

                            dataSourcePC.fetch(function() {

                                var tempPC = new kendo.data.DataSource({
                                    data: dataSourcePC.view()
                                });

                                that.set("selectProblemC", tempPC);
                            });
                        }
                        if (dataSourcePCM != null && dataSourcePCM != undefined) {

                            dataSourcePCM.fetch(function() {

                                var tempPCM = new kendo.data.DataSource({
                                    data: dataSourcePCM.view()
                                });

                                that.set("selectProblemCM", tempPCM);
                            });
                        }
                        if (dataSourcePCM != null && dataSourcePCM != undefined) {

                            dataSourcePS.fetch(function() {

                                var tempPS = new kendo.data.DataSource({
                                    data: dataSourcePS.view()
                                });

                                that.set("selectProblemS", tempPS);
                            });
                        }

                        that.set("returnUrl", app.application.view().id);
                        //that.set("selectProblemSP", dataSourcePSP);

                        //////console.log("dataSourcePC : " + JSON.stringify(dataSourcePC));
                        //////console.log("dataSourcePCM : " + JSON.stringify(dataSourcePCM));
                        //////console.log("dataSourcePS : " + JSON.stringify(dataSourcePS));
                        //////console.log("dataSourcePSP : " + JSON.stringify(dataSourcePSP));

                        app.application.navigate(
                            '#tabstrip-edit'
                        );
                    }
                });
            }
            //prevent `swipe`
            //this.events.cancel();
            //e.event.stopPropagation();

        },
        gotoAAM: function() {
            kendo.data.ObservableObject.fn.init.apply(app.aamService.viewModel, []);

            app.application.navigate(
                '#AAM'
            );

            if ($(".btnGroup").data("kendoMobileButtonGroup") != undefined && $(".btnGroup").data("kendoMobileButtonGroup") != null) {
                //$(".btnGroup").each().select(0);
                $.each($(".btnGroup"), function(index, val) {
                    $(val).data("kendoMobileButtonGroup").select(0);
                });
            }

            if ($(".ammtext") != undefined && $(".ammtext") != null) {
                //$(".btnGroup").each().select(0);
                $.each($(".ammtext"), function(index, val) {
                    $(val).val('');
                });
            }


            //app.aamService.viewModel.set("newAAMItem",null);


        },

        gotoAlarm: function(e) {
            var that = app.jobService.viewModel;
            that.set("alarmJobId", e.context);
            var jbAlarm = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobCheckAlarmTTSME.json',
                            data: JSON.stringify({
                                "jobId": e.context,
                                "token": localStorage.getItem("token"),
                                "version": "2"
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success: function(response) {
                                // if (response && response.jobCheckAlarms && response.jobCheckAlarms.length >= 1) {
                                //     that.set("isNotfound", false);
                                // } else {
                                //     that.set("isNotfound", true);
                                // }
                                operation.success(response);
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("Accept : Save incomplete! ");
                                    console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                    navigator.notification.alert(error,
                                        function() {}, "Get job incomplete! ", 'OK');
                                }
                                //return false;
                            },
                            complete: function() {
                                that.hideLoading();
                            }
                        });
                    }
                },
                schema: {
                    data: "jobCheckAlarms"
                }
            });

            // jbAlarm.fetch(function() {

            // });
            // console.log(jbAlarm);

            $("#lvSiteAlarm").kendoMobileListView({
                dataSource: jbAlarm,
                style: "inset",
                template: $("#lv-site-alarm-template").html()
            });
            var lvSiteAlarm = $("#lvSiteAlarm").data("kendoMobileListView");

            lvSiteAlarm.dataSource.filter({
                field: "siteType",
                operator: "eq",
                value: "AC"
            });
            lvSiteAlarm.dataSource.read();
            lvSiteAlarm.refresh();
            //alert(that.get("alarmJobId"));
            app.application.navigate(
                '#SiteAlarm'
            );
        },
        gotoDirection: function(e) {
            var that = app.jobService.viewModel;
            that.set("alarmJobId", e.context);
            var jbDirec = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobCheckAlarmTTSME.json',
                            data: JSON.stringify({
                                "jobId": e.context,
                                "token": localStorage.getItem("token"),
                                "version": "2"
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success: function(response) {
                                operation.success(response);
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("Accept : Save incomplete! ");
                                    ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                    navigator.notification.alert(error,
                                        function() {}, "Get job incomplete! ", 'OK');
                                }
                                //return false;
                            },
                            complete: function() {
                                that.hideLoading();
                            }
                        });
                    }
                },
                schema: {
                    data: "jobCheckAlarms"
                }
            });

            // aa.fetch(function() {

            // });

            $("#lvSiteDirec").kendoMobileListView({
                dataSource: jbDirec,
                style: "inset",
                template: $("#lv-site-Direc-template").html()
            });
            var lvSiteDirec = $("#lvSiteDirec").data("kendoMobileListView");

            lvSiteDirec.dataSource.filter({
                field: "siteType",
                operator: "eq",
                value: "AC"
            });
            lvSiteDirec.dataSource.read();
            lvSiteDirec.refresh();
            //alert(that.get("alarmJobId"));
            app.application.navigate(
                '#SiteDirection'
            );
        },
        gotoMap: function(e) {
            //var dataItem = e.dataItem;
            //             ckFlag: "0"
            // latitude: null
            // longitude: null
            // parent: ()
            // siteCode: "4IPCLKBPL1H_L9"
            // siteId: "S-INS-430996"
            // siteNameEn: "LTE900 IPCLK BANGPLE 1 HUAWEI"
            // siteType: "AC"
            // uid: "436e4949-070f-4bab-9521-cf402fc8d992"
            //app.mapService.viewModel.directTo(e.dataItem.latitude,e.dataItem.longitude);
            if ((e.dataItem.latitude != null && e.dataItem.longitude != null)) {
                //app.mapService.viewModel.set("isGoFromJob", true);
                app.mapService.viewModel.set("mapFromMode", "J");
                app.mapService.viewModel.set("latitude", e.dataItem.latitude);
                app.mapService.viewModel.set("longitude", e.dataItem.longitude);
                $('#endMap').html(e.dataItem.siteNameEn);
                app.application.navigate(
                    '#tabstrip-map'
                );
            }

        },
        initSiteAlarmList: function() {
            var that = this;

            if (app.configService.isMorkupData) {

                var jbAlarm = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            var response = {
                                "jobCheckAlarms": [{
                                    "siteId": "SLIMS-16213",
                                    "siteCode": "SKI2",
                                    "siteNameEn": "SAMUTSAKHON INDUSTRY 2",
                                    "siteType": "AF",
                                    "checkFlag": "1"
                                }, {
                                    "siteId": "SLIMS-387572",
                                    "siteCode": "SPTC",
                                    "siteNameEn": "SAPHAN THA CHIN.",
                                    "siteType": "AC",
                                    "checkFlag": "2"
                                }, {
                                    "siteId": "SLIMS-387572",
                                    "siteCode": "SPTC",
                                    "siteNameEn": "SAPHAN THA CHIN.",
                                    "siteType": "AF",
                                    "checkFlag": "2"
                                }, {
                                    "siteId": "SLIMS-418138",
                                    "siteCode": "SPTCM",
                                    "siteNameEn": "SAPHAN THA CHIN",
                                    "siteType": "AF",
                                    "checkFlag": "1"
                                }],
                                "version": "1",
                                "jobId": "JB14-268019"
                            };
                            operation.success(response);
                        }
                    },
                    schema: {
                        data: "jobCheckAlarms"
                    }
                });

                // aa.fetch(function() {

                // });

                $("#lvSiteAlarm").kendoMobileListView({
                    dataSource: jbAlarm,
                    style: "inset",
                    template: $("#lv-site-alarm-template").html()
                });
                var lvSiteAlarm = $("#lvSiteAlarm").data("kendoMobileListView");

                lvSiteAlarm.dataSource.filter({
                    field: "siteType",
                    operator: "eq",
                    value: "AC"
                });
                lvSiteAlarm.dataSource.read();
                lvSiteAlarm.refresh();
            }

        },
        getSiteAlarm: function(idx) {
            var that = this;

            var siteType = "AC";

            that.set("siteAlarmType", "Site Access Alarm");
            if (idx == 1) {
                siteType = "AF";
                that.set("siteAlarmType", "Site Affected Alarm");
            }
            var lvSiteAlarm = $("#lvSiteAlarm").data("kendoMobileListView");
            ////console.log("Assign Filter : " + index);
            that.showLoading();
            lvSiteAlarm.dataSource.filter({
                field: "siteType",
                operator: "eq",
                value: siteType
            });
            lvSiteAlarm.dataSource.read();
            lvSiteAlarm.refresh();
            //that.setlvChkDefault();
            app.application.view().scroller.reset();

        },
        gotoAlarmDtlFromMap: function(siteCode) {
            //alert(siteCode);

        },
        setlvChkDefault: function() {
            $.each($("input:checkbox[class^='chkSiteAlarm-']"), function(index, val) {
                // if (val.checked) {
                //     var id = val.className.replace(/chkSiteAlarm-/g, '').split(' ')[0];
                //     _siteAlarm = _siteAlarm + id + ","

                // }
                alert(index);
                //$("input:checkbox[class^='chkSiteAlarm-']")[index].value = true;
                val.checked = true;

            });
        },
        gotoAlarmDtl: function(e) {

            var that = this,
                JBs,
                Photo;
            var alarmcheck = $('input[name=alarmcheck]:checked').length;
            var response_data = null;
            // var activeAlarmsData = [];
            // var alarmData = [];
            var count = 0;
            _siteAlarm = "";

            that.set("isNotfound", false);

            // that.set("isTemp", false);

            $.each($("input:checkbox[class^='chkSiteAlarm-']"), function(index, val) {
                if (val.checked) {
                    var id = val.className.replace(/chkSiteAlarm-/g, '').split(' ')[0];
                    _siteAlarm = _siteAlarm + id + ","
                    var siteCodeChecked = _siteAlarm.split(",");
                    that.showLoading();
                    if (siteCodeChecked.length - 1 == alarmcheck) {
                        var alarmDataSource = new kendo.data.DataSource({
                            transport: {

                                read: function(operation) {
                                    var that = app.jobService.viewModel;
                                    $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                        beforeSend: app.loginService.viewModel.checkOnline,
                                        type: "POST",
                                        timeout: 180000,
                                        url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getActiveAlarm.json',
                                        data: JSON.stringify({
                                            "jobId": that.alarmJobId,
                                            "siteCode": _siteAlarm,
                                            "token": localStorage.getItem("token"),
                                            "user": JSON.parse(localStorage.getItem("profileData")).userId,
                                            "version": "2"
                                        }),
                                        dataType: "json",
                                        contentType: 'application/json',
                                        success: function(response) {
                                            console.log(response);

                                            // if (response.activeAlarms.length == 0) {
                                            //     // alert("Alarm Active not found.");
                                            //     navigator.notification.alert("Alarm Active not found.",
                                            //         function() {}, "Alarm Active ", 'OK');
                                            // }

                                            if (response.activeAlarms.length == 0) {
                                                that.set("isNotfound", true);

                                            } else {
                                                that.set("isNotfound", false);
                                                operation.success(response);
                                            }

                                            that.hideLoading();
                                            //console.log(response.alarmDataSource);

                                            ////////////////

                                            // count += 1;
                                            // if (response.activeAlarms.length != 0) {
                                            //     that.set("isTemp", false);
                                            // }

                                            // if (alarmcheck == count) {
                                            //     that.set("isNotfound", that.get("isTemp"));
                                            //     operation.success(response);
                                            // }
                                            ////////////////


                                            // var siteCodeChecked = response.siteCode.split(",");
                                            // if (response.activeAlarms.length != 0 && siteCodeChecked.length - 1 == alarmcheck) {
                                            //     for (var i = response.activeAlarms.length - 1; i >= 0; i--) {
                                            //         response_data = response;
                                            //     };

                                            //     // response_data = response;
                                            // }
                                            // if (alarmcheck == count) {
                                            //     if (response_data) {
                                            //         that.set("isNotfound", false);
                                            //         operation.success(response_data);
                                            //         that.hideLoading();
                                            //     } else {
                                            //         that.set("isNotfound", true);
                                            //         that.hideLoading();
                                            //     }

                                            // }

                                            ////////////////


                                        },
                                        error: function(xhr, error) {
                                            that.hideLoading();
                                            if (!app.ajaxHandlerService.error(xhr, error)) {
                                                ////console.log("Accept : Save incomplete! ");
                                                ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                                navigator.notification.alert(error,
                                                    function() {}, "Get Site Alarm incomplete! ", 'OK');
                                            }
                                            //return false;
                                        },
                                        complete: function() {

                                        }
                                    });
                                }
                            },
                            schema: {
                                data: "activeAlarms"
                            }
                        });

                        $("#lvAlarm").kendoMobileListView({
                            dataSource: alarmDataSource,
                            style: "inset",
                            template: $("#site-alarm-template").html()
                        });


                        app.application.navigate(
                            '#SiteAlarmDtl'
                        );

                    }


                    // aa.fetch(function() {

                    // });


                } else {
                    navigator.notification.alert("Please Select Site.",
                        function() {}, "Warning", 'OK');
                }


            });

        },
        getProblemCause: function() {
            var that = this;
            var pbc = this.get("selectProblemC");
            if (that.get("showType") == "view") {
                $("#lvJobProblemCauseView").kendoMobileListView({
                    dataSource: pbc,
                    style: "inset",
                    template: $("#job-problem-cause-view-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            } else {
                $("#lvJobProblemCause").kendoMobileListView({
                    dataSource: pbc,
                    style: "inset",
                    template: $("#job-problem-cause-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            }
            //$("#lvJobProblemCause").data("kendoMobileListView").setDatasource(this.get("selectProblemC"));
        },
        onDelProbm: function() {
            var that = this;

            var selectItem = that.get("selectItem");

            var selectProblemC = that.get("selectProblemC");
            var selectProblemS = that.get("selectProblemS");

            $.each($("input:checkbox[class^='PC']"), function(index, val) {
                selectProblemC.fetch(function() {
                    var dataC = selectProblemC.view();

                    for (var i = 0; i < dataC.length; i++) {
                        if (val.checked) {
                            if (val.className.indexOf('PC' + dataC[i].problemCauseSubId + 'PC') > -1) {
                                selectProblemC.remove(dataC[i]);
                                selectItem.cntProblemCause--;

                                selectProblemS.fetch(function() {
                                    var dataS = selectProblemS.view();

                                    for (var j = 0; j < dataS.length; j++) {
                                        if (val.className.indexOf('PC' + dataS[j].subProblemCauseId + 'PC') > -1) {
                                            selectProblemS.remove(dataS[j]);
                                            if (selectItem.cntProblemSolve > 0) {
                                                selectItem.cntProblemSolve--;
                                            }
                                        }
                                    }

                                });
                            }
                        }
                    }

                });

            });

            if (selectItem.cntProblemCause == 0) {
                //console.log("#### Clear selectProblemS ########");
                if ($("#lvProblemSolveMaster").data("kendoMobileListView") != undefined && $("#lvProblemSolveMaster").data("kendoMobileListView") != null) {
                    var lvProblemSolveMaster = $("#lvProblemSolveMaster").data("kendoMobileListView");
                    var newDataSource = new kendo.data.DataSource();
                    lvProblemSolveMaster.setDataSource(newDataSource);
                    lvProblemSolveMaster.refresh();
                }
            }
            that.set("selectItem", selectItem);
        },
        onAddFavorite: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectProblemC = that.get("selectProblemC");
            var selectProblemS = that.get("selectProblemS");

            if ($("input:checkbox[class^='PC']").length == 0) {
                navigator.notification.alert("Please Select Favorite.");

            } else {
                var cntCompleted = 0;
                var cntIncompleted = 0;
                var cntChecked = 0;
                $.each($("input:checkbox[class^='PC']"), function(index, val) {
                    selectProblemC.fetch(function() {
                        var dataC = selectProblemC.view();
                        for (var i = 0; i < dataC.length; i++) {
                            if (val.checked) {
                                if (val.className.indexOf('PC' + dataC[i].problemCauseSubId + 'PC') > -1) {
                                    // console.log(dataC[i]);
                                    cntChecked++;
                                    var dataValue = {
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "problemCause": dataC[i].problemCauseMainId,
                                        "subProblemCause": dataC[i].problemCauseSubId,
                                        "version": "2"
                                    };
                                    $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                        type: "POST",
                                        timeout: 180000,
                                        url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=createFavoriteProblemCause.json',
                                        data: JSON.stringify(dataValue),
                                        dataType: "json",
                                        //async: false,
                                        contentType: 'application/json',
                                        success: function(response) {
                                            cntCompleted++;
                                            // app.masterService.viewModel.loadFavoriteProblemCauses();
                                            var lvFProblemCause = $("#lvFProblemCause").data("kendoMobileListView");
                                            if (lvFProblemCause) {
                                                lvFProblemCause.dataSource.read();
                                                lvFProblemCause.refresh();
                                            }

                                            var lvFProblemCauseD = $("#lvFProblemCauseD").data("kendoMobileListView");
                                            if (lvFProblemCauseD) {
                                                lvFProblemCauseD.dataSource.read();
                                                lvFProblemCauseD.refresh();
                                            }

                                            // alert('SUCCESS:' + response.status);
                                            //that.hideLoading();

                                        },
                                        error: function(xhr, error) {
                                            that.hideLoading();
                                            cntIncompleted++;
                                            if (!app.ajaxHandlerService.error(xhr, error)) {
                                                navigator.notification.alert(error,
                                                    function() {}, "Change Status Job : Save incomplete!", 'OK');
                                            }
                                            ////console.log(JSON.stringify(xhr));
                                        },
                                        complete: function() {
                                            if (cntChecked == (cntCompleted + cntIncompleted)) {
                                                navigator.notification.alert(selectItem.jobId,
                                                    function() {

                                                    }, "Add Favorite : Save " + cntCompleted + " complete " + cntIncompleted + " incomplete !", 'OK');
                                            }

                                        }
                                    });
                                }
                            }
                        }

                    });

                });


            }
        },
        onAddFavoriteM: function() {
            var that = this;
            var selectItem = that.get("selectItem");
            var selectProblemCM = that.get("selectProblemCM");
            var selectProblemSP = that.get("selectProblemSP");

            if ($("input:checkbox[class^='CM']").length == 0) {
                navigator.notification.alert("Please Select Favorite.");
            } else {
                var cntCompleted = 0;
                var cntIncompleted = 0;
                var cntChecked = 0;
                $.each($("input:checkbox[class^='CM']"), function(index, val) {
                    selectProblemCM.fetch(function() {
                        var dataCM = selectProblemCM.view();

                        for (var i = 0; i < dataCM.length; i++) {
                            if (val.checked) {
                                if (val.className.indexOf('CM' + dataCM[i].multiCauseIds + 'CM') > -1) {
                                    // console.log(dataC[i]);
                                    cntChecked++;
                                    var dataValue = {
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "seqId": null,
                                        "problemCause": dataCM[i].multiCauseIds,
                                        "levelCause": dataCM[i].multiCauseLevels,
                                        "version": "2"
                                    };
                                    $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                        type: "POST",
                                        timeout: 180000,
                                        url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=createFavoriteProblemCauseMulti.json',
                                        data: JSON.stringify(dataValue),
                                        dataType: "json",
                                        //async: false,
                                        contentType: 'application/json',
                                        success: function(response) {
                                            cntCompleted++;
                                            var lvFProblemCauseM = $("#lvFProblemCauseM").data("kendoMobileListView");
                                            if (lvFProblemCauseM) {
                                                lvFProblemCauseM.dataSource.read();
                                                lvFProblemCauseM.refresh();
                                            }

                                            var lvFProblemCauseMD = $("#lvFProblemCauseMD").data("kendoMobileListView");
                                            if (lvFProblemCauseMD) {
                                                lvFProblemCauseMD.dataSource.read();
                                                lvFProblemCauseMD.refresh();
                                            }


                                            // app.masterService.viewModel.loadFavoriteProblemCauses();
                                            // alert('SUCCESS:' + response.status);
                                            //that.hideLoading();
                                        },
                                        error: function(xhr, error) {
                                            that.hideLoading();
                                            cntIncompleted++;
                                            if (!app.ajaxHandlerService.error(xhr, error)) {
                                                navigator.notification.alert(error,
                                                    function() {}, "Change Status Job : Save incomplete!", 'OK');
                                            }
                                            ////console.log(JSON.stringify(xhr));
                                        },
                                        complete: function() {
                                            if (cntChecked == (cntCompleted + cntIncompleted)) {
                                                navigator.notification.alert(selectItem.jobId,
                                                    function() {

                                                    }, "Add Favorite : Save " + cntCompleted + " complete " + cntIncompleted + " incomplete !", 'OK');
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });

                });

            }
        },
        gotoMultiMaster: function() {
            app.problemCauseMultiService.viewModel.set("groupParent", "0");
            app.problemCauseMultiService.viewModel.set("multiCauseIds", []);
            app.problemCauseMultiService.viewModel.set("multiCauseLevels", []);
            app.problemCauseMultiService.viewModel.set("multiCauseDescs", []);
            app.application.navigate("#problem-cause-multi-master");
        },
        getProblemCauseM: function() {
            var that = this;
            var pbc = this.get("selectProblemCM");
            if (that.get("showType") == "view") {
                $("#lvJobProblemCauseMView").kendoMobileListView({
                    dataSource: pbc,
                    //style: "inset",
                    template: $("#job-problem-cause-multi-view-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            } else {
                $("#lvJobProblemCauseM").kendoMobileListView({
                    dataSource: pbc,
                    //style: "inset",
                    template: $("#job-problem-cause-multi-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            }
        },
        onDelProbmCM: function() {
            var that = this;

            var selectItem = that.get("selectItem");

            var selectProblemCM = that.get("selectProblemCM");
            var selectProblemS = that.get("selectProblemS");

            $.each($("input:checkbox[class^='CM']"), function(index, val) {
                selectProblemCM.fetch(function() {
                    var dataCM = selectProblemCM.view();

                    for (var i = 0; i < dataCM.length; i++) {
                        if (val.checked) {
                            if (val.className.indexOf('CM' + dataCM[i].multiCauseIds + 'CM') > -1) {
                                selectProblemCM.remove(dataCM[i]);
                                selectItem.cntProblemCause--;

                                selectProblemS.fetch(function() {
                                    var dataS = selectProblemS.view();

                                    for (var j = 0; j < dataS.length; j++) {
                                        if (val.className.indexOf(dataS[j].subProblemCauseId + 'CM') > -1) {
                                            selectProblemS.remove(dataS[j]);
                                            selectItem.cntProblemSolve--;
                                        }
                                    }

                                });
                            }
                        }
                    }

                });

            });
            that.set("selectItem", selectItem);
        },
        onClearAllCheck: function() {
            setTimeout(function() {
                $.each($("input:checkbox[class^='CM']"), function(index, val) {
                    val.checked = false;
                });
            }, 1000);
        },
        onClearAllCheckPC: function() {
            setTimeout(function() {
                $.each($("input:checkbox[class^='PC']"), function(index, val) {
                    val.checked = false;
                });
            }, 1000);
        },
        onClearAllCheckPS: function() {
            setTimeout(function() {
                $.each($("input:checkbox[class^='PS']"), function(index, val) {
                    val.checked = false;
                });
            }, 1000);
        },
        getProblemSolve: function() {
            var that = this;

            var selectItem = that.get("selectItem");
            var pbs = this.get("selectProblemS");

            if (pbs != undefined && pbs != null) {
                pbs.fetch(function() {
                    var data = pbs.data();

                    //for (var i = data.length; i > 0; i--) {
                    //  if (data[i - 1].problemSolveDesc.indexOf("Permanent") >= 0 || data[i - 1].problemSolveDesc.indexOf("Temporary") >= 0) {
                    pbs.filter({
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
                        }]

                    });
                    //}
                    //}

                    if (that.get("showType") == "view") {
                        $("#lvJobProblemSolveView").kendoMobileListView({
                            dataSource: pbs,
                            //style: "inset",
                            template: $("#job-problem-solve-view-template").html(),
                            //pullToRefresh: true,
                            //autoBind: false,
                            dataBound: function() {
                                that.hideLoading();
                            }
                        });
                    } else {
                        $("#lvJobProblemSolve").kendoMobileListView({
                            dataSource: pbs,
                            //style: "inset",
                            template: $("#job-problem-solve-template").html(),
                            //pullToRefresh: true,
                            //autoBind: false,
                            dataBound: function() {
                                that.hideLoading();
                            }
                        });
                    }
                });
            }
        },
        onDelProbmS: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            var selectProblemS = that.get("selectProblemS");

            $.each($("input:checkbox[class^='PS']"), function(index, val) {
                selectProblemS.fetch(function() {
                    var dataS = selectProblemS.view();

                    for (var i = 0; i < dataS.length; i++) {
                        if (
                            val.checked) {

                            if (val.className.indexOf('PS' + dataS[i].problemSolveId + 'PS') > -1) {
                                selectProblemS.remove(dataS[i]);
                                selectItem.cntProblemSolve--;
                            }
                        }
                    }
                });

            });
            that.set("selectItem", selectItem);
        },
        getProblemSolveRadio: function() {
            var that = this;
            var selectProblemC = that.get("selectProblemC");

            var problemSolveData = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        operation.success(JSON.parse(localStorage.getItem("problemSolveData")));
                    }
                },
                schema: {

                    data: "problemSolves"
                }
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

                problemSolveData.filter(filter);

                ////console.log(JSON.stringify(problemSolveData));

                problemSolveData.fetch(function() {

                    $("#lvProblemSolveRadio").kendoMobileListView({
                        dataSource: {
                            transport: {
                                read: function(operation) {
                                    operation.success(problemSolveData.view());
                                }
                            },
                            filter: {
                                logic: "or",
                                filters: [{
                                    field: "description",
                                    operator: "eq",
                                    value: "Permanent"
                                }, {
                                    field: "description",
                                    operator: "eq",
                                    value: "Temporary"
                                }]
                            },
                            sort: {
                                field: "description",
                                dir: "desc"
                            },
                            group: {
                                field: "subProblemCauseDesc"
                            }

                        },
                        style: "inset",
                        template: $("#job-problem-solve-radio-template").html()
                    });

                    that.checkRadio();
                });
            }
            ////console.log('lv Problem solve Master Loaded');

        },
        checkRadio: function() {

            var that = this;
            var selectProblemS = that.get("selectProblemS");
            var data = selectProblemS.data();
            for (var i = 0; i < data.length; i++) {
                if (data[i].problemSolveDesc.indexOf("Permanent") > 0 || data[i].problemSolveDesc.indexOf("Temporary") > 0) {
                    $("input[name='" + data[i].subProblemCauseId + "'][value=" + data[i].problemSolveId + "]").prop('checked', true);
                }
            }
        },
        onRadio: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            var selectProblemC = that.get("selectProblemC");
            var selectProblemS = that.get("selectProblemS");

            var problemSolveData = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        operation.success(JSON.parse(localStorage.getItem("problemSolveData")));
                    }
                },
                schema: {
                    data: "problemSolves"
                }
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

                problemSolveData.filter(filter);

                ////console.log(JSON.stringify(problemSolveData));

                problemSolveData.fetch(function() {

                    var problemSolveRadioData = new kendo.data.DataSource({
                        transport: {
                            read: function(operation) {
                                operation.success(problemSolveData.view());
                            }
                        },
                        filter: {
                            logic: "or",
                            filters: [{
                                field: "description",
                                operator: "eq",
                                value: "Permanent"

                            }, {
                                field: "description",
                                operator: "eq",
                                value: "Temporary"
                            }]
                        }
                    });

                    problemSolveRadioData.fetch(function() {

                        var data = problemSolveRadioData.view();
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {

                                if ($("input[name='" + data[i].subproblemCauseId + "'][value=" + data[i].id + "]").prop('checked')) {

                                    var dataS = selectProblemS.data();
                                    for (var j = 0; j < dataS.length; j++) {
                                        if (data[i].subproblemCauseId == dataS[j].subProblemCauseId) {
                                            if (dataS[j].problemSolveDesc.indexOf("Permanent") > 0 || dataS[j].problemSolveDesc.indexOf("Temporary") > 0) {
                                                selectProblemS.pushDestroy(dataS[j]);
                                            }
                                        }
                                    }

                                    var pbs = {
                                        "jobId": selectItem.jobId,
                                        "problemSolveId": data[i].id,
                                        "problemSolveDesc": data[i].subProblemCauseDesc + "-" + data[i].description,
                                        "processDesc": "",
                                        "subProblemCauseId": data[i].subproblemCauseId,
                                        "process": "N"
                                    };
                                    selectProblemS.pushCreate(pbs);
                                }
                            }
                        }
                    });

                });
            }

            that.get("selectProblemS", selectProblemS);

            app.application.navigate(
                '#tabstrip-edit'
            );
        },
        getProblemSolveProcess: function() {
            var that = this;
            var pbs = this.get("selectProblemS");

            if (that.get("showType") == "view") {
                $("#lvJobProblemSolveProcessView").kendoMobileListView({
                    dataSource: {
                        transport: {
                            read: function(operation) {
                                operation.success(pbs.data());
                            }
                        },
                        filter: {
                            "field": "process",
                            "operation": "eq",
                            "value": "Y"
                        }
                    },
                    style: "inset",
                    template: $("#job-problem-solve-process-view-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            } else {

                $("#lvJobProblemSolveProcess").kendoMobileListView({
                    dataSource: {
                        transport: {
                            read: function(operation) {
                                operation.success(pbs.data());
                            }
                        },
                        filter: {
                            "field": "process",
                            "operation": "eq",
                            "value": "Y"
                        }
                    },
                    style: "inset",
                    template: $("#job-problem-solve-process-template").html(),
                    //pullToRefresh: true,
                    //autoBind: false,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            }
        },
        onProcess: function() {

            var pbs = this.get("selectProblemS");

            ////console.log(JSON.stringify(pbs));

            if (pbs != undefined && pbs != null) {
                data = pbs.data();
                for (var i = 0; i < data.length; i++) {
                    pbs.data()[i].processDesc = $("#PBS" + data[i].problemSolveId).val();
                }
                this.get("selectProblemS", pbs);
            }

            app.application.navigate(
                '#tabstrip-edit'
            );
        },
        captureImg: function() {
            var that = app.jobService.viewModel;
            ////console.log("open camera");

            app.fileService.viewModel.set("jobId", that.get("selectItem").jobId);

            navigator.camera.getPicture(
                function(imageURI) {
                    //var image = document.getElementById('img1');
                    //image.src = imageURI;
                    setTimeout(function() {
                        ////console.log("Capture Success");
                        app.jobService.viewModel.savePhoto(imageURI);
                    });
                },
                function(message) {
                    //alert('Failed because: ' + message);
                    setTimeout(function() {
                        ////console.log("Capture Fail");
                    }, 0);
                    navigator.notification.alert(message,
                        function() {}, message, 'OK');
                }, {
                    quality: 30,
                    allowEdit: true,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG
                }
            );
        },
        getPhoto: function(source) {
            // Retrieve image file location from specified source
            var that = app.jobService.viewModel;

            app.fileService.viewModel.set("jobId", that.get("selectItem").jobId);

            navigator.camera.getPicture(function(imageURI) {
                    //var image = document.getElementById('img1');
                    //image.src = imageURI;
                    setTimeout(function() {
                        ////console.log("Capture Success");
                        app.jobService.viewModel.savePhoto(imageURI);
                    }, 0);
                    //app.jobService.viewModel.uploadPhoto(imageURI);
                },
                function(message) {
                    //alert('Failed because: ' + message);
                    setTimeout(function() {
                        ////console.log("Capture Fail");
                        navigator.notification.alert(message,
                            function() {}, message, 'OK');
                    }, 0);
                }, {
                    quality: 30,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                }
            );
        },
        // onClick:function() {
        //     // get a reference to the switch widget
        //     var switchInstance = $("#switch").data("kendoMobileSwitch");

        //     // get the checked state of the switch.
        //     console.log(switchInstance.check());
        //     // set the checked state of the switch.
        //     switchInstance.check(true);
        //     console.log(switchInstance.check());

        // },
        openActSheetAssign: function() {
            $("#sortActionSheet").data("kendoMobileActionSheet").open();
        },
        onAssignSortby: function(fieldName) {
            console.log(fieldName);
            app.jobService.viewModel.set("countBy", fieldName);
            var switchInstance = $("#switchAssign").data("kendoMobileSwitch");
            console.log(switchInstance.check());
            var lvAssignList = $("#lvAssignList").data("kendoMobileListView");

            lvAssignList.dataSource.sort({
                field: fieldName,
                dir: switchInstance.check() ? "asc" : "desc"
            });

            //jigkoh comment for not re-read datasource
            //lvAssignList.dataSource.read();
            lvAssignList.refresh();
            app.application.view().scroller.reset();
            $("#sortActionSheet").data("kendoMobileActionSheet").close();
        },
        openActSheetAccept: function() {
            $("#sortActionSheetAccept").data("kendoMobileActionSheet").open();
        },
        onAcceptSortby: function(fieldName) {
            console.debug(fieldName);
            app.jobService.viewModel.set("countBy", fieldName);
            console.log("onAcceptSortby :" + app.jobService.viewModel.get("countBy"));
            var switchInstance = $("#switchAccept").data("kendoMobileSwitch");
            console.log(switchInstance.check());
            var lvAcceptList = $("#lvAcceptList").data("kendoMobileListView");

            lvAcceptList.dataSource.sort({
                field: fieldName,
                dir: switchInstance.check() ? "asc" : "desc"
            });
            //jigkoh comment for not re-read datasource
            //lvAcceptList.dataSource.read();
            lvAcceptList.refresh();
            app.application.view().scroller.reset();
            $("#sortActionSheetAccept").data("kendoMobileActionSheet").close();
        },
        gotoDetailSearch: function(e) {
            var txtJob = $(e.target).closest("form").find("input[type=search]");
            var jobId = txtJob.val();

            if (jobId.length == 11) {
                var jbSearchId = jobId;

                app.jobService.viewModel.set("isSearch", false);
                app.jobService.viewModel.set("returnUrl", app.application.view().id);
                app.jobService.viewModel.exeDetailSearch(jbSearchId);
            } else if (jobId.length < 7 && jobId.length != 0) {
                var str = jobId;
                var pad = "000000";
                var d = new Date();
                var n = d.getFullYear();
                var jbSearchId = "JB" + n.toString().substring(2, 4) + "-" + pad.substring(0, pad.length - str.length) + str;
                txtJob.val(jbSearchId);

                app.jobService.viewModel.set("isSearch", false);

                app.jobService.viewModel.set("returnUrl", app.application.view().id);
                app.jobService.viewModel.set("selectPage", 0);

                app.jobService.viewModel.exeDetailSearch(jbSearchId);
            } else if (jobId.length == 0) {
                navigator.notification.alert("Please fill JOB ID",
                    function() {
                        return false;
                    }, "JOB ID : Empty", 'OK');
            } else {
                navigator.notification.alert("JBxx-xxxxxx or xxxxxx",
                    function() {
                        return false;
                    }, "JOB ID : Wrong format", 'OK');
            }

        },
        filterAssignEvent: function() {
            var that = app.jobService.viewModel;
            //that.showLoading();
            var assignFilter = that.get("assignFilter");
            //console.log(assignFilter);
            var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
            //app.jobService.viewModel.filterassign(btnGroup.current().index());


            var index = 4 - btnGroup.current().index();
            var lvAssignList = $("#lvAssignList").data("kendoMobileListView");
            // ////console.log("Assign Filter : " + index);
            // that.showLoading();
            // var filterJob = {
            //     field: "jobId",
            //     operator: "contains",
            //     value: assignFilter
            // };
            //siteNameTh

            var filterJob = {
                logic: "or",
                filters: [{
                    field: "jobId",
                    operator: "contains",
                    value: assignFilter
                }, {
                    field: "title",
                    operator: "contains",
                    value: assignFilter
                }, {
                    field: "assignByName",
                    operator: "contains",
                    value: assignFilter
                }, {
                    field: "siteAccessDesc",
                    operator: "contains",
                    value: assignFilter
                }, {
                    field: "siteNameTh",
                    operator: "contains",
                    value: assignFilter
                }]
            };

            lvAssignList.dataSource.filter({
                logic: "and",
                filters: [{
                    field: "statusId",
                    operator: "eq",
                    value: "01"
                }, {
                    field: "priorityId",
                    operator: "eq",
                    value: index
                }, filterJob]
            });
            //jigkoh comment for not re-read datasource
            //lvAssignList.dataSource.read();
            lvAssignList.refresh();
            app.application.view().scroller.reset();
        },
        filterAcceptEvent: function() {
            var that = app.jobService.viewModel;
            //that.showLoading();
            var acceptFilter = that.get("acceptFilter");
            //console.log(acceptFilter);
            var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
            //app.jobService.viewModel.filterassign(btnGroup.current().index());


            var index = btnGroup.current().index();
            //var lvAcceptList = $("#lvAcceptList").data("kendoMobileListView");
            // ////console.log("Assign Filter : " + index);
            // that.showLoading();
            //siteNameTh

            var filterJob = {
                logic: "or",
                filters: [{
                    field: "jobId",
                    operator: "contains",
                    value: acceptFilter
                }, {
                    field: "title",
                    operator: "contains",
                    value: acceptFilter
                }, {
                    field: "assignByName",
                    operator: "contains",
                    value: acceptFilter
                }, {
                    field: "siteAccessDesc",
                    operator: "contains",
                    value: acceptFilter
                }, {
                    field: "siteNameTh",
                    operator: "contains",
                    value: acceptFilter
                }]
            };
            if (index == 0) {
                //accept
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "02"
                    }, filterJob]
                };
            } else if (index == 1) {
                //initial
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "03"
                    }, filterJob]
                };
            } else if (index == 2) {
                //onsite
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "04"
                    }, filterJob]
                };
            } else if (index == 3) {
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "05"
                    }, filterJob]
                };
            } else if (index == 4) {
                var filter = {
                    logic: "and",
                    filters: [{
                        field: "statusId",
                        operator: "eq",
                        value: "10"
                    }, filterJob]
                };
            }
            var lvAcceptList = $("#lvAcceptList").data("kendoMobileListView");

            lvAcceptList.dataSource.filter(filter);
            //jigkoh comment for not re-read datasource
            //lvAcceptList.dataSource.read();
            lvAcceptList.refresh();
            app.application.view().scroller.reset();

        },
        exeDetailSearch: function(jbSearchId) {
            var that = this;
            var cache = JSON.parse(localStorage.getItem("jbData"));

            //cache = that.get("jobDataSource");
            if (cache != null || cache != undefined) {
                var JBs = new kendo.data.DataSource({
                    data: cache,
                    schema: {
                        "data": "jobs"
                    }
                })

                JBs.filter({
                    "field": "jobId",
                    "operator": "eq",
                    "value": jbSearchId
                });

                JBs.fetch(function() {
                    var view = JBs.view();

                    if (view.length) {
                        var selectItem = view[0];
                        that.set("selectItem", selectItem);

                        if (view[0].status == "Assign") {

                            //var that = app.jobService.viewModel;
                            //////console.log("gotoDisplay : " + e.context);
                            //setTimeout(function () {
                            //that.set("selectId", e.selectId);
                            //JBs = that.get("jobDataSource");

                            //var selectItem = JBs.getByUid(e.context);
                            //that.set("selectItem", selectItem);
                            that.set("showType", "view");

                            var dataSourcePC = that.get("jobProblemCDataSource"),
                                dataSourcePCM = that.get("jobProblemCMDataSource"),
                                dataSourcePS = that.get("jobProblemSDataSource"),
                                dataSourcePSP = that.get("jobProblemSPDataSource");

                            if (dataSourcePC != null && dataSourcePC != undefined) {
                                dataSourcePC.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }

                            if (dataSourcePC != null && dataSourcePC != undefined) {
                                dataSourcePCM.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }

                            if (dataSourcePC != null && dataSourcePC != undefined) {
                                dataSourcePS.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }

                            if (dataSourcePSP != null && dataSourcePSP != undefined) {
                                dataSourcePSP.filter({
                                    logic: "and",
                                    filters: [{
                                        field: "jobId",
                                        operator: "eq",
                                        value: selectItem.jobId
                                    }]

                                });
                            }

                            that.set("selectProblemC", dataSourcePC);
                            that.set("selectProblemCM", dataSourcePCM);
                            that.set("selectProblemS", dataSourcePS);
                            that.set("selectProblemSP", dataSourcePSP);


                            ////console.log("dataSourcePC : " + JSON.stringify(dataSourcePC));
                            ////console.log("dataSourcePCM : " + JSON.stringify(dataSourcePCM));
                            ////console.log("dataSourcePS : " + JSON.stringify(dataSourcePS));
                            ////console.log("dataSourceSP : " + JSON.stringify(dataSourcePSP));

                            ////console.log("gotodisplay");


                            that.set("selectpage", 0);
                            app.jobService.viewModel.set("isSearch", false);
                            app.multiService.viewModel.set("isSearch", false);
                            app.application.navigate(
                                '#tabstrip-display'
                            );
                            //prevent `swipe`
                            //this.events.cancel();
                            //e.event.stopPropagation();
                            //app.jobService.viewModel.get("showType") == "view"
                        } else {
                            //var that = app.jobService.viewModel;
                            //////console.log("gotoDisplay : " + e.context);
                            //setTimeout(function () {
                            //that.set("selectId", e.selectId);
                            //JBs = that.get("jobDataSource");

                            //var selectItem = JBs.getByUid(e.context);
                            //that.set("selectItem", selectItem);
                            that.set("showType", "");

                            var dataSourcePC = that.get("jobProblemCDataSource"),
                                dataSourcePCM = that.get("jobProblemCMDataSource"),
                                dataSourcePS = that.get("jobProblemSDataSource"),
                                dataSourcePSP = that.get("jobProblemSPDataSource");


                            if (dataSourcePC != null && dataSourcePC != undefined) {
                                dataSourcePC.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }

                            if (dataSourcePCM != null && dataSourcePCM != undefined) {
                                dataSourcePCM.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }

                            if (dataSourcePS != null && dataSourcePS != undefined) {
                                dataSourcePS.filter({
                                    field: "jobId",
                                    operator: "eq",
                                    value: selectItem.jobId
                                });
                            }


                            if (dataSourcePSP != null && dataSourcePSP != undefined) {
                                dataSourcePSP.filter({
                                    logic: "and",
                                    filters: [{
                                        field: "jobId",
                                        operator: "eq",
                                        value: selectItem.jobId
                                    }]

                                });
                            }

                            that.set("selectProblemC", dataSourcePC);
                            that.set("selectProblemCM", dataSourcePCM);
                            that.set("selectProblemS", dataSourcePS);
                            that.set("selectProblemSP", dataSourcePSP);

                            ////console.log("dataSourcePC : " + JSON.stringify(dataSourcePC));
                            ////console.log("dataSourcePCM : " + JSON.stringify(dataSourcePCM));
                            ////console.log("dataSourcePS : " + JSON.stringify(dataSourcePS));
                            ////console.log("dataSourcePSP : " + JSON.stringify(dataSourcePSP));
                            that.set("selectpage", 0);
                            app.jobService.viewModel.set("isSearch", false);
                            app.multiService.viewModel.set("isSearch", false);
                            //app.myTeamService.viewModel.set("isSearch", false);
                            app.application.navigate(
                                '#tabstrip-edit'
                            );
                        }

                    } else {
                        app.jobService.viewModel.getOnline(jbSearchId);

                        if (that.get("selectItem") == null) {
                            navigator.notification.alert(jbSearchId,
                                function() {
                                    return false;
                                }, "Job not found.", 'OK');
                        } else {
                            var selectItem = that.get("selectItem");
                            var txtJob = $(".jb-address");
                            $.each(txtJob, function(index, value) {
                                $(value).val('');
                            });

                            if (selectItem.status == "Assign") {
                                that.set("selectPage", 0);
                                app.jobService.viewModel.set("isSearch", false);
                                app.multiService.viewModel.set("isSearch", false);
                                app.application.navigate(
                                    '#tabstrip-display'
                                );

                            } else {

                                that.set("selectPage", 0);
                                app.jobService.viewModel.set("isSearch", false);
                                app.multiService.viewModel.set("isSearch", false);
                                //app.myTeamService.viewModel.set("isSearch", false);
                                app.application.navigate(
                                    '#tabstrip-edit'
                                );
                            }
                        }
                    }
                });
            }

        },
        getOnline: function(jobid) {
            var that = this;
            //getJob

            var JBs = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            var response = {
                                "jobTeams": [],
                                "version": "1",
                                "userId": "7478",
                                "jobId": "JB14-268019"
                            };
                            operation.success(response);
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTeam.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "jobId": jobid,
                                    "version": "2"
                                }),
                                dataType: "json",
                                async: false,
                                contentType: 'application/json',
                                success: function(response) {
                                    operation.success(response);
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("Accept : Save incomplete! ");
                                        ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                        navigator.notification.alert(error,
                                            function() {}, "Get job incomplete! ", 'OK');
                                    }
                                    //return false;
                                },
                                complete: function() {

                                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                                    //$("#lvMultiList").data("kendoMobileListView").refresh();
                                    //$("#lvSingleList").data("kendoMobileListView").refresh();


                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "jobTeams"
                },
                model: {
                    id: "jobId"
                }
            });



            JBs.bind("error", function(e) {
                ////console.log("Get my jobs failed");
                ////console.log(e.status);
                ////console.log(e.xhr);
                navigator.notification.alert(e.status,
                    function() {}, "Get  jobs failed", 'OK');
                return;
            });



            JBs.fetch(function() {
                var view = JBs.view();

                if (view.length > 0) {
                    var selectItem = view[0];
                    that.set("selectItem", selectItem);
                } else {

                    that.set("selectItem", null);
                }
            });



            var JobProblemCause = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        //getJobProblemCause
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCause.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "priority": null,
                                    "jobId": jobid,
                                    "version": "2"
                                }),
                                dataType: "json",
                                async: false,
                                contentType: 'application/json',
                                success: function(response) {
                                    operation.success(response);

                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("Accept : Save incomplete! ");
                                        ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                        navigator.notification.alert(error,
                                            function() {}, "Load job incomplete!", 'OK');
                                    }
                                    //return false;
                                },
                                complete: function() {

                                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                                    //$("#lvMultiList").data("kendoMobileListView").refresh();
                                    //$("#lvSingleList").data("kendoMobileListView").refresh();


                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "jobProblems"
                },
                model: {
                    id: "jobId"
                }
            });

            JobProblemCause.bind("error", function(e) {
                ////console.log("Get my jobs failed");
                ////console.log(e.status);
                ////console.log(e.xhr);
                navigator.notification.alert(e.status,
                    function() {}, "Get  job problems cause failed", 'OK');
                return;
            });

            JobProblemCause.read(function() {

            });
            that.set("selectProblemC", JobProblemCause);


            var JobProblemCauseM = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        //getJobProblemCauseMulti
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCauseM.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                "priority": null,
                                "jobId": jobid,
                                "version": "2"
                            }),
                            dataType: "json",
                            async: false,
                            contentType: 'application/json',
                            success: function(response) {
                                operation.success(response);
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("Accept : Save incomplete! ");
                                    ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                    navigator.notification.alert(error,
                                        function() {}, "Reject Save incomplete!", 'OK');
                                }
                                //return false;
                            },
                            complete: function() {

                                //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                                //$("#lvMultiList").data("kendoMobileListView").refresh();
                                //$("#lvSingleList").data("kendoMobileListView").refresh();


                            }
                        });
                    }
                },
                schema: {
                    data: "jobProblems"
                },
                model: {
                    id: "jobId"
                }
            });

            JobProblemCauseM.bind("error", function(e) {
                ////console.log("Get my jobs failed");
                ////console.log(e.status);
                ////console.log(e.xhr);
                navigator.notification.alert(e.status,
                    function() {}, "Get  job problems cause failed", 'OK');
                return;
            });

            JobProblemCauseM.read(function() {

            });
            that.set("selectProblemCM", JobProblemCauseM);


            var JobProblemSolve = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        //getJobProblemSolve
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemSolve.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                "priority": null,
                                "jobId": jobid,
                                "version": "2"
                            }),
                            dataType: "json",
                            async: false,
                            contentType: 'application/json',
                            success: function(response) {
                                operation.success(response);
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("Accept : Save incomplete! ");
                                    ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                    navigator.notification.alert(error,
                                        function() {}, "Reject Save incomplete!", 'OK');
                                }
                                //return false;
                            },
                            complete: function() {

                                //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
                                //$("#lvMultiList").data("kendoMobileListView").refresh();
                                //$("#lvSingleList").data("kendoMobileListView").refresh();


                            }
                        });
                    }
                },
                schema: {
                    data: "jobProblems"
                },
                model: {
                    id: "jobId"
                }
            });

            JobProblemSolve.bind("error", function(e) {
                ////console.log("Get my jobs failed");
                ////console.log(e.status);
                ////console.log(e.xhr);
                navigator.notification.alert(e.status,
                    function() {}, "Get  job problems cause failed", 'OK');
                return;
            });

            JobProblemSolve.read(function() {

            });

            that.set("selectProblemS", JobProblemSolve);
            that.set("selectProblemSP", JobProblemSolve);

            //getJobProblemSolveProcess

        },
        backPage: function() {
            var that = app.jobService.viewModel;
            ////console.log("rejectReturnUrl : " + that.get("rejectReturnUrl"));
            app.application.navigate(
                that.get("rejectReturnUrl")
            );
        },
        onSearch: function() {
            var that = this
            that.set("isSearch", !that.get("isSearch"));
            that.set("searchtxt", "");
        },
        savePhoto: function(imageURI) {
            var that = this;

            ////console.log("Save photo");
            var fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            ////console.log("get local file :" + imageURI);
            app.fileService.viewModel.updateCameraImages(imageURI);
        },
        errorSaveFile: function(e) {
            ////console.log("error get file");
            navigator.notification.alert("console",
                function() {}, "Photo : Save incomplete!", 'OK');
        },
        uploadPhoto: function(jobId) {
            var that = app.jobService.viewModel;

            var options = new FileUploadOptions();
            var fileSystem = null;
            if (gFileSystem != undefined && gFileSystem != null) {
                fileSystem = gFileSystem;
            }

            //var JBs = app.jobService.viewModel.get("jobDataSource");


            //////console.log(JSON.stringify(JBs));
            //JBs.filter({
            //  field: "jobId",
            //  operator: "eq",
            //  value: jobId,
            //});

            //JBs.fetch(function() {
            console.log("fetch job photo");
            //var view = JBs.view();

            //var selectItem = view[0];

            var count = 0;

            //////console.log("fileSystem:" + fileSystem.root.name);

            ////console.log("get Attach");
            ////console.log("job id : " + selectItem.jobId);

            //upload file
            if (fileSystem.root != null && fileSystem.root != undefined) {
                ////console.log("save file step 1");
                fileSystem.root.getDirectory('TTSM/' + jobId, {
                    create: false
                }, function(entry) {
                    ////console.log("create reader");
                    var directoryReader = entry.createReader();
                    directoryReader.readEntries(function(entries) {
                        ////console.log("save file step 2");
                        ////console.log("entries.length" + entries.length);

                        //var dataSource = new kendo.data.DataSource();
                        //var files = new kendo.data.DataSource();
                        if (entries.length > 0) {
                            count = entries.length - 1;
                            for (var i = 0; i < entries.length; i++) {
                                if (entries[i].nativeURL.indexOf("_remote") < 0) {
                                    ////console.log("save file step 3");
                                    options.fileKey = "file";
                                    ////console.log("entries : " + JSON.stringify(entries[i]));
                                    options.fileName = entries[i].name;
                                    options.mimeType = "image/jpeg";

                                    var params = new Object();
                                    params.jobId = jobId;
                                    params.userId = JSON.parse(localStorage.getItem("profileData")).userId;;
                                    params.token = localStorage.getItem("token");
                                    options.params = params;

                                    var ft = new FileTransfer();
                                    ////console.log("start upload");
                                    that.set("tmpName", entries[i].name);
                                    ft.upload(entries[i].nativeURL, encodeURI(app.configService.serviceUrl + "post-upload.service?s=file-service&o=uploadFile.json"),
                                        function() {
                                            ////console.log("upload success");
                                            ////console.log("count = " + count + ": i = " + i);
                                            //if (count == i) {
                                            //  if (fileSystem.root != null && fileSystem.root != undefined) {
                                            //      ////console.log("delete file step 1");
                                            //      fileSystem.root.getDirectory("TTSM/" + selectItem.jobId, {
                                            //          create: false,
                                            //      }, function(entry) {
                                            //          ////console.log("delete file step 2");
                                            //          entry.removeRecursively(function() {
                                            //              ////console.log("Remove Recursively Succeeded");
                                            //          }, app.fileService.viewModel.onFileSystemError);
                                            //      }, app.fileService.viewModel.onFileSystemError);

                                            //  } else {
                                            //      ////console.log("fileSystem undefind");
                                            //  }
                                            //}
                                        }, app.jobService.viewModel.fail, options, true);
                                } else {
                                    //if (fileSystem.root != null && fileSystem.root != undefined) {
                                    //  ////console.log("upload file step 1");
                                    //  fileSystem.root.getDirectory("TTSM/" + selectItem.jobId, {
                                    //      create: false
                                    //  }, function(entry) {
                                    //      entry.removeRecursively(function() {
                                    //          ////console.log("Remove Recursively Succeeded");
                                    //      }, app.fileService.viewModel.onFileSystemError);
                                    //  }, app.fileService.viewModel.onFileSystemError);

                                    //} else {
                                    //  ////console.log("fileSystem undefind");
                                    //}
                                }
                            }
                        }

                    }, app.fileService.viewModel.onFileSystemError)
                }, app.fileService.viewModel.onFileSystemError);
            }
            //});
        },
        win: function(r) {
            ////console.log("Code = " + r.responseCode);
            ////console.log("Response = " + r.response);
            ////console.log("Sent = " + r.bytesSent);
        },

        fail: function(error) {
            //alert("An error has occurred: Code = " + error.code);
            navigator.notification.alert("An error has occurred: Code = " + error.code,
                function() {}, "Upload picture failed", 'OK');

            ////console.log("upload error source " + error.source);
            ////console.log("upload error target " + error.target);
        },
        reloadChangeMore: function() {
            var that = app.jobService.viewModel;

            //app.jobService.viewModel.showLoading();
            app.jobService.viewModel.getAttach();

            var selectItem = app.jobService.viewModel.get("selectItem");
            ////console.log("showbyid");
            var listviews = this.element.find("ul.km-listview");

            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {
                app.aamService.loadAAMList(selectItem.jobId);
                if (that.get("showType") != "view") {
                    //$("#btn_aam_add").show();
                }
            } else {
                $("#btn_aam_add").hide();
            }



            //if (app.jobService.viewModel.get("returnUrl") != null || app.jobService.viewModel.get("returnUrl") != "" ) {
            //  app.siteAccessService.viewModel.set("selectSite", null);
            //  app.siteAccessService.viewModel.set("selectNewSite", null);
            //}
            if (that.get("showType") == "view") {
                var divPhoto = $("#divPhotoView");
                var divPhotoScroller = $("#divPhotoScrollerView");

                var displaygroup = $("#displaygroup").data("kendoMobileButtonGroup");

                that.set("selectedStatus", "05");

                var selectPage = that.get("selectPage");
                if (selectPage == "0") {
                    displaygroup.select(0);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(displaygroup.current().index())
                        .show();
                } else {

                    if (displaygroup.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                    } else if (displaygroup.current().index() == 3) {
                        //selected JobID

                        //that.get("selectItem");
                        //////console.log("selectItem : " + selectItem.jobId);
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(displaygroup.current().index() - 1)
                            .show();

                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(displaygroup.current().index())
                            .show();
                    }
                }




                $("#ddlStatusDisplay").kendoDropDownList({});

            } else {
                var divPhoto = $("#divPhoto");
                var divPhotoScroller = $("#divPhotoScroller");

                var groupEdit = $("#groupEdit").data("kendoMobileButtonGroup");

                var selectPage = that.get("selectPage");
                if (selectPage == "1") {
                    groupEdit.select(1);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(groupEdit.current().index())
                        .show();

                    if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(2);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(2);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }


                } else if (selectPage == "0") {
                    groupEdit.select(0);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(groupEdit.current().index())
                        .show();

                    if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(0);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(1);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "02") {
                        var djbstatusAccept = $("#djbstatusAssign").data("kendoDropDownList");
                        djbstatusAccept.select(0);
                        that.set("selectedStatus", djbstatusAccept.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }



                    var ddReportType = $("#ddReportType").data("kendoDropDownList");
                    ddReportType.select(0);
                } else {
                    if (groupEdit.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (groupEdit.current().index() == 3) {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        //////console.log("selectItem : " + selectItem.jobId);
                        listviews.hide()
                            .eq(groupEdit.current().index() - 1)
                            .show();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(groupEdit.current().index())
                            .show();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }
                    /*if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(0);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(1);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }*/
                }

                var body = $(".km-pane");

                $("#ddReportType").kendoDropDownList();

                $("#djbstatusAssign").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        //if (value == "05") {
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                        //}
                    }
                });

                $("#djbstatusInit").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }
                });

                $("#djbstatusOnsite").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });

                $("#djbstatusReport").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });

                $("#djbstatusDetail").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });


            }
            //app.jobService.viewModel.loadImage();
            //app.jobService.viewModel.loadProblem();

            ////console.log(app.jobService.viewModel.get("selectItem"));

            //app.jobService.viewModel.listFile();

            that.set("selectPage", null);

            if (!isOffline) {
                app.siteAccessService.viewModel.loadSiteAccess();
                app.siteAffectService.viewModel.loadSiteAffect();
            }

            app.jobService.viewModel.hideLoading();
        },
        onBack: function() {
            app.application.navigate(
                app.jobService.viewModel.get("returnUrl")
            );
        },
        showLoading: function() {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },
        hideLoading: function() {
            app.application.hideLoading();
        },
        getLocation: function() {
            var that = this;


            var options = {
                maximumAge: 30000,
                timeout: 30000,
                enableHighAccuracy: true
            };

            var selectItem = that.get("selectItem");

            navigator.geolocation.getCurrentPosition(
                function(location) {
                    //////console.log(location.coords.latitude);
                    selectItem.latitude = location.coords.latitude.toFixed(6).toString();
                    selectItem.longtitude = location.coords.longitude.toFixed(6).toString();

                    ////console.log('get Location Complete : ' + JSON.stringify(location));
                    ////console.log(location.coords.latitude.toFixed(6).toString());
                    ////console.log(location.coords.longitude.toFixed(6).toString());
                    that.set("selectItem", selectItem);

                    kendo.bind($(".location"), app.jobService.viewModel);
                },
                function(error) {
                    navigator.notification.alert("Plese check your location service is enabled",
                        function() {}, "Get location failed", 'OK');

                    ////console.log('Location Error : ' + JSON.stringify(error));
                },
                options
            );


        },
        listFile: function() {
            var that = app.jobService.viewModel;

            var fileSystem = null;

            if (gFileSystem != undefined && gFileSystem != null) {
                fileSystem = gFileSystem;
            }

            var selectItem = that.get("selectItem");
            var jobId = selectItem.jobId;
            ////console.log("list File");
            ////console.log(selectItem.jobId);

            if (selectItem == undefined || selectItem == null) {
                navigator.notification.alert("undefined",
                    function() {}, "Select Item", 'OK');
            }
            var files = new kendo.data.DataSource();
            that.set("photoDataSource", files);
            if (that.get("showType") == "view") {
                ////console.log("show View");
                var divPhotoScroller = $("#divPhotoScrollerView").data("kendoMobileScrollView");
                divPhotoScroller.setDataSource(files);
                divPhotoScroller.refresh();
            } else {
                ////console.log("show Edit");
                var divPhotoScroller = $("#divPhotoScroller").data("kendoMobileScrollView");
                divPhotoScroller.setDataSource(files);
                divPhotoScroller.refresh();
            }

            if (fileSystem.root != null && fileSystem.root != undefined) {
                fileSystem.root.getDirectory("TTSM/" + jobId, {
                    create: false
                }, function(entry) {
                    var directoryReader = entry.createReader();
                    directoryReader.readEntries(function(entries) {
                        //var dataSource = new kendo.data.DataSource();
                        var files = new kendo.data.DataSource();
                        for (var i = 0; i < entries.length; ++i) {
                            files.pushCreate(JSON.parse(JSON.stringify(entries[i])));
                        }

                        //////console.log(files);

                        files.sort({
                            field: "name",
                            dir: "desc"
                        });

                        ////console.log("load photo");

                        that.set("photoDataSource", files);

                        ////console.log(JSON.stringify(files));

                        //////console.log("photoDataSource" + JSON.stringify(app.jobService.viewModel.get("photoDataSource")));

                        //$("#divPhotoScroller").data("kendoMobileScrollView").dataSource=files;
                        if (that.get("showType") == "view") {
                            ////console.log("show View");
                            var divPhotoScroller = $("#divPhotoScrollerView").data("kendoMobileScrollView");
                            divPhotoScroller.setDataSource(files);
                            divPhotoScroller.refresh();
                        } else {
                            ////console.log("show Edit");
                            var divPhotoScroller = $("#divPhotoScroller").data("kendoMobileScrollView");
                            divPhotoScroller.setDataSource(files);
                            divPhotoScroller.refresh();
                        }
                        app.jobService.viewModel.hideLoading();
                    }, that.onFileSystemError)
                }, that.onFileSystemError);
            } else {
                ////console.log("fileSystem undefined");
                app.jobService.viewModel.hideLoading();
            }
        },
        getFile: function() {
            //var that = app.jobService.viewModel;
            //var jobId = that.get("selectItem").jobId;
            //app.fileService.viewModel.set("jobId", jobId);

            //var entries = app.fileService.viewModel.listFile();

            //////console.log("11111");

            //var photoDataSource = that.get("photoDataSource");
            //////console.log(JSON.stringify(photoDataSource));
            //$("#divPhotoScroller").kendoMobileScrollView({
            //  dataSource: entries,
            //  template: $("#scrollview-template").html(),
            //  contentHeight: "100%",
            //  enablePager: "false"
            //});
            //////console.log("2222");
            //$("#ttt").kendoMobileListView({
            //  dataSource: entries,
            //  template: $("#test-template").html()
            //});
            //////console.log("333");
            //$("#divPhotoScroller").data("kendoMobileScrollView").refresh();
            //////console.log("444");
            //////console.log(JSON.stringify(photoDataSource));
            //////console.log("555");
        },
        deleteImg: function() {
            var divPhotoScroller = $("#divPhotoScroller").data("kendoMobileScrollView");
            var that = app.jobService.viewModel;
            var fileSystem = null;

            if (gFileSystem != undefined && gFileSystem != null) {
                fileSystem = gFileSystem;
            }

            var selectItem = app.jobService.viewModel.get("selectItem");

            var isOffline = app.loginService.viewModel.get("isOffline");

            ////console.log("get Attach");

            var photoDataSource = divPhotoScroller.dataSource.view();

            //remove file

            if (photoDataSource.length > 0) {

                if (fileSystem.root != null && fileSystem.root != undefined) {
                    ////console.log("remove file step 1");
                    fileSystem.root.getDirectory("TTSM/" + selectItem.jobId, {
                            create: false
                        }, function(entry) {
                            ////console.log("remove file step 2");
                            ////console.log(photoDataSource[divPhotoScroller.page].name);
                            entry.getFile(photoDataSource[divPhotoScroller.page].name, {
                                    create: false
                                },
                                function(entry) {
                                    ////console.log("remove file step 3");
                                    //if (entry.nativeURL.indexOf("_remote") > 0) {
                                    var attachPhoto = localStorage.getItem("attachPhoto");
                                    var fullname = entry.name;
                                    //var arrName = filename.split(".");
                                    var fullattachId = entry.name.substr(entry.name.lastIndexOf('_') + 1);
                                    var tmpattachId = fullattachId.split(".");
                                    var attachId = tmpattachId[0];
                                    ////console.log("attachId" + attachId);
                                    if (!isOffline) {
                                        app.jobService.viewModel.removeRemote(attachId);
                                    } else {

                                        if (attachPhoto == undefined || attachPhoto == null) {
                                            attachPhoto = [];
                                        }

                                        attachPhoto.push(attachId);

                                        localStorage.setItem("attachPhoto", attachPhoto);

                                    }
                                    //}

                                    entry.remove(
                                        function() {
                                            ////console.log("remove success!");
                                            navigator.notification.alert("Delete success",
                                                function() {}, "Photo", 'OK');
                                            app.jobService.viewModel.listFile();
                                        }, app.fileService.viewModel.onFileSystemError
                                    );
                                },
                                app.fileService.viewModel.onFileSystemError
                            );
                        },
                        app.fileService.viewModel.onFileSystemError);
                }
            }

        },
        removeRemote: function(attachId) {
            var isOffline = app.loginService.viewModel.get("isOffline");

            var selectItem = app.jobService.viewModel.get("selectItem");
            //var attachPhoto = localStorage.setItem("attachPhoto", attachPhoto);

            var arrattachId = [];
            arrattachId.push(attachId);

            if (!isOffline) {
                $.ajax({
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=file-service&o=deleteJobAttachPhoto.json',
                    data: JSON.stringify({
                        "token": localStorage.getItem("token"),
                        "attachIds": arrattachId
                    }),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(returnResult) {
                        //alert(returnResult.status + ", " + returnResult.msg);
                        if (returnResult.status == "TRUE") {
                            ////console.log("Remove remote file complete!");
                        } else {
                            ////console.log("Remove remote file incomplete : " + returnResult.msg);
                        }
                    },
                    error: function(xhr, error) {
                        app.jobService.viewModel.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Remove remote file incomplete");
                            ////console.log(xhr);
                            ////console.log(error);
                            //navigator.notification.alert(xhr.status + error,
                            //function() {}, "Get job attach id failed", 'OK');
                        }
                        return;
                    }
                });
            }
        },
        removeRemoteOffline: function() {
            //var isOffline = app.loginService.viewModel.get("isOffline");

            //var selectItem = app.jobService.viewModel.get("selectItem");
            var attachPhoto = localStorage.getItem("attachPhoto", attachPhoto);

            if (attachPhoto != undefined && attachPhoto != null) {
                $.ajax({
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=file-service&o=deleteJobAttachPhoto.json',
                    data: {
                        "token": localStorage.getItem("token"),
                        "attachIds": attachPhoto
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(returnResult) {
                        alert(returnResult.status + ", " + returnResult.msg);
                        if (returnResult.status == "TRUE") {
                            ////console.log("Remove remote file complete!");
                        } else {
                            ////console.log("Remove remote file incomplete : " + returnResult.msg);
                        }
                    },
                    error: function(xhr, error) {
                        that.hideLoading();
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Remove remote file incomplete");
                            ////console.log(xhr);
                            ////console.log(error);
                            //navigator.notification.alert(xhr.status + error,
                            //function() {}, "Get job attach id failed", 'OK');
                        }
                        return;
                    }
                });


            }
        },
        getAttach: function() {
            var that = app.jobService.viewModel;

            if (gFileSystem != undefined && gFileSystem != null) {
                fileSystem = gFileSystem;
            }

            var selectItem = app.jobService.viewModel.get("selectItem");

            //////console.log("fileSystem:" + fileSystem.root.name);

            ////console.log("get Attach");

            //remove file
            if (fileSystem.root != null && fileSystem.root != undefined) {
                ////console.log("save file step 1");
                fileSystem.root.getDirectory("TTSM", {
                    create: true
                }, function(entry) {
                    fileSystem.root.getDirectory("TTSM/" + selectItem.jobId, {
                        create: true
                    }, function(entry) {
                        var directoryReader = entry.createReader();
                        directoryReader.readEntries(function(entries) {
                            ////console.log("entries.length" + entries.length);

                            //var dataSource = new kendo.data.DataSource();
                            //var files = new kendo.data.DataSource();
                            if (entries.length > 0) {
                                for (var i = 0; i < entries.length; i++) {
                                    //app.fileService.viewModel.removeFile(entries[i]);
                                    if (entries[i].fullPath.indexOf("_remote") > 0) {
                                        entries[i].remove(function() {
                                            ////console.log("remove file : " + entries[i].fullPath);
                                        });

                                    } else {
                                        ////console.log("local file found: " + entries[i].fullPath);

                                    }
                                }
                            }
                        });
                    }, app.fileService.viewModel.onFileSystemError);
                }, app.fileService.viewModel.onFileSystemError);
            } else {
                ////console.log("fileSystem undefind");

            }

            var dataSourceAttach = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobAttachIds.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "jobId": selectItem.jobId
                            }),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(response) {
                                //store response
                                //localStorage.setItem("jbCauseMData", JSON.stringify(response));
                                //that.hideLoading();
                                operation.success(response);
                                ////console.log("fetch job attach id : Complete");
                                ////console.log("My job attach Data :" + JSON.stringify(response));
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("Get job attach id failed");
                                    ////console.log(xhr);
                                    ////console.log(error);
                                    //navigator.notification.alert(xhr.status + error,
                                    //function() {}, "Get job attach id failed", 'OK');
                                }
                                return;
                            },
                            complete: function() {

                            }
                        });

                    }
                },
                schema: {
                    data: "jobAttachIds"
                }
            });

            dataSourceAttach.fetch(function() {
                app.jobService.viewModel.getRemoteFile(dataSourceAttach);
            });
            //////console.log("load Attach : " dataSourceAttach);
            //setTimeout(function(){

            //},1000);
        },
        getRemoteFile: function(dataSourceAttach) {
            var isOffline = app.loginService.viewModel.get("isOffline");
            var that = app.jobService.viewModel;
            var selectItem = that.get("selectItem");
            if (!isOffline) {
                dataSourceAttach.fetch(function() {

                    ////console.log("datsource count " + dataSourceAttach.data().length);
                    var attachId = null;
                    if (dataSourceAttach.data().length > 0) {
                        for (var i = 0; i < dataSourceAttach.data().length; i++) {
                            //var fileTransfer = new FileTransfer();
                            //var uri = encodeURI(app.configService.serviceUrl + 'get-file.service?s=file-service&o=getJobAttachPhoto.json');
                            //var options = new FileUploadOptions();
                            //var params = {};

                            //params.fileResponse = "stringBase64";
                            //params.fileResponse = "stream";
                            //params.token = localStorage.getItem("token");
                            //params.attachId = 30000296; //dataSourceAttach.at(i).attachId;
                            //options.params = params;

                            //var filePath = fileSystem.root.fullPath + "/" + selectItem.jobId + "/" + moment().unix() + ".jpg";

                            ////console.log("load attach");
                            attachId = dataSourceAttach.at(i);

                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                async: false,
                                url: app.configService.serviceUrl + 'get-file.service?s=file-service&o=getJobAttachPhoto.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "attachId": dataSourceAttach.at(i),
                                    "fileResponse": "stringBase64"
                                }),
                                contentType: 'application/json',
                                success: function(response) {

                                    var data = JSON.parse(this.data)
                                        //store response
                                        //localStorage.setItem("jbCauseMData", JSON.stringify(response));
                                    that.hideLoading();

                                    ////console.log("save file");


                                    if (fileSystem.root != null && fileSystem.root != undefined) {
                                        ////console.log("save file step 1");
                                        fileSystem.root.getDirectory("TTSM", {
                                                create: true
                                            },
                                            function(entry) {
                                                fileSystem.root.getDirectory("TTSM/" + selectItem.jobId, {
                                                    create: true
                                                }, function(entry) {
                                                    ////console.log("save file step 2");

                                                    entry.getFile(moment().unix() + "_remote_" + data.attachId + ".jpeg", {
                                                        create: true,
                                                        exclusive: false
                                                    }, function(fileEntry) {
                                                        ////console.log("save file step 3");
                                                        fileEntry.createWriter(function(writer) {
                                                            ////console.log("open and write");
                                                            //writer.seek(0);
                                                            //writer.write();   
                                                            var binary = atob(response); // atob() decode base64 data.. 
                                                            var array = [];

                                                            for (var i = 0; i < binary.length; i++) {
                                                                array.push(binary.charCodeAt(i)); // convert to binary.. 
                                                            }

                                                            var UTF8_STR = new Uint8Array(array); // Convert to UTF-8...                
                                                            //contentType = 'image/jpeg';
                                                            //var blob = new Blob([UTF8_STR], {
                                                            //  type: contentType
                                                            //});
                                                            //var BINARY_ARR=UTF8_STR.buffer; 
                                                            //var UTF8_STR = new Uint8Array(byteArr);  // Convert to UTF-8...                
                                                            var BINARY_ARR = UTF8_STR.buffer; // Convert to buffer...  

                                                            writer.seek(0);
                                                            writer.write(BINARY_ARR);

                                                            //////console.log("response UTF8_STR " + UTF8_STR);
                                                            //////console.log("response" + response);
                                                            ////console.log("close and save");
                                                        }, app.fileService.viewModel.onFileSystemError)
                                                    }, app.fileService.viewModel.onFileSystemError)
                                                }, app.fileService.viewModel.onFileSystemError);
                                            }, app.fileService.viewModel.onFileSystemError);
                                    } else {
                                        ////console.log("fileSystem Undefined");

                                    }
                                    ////console.log("fetch job attach file : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("Get job attach file failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get job attach file failed", 'OK');

                                    }
                                    return;
                                },
                                complete: function() {

                                    ////console.log("call ajax complete");


                                }
                            });
                        };
                    } else {}
                });
            }

        },
        onOnline: function() {
            console.log('On online');
            var offline = localStorage.getItem("offline");
            if (offline != null && offline != undefined) {
                var dataValue = {};
                dataValue.token = localStorage.getItem("token");

                if (dataValue.token != null && dataValue.token != undefined) {
                    dataValue.version = '2';
                    dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;
                    //var allItemList = offline;

                    //if (var i = 0, l = offline.length; i < l;i++){
                    //  allItemList.push(offline.length[i]);
                    //}

                    dataValue.allItemList = JSON.parse(offline);
                    console.log('exec offline');
                    app.jobService.viewModel.exeChangeStatusJobOffline(dataValue);
                }
            }
        }
    });

    //function dataFile(bs64data) { 
    //  var binary = atob(bs64data.split(',')[1]); // atob() decode base64 data.. 
    //  var array = []; 
    //  for (var i = 0; i < binary.length; i++) {
    //       array.push(binary.charCodeAt(i)); // convert to binary.. 
    //   } 
    //   var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'}); // create blob file..
    //}

    app.jobService = {
        initAssignlist: function() {
            //console.log("###### initAssignlist ########");
            $("#assigngroup").kendoMobileButtonGroup({
                select: function() {
                    var tabstripParam = this.element.find(".mytabstrip").data("kendoMobileTabStrip");
                    app.jobService.viewModel.filterassign(this.current().index());
                },
                index: 0
            });

        },
        showAssignlist: function() {
            //console.log("###### showAssignlist ########");
            app.jobService.viewModel.set("oStatus", null);
            var txtJob = this.element.closest("form").find("input[type=search]");
            txtJob.val('');
            var tabstripParam = this.element.find(".mytabstrip").data("kendoMobileTabStrip");
            var listviews = this.element.find("ul.km-listview");
            var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
            app.jobService.viewModel.showLoading();
            app.jobService.viewModel.loadassignlist();

            btnGroup.select(0);
            app.jobService.viewModel.filterassign(0);
            app.jobService.viewModel.countAssign();
        },
        initAcceptlist: function() {
            $("#acceptgroup").kendoMobileButtonGroup({
                select: function() {
                    app.jobService.viewModel.filteraccept(this.current().index());
                },
                index: 0
            });

        },
        showAcceptlist: function() {
            app.jobService.viewModel.set("oStatus", null);
            var txtJob = this.element.closest("form").find("input[type=search]");
            txtJob.val('');
            var listviews = this.element.find("ul.km-listview");
            var btnGroup = $("#acceptgroup").data("kendoMobileButtonGroup");
            //app.jobService.viewModel.showLoading();
            app.jobService.viewModel.showLoading();
            app.jobService.viewModel.loadacceptlist();

            btnGroup.select(0);
            app.jobService.viewModel.filteraccept(0);
            app.jobService.viewModel.countAccept();
        },
        showreject: function() {
            app.jobService.viewModel.loadreject();
        },
        editInit: function() {
            //var files = app.jobService.viewModel.get("photoDataSource");
            var divPhoto = $("#divPhoto");
            var divPhotoScroller = $("#divPhotoScroller");
            var listviews = this.element.find("ul.km-listview");
            $("#groupEdit").kendoMobileButtonGroup({
                select: function(e) {
                    if (this.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                    } else if (this.current().index() == 3) {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        //////console.log("selectItem : " + selectItem.jobId);
                        listviews.hide()
                            .eq(this.current().index() - 1)
                            .show();

                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(this.current().index())
                            .show();
                    }
                },
                index: 0
            });

            var body = $(".km-pane");


            $("#djbstatusAssign").kendoDropDownList({
                change: function() {
                    var value = this.value();
                    if (value == "05") {

                    }
                }
            });

            $("#djbstatusInit").kendoDropDownList({
                change: function() {
                    var value = this.value();
                    if (value == "05") {

                    }
                }
            });


            $("#djbstatusOnsite").kendoDropDownList({
                change: function() {
                    var value = this.value();
                    if (value == "05") {

                    }
                }
            });

            $("#djbstatusReport").kendoDropDownList({
                change: function() {
                    var value = this.value();
                    if (value == "05") {

                    }
                }
            });

            $("#djbstatusDetail").kendoDropDownList({
                change: function() {
                    var value = this.value();
                    if (value == "05") {

                    }
                }
            });

            $("#divPhotoScroller").kendoMobileScrollView({
                dataSource: [],
                template: $("#scrollview-template").html(),
                contentHeight: "500px"
            });

            app.jobService.viewModel.loadReportType();
        },
        viewInit: function() {
            //var files = app.jobService.viewModel.get("photoDataSource");
            var divPhoto = $("#divPhotoView");
            var divPhotoScroller = $("#divPhotoScrollerView");
            var listviews = this.element.find("ul.km-listview");
            $("#displaygroup").kendoMobileButtonGroup({
                select: function(e) {
                    if (this.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                    } else if (this.current().index() == 3) {
                        //selected JobID

                        //that.get("selectItem");
                        //////console.log("selectItem : " + selectItem.jobId);
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(this.current().index() - 1)
                            .show();

                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(this.current().index())
                            .show();
                    }
                },
                index: 0
            });

            $("#ddlStatusDisplay").kendoDropDownList({});


            $("#divPhotoScrollerView").kendoMobileScrollView({
                dataSource: [],
                template: $("#scrollview-template").html(),
                contentHeight: "500px"
            });
        },
        showbyid: function() {

            //console.log("#### showbyid ###");

            var that = app.jobService.viewModel;

            //app.jobService.viewModel.showLoading();
            app.jobService.viewModel.getAttach();

            var selectItem = app.jobService.viewModel.get("selectItem");
            ////console.log("showbyid");
            var listviews = this.element.find("ul.km-listview");

            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {
                app.aamService.loadAAMList(selectItem.jobId);
                if (that.get("showType") != "view") {
                    //$("#btn_aam_add").show();
                }
            } else {
                $("#btn_aam_add").hide();
            }



            //if (app.jobService.viewModel.get("returnUrl") != null || app.jobService.viewModel.get("returnUrl") != "" ) {
            //  app.siteAccessService.viewModel.set("selectSite", null);
            //  app.siteAccessService.viewModel.set("selectNewSite", null);
            //}
            if (that.get("showType") == "view") {
                var divPhoto = $("#divPhotoView");
                var divPhotoScroller = $("#divPhotoScrollerView");

                var displaygroup = $("#displaygroup").data("kendoMobileButtonGroup");

                that.set("selectedStatus", "05");

                var selectPage = that.get("selectPage");
                if (selectPage == "0") {
                    displaygroup.select(0);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(displaygroup.current().index())
                        .show();
                } else {

                    if (displaygroup.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                    } else if (displaygroup.current().index() == 3) {
                        //selected JobID

                        //that.get("selectItem");
                        //////console.log("selectItem : " + selectItem.jobId);
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(displaygroup.current().index() - 1)
                            .show();

                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(displaygroup.current().index())
                            .show();
                    }
                }




                $("#ddlStatusDisplay").kendoDropDownList({});

            } else {
                var divPhoto = $("#divPhoto");
                var divPhotoScroller = $("#divPhotoScroller");

                var groupEdit = $("#groupEdit").data("kendoMobileButtonGroup");

                var selectPage = that.get("selectPage");
                if (selectPage == "1") {
                    groupEdit.select(1);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(groupEdit.current().index())
                        .show();

                    if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(2);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(2);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }


                } else if (selectPage == "0") {
                    groupEdit.select(0);
                    divPhoto.hide();
                    divPhotoScroller.hide();
                    listviews.hide()
                        .eq(groupEdit.current().index())
                        .show();

                    if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(0);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(1);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "02") {
                        var djbstatusAccept = $("#djbstatusAssign").data("kendoDropDownList");
                        djbstatusAccept.select(0);
                        that.set("selectedStatus", djbstatusAccept.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }

                    var ddReportType = $("#ddReportType").data("kendoDropDownList");
                    ddReportType.select(0);
                } else {
                    if (groupEdit.current().index() == 2) {
                        listviews.hide();
                        divPhoto.show();
                        divPhotoScroller.show();
                        app.jobService.viewModel.listFile();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (groupEdit.current().index() == 3) {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        //////console.log("selectItem : " + selectItem.jobId);
                        listviews.hide()
                            .eq(groupEdit.current().index() - 1)
                            .show();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else {
                        divPhoto.hide();
                        divPhotoScroller.hide();
                        listviews.hide()
                            .eq(groupEdit.current().index())
                            .show();
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }
                    /*if (selectItem.statusId == "03") {
                        var djbstatusInit = $("#djbstatusInit").data("kendoDropDownList");
                        djbstatusInit.select(0);
                        that.set("selectedStatus", djbstatusInit.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "04") {
                        var djbstatusOnsite = $("#djbstatusOnsite").data("kendoDropDownList");
                        djbstatusOnsite.select(1);
                        that.set("selectedStatus", djbstatusOnsite.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "05") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    } else if (selectItem.statusId == "10") {
                        var djbstatusReport = $("#djbstatusReport").data("kendoDropDownList");
                        djbstatusReport.select(0);
                        that.set("selectedStatus", djbstatusReport.value());
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }*/
                }

                var body = $(".km-pane");

                $("#ddReportType").kendoDropDownList();

                $("#djbstatusAssign").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        //if (value == "05") {
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                        //}
                    }
                });

                $("#djbstatusInit").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);
                    }
                });

                $("#djbstatusOnsite").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });

                $("#djbstatusReport").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });

                $("#djbstatusDetail").kendoDropDownList({
                    change: function() {
                        var value = this.value();
                        that.set("selectedStatus", value);
                        kendo.bind($(".job-bind"), app.jobService.viewModel);

                    }
                });


            }
            //app.jobService.viewModel.loadImage();
            //app.jobService.viewModel.loadProblem();

            ////console.log(app.jobService.viewModel.get("selectItem"));

            //app.jobService.viewModel.listFile();

            that.set("selectPage", null);

            if (!isOffline) {
                app.siteAccessService.viewModel.loadSiteAccess();
                app.siteAffectService.viewModel.loadSiteAffect();
            }

            app.jobService.viewModel.hideLoading();
        },
        initSiteAlarm: function() {
            app.jobService.viewModel.initSiteAlarmList();
            $("#AlarmGroup").kendoMobileButtonGroup({
                select: function() {
                    app.jobService.viewModel.getSiteAlarm(this.current().index());
                    //app.jobService.viewModel.filterassign();

                },
                index: 0
            });

        },
        loadProblemCause: function() {
            app.jobService.viewModel.getProblemCause();
        },
        loadProblemCauseM: function() {
            app.jobService.viewModel.getProblemCauseM();
        },
        loadProblemSolve: function() {
            app.jobService.viewModel.getProblemSolve();
        },
        loadProblemSolveRadio: function() {
            app.jobService.viewModel.getProblemSolveRadio();
        },
        loadProblemSolveProcess: function() {
            app.jobService.viewModel.getProblemSolveProcess();
        },
        viewModel: new jobViewModel()
    };
})(window);
