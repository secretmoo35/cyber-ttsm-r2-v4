(function(global) {
    var fardelProblemCauseViewModel,
        app = global.app = global.app || {};


    fardelProblemCauseViewModel = kendo.data.ObservableObject.extend({
        _isLoading: true,
        userId: function() {
            var cache = localStorage.getItem("profileData");
            if (cache == null || cache == undefined) {
                return null;
            } else {
                return JSON.parse(cache).userId;
            }
        },
        //===========================================================================================
        initFaMProblemCauseMaster: function() {
            var that = this;

            $("#lvFProblemCauseMD").kendoMobileListView({
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
                                localStorage.setItem("favoriteProblemCausesMultiData", JSON.stringify(response));
                            } else {
                                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                    type: "POST",
                                    timeout: 180000,
                                    url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getFavoriteProblemCauseMultiTTSME.json',
                                    data: JSON.stringify({
                                        "token": localStorage.getItem("token"),
                                        "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                        "statusId": "",
                                        "version": "2"
                                    }),

                                    dataType: "json",
                                    contentType: 'application/json',
                                    success: function(response) {
                                        localStorage.setItem("favoriteProblemCausesMultiData", JSON.stringify(response));
                                        operation.success(response);
                                        //that.hideLoading();
                                        ////console.log("fetch Reason Over Due Data : Complete");
                                        ////console.log("Reason Over Due Data :" + JSON.stringify(response));
                                    },
                                    error: function(xhr, error) {

                                        if (!app.ajaxHandlerService.error(xhr, error)) {
                                            var cache = localStorage.getItem("favoriteProblemCausesMultiData");

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

                template: $("#delfavorite-problem-cause-multi-template").html(),
                databound: function() {
                    that.hideLoading();
                },
                filterable: {
                    field: "multiCauseDesc",
                    ignoreCase: true
                },
            });
            ////console.log('lv Problemcause Master Loaded');

        },
        showFaProblemCauseMaster: function() {
            var that = this;
            // app.masterService.viewModel.loadFavoriteProblemCauses();
            // var aa = JSON.parse(localStorage.getItem("favoriteProblemCausesData"));
            var lvFProblemCauseMD = $("#lvFProblemCauseMD").data("kendoMobileListView");
            lvFProblemCauseMD.dataSource.read();
            lvFProblemCauseMD.refresh();
            var lvFProblemCauseM = $("#lvFProblemCauseM").data("kendoMobileListView");
            lvFProblemCauseM.dataSource.read();
            lvFProblemCauseM.refresh();
        },
        loadFaProblemCauseMaster: function() {
            var that = this;
            var lvProblemCauseMaster = $("#lvFProblemCauseMD").data("kendoMobileListView");
            //lvProblemCauseMaster.reset();
            app.application.view().scroller.reset();
            //$("#lvProblemCauseMaster").kendoMobileListView({
            //  dataSource: problemCauseData
            //      },
            //      schema: {
            //          data: "problemCauses"
            //      },
            //      
            //  }),
            //  template: $("#problem-cause-template").html(),
            //});
            ////console.log('lv Problemcause Master Loaded');

        },
        setFarProblemSolveRadio: function() {
            var that = app.jobService.viewModel;

            var selectItem = that.get("selectItem");

            var problemSolveRadioData = null;

            var selectProblemCM = that.get("selectProblemCM");
            var selectProblemSP = that.get("selectProblemSP");

            var problemSolveData = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        operation.success(JSON.parse(localStorage.getItem("favoriteProblemCausesMultiData")));
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
        onDelProbmDM: function() {
            var that = app.jobService.viewModel;
            $.each($("input:checkbox[class^='DM']"), function(index, val) {

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
                            "favoriteType": "M",
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


                                var lvFProblemCauseMD = $("#lvFProblemCauseMD").data("kendoMobileListView");
                                lvFProblemCauseMD.dataSource.read();
                                lvFProblemCauseMD.refresh();
                                var lvFProblemCauseM = $("#lvFProblemCauseM").data("kendoMobileListView");
                                lvFProblemCauseM.dataSource.read();
                                lvFProblemCauseM.refresh();

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
        showLoading: function() {
            //if (this._isLoading) {
            app.application.showLoading();
            //}
        },
        hideLoading: function() {
            app.application.hideLoading();
        },

    });

    app.delfavoriteProblemCauseMService = {
        init: function() {
            ////console.log("myteam init start");
            app.delfavoriteProblemCauseMService.viewModel.initFaMProblemCauseMaster();
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
        viewModel: new fardelProblemCauseViewModel()
    }
})(window);
