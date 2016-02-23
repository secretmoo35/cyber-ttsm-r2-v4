(function (global) {
    var _dataFilter_map = [];
    app = global.app = global.app || {};


    MapFilterViewModel = kendo.data.ObservableObject.extend({
        initFilter: function (e) {
			var that = app.mapFilterService.viewModel;
			
            var body = $(".km-pane");
            // var dataRegion = new kendo.data.DataSource({
            //     transport: {
            //         read: function (operation) {
            //             $.ajax({
            //                 beforeSend: app.loginService.viewModel.checkOnline,
            //                 url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getRegionByUser.json",
            //                 type: "POST", timeout: 180000,
            //                 data: JSON.stringify({ "token": localStorage.getItem("token"),"userId":""+JSON.parse(localStorage.getItem("profileData")).userId+"", "version": "2" }),
            //                 dataType: "json",
            //                 contentType: 'application/json',
            //                 //async: false,
            //                 success: function (response) {
            //                     //alert(JSON.stringify(response));
            //                     operation.success(response.regions);

            //                 },

            //                 error: function (xhr, error) {
            //                     if (!app.ajaxHandlerService.error(xhr, error)) {
            //                         ////console.log("map filter : getRegionByUser fail!");
            //                         ////console.log(xhr);
            //                         ////console.log(error);

            //                         navigator.notification.alert(xhr.status + ' ' + error,
            //                             function () { }, "MF : getRegionByUser fail!", 'OK');
            //                     }
            //                     //alert('map filter : Region load data fail!');
            //                     //////console.log(':::::::::::::::::::::: getRegionByUser.json :::::: load data fail!');
            //                     //app.application.navigate(
            //                     //            "#"
            //                     //        );
            //                     //return;
            //                 }
            //             });
            //         }
            //     }
            // });


            if (kendo.ui.DropDownList) {
                // $("#dregion").kendoDropDownList({
                //     dataTextField: "id",
                //     dataValueField: "id",
                //     //dataSource: JSON.parse(localStorage.getItem("regionData")).regions,
                //     dataSource: dataRegion,
                //     dataBound: that.call_dw_zone,
                //     // The options are needed only for the desktop demo, remove them for mobile.                    
                //     //popup: { appendTo: body },
                //     //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } },
                //     change: that.call_dw_zone,
                //     //value: "BKK"
                //     index: 0

                // });
                
                
                //$("#dsite").kendoDropDownList({
                //    autoBind: false,
                //    optionLabel: "Select location...",
                //    cascadeFrom: "dregion",
                //    dataTextField: "LOCATION_CODE",
                //    dataValueField: "LOCATION_ID",
                //    dataSource: {},
                //    //dataSource: JSON.parse(localStorage.getItem("locationData")),
                //    // The options are needed only for the desktop demo, remove them for mobile.
                //    popup: { appendTo: body },
                //    animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                //});



                var dataPriority = new kendo.data.DataSource({
                    transport: {
                        read: function (operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getPriority.json",
                                type: "POST", timeout: 180000,
                                data: JSON.stringify({ "token": localStorage.getItem("token"), "version": "2" }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function (response) {
                                    //alert(JSON.stringify(response));
                                    operation.success(response.priorityList);

                                },

                                error: function (xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map filter : getPriority fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function () { }, "MF : getPriority fail!", 'OK');
                                    }
                                    //alert('map filter : load Priority fail!');
                                    //////console.log(':::::::::::::::::::::: getPriority.json :::::: load data fail!');
                                    //app.application.navigate(
                                    //            "#"
                                    //        );
                                    //return;
                                }
                            });
                        }
                    }
                });
                var dataStatus = new kendo.data.DataSource({
                    transport: {
                        read: function (operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getJobStatus.json",
                                type: "POST", timeout: 180000,
                                data: JSON.stringify({ "token": localStorage.getItem("token"), "version": "2" }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function (response) {
                                    //alert(JSON.stringify(response));
                                    operation.success(response.jobStatus);

                                },

                                error: function (xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map filter : getJobStatus fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function () { }, "MF : getJobStatus fail!", 'OK');
                                    }
                                    //alert('map filter : load JobStatus fail!');
                                    //////console.log(':::::::::::::::::::::: getJobStatus.json :::::: load data fail!');
                                    //app.application.navigate(
                                                //"#"
                                            //);
                                    //return;
                                }
                            });
                        }
                    }
                });
                var dataTeam = new kendo.data.DataSource({
                    transport: {
                        read: function (operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getTeamByUser.json",
                                type: "POST", timeout: 180000,
                                data: JSON.stringify({ "token": localStorage.getItem("token"), "userId": "" + JSON.parse(localStorage.getItem("profileData")).userId + "", "version": "2" }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function (response) {
                                    //alert(JSON.parse(localStorage.getItem("profileData")).userId);
                                    //alert(JSON.stringify(response));
                                    operation.success(response.teamMaster);

                                },

                                error: function (xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map filter : getTeamByUser fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function () { }, "MF : getTeamByUser fail!", 'OK');
                                    }
                                    //alert('map filter : load getTeamByUser fail!');
                                    //////console.log(':::::::::::::::::::::: getteamByUser.json :::::: load data fail!');
                                    //app.application.navigate(
                                               // "#"
                                            //);
                                    //return;
                                }
                            });
                        }
                    }
                });



                $("#dsteam").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "teamName",
                    dataValueField: "teamId",
                    dataSource: dataTeam,
                    //dataSource: JSON.parse(localStorage.getItem("teamData")),
                    change: function () {
                        var value = this.value();
                        if (value) {
                            $("#dfield").data("kendoDropDownList").dataSource.filter({ field: "TEAM_ID", operator: "eq", value: value });
                        } else {
                            $("#dfield").data("kendoDropDownList").dataSource.filter({});
                        }
                    },
                    // The options are needed only for the desktop demo, remove them for mobile.
                   // popup: { appendTo: body },
                   // animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });

                $("#dPriority").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "name",
                    dataValueField: "id",
                    dataSource: dataPriority,
                    //dataSource: JSON.parse(localStorage.getItem("priorityData")),
                    // The options are needed only for the desktop demo, remove them for mobile.
                   // popup: { appendTo: body },
                   // animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });
                $("#dstatus").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "status",
                    dataValueField: "jbStatusId",
                    dataSource: dataStatus,
                    //dataSource: JSON.parse(localStorage.getItem("statusData")),
                    // The options are needed only for the desktop demo, remove them for mobile.
                   // popup: { appendTo: body },
                   // animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });
                //$("#dfield").kendoDropDownList({
                //    //autobind: true,
                //    optionLabel: "Select field engineer...",
                //    //cascadeFrom: "dsteam",
                //    dataTextField: "FULLNAME",
                //    dataValueField: "STAFF_ID",
                //    dataSource: {},
                //    //dataSource: JSON.parse(localStorage.getItem("memberData")),
                //    // The options are needed only for the desktop demo, remove them for mobile.
                //    popup: { appendTo: body },
                //    animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                //});

                //$("#ddlteam").kendoDropDownList().data("kendoDropDownList").span().css("background-color", "#BDD1FF !important");
            }
        },
		call_dw_zone: function (zId) {
                    // $("#dzone").kendoDropDownList({
                    //     //autoBind: false,
                    //     optionLabel: "-- All --",
                    //     //cascadeFrom: "dregion",
                    //     dataTextField: "description",
                    //     dataValueField: "id",
                    //     dataSource: {
                    //         serverFiltering: true,
                    //         transport: {
                    //             read: function (operation) {
                    //                 $.ajax({
                    //                     beforeSend: app.loginService.viewModel.checkOnline,
                    //                     //url: "data/data_region.json", // ไม่ต้องผ่าน localhost
                    //                     url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getZoneByRegionUser.json",
                    //                     type: "POST", timeout: 180000,
                    //                     data: JSON.stringify({ "token": localStorage.getItem("token"), "userId": "" + JSON.parse(localStorage.getItem("profileData")).userId + "", "regionId": "" + $("#dregion").val(), "version": "2" }),
                    //                     dataType: "json",
                    //                     contentType: 'application/json',
                    //                     success: function (response) {
                    //                         //alert('call zone');
                    //                         //alert(JSON.stringify(response));
                    //                         operation.success(response.zones);
                    //                     },

                    //                     error: function (xhr, error) {
                    //                         if (!app.ajaxHandlerService.error(xhr, error)) {
                    //                             ////console.log("map filter : getZoneByRegionUser fail!");
                    //                             ////console.log(xhr);
                    //                             ////console.log(error);

                    //                             navigator.notification.alert(xhr.status + ' ' + error,
                    //                                 function () { }, "MF : getZoneByRegionUser fail!", 'OK');
                    //                         }
                    //                         //alert('map filter : load zone fail!');
                    //                         //////console.log(':::::::::::::::::::::: getZoneByRegionUser.json :::::: load data fail!');
                    //                         //app.application.navigate(
                    //                                     //"#"
                    //                                 //);
                    //                         //return;
                    //                     }
                    //                 });

                    //             }
                    //         }
                    //     },
                    //     value: ''+zId,
                    //     //value: "B6",
                    //     // The options are needed only for the desktop demo, remove them for mobile.
                    //     //popup: { appendTo: body },
                    //     //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                    // }).data("kendoDropDownList");;
		},
		checkNull: function (text) {
		    if (text == null) return "";
		    else return text;
		}
        //-------------------------- end viewModel ----------------------


    }
   );

    app.mapFilterService = {
        init: function () {
            //app.mapFilterService.viewModel.initFilter(); //move to #login

        },

        show: function () {
            var regionId, zoneId, jobPriority, jobStatus, teamId, siteCode, fieldEngineer;

            // regionId = app.mapService.viewModel.checkNull($("#dregion").val());
            // zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            regionId = '';
            zoneId = '';
            jobPriority = app.mapService.viewModel.checkNull($("#dPriority").val());
            jobStatus = app.mapService.viewModel.checkNull($("#dstatus").val());
            teamId = app.mapService.viewModel.checkNull($("#dsteam").val());
            //siteCode = $('#dsite').val();
            siteCode ='';
            fieldEngineer = $('#dfield').val();
            
            _dataFilter_map = [regionId, zoneId, jobPriority, jobStatus, teamId, siteCode, fieldEngineer];
            //alert('show : '+_dataFilter_map);

        },

        hide: function () {
            //alert('hide : '+$('#setFilter').val());
            if ($('#setFilter').val() == 'set') {
            } else {
                $('#dregion').data("kendoDropDownList").value(_dataFilter_map[0]);

                app.mapFilterService.viewModel.call_dw_zone(_dataFilter_map[1]);

                //$('#dzone').data("kendoDropDownList").value(_dataFilter_map[1]);
                $('#dPriority').data("kendoDropDownList").value(_dataFilter_map[2]);
                $('#dstatus').data("kendoDropDownList").value(_dataFilter_map[3]);
                $('#dsteam').data("kendoDropDownList").value(_dataFilter_map[4]);

                $('#dsite').val(_dataFilter_map[5]);
                $('#dfield').val(_dataFilter_map[6]);
                //alert('reset');
            }
        },

        viewModel: new MapFilterViewModel()
    }

})(window);