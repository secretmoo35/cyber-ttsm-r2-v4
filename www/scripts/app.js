var gFileSystem = {};
var pageSize = 10;
var pausedate;
var timeout = 60;
//var idleTime = localStorage.getItem("idleTime");


(function(global) {
	var mobileSkin = "flat",
		app = global.app = global.app || {};

	app.application = new kendo.mobile.Application(document.body, {
		layout: "Login-layout",
		skin: 'flat'
	});

	//app.loginService.viewModel.set("isOffline", true);

	document.addEventListener("online", function() {

		if (app.loginService.viewModel.get("isOffline") == true) {
			app.loginService.viewModel.set("isOffline", false);
			//navigator.notification.alert("online",
			//	function() {}, "Internet Connection", 'OK');
			//app.loginService.viewModel.showLoading();

			

			//app.loginService.viewModel.hideLoading();

			//if (app.application.view().id != "#login") {
				//comsole.log("view id : " + app.application.view().id);
if (localStorage.getItem("offline") != undefined && localStorage.getItem("offline") != null){

		console.log('Call online');
		app.jobService.viewModel.onOnline();
	
}else{
	
navigator.notification.alert("online",
	function() {
		//console.log('Call online');
		//app.jobService.viewModel.onOnline();
}, "Internet Connection", 'OK');
}
			
			//}
		}
		
		////console.log("Status online");
	}, false);
	document.addEventListener("offline", function() {
		
			if (app.loginService.viewModel.get("isOffline") != true) {
				app.loginService.viewModel.set("isOffline", true);
				navigator.notification.alert("offline",
					function() {}, "Internet Connection", 'OK');
				////console.log("Status offline");
			}
		
	}, false);



	document.addEventListener('deviceready', function() {
		
		$.ajax({
			type: "POST", timeout: 180000,
			url: app.configService.serviceUrl + "authentication.service?s=master-service&o=getServerVersion.json",
			data: JSON.stringify({
				"version": app.configService.version
			}),
			dataType: "json",
			contentType: 'application/json',
			success: function(response) {	
				if(JSON.stringify(response) == '1'){
					//console.log('response:' + JSON.stringify(response)) ;
					window.open(app.configService.downloadVersionPath, '_system', 'location=yes');
					navigator.app.exitApp();
				}
								
			},
			error: function(xhr, error) {
				//console.log("error:" + error);
				if (!app.ajaxHandlerService.error(xhr, error)) {
					navigator.notification.alert(xhr.status + ' ' + error, function() {navigator.app.exitApp();}, "Check update version Failed", 'OK');
				}
			},
			complete: function() {

			}
		});
		//console.log("##### deviceready #########");
		//Thawat Edit 20/01/2015
		var pauseStoredate = localStorage.getItem("pauseDate");
		if (pauseStoredate != null && pauseStoredate != undefined) {
			pausedate = new Date(pauseStoredate);
			var newhour = app.configService.timeout;
			var divTime = ((new Date) - pausedate);
			//console.log("########## divTime ####>:"+divTime);
			if (divTime > newhour) {

				var cache = localStorage.getItem("profileData");
				if (cache != null && cache != undefined) {

					localStorage.removeItem("profileData");
					localStorage.removeItem("jbData");
					localStorage.removeItem("jbCauseData");
					localStorage.removeItem("jbCauseMData");
					localStorage.removeItem("jbSolveData");
					localStorage.removeItem("pauseDate");


				}

			}

			//console.log("#########$ LOGOUT ###########");
			/***************************************************/
		}



		document.addEventListener("pause", onPause, false);

		function onPause() {
			pausedate = new Date();
			//console.log("####### OnPause >:" + pausedate);
			localStorage.setItem("pauseDate", pausedate);
		}


		document.addEventListener("resume", onResume, false);

		function onResume() {
			var newhour = app.configService.timeout;
			//console.log("##### OnResume Pausedate ###>:"+ pausedate);

			//console.log();
			if (((new Date) - pausedate) > newhour) {


				//logout();


				var cache = localStorage.getItem("profileData");
				if (cache != null && cache != undefined) {

					localStorage.removeItem("profileData");
					localStorage.removeItem("jbData");
					localStorage.removeItem("jbCauseData");
					localStorage.removeItem("jbCauseMData");
					localStorage.removeItem("jbSolveData");
					localStorage.removeItem("pauseDate");

					setTimeout(function() {
						app.application.navigate(
							'#login'
						);
					}, 1000);
				}

			}
		}


		var os = kendo.support.mobileOS;
		console.log("os version :" + os.flatVersion);
		if (os.ios && os.flatVersion >= 700) {
			StatusBar.overlaysWebView(false)
			//if (os.ios && os.flatVersion >= 700 && os.flatversion < 800)
			StatusBar.styleDefault();

		}
		//StatusBar.overlaysWebView(false)
		////console.log("Start requestFileSystem");



		var networkState = navigator.connection.type;

		if (networkState == Connection.NONE) {
			//navigator.notification.alert("Please connect internet if possible",
			//	function() {}, "No Internet Connection", 'OK');
			app.loginService.viewModel.set("isOffline", true);
			////console.log("Initial offline");
		}
		setIdleTimeout(app.configService.timeout);
		////console.log("Idle timeout : 1000ms");
		document.onIdle = function() {
			////console.log("Idle");
			var cache = localStorage.getItem("profileData");
			if (cache != null && cache != undefined) {

				//alert("Time Out");

				////console.log("on logout");

				////console.log("clear form");

				////console.log("clear cache");
				//var cache = localStorage.getItem("profileData");
				if (cache != null && cache != undefined) {
					//if (JSON.parse(cache).userId != userId) {
					localStorage.removeItem("profileData");
					localStorage.removeItem("jbData");
					localStorage.removeItem("jbCauseData");
					localStorage.removeItem("jbCauseMData");
					localStorage.removeItem("jbSolveData");
					localStorage.removeItem("pauseDate");
					//                 }
				}

				////console.log("set isloggedIn");
				//that.set("isLoggedIn", false);
				////console.log("redirect");
				setTimeout(function() {


					app.application.navigate(
						'#login'
					);
				}, 1000);
			}


		}

		document.onBack = function(isIdle, isAway) {
			//console.log("#### Back #####");
			//////console.log(app.application.view().id);
			//if (isAway) {
			//var d = new Date();
			//var currentTime = d.getTime();
			//var idleTime = localStorage.getItem("idleTime");

			//if (idleTime != undefined && idleTime != null){
			//	var diff = currentTime - idleTime;
			//	////console.log("diff:" + diff);
			//}

			//if (idleTime != undefined && idleTime != null && diff > app.configService.timeout) {
			//	if (idleTime != undefined && idleTime != null) {
			//		localStorage.setItem("idleTime", null);
			//		navigator.notification.alert("Login again!",
			//			function() {

			//				var flag;
			//				if (app.loginService != undefined){
			//					flag = app.loginService.get("isLoggedIn");

			//				}else{
			//					flag = false

			//				}

			//if (app.application.view().id != "#login" && app.application.view().id != "\/"){
			//					if (flag){
			//				app.loginService.viewModel.onLogout();
			//			}
			//			}, "Time out", 'OK');

			//		////console.log("Time out");
			//	}
			//} else {
			//	localStorage.setItem("idleTime", currentTime);
			//}

			//}

			//if (isIdle) {
			//var d = new Date();
			//var currentTime = d.getTime();
			//var diff = currentTime - idleTime;
			// ////console.log("diff:" + diff);
			//idleTime = currentTime;

			//if (diff > app.configService.timeout) {
			//navigator.notification.alert("Login again!",
			//                             function() {
			//                             app.loginService.viewModel.onLogout();
			//                             }, "Time out", 'OK');

			//////console.log("Time out");
			//idleTime =null;
			//}

			//}

		}


		document.addEventListener("backbutton", app.loginService.viewModel.onBackKeyDown, false);
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.fileService.viewModel.onFileSystemSuccess, app.fileService.viewModel.onFileSystemError);
		//////console.log("gFileSystem"+gFileSystem.name);
		////console.log("End requestFileSystem");
		if (window.plugins.backgroundGeoLocation) {
			app.backgroundService.configureBackgroundGeoLocation();
			//navigator.notification.alert("Device",
			//function () { }, "Ready", 'OK');
			////console.log("Device : Ready");
		} else {
			navigator.notification.alert("Error",
				function() {}, "Background location failed", 'OK');
		}

		var server = app.configService.serviceUrl;
		var fingerprint = app.configService.fingerprint; // valid until sep 2014

		window.plugins.sslCertificateChecker.check(
			function() {
				////console.log("Conection Secure")
			},
			function(message) {
				if (message == "CONNECTION_NOT_SECURE") {
					////console.log("Connection not Secure")
					navigator.notification.alert("Connection not secure",
						function() {}, "Security error", 'OK');
				} else if (message == "CONNECTION_FAILED") {
					app.loginService.viewModel.set("isOffline", true);
					////console.log("Initial offline");
				}
			},
			server,
			fingerprint);
		navigator.splashscreen.hide();
	}, false);


	window.addEventListener('load', function() {
		//FastClick.attach(document.body);
		//setTimeout(function() { fn_countDown();},0);
		setTimeout(function(){ fn_countDown();},0);
	}, false);

	//var os = kendo.support.mobileOS,
	//        statusBarStyle = os.ios && os.flatVersion >= 700 ? "black-translucent" : "black";

	//var app = new kendo.mobile.Application(document.body, { statusBarStyle: statusBarStyle });
	//statusBarStyle: statusBarStyle,




	app.changeSkin = function(e) {
		if (e.sender.element.text() === "Flat") {
			e.sender.element.text("Native");
			mobileSkin = "flat";
		} else {
			e.sender.element.text("Flat");
			mobileSkin = "";
		}

		app.application.skin(mobileSkin);
	};


	app.backgroundService = {
		configureBackgroundGeoLocation: function() {
			//
			//
			// after deviceready
			//
			//

			// Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
			//  in order to prompt the user for Location permission.

			getlocationBg();

			function getlocationBg() {
				var options = {
					maximumAge: 30000,
					timeout: 30000,
					enableHighAccuracy: true
				};

				navigator.geolocation.getCurrentPosition(
					function(location) {

						if (app.application.view().id != "#login") {
							app.geolocationService.viewModel.sendLocation(location.coords);
						}

						////console.log('Location from Phonegap : ' + JSON.stringify(location.coords));

						setTimeout(getlocationBg, 300000);
					},
					function(error) {
						////console.log('Location Error : ' + error);
						setTimeout(getlocationBg, 60000);
					},
					options
				);

			}
			var bgGeo = window.plugins.backgroundGeoLocation;

			/**
			 * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
			 */
			//var sendlocation = function(response) {

			//	////console.log('send location bg : ' + JSON.stringify(location));
			//	app.geolocationService.viewModel.sendLocation(location);

			////
			// IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
			//  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
			// IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
			//
			//
			//	bgGeo.finish();
			//};

			/**
			 * This callback will be executed every time a geolocation is recorded in the background.
			 */
			var callbackFn = function(location) {
				////console.log('[js] BackgroundGeoLocation callback:  ' + JSON.stringify(location));
				// Do your HTTP request here to POST location to your server.
				//
				//
				////console.log('send location bg : ' + JSON.stringify(location));
				//app.geolocationService.viewModel.sendLocation(location);
				//////console.log('success')
				//sendlocation.call(this);
				bgGeo.finish();
			};

			var failureFn = function(error) {
				////console.log('BackgroundGeoLocation error');
			}

			// BackgroundGeoLocation is highly configurable.
			bgGeo.configure(callbackFn, failureFn, {
				desiredAccuracy: 10,
				stationaryRadius: 20,
				distanceFilter: 50,
				debug: false // <-- enable this hear sounds for background-geolocation life-cycle.
			});

			// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
			bgGeo.start();

			// If you wish to turn OFF background-tracking, call the #stop method.
			// bgGeo.stop()
		}

	}

})(window);
