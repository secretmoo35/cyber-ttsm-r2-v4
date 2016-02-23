(function (global) {
	var MyViewModel,
		app = global.app = global.app || {};


	MyViewModel = kendo.data.ObservableObject.extend({
		isSearch: false,
		lastupdatemy: null,
		_isLoading: true,
		searchtxt: '',
		userId: function () {
			var cache = localStorage.getItem("profileData");
			if (cache == null || cache == undefined) {
				return null;
			} else {
				return JSON.parse(cache).userId;
			}
		},
		loadMy: function () {
			var that = this;

			$("#lvMy").kendoMobileListView({
				dataSource: new kendo.data.DataSource({
					transport: {
						read: function (operation) {
							$.ajax({ //using jsfiddle's echo service to simulate remote data loading
								beforeSend: app.loginService.viewModel.checkOnline,
								type: "POST", timeout: 180000,
								url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMyTeam.json',
								data: JSON.stringify({
									"token": localStorage.getItem("token"),
									"userId": JSON.parse(localStorage.getItem("profileData")).userId,
									"zoneId": "",
									"version": "2"
								}),
								dataType: "json",
								contentType: 'application/json',
								success: function (response) {
									//store response
									//localStorage.setItem("regionData", JSON.stringify(response));
									//pass the pass response to the DataSource
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');
									that.set("lastupdatemy", format_time_date(new Date()));
									operation.success(response);
									////console.log(JSON.stringify(response));
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');
									//that.hideLoading();
									////console.log("fetch My : Complete");
									
									app.myService.viewModel.loadTeam();
								},
								error: function (xhr, error) {
									that.hideLoading();
									if (!app.ajaxHandlerService.error(xhr, error)) {
										////console.log("Get My failed");
										////console.log(xhr);
										////console.log(error);

										navigator.notification.alert(xhr.status + ' ' + error,
											function () { }, "Get My failed", 'OK');
									}
									//return;
								}
							});
						}
					},
					schema: {
						data: "myTeams"
					},
					filter: {
						field: "userId",
						operator: "eq",
						value: JSON.parse(localStorage.getItem("profileData")).userId
					},
					page: 1,
					pageSize: 1
				}),
				style: "inset",
				template: $("#my-template").html(),
			});
			////console.log('lvMy Loaded');
			app.myService.viewModel.loadMyStatus();
		},
		loadMyStatus: function () {
			var that = this;

			$("#lvMyStatus").kendoMobileListView({
				dataSource: new kendo.data.DataSource({
					transport: {
						read: function (operation) {
							$.ajax({ //using jsfiddle's echo service to simulate remote data loading
								beforeSend: app.loginService.viewModel.checkOnline,
								type: "POST", timeout: 180000,
								url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMyTeamStatus.json',
								data: JSON.stringify({
									"token": localStorage.getItem("token"),
									"userId": JSON.parse(localStorage.getItem("profileData")).userId,
									"zoneId": "",
									"version": "2"
								}),
								dataType: "json",
								contentType: 'application/json',
								success: function (response) {
									//store response
									//localStorage.setItem("regionData", JSON.stringify(response));
									//pass the pass response to the DataSource
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');
									that.set("lastupdatemy", format_time_date(new Date()));
									operation.success(response);
									////console.log(JSON.stringify(response));
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');
									//that.hideLoading();
									////console.log("fetch My : Complete");
									
									app.myService.viewModel.loadTeam();
								},
								error: function (xhr, error) {
									that.hideLoading();
									if (!app.ajaxHandlerService.error(xhr, error)) {
										////console.log("Get My failed");
										////console.log(xhr);
										////console.log(error);

										navigator.notification.alert(xhr.status + ' ' + error,
											function () { }, "Get My failed", 'OK');
									}
									//return;
								}
							});
						}
					},
					schema: {
						data: "myTeams"
					},
					filter: {
						field: "userId",
						operator: "eq",
						value: JSON.parse(localStorage.getItem("profileData")).userId
					},
					page: 1,
					pageSize: 1
				}),
				style: "inset",
				template: $("#myStatus-template").html(),
			});
			////console.log('lvMy Loaded');

		},
		loadTeam:function (){
		var that = this;	
		$("#lvTeam").kendoMobileListView({
				dataSource: new kendo.data.DataSource({
					transport: {
						read: function (operation) {
							$.ajax({ //using jsfiddle's echo service to simulate remote data loading
								beforeSend: app.loginService.viewModel.checkOnline,
								type: "POST", timeout: 180000,
								url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getTeamByUser.json',
								data: JSON.stringify({
									"token": localStorage.getItem("token"),
									"userId": JSON.parse(localStorage.getItem("profileData")).userId,
									"version": "2"
								}),
								dataType: "json",
								contentType: 'application/json',
								success: function (response) {
									//store response
									//localStorage.setItem("regionData", JSON.stringify(response));
									//pass the pass response to the DataSource
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');
									operation.success(response);

									app.myService.viewModel.hideLoading();
									that.set("lastupdateteam", format_time_date(new Date()));
									////console.log("My data : " + response);
									//navigator.notification.alert(JSON.stringify(response),
									//                        function () { }, "Get My Team failed", 'OK');

									////console.log("fetch My Team : Complete");
								},
								error: function (xhr, error) {
									////console.log("Get My Team failed");
									////console.log(xhr);
									////console.log(error);
									//that.hideLoading();
									if (!app.ajaxHandlerService.error(xhr, error)) {
										navigator.notification.alert(xhr.status + ' ' + error,
											function () { }, "Get My Team failed", 'OK');
									}
									//return;
								},
								complete: function () {

								}
							});
						}
					},
					schema: {
						data: "teamMaster"
					}
				}),
				template: $("#team-template").html(),
				//pullToRefresh: true,
				style: "inset"
			});
			////console.log('lvTeam Loaded');	
		},
		gotoDetail: function () {
			app.application.navigate(
				'#tabstrip-edit'
				);
		},
		gotoDetailSearch: function (e) {
			var txtJob = $(e.target).closest("form").find("input[type=search]");
			var jobId = txtJob.val();

			if (jobId.length == 11) {
				var jbSearchId = jobId;

				app.jobService.viewModel.set("isSearch", false);
				app.jobService.viewModel.exeDetailSearch(jbSearchId);
			} else if (jobId.length < 7 && jobId.length != 0) {
				var str = jobId;
				var pad = "000000";
				var d = new Date();
				var n = d.getFullYear();
				var jbSearchId = "JB" + n.toString().substring(2, 4) + "-" + pad.substring(0, pad.length - str.length) + str;
				txtJob.val(jbSearchId);

				app.jobService.viewModel.set("isSearch", false);

				app.jobService.viewModel.set("returnUrl", "#tabstrip-my");
				app.jobService.viewModel.exeDetailSearch(jbSearchId);
			} else if (jobId.length == 0) {
				navigator.notification.alert("Please fill JOB ID",
					function () {
						return false;
					}, "JOB ID : Empty", 'OK');
			} else {
				navigator.notification.alert("JBxx-xxxxxx or xxxxxx",
					function () {
						return false;
					}, "JOB ID : Wrong format", 'OK');
			}

		},
		onSearch: function () {
			var that = this
			that.set("isSearch", !that.get("isSearch"));
			that.set("searchtxt", "");
		},
		refresh: function () {
			app.myService.viewModel.loadMy();
			app.application.showLoading();
		},
		showLoading: function () {
			//if (this._isLoading) {
			app.application.showLoading();
			//}
		},
		hideLoading: function () {
			app.application.hideLoading();
		},

	});

	app.myService = {
		init: function () {
			////console.log("myteam init start");

			////console.log("myteam init end");
		},
		show: function () {
			////console.log("myteam show start");
			app.myService.viewModel.showLoading();
			var isOffline = app.loginService.viewModel.get("isOffline");
			if (!isOffline) {

				
sleep(1000);
				//setTimeout(function () {
					app.myService.viewModel.loadMy();
				//}
					//, 1000);
			} else {
				if (app.loginService.viewModel.get("isOffline") != true) {
					navigator.notification.alert("offline",
						function () {
							app.myService.viewModel.hideLoading();
						 }, "Internet Connection", 'OK');
				}
			}
			//app.myService.viewModel.hideLoading(////console.logle.debug("myteam hide hide");
		},
		hide: function () {
			////console.log("myteam hide start");
			//app.myService.viewModel.hideLoading();
			////console.log("myteam hide hide");
		},
		viewModel: new MyViewModel()
	}
})(window);
