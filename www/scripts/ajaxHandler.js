 (function(global) {

 	var app = global.app = global.app || {};

 	app.ajaxHandlerService = {
 		error: function(xhr, error) {

 			if (xhr.status == "401") {

 				if (app.application.view().id != "#login") {
 					if (!app.loginService.viewModel.get("isDup")) {

 						setTimeout(function() {
 							localStorage.removeItem("token");
 							localStorage.removeItem("profileData");
 							localStorage.removeItem("jbData");
 							localStorage.removeItem("jbCauseData");
 							localStorage.removeItem("jbCauseMData");
 							localStorage.removeItem("jbSolveData");
                            localStorage.removeItem("pauseDate");
 							app.loginService.viewModel.hideLoading();
 							navigator.notification.alert("Duplicate login",
 								function() {
 									app.loginService.viewModel.set("isDup",false);
 									var os = kendo.support.mobileOS;
 									if (os.ios) {
 										app.application.navigate(
 											'#login'
 										);
 									} else {
 										navigator.app.exitApp();
 									}
 								}, "Authorize error", 'OK');
 						}, 0);
 					}
 					app.loginService.viewModel.set("isDup",true);
 				} else {
 					localStorage.removeItem("token");
 					localStorage.removeItem("profileData");
 					localStorage.removeItem("jbData");
 					localStorage.removeItem("jbCauseData");
 					localStorage.removeItem("jbCauseMData");
 					localStorage.removeItem("jbSolveData");
                    localStorage.removeItem("pauseDate");
 				}
 				////console.log(xhr);
 				////console.log(error);
 				return true;
 			}
 			if (xhr.status == "404") {
 				//app.loginService.viewModel.set("isOffline", true);
// 				navigator.notification.alert("Service not found!",
// 					function() {},
// 					"Server error", 'OK');

 				//			////console.log("Status offline");
 				//				if (app.application.view().id != "#tabstrip-edit") {
 				//					return true;
 				//				} else {
 				//					////console.log(xhr);
 				//					////console.log(error);
 				//					return false;
 				//				}
 			}
 			if (xhr.status == "0") {

 				////console.log("Status offline");
 				if (!app.loginService.viewModel.get("isFail")) {

// 					navigator.notification.alert("Connect server fail! Please retry.",
// 						function() {
// 							app.loginService.viewModel.set("isFail", false);
// 						},
// 						"Server error", 'OK');
 				}

 				app.loginService.viewModel.set("isFail", true);

 				if (app.application.view().id != "#tabstrip-edit") {
 					return true;
 				} else {
 					////console.log(xhr);
 					////console.log(error);
 					return false;
 				}
 			} else {
 				return false;
 			}

 		},
 	};
 })(window);
