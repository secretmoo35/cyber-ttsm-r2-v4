(function(global) {
    var _zone = "";
    app = global.app = global.app || {};


    DashboardFilterViewModel = kendo.data.ObservableObject.extend({
        zones: null,
        initFilter: function(e) {
            //console.log("######### DashboardFilter ############");
            var that = app.dashboardFilterService.viewModel;

            var body = $(".km-pane");

            // console.log("Zone Selected : " + zones);
            that.set("zones", null);
            console.log("initFilter");

            var dataRegion = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({
                            beforeSend: app.loginService.viewModel.checkOnline,
                            url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getRegionByUser.json",
                            type: "POST",
                            timeout: 180000,
                            data: JSON.stringify({
                                "token": localStorage.getItem("token"),
                                "userId": "" + JSON.parse(localStorage.getItem("profileData")).userId + "",
                                "version": "2"
                            }),
                            dataType: "json",
                            contentType: 'application/json',
                            //async: false,
                            success: function(response) {
                                //alert(JSON.stringify(response));
                                //console.log("######### Region :>"+JSON.stringify(response));
                                operation.success(response.regions);

                            },

                            error: function(xhr, error) {
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("dashboard filter : getRegionByUser fail!");
                                    ////console.log(xhr);
                                    ////console.log(error);

                                    navigator.notification.alert(xhr.status + ' ' + error,
                                        function() {}, "DF : getRegionByUser fail!", 'OK');
                                }
                                //alert('');
                                //location = '#';
                                //return;
                            }
                        });
                    }
                }
            });


            if (kendo.ui.DropDownList) {
                $("#ddregion").kendoDropDownList({
                    dataTextField: "id",
                    dataValueField: "id",
                    //dataSource: JSON.parse(localStorage.getItem("regionData")).regions,
                    dataSource: dataRegion,
                    dataBound: that.call_ddw_zone,
                    // The options are needed only for the desktop demo, remove them for mobile.                    
                    //popup: { appendTo: body },
                    //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } },
                    change: that.call_ddw_zone,
                    //value: "BKK"
                    index: 0

                });


                //$("#ddsite").kendoDropDownList({
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
                        read: function(operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getPriority.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function(response) {
                                    //alert(JSON.stringify(response));
                                    operation.success(response.priorityList);

                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard filter : getPriority fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "DF : getPriority fail!", 'OK');
                                    }
                                    //alert('dashboard filter : load Priority fail!');
                                    //location = '#';
                                    //return;
                                }
                            });
                        }
                    }
                });
                var dataSubSystem = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getAllSubSystem.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function(response) {
                                    //alert(JSON.stringify(response));

                                    operation.success(response.subSystems);

                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard filter : getAllSubSystem fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "DF : getAllSubSystem fail!", 'OK');
                                    }
                                    //alert('dashboard filter : load subSystems fail!');
                                    //location = '#';
                                    //return;
                                }
                            });
                        }
                    }
                });
                var dataTeam = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getTeamByUser.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": "" + JSON.parse(localStorage.getItem("profileData")).userId + "",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function(response) {
                                    //alert(JSON.parse(localStorage.getItem("profileData")).userId);
                                    //alert(JSON.stringify(response));
                                    operation.success(response.teamMaster);

                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard filter : getTeamByUser fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "DF : getTeamByUser fail!", 'OK');
                                    }
                                    //alert('dashboard filter : load getTeamByUser fail!');
                                    //location = '#';
                                    //return;
                                }
                            });
                        }
                    }
                });
                var dataNetwork = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getSystemMaster.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                //async: false,
                                success: function(response) {
                                    //alert(JSON.stringify(response));

                                    if ($('#ul_subsystem_1').html() == "" && $('#ul_subsystem_2').html() == "") {
                                        var tx_1 = "",
                                            tx_2 = "",
                                            all = 0;
                                        $.each(response.systemMaster, function(i, item) {
                                            if (i % 2 == 0) {
                                                tx_1 += '<li>' +
                                                    '<label> ' +
                                                    '<input id="checkBox_subsystem_' + i + '" class="checkBox_subsystem" value="' + item.systemGroup + '" type="checkbox" checked="checked" />' +
                                                    '' + item.systemGroup + '' +
                                                    ' </label>' +
                                                    '</li>';
                                            } else {
                                                tx_2 += '<li>' +
                                                    '<label> ' +
                                                    '<input id="checkBox_subsystem_' + i + '" class="checkBox_subsystem" value="' + item.systemGroup + '" type="checkbox" checked="checked" />' +
                                                    '' + item.systemGroup + '' +
                                                    ' </label>' +
                                                    '</li>';
                                            }
                                            all++;
                                        });
                                        //alert(tx);

                                        $('#ul_subsystem_1').html(tx_1);
                                        $('#ul_subsystem_2').html(tx_2);
                                        $(".checkBox_subsystem").bind("click", function() {
                                            //alert($('.checkBox_subsystem:checked').length + ':' + all);
                                            if ($('.checkBox_subsystem:checked').length == all) {
                                                $('#all_checkBox_subsystem').prop('checked', true);
                                            } else {
                                                $('#all_checkBox_subsystem').prop('checked', false);
                                            }

                                        });
                                        $("#all_checkBox_subsystem").bind("click", function() {
                                            $('.checkBox_subsystem').prop('checked', this.checked);
                                        });
                                    }


                                    operation.success(response.subSystems);

                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard filter : getSystemMaster fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "DF : getSystemMaster fail!", 'OK');
                                    }
                                    //alert('dashboard filter : load subSystems fail!');
                                    //location = '#';
                                    //return;
                                }
                            });
                        }
                    }
                });
                dataNetwork.read();

                $("#ddsteam").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "teamName",
                    dataValueField: "teamId",
                    dataSource: dataTeam,
                    //dataSource: JSON.parse(localStorage.getItem("teamData")),
                    change: function() {
                        var value = this.value();
                        if (value) {
                            //$("#ddfield").data("kendoDropDownList").dataSource.filter({ field: "TEAM_ID", operator: "eq", value: value });
                        } else {
                            //$("#ddfield").data("kendoDropDownList").dataSource.filter({});
                        }
                    },
                    // The options are needed only for the desktop demo, remove them for mobile.
                    //popup: { appendTo: body },
                    //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });

                $("#ddPriority").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "name",
                    dataValueField: "id",
                    dataSource: dataPriority,
                    //dataSource: JSON.parse(localStorage.getItem("priorityData")),
                    // The options are needed only for the desktop demo, remove them for mobile.
                    //popup: { appendTo: body },
                    //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });
                $("#ddsubSystem").kendoDropDownList({
                    optionLabel: "-- All --",
                    dataTextField: "description",
                    dataValueField: "description",
                    dataSource: dataSubSystem,
                    //dataSource: JSON.parse(localStorage.getItem("statusData")),
                    // The options are needed only for the desktop demo, remove them for mobile.
                    //popup: { appendTo: body },
                    //animation: { open: { effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down" } }
                });



                //$("#ddfield").kendoDropDownList({
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

                //$("#dddlteam").kendoDropDownList().data("kendoDropDownList").span().css("background-color", "#BDD1FF !important");
            }
        },
        multiZone: function() {
            var that = this;

            _zone = "";

            $.each($("input:checkbox[class^='chkZone-']"), function(index, val) {
                if (val.checked) {
                    var id = val.className.replace(/chkZone-/g, '').split(' ')[0];
                    _zone = _zone + id + ","

                }


            });

            if(_zone && _zone.length >= 1)
            {
            	_zone = _zone.substring(0, _zone.length-1);
            }

            that.set("zones", _zone);
            app.application.navigate(
                '#dashboardFilter'
            );
        },
        call_ddw_zone: function(zId) {
            
            //jigkoh clare zone selected
            // that.set("zones", "");
            $("#lvZoneFilter").kendoMobileListView({
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=master-service&o=getZoneByRegionUser.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify({
                                    "token": localStorage.getItem("token"),
                                    "userId": "" + JSON.parse(localStorage.getItem("profileData")).userId + "",
                                    "regionId": "" + $("#ddregion").val(),
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    //alert(JSON.stringify(response));
                                    operation.success(response.zones);
                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard filter : getZoneByRegionUser fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "DF : getZoneByRegionUser fail!", 'OK');
                                    }
                                    //alert('dashboard filter : load zone fail!');
                                    //location = '#';
                                    //return;
                                }
                            });
                        }
                    }
                }),
                style: "inset",
                template: $("#multi-zone-template").html(),
            });
        },
        refresh: function() {
            $('#hidden_dashboard').val('set');
            app.application.navigate(
                '#Dashboard'
            );
            //_dashboard_page = 1;
            //$('#div_dashboard_bottom').hide();
            //app.dashboardService.hide();
            //$("#div_dashboard").data("kendoMobileScroller").scrollTo(0, 0);
            //for (var i = 1; i <= 20; i++) {
            //    $("#lvDashboard"+i).kendoListView({
            //        dataSource: null
            //    });
            //}
            //app.dashboardService.viewModel.loaddata();
        }


    });

    app.dashboardFilterService = {
        init: function() {
            app.dashboardFilterService.viewModel.initFilter();
            
        },
        viewModel: new DashboardFilterViewModel()
    }

})(window);