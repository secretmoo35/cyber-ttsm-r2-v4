(function(global) {
    var reallocateViewModel,
        app = global.app = global.app || {};

    reallocateViewModel = kendo.data.ObservableObject.extend({
        reallocateDataSource: null,
        reallocateWithSatusDataSource: null,
        memberDataSource: null,
        photoDataSource: null,
        selectId: null,
        selectItem: null,
        selectUserId: null,
        selectUserName: null,
        selectPriorityId: null,
        selectPriorityName: null,
        selectStatusId: null,
        selectStatusName: null,
        lastupdatereallocate: null,
        membername: null,
        memberid: null,
        _isLoading: true,
        rejectReturnUrl: null,
        isSearch: false,
        countBy: 'finishDates',
        isVisible: function(fldName) {
            if (app.reallocateService.viewModel.get("countBy") == fldName) {
                return true;
            } else {
                return false;
            }
        },

        openActSheetReAllocate: function() {
            $("#sortActionSheetReAllocate").data("kendoMobileActionSheet").open();
        },
        onReAllocateSortby: function(fieldName) {
            console.debug(fieldName);
            app.reallocateService.viewModel.set("countBy", fieldName);
            var switchInstance = $("#switchReAllocate").data("kendoMobileSwitch");
            console.log(switchInstance.check());
            var lvReallocate = $("#lvReallocate").data("kendoMobileListView");

            lvReallocate.dataSource.sort({
                field: fieldName,
                dir: switchInstance.check() ? "asc" : "desc"
            });
            //jigkoh comment for not re-read datasource
            //lvReallocate.dataSource.read();
            lvReallocate.refresh();
            app.application.view().scroller.reset();
            $("#sortActionSheetReAllocate").data("kendoMobileActionSheet").close();
        },
        sortActionSheetReAllocateWith: function() {
            $("#sortActionSheetReAllocateWith").data("kendoMobileActionSheet").open();
        },
        onReAllocateWithSortby: function(fieldName) {
            console.debug(fieldName);
            app.reallocateService.viewModel.set("countBy", fieldName);
            var switchInstance = $("#switchReAllocateWith").data("kendoMobileSwitch");
            console.log(switchInstance.check());
            var lvReallocateWithStatus = $("#lvReallocateWithStatus").data("kendoMobileListView");

            lvReallocateWithStatus.dataSource.sort({
                field: fieldName,
                dir: switchInstance.check() ? "asc" : "desc"
            });
            //jigkoh comment for not re-read datasource
            //lvReallocate.dataSource.read();
            lvReallocateWithStatus.refresh();
            app.application.view().scroller.reset();
            $("#sortActionSheetReAllocateWith").data("kendoMobileActionSheet").close();
        },
        isReportType: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            if (selectItem.statusId > "04") {
                return true;
            } else {
                return false;
            }

        },
        isProblemC: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            if (selectItem.reportTypeId == "01") {
                return true;
            } else {
                return false;
            }
        },
        isProblemCM: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            if (selectItem.reportTypeId == "02") {
                return true;
            } else {
                return false;
            }
        },
        isProblemS: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            if (selectItem.reportTypeId == "01" || selectItem.reportTypeId == "02") {
                return true;
            } else {
                return false;
            }
        },
        isProcess: function() {
            var that = this;
            var selectItem = that.get("selectItem");

            var rtn = false;
            if (selectItem.problemCauses != undefined && selectItem.problemCauses != null) {
                $.each(selectItem.problemCauses, function(index, value) {
                    if (value.process == "Y") {
                        rtn = true;
                        return false;
                    }
                });
            } else {
                rtn = false;

            }

            return rtn;
        },
        imageSrc: function() {
            var that = app.reallocateService.viewModel;

            return "images/" + that.get("selectItem").priorityName + ".png";

        },
        filterAllocateEvent: function() {
            var that = app.reallocateService.viewModel;
            //that.showLoading();
            var allocateFilter = that.get("allocateFilter");
            //console.log(assignFilter);

            var lvReallocate = $("#lvReallocate").data("kendoMobileListView");
            // ////console.log("Assign Filter : " + index);
            // that.showLoading();
            var filterJob = {
                logic: "or",
                filters: [{
                    field: "jobId",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "title",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "assignByName",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "siteAccessDesc",
                    operator: "contains",
                    value: allocateFilter
                },{
                    field: "siteNameTh",
                    operator: "contains",
                    value: allocateFilter
                }]
            };

            lvReallocate.dataSource.filter(filterJob);
            //jigkoh comment for not re-read datasource
            //lvReallocate.dataSource.read();
            lvReallocate.refresh();
            app.application.view().scroller.reset();
        },
        filterAllocateWithEvent: function() {
            var that = app.reallocateService.viewModel;
            //that.showLoading();
            var allocateFilter = that.get("allocateFilter");
            //console.log(assignFilter);

            var lvReallocateWithStatus = $("#lvReallocateWithStatus").data("kendoMobileListView");
            // ////console.log("Assign Filter : " + index);
            // that.showLoading();
            var filterJob = {
                logic: "or",
                filters: [{
                    field: "jobId",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "title",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "assignByName",
                    operator: "contains",
                    value: allocateFilter
                }, {
                    field: "siteAccessDesc",
                    operator: "contains",
                    value: allocateFilter
                }]
            };

            lvReallocateWithStatus.dataSource.filter(filterJob);
            //jigkoh comment for not re-read datasource
            //lvReallocate.dataSource.read();
            lvReallocateWithStatus.refresh();
            app.application.view().scroller.reset();
        },
        loadlist: function() {
            var that = this;
            var JBs;
            that.showLoading();
            //kendo.data.ObservableObject.fn.init.apply(that, []);
            var userId = that.get("selectUserId");
            var priorityId = that.get("selectPriorityId");
            //var statusId = that.get("selectStatusId");
            var priorityOp = "";

            if (priorityId == "") {
                priorityOp = "neq";
            } else {
                priorityOp = "eq";
            }




            ////console.log("reallocate priorityOp :" + priorityOp);
            ////console.log("reallocate userId : " + userId);
            ////console.log("reallocate priorityId : " + priorityId);

            JBs = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            //console.log("re-allocate load list");
                            operation.success(JSON.parse(localStorage.getItem("jbData")));
                            JBs.fetch();
                            that.hideLoading();
                            that.set("reallocateDataSource", JBs);
                            that.set("lastupdatereallocate", format_time_date(new Date()));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": userId,
                                    "priority": priorityId,
                                    "statusId": "",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json; charset=utf-8',
                                success: function(response) {
                                    //store response
                                    operation.success(response);
                                    JBs.fetch();
                                    that.hideLoading();
                                    that.set("reallocateDataSource", JBs);
                                    //console.log("fetch My Job : Complete");
                                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
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
                                            function() {}, "Get Reallocate Job failed", 'OK');
                                        return;
                                    }
                                },
                                complete: function() {
                                    //that.countAssign();
                                    that.set("lastupdatereallocate", format_time_date(new Date()));
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
                },
                requestEnd: function(e) {
                    //JBs.read();
                }
            });

            //console.log(JSON.stringify(JBs));
            //navigator.notification.alert(JSON.stringify(JBs),
            //                             function () { }, "Get Reallocate jobs failed", 'OK');
            //that.set("reallocateDataSource", JBs);

            ////console.log(JSON.stringify(JBs));
            //that.hideLoading();
            JBs.fetch(function() {


                if ($("#lvReallocate").data("kendoMobileListView") != undefined && $("#lvReallocate").data("kendoMobileListView") != null) {
                    $("#lvReallocate").data("kendoMobileListView").setDataSource(JBs);
                } else {
                    $("#lvReallocate").kendoMobileListView({
                        dataSource: JBs,
                        template: $("#reallocate-template").html(),
                        pullToRefresh: true,
                        virtualViewSize: 40,
                        endlessScroll: true,
                        dataBound: function() {
                            //that.hideLoading();
                            //console.log('bound complete');
                        }
                    });
                }

                //$("#lvReallocate").data("kendoMobileListView").refresh();

                //});
            });
            //var  lvReallocate = $("#lvReallocate").data("kendoMobileListView")
            //lvReallocate.dataSource.read();
            //lvReallocate.refresh();
            //$("#lvReallocateList").kendoMobileListView();

        },
        loadlistWithStatus: function() {
            var that = this;
            var JBs;
            that.showLoading();
            //kendo.data.ObservableObject.fn.init.apply(that, []);
            var userId = that.get("selectUserId");
            var statusId = that.get("selectStatusId");

            var priorityOp = "";

            if (statusId == "") {
                priorityOp = "neq";
            } else {
                priorityOp = "eq";
            }




            ////console.log("reallocate priorityOp :" + priorityOp);
            ////console.log("reallocate userId : " + userId);
            ////console.log("reallocate priorityId : " + priorityId);

            JBs = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbData")));
                            JBs.fetch();
                            that.hideLoading();
                            that.set("reallocateDataSource", JBs);
                            that.set("lastupdatereallocate", format_time_date(new Date()));
                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": userId,
                                    "priority": "",
                                    "statusId": statusId,
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json; charset=utf-8',
                                success: function(response) {
                                    //store response
                                    
                                    operation.success(response);
                                    JBs.fetch();
                                    that.hideLoading();
                                    // jigkoh3 fix issue link from re-allocate wit status
                                    that.set("reallocateDataSource", JBs);
                                    //console.log("fetch My Job : Complete");
                                    //var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
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
                                            function() {}, "Get Reallocate Job failed", 'OK');
                                        return;
                                    }
                                },
                                complete: function() {
                                    //that.countAssign();
                                    that.set("lastupdatereallocate", format_time_date(new Date()));
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
                },
                requestEnd: function(e) {
                    //JBs.read();
                }
            });

            //console.log(JSON.stringify(JBSs));
            //navigator.notification.alert(JSON.stringify(JBs),
            //                             function () { }, "Get Reallocate jobs failed", 'OK');
            //that.set("reallocateDataSource", JBs);

            ////console.log(JSON.stringify(JBs));
            //that.hideLoading();
            JBs.fetch(function() {


                if ($("#lvReallocateWithStatus").data("kendoMobileListView") != undefined && $("#lvReallocateWithStatus").data("kendoMobileListView") != null) {
                    $("#lvReallocateWithStatus").data("kendoMobileListView").setDataSource(JBs);
                } else {
                    $("#lvReallocateWithStatus").kendoMobileListView({
                        dataSource: JBs,
                        template: $("#reallocateWithStatus-template").html(),
                        //pullToRefresh: true,
                        virtualViewSize: 40,
                        //endlessScroll: true,
                        dataBound: function() {
                            //that.hideLoading();
                            //console.log('bound complete');
                        }
                    });
                }

                // //$("#lvReallocate").data("kendoMobileListView").refresh();

                // //});
            });

            //var  lvReallocate = $("#lvReallocate").data("kendoMobileListView")
            //lvReallocate.dataSource.read();
            //lvReallocate.refresh();
            //$("#lvReallocateList").kendoMobileListView();

        },
        loadbyid: function() {
            var that = this;
            //////console.log(JSON.stringify(selectItem));
        },
        gotoDisplay: function(e) {
            var that = app.reallocateService.viewModel;
            ////console.log("gotoDisplay : " + e.context);
            //setTimeout(function () {
            //that.set("selectId", e.selectId);


            // mooh check datasource is null
            var JBs = that.get("reallocateDataSource");
            if (JBs != null) {
                JBs.filter({
                    field: "jobId",
                    operator: "eq",
                    value: e.context,
                });

                JBs.fetch(function() {
                    var view = JBs.view();

                    var selectItem = view[0];

                    app.jobService.viewModel.set("selectItem", selectItem);

                    that.loadProblemReallocate(selectItem.assignTo, e.context);

                    app.jobService.viewModel.set("showType", "view");
                    app.jobService.viewModel.set("returnUrl", app.application.view().id);

                    app.application.navigate(
                        "#tabstrip-display"
                    );
                });
            }
            
            //prevent `swipe`
            //this.events.cancel();
            //e.event.stopPropagation();

        },
        loadProblemReallocate: function(userId, jobId) {
            var that = this;

            //var jobId = that.get("selectItem").jobId;

            var dataSourcePC = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            operation.success(JSON.parse(localStorage.getItem("jbCauseData")));
                            that.hideLoading();

                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCause.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": userId,
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
                                    that.hideLoading();
                                    ////console.log("fetch My Problem Cause : Complete");
                                    //////console.log("My Job Data :" + JSON.stringify(response));
                                },
                                error: function(xhr, error) {
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        //var cache = localStorage.getItem("jbCauseData");

                                        //if (cache == null || cache == undefined) {
                                        ////console.log("Get My Problem Cause failed");
                                        ////console.log(xhr);
                                        ////console.log(error);
                                        navigator.notification.alert(xhr.status + error,
                                            function() {}, "Get My Problem Cause failed", 'OK');
                                        //} else {
                                        //operation.success(JSON.parse(cache));
                                        //}
                                    }
                                    return;
                                },
                                complete: function() {}
                            });
                        }

                    }
                },
                filter: {
                    field: "jobId",
                    operator: "eq",
                    value: jobId
                },
                schema: {
                    data: "jobProblems"
                }
            });

            var dataSourcePCM = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemCauseM.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": userId,
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
                                that.hideLoading();
                                operation.success(response);
                                ////console.log("fetch My Problem Cause Multi : Complete");
                                //////console.log("My Job Data :" + JSON.stringify(response));
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    //var cache = localStorage.getItem("jbCauseMData");

                                    //if (cache == null || cache == undefined) {
                                    ////console.log("Get My Problem Cause Multi failed");
                                    ////console.log(xhr);
                                    ////console.log(error);
                                    navigator.notification.alert(xhr.status + error,
                                        function() {}, "Get My Problem Cause Multi failed", 'OK');
                                    //} else {
                                    //  operation.success(JSON.parse(cache));
                                    //}
                                }
                                return;
                            },
                            complete: function() {


                            }
                        });

                    }
                },
                filter: {
                    field: "jobId",
                    operator: "eq",
                    value: jobId
                },
                schema: {
                    data: "jobProblems"
                }
            });

            var dataSourcePS = new kendo.data.DataSource({

                transport: {
                    read: function(operation) {
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobProblemSolve.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": userId,
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
                                ////console.log("fetch My Problem Solve : Complete");
                                //////console.log("My Job Data :" + JSON.stringify(response));
                            },
                            error: function(xhr, error) {
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    //var cache = localStorage.getItem("jbSolveData");

                                    //if (cache == null || cache == undefined) {
                                    ////console.log("Get My Problem Solve failed");
                                    ////console.log(xhr);
                                    ////console.log(error);
                                    navigator.notification.alert(xhr.status + error,
                                        function() {}, "Get My Problem Solve failed", 'OK');
                                    //} else {
                                    //  operation.success(JSON.parse(cache));

                                    //}
                                }
                                return;
                            },
                            complete: function() {}
                        });
                    }
                },
                filter: {
                    field: "jobId",
                    operator: "eq",
                    value: jobId
                },
                schema: {
                    data: "jobProblems"
                }
            });

            app.jobService.viewModel.set("selectProblemC", dataSourcePC);
            app.jobService.viewModel.set("selectProblemCM", dataSourcePCM);
            app.jobService.viewModel.set("selectProblemS", dataSourcePS);
        },
        gotoMember: function(e) {
            ////console.log("gotoMember : " + e.context);
            app.reallocateService.viewModel.set("selectId", e.context);
            //e.preventDefault();

            //app.reallocateService.viewModel.get("selectItem");


            app.application.navigate(
                '#tabstrip-member'
            );
            //prevent `swipe`
            //this.events.cancel();
            //e.event.stopPropagation();
        },
        gotoResult: function(e) {
            ////console.log("gotoResult");
            //app.reallocateService.viewModel.set("selectId", e.context);
            app.application.navigate(
                '#tabstrip-member'
            );
            return false;
        },
        gotoReject: function() {
            //setTimeout(function () {
            ////console.log("gotoReject");
            app.application.replace(
                '#tabstrip-reject',
                'slide:right' //or whichever transition you like
            );
            //}, 0);
        },
        gotoReallocateDetail: function(e) {
            var that = app.reallocateService.viewModel;

            //var jobuid = e.target.data("jobuid");
            var memberid = e.target.data("memberid");
            var membername = e.target.data("membername");

            //that.set("jobUid",jobuid);
            that.set("memberId", memberid);
            that.set("membername", membername);
            ////console.log("goto Reallocate detail memberId: " + memberid);
            ////console.log("goto Reallocate detail memberName: " + membername);



            app.application.navigate(
                '#Re-Allocate-Detail'
            );
        },
        reallocatejob: function() {

            //setTimeout(function () {
            var that = app.reallocateService.viewModel;
            //////console.log("gotoReject context: " + e.context);
            var selectItem = that.get("selectItem");
            var memberid = that.get("memberId");

            ////console.log("Reallocate Detail selectItem :" + JSON.stringify(selectItem));

            //that.set("selectAssignItem", selectAssignItem);

            ////console.log("Reallocate Prm => user :" + JSON.parse(localStorage.getItem("profileData")).userId + ", selectId : " + selectItem.jobId);
            if (app.configService.isMorkupData) {
                if (true) {
                    ////console.log("Re-allocate job : Save complete!");
                    navigator.notification.alert(selectItem.jobId,
                        function() {}, "Re-allocate job : Save complete!", 'OK');

                    app.application.navigate(
                        '#Re-Allocate'
                    );
                } else {
                    ////console.log("Re-allocate job : Save incomplete!" + response.msg);
                    navigator.notification.alert(response.msg,
                        function() {}, "Re-allocate Job : Save incomplete!", 'OK');
                }
            } else {
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=relocateJob.json',
                    data: JSON.stringify({
                        "token": localStorage.getItem("token"),
                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                        "jobId": selectItem.jobId,
                        "assignToId": memberid,
                        "version": ""
                    }),
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    success: function(response) {

                        if (response.status == "TRUE") {
                            ////console.log("Re-allocate job : Save complete!");
                            navigator.notification.alert(selectItem.jobId,
                                function() {}, "Re-allocate job : Save complete!", 'OK');

                            app.application.navigate(
                                '#Re-Allocate'
                            );
                        } else {
                            ////console.log("Re-allocate job : Save incomplete!" + response.msg);
                            navigator.notification.alert(response.msg,
                                function() {}, "Re-allocate Job : Save incomplete!", 'OK');
                        }
                    },
                    error: function(xhr, error) {

                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            ////console.log("Re-allocate : Save incomplete! ");
                            ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                            navigator.notification.alert(error,
                                function() {}, "Re-allocate Save incomplete!", 'OK');
                        }
                    }
                });
            }

            //}, 0);
        },
        initmember: function() {
            var that = this;
            $("#lvMember").kendoMobileListView({
                style: "inset",
                template: $("#member-template").html(),
                click: function(e) {
                    app.reallocateService.viewModel.gotoReallocateDetail(e);
                },
                // pullToRefresh: true,
                filterable: {
                    field: "fullName",
                    operater: "startwith"

                }
            });
        },
        loadmember: function() {
            var that = this,
                Members = null,
                selectItem = null;

            //setTimeout(function () {
            var jobuid = that.get("selectId");
            //////console.log("goto Reallocate detail jobuid: " + jobuid);

            var JBs = that.get("reallocateDataSource");

            if (JBs != null) {
                JBs.filter({
                    field: "jobId",
                    operator: "eq",
                    value: jobuid,
                });

                JBs.fetch(function() {
                    var view = JBs.view();

                    selectItem = view[0];

                    ////console.log("gotoReallocateDetail => selectItem : " + JSON.stringify(that.get("selectItem")));
                    that.set("selectItem", selectItem);
                });
            }
            //} else {
            if (selectItem == null) {

                //getJob

                var JB = new kendo.data.DataSource({
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
                                        "jobId": jobuid,
                                        "version": "2"
                                    }),
                                    dataType: "json",
                                    async: false,
                                    contentType: 'application/json',
                                    success: function(response) {
                                        operation.success(response);
                                    },
                                    error: function(xhr, error) {
                                        //hat.hideLoading();
                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            ////console.log("Accept : Save incomplete! ");
                                            ////console.log("err=>xhr : " + JSON.stringify(xhr) + ", error : " + error);
                                            navigator.notification.alert(error,
                                                function() {}, "Get job incomplete!", 'OK');
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

                JB.fetch(function() {
                    var view = JB.view();

                    selectItem = view[0];

                    ////console.log("gotoReallocateDetail => selectItem : " + JSON.stringify(that.get("selectItem")));
                    that.set("selectItem", selectItem);
                });

            }

            if (selectItem != null) {
                Members = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            if (app.configService.isMorkupData) {
                                var response = {
                                    "reallocates": [{
                                        "teamId": "00003011",
                                        "teamName": "TEST_AL",
                                        "zoneId": "B1",
                                        "userId": "7478",
                                        "fullName": "Hansa  Saensing",
                                        "sumNone": "149",
                                        "sumMinor": "275",
                                        "sumMajor": "224",
                                        "sumCritical": "70"
                                    }, {
                                        "teamId": "00003060",
                                        "teamName": "Test Team1",
                                        "zoneId": "B1",
                                        "userId": "79",
                                        "fullName": "Sittidet  Tanasrisutarat",
                                        "sumNone": "498",
                                        "sumMinor": "1",
                                        "sumMajor": "0",
                                        "sumCritical": "0"
                                    }, {
                                        "teamId": "00003060",
                                        "teamName": "Test Team1",
                                        "zoneId": "B1",
                                        "userId": "6452",
                                        "fullName": "Somjate  Petsuwan",
                                        "sumNone": "3",
                                        "sumMinor": "0",
                                        "sumMajor": "0",
                                        "sumCritical": "0"
                                    }, {
                                        "teamId": "00003060",
                                        "teamName": "Test Team1",
                                        "zoneId": "B1",
                                        "userId": "7966",
                                        "fullName": "Sukunya  Khemphet",
                                        "sumNone": "1",
                                        "sumMinor": "0",
                                        "sumMajor": "0",
                                        "sumCritical": "0"
                                    }, {
                                        "teamId": "00003060",
                                        "teamName": "Test Team1",
                                        "zoneId": "B1",
                                        "userId": "1089",
                                        "fullName": "Suphakarn  Yingmeema",
                                        "sumNone": "5",
                                        "sumMinor": "0",
                                        "sumMajor": "0",
                                        "sumCritical": "1"
                                    }, {
                                        "teamId": "00003060",
                                        "teamName": "Test Team1",
                                        "zoneId": "B1",
                                        "userId": "9390",
                                        "fullName": "Sutinun  Panjasuchat",
                                        "sumNone": "0",
                                        "sumMinor": "0",
                                        "sumMajor": "0",
                                        "sumCritical": "0"
                                    }],
                                    "userId": "7478",
                                    "zoneId": "B1",
                                    "version": "1"
                                };
                                operation.success(response);
                            } else {
                                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                    type: "POST",
                                    timeout: 180000,
                                    //url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getTeamMember.json',


                                    url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getReallocateTTSME.json',

                                    data: JSON.stringify({
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "zoneId": "",
                                        "version": "2"
                                    }),
                                    dataType: "json",
                                    contentType: 'application/json',
                                    success: function(response) {
                                        //////console.log(JSON.stringify(response));
                                        operation.success(response);
                                        ////console.log("fetch Reallocate Job : Complete");
                                    },
                                    error: function(xhr, error) {
                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            ////console.log("Get Reallocate Job failed");
                                            ////console.log(xhr);
                                            ////console.log(error);
                                        }
                                        //navigator.notification.alert(xhr.status + ' ' + error,
                                        //                            function () { }, "Get Reallocate Job failed", 'OK');
                                        return;
                                    }
                                });
                            }

                        }
                    },
                    schema: {
                        data: "reallocates"
                    },
                    filter: {
                        field: "userId",
                        operator: "neq",
                        value: selectItem.assignTo
                    },


                });



                //Members.read();
                Members.fetch(function() {

                    var view = Members.view();
                    ////console.log(JSON.stringify(view));

                    that.set("memberDataSource", view);

                    $("#lvMember").data("kendoMobileListView").dataSource.data(view);
                });

            }
            ////console.log('load Complete');
        },
        showLoading: function() {
            //if (this._isLoading) {
            app.application.showLoading();
            //}
        },
        hideLoading: function() {
            app.application.hideLoading();
        },
    });


    app.reallocateService = {
        viewModel: new reallocateViewModel(),
        showlist: function() {
            //app.reallocateService.viewModel.showLoading();
            app.reallocateService.viewModel.loadlist();
        },
        showlistWithStatus: function() {
            //app.reallocateService.viewModel.showLoading();
            app.reallocateService.viewModel.loadlistWithStatus();
        },
        initmember: function() {
            app.reallocateService.viewModel.initmember();
        },
        showmember: function() {
            ////console.log('member Load');
            app.reallocateService.viewModel.loadmember();
        }
    };
})(window);