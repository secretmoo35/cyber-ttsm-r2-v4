var otpi = '';
var filter = {
    box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

    // following 4 filters should NOT be used together, they are OR relationship
    read: 0, // 0 for unread SMS, 1 for SMS already read
    body: 'OTP:', // content to match
    indexFrom: 0, // start from index 0
    maxCount: 10, // count of SMS to return each time
};


//-----------------------------------------------------------------------



(function(global) {
    var LoginViewModel,
        app = global.app = global.app || {};


    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isOTP: false,
        isOffline: false,
        isDup: false,
        isFail: false,
        sessionId: "",
        tokenId: "",
        username: "",
        password: "",
        //tmppass: "",
        OTP: "",
        _isLoading: true,
        userId: null,
        version: function() {
            return app.configService.version;
        },
        onOTP: function() {

            var that = this,
                dataSource = null,
                username = that.get("username").trim().toLowerCase(),
                password = that.get("password").trim();

            var isOffline = that.get("isOffline");

            if (!isOffline) {

                if (username === "" || password === "") {
                    navigator.notification.alert("Username and Password fields are required!",
                        function() {}, "Get OTP failed", 'OK');
                    return;
                }
                app.loginService.viewModel.showLoading();
                $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                    type: "POST",
                    timeout: 180000,
                    url: app.configService.serviceUrl + "authentication.service?s=master-service&o=getTTSMLogin.json",
                    data: JSON.stringify({
                        "version": "2",
                        "userName": username,
                        "password": password
                    }),
                    dataType: "json",
                    contentType: 'application/json',
                    success: function(response) {
                        ////console.log("Connect service OTP : success" + JSON.stringify(response));

                        if (response.status == "TRUE") {
                            ////console.log('Please check SMS. ');
                            that.set("isOTP", true);
                            that.set("sessionId", response.sessionId);
                            that.set("tokenId", response.tokenId);
                            navigator.notification.alert("Please check SMS.",
                                function() {}, "Get OTP success! ", 'OK');
                            var os = kendo.support.mobileOS;
                            if (!os.ios) {
                                if (SMS) SMS.listSMS(filter, function(data) {
                                    if (Array.isArray(data)) {
                                        for (var i in data) {
                                            var sms = data[i];
                                            var smsBody = sms.body;
                                            if (smsBody != null && smsBody != undefined) {
                                                if (smsBody.indexOf(':') > -1) {
                                                    var inx = smsBody.indexOf(':');
                                                    if (smsBody.indexOf('OTP:') > -1) {
                                                        otpi = smsBody.substring(inx + 1, inx + 5);
                                                        that.set("OTP", otpi);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                            //that.set("password", "");
                            //that.set("tmppass", password);
                            app.loginService.viewModel.hideLoading();
                            return;
                        } else {
                            ////console.log('Get OTP failed :: ' + response.msg);
                            navigator.notification.alert(response.msg,
                                function() {}, "Get OTP failed", 'OK');
                            //that.set("tmppass","")
                            app.loginService.viewModel.hideLoading();
                            return;
                        }

                    },
                    error: function(xhr, error) {
                        console.log("error");
                        app.loginService.viewModel.hideLoading();
                        console.log(JSON.stringify(xhr));
                        console.log(error);
                        if (!app.ajaxHandlerService.error(xhr, error)) {
                            console.log("Get otp failed");
                            console.log(xhr);
                            console.log(error);
                            navigator.notification.alert(xhr.status + ' ' + error,
                                function() {}, "Get otp failed", 'OK');
                        }
                        return;
                    },
                    complete: function() {

                    }
                });
            } else {
                navigator.notification.alert("Network is unusable!",
                    function() {
                        //isOffline = true;
                    }, "Login fail", "OK");
            }

            that.set("isOffline", isOffline);

        },
        onLogin: function() {
            var that = this,
                username = that.get("username").trim().toLowerCase(),
                password = that.get("password").trim(),
                OTP = that.get("OTP").trim(),
                isOffline = that.get("isOffline"),
                sessionId = that.get("sessionId");

            if (!isOffline) {

                if (username === "" || OTP === "") {
                    navigator.notification.alert("Username and OTP fields are required!",
                        function() {}, "Login failed", 'OK');
                    return;
                }
                app.loginService.viewModel.showLoading();
                ////console.log("Otp Click");
                if (app.configService.isMorkupData) {
                	console.log("morkup data");
                    var morkupProfile = {
                        "profiles": [{
                            "userId": "406",
                            "firstName": "Weerasak",
                            "lastName": "Phangsent",
                            "regionId": "BKK",
                            "zoneId": "B1",
                            "dept": "MNMD",
                            "sec": "MNM-AREA1",
                            "telNo": "029492353",
                            "eMail": "hansasae@ais.co.th",
                            "mobileNo": "0813409995",
                            "userRole": "03",
                            "zoneDesc": "MNM-AREA1 (Bangkok-ST2)",
                            "relocateFlag": "Y",
                            "countDown": "60",
                            "fullName": "Weerasak Phangsent",
                            "addSiteAccessFlag": "Y",
                            // "zoneLat": "13.819435",
                            // "zoneLon": "100.624253",
                            "regionLat": "13.813018",
                            "regionLon": "100.861784",
                            "dashboardZone": "3"
                        }],
                        "version": "1",
                        "userId": "406"
                    };
                    localStorage.setItem("profileData", JSON.stringify(morkupProfile));

                    // var userRole = "03";
                    // if (userRole != "01") {
                        
                    //     $(".tTeam").show();
                    //     $(".tMy").hide();
                    //     console.log("goto myteam1");
                    //     app.application.navigate(
                    //         '#tabstrip-team'
                    //     );
                    // } else {
                    //     $(".tMy").show();
                    //     $(".tTeam").hide();
                    //     app.application.navigate(
                    //         '#tabstrip-my'
                    //     );
                    // }
                    app.application.navigate(
                                    '#LoadMaster'
                                );

                } else {
                    $.ajax({ //using jsfiddle's echo service to simulate remote data loading
                        type: "POST",
                        timeout: 180000,
                        url: app.configService.serviceUrl + "authentication.service?s=master-service&o=getTTSMLoginOTP.json",
                        data: JSON.stringify({
                            "version": "2",
                            "sessionId": sessionId,
                            "userName": username,
                            "password": password,
                            "otp": OTP
                        }),
                        dataType: "json",
                        contentType: 'application/json',
                        success: function(response) {
                            ////console.log("Connect service login : Complete :" + JSON.stringify(response));
                            //navigator.notification.alert(JSON.stringify(response),
                            //function () { }, "Login failed", 'OK');
                            app.loginService.viewModel.hideLoading();
                            //alert('token : '+response.token);
                            if (response.status == "TRUE" && response.token != null) {
                                localStorage.setItem("token", response.token);
                                that.set("isLoggedIn", true);
                                ////console.log(response.token);
                                app.loginService.viewModel.set("userId", response.msg);
                                that.clearCache(response.msg);

                                //that.set("password",that.get("tmppass"));

                                app.cryptographyService.encrypt();

                                that.clearForm();



                                app.application.navigate(
                                    '#LoadMaster'
                                );
                            } else {
                                console.log('Login return false' + response.msg);
                                navigator.notification.alert(response.msg,
                                    function() {}, "Login failed", 'OK');

                                return;
                            }

                        },
                        error: function(xhr, error) {
                            app.loginService.viewModel.hideLoading();
                            if (!app.ajaxHandlerService.error(xhr, error)) {
                                console.log("Get Login failed");
                                ////console.log(xhr);

                                navigator.notification.alert(xhr.status + ' ' + error,
                                    function() {}, "Get Login failed", 'OK');
                            }
                            return;
                        },
                        complete: function() {

                        }
                    });
                }



            } else {
                ////console.log("!!!Off line mode!!!");
                var flag = false;

                navigator.notification.confirm("Offline login",
                    function(i) {
                        if (i == 1) {
                            if (username === "" || password === "" || OTP === "") {
                                navigator.notification.alert("Username, Password and OTP fields are required!",
                                    function() {}, "Login failed", 'OK');
                                return;
                            }

                            flag = app.cryptographyService.decrypt();
                            ////console.log("flag : " + flag);

                            if (flag) {
                                var relocateFlag = JSON.parse(localStorage.getItem("profileData")).profiles[0].relocateFlag;

                                if (relocateFlag == "Y") {
                                    app.masterService.viewModel.set("relocateFlag", true);
                                } else {
                                    app.masterService.viewModel.set("relocateFlag", false);
                                }

                                var userRole = JSON.parse(localStorage.getItem("profileData")).profiles[0].userRole;



                                if (userRole == "01") {
                                    app.masterService.viewModel.set("userRole", userRole);
                                    //$(".tMy").show();
                                    //$(".tTeam").hide();
                                    //app.application.navigate(
                                    //	'#tabstrip-my'
                                    //);
                                } else {
                                    app.masterService.viewModel.set("userRole", userRole);
                                    //$(".tTeam").show();
                                    //$(".tMy").hide();
                                    //app.application.navigate(
                                    //	'#tabstrip-team'
                                    //);
                                }

                                app.application.navigate(
                                    '#LoadMaster'
                                );


                            } else {
                                navigator.notification.alert("Username, Password and OTP not match!",
                                    function() {}, "Login failed", 'OK');
                            }
                        } else {
                            ////console.log("cancel offline mode");
                        }
                    }, "Network is unusable!");
            }

        },
        onLogout: function() {
            ////console.log("on logout");
            var that = app.loginService.viewModel;

            ////console.log("clear form");
            that.clearForm();

            ////console.log("clear cache");
            that.clearCache();

            ////console.log("set isloggedIn");
            that.set("isLoggedIn", false);
            //setTimeout(function() {
            app.jobService.viewModel.setCount("0", "0");
            ////console.log("redirect");
            app.application.hideLoading();
            app.application.navigate(
                '#login'
            );


            //that.hideLoading();
        },
        clearForm: function() {
            var that = this;

            that.set("username", "");
            that.set("password", "");
            that.set("OTP", "");
        },
        checkEnter: function(e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        },
        clearCache: function(userId) {
            var cache = localStorage.getItem("profileData");
            if (cache != null && cache != undefined) {
                if (JSON.parse(cache).userId != userId) {
                    localStorage.removeItem("profileData");
                    localStorage.removeItem("jbData");
                    localStorage.removeItem("jbCauseData");
                    localStorage.removeItem("jbCauseMData");
                    localStorage.removeItem("jbSolveData");
                    localStorage.removeItem("pauseDate");
                    //localStorage.removeItem("priorityData");
                    //localStorage.removeItem("statusData");
                    //localStorage.removeItem("reportTypeData");
                    //localStorage.removeItem("problemCauseData");
                    //localStorage.removeItem("problemCauseMultiData");
                    //localStorage.removeItem("problemSolveData");
                    //jbSolveData
                }
            }
        },
        checkOnline: function() {
            var that = app.loginService.viewModel;

            if (localStorage.getItem("profileData") == undefined || localStorage.getItem("profileData") == null) {
                setTimeout(function() {
                    app.application.navigate(
                        '#login'
                    );
                }, 1000);
                return false;
            }

            var isOffline = that.get("isOffline");
            if (isOffline) {
                that.hideLoading();
                //navigator.notification.alert("offline",
                //	function() {
                //
                //					}, "Internet Connection", 'OK');
                return false;
            }
        },
        //onOffline: function(e) {
        //	that.set("isOffline", true);
        //	navigator.notification.alert("offline",
        //		function() {}, "Internet Connection", 'OK');
        //	////console.log("Status offline");
        //},
        onBackKeyDown: function(e) {
            //var isLoggedIn = app.loginService.viewModel.get("isLoggedIn");

            //if (app.application.view().id == "#login") {
            navigator.notification.confirm(
                'Exit Application!', // message

                function(buttonIndex) {
                    if (buttonIndex == 2) {
                        navigator.app.exitApp();
                    }
                }, // callback to invoke with index of button pressed
                'TTSM', // title
                'Cancel,Exit' // buttonLabels
            );
            //}
            e.preventDefault();
            //else {
            //    e.preventDefault();
            //}
        },
        showLoading: function() {
            //if (this._isLoading) {
            app.application.showLoading();
            //}
        },
        hideLoading: function() {
            app.application.hideLoading();
        },
        setTmp: function() {
            var that = this;
            that.set("username", ""),
                that.set("password", "");
            that.set("OTP", "");
        },
        checkBypass: function() {

            var pauseStoredate = localStorage.getItem("pauseDate");
            if (pauseStoredate != null && pauseStoredate != undefined) {
                var pausedate = new Date(pauseStoredate);
                var newhour = app.configService.timeout;
                var divTime = ((new Date) - pausedate);

                if (divTime < newhour) {


                    //console.log("###### Check bypass #######");
                    var that = app.loginService.viewModel;
                    //var d = new Date();
                    //var currentTime = d.getTime();
                    //var idleTime = localStorage.getItem("idleTime");
                    //var diff =0;
                    //if (idleTime != undefined && idleTime != null){
                    //	diff = currentTime - idleTime;
                    //	////console.log("diff:" + diff);
                    //idleTime = currentTime;
                    //}

                    //if (idleTime != undefined && idleTime != null && diff > app.configService.timeout) {
                    //navigator.notification.alert("Login again!",
                    //	function() {
                    //		app.loginService.viewModel.onLogout();
                    //	}, "Time out", 'OK');

                    //////console.log("Time out");
                    //if idleTime
                    //	localStorge.getItem("idleTime",null);
                    //} else {

                    var profileData = localStorage.getItem("profileData");
                    if (profileData == null) {
                        that.set("isLoggedIn", false);
                    } else {
                        isOffline = that.get("isOffline");
                        that.set("isLoggedIn", true);
                        setTimeout(function() {
                            app.dashboardFilterService.viewModel.initFilter();
                            app.mapService.initLocation();
                            app.mapFilterService.viewModel.initFilter();

                        }, 5000);
                        var relocateFlag = JSON.parse(localStorage.getItem("profileData")).profiles[0].relocateFlag;
                        app.loginService.viewModel.set("userId", JSON.parse(localStorage.getItem("profileData")).profiles[0].userId);
                        if (relocateFlag == "Y") {
                            app.masterService.viewModel.set("relocateFlag", true);
                        } else {
                            app.masterService.viewModel.set("relocateFlag", false);
                        }

                        var userRole = JSON.parse(localStorage.getItem("profileData")).profiles[0].userRole;

                        if (userRole == "01") {
                            app.masterService.viewModel.set("userRole", userRole);
                            $(".tMy").show();
                            $(".tTeam").hide();
                        } else {
                            app.masterService.viewModel.set("userRole", userRole);
                            $(".tTeam").show();
                            $(".tMy").hide();
                        }
                        if (!isOffline) {

                            setTimeout(function() {
                                app.application.navigate(
                                    '#LoadMaster'
                                );
                            }, 0);
                        } else {
                            var relocateFlag = JSON.parse(localStorage.getItem("profileData")).profiles[0].relocateFlag;

                            if (relocateFlag == "Y") {
                                app.masterService.viewModel.set("relocateFlag", true);
                            } else {
                                app.masterService.viewModel.set("relocateFlag", false);
                            }

                            var userRole = JSON.parse(localStorage.getItem("profileData")).profiles[0].userRole;


                            app.application.navigate(
                                '#tabstrip-accept'
                            );

                            if (userRole == "01") {
                                app.masterService.viewModel.set("userRole", userRole);
                                $(".tMy").show();
                                $(".tTeam").hide();
                            } else {
                                app.masterService.viewModel.set("userRole", userRole);
                                $(".tTeam").show();
                                $(".tMy").hide();
                            }
                        }
                        //}
                    }
                }
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel(),
        init: function() {
            app.loginService.viewModel.setTmp();

            ////console.log('loading Login');
        },
        show: function() {
            app.loginService.viewModel.checkBypass();
            //navigator.splashscreen.hide();
        },
        hide: function() {
            //navigator.splashscreen.hide();
        },
    };
})(window);