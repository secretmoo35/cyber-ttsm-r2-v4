(function(global) {
    var FaDelProblemCauseViewModel,
        app = global.app = global.app || {};


    FaDelProblemCauseViewModel = kendo.data.ObservableObject.extend({
        _isLoading: true,
        userId: function() {
            var cache = localStorage.getItem("profileData");
            if (cache == null || cache == undefined) {
                return null;
            } else {
                return JSON.parse(cache).userId;
            }
        },
        initFaProblemCauseMaster: function() {
            var that = this;

            $("#lvFProblemCauseD").kendoMobileListView({
                dataSource: {
                    transport: {
                        read: function(operation) {
                            //operation.success(JSON.parse(localStorage.getItem("favoriteProblemCausesData")));
                            if (app.configService.isMorkupData) {
                                var response = {
                                    "favoriteProblemCauses": [{
                                        "userId": "7478",
                                        "favProblemCauseId": "6",
                                        "problemCauseMainId": "02",
                                        "problemCauseDesc": "Transmission",
                                        "problemCauseSubId": "016",
                                        "problemCauseSubDesc": "Connector/Patch cord"
                                    }, {
                                        "userId": "7478",
                                        "favProblemCauseId": "2",
                                        "problemCauseMainId": "08",
                                        "problemCauseDesc": "AC MAIN FAILED",
                                        "problemCauseSubId": "042",
                                        "problemCauseSubDesc": "MEA/PEA Failed"
                                    }, {
                                        "userId": "7478",
                                        "favProblemCauseId": "1",
                                        "problemCauseMainId": "08",
                                        "problemCauseDesc": "AC MAIN FAILED",
                                        "problemCauseSubId": "050",
                                        "problemCauseSubDesc": "Phase Error / Loss of Phase"
                                    }],
                                    "version": "1",
                                    "userId": "7478",
                                    "jobId": ""
                                };
                                localStorage.setItem("favoriteProblemCausesData", JSON.stringify(response));
                            } else {
                                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                    type: "POST",
                                    timeout: 180000,
                                    url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getFavoriteProblemCauseTTSME.json',
                                    data: JSON.stringify({
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "statusId": "",
                                        "version": "2"
                                    }),

                                    dataType: "json",
                                    contentType: 'application/json',
                                    success: function(response) {
                                        localStorage.setItem("favoriteProblemCausesData", JSON.stringify(response));
                                        operation.success(response);
                                        //that.hideLoading();
                                        ////console.log("fetch Reason Over Due Data : Complete");
                                        ////console.log("Reason Over Due Data :" + JSON.stringify(response));
                                    },
                                    error: function(xhr, error) {

                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            var cache = localStorage.getItem("favoriteProblemCausesData");

                                            if (cache == null || cache == undefined) {
                                                ////console.log("Get Reason Over Due failed");
                                                ////console.log(xhr);
                                                ////console.log(error);
                                                navigator.notification.alert(xhr.status + error,
                                                    function() {}, "Get Favorite Problem Causes failed", 'OK');
                                            }

                                        }
                                        return;
                                    },
                                    complete: function() {
                                        that.hideLoading();
                                    }
                                });
                            }
                        }
                    },
                    schema: {
                        data: "favoriteProblemCauses"
                    }
                },

                template: $("#delfavorite-problem-cause-template").html(),
                databound: function() {
                    that.hideLoading();
                },
                filterable: {
                    field: "problemCauseDesc",
                    ignoreCase: true
                },
            });
            ////console.log('lv Problemcause Master Loaded');

        },
        onDelProbmD: function() {
            var that = app.jobService.viewModel;
            $.each($("input:checkbox[class^='DF']"), function(index, val) {
                if (val.checked) {
                    console.log(val.alt);
                    if (val.alt) {
                        var arrId = val.alt.split("|");
                        var arrLength = arrId.length;
                        var lastestId = arrId[arrLength - 1];
                        console.log("lastestId : " + lastestId);

                        var dataValue = {
                            "token": localStorage.getItem("token"),
                            "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                            "favoriteId": lastestId,
                            "favoriteType": "S",
                            "version": "2"

                            // favoriteId: "1"
                            // favoriteType: "S"
                            // token: ""
                            // userId: "7478"
                            // version: "2"
                        };
                        $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                            type: "POST",
                            timeout: 180000,
                            url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=deleteFavoriteProblemCause.json',
                            data: JSON.stringify(dataValue),
                            dataType: "json",
                            //async: false,
                            contentType: 'application/json',
                            success: function(response) {

                                var lvFProblemCauseD = $("#lvFProblemCauseD").data("kendoMobileListView");
                                lvFProblemCauseD.dataSource.read();
                                lvFProblemCauseD.refresh();
                                var lvFProblemCause = $("#lvFProblemCause").data("kendoMobileListView");
                                lvFProblemCause.dataSource.read();
                                lvFProblemCause.refresh();
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

                    }
                }




            });

        },
        showFaProblemCauseMaster: function() {
            var that = this;
            // app.masterService.viewModel.loadFavoriteProblemCauses();
            // var aa = JSON.parse(localStorage.getItem("favoriteProblemCausesData"));
            var lvFProblemCauseD = $("#lvFProblemCauseD").data("kendoMobileListView");
            lvFProblemCauseD.dataSource.read();
            lvFProblemCauseD.refresh();
            var lvFProblemCause = $("#lvFProblemCause").data("kendoMobileListView");
            lvFProblemCause.dataSource.read();
            lvFProblemCause.refresh();
        },
        loadFaProblemCauseMaster: function() {
            var that = this;
            var lvProblemCauseMaster = $("#lvFProblemCauseD").data("kendoMobileListView");
            //lvProblemCauseMaster.reset();
            app.application.view().scroller.reset();
        },
        setFaProblemSolveRadio: function() {
            var that = app.jobService.viewModel;

            var selectItem = that.get("selectItem");

            var problemSolveRadioData = null;

            var selectProblemC = that.get("selectProblemC");
            var selectProblemS = that.get("selectProblemS");

            var problemSolveData = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        operation.success(JSON.parse(localStorage.getItem("favoriteProblemCausesData")));
                    }
                },
                schema: {
                    data: "favoriteProblemCauses"
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

                problemSolveData.fetch(function() {
                    problemSolveRadioData = new kendo.data.DataSource({
                        transport: {
                            read: function(operation) {
                                operation.success(problemSolveData.view());
                            }
                        },
                        filter: [{
                            field: "description",
                            operator: "eq",
                            value: "Temporary"
                        }]
                    });

                    ////console.log(JSON.stringify(problemSolveData));

                    problemSolveRadioData.fetch(function() {
                        data = problemSolveRadioData.view();
                        if (data.length > 0) {
                            var a = data.length;
                            for (var i = 0; i < a; i++) {

                                if (selectProblemS != undefined && selectProblemS != null) {
                                    selectProblemS.fetch(function() {

                                        dataS = selectProblemS.data();
                                        if (dataS.length > 0) {

                                            var flagDup = false;
                                            var b = dataS.length;

                                            for (var j = 0; j < b; j++) {
                                                if (data[i].subproblemCauseId == dataS[j].subProblemCauseId) {
                                                    var flagDup = true;
                                                    //return false;
                                                    j = dataS.length;
                                                }
                                            }

                                            if (!flagDup) {
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
                                        } else {
                                            var pbs = [{
                                                "jobId": selectItem.jobId,
                                                "problemSolveId": data[i].id,
                                                "problemSolveDesc": data[i].subProblemCauseDesc + "-" + data[i].description,
                                                "processDesc": "",
                                                "subProblemCauseId": data[i].subproblemCauseId,
                                                "process": "N"
                                            }];
                                            selectProblemS = new kendo.data.DataSource({
                                                data: pbs
                                            });
                                        }
                                    })
                                } else {
                                    var pbs = [{
                                        "jobId": selectItem.jobId,
                                        "problemSolveId": data[i].id,
                                        "problemSolveDesc": data[i].subProblemCauseDesc + "-" + data[i].description,
                                        "processDesc": "",
                                        "subProblemCauseId": data[i].subproblemCauseId,
                                        "process": "N"
                                    }];
                                    selectProblemS = new kendo.data.DataSource({
                                        data: pbs
                                    });

                                }
                            }
                        }
                        if (selectProblemS != null && selectProblemS != undefined) {
                            selectProblemS.fetch(function() {
                                that.set("selectProblemS", selectProblemS);
                            });
                        } else {
                            that.set("selectProblemS", new kendo.data.DataSource());

                        }
                    });
                });
            }

            //
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

    app.fadelProblemCauseService = {
        init: function() {
            ////console.log("myteam init start");
            app.fadelProblemCauseService.viewModel.initFaProblemCauseMaster();
            ////console.log("myteam init end");
        },
        show: function() {

            //app.faProblemCauseService.viewModel.showFaProblemCauseMaster();
            //app.faProblemCauseService.viewModel.initFaProblemCauseMaster();
            ////console.log("myteam show start");
            //app.problemCauseService.viewModel.showLoading();
            //app.problemCauseService.viewModel.loadProblemCauseMaster();
            //app.myService.viewModel.hideLoading(////console.logle.debug("myteam hide hide");
        },
        hide: function() {
            ////console.log("myteam hide start");
            //app.myService.viewModel.hideLoading();
            ////console.log("myteam hide hide");
        },
        viewModel: new FaDelProblemCauseViewModel()
    }
})(window);
