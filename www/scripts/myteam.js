(function(global) {
    var MyTeamViewModel,
        app = global.app = global.app || {};


    MyTeamViewModel = kendo.data.ObservableObject.extend({
        myTeamDataSource: null,
        teamDataSource: null,
        isSearch: false,
        lastupdateteam: null,
        _isLoading: true,
        searchtxt: '',
        jobIdSearch: '',
        alarmJobId: 'jb1234',
        initDropdown: function() {
            var that = this;
            var body = $(".km-pane");
            //console.logug(localStorage.getItem("teamData"));
            console.log("ddlTeam init");
            if (kendo.ui.DropDownList) {
                $("#ddlteam").kendoDropDownList({
                    dataBound: function() {
                        var value = this.value();
                        if (value) {
                            $("#lvMyTeam").data("kendoMobileListView").dataSource.filter({
                                logic: "and",
                                filters: [{
                                    field: "teamName",
                                    operator: "eq",
                                    value: value
                                }, {
                                    field: "fullName",
                                    operator: "neq",
                                    value: null
                                }]
                            });
                            $("#lvMyTeamStatus").data("kendoMobileListView").dataSource.filter({
                                logic: "and",
                                filters: [{
                                    field: "teamName",
                                    operator: "eq",
                                    value: value
                                }, {
                                    field: "fullName",
                                    operator: "neq",
                                    value: null
                                }]
                            });
                        } else {
                            $("#lvMyTeam").data("kendoMobileListView").dataSource.filter({});
                            $("#lvMyTeamStatus").data("kendoMobileListView").dataSource.filter({});
                        }
                    },
                    change: function() {
                        var value = this.value();
                        if (value) {
                            $("#lvMyTeam").data("kendoMobileListView").dataSource.filter({
                                logic: "and",
                                filters: [{
                                    field: "teamName",
                                    operator: "eq",
                                    value: value
                                }, {
                                    field: "fullName",
                                    operator: "neq",
                                    value: null
                                }]
                            });
                             $("#lvMyTeamStatus").data("kendoMobileListView").dataSource.filter({
                                logic: "and",
                                filters: [{
                                    field: "teamName",
                                    operator: "eq",
                                    value: value
                                }, {
                                    field: "fullName",
                                    operator: "neq",
                                    value: null
                                }]
                            });
                        } else {
                            $("#lvMyTeam").data("kendoMobileListView").dataSource.filter({});
                            $("#lvMyTeamStatus").data("kendoMobileListView").dataSource.filter({});
                        }
                    },
                    //optionLabel: "Select a team...",
                    dataTextField: "value",
                    dataValueField: "value",
                    dataSource: new kendo.data.DataSource({
                        transport: {
                            beforeSend: app.loginService.viewModel.checkOnline,
                            read: function(operation) {
                                if (app.configService.isMorkupData) {
                                    var response={};
                                    operation.success(response);

                                } else {
                                    $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                        type: "POST",
                                        timeout: 180000,
                                        url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMyTeam.json',
                                        data: JSON.stringify({
                                            "token": localStorage.getItem("token"),
                                            "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                            "zoneId": "",
                                            "version": "2"
                                        }),
                                        dataType: "json",
                                        contentType: 'application/json',
                                        success: function(response) {
                                            //store response
                                            //localStorage.setItem("regionData", JSON.stringify(response));
                                            //pass the pass response to the DataSource

                                            //navigator.notification.alert(JSON.stringify(response),
                                            //                        function () { }, "Get Team failed", 'OK');
                                            operation.success(response);


                                            //console.debug("fetch Team : Complete");
                                            //console.log(JSON.stringify(response));
                                        },
                                        error: function(xhr, error) {
                                            //console.debug("Get Team failed");
                                            //console.debug(xhr);
                                            //console.debug(error);
                                            if (!app.ajaxHandlerService.error(xhr, error)) {
                                                navigator.notification.alert(xhr.status + ' ' + error,
                                                    function() {}, "Get Team failed", 'OK');
                                            }
                                            return;
                                        }
                                    });
                                }

                            }
                        },
                        schema: {
                            data: "myTeams",
                            model: {
                                id: "value",
                                fields: {
                                    value: {}
                                }
                            }
                        },
                        group: {
                            field: "teamName"
                        }
                    }),
                    // The options are needed only for the desktop demo, remove them for mobile.
                    //popup: {
                    //appendTo: body
                    //},
                    //animation: {
                    //open: {
                    //effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down"
                    //}
                    //}
                });
            }
        },
        loadMyTeamStatus: function() {
            var that = this,
                myTeamStatus;
            myTeamStatus = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            var response={};
                            operation.success(response);
                            that.set("lastupdateteam", format_time_date(new Date()));


                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMyTeamStatus.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "zoneId": "",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //console.log(JSON.stringify(response));
                                    //pass the pass response to the DataSource
                                    //navigator.notification.alert(JSON.stringify(response),
                                    //                        function () { }, "Get My Team failed", 'OK');
                                    operation.success(response);

                                    that.set("lastupdateteam", format_time_date(new Date()));

                                    //navigator.notification.alert(JSON.stringify(response),
                                    //                        function () { }, "Get My Team failed", 'OK');

                                    //console.log("fetch My Team : Complete");
                                },
                                error: function(xhr, error) {
                                    //console.debug("Get My Team failed");
                                    //console.debug(xhr);
                                    //console.debug(error);
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "Get My Team by Status failed", 'OK');
                                    }
                                    return;
                                },
                                complete: function() {

                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "myTeams"
                }
            });

            //console.log(JSON.stringify(myTeam));

            if ($("#lvMyTeamStatus").data("kendoMobileListView") != undefined && $("#lvMyTeamStatus").data("kendoMobileListView") != null) {
                $("#lvMyTeamStatus").data("kendoMobileListView").setDataSource(myTeamStatus);
            } else {
                $("#lvMyTeamStatus").kendoMobileListView({
                    dataSource: myTeamStatus,
                    click: function(e) {
                        app.myTeamService.viewModel.gotoReallocateWithStatus(e);
                    },
                    dataBound: function() {
                        that.hideLoading();
                    },
                    //virtualViewSize: 30,
                    //endlessScroll: true,
                    pullToRefresh: true,
                    template: $("#myteam-status-template").html(),
                });
            }
        },
        loadMyTeam: function() {
            var that = this,
                myTeam;
            //console.log("fetch My Team");
            myTeam = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            var response={};
                            operation.success(response);
                            that.set("lastupdateteam", format_time_date(new Date()));


                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMyTeam.json',
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "zoneId": "",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //store response
                                    //console.log(JSON.stringify(response));
                                    //pass the pass response to the DataSource
                                    //navigator.notification.alert(JSON.stringify(response),
                                    //                        function () { }, "Get My Team failed", 'OK');
                                    operation.success(response);

                                    that.set("lastupdateteam", format_time_date(new Date()));

                                    //navigator.notification.alert(JSON.stringify(response),
                                    //                        function () { }, "Get My Team failed", 'OK');

                                    //console.log("fetch My Team : Complete");
                                },
                                error: function(xhr, error) {
                                    //console.debug("Get My Team failed");
                                    //console.debug(xhr);
                                    //console.debug(error);
                                    that.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "Get My Team failed", 'OK');
                                    }
                                    return;
                                },
                                complete: function() {

                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "myTeams"
                }
            });

            //console.log(JSON.stringify(myTeam));

            if ($("#lvMyTeam").data("kendoMobileListView") != undefined && $("#lvMyTeam").data("kendoMobileListView") != null) {
                $("#lvMyTeam").data("kendoMobileListView").setDataSource(myTeam);
            } else {
                $("#lvMyTeam").kendoMobileListView({
                    dataSource: myTeam,
                    click: function(e) {
                        app.myTeamService.viewModel.gotoReallocate(e);
                    },
                    dataBound: function() {
                        that.hideLoading();
                    },
                    //virtualViewSize: 30,
                    //endlessScroll: true,
                    pullToRefresh: true,
                    template: $("#myteam-template").html(),
                });
            }
            //console.log("fetch My Team : Finish");
            /*$("#lvMy").kendoMobileListView({
            	dataSource: new kendo.data.DataSource({
                    transport: {
                    	read: {
                    		url: "data/myTeam.json",
                    		dataType: "json"
                    	}
                    },
                    filter: { 
                    	field: "NAME", 
                    	operator: "eq", 
                    	value: "APICHARD" 
                    	}
                }),
                pullToRefresh: true,
                style: "inset"
            });*/

            /*$("#lvTeam").kendoMobileListView({
                dataSource: JSON.parse(localStorage.getItem("teamData")),
                template: $("#team-template").html(),
                pullToRefresh: true,
                style: "inset"
            });*/
            app.myTeamService.viewModel.loadMyTeamStatus();

        },
        loadMyTeamSearch: function() {
            var that = app.myTeamService.viewModel,
                myTeam;
            //that.hideLoading();
            //console.log("aaa");	
            that.set("isSearch", !that.get("isSearch"));
            //console.log("fetch My Team");
            myTeam = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {

                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            beforeSend: app.loginService.viewModel.checkOnline,
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTeam.json',
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                "jobId": app.myTeamService.viewModel.get("jobIdSearch"),
                                "version": "2"
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            success: function(response) {
                                //store response
                                //localStorage.setItem("regionData", JSON.stringify(response));
                                //pass the pass response to the DataSource
                                //navigator.notification.alert(JSON.stringify(response),
                                //                        function () { }, "Get My Team failed", 'OK');
                                operation.success(response);
                                app.reallocateService.viewModel.set("reallocateDataSource", myTeam);
                                that.set("lastupdateteam", format_time_date(new Date()));
                                //navigator.notification.alert(JSON.stringify(response),
                                //                        function () { }, "Get My Team failed", 'OK');

                                //console.log("fetch My Team : Complete");
                            },
                            error: function(xhr, error) {
                                //console.debug("Get My Team failed");
                                //console.debug(xhr);
                                //console.debug(error);
                                that.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    navigator.notification.alert(xhr.status + ' ' + error,
                                        function() {}, "Get My Team failed", 'OK');
                                }
                                return;
                            },
                            complete: function() {
                                //app.myTeamService.viewModel.set("jobIdSearch","");
                            }
                        });
                    }
                },
                schema: {
                    data: "jobTeams"
                }
            });
            //console.log("aaa");
            if ($("#lvTeamSearch").data("kendoMobileListView") != undefined && $("#lvTeamSearch").data("kendoMobileListView") != null) {
                $("#lvTeamSearch").data("kendoMobileListView").setDataSource(myTeam);
            } else {
                $("#lvTeamSearch").kendoMobileListView({
                    dataSource: myTeam,
                    template: $("#reallocate-Search-template").html(),
                    //pullToRefresh: true,
                    //virtualViewSize: 40,
                    //endlessScroll: true,
                    dataBound: function() {
                        that.hideLoading();
                    }
                });
            }
            //console.log("fetch My Team : Finish");
            /*$("#lvMy").kendoMobileListView({
            	dataSource: new kendo.data.DataSource({
                    transport: {
                    	read: {
                    		url: "data/myTeam.json",
                    		dataType: "json"
                    	}
                    },
                    filter: { 
                    	field: "NAME", 
                    	operator: "eq", 
                    	value: "APICHARD" 
                    	}
                }),
                pullToRefresh: true,
                style: "inset"
            });*/

            /*$("#lvTeam").kendoMobileListView({
                dataSource: JSON.parse(localStorage.getItem("teamData")),
                template: $("#team-template").html(),
                pullToRefresh: true,
                style: "inset"
            });*/


        },
        gotoReallocate: function(e) {

            //console.log( "object : " + e.target.data("userid"));
            if (e.target.data("userid") != null && e.target.data("userid") != undefined && e.target.data("userid") != "") {
                var userid = e.target.data("userid");
                var username = e.target.data("username");
                var priorityid = e.target.data("priorityid");
                var priorityname = e.target.data("priorityname");
                var statusid = e.target.data("statusid");
                var statusname = e.target.data("statusname");
                //reallocateService
                app.reallocateService.viewModel.set("selectUserId", userid);
                app.reallocateService.viewModel.set("selectUserName", username);
                app.reallocateService.viewModel.set("selectPriorityId", priorityid);
                app.reallocateService.viewModel.set("selectPriorityName", priorityname);
                app.reallocateService.viewModel.set("selectStatusId", statusid);
                app.reallocateService.viewModel.set("selectStatusName", statusname);
                //console.log("selectUserId : " + userid);
                //console.log("selectPriorityId : " + priorityid);
                //console.log("selectUserName : " + username);
                //console.log("selectPriorityName : " + priorityname);

                app.application.navigate(
                    '#Re-Allocate'
                );
            }
        },
        gotoReallocateWithStatus: function(e) {

            //console.log(JSON.stringify(e));
            if (e.target.data("userid") != null && e.target.data("userid") != undefined && e.target.data("userid") != "") {
                var userid = e.target.data("userid");
                var username = e.target.data("username");
                var priorityid = e.target.data("priorityid");
                var priorityname = e.target.data("priorityname");
                var statusid = e.target.data("statusid");
                var statusname = e.target.data("statusname");
                //reallocateService
                app.reallocateService.viewModel.set("selectUserId", userid);
                app.reallocateService.viewModel.set("selectUserName", username);
                app.reallocateService.viewModel.set("selectPriorityId", priorityid);
                app.reallocateService.viewModel.set("selectPriorityName", priorityname);
                app.reallocateService.viewModel.set("selectStatusId", statusid);
                app.reallocateService.viewModel.set("selectStatusName", statusname);
                //console.log("selectUserId : " + userid);
                //console.log("selectPriorityId : " + priorityid);
                //console.log("selectUserName : " + username);
                //console.log("selectPriorityName : " + priorityname);

                app.application.navigate(
                    '#Re-AllocateWithStatus'
                );
            }
        },
        gotoDetailSearch: function(e) {
            var txtJob = $(e.target).closest("form").find("input[type=search]");
            var jobId = txtJob.val();
            var validJob = false;

            if (jobId.length == 11) {
                var jbSearchId = jobId;

                app.jobService.viewModel.set("isSearch", false);
                validJob = true;
                //app.jobService.viewModel.exeDetailSearch(jbSearchId);
            } else if (jobId.length < 7 && jobId.length != 0) {
                var str = jobId;
                var pad = "000000";
                var d = new Date();
                var n = d.getFullYear();
                var jbSearchId = "JB" + n.toString().substring(2, 4) + "-" + pad.substring(0, pad.length - str.length) + str;
                txtJob.val(jbSearchId);

                app.jobService.viewModel.set("returnUrl", "#tabstrip-team");
                validJob = true;
                //var implement = true;


            } else if (jobId.length == 0) {
                navigator.notification.alert("Please fill JOB ID",
                    function() {
                        return false;
                    }, "JOB ID: Empty", 'OK');
            } else {
                navigator.notification.alert("JBxx - xxxxxx or xxxxxx",
                    function() {
                        return false;
                    }, "JOB ID: Wrong format", 'OK');
            }

            if (validJob) {
                ///not implement
                //that.set("searchtxt", "jobId");
                app.myTeamService.viewModel.set("jobIdSearch", jobId);
                app.application.navigate(
                    '#tabstrip-teamsearch'
                );
            }

        },
        gotoPserach: function(){
           app.powerSearchService.viewModel.set("titletxt", "Team/My Team Job Search");
           //paramsSearch
           app.powerSearchService.viewModel.set("paramsSearch", "");
           app.application.navigate('#powerSearch');
        },
        onSearch: function() {
            var that = this;
            that.set("isSearch", !that.get("isSearch"));
            that.set("searchtxt", "");
        },
        onSearchTeam: function() {
            var that = this;
            that.set("isSearch", !that.get("isSearch"));
            that.set("searchtxt", "");
        },
        refresh: function() {
            app.myTeamService.viewModel.loadMyTeam();
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

    app.myTeamService = {
        init: function() {
            //console.log("myteam init start");
            //app.myTeamService.viewModel.set("_isLoading ",true);
            //app.myTeamService.viewModel.set("lastupdateteam ",format_time_date(new Date()));
            //console.log("gfilesystem" + gFileSystem.name);
            //console.log(format_time_date(new Date()));
            //console.log("myteam init end");
        },
        initSearch: function() {
            //console.log("myteam init start");
            //app.myTeamService.viewModel.set("_isLoading ",true);
            //app.myTeamService.viewModel.set("lastupdateteam ",format_time_date(new Date()));
            //console.log("gfilesystem" + gFileSystem.name);
            //console.log(format_time_date(new Date()));
            //console.log("myteam init end");
        },
        show: function() {
            var txtJob = this.element.closest("form").find("input[type=search]");
            txtJob.val('');
            //console.debug("myteam show start");
            app.myTeamService.viewModel.showLoading();
            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {

                sleep(1);
                //setTimeout(function () {
                app.myTeamService.viewModel.loadMyTeam();
                app.myTeamService.viewModel.initDropdown();
                
                //}, 1000);

                //app.myTeamService.viewModel.hideLoading();
            } else {
                navigator.notification.alert("offline",
                    function() {
                        app.myTeamService.viewModel.hideLoading();
                    }, "Internet Connection", 'OK');
            }

            //console.debug("myteam hide hide");
        },
        showSearch: function() {
            var txtJob = this.element.closest("form").find("input[type=search]");
            txtJob.val('');
            //console.debug("myteam show start");

            var isOffline = app.loginService.viewModel.get("isOffline");
            if (!isOffline) {
                //setTimeout(function() {
                app.masterService.viewModel.showLoading();
                //}, 0);
                //app.myTeamService.viewModel.showLoading();
                //app.myTeamService.viewModel.initDropdown();

                app.myTeamService.viewModel.loadMyTeamSearch();

                //app.myTeamService.viewModel.hideLoading();
            } else {
                navigator.notification.alert("offline",
                    function() {}, "Internet Connection", 'OK');
            }

            //console.debug("myteam hide hide");
        },
        hide: function() {
            //console.debug("myteam hide start");
            //app.myTeamService.viewModel.hideLoading();
            //console.debug("myteam hide hide");
        },
        hideSearch: function() {
            //console.debug("myteam hide start");
            //app.myTeamService.viewModel.hideLoading();
            //console.debug("myteam hide hide");
        },
        viewModel: new MyTeamViewModel()
    }
})(window);