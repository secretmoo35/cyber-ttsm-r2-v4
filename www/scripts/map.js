(function(global) {
    //if (typeof google === "undefined") {
    //    alert("Internet Unavailable.\nGoogle Map Service Unavailable.");
    //}

    var la_start, long_start, la_end, long_end, myLat, myLong, myFullName, myInfo;
    var map,
        _mapJob_detail_userId = '',
        _map_page = 1,
        _map_page2 = 1,
        geocoder,
        _myPin = true,
        _mc = [],
        _site = [],
        _zone = [],
        _searchSite_data = [],
        _searchNameTH_data = [],
        _searchNameEN_data = [],
        _searchMC_data = [],
        _allLatLong = [],
        _count_allLatLong = 0,
        marker_mc = [],
        marker_site = [],
        marker_zone = [],
        marker = [],
        _dataShowIcon = [],
        _default_lat = 13.7799038,
        _default_long = 100.54376,
        _displayType = 'Z', //displayType is flag define of zoom level for Site : "S" or Zone : "Z" for same zoom level not reload data and reset marker
        MapViewModel,
        directionsDisplay,
        _siteCode = '',
        dragstart, dragend,
        _usrDisplay = 'S';

    app = global.app = global.app || {};

    if (typeof google === "object" && typeof google.maps === "object") {
        infowindow = new google.maps.InfoWindow();
    }

    MapViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        lastupdateaccept: null,
        //_isLoading: true,
        direction: false,
        mcDataSource: null,
        siteDataSource: null,
        mapFromMode: "N", // 1. N : from normal || 2. A : direct form alarm site || 3. J : direct from job
        isGoFromJob: false,
        latitude: null,
        longitude: null,
        address: "",
        isGoogleMapsInitialized: false,



        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        //:::                                                                         :::
        //:::  This routine calculates the distance between two points (given the     :::
        //:::  latitude/longitude of those points). It is being used to calculate     :::
        //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
        //:::                                                                         :::
        //:::  Definitions:                                                           :::
        //:::    South latitudes are negative, east longitudes are positive           :::
        //:::                                                                         :::
        //:::  Passed to function:                                                    :::
        //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
        //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
        //:::    unit = the unit you desire for results                               :::
        //:::           where: 'M' is statute miles (default)                         :::
        //:::                  'K' is kilometers                                      :::
        //:::                  'N' is nautical miles                                  :::
        //:::                                                                         :::
        //:::  Worldwide cities and other features databases with latitude longitude  :::
        //:::  are available at http://www.geodatasource.com                          :::
        //:::                                                                         :::
        //:::  For enquiries, please contact sales@geodatasource.com                  :::
        //:::                                                                         :::
        //:::  Official Web site: http://www.geodatasource.com                        :::
        //:::                                                                         :::
        //:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
        //:::                                                                         :::
        //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        distance: function(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1 / 180
            var radlat2 = Math.PI * lat2 / 180
            var radlon1 = Math.PI * lon1 / 180
            var radlon2 = Math.PI * lon2 / 180
            var theta = lon1 - lon2
            var radtheta = Math.PI * theta / 180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515
            if (unit == "K") {
                dist = dist * 1.609344
                    //console.log("km");
            }
            if (unit == "N") {
                dist = dist * 0.8684
            }
            return dist
        },
        translateCoordinates: function(distance, Lat, Lng, angle) {
            distanceNorth = Math.sin(angle) * distance;
            distanceEast = Math.cos(angle) * distance;
            earthRadius = 6371000;
            newLat = Lat + (distanceNorth / earthRadius) * 180 / Math.PI;
            newLon = Lng + (distanceEast / (earthRadius * Math.cos(newLat * 180 / Math.PI))) * 180 / Math.PI;

            return [newLat, newLon];
        },

        getdirection: function() {

            this.set("direction", !this.get("direction"));
        },
        checkNull: function(text) {
            if (text == null) return "";
            else return text;
        },
        onDirectTo: function(myLat, myLong, lat, lng) {
            //$(".c_loading").show();
            var myFullName = JSON.parse(localStorage.getItem("profileData")).profiles[0].fullName;
            $('#startMap').html(myFullName);
            checkDirect = true;
            console.debug(lat + ':' + lng)
            var start = new google.maps.LatLng(myLat, myLong);
            var end = new google.maps.LatLng(lat, lng);
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    /*=============== result_distance ===========*/
                    directionsDisplay.setMap(map);

                    _distance = response.routes[0].legs[0].distance.value;
                    _distance = parseFloat(_distance / 1000).toFixed(1);
                    $('#result_distance').html(' = ' + _distance + ' km');

                } else {
                    directionsDisplay.setMap(null);
                }
            });

            //$(".c_loading").hide();
        },
        calcRoute: function() {

            checkDirect = true;
            la_start = $('#lat_start').val();
            long_start = $('#long_start').val();
            la_end = $('#lat_end').val();
            long_end = $('#long_end').val();
            var start = new google.maps.LatLng(la_start, long_start);
            var end = new google.maps.LatLng(la_end, long_end);
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    /*=============== result_distance ===========*/
                    directionsDisplay.setMap(map);
                    // map.setZoom(map.getZoom() - 1);
                    // map.setZoom(map.getZoom() + 1);

                    //_distance = response.routes[0].legs[0].distance.text;
                    _distance = response.routes[0].legs[0].distance.value;
                    _distance = parseFloat(_distance / 1000).toFixed(1);
                    $('#result_distance').html(' = ' + _distance + ' km');
                } else {
                    directionsDisplay.setMap(null);
                }
            });

        },
        directTo: function(lat, lng) {
            infowindow.close();
            $("#map-direction-wrap").show();
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    //alert(position);
                    myLat = position.coords.latitude;
                    myLong = position.coords.longitude;
                    app.mapService.viewModel.onDirectTo(myLat, myLong, lat, lng);


                },
                function(error) {
                    
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function() {}, "Location failed", 'OK');
                }, {
                    maximumAge: 30000,
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );

        },
        checkCal: function() {

            infowindow.close();
            $("#map-direction-wrap").show();

            app.mapService.viewModel.calcRoute();
            //marker.setAnimation(google.maps.Animation.BOUNCE);
            //directionsDisplay.setMap(map);

        },
        toClipboard: function(text) {

            //alert(text);
            var textArea = document.createElement("textarea");

            //
            // *** This styling is an extra step which is likely not required. ***
            //
            // Why is it here? To ensure:
            // 1. the element is able to have focus and selection.
            // 2. if element was to flash render it has minimal visual impact.
            // 3. less flakyness with selection and copying which **might** occur if
            //    the textarea element is not visible.
            //
            // The likelihood is the element won't even render, not even a flash,
            // so some of these are just precautions. However in IE the element
            // is visible whilst the popup box asking the user for permission for
            // the web page to copy to the clipboard.
            //

            // Place in top-left corner of screen regardless of scroll position.
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textArea.style.width = '2em';
            textArea.style.height = '2em';

            // We don't need padding, reducing the size if it does flash render.
            textArea.style.padding = 0;

            // Clean up any borders.
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textArea.style.background = 'transparent';


            textArea.value = text;

            document.body.appendChild(textArea);

            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                //console.log('Copying text command was ' + msg);

            } catch (err) {
                //console.log('Oops, unable to copy');

            }

            document.body.removeChild(textArea);
        },
        gotoAlarmDtl: function(siteDesc,lat,lng) {
            var that = this;
            _default_lat = lat;
            _default_long = lng;
            app.jobService.viewModel.set("isDirectFromMap",true);
            var siteCode = siteDesc.split('[');
            if (siteCode) {
                //alert($.trim(siteCode[0]));
                var sCode = $.trim(siteCode[0]);
                //app.jobService.viewModel.gotoAlarmDtlFromMap(sCode);
                var alarmDataSource = new kendo.data.DataSource({
                    transport: {
                        read: function(operation) {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getActiveAlarm.json',
                                data: JSON.stringify({
                                    "siteCode": sCode,
                                    "token": localStorage.getItem("token"),
                                    "user": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "req_via": "mobile",
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    if (response.activeAlarms.length == 0) {
                                        //alert("Alarm Active not found.");
                                        navigator.notification.alert("Alarm Active not found.",
                                            function() {}, "Alarm Active ", 'OK');
                                    }
                                    operation.success(response);
                                },
                                error: function(xhr, error) {
                                    //that.hideLoading();
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
                        data: "activeAlarms"
                    }
                });

                // aa.fetch(function() {

                // });
                $("#lvAlarm").kendoMobileListView({
                    dataSource: alarmDataSource,
                    style: "inset",
                    template: $("#site-alarm-template").html()
                });


                app.application.navigate(
                    '#SiteAlarmDtl'
                );
            }

        },

        gotoAlarmMob: function(siteDesc,lat,lng) {

            _default_lat = lat;
            _default_long = lng;
            app.powerSearchService.viewModel.set("isDirectFromMap",true);
            var siteCode = siteDesc.split('[');
            // if (siteCode) {
            //alert($.trim(siteCode[0]));
            var sCode = $.trim(siteCode[0]);
            //app.jobService.viewModel.gotoAlarmDtlFromMap(sCode);
            var alarmDataSource = new kendo.data.DataSource({
                transport: {




                    read: function(operation) {
                        if (app.configService.isMorkupData) {
                            var response={};
                            operation.success(response);
                            //that.set("lastupdateaccept", format_time_date(new Date()));


                        } else {
                            $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                                beforeSend: app.loginService.viewModel.checkOnline,
                                type: "POST",
                                timeout: 180000,
                                url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobBySiteTTSME.json',
                                data: JSON.stringify({
                                    "siteCode": sCode,
                                    "token": localStorage.getItem("token"),
                                    "userId": JSON.parse(localStorage.getItem("profileData")).userId,
                                    "siteId": siteDesc,
                                    "version": "2"
                                }),
                                dataType: "json",
                                contentType: 'application/json',
                                success: function(response) {
                                    // if (response.activeAlarms.length == 0) {
                                    //     //alert("Alarm Active not found.");
                                    //     navigator.notification.alert("Alarm Active not found.",
                                    //         function() {}, "Alarm Active ", 'OK');
                                    // }
                                    localStorage.setItem("jobSearchDataSource", JSON.stringify(response));
                                    operation.success(response);
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
                                    app.myService.viewModel.hideLoading();
                                    //that.set("lastupdateaccept", format_time_date(new Date()));
                                    app.powerSearchService.viewModel.set("titletxtJobListMap", "Job List");
                                    app.application.navigate(
                                        '#powerService'
                                    );
                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "jobs"
                }
            });

            //console.log(JSON.stringify(myTeam));
            //console.log(item);
            // $("#lvPowerSearchList").kendoMobileListView({
            //     dataSource: alarmDataSource,
            //     //style: "inset",
            //     template: $("#psearch-template").html(),
            //     // pullToRefresh: true,
            //     // endlessScroll: true
            // });
            
            app.jobService.viewModel.set("jobDataSource", alarmDataSource);
            alarmDataSource.fetch();
            

        },

        clearCal: function() {
            directionsDisplay.setMap(null);
            // map.setZoom(map.getZoom() - 1);
            // map.setZoom(map.getZoom() + 1);
            $("#startMap").html('');
            $("#endMap").html('');

            $('#lat_start').val('');
            $('#long_start').val('');
            $('#lat_end').val('');
            $('#long_end').val('');
            $('#result_distance').html('');
            $("#map-direction-wrap").hide();
        },

        fn_siteName_final: function(siteCode, bsc, msc, snt, sne) {
            var siteName_final = siteCode;
            if (bsc != null && msc != null) {
                siteName_final = siteCode + " [" + bsc + ", " + msc + "]";
            }
            if (bsc == null && msc != null) {
                siteName_final = siteCode + " [" + msc + "]";
            }
            if (bsc != null && msc == null) {
                siteName_final = siteCode + " [" + bsc + "]";
            }
            if (snt != null) {
                siteName_final += " " + snt;
            }
            if (sne != null) {
                siteName_final += " " + sne;
            }
            return siteName_final;
        },

        fn_siteName_icon: function(siteCode, bsc, msc, snt, sne) {
            var siteName_final = siteCode;
            if (bsc != null && msc != null) {
                siteName_final = siteCode + " [" + bsc + ", " + msc + "]";
            }
            if (bsc == null && msc != null) {
                siteName_final = siteCode + " [" + msc + "]";
            }
            if (bsc != null && msc == null) {
                siteName_final = siteCode + " [" + bsc + "]";
            }
            if (snt != null) {
                siteName_final += "|" + snt;
            }
            if (sne != null) {
                siteName_final += "|" + sne;
            }
            return siteName_final;
        },


        onHome: function() {
            //var that = this,
            //    position;

            //that._isLoading = true;
            //that.showLoading();
            //position = new google.maps.LatLng(13.7566008, 100.5393084);
            //map.panTo(position);
            //that._putMarker(position);

            //that._isLoading = false;
            //that.hideLoading();

            //navigator.geolocation.getCurrentPosition(
            //    function (position) {
            //        //position = new google.maps.LatLng(13.7566008, 100.5393084);
            //        map.panTo(position);
            //        that._putMarker(position);

            //        that._isLoading = false;
            //        that.hideLoading();
            //    },
            //    function (error) {
            //        //default map coordinates
            //        position = new google.maps.LatLng(13.7566008, 100.5393084);
            //        map.panTo(position);
            //        that._putMarker(position);

            //        that._isLoading = false;
            //        that.hideLoading();

            //        //navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
            //        //    function () { }, "Location failed", 'OK');
            //    },
            //    {
            //        timeout: 3000,
            //        enableHighAccuracy: true
            //    }
            //);
        },

        myPinLocation: function() {
            if (!_myPin) marker[0].setMap(null);
            marker[0] = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(myLat, myLong),
                icon: image = "images/myMC.gif",
                optimized: false,
                Animation: google.maps.Animation.BOUNCE
            });
            google.maps.event.addListener(marker[0], 'click', function() {
                infowindow.setContent(myInfo);
                infowindow.open(map, marker[0]);

            });
            marker[0].setMap(map);
            _myPin = false;
        },

        onNavigateHome: function() {
            var that = this,
                position;
            //alert(app.application.showLoading());
            //that._isLoading = true;
            //that.showLoading();
            //$(".c_loading").show();

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    //alert('position');
                    myLat = position.coords.latitude;
                    myLong = position.coords.longitude;

                    myFullName = JSON.parse(localStorage.getItem("profileData")).profiles[0].fullName;
                    myMobileNo = JSON.parse(localStorage.getItem("profileData")).profiles[0].mobileNo;
                    myInfo = '<div style="width:200px;">' +
                        '<a href="#mapJobList" class="underline"  onclick="app.mapService.viewModel.loadJobList(\'' + JSON.parse(localStorage.getItem("profileData")).userId + '\');" data-userid="' + JSON.parse(localStorage.getItem("profileData")).userId + '">' + myFullName + '</a>' +
                        '<br /><br /><a class="linkText" href="javascript:void(0);" onclick="$(\'#startMap\').html(\'' + myFullName + '\'); $(\'#lat_start\').val(\'' + myLat + '\'); $(\'#long_start\').val(\'' + myLong + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag"></i></a> ' +
                        '| <a class="linkText" href="javascript:void(0);" onclick="$(\'#endMap\').html(\'' + myFullName + '\'); $(\'#lat_end\').val(\'' + myLat + '\'); $(\'#long_end\').val(\'' + myLong + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag-checkered"></i></a>' +
                        '<br />Mobile No. :' + myMobileNo +
                        '</div>Last check in :' + app.mapService.viewModel.format_time_date2(moment());

                    position = new google.maps.LatLng(myLat, myLong);
                    //alert(position);
                    app.mapService.viewModel.myPinLocation();

                    map.panTo(position);
                    app.application.hideLoading();
                    map.setZoom(16);




                    //marker[0].setAnimation(google.maps.Animation.BOUNCE);
                    //that._putMarker(position);

                    //that._isLoading = false;
                    //that.hideLoading();
                    //setTimeout(function () { ////$(".c_loading").hide(); }, 200);

                },
                function(error) {
                    //$(".c_loading").hide();
                    //default map coordinates
                    //position = new google.maps.LatLng(13.7566008, 100.5393084);
                    //map.panTo(position);
                    //that._putMarker(position);

                    //that._isLoading = false;
                    //that.hideLoading();
                    //alert("Unable to determine current location. Cannot connect to GPS satellite.");
                    app.application.hideLoading();
                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function() {}, "Location failed", 'OK');
                }, {
                    maximumAge: 30000,
                    timeout: 10000,
                    enableHighAccuracy: true
                }
            );

        },

        onSearchAddress: function() {
            //var that = this;

            //geocoder.geocode(
            //    {
            //        'address': that.get("address")
            //    },
            //    function (results, status) {
            //        if (status !== google.maps.GeocoderStatus.OK) {
            //            navigator.notification.alert("Unable to find address.",
            //                function () { }, "Search failed", 'OK');

            //            return;
            //        }

            //        map.panTo(results[0].geometry.location);
            //        //that._putMarker(results[0].geometry.location);
            //    });
        },

        showLoading: function() {
            //if (this._isLoading) {
            app.application.showLoading();
            //}
        },

        hideLoading: function() {
            app.application.hideLoading();
        },
        clearMarker: function() {
            for (var i = 0; i < marker_zone.length; i++) {
                marker_zone[i].setMap(null);
            }
            for (var i = 0; i < marker_mc.length; i++) {
                marker_mc[i].setMap(null);
            }

            for (var i = 0; i < marker_site.length; i++) {
                marker_site[i].setMap(null);
            }
        },
        _putSiteMarker: function() {


            for (var i = 0; i < marker_zone.length; i++) {
                marker_zone[i].setMap(null);
            }
            for (var i = 0; i < marker_mc.length; i++) {
                marker_mc[i].setMap(null);
            }

            for (var i = 0; i < marker_site.length; i++) {
                marker_site[i].setMap(null);
            }
            marker_site = [];

            var allnp = [];
            var aisnp = [];
            var cusnp = [];
            var allap = [];
            var aisap = [];
            var cusap = [];
            //===================================== SITE position =====================================
            for (var i = 0; i < _site.length; i++) {

                marker_site[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(_site[i][1], _site[i][2]),
                    icon: _site[i][3],
                    zIndex: i
                });


                google.maps.event.addListener(marker_site[i], 'click', function() {
                    var pin_number = this.getZIndex();
                    infowindow.setContent(_site[pin_number][0]);
                    infowindow.open(map, this);

                });


            }

            app.mapService.viewModel.check();
            app.mapService.viewModel.myPinLocation();


            if (_usrDisplay == "Z") {
                map.setZoom(10);
                _usrDisplay = "S";
            }

        },
        _putMarker: function() {


            for (var i = 0; i < marker_zone.length; i++) {
                marker_zone[i].setMap(null);
            }
            for (var i = 0; i < marker_mc.length; i++) {
                marker_mc[i].setMap(null);
            }

            for (var i = 0; i < marker_site.length; i++) {
                marker_site[i].setMap(null);
            }
            marker_mc = [];
            marker_site = [];
            marker_zone = [];
            _searchSite_data = [];
            _searchNameTH_data = [];
            _searchNameEN_data = [];


            //===================================== zone position =====================================

            for (var i = 0; i < _zone.length; i++) {
                marker_zone[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(_zone[i][1], _zone[i][2]),
                    icon: _zone[i][3],
                    zIndex: i
                });

                var strRegion = _zone[i][4];
                var strZone = _zone[i][0];

                var inFo = '<div>Region : ' + strRegion + '<div><div>Zone : ' + strZone + '</div>';
                var tx = '<div style="min-width:200px; overflow:auto; height:auto;">' + inFo + '</div>';
                _zone[i][0] = tx;
                //console.debug("Zone" + (i + 1) + " = " + inFo);
                google.maps.event.addListener(marker_zone[i], 'click', function() {

                    var pin_number = this.getZIndex();
                    infowindow.setContent(_zone[pin_number][0]);
                    infowindow.open(map, this);
                });
            }

            //===================================== mc position =====================================
            var image = "images/otherMC.png";

            for (var i = 0; i < _mc.length; i++) {
                marker_mc[i] = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(_mc[i][1], _mc[i][2]),
                    icon: image,
                    zIndex: i
                });
                google.maps.event.addListener(marker_mc[i], 'click', function() {
                    var pin_number = this.getZIndex();
                    infowindow.setContent(_mc[pin_number][0]);
                    infowindow.open(map, this);
                });
                if (_mc[i][3] == app.loginService.viewModel.get("userId")) {
                    marker_mc[i].setMap(null);
                }
            }
            //alert('mc:' + _mc.length);
            app.mapService.viewModel.myPinLocation();

            var pinCluster = app.configService.pinCluster;

            var allnp = [];
            var aisnp = [];
            var cusnp = [];
            var allap = [];
            var aisap = [];
            var cusap = [];
            //===================================== SITE position =====================================
            for (var i = 0; i < _site.length; i++) {

                if (pinCluster) {
                    var ms = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(_site[i][1], _site[i][2]),
                        icon: _site[i][3],
                        zIndex: i
                    });

                    google.maps.event.addListener(ms, 'click', function() {
                        var pin_number = this.getZIndex();
                        infowindow.setContent(_site[pin_number][0]);
                        infowindow.open(map, this);
                        //alert(_site[pin_number][0]);
                    });
                    if (_site[i][3].indexOf("all_site") > -1) {

                        allnp.push(ms);


                    } else if (_site[i][3].indexOf("ais_site_normal") > -1) {
                        aisnp.push(ms);



                    } else if (_site[i][3].indexOf("customer_site_normal") > -1) {
                        cusnp.push(ms);



                    } else if (_site[i][3].indexOf("all_site_alarm") > -1) {
                        allap.push(ms);



                    } else if (_site[i][3].indexOf("ais_site_alarm") > -1) {
                        aisap.push(ms);



                    } else if (_site[i][3].indexOf("customer_site_alarm") > -1) {
                        cusap.push(ms);



                    }



                } else {
                    //console.debug("put site pin");
                    marker_site[i] = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(_site[i][1], _site[i][2]),
                        icon: _site[i][3],
                        zIndex: i
                    });


                    google.maps.event.addListener(marker_site[i], 'click', function() {
                        var pin_number = this.getZIndex();
                        infowindow.setContent(_site[pin_number][0]);
                        infowindow.open(map, this);

                    });
                }


            }




            if (pinCluster) {
                all_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }]
                };

                ais_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }]
                };

                customer_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }]
                };

                all_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }]
                };

                ais_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }]
                };

                customer_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }]
                };



                //var markerClusterMC = new MarkerClusterer(map, marker_mc);
                if (allnp != []) {
                    var markerClusterAllNp = new MarkerClusterer(map, allnp, all_site_normalOptions);
                }

                if (aisnp != []) {
                    var markerClusterAisNp = new MarkerClusterer(map, aisnp, ais_site_normalOptions);
                }

                if (cusnp != []) {
                    var markerClusterCusNp = new MarkerClusterer(map, cusnp, customer_site_normalOptions);
                }

                if (allap != []) {
                    var markerClusterAllAp = new MarkerClusterer(map, allap, all_site_alarmOptions);
                }

                if (aisap != []) {
                    var markerClusterAisAp = new MarkerClusterer(map, aisap, ais_site_alarmOptions);
                }

                if (cusap != []) {
                    var markerClusterCusAp = new MarkerClusterer(map, cusap, customer_site_alarmOptions);
                }
            }
            //alert('site:'+_site.length);
            //========================================================================================


            //map.panTo(new google.maps.LatLng(_default_lat, _default_long));
            app.mapService.viewModel.check();
            app.mapService.viewModel.myPinLocation();
            // _site = null;
            //$(".c_loading").hide();

            if (_usrDisplay == "Z") {
                map.setZoom(10);
                _usrDisplay = "S";
            }

        },

        _putMarkerSite: function() {



            for (var i = 0; i < marker_site.length; i++) {
                marker_site[i].setMap(null);
            }

            marker_site = [];

            _searchSite_data = [];
            _searchNameTH_data = [];
            _searchNameEN_data = [];


            //alert('mc:' + _mc.length);
            app.mapService.viewModel.myPinLocation();

            var pinCluster = app.configService.pinCluster;

            var allnp = [];
            var aisnp = [];
            var cusnp = [];
            var allap = [];
            var aisap = [];
            var cusap = [];
            //===================================== SITE position =====================================
            for (var i = 0; i < _site.length; i++) {

                if (pinCluster) {
                    var ms = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(_site[i][1], _site[i][2]),
                        icon: _site[i][3],
                        zIndex: i
                    });

                    google.maps.event.addListener(ms, 'click', function() {
                        var pin_number = this.getZIndex();
                        infowindow.setContent(_site[pin_number][0]);
                        infowindow.open(map, this);
                        //alert(_site[pin_number][0]);
                    });
                    if (_site[i][3].indexOf("all_site") > -1) {

                        allnp.push(ms);


                    } else if (_site[i][3].indexOf("ais_site_normal") > -1) {
                        aisnp.push(ms);



                    } else if (_site[i][3].indexOf("customer_site_normal") > -1) {
                        cusnp.push(ms);



                    } else if (_site[i][3].indexOf("all_site_alarm") > -1) {
                        allap.push(ms);



                    } else if (_site[i][3].indexOf("ais_site_alarm") > -1) {
                        aisap.push(ms);



                    } else if (_site[i][3].indexOf("customer_site_alarm") > -1) {
                        cusap.push(ms);



                    }



                } else {
                    //console.debug("put site pin");
                    marker_site[i] = new google.maps.Marker({
                        map: map,
                        position: new google.maps.LatLng(_site[i][1], _site[i][2]),
                        icon: _site[i][3],
                        zIndex: i
                    });


                    google.maps.event.addListener(marker_site[i], 'click', function() {
                        var pin_number = this.getZIndex();
                        infowindow.setContent(_site[pin_number][0]);
                        infowindow.open(map, this);

                    });
                }


            }




            if (pinCluster) {
                all_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_normal1.png",
                        width: 40
                    }]
                };

                ais_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_normal1.png",
                        width: 40
                    }]
                };

                customer_site_normalOptions = {
                    styles: [{
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_normal1.png",
                        width: 40
                    }]
                };

                all_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/all_site_alarm1.png",
                        width: 40
                    }]
                };

                ais_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/ais_site_alarm1.png",
                        width: 40
                    }]
                };

                customer_site_alarmOptions = {
                    styles: [{
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }, {
                        height: 40,
                        url: "images/customer_site_alarm1.png",
                        width: 40
                    }]
                };



                //var markerClusterMC = new MarkerClusterer(map, marker_mc);
                if (allnp != []) {
                    var markerClusterAllNp = new MarkerClusterer(map, allnp, all_site_normalOptions);
                }

                if (aisnp != []) {
                    var markerClusterAisNp = new MarkerClusterer(map, aisnp, ais_site_normalOptions);
                }

                if (cusnp != []) {
                    var markerClusterCusNp = new MarkerClusterer(map, cusnp, customer_site_normalOptions);
                }

                if (allap != []) {
                    var markerClusterAllAp = new MarkerClusterer(map, allap, all_site_alarmOptions);
                }

                if (aisap != []) {
                    var markerClusterAisAp = new MarkerClusterer(map, aisap, ais_site_alarmOptions);
                }

                if (cusap != []) {
                    var markerClusterCusAp = new MarkerClusterer(map, cusap, customer_site_alarmOptions);
                }
            }
            //alert('site:'+_site.length);
            //========================================================================================


            map.panTo(new google.maps.LatLng(_default_lat, _default_long));
            app.mapService.viewModel.check();
            app.mapService.viewModel.myPinLocation();
            // _site = null;
            //$(".c_loading").hide();

            if (_usrDisplay == "Z") {
                map.setZoom(10);
                _usrDisplay = "S";
            }

        },

        _panTo: function() {
            map.panTo(new google.maps.LatLng(_default_lat, _default_long));

        },

        check: function() {
            $('.c_div_searchResult').hide();
            $("#poFilter").data("kendoMobilePopOver").close();
            infowindow.close();

            for (var i = 0; i < _site.length; i++) {
                _site[i][0] = _site[i][0].replace(new RegExp("checkPin_SN_hide", "g"), "checkPin_SN_show");
                _site[i][0] = _site[i][0].replace(new RegExp("checkPin_SA_hide", "g"), "checkPin_SA_show");
                _site[i][0] = _site[i][0].replace(new RegExp("checkPin_CN_hide", "g"), "checkPin_CN_show");
                _site[i][0] = _site[i][0].replace(new RegExp("checkPin_CA_hide", "g"), "checkPin_CA_show");
                marker_site[i].setIcon(_site[i][3]);
                marker_site[i].setMap(map);

                //---------------------------hide ais normal
                if (document.getElementById('checkBox_s').checked == false) {
                    if (_site[i][3] == "images/asn.png" || _site[i][3] == "images/asn-1.png" || _site[i][3] == "images/asn-2.png") {
                        marker_site[i].setMap(null);
                        continue;
                    }
                    if (_site[i][3] == "images/allsn.png" || _site[i][3] == "images/allsn-1.png" || _site[i][3] == "images/allsn-2.png") {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_SN_show", "g"), "checkPin_SN_hide");
                        marker_site[i].setIcon("images/csn.png");
                    }
                }
                //---------------------------hide customer normal
                if (document.getElementById('checkBox_c').checked == false) {
                    if (_site[i][3] == "images/csn.png" || _site[i][3] == "images/csn-1.png" || _site[i][3] == "images/csn-2.png") {
                        marker_site[i].setMap(null);
                        continue;
                    }
                    if (_site[i][3] == "images/allsn.png" || _site[i][3] == "images/allsn-1.png" || _site[i][3] == "images/allsn-2.png") {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_CN_show", "g"), "checkPin_CN_hide");
                        marker_site[i].setIcon("images/asn.png");
                    }
                }
                //---------------------------hide ais alarm
                if (_site[i][3] == "images/allsam.png" || _site[i][3] == "images/allsam-1.png" || _site[i][3] == "images/allsam-2.png") {
                    if (document.getElementById('checkBox_s').checked == false) {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_SN_show", "g"), "checkPin_SN_hide");
                    }
                    if (document.getElementById('checkBox_sa').checked == false) {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_SA_show", "g"), "checkPin_SA_hide");
                    }
                    if (document.getElementById('checkBox_c').checked == false) {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_CN_show", "g"), "checkPin_CN_hide");
                    }
                    if (document.getElementById('checkBox_ca').checked == false) {
                        _site[i][0] = _site[i][0].replace(new RegExp("checkPin_CA_show", "g"), "checkPin_CA_hide");
                    }
                    if (_site[i][0].search("checkPin_SN_show") > 0 && _site[i][0].search("checkPin_SA_show") < 0 && _site[i][0].search("checkPin_CN_show") < 0 && _site[i][0].search("checkPin_CA_show") < 0) {
                        marker_site[i].setIcon("images/asn.png");
                    }
                    if (_site[i][0].search("checkPin_SN_show") < 0 && _site[i][0].search("checkPin_SA_show") < 0 && _site[i][0].search("checkPin_CN_show") > 0 && _site[i][0].search("checkPin_CA_show") < 0) {
                        marker_site[i].setIcon("images/csn.png");
                    }
                    if (_site[i][0].search("checkPin_SN_show") > 0 && _site[i][0].search("checkPin_SA_show") < 0 && _site[i][0].search("checkPin_CN_show") > 0 && _site[i][0].search("checkPin_CA_show") < 0) {
                        marker_site[i].setIcon("images/asn.png");
                    }
                }
                //---------------------------hide customer alarm

                if (_site[i][0].search("checkPin_SN_show") < 0 && _site[i][0].search("checkPin_SA_show") < 0 && _site[i][0].search("checkPin_CN_show") < 0 && _site[i][0].search("checkPin_CA_show") < 0) {
                    marker_site[i].setMap(null);
                }
            }
            //-------------------------- hidden mc pin
            for (var i = 0; i < _mc.length; i++) {
                if (document.getElementById('checkBox_fe').checked == false) {
                    marker_mc[i].setMap(null);
                } else {
                    marker_mc[i].setMap(map);
                    if (_mc[i][3] == app.loginService.viewModel.get("userId")) {
                        marker_mc[i].setMap(null);
                    }
                }
            }
            // map.setZoom(map.getZoom() - 1);
            // map.setZoom(map.getZoom() + 1);
            map.setZoom(16);
            $('#hidden_showIcon').val('set');


        },

        showicon: function(e) {
            var id = (e.target.id).replace('_active', '');
            $("#search_site").show();
            $("#search_site_active").hide();
            $("#search_nameTH").show();
            $("#search_nameTH_active").hide();
            $("#search_nameEN").show();
            $("#search_nameEN_active").hide();
            $("#search_mc").show();
            $("#search_mc_active").hide();
            $("#search_job").show();
            $("#search_job_active").hide();
            $("#" + id + "_active").show();
            $("#" + id + "").hide();
        },

        //=================================== icon Search =========================================
        setType_search: function(typeName) {
            //$('#popup_result').hide();
            //$('#div_result').hide();
            infowindow.close();
            var tSearch = '';
            var end_li = '';
            //
            $('#earch_site').attr('src', 'images/search_site.png');
            $('#earch_mc').attr('src', 'images/search_mc.png');
            $('#earch_job').attr('src', 'images/search_job.png');
            $('#' + typeName).attr('src', 'images/s' + typeName + '_active.png');
            // $('#earch_nameTH').css('color', '#D6D6D6');
            // $('#earch_nameEN').css('color', '#D6D6D6');
            // $('#' + typeName).css('color', '#489CD8');
            $('#searchText').val('');
            $('#Hidden1').val('set');
            $('#ul_searchResult').html('');
            //$('.c_loading').show();
            $('.c_div_searchResult').hide();
            $('.li_not_found').hide();

            if (typeName == 'earch_site') {
                //alert(_searchSite_data.length);
                if ($('#Hidden1').val() == 'set') {
                    for (var i = 0; i < _searchSite_data.length; i++) {
                        tSearch += _searchSite_data[i];
                        //end_li = '<li class="li_not_found"><font style="color:red;">Not found!</font></li>';
                    }
                    //alert('setSearch');
                    $('#ul_searchResult').html(tSearch + end_li);
                    $('#Hidden1').val('unset');
                }
                //$(".c_loading").hide();
                $('#searchText').attr('placeholder', 'Search Site...');
                $('#hd_searchType').val("site");


                // } else if (typeName == 'earch_nameTH') {
                //     for (var i = 0; i < _searchNameTH_data.length; i++) {
                //         tSearch += _searchNameTH_data[i];
                //         //end_li = '<li class="li_not_found"><font style="color:red;">Not found!</font></li>';
                //     }
                //     //alert('setSearch');
                //     $('#ul_searchResult').html(tSearch + end_li);
                //     $('#searchText').attr('placeholder', 'Search Site Name Thai...');
                //     $('#hd_searchType').val("site");



                // } else if (typeName == 'earch_nameEN') {

                //     for (var i = 0; i < _searchNameEN_data.length; i++) {
                //         tSearch += _searchNameEN_data[i];
                //         //end_li = '<li class="li_not_found"><font style="color:red;">Not found!</font></li>';
                //     }
                //     //alert('setSearch');
                //     $('#ul_searchResult').html(tSearch + end_li);
                //     $('#searchText').attr('placeholder', 'Search Site Name ENG...');
                //     $('#hd_searchType').val("site");



            } else if (typeName == 'earch_mc') {
                for (var i = 0; i < _searchMC_data.length; i++) {
                    tSearch += _searchMC_data[i];
                    //end_li = '<li class="li_not_found"><font style="color:red;">Not found!</font></li>';
                }
                //alert('setSearch');
                //$(".c_loading").hide();
                $('#ul_searchResult').html(tSearch + end_li);
                $('#searchText').attr('placeholder', 'Search Field Engineer...');
                $('#hd_searchType').val("mc");
            } else if (typeName == 'earch_job') {
                $('#searchText').attr('placeholder', 'Search Job Id...');
                $('#hd_searchType').val("job");
            } else {
                //$('#searchText').attr('placeholder','Search...');
            }

            //$('.c_loading').hide();
        },

        fn_divSearch: function() {



        },

        fn_cleanSearchResult: function() {
            $('.post_site').hide();
            $('.c_div_searchResult').hide();

        },

        clickResult: function(txtResult, latitude, longitude) {
            var _search_for = $('#hd_searchType').val();

            for (var i2 = 0; i2 < _allLatLong.length; i2++) {
                var search_lat_long = new google.maps.LatLng(latitude, longitude);
                //////console.log(search_lat_long +" : "+ _allLatLong[i2]);
                if (search_lat_long.equals(_allLatLong[i2])) {

                    map.panTo(search_lat_long);
                    map.setZoom(16);
                    if (_search_for == "mc" || _search_for == "job") {
                        if (_mc[i2][3] == app.loginService.viewModel.get("userId")) {
                            infowindow.setContent(myInfo);
                            infowindow.open(map, marker[0]);
                            break;
                        } else {
                            if (_mc[i2][0].search(txtResult) >= 0) {

                                infowindow.setContent(_mc[i2][0]);
                                infowindow.open(map, marker_mc[i2]);
                                break;
                            }
                        }
                    }
                    if (_search_for == "site") {
                        infowindow.setContent(_site[i2 - marker_mc.length][0]);
                        //infowindow.setContent(_site[i2 - marker_mc.length][0].replace("" + txtResult + "", '<font style="color:#74A333;"><b>' + txtResult + '</b></font>'));
                        infowindow.open(map, marker_site[i2 - marker_mc.length]);
                        break;
                    }

                }
            }

        },

        fn_loadSearchJob: function() {
            //$(".c_loading").show();
            //app.application.showLoading();
            var regionId, zoneId, jobPriority, jobStatus, teamId,
                userId = JSON.parse(localStorage.getItem("profileData")).userId;

            regionId = app.mapService.viewModel.checkNull($("#dregion").val());
            zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            jobPriority = app.mapService.viewModel.checkNull($("#dPriority").val());
            jobStatus = app.mapService.viewModel.checkNull($("#dstatus").val());
            teamId = app.mapService.viewModel.checkNull($("#dsteam").val());
            zoneId = app.mapService.viewModel.checkNull($("#dzone").val());

            var dataValue = {
                "userId": userId,
                "token": localStorage.getItem("token"),
                "regionId": "" + regionId + "",
                "zoneId": "" + zoneId + "",
                "jobPriority": "" + jobPriority + "",
                "jobStatus": "" + jobStatus + "",
                "teamId": "" + teamId + "",
                "name": "" + $("#dfield").val() + "",
                "jbId": "" + $("#searchText").val().toUpperCase() + "",
                "version": "2"
            };
            var textJob = '';
            $.ajax({
                beforeSend: app.loginService.viewModel.checkOnline,
                url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getEngineerMapTTSME.json",
                type: "POST",
                timeout: 180000,
                data: JSON.stringify(dataValue),
                dataType: "json",
                contentType: 'application/json',
                async: false,
                success: function(response) {
                    //alert(JSON.stringify(response));

                    var j = 0;
                    $.each(response.engineerMaps, function(i, item) {
                        var filterBy = '';
                        //if (item.userId != userId) {

                        filterBy = item.fullName;
                        textJob += '<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.latitude + '\', \'' + item.longitude + '\');" class="post_site" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                            '&nbsp;&nbsp;  <img src="images/otherMC.png" class="icon_result_width" />' + filterBy + '</a></li>' +
                            '';
                        //} else {
                        //alert('myUser');
                        //j++;
                        //}
                    });
                    $('#ul_searchResult').html(textJob);
                    //$(".c_loading").hide();
                    //app.application.hideLoading();
                },

                error: function(xhr, error) {
                    if (!app.ajaxHandlerService.error(xhr, error)) {
                        ////console.log("map filter : getEngineerMap fail!");
                        ////console.log(xhr);
                        ////console.log(error);

                        navigator.notification.alert(xhr.status + ' ' + error,
                            function() {}, "MF : getEngineerMap fail!", 'OK');
                    }
                }
            });
        },

        runScript: function(e) {
            $("#div_searchResult").data("kendoMobileScroller").scrollTo(0, 0);
            $('.li_not_found').hide();
            if ($("#searchText").val() != "") {
                if ($("#hd_searchType").val() == "job") {
                    app.mapService.viewModel.fn_loadSearchJob();
                }
                $('.c_div_searchResult').show();

                var posts = $('.post_site');
                var row = 0;
                posts.show();
                posts
                    .hide()
                    .filter(function() {
                        //var t = $(this).data('filter');

                        var t = $(this).attr("data-filter"),
                            fc = $(this).attr("title");
                        var xx = false,
                            showIcon = true;
                        if (t != undefined) {
                            if ($("#hd_searchType").val() == "site") {
                                if (document.getElementById('checkBox_s').checked == false && fc == "SN") {
                                    showIcon = false;
                                }
                                if (document.getElementById('checkBox_sa').checked == false && fc == "SA") {
                                    showIcon = false;
                                }
                                if (document.getElementById('checkBox_c').checked == false && fc == "CN") {
                                    showIcon = false;
                                }
                                if (document.getElementById('checkBox_ca').checked == false && fc == "CA") {
                                    showIcon = false;
                                }
                                if (showIcon) {
                                    //if (t.search($("#searchText").val().toUpperCase()) >= 0) { //--------------user for search all text
                                    //console.debug($("#searchText").val().toUpperCase());
                                    var s = t.split("|");
                                    if (s && s.length > 0) {

                                        for (var i = 0; i < s.length; i++) {
                                            if (s[i].search($("#searchText").val().toUpperCase()) == 0) { //--------------user for search first text
                                                xx = true;
                                                row++;
                                                break;
                                            } else {
                                                xx = false;
                                            }

                                        }

                                    }




                                } else {
                                    xx = false;
                                }
                            }

                            if ($("#hd_searchType").val() == "mc") {
                                if (document.getElementById('checkBox_fe').checked) {
                                    if ((t.toUpperCase()).search($("#searchText").val().toUpperCase()) >= 0) {
                                        xx = true;
                                        row++;
                                    } else {
                                        xx = false;
                                    }
                                } else {
                                    xx = false;
                                }
                            }
                            if ($("#hd_searchType").val() == "job") {
                                if (document.getElementById('checkBox_fe').checked) {
                                    xx = true;
                                    row++;
                                } else {
                                    xx = false;
                                }
                            }
                        }

                        return xx;
                    })
                    .show();
                //alert(row);
                if (row == 0) {
                    //search by marker not found
                    if (_siteCode != $("#searchText").val().toUpperCase()) {
                        //alert($("#searchText").val().toUpperCase());
                        _siteCode = $("#searchText").val().toUpperCase();
                        setTimeout(app.mapService.viewModel.loadData, 1000);


                    } else {
                        $('.li_not_found').show();
                    }


                } else {
                    $('.li_not_found').hide();
                }
                app.application.hideLoading();
            } else {
                app.application.hideLoading();
                //alert('Please input search text');
                navigator.notification.alert("Please input search text",
                    function() {}, "Map : ", 'OK');
            }


        },

        tempBalloon_allSite: function(nameSite_s, siteType, siteAlarm, la_site, long_site, jobsStatus, snt, sne, sIds, regions, zones) {
            infowindow = new google.maps.InfoWindow();
            var inFor = "";
            //nameSite_s = "name1,name2,name3";
            //console.log(sIds);
            var arr = nameSite_s.split('|');
            var arrT = siteType.split(',');
            var arrA = siteAlarm.split(',');
            var arrStatus = jobsStatus.split(',');
            var arrNameTH = snt.split(',');
            var arrNameEN = sne.split(',');
            var arrSId = sIds.split(',');
            var arrRegion = regions.split(',');
            var arrZone = zones.split(',');


            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != "") {
                    // console.log(arr[i]);
                    var infoBar = arr[i].split("]")[0] + "]";
                    imageName = app.mapService.viewModel.fn_checkPIN_SITE_TYPE(arrT[i], arrA[i], arrStatus[i]);
                    var act_navi_begin = '<a class="linkText" href="#tabstrip-map" onclick="$(\'#startMap\').html(\'' + arr[i] + '\'); $(\'#lat_start\').val(\'' + la_site + '\'); $(\'#long_start\').val(\'' + long_site + '\'); app.mapService.viewModel.checkCal();">' +
                        '<i class="fa fa-flag"></i>' +
                        '</a>';
                    var act_navi_end = ' | &nbsp;' + '<a class="linkText" href="#tabstrip-map" onclick="$(\'#endMap\').html(\'' + arr[i] + '\');  $(\'#lat_end\').val(\'' + la_site + '\'); $(\'#long_end\').val(\'' + long_site + '\'); app.mapService.viewModel.checkCal();">' +
                        '<i class="fa fa-flag-checkered"></i>&nbsp;' +
                        '</a>';
                    //var enhance_act_director = '';
                    var enhance_act_director = ' | &nbsp;' + '<a class="linkText" href="#tabstrip-map" onclick="$(\'#endMap\').html(\'' + arr[i] + '\'); app.mapService.viewModel.directTo(\'' + la_site + '\',\'' + long_site + '\');">' +
                        '<i class="fa iconTTSM-compass2"></i>' + '</a>';
                    var enhance_act_get_alarm = ' | &nbsp;' + '<a class="linkText fa" href="#SiteAlarmDtl" onclick="app.mapService.viewModel.gotoAlarmDtl(\'' + arr[i] + '\',\'' + la_site + '\',\'' +  long_site + '\');">' +
                        '<i class="fa iconTTSM-notification6 assertive"></i>' +
                        '</a>';
                    var enhance_act_get_job = ' | &nbsp;' + '<div class="linkText fa" style="cursor:pointer" onclick="app.mapService.viewModel.gotoAlarmMob(\'' + arrSId[0] + '\',\'' + la_site + '\',\'' +  long_site + '\');">' +
                        '<i class="fa fa-file"></i>' +
                        '</div>';
                    //var enhance_act_get_job = '';
                    var enhance_act_get_name = 'Name TH :' + arrNameTH[i] + '<br>' + 'Name EN :' + arrNameEN[i];
                    var enhance_region = 'Region :' + arrRegion[i];
                    var enhance_zone = 'Zone :' + arrZone[i];
                    //var enhance_act_get_lalan = 'Lat Long :' + '<a class="linkText" onclick="app.mapService.viewModel.toClipboard(\'' + la_site + ',' + long_site + '\');"><span class="lalng">' + la_site + ',' + long_site + '</span></a>';
                    var enhance_act_get_lalan = 'Lat Long :' + '<input type="text" value="' + la_site + ',' + long_site + '" />'
                    inFor = inFor + '<div  data-role="scroller" class="checkPin_' + arrT[i] + '' + arrA[i] + '_show"> &nbsp;&nbsp; <img src="' + imageName + '" class="tBalloon icon_result_width" /> ' + infoBar + '' +
                        ' &nbsp;&nbsp;' + act_navi_begin + act_navi_end +
                        enhance_act_director + enhance_act_get_alarm + enhance_act_get_job + '<br>' + enhance_act_get_name + '<br>' + enhance_region + '<br>' + enhance_zone + '<br>' + enhance_act_get_lalan + '<hr class="hr_head">' + '</div>';
                }
            }
            var tx = '<div style="min-width:200px; overflow:auto; height:auto;">' + inFor + '</div>';

            return tx;
        },

        fn_checkImagePin: function(text, jSt) {
            var tx = "";
            var jStatus = "";
            if (jSt != "0") {
                jStatus = "-" + jSt;
            }
            if (text.search("am") > 0) {
                tx = "images/allsam" + jStatus + ".png";
            } else if (text.search("asn") > 0 && text.search("asam") < 0 && text.search("csn") < 0 && text.search("csam") < 0) {
                tx = "images/asn" + jStatus + ".png";
            } else if (text.search("asn") > 0 && text.search("asam") < 0 && text.search("csn") > 0 && text.search("csam") < 0) {
                tx = "images/allsn" + jStatus + ".png";
            } else if (text.search("asn") < 0 && text.search("asam") < 0 && text.search("csn") > 0 && text.search("csam") < 0) {
                tx = "images/csn" + jStatus + ".png";
            } else {
                tx = "images/icon_close.png";
            }

            return tx;
        },

        format_time_date2: function(timess) {
            var datess = moment(timess / 1000, 'X').format("DD-MMMM-YYYY HH:mm:ss");
            return datess;
        },

        loadSiteOnly: function() {
            var that = this;
            $(".c_loading").show();
            //alert("loadData");
            app.application.showLoading();
            _count_allLatLong = 0;
            _site = [], _zone = [],
                _mc = [];
            var that = this;
            var regionId, zoneId, jobPriority, jobStatus, teamId,
                userId = JSON.parse(localStorage.getItem("profileData")).userId;

            // regionId = app.mapService.viewModel.checkNull($("#dregion").val());
            // zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            //console.debug(JSON.parse(localStorage.getItem("profileData")));
            regionId = JSON.parse(localStorage.getItem("profileData")).profiles[0].regionId;
            zoneId = '';
            jobPriority = app.mapService.viewModel.checkNull($("#dPriority").val());
            jobStatus = app.mapService.viewModel.checkNull($("#dstatus").val());
            teamId = app.mapService.viewModel.checkNull($("#dsteam").val());

            var dataSite = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {

                        var dataValue = {
                            "userId": userId,
                            "token": localStorage.getItem("token"),
                            "regionId": "" + regionId + "",
                            "zoneId": "" + zoneId + "",
                            "siteId": "" + _siteCode + "",
                            "lat": _default_lat,
                            "longi": _default_long,
                            "version": "2"
                        };
                        //alert('getSiteMap : ' + JSON.stringify(dataValue));

                        if (app.configService.isMorkupData) {
                            app.application.hideLoading();
                            //alert(JSON.stringify(response));
                            //alert("success");
                            var count_searchSite = 0;
                            var response={};
                            $.each(response.siteMaps, function(i, item) {

                                //alert(i);
                                var SITE_CODE = "";
                                var siteTypes = "";
                                var siteAlarms = "";
                                var imagePin = "";
                                var filterBy = "";
                                var siteOn = false;
                                var siteInAct = false;
                                var siteStatus = "0";
                                var siteStatusList = "";
                                var snt = "";
                                var sne = "";
                                var sIds = "";
                                var regions = "";
                                var zones = "";
                                $.each(item.sDtls, function(ii, iitem) {
                                    //filterBy = iitem.sCd;
                                    filterBy = app.mapService.viewModel.fn_siteName_final(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);
                                    data_icon = app.mapService.viewModel.fn_siteName_icon(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);

                                    SITE_CODE += filterBy + "|";
                                    siteTypes += iitem.sTy + ",";
                                    siteAlarms += iitem.sAl + ",";
                                    siteStatusList += iitem.jSt + ",";
                                    sIds += iitem.sId + ",";
                                    regions += iitem.region + ",";
                                    zones += iitem.zone + ",";
                                    imagePin += app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt);
                                    snt += iitem.snt + ",";
                                    sne += iitem.sne + ",";

                                    _searchSite_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + data_icon + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                        '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                        ''
                                    ];
                                    // _searchNameTH_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                    //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                    //     ''
                                    // ];
                                    // _searchNameEN_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                    //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                    //     ''
                                    // ];
                                    //console.debug(_searchSite_data[count_searchSite]);
                                    if (iitem.jSt == "1") {
                                        siteOn = true;
                                    }
                                    if (iitem.jSt == "2") {
                                        siteInAct = true;
                                    }
                                    count_searchSite++;
                                });
                                if (siteOn) {
                                    siteStatus = "1";
                                } else {
                                    if (siteInAct) {
                                        siteStatus = "2";
                                    }
                                }

                                if (i == Math.round(Object.keys(response.siteMaps).length / 2) - 1) {
                                    _default_lat = item.ltt;
                                    _default_long = item.lgt;
                                }
                                _site[i] = [
                                    app.mapService.viewModel.tempBalloon_allSite(SITE_CODE, siteTypes, siteAlarms, item.ltt, item.lgt, siteStatusList, snt, sne, sIds, regions, zones),
                                    item.ltt,
                                    item.lgt,
                                    app.mapService.viewModel.fn_checkImagePin(imagePin, siteStatus)
                                ];
                                _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.ltt, item.lgt);
                                _count_allLatLong++;

                            });
                            //alert("ok");
                            app.mapService.viewModel.setType_search('earch_site');
                            //---------go to set Marker ------------
                            app.mapService.viewModel._putMarker();
                            //app.mapService.viewModel.hideLoading();
                            operation.success(response);
                        } else {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getSiteMapTTSME.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json',
                                async: false,
                                timeout: 360000,
                                success: function(response) {
                                    app.application.hideLoading();
                                    //alert(JSON.stringify(response));
                                    //alert("success");
                                    var count_searchSite = 0;

                                    $.each(response.siteMaps, function(i, item) {

                                        //alert(i);
                                        var SITE_CODE = "";
                                        var siteTypes = "";
                                        var siteAlarms = "";
                                        var imagePin = "";
                                        var filterBy = "";
                                        var siteOn = false;
                                        var siteInAct = false;
                                        var siteStatus = "0";
                                        var siteStatusList = "";
                                        var snt = "";
                                        var sne = "";
                                        var sIds = "";
                                        var regions = "";
                                        var zones = "";
                                        $.each(item.sDtls, function(ii, iitem) {
                                            //filterBy = iitem.sCd;
                                            filterBy = app.mapService.viewModel.fn_siteName_final(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);
                                            data_icon = app.mapService.viewModel.fn_siteName_icon(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);

                                            SITE_CODE += filterBy + "|";
                                            siteTypes += iitem.sTy + ",";
                                            siteAlarms += iitem.sAl + ",";
                                            siteStatusList += iitem.jSt + ",";
                                            sIds += iitem.sId + ",";
                                            regions += iitem.region + ",";
                                            zones += iitem.zone + ",";
                                            imagePin += app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt);
                                            snt += iitem.snt + ",";
                                            sne += iitem.sne + ",";

                                            _searchSite_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + data_icon + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                                '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                                ''
                                            ];
                                            // _searchNameTH_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                            //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                            //     ''
                                            // ];
                                            // _searchNameEN_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                            //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                            //     ''
                                            // ];
                                            //console.debug(_searchSite_data[count_searchSite]);
                                            if (iitem.jSt == "1") {
                                                siteOn = true;
                                            }
                                            if (iitem.jSt == "2") {
                                                siteInAct = true;
                                            }
                                            count_searchSite++;
                                        });
                                        if (siteOn) {
                                            siteStatus = "1";
                                        } else {
                                            if (siteInAct) {
                                                siteStatus = "2";
                                            }
                                        }

                                        if (i == Math.round(Object.keys(response.siteMaps).length / 2) - 1) {
                                            _default_lat = item.ltt;
                                            _default_long = item.lgt;
                                        }
                                        _site[i] = [
                                            app.mapService.viewModel.tempBalloon_allSite(SITE_CODE, siteTypes, siteAlarms, item.ltt, item.lgt, siteStatusList, snt, sne, sIds, regions, zones),
                                            item.ltt,
                                            item.lgt,
                                            app.mapService.viewModel.fn_checkImagePin(imagePin, siteStatus)
                                        ];
                                        _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.ltt, item.lgt);
                                        _count_allLatLong++;

                                    });
                                    //alert("ok");
                                    app.mapService.viewModel.setType_search('earch_site');
                                    //---------go to set Marker ------------
                                    app.mapService.viewModel._putMarkerSite();
                                    //app.mapService.viewModel.hideLoading();
                                    operation.success(response);

                                },

                                error: function(xhr, error) {
                                    $(".c_loading").hide();
                                    app.application.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map : getSiteMap fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "MAP : getSiteMap fail!", 'OK');
                                    }

                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "siteMaps"
                }
            });

            dataSite.read();
            if (_siteCode != "") {
                $("#searchText").val(_siteCode);
                app.mapService.viewModel.runScript();
            }
            //console.debug("loaddata site total : " + _site.length);


        },

        loadData: function() {
            //app.mapService.viewModel.showLoading();

            $(".c_loading").show();
            //alert("loadData");
            _count_allLatLong = 0;
            _site = [], _zone = [],
                _mc = [];
            var that = this;
            var regionId, zoneId, jobPriority, jobStatus, teamId,
                userId = JSON.parse(localStorage.getItem("profileData")).userId;

            // regionId = app.mapService.viewModel.checkNull($("#dregion").val());
            // zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            //console.debug(JSON.parse(localStorage.getItem("profileData")));
            regionId = JSON.parse(localStorage.getItem("profileData")).profiles[0].regionId;
            zoneId = '';
            jobPriority = app.mapService.viewModel.checkNull($("#dPriority").val());
            jobStatus = app.mapService.viewModel.checkNull($("#dstatus").val());
            teamId = app.mapService.viewModel.checkNull($("#dsteam").val());

            var dataZone = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {

                        var dataValue = {
                            "userId": userId,
                            "token": localStorage.getItem("token"),
                            "regionId": "" + regionId + "",
                            "zoneId": "" + zoneId + "",
                            "siteId": "" + $("#dsite").val() + "",
                            "version": "2"
                        };

                        if (app.configService.isMorkupData) {


                            var response={};
                            var myRegion = "BKK";
                            // myRegion = response.regionId;
                            // var imageZone = "images/Dropzone-" + myRegion + ".png";
                            // console.debug("debug Region Image : " + imageZone);

                            $.each(response.zoneMaps, function(i, item) {
                                myRegion = item.rId.split(',')[0];
                                var imageZone = "images/Dropzone-" + myRegion + ".png";
                                //console.debug("debug Region Image : " + imageZone);
                                _zone[i] = [
                                    item.zDs,
                                    item.ltt,
                                    item.lgt,
                                    imageZone,
                                    myRegion
                                ];
                            });

                            operation.success(response);
                        } else {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getZoneMapTTSME.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json',
                                async: false,
                                timeout: 360000,
                                success: function(response) {


                                    var myRegion = "BKK";
                                    // myRegion = response.regionId;
                                    // var imageZone = "images/Dropzone-" + myRegion + ".png";
                                    // console.debug("debug Region Image : " + imageZone);

                                    $.each(response.zoneMaps, function(i, item) {
                                        myRegion = item.rId.split(',')[0];
                                        var imageZone = "images/Dropzone-" + myRegion + ".png";
                                        //console.debug("debug Region Image : " + imageZone);
                                        _zone[i] = [
                                            item.zDs,
                                            item.ltt,
                                            item.lgt,
                                            imageZone,
                                            myRegion
                                        ];
                                    });

                                    operation.success(response);
                                },

                                error: function(xhr, error) {
                                    app.application.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map : getSiteMap fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "MAP : getZoneMap fail!", 'OK');
                                    }
                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "zoneMaps"
                }
            });
            var dataMC = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        var dataValue = {
                            "userId": userId,
                            "token": localStorage.getItem("token"),
                            "regionId": "" + regionId + "",
                            "zoneId": "" + zoneId + "",
                            "jobPriority": "" + jobPriority + "",
                            "jobStatus": "" + jobStatus + "",
                            "teamId": "" + teamId + "",
                            "name": "" + $("#dfield").val() + "",
                            "jbId": "",
                            "version": "2"
                        };

                        //alert('getEngineerMap : ' + JSON.stringify(dataValue));
                        if (app.configService.isMorkupData) {
                            var response = {
                                "engineerMaps": [{
                                    "userId": "7478",
                                    "userName": "hansasae",
                                    "firstName": "Hansa",
                                    "lastName": "Saensing",
                                    "currentTime": 1443676020000,
                                    "latitude": "13.782713",
                                    "longitude": "100.546645",
                                    "fullName": "Hansa Saensing",
                                    "mobileNo": "0840177525"
                                }],
                                "version": "1",
                                "jobPriority": "",
                                "jobStatus": "",
                                "teamId": "",
                                "name": "",
                                "jbId": "",
                                "userId": "7478",
                                "regionId": "",
                                "zoneId": ""
                            };
                            var mcInfo = "";
                            var j = 0;
                            $.each(response.engineerMaps, function(i, item) {
                                var filterBy = '';

                                //if (item.userId != userId) {
                                mcInfo = '<div style="width:200px;">' +
                                    '<a href="#mapJobList" class="underline" onclick="app.mapService.viewModel.loadJobList(\'' + item.userId + '\');" data-userid="' + item.userId + '">' + item.fullName + '</a>' +
                                    '<br /><br /><a class="linkText" href="javascript:void(0);" onclick="$(\'#startMap\').html(\'' + item.fullName + '\'); $(\'#lat_start\').val(\'' + item.latitude + '\'); $(\'#long_start\').val(\'' + item.longitude + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag"></i></a> ' +
                                    '| <a class="linkText" href="javascript:void(0);" onclick="$(\'#endMap\').html(\'' + item.fullName + '\'); $(\'#lat_end\').val(\'' + item.latitude + '\'); $(\'#long_end\').val(\'' + item.longitude + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag-checkered"></i></a>' +
                                    '<br />Mobile No. :' + item.mobileNo + '' +
                                    '</div>Last check in :' + app.mapService.viewModel.format_time_date2(item.currentTime);

                                filterBy = item.fullName;
                                _searchMC_data[i] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.latitude + '\', \'' + item.longitude + '\');" class="post_site" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                    '&nbsp;&nbsp;  <img src="images/otherMC.png" class="icon_result_width" />' + filterBy + '</a></li>' +
                                    ''
                                ];

                                _mc[i] = [mcInfo, item.latitude, item.longitude, item.userId];
                                _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.latitude, item.longitude);
                                _count_allLatLong++;
                                //} else {
                                //alert('myUser');
                                //j++;
                                //}
                                if (item.userId == userId) {
                                    myLat = item.latitude;
                                    myLong = item.longitude;
                                    myInfo = mcInfo;
                                }
                            });

                            operation.success(response);
                        } else {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getEngineerMapTTSME.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json',
                                async: false,
                                success: function(response) {

                                    var mcInfo = "";
                                    var j = 0;
                                    $.each(response.engineerMaps, function(i, item) {
                                        var filterBy = '';

                                        //if (item.userId != userId) {
                                        mcInfo = '<div style="width:200px;">' +
                                            '<a href="#mapJobList" class="underline" onclick="app.mapService.viewModel.loadJobList(\'' + item.userId + '\');" data-userid="' + item.userId + '">' + item.fullName + '</a>' +
                                            '<br /><br /><a class="linkText" href="javascript:void(0);" onclick="$(\'#startMap\').html(\'' + item.fullName + '\'); $(\'#lat_start\').val(\'' + item.latitude + '\'); $(\'#long_start\').val(\'' + item.longitude + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag"></i></a> ' +
                                            '| <a class="linkText" href="javascript:void(0);" onclick="$(\'#endMap\').html(\'' + item.fullName + '\'); $(\'#lat_end\').val(\'' + item.latitude + '\'); $(\'#long_end\').val(\'' + item.longitude + '\'); app.mapService.viewModel.checkCal();"><i class="fa fa-flag-checkered"></i></a>' +
                                            '<br />Mobile No. :' + item.mobileNo + '' +
                                            '</div>Last check in :' + app.mapService.viewModel.format_time_date2(item.currentTime);


                                        filterBy = item.fullName;
                                        _searchMC_data[i] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.latitude + '\', \'' + item.longitude + '\');" class="post_site" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                            '&nbsp;&nbsp;  <img src="images/otherMC.png" class="icon_result_width" />' + filterBy + '</a></li>' +
                                            ''
                                        ];

                                        _mc[i] = [mcInfo, item.latitude, item.longitude, item.userId];
                                        _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.latitude, item.longitude);
                                        _count_allLatLong++;
                                        //} else {
                                        //alert('myUser');
                                        //j++;
                                        //}
                                        if (item.userId == userId) {
                                            myLat = item.latitude;
                                            myLong = item.longitude;
                                            myInfo = mcInfo;
                                        }
                                    });

                                    operation.success(response);

                                },

                                error: function(xhr, error) {
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map : getEngineerMap fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "MAP : getEngineerMap fail!", 'OK');
                                    }
                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "engineerMaps"
                }
            });
            var dataSite = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {

                        var dataValue = {
                            "userId": userId,
                            "token": localStorage.getItem("token"),
                            "regionId": "" + regionId + "",
                            "zoneId": "" + zoneId + "",
                            "siteId": "" + _siteCode + "",
                            "lat": _default_lat,
                            "longi": _default_long,
                            "version": "2"
                        };
                        //alert('getSiteMap : ' + JSON.stringify(dataValue));

                        if (app.configService.isMorkupData) {
                            app.application.hideLoading();
                            //alert(JSON.stringify(response));
                            //alert("success");
                            var count_searchSite = 0;
                            var response={};
                            $.each(response.siteMaps, function(i, item) {

                                //alert(i);
                                var SITE_CODE = "";
                                var siteTypes = "";
                                var siteAlarms = "";
                                var imagePin = "";
                                var filterBy = "";
                                var siteOn = false;
                                var siteInAct = false;
                                var siteStatus = "0";
                                var siteStatusList = "";
                                var snt = "";
                                var sne = "";
                                var sIds = "";
                                var regions = "";
                                var zones = "";
                                $.each(item.sDtls, function(ii, iitem) {
                                    //filterBy = iitem.sCd;
                                    filterBy = app.mapService.viewModel.fn_siteName_final(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);
                                    data_icon = app.mapService.viewModel.fn_siteName_icon(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);
                                    SITE_CODE += filterBy + "|";
                                    siteTypes += iitem.sTy + ",";
                                    siteAlarms += iitem.sAl + ",";
                                    siteStatusList += iitem.jSt + ",";
                                    sIds += iitem.sId + ",";
                                    regions += iitem.region + ",";
                                    zones += iitem.zone + ",";
                                    imagePin += app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt);
                                    snt += iitem.snt + ",";
                                    sne += iitem.sne + ",";

                                    _searchSite_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + data_icon + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                        '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                        ''
                                    ];
                                    //_searchNameTH_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                    //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                    //     ''
                                    // ];
                                    // _searchNameEN_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                    //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                    //     ''
                                    // ];
                                    //console.debug(_searchSite_data[count_searchSite]);
                                    if (iitem.jSt == "1") {
                                        siteOn = true;
                                    }
                                    if (iitem.jSt == "2") {
                                        siteInAct = true;
                                    }
                                    count_searchSite++;
                                });
                                if (siteOn) {
                                    siteStatus = "1";
                                } else {
                                    if (siteInAct) {
                                        siteStatus = "2";
                                    }
                                }

                                if (i == Math.round(Object.keys(response.siteMaps).length / 2) - 1) {
                                    _default_lat = item.ltt;
                                    _default_long = item.lgt;
                                }
                                _site[i] = [
                                    app.mapService.viewModel.tempBalloon_allSite(SITE_CODE, siteTypes, siteAlarms, item.ltt, item.lgt, siteStatusList, snt, sne, sIds, regions, zones),
                                    item.ltt,
                                    item.lgt,
                                    app.mapService.viewModel.fn_checkImagePin(imagePin, siteStatus)
                                ];
                                _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.ltt, item.lgt);
                                _count_allLatLong++;

                            });
                            //alert("ok");
                            app.mapService.viewModel.setType_search('earch_site');
                            //---------go to set Marker ------------
                            app.mapService.viewModel._putMarker();
                            //app.mapService.viewModel.hideLoading();
                            operation.success(response);
                        } else {
                            $.ajax({
                                beforeSend: app.loginService.viewModel.checkOnline,
                                url: app.configService.serviceUrl + "post-json.service?s=transaction-service&o=getSiteMapTTSME.json",
                                type: "POST",
                                timeout: 180000,
                                data: JSON.stringify(dataValue),
                                dataType: "json",
                                contentType: 'application/json',
                                async: false,
                                timeout: 360000,
                                success: function(response) {
                                    app.application.hideLoading();
                                    //alert(JSON.stringify(response));
                                    //alert("success");
                                    var count_searchSite = 0;
                                    $.each(response.siteMaps, function(i, item) {

                                        //alert(i);
                                        var SITE_CODE = "";
                                        var siteTypes = "";
                                        var siteAlarms = "";
                                        var imagePin = "";
                                        var filterBy = "";
                                        var siteOn = false;
                                        var siteInAct = false;
                                        var siteStatus = "0";
                                        var siteStatusList = "";
                                        var snt = "";
                                        var sne = "";
                                        var sIds = "";
                                        var regions = "";
                                        var zones = "";
                                        $.each(item.sDtls, function(ii, iitem) {
                                            //filterBy = iitem.sCd;
                                            filterBy = app.mapService.viewModel.fn_siteName_final(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);
                                            data_icon = app.mapService.viewModel.fn_siteName_icon(iitem.sCd, iitem.bsc, iitem.msc, iitem.snt, iitem.sne);

                                            SITE_CODE += filterBy + "|";
                                            siteTypes += iitem.sTy + ",";
                                            siteAlarms += iitem.sAl + ",";
                                            siteStatusList += iitem.jSt + ",";
                                            sIds += iitem.sId + ",";
                                            regions += iitem.region + ",";
                                            zones += iitem.zone + ",";
                                            imagePin += app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt);
                                            snt += iitem.snt + ",";
                                            sne += iitem.sne + ",";

                                            _searchSite_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + data_icon + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                                '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                                ''
                                            ];
                                            // _searchNameTH_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                            //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                            //     ''
                                            // ];
                                            // _searchNameEN_data[count_searchSite] = ['<li onclick="app.mapService.viewModel.clickResult(\'' + filterBy + '\', \'' + item.ltt + '\', \'' + item.lgt + '\');" class="post_site" title="' + iitem.sTy + iitem.sAl + '" data-filter="' + filterBy + '"><a href="#tabstrip-map" style="text-decoration:none;"> ' +
                                            //     '&nbsp;&nbsp; <img src="' + app.mapService.viewModel.fn_checkPIN_SITE_TYPE(iitem.sTy, iitem.sAl, iitem.jSt) + '" class="icon_result_width" /> ' + filterBy + '</a></li>' +
                                            //     ''
                                            // ];
                                            //console.debug(_searchSite_data[count_searchSite]);
                                            if (iitem.jSt == "1") {
                                                siteOn = true;
                                            }
                                            if (iitem.jSt == "2") {
                                                siteInAct = true;
                                            }
                                            count_searchSite++;
                                        });
                                        if (siteOn) {
                                            siteStatus = "1";
                                        } else {
                                            if (siteInAct) {
                                                siteStatus = "2";
                                            }
                                        }

                                        if (i == Math.round(Object.keys(response.siteMaps).length / 2) - 1) {
                                            _default_lat = item.ltt;
                                            _default_long = item.lgt;
                                        }
                                        _site[i] = [
                                            app.mapService.viewModel.tempBalloon_allSite(SITE_CODE, siteTypes, siteAlarms, item.ltt, item.lgt, siteStatusList, snt, sne, sIds, regions, zones),
                                            item.ltt,
                                            item.lgt,
                                            app.mapService.viewModel.fn_checkImagePin(imagePin, siteStatus)
                                        ];
                                        _allLatLong[_count_allLatLong] = new google.maps.LatLng(item.ltt, item.lgt);
                                        _count_allLatLong++;

                                    });
                                    //alert("ok");
                                    app.mapService.viewModel.setType_search('earch_site');
                                    //---------go to set Marker ------------
                                    app.mapService.viewModel._putMarker();
                                    //app.mapService.viewModel.hideLoading();
                                    operation.success(response);

                                },

                                error: function(xhr, error) {
                                    app.application.hideLoading();
                                    if (!app.ajaxHandlerService.error(xhr, error)) {
                                        ////console.log("map : getSiteMap fail!");
                                        ////console.log(xhr);
                                        ////console.log(error);

                                        navigator.notification.alert(xhr.status + ' ' + error,
                                            function() {}, "MAP : getSiteMap fail!", 'OK');
                                    }
                                }
                            });
                        }

                    }
                },
                schema: {
                    data: "siteMaps"
                }
            });
            dataZone.read();
            dataMC.read();
            dataSite.read();
            if (_siteCode != "") {
                $("#searchText").val(_siteCode);
                app.mapService.viewModel.runScript();
            }
            //console.debug("loaddata site total : " + _site.length);
            $(".c_loading").hide();
        },

        loadJobList: function(job_userId) {
            var m_pageSize = 8;
            $('#div_map_bottom').hide();
            $("#mapJob_content").css('max-height', $(window).height() - 100);
            app.application.showLoading();

            if (_mapJob_detail_userId != job_userId) {
                _map_page = 1;
                $("#mapJob_content").data("kendoMobileScroller").scrollTo(0, 0);
                for (var i = 1; i <= 20; i++) {
                    $("#ul_mapJobList" + i).kendoListView({
                        dataSource: null
                    });
                }
            }
            if (_map_page == _map_page2) {
                $("#mapJob_content").data("kendoMobileScroller").scrollTo(0, 0);
            }
            _map_page2 = _map_page;
            _mapJob_detail_userId = job_userId;
            var regionId, zoneId, jobPriority, jobStatus, teamId,
                userId = job_userId;

            regionId = app.mapService.viewModel.checkNull($("#dregion").val());
            zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            jobPriority = app.mapService.viewModel.checkNull($("#dPriority").val());
            jobStatus = app.mapService.viewModel.checkNull($("#dstatus").val());
            teamId = app.mapService.viewModel.checkNull($("#dsteam").val());
            zoneId = app.mapService.viewModel.checkNull($("#dzone").val());
            var dataValue = {
                "userId": userId,
                "token": localStorage.getItem("token"),
                "regionId": "" + regionId + "",
                "zoneId": "" + zoneId + "",
                "jobPriority": "" + jobPriority + "",
                "jobStatus": "" + jobStatus + "",
                "teamId": "" + teamId + "",
                "name": "",
                "jbId": "",
                "version": "2"
            };
            //alert(JSON.stringify(dataValue));
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: function(operation) {
                        $.ajax({
                            beforeSend: app.loginService.viewModel.checkOnline,
                            url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJob.json',
                            type: "POST",
                            timeout: 180000,
                            data: JSON.stringify(dataValue),
                            dataType: "json",
                            contentType: 'application/json; charset=UTF-8',
                            success: function(response) {
                                //alert(JSON.stringify(response.jobs));
                                operation.success(response.jobs);
                            },
                            error: function(xhr, error) {
                                app.application.hideLoading();
                                if (!app.ajaxHandlerService.error(xhr, error)) {
                                    ////console.log("map : getJob fail!");
                                    ////console.log(xhr);
                                    ////console.log(error);

                                    navigator.notification.alert(xhr.status + ' ' + error,
                                        function() {}, "MAP : getJob fail!", 'OK');
                                }
                            }
                        });

                    }
                },
                pageSize: m_pageSize,
                page: _map_page
            });

            var listV = $("#ul_mapJobList" + _map_page).kendoListView({
                dataSource: dataSource,
                dataBound: function() {

                    app.application.hideLoading();
                    var total = JSON.stringify(dataSource._total);
                    if ((total - (_map_page * m_pageSize)) <= 0) {
                        $('#div_map_bottom').hide();
                    } else {
                        $('#div_map_bottom').show();
                    }
                    if (total <= 0 && _map_page == 1) {
                        $('#div_map_notFound').show();
                    } else {
                        $('#div_map_notFound').hide();
                    }

                },
                template: kendo.template($("#map-template").html())
            }).data("kendoListView");


        },

        fn_checkPIN_SITE_TYPE: function(pinSiteType, pinSiteAlarm, jSt) {
            var image_name = "";
            var status = "";
            if (jSt != "0") {
                status = "-" + jSt;
            }
            if (pinSiteAlarm == "N") {
                if (pinSiteType == "S") image_name = "images/asn" + status + ".png";
                else if (pinSiteType == "C") image_name = "images/csn" + status + ".png";
                else if (pinSiteType == "SC") image_name = "images/allsn" + status + ".png";
                else image_name = "images/icon_close.png";
            } else if (pinSiteAlarm == "A") {
                if (pinSiteType == "S") image_name = "images/allsam" + status + ".png";
                else if (pinSiteType == "C") image_name = "images/csam" + status + ".png";
                else if (pinSiteType == "SC") image_name = "images/allsam" + status + ".png";
                else image_name = "images/icon_close.png";
            }

            return image_name;
        },
        showMap: function() {
            $('#setFilter').val('set');
            _siteCode = "";
            $("#searchText").val('');
            app.mapService.showNewSolution();
        },
        showHelp: function() {
            // app.helpService.viewModel.showMapHelp(2);
            $('#hd_help').val("2");
            app.application.navigate(
                '#Help'
            );
        },

        mapFromNormalFlow: function() {
            var profileData = JSON.parse(localStorage.getItem("profileData"));
            if (profileData) {
                var usrLat = profileData.profiles[0].zoneLat;
                var usrLng = profileData.profiles[0].zoneLon;
                //console.debug(usrLat + ":" + usrLng);
                map.setZoom(10);
                if (usrLat && usrLng && usrLat != "0.0" && usrLng != "0.0") {
                    //if user login is assign to one zone display site within zoom 16
                    //1. set map
                    _usrDisplay = "S";
                    _displayType = "S";
                    map.setZoom(16);
                    _default_lat = usrLat;
                    _default_long = usrLng;
                    var center = new google.maps.LatLng(_default_lat, _default_long);
                    map = new google.maps.Map(document.getElementById("map-canvas"), {
                        center: center,
                        zoom: map.getZoom(),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    
                    //2. loadData MC & Site
                    setTimeout(app.mapService.viewModel.loadData, 1000);
                } else {
                    //if user login is assign to multi zone display zone with zoom 10
                    //1. set map
                    _usrDisplay = "Z";
                    map.setZoom(16);
                    //console.debug('Display Zone');
                    _displayType = "S";

                    _default_lat = JSON.parse(localStorage.getItem("profileData")).profiles[0].regionLat;
                    _default_long = JSON.parse(localStorage.getItem("profileData")).profiles[0].regionLon;
                    var center = new google.maps.LatLng(_default_lat, _default_long);
                    map = new google.maps.Map(document.getElementById("map-canvas"), {
                        center: center,
                        zoom: map.getZoom(),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    
                    //2. loadData zone cluster in user region
                    setTimeout(app.mapService.viewModel.loadData, 1000);


                }



            } else {
                alert("User Profile is undefined!!");
            }

        },

        mapFromSiteAlarm: function() {
            // _usrDisplay = "S";
            _displayType = "S";
            map.setZoom(16);
            //alert(_default_lat + " : " + _default_long);
            // _default_lat = usrLat;
            // _default_long = usrLng;
            var center = new google.maps.LatLng(_default_lat, _default_long);
            map = new google.maps.Map(document.getElementById("map-canvas"), {
                center: center,
                zoom: map.getZoom(),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            //2. loadData MC & Site
            setTimeout(app.mapService.viewModel.loadData, 1000);
        },

        mapFromJob: function() {
            // _usrDisplay = "Z";
            _displayType = "Z";
            map.setZoom(10);

            _default_lat = app.mapService.viewModel.get("latitude");
            _default_long = app.mapService.viewModel.get("longitude");
            var center = new google.maps.LatLng(_default_lat, _default_long);
            map = new google.maps.Map(document.getElementById("map-canvas"), {
                center: center,
                zoom: map.getZoom(),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            
            //2. loadData MC & Site
            setTimeout(app.mapService.viewModel.loadData, 1000);
            app.mapService.viewModel.directTo(_default_lat, _default_long);

        },

        //------------------------------------------------------------------------------end
    });

    app.mapService = {

        initLocation: function() {

            
            app.application.hideLoading();
            $('.c_div_searchResult').hide();
            $('#div_map_notFound').hide();
            
            if (!app.loginService.viewModel.get('isOffline')) {
                $('#div_map_bottom').bind('click', function() {
                    _map_page++;
                    app.mapService.viewModel.loadJobList(_mapJob_detail_userId);
                });


                var mapOptions;
               
                app.mapService.viewModel.set("isGoogleMapsInitialized", true);

                mapOptions = {
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: true,
                    mapTypeControl: true,
                    center: new google.maps.LatLng(13.7899038, 100.54076)
                        //,zoomControl: false

                };

               
                $("#mapJob_content").kendoMobileScroller();
                window.onresize = function(event) {
                    $("#mapJob_content").css('max-height', $(window).height() - 100);
                    //$("#mapJob_content").kendoMobileScroller();
                };

                $("#map-canvas").css("height", $(window).height() - 100);
                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
               
                



                directionsDisplay = new google.maps.DirectionsRenderer({
                    polylineOptions: {
                        strokeColor: "#6B008F"
                    }
                });


               
            }
            //}
        },

        show: function() {
            $('#div_map_bottom').hide();
            //map = null;
            //_mc =[] ;
            //_site = [];
            //_searchSite_data = [];
            //_searchMC_data = [];
            //_allLatLong = [];
            //marker_mc = [];
            //marker_site = [];
            //marker = [];
            $("#map-canvas").css("display", "");

            app.mapService.viewModel.setType_search('earch_site');
            //alert($("#setFilter").val());
            $(".c_loading").hide();
            if (!app.loginService.viewModel.get('isOffline')) {
                for (var i = 1; i <= 20; i++) {
                    $("#ul_mapJobList" + i).kendoListView({
                        dataSource: null
                    });
                }

                if ($("#setFilter").val() == "set") {

                    app.application.showLoading();
                    $("#setFilter").val("unset");
                    //$(".c_loading").show();
                    var center = new google.maps.LatLng(_default_lat, _default_long);
                    map = new google.maps.Map(document.getElementById("map-canvas"), {
                        center: center,
                        zoom: map.getZoom(),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });
                    //app.application.showLoading();

                    setTimeout(app.mapService.viewModel.loadData, 1000);
                }
                if (!app.mapService.viewModel.get("isGoogleMapsInitialized")) {
                    return;
                }
                //setTimeout(app.mapService.viewModel._putMarker, 5000);
                //show loading mask in case the location is not loaded yet 
                //and the user returns to the same tab
                //app.mapService.viewModel._putMarker();
                //app.mapService.viewModel.showLoading();



                //resize the map in case the orientation has been changed while showing other tab
                google.maps.event.trigger(map, "resize");
            }
        },
        showNewSolution: function() {

            //app.mapService.viewModel.get("isGoogleMapsInitialized")
            $("#map-direction-wrap").hide();
            $('#div_map_bottom').hide();

            $("#map-canvas").css("display", "");

            _siteCode = "";
            $("#searchText").val('');

            app.mapService.viewModel.setType_search('earch_site');

            // $(".c_loading").hide();
            if (!app.loginService.viewModel.get('isOffline')) {
                for (var i = 1; i <= 20; i++) {
                    $("#ul_mapJobList" + i).kendoListView({
                        dataSource: null
                    });
                }
                //mapFromMode: "N", // 1. N : from normal || 2. A : direct form alarm site || 3. J : direct from job

                var mode = app.mapService.viewModel.get("mapFromMode");
                if (mode == "N") {
                    //case normal flow
                    app.mapService.viewModel.mapFromNormalFlow();

                } else if (mode == "A") {
                    // case back from site alarm
                    app.mapService.viewModel.mapFromSiteAlarm();
                } else if (mode == "J") {
                    //case go from job list
                    app.mapService.viewModel.mapFromJob();
                    app.mapService.viewModel.set("mapFromMode","N");
                }
                
                google.maps.event.addListener(map, 'idle', function() {
                    var location = map.getCenter();

                    var center = new google.maps.LatLng(_default_lat, _default_long);

                    dragstart = center;
                    //console.log("dragend : " + location.lat() + " : " + location.lng());
                    dragend = location;
                    var dist = app.mapService.viewModel.distance(dragstart.lat(), dragstart.lng(), dragend.lat(), dragend.lng(), 'K');
                    //console.log("difference : " + dist);
                    var zoomLevel = map.getZoom();
                    if (zoomLevel <= 14 && _displayType == "S") {
                        //clear site and site marker
                        if (dist >= 10) {
                            _default_lat = location.lat();
                            _default_long = location.lng();
                            //setTimeout(app.mapService.viewModel.loadSiteOnly, 1000);
                            $(".c_loading").hide();
                            app.mapService.viewModel.loadSiteOnly();
                            $(".c_loading").hide();
                        }
                    }

                });

                google.maps.event.addListener(map, 'zoom_changed', function() {
                    var zoomLevel = map.getZoom();
                    //console.debug("event : zoom_changed level = " + zoomLevel);
                    if (zoomLevel >= 15 && _displayType == "Z") {
                        //console.debug("event : zoom_changed (Site Display)");
                        for (var i = 0; i < marker_zone.length; i++) {
                            marker_zone[i].setMap(null);
                        }
                        for (var i = 0; i < marker_mc.length; i++) {
                            marker_mc[i].setMap(null);
                        }

                        for (var i = 0; i < marker_site.length; i++) {
                            marker_site[i].setMap(null);
                        }

                        for (var i = 0; i < marker_mc.length; i++) {
                            marker_mc[i].setMap(map);
                        }

                        for (var i = 0; i < marker_site.length; i++) {
                            marker_site[i].setMap(map);
                        }

                        _displayType = "S";
                        //map.panTo(new google.maps.LatLng(_default_lat, _default_long));
                        app.mapService.viewModel.check();
                        //app.mapService.viewModel.myPinLocation();
                    }

                    if (zoomLevel <= 14 && _displayType == "S") {

                        //console.debug("event : zoom_changed (Zone Display)");
                        for (var i = 0; i < marker_zone.length; i++) {
                            marker_zone[i].setMap(null);
                        }

                        for (var i = 0; i < marker_mc.length; i++) {
                            marker_mc[i].setMap(null);
                        }
                        //console.debug(_site.length);
                        for (var i = 0; i < _site.length; i++) {
                            marker_site[i].setMap(null);
                        }

                        for (var i = 0; i < marker_zone.length; i++) {
                            marker_zone[i].setMap(map);
                        }
                        _displayType = "Z";
                    }
                });

                if (!app.mapService.viewModel.get("isGoogleMapsInitialized")) {
                    return;
                }


                //resize the map in case the orientation has been changed while showing other tab
                google.maps.event.trigger(map, "resize");

                
            }
        },
        hide: function() {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            //app.mapService.viewModel.hideLoading();

            $("#map-canvas").css("display", "none");
        },

        onShowIconOpen: function() {
            _dataShowIcon = [
                document.getElementById('checkBox_s').checked,
                document.getElementById('checkBox_sa').checked,
                document.getElementById('checkBox_c').checked,
                document.getElementById('checkBox_ca').checked,
                document.getElementById('checkBox_fe').checked
            ];
            //alert('open : '+$('#hidden_showIcon').val());
        },

        onShowIconClose: function() {
            //alert('close : '+$('#hidden_showIcon').val());
            if ($('#hidden_showIcon').val() == 'set') {
                //alert('close : setShowIcon : '+_dataShowIcon);
                $('#hidden_showIcon').val('unset');
            } else {
                document.getElementById('checkBox_s').checked = _dataShowIcon[0];
                document.getElementById('checkBox_sa').checked = _dataShowIcon[1];
                document.getElementById('checkBox_c').checked = _dataShowIcon[2];
                document.getElementById('checkBox_ca').checked = _dataShowIcon[3];
                document.getElementById('checkBox_fe').checked = _dataShowIcon[4];
            }
        },

        viewModel: new MapViewModel()


    };
})(window);