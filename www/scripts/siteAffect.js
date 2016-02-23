(function(global) {
	var SiteAffectViewModel,
		app = global.app = global.app || {};

	SiteAffectViewModel = kendo.data.ObservableObject.extend({
		returnUrl: null,
		onBack: function(){
			var returnUrl = app.siteAffectService.viewModel.get("returnUrl");
			app.application.navigate(returnUrl);
		},
		loadSiteAffect: function() {
			////console.log("fetch loadSiteAffect");
			var that = this,
				SiteAffectDs = null;
			var selectItem = app.jobService.viewModel.get("selectItem");

			that.showLoading();
			if ($("#lvsiteAffect").data("kendoMobileListView") != undefined && $("#lvsiteAffect").data("kendoMobileListView") != null) {
				////console.log("Site Affect have Data.");
			} else {
				SiteAffectDs = new kendo.data.DataSource({
					transport: {
						read: function(operation) {
							$.ajax({ //using jsfiddle's echo service to simulate remote data loading
								type: "POST", timeout: 180000,
								url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobSiteAffected.json',
								data: JSON.stringify({
									"token": localStorage.getItem("token"),
									"jobId": selectItem.jobId,
									"version": "2"
								}),

								dataType: "json",
								contentType: 'application/json',
								success: function(response) {

									operation.success(response);
									////console.log(JSON.stringify(response));

									////console.log("#### fetch Site Affect : Complete");
								},
								error: function(xhr, error) {
									////console.log("loadSiteAffect Error");
									if (!app.ajaxHandlerService.error(xhr, error)) {

										////console.log("Get  Site Affect failed");
										////console.log(xhr);
										////console.log(error);
										if (!app.loginService.viewModel.isOffline) {
											navigator.notification.alert(xhr.status + error,
												function() {}, "Get Site Affect", 'OK');
										}

									}
									return;
								},
								complete: function() {}
							});


						}
					},
					schema: {
						data: "jobSiteAffectedList"
					}
				});

			}


			if ($("#lvsiteAffect").data("kendoMobileListView") != undefined && $("#lvsiteAffect").data("kendoMobileListView") != null) {

				SiteAffectDs = that.get("jobSiteAffectDataSource");

				//SiteAffectDs.fetch(function() {
				//var view = SiteAffectDs.view();
				//////console.log(JSON.stringify(view));
				var countSiteAffect = 0;
				if (SiteAffectDs != undefined && SiteAffectDs != null) {
					countSiteAffect = SiteAffectDs.data().length;
					app.jobService.viewModel.set("cntSiteAffect",countSiteAffect) ;
				}

				$("#lvsiteAffect").data("kendoMobileListView").setDataSource(SiteAffectDs);
				
				//});

				////console.log('load Complete');

			} else {
				//SiteAffectDs.fetch(function() {
				//	var data = SiteAffectDs.data();
				var countSiteAffect = 0;
				SiteAffectDs.fetch(function() {
					if (SiteAffectDs != undefined && SiteAffectDs != null) {
						countSiteAffect = SiteAffectDs.data().length;
						app.jobService.viewModel.set("cntSiteAffect",countSiteAffect) ;
					}
				});

				that.set("jobSiteAffectDataSource", SiteAffectDs);

				$("#lvsiteAffect").kendoMobileListView({
					dataSource: SiteAffectDs,
					style: "inset",
					template: $("#site-affect-template").html(),
					dataBound: function() {


						that.hideLoading();
					}

				});

				//});


			}

			kendo.bind(".job-bind", app.jobService.viewModel);

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

	app.siteAffectService = {
		init: function() {

		},
		show: function() {
			app.siteAffectService.viewModel.loadSiteAffect();
		},
		viewModel: new SiteAffectViewModel()
	};
})(window);
