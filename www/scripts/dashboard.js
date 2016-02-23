(function (global) {
    var _dataFilter_dashboard = [],
        _dashboard_page = 1,
        _dataDetail_dashboard = [];
    app = global.app = global.app || {};
    
    dashboardViewModel = kendo.data.ObservableObject.extend({
        checkNull : function (text) {
            if (text == null) return "";
            else return text;
        },

        format_time_date2: function (timess) {
            var datess = moment(timess / 1000, 'X').format("DD-MMMM-YYYY HH:mm:ss");
            return datess;
        },

        loaddata: function (e) {
            
            app.application.showLoading();
            $('#btn_exportDashboardDetail_tomail').hide();
            var userId = JSON.parse(localStorage.getItem("profileData")).userId,
                regionId = app.dashboardService.viewModel.checkNull($("#ddregion").val()),
                zoneId = app.dashboardService.viewModel.checkNull($("#hdMultiZone").val()),
                jobServility = app.dashboardService.viewModel.checkNull($("#ddPriority").val()),
                teamId = app.dashboardService.viewModel.checkNull($("#ddsteam").val()),
                headSystem = "",
                subSystem = app.dashboardService.viewModel.checkNull($("#ddsubSystem").val());

            $('.checkBox_subsystem:checked').each(function (i, item) {
                if (i > 0) headSystem = headSystem + ",";
                headSystem += item.value + "";
            });

            var dataValue = {
                "token": localStorage.getItem("token"),
                "regionId": ""+regionId+"",
                "zoneId": ""+zoneId+"",
                "jobServility": ""+jobServility+"",
                "teamId": "" + teamId + "",
                "headSystem": ""+headSystem+"",
                "subSystem": ""+subSystem+"",
                "userId": "" + userId + "",
                //"userId": "",
                "version": "2"
            };
            
			////console.log("load data dashboard");
			////console.log(JSON.stringify(dataValue));
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                //url: "data/data_region.json", // ไม่ต้องผ่าน localhost
                //url:  serviceUrl + "transaction-service/getDashBoard.json",
                url: app.configService.serviceUrl +"post-json.service?s=transaction-service&o=getDashBoardTTSME.json",
                type: "POST", timeout: 180000,
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json',
                success: function (response) {
                    var checkZero = function (value) {
                        if (value == 0) return " ";
                        else return value;
                    }
                    var chartDate = "";
                    var chartDate2 = "";
                    var datess = "",
                        countDate = 0;
                    var hours = "[";
                    var data_closeInDue = "[";
                    var data_sumOfIndue = "[";
                    var data_sumOfIndue_nonReport = "[";
                    var data_sumOfOverdue_report = "[";
                    var data_sumOfOverdue_nonReport = "[";
                    var _dataExportDashboard = '"DATE", "HOUR", "PERCENT_CLOSE_INDUE", "SUM_OF_INDUE_REPORT", "SUM_OF_INDUE_NON_REPORT", "SUM_OF_OVERDUE_REPORt", "SUM_OF_OVERDUE_NON_REPORT"';
                    //alert('dashboard : '+JSON.stringify(response.dashBoards));
                    ////console.log('dashboard success');
					
					////console.log(JSON.stringify(response.dashBoards));
                    $('#dashboardExportFormCondition').val(JSON.stringify(dataValue));
                    $.each(response.dashBoards, function (i, item) {
                        chartDate = item.jobDate;
                        if (datess != item.jobDate) {
                            if (countDate > 0)
                                chartDate2 += "/";

                            datess = item.jobDate;
                            chartDate2 += item.jobDate;

                            countDate++;
                        } else {

                        }
                        if(i != 0){
                            hours += ',';
                            data_closeInDue += ',';
                            data_sumOfIndue += ',';
                            data_sumOfIndue_nonReport += ',';
                            data_sumOfOverdue_report += ',';
                            data_sumOfOverdue_nonReport += ',';
                        }
                        var isNOW = 'notNOW';
                        if (item.hours == '' + moment().get('hour')) {
                            isNOW = 'isNOW';
                        }
                        hours += '{"label": "' + item.hours + ':00"}';
                        data_closeInDue += '{"value": "' + item.percentSumIndue + '","link": ""}';
                        data_sumOfIndue += '{"value": "' + checkZero(item.sumIndueReport) + '","link": "JavaScript:app.dashboardService.viewModel.loadJobDetail(\'Sum Indue(Report) : ' + item.hours + ':00\', \'' + item.hours + '\', \'Y\', \'I\', \'' + chartDate + '\', \'' + isNOW + '\');"}';
                        data_sumOfIndue_nonReport += '{"value": "' + checkZero(item.sumIndueNotReport) + '","link": "JavaScript:app.dashboardService.viewModel.loadJobDetail(\'Sum Indue (Not Report) : ' + item.hours + ':00\', \'' + item.hours + '\', \'N\', \'I\', \'' + chartDate + '\', \'' + isNOW + '\');"}';
                        data_sumOfOverdue_report += '{"value": "' + checkZero(item.sumOverdueReport) + '","link": "JavaScript:app.dashboardService.viewModel.loadJobDetail(\'Sum Over Due (Report) : ' + item.hours + ':00\', \'' + item.hours + '\', \'Y\', \'O\', \'' + chartDate + '\', \'' + isNOW + '\');"}';
                        data_sumOfOverdue_nonReport += '{"value": "' + checkZero(item.sumOverdueNotReport) + '","link": "JavaScript:app.dashboardService.viewModel.loadJobDetail(\'Sum Over Due (Not Report) : ' + item.hours + ':00\', \'' + item.hours + '\', \'N\', \'O\', \'' + chartDate + '\', \'' + isNOW + '\');"}';

                        _dataExportDashboard += '%0A"' + item.jobDate + '", "' + encodeURIComponent(item.hours) + ':00", "' + encodeURIComponent(item.percentSumIndue) + '", "' + encodeURIComponent(item.sumIndueReport) + '", "' + encodeURIComponent(item.sumIndueNotReport) + '", "' + encodeURIComponent(item.sumOverdueReport) + '", "' + encodeURIComponent(item.sumOverdueNotReport) + '"';
                    });
                    hours += "]";
                    data_closeInDue += "]";
                    data_sumOfIndue += "]";
                    data_sumOfIndue_nonReport += "]";
                    data_sumOfOverdue_report += "]";
                    data_sumOfOverdue_nonReport += "]";

                    hours = JSON.parse(hours);
                    data_closeInDue = JSON.parse(data_closeInDue);
                    data_sumOfIndue = JSON.parse(data_sumOfIndue);
                    data_sumOfIndue_nonReport = JSON.parse(data_sumOfIndue_nonReport);
                    data_sumOfOverdue_report = JSON.parse(data_sumOfOverdue_report);
                    data_sumOfOverdue_nonReport = JSON.parse(data_sumOfOverdue_nonReport);
		  
                    $('#btn_exportDashboard').show();
                    //$('#btn_exportDashboard')
                    //  .attr('href', 'data:application/csv;charset=utf8,' + _dataExportDashboard)
                    //  .attr('download', 'dashboard_' + chartDate2 + '.csv');
                    $('#btn_exportDashboard')
                        .attr('href', "javascript:submitFormByForm('dashboardExportForm');");
                    ////console.log('call data dashboard success');
                    fn_chart(hours, data_closeInDue, data_sumOfIndue, data_sumOfIndue_nonReport, data_sumOfOverdue_report, data_sumOfOverdue_nonReport, chartDate2);
                    //operation.success(response);
                    app.application.hideLoading();
		   
                },
	
                error: function (xhr, error) {
                    app.application.hideLoading();
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        ////console.log("dashboard : getDashBoard fail!");
                        ////console.log(xhr);
                        ////console.log(error);

                        navigator.notification.alert(xhr.status + ' ' + error,
                            function () { }, "Dashboard : getDashBoard fail!", 'OK');
                    }
                }
            });
        },
        
        loadJobDetail: function (text, hour, RF, DF, cDate, isNows) {
            
            if (isNows == 'isNOW') {
                if (hour != '' + moment().get('hour')) {
                    alert('you hour ' + hour + ':00 is not update. Please try again!');
                    location.reload(true);
                }
            }

            app.application.showLoading();
            var checkFileName = "",
                pageSize = 8;

            if (DF == "I") checkFileName = "SUM_INDUE";
            else checkFileName = "SUM_OVERDUE";
            if (RF == "N") checkFileName += "_NON_REPORT";
            else checkFileName += "_REPORT";

            //alert(cDate);
            var dataSource;

            if (_dataDetail_dashboard[0] != text) {
                _dashboard_page = 1;
                for (var i = 1; i <= 20; i++) {
                    $("#lvDashboard" + i).kendoListView({
                        dataSource: null
                    });
                }
            }
            

            var userId = JSON.parse(localStorage.getItem("profileData")).userId,
                regionId = app.dashboardService.viewModel.checkNull($("#ddregion").val()),
                // zoneId = app.dashboardService.viewModel.checkNull($("#ddzone").val()),
                zoneId = app.dashboardService.viewModel.checkNull($("#hdMultiZone").val()),
                jobServility = app.dashboardService.viewModel.checkNull($("#ddPriority").val()),
                teamId = app.dashboardService.viewModel.checkNull($("#ddsteam").val()),
                headSystem = "",
                subSystem = app.dashboardService.viewModel.checkNull($("#ddsubSystem").val());

            $('.checkBox_subsystem:checked').each(function (i, item) {
                if (i > 0) headSystem = headSystem + ",";
                headSystem += item.value + "";
            });

            var dataValue = {
                "token": localStorage.getItem("token"),
                "regionId": "" + regionId + "",
                "zoneId": "" + zoneId + "",
                "jobServility": "" + jobServility + "",
                "teamId": "" + teamId + "",
                "headSystem": "" + headSystem + "",
                "subSystem": "" + subSystem + "",
                "userId": "" + userId + "",
                "jobDate": "" + moment(cDate, "YYYY-MM-DD") + "",
                "hour": "" + hour + "",
                "reportFlag": "" + RF + "",
                "dueFlag": "" + DF + "",
                "version": "2"
            };
            //alert(JSON.stringify(dataValue));
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (operation) {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getDashBoardDetailTTSME.json',
                                type: "POST", timeout: 180000,
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json; charset=UTF-8',
                                success: function (response) {
                                    $('#btn_exportDashboardDetail_tomail').show();
                                    operation.success(response.dashBoardDetails);

                                },
                                error: function (xhr, error) {
                                    app.application.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("dashboard : getDashBoardDetail fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function () { }, "Dashboard : getDashBoardDetail fail!", 'OK');
                                    }
                                }
                            });

                        }
                    }
                    , pageSize: pageSize
                    , page: _dashboard_page

                });
            
           
            var listV = $("#lvDashboard" + _dashboard_page).kendoListView({
                dataSource: dataSource,
                dataBound: function () {
                    var total = JSON.stringify(dataSource._total);
                    if ((total - (_dashboard_page * pageSize)) <= 0) {
                        $('#div_dashboard_bottom').hide();
                    } else {
                        $('#div_dashboard_bottom').show();
                    }
                    _dataDetail_dashboard = [text, hour, RF, DF, cDate];
                    app.application.hideLoading();
                    
                },
                template: kendo.template($("#dashboard-template").html())
            }).data("kendoListView");
            
        },
        exportDashboardDetail_tomail: function () {
            ////console.log('exportDashboardDetail_tomail: OK');
            alert('comming soon');
        },
		refresh: function(){
            _dashboard_page = 1;
            $('#div_dashboard_bottom').hide();
            app.dashboardService.hide();
            $("#div_dashboard").data("kendoMobileScroller").scrollTo(0, 0);
            for (var i = 1; i <= 20; i++) {
                $("#lvDashboard"+i).kendoListView({
                    dataSource: null
                });
            }
            app.dashboardService.viewModel.loaddata();
			
		}


        //----------------------------------------- end viewModel -----------------------------------------

    });
    
    app.dashboardService = {
        init: function () {
            $('#btn_exportDashboardDetail_tomail').hide();
            $('#btn_exportDashboard').bind('click', function () {
                //var a = document.createElement('a');
                //if (typeof a.download != "undefined") {
                //    //var urls = 'data:application/attachment;charset=utf-8,'+_dataExportDashboard;
                //} else {
                //    alert('.csv not support Internet Explorer');
                //    return false;
                //}
            });
            $('#btn_showFilterDashboard').bind('click', function () {
                
                var userId = JSON.parse(localStorage.getItem("profileData")).userId,
                regionId = app.dashboardService.viewModel.checkNull($("#ddregion").val()),
                zoneId = app.dashboardService.viewModel.checkNull($("#ddzone").val()),
                jobServility = app.dashboardService.viewModel.checkNull($("#ddPriority").val()),
                teamId = app.dashboardService.viewModel.checkNull($("#ddsteam").val()),
                headSystem = "",
                subSystem = app.dashboardService.viewModel.checkNull($("#ddsubSystem").val());
                var allCheckBox = $('#all_checkBox_subsystem').prop('checked');

                $('.checkBox_subsystem:checked').each(function (i, item) {
                    if (i > 0) headSystem = headSystem + ",";
                    headSystem += item.value + "";
                });

                _dataFilter_dashboard = [regionId, zoneId, jobServility, teamId, subSystem, headSystem, allCheckBox];
                //alert('btn_showFilterDashboard :'+_dataFilter_dashboard);
            });
            $('#btn_cancelFilterDashboard').bind('click', function () {
                $('#ddregion').data("kendoDropDownList").value(_dataFilter_dashboard[0]);
                app.dashboardFilterService.viewModel.call_ddw_zone(_dataFilter_dashboard[1]);
                $('.checkBox_subsystem').prop('checked', false);
                var headSystem = _dataFilter_dashboard[5].split(",");

                for (var ii = 0; ii < headSystem.length; ii++) {
                    $('input[value="' + headSystem[ii] + '"]').prop('checked', true);
                }
                $('#all_checkBox_subsystem').prop('checked', _dataFilter_dashboard[6]);
                
                //$('#ddzone').data("kendoDropDownList").value();
                $('#ddsteam').data("kendoDropDownList").value(_dataFilter_dashboard[3]);
                $('#ddsubSystem').data("kendoDropDownList").value(_dataFilter_dashboard[4]);
                $('#ddPriority').data("kendoDropDownList").value(_dataFilter_dashboard[2]);
                //alert('btn_showFilterDashboard :' + _dataFilter_dashboard);
            });
            //$('').checked = false;            
            $('#div_dashboard_bottom').bind('click', function () {
                _dashboard_page++;
                app.dashboardService.viewModel.loadJobDetail(_dataDetail_dashboard[0], _dataDetail_dashboard[1], _dataDetail_dashboard[2], _dataDetail_dashboard[3], _dataDetail_dashboard[4]);
            });
        },
        show: function () {
            
            if ($('#hidden_dashboard').val() == 'set') {
                _dashboard_page = 1;
                $('#div_dashboard_bottom').hide();
                app.dashboardService.hide();
                $("#div_dashboard").data("kendoMobileScroller").scrollTo(0, 0);
                for (var i = 1; i <= 20; i++) {
                    $("#lvDashboard"+i).kendoListView({
                        dataSource: null
                    });
                }
                app.dashboardService.viewModel.loaddata();
                $('#hidden_dashboard').val('unset');
            }
        },
        hide: function () {

            if ($('#hidden_dashboard').val() == 'set') {
                var chartDate = "";
                var hours = "[]";
                var data_closeInDue = "[]";
                var data_sumOfIndue = "[]";
                var data_sumOfIndue_nonReport = "[]";
                var data_sumOfOverdue_report = "[]";
                var data_sumOfOverdue_nonReport = "[]";
                hours = JSON.parse(hours);
                data_closeInDue = JSON.parse(data_closeInDue);
                data_sumOfIndue = JSON.parse(data_sumOfIndue);
                data_sumOfIndue_nonReport = JSON.parse(data_sumOfIndue_nonReport);
                data_sumOfOverdue_report = JSON.parse(data_sumOfOverdue_report);
                data_sumOfOverdue_nonReport = JSON.parse(data_sumOfOverdue_nonReport);
                fn_chart(hours, data_closeInDue, data_sumOfIndue, data_sumOfIndue_nonReport, data_sumOfOverdue_report, data_sumOfOverdue_nonReport, chartDate);
            }

        },
        viewModel: new dashboardViewModel()
        }
	
	
})(window);