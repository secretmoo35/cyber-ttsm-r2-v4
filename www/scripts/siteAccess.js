(function(global) {
	var SiteAccessViewModel,
		app = global.app = global.app || {};

	SiteAccessViewModel = kendo.data.ObservableObject.extend({
		returnUrl: null,
		owner: null,
		selectSite: null,
		selectNewSite: null,
		onBack: function() {
			var returnUrl = app.siteAccessService.viewModel.get("returnUrl");
			app.application.navigate(returnUrl);
		},
		loadSiteAccess: function() {
			////console.log("fetch loadSiteAccess");

			var that = this;
			var selectItem = app.jobService.viewModel.get("selectItem");

			var selectSite = app.siteAccessService.viewModel.get("selectSite");
			var selectNewSite = app.siteAccessService.viewModel.get("selectNewSite");

			that.showLoading();
			var SiteAccessDs = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobSiteAccess.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"docType": "",
								"jobId": selectItem.jobId,
								"version": "2"
							}),

							dataType: "json",
							contentType: 'application/json',
							success: function(response) {

								operation.success(response);
								////console.log(JSON.stringify(response));

								////console.log("fetch Site Access : Complete");
							},
							error: function(xhr, error) {
								////console.log("loadSiteAccess Error");
								if (!app.ajaxHandlerService.error(xhr, error)) {

									////console.log("Get  Site Access failed");
									////console.log(xhr);
									////console.log(error);

									navigator.notification.alert(xhr.status + error,
										function() {}, "Get  Site Access", 'OK');

								}
								return;
							},
							complete: function() {}
						});


					}
				},
				schema: {
					data: "jobSiteAccessList"
				}
			});

			SiteAccessDs.fetch(function() {
				var data = SiteAccessDs.data();
				selectSite = null;


				for (var i = 0; i < data.length; i++) {
					var sa = {
						"jobId": null,
						"siteId": data[i].siteId,
						"siteCode": null,
						"locationCode": null,
						"bsc": null,
						"msc": null,
						"siteCodeDesc": null,
						"regionId": null,
						"zoneId": null,
						"siteStatus": null,
						"regionName": null,
						"zoneName": null,
						"showBscMsc": data[i].showBscMsc,
						"newFlag": "false"
					};
					if (selectSite != undefined && selectSite != null) {

						selectSite.pushCreate(sa);
					} else {

						selectSite = new kendo.data.DataSource();
						selectSite.pushCreate(sa);
					}
				}

				if (selectNewSite != undefined && selectNewSite != null && selectNewSite != []) {
					selectNewSite.fetch(function() {
						var l = selectNewSite.data().length;
						//selectNewSite.fetch(function() {
						for (var i = 0; i < l; i++) {
							if (selectSite != undefined && selectSite != null) {
								selectSite.fetch(function() {
									selectSite.add(selectNewSite.data()[i]);
								});

							} else {
								selectSite = new kendo.data.DataSource({
									data: selectNewSite[i]
								});
							}
						}
						//});
					});
				}
				selectSite.fetch(function() {
					if ($("#lvJobSiteAccess").data("kendoMobileListView") != undefined && $("#lvJobSiteAccess").data("kendoMobileListView") != null) {
						$("#lvJobSiteAccess").data("kendoMobileListView").setDataSource(selectSite);
						//SiteAsscessDs.fetch(function() {
						//var data = SiteAsscessDs.data();
						//////console.log(JSON.stringify(view));
						that.set("jobSiteAccessDataSource", selectSite);

						var countSiteAccess = 0;


						if (selectSite != undefined && selectSite != null) {
							var data = selectSite.data()
							countSiteAccess = data.length;

							app.jobService.viewModel.set("cntSiteAccess", countSiteAccess);

						}


						//});

						////console.log('load Complete');

					} else {
						var countSiteAccess = 0;
						//selectSite.fetch(function() {
						if (selectSite != undefined && selectSite != null) {
							countSiteAccess = selectSite.data().length;
							app.jobService.viewModel.set("cntSiteAccess", countSiteAccess);
						}
						//});

						$("#lvJobSiteAccess").kendoMobileListView({
							dataSource: selectSite,
							style: "inset",
							template: $("#job-site-access-template").html(),
							click: function(e) {
								app.siteAccessService.viewModel.onDel(e);
							},
							dataBound: function() {


								app.siteAccessService.viewModel.set("jobSiteAccessDataSource", selectSite);
								app.siteAccessService.viewModel.hideLoading();
							}

						});
					}

				});

				//app.siteAccessService.viewModel.set("selectNewSite",selectNewSite);
				app.siteAccessService.viewModel.set("selectSite", selectSite);

				var selectItem = app.jobService.viewModel.get("selectItem");
                //console.log("#### Site Access showType >:"+app.jobService.viewModel.get("showType"));
				if (app.jobService.viewModel.get("showType") != "view") {
					if (selectItem.statusId == "10" || selectItem.statusId == "01") {
						app.siteAccessService.viewModel.set("owner", false);
					} else {
						app.siteAccessService.viewModel.set("owner", (selectItem.assignTo == app.loginService.viewModel.get("userId")));
					}
				} else {
					app.siteAccessService.viewModel.set("owner", false);
				}
				//kendo.bind(".site-bind", app.siteAccessService.viewModel);
				kendo.bind(".job-bind", app.jobService.viewModel);
			});

		},

		loadSiteAccessMaster: function() {
			////console.log("fetch loadSiteAccessMaster");
			var that = this,
				SiteAsscessMasterDs;
			var selectItem = app.jobService.viewModel.get("selectItem");
			app.application.showLoading();


			SiteAsscessMasterDs = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getSiteAccessMaster.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": app.loginService.viewModel.get("userId"),
								"jobId": selectItem.jobId,
								"ttId": null,
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function(response) {
								operation.success(response);

								////console.log(response);
								////console.log("fetch SiteAsscessMaster : Complete");
								that.hideLoading();

							},
							error: function(xhr, error) {
								that.hideLoading();
								if (!app.ajaxHandlerService.error(xhr, error)) {
									////console.log("Get SiteAsscessMaster from cache failed");
									////console.log(xhr);
									////console.log(error);
									navigator.notification.alert(xhr.status + error,
										function() {}, "Get SiteAsscessMaster failed", 'OK');
									return;

								}
							},
							complete: function() {}
						});
					}
				},
				schema: {
					data: "siteAccessMasterList"
				}
			});


			var filter = {
				logic: "or",
				filters: []
			}

			if (SiteAsscessMasterDs != undefined && SiteAsscessMasterDs != null) {

				var data = SiteAsscessMasterDs.data();
				for (var i = 0; i < data.length; i++) {
					var filters = {
						field: "showBscMsc",
						operator: "eq",
						value: data[i].showBscMsc
					};

					filter.filters.push(filters);

				}

				SiteAsscessMasterDs.filter(filter);
			}

			if ($("#lvSiteAccessMaster").data("kendoMobileListView") != undefined && $("#lvSiteAccessMaster").data("kendoMobileListView") != null) {
				SiteAsscessMasterDs.fetch(function() {

					var view = SiteAsscessMasterDs.view();
					////console.log(JSON.stringify(view));

					that.set("siteAccessMasterDataSource", SiteAsscessMasterDs);

					$("#lvSiteAccessMaster").data("kendoMobileListView").dataSource.data(view);

				});

				////console.log('load Complete');

			} else {

				SiteAsscessMasterDs.fetch(function() {
					var data = SiteAsscessMasterDs.data();
					$("#lvSiteAccessMaster").kendoMobileListView({
						dataSource: data,
						template: $("#site-access-master-template").html(),
						virtualViewSize: 40,
						endlessScroll: true,
						dataBound: function() {
							that.hideLoading();
						},
						filterable: {
							field: "showBscMsc",
							ignoreCase: true
						}
					});
				});

				that.set("siteAccessMasterDataSource", SiteAsscessMasterDs);
			}



		},

		saveSiteAccess: function() {

			var that = this;
			var selectSiteAccess = app.siteAccessService.viewModel.get("siteAccessMasterDataSource");
			//var selectSiteAccessData = selectSiteAccess.data();
			var isSiteAccessChecked = false;
			var mnimssiteIds = [];
			var mnimssiteIndex = 0;
			var selectNewSite = app.siteAccessService.viewModel.get("selectNewSite");
			var selectSite = app.siteAccessService.viewModel.get("selectSite");

			var selectItem = app.jobService.viewModel.get("selectItem");
			var id;

			$.each($("input:checkbox[class^='SAM']"), function(index, val) {
				if (val.checked) {
					//for (var i = 0; i < selectSiteAccessData.length; i++) {

					isSiteAccessChecked = true;
					//if (val.className.indexOf('SAM' + selectSiteAccessData[i].id + 'SAM') > -1) {
					//var id = selectSiteAccessData[i].id;
					//mnimssiteIds[mnimssiteIndex] = id;
					//mnimssiteIndex++;
					id = val.className.replace(/SAM/g, '').split(' ')[0];

					selectSiteAccess.filter({
						field: "id",
						operator: "eq",
						value: id
					})

					selectSiteAccess.fetch(function() {
						var view = selectSiteAccess.view();
						if (view.length > 0) {
							var sa = {
								"jobId": selectItem.jobId,
								"siteId": view[0].id,
								"siteCode": null,
								"locationCode": null,
								"bsc": null,
								"msc": null,
								"siteCodeDesc": null,
								"regionId": null,
								"zoneId": null,
								"siteStatus": null,
								"regionName": null,
								"zoneName": null,
								"showBscMsc": view[0].showBscMsc,
								"newFlag": "true"
							};

							if (selectSite != undefined && selectSite != null) {
								selectSite.filter({
									field: "siteId",
									operator: "eq",
									value: sa.siteId
								});

								selectSite.fetch(function() {
									var data = selectSite.view();

									if (data.length == 0) {
										if (selectNewSite == undefined || selectNewSite == null || selectNewSite == []) {
											selectNewSite = new kendo.data.DataSource();
											selectNewSite.pushCreate(sa);
										} else {
											selectNewSite.filter({
												field: "siteId",
												operator: "eq",
												value: sa.siteId
											});
											selectNewSite.fetch(function() {
												var dataNew = selectNewSite.view();
												if (dataNew.length == 0) {
													selectNewSite.pushCreate(sa);

												} else {
													navigator.notification.alert("Site Access is Duplicate!",
														function() {}, "Add Site Access failed", 'OK');
												}
											});
										}
									} else {

										navigator.notification.alert("Site Access is Duplicate!",
											function() {}, "Add Site Access failed", 'OK');
									}

								});

							}
						}

					});
					//selectSite.pushcreate(selectSiteAccessData[i])
					//}

					//}

				}


			});


			app.siteAccessService.viewModel.set("selectNewSite", selectNewSite);
			app.application.navigate('#job-site-access');

			//if (isSiteAccessChecked) {
			//	that.createSiteAccess(mnimssiteIds);
			//} else {
			//	navigator.notification.alert("Please select site access.",
			//		function() {}, "Save Site Access : Save incomplete!", 'OK');
			//}
		},

		createSiteAccess: function(mnimssiteIds) {
			var that = this;
			var selectItem = app.jobService.viewModel.get("selectItem");

			that.showLoading();
			////console.log("CreateSiteAccess Prm => user :" + app.loginService.viewModel.get("userId") + ", JobId : " + selectItem.jobId + ", mnimssiteIds length : " + mnimssiteIds.length);
			$.ajax({ //using jsfiddle's echo service to simulate remote data loading
				type: "POST", timeout: 180000,
				url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=createSiteAccess.json',
				data: JSON.stringify({
					"token": localStorage.getItem("token"),
					"userId": app.loginService.viewModel.get("userId"),
					"mnimssiteIds": mnimssiteIds,
					"jobId": selectItem.jobId,
					"version": "2"
				}),

				dataType: "json",
				async: false,
				contentType: 'application/json',
				success: function(response) {
					that.hideLoading();
					if (response.status == "TRUE") {
						////console.log("Create Site Access  : Save complete!");

						//navigator.notification.alert("Save complete",
						//function() {}, "Site Access", 'OK');

						//app.application.navigate('#job-site-access');
						app.siteAccessService.viewModel.set("selectSite", null);
						app.siteAccessService.viewModel.set("selectNewSite", null);

						return true;
					} else {
						navigator.notification.alert(response.msg,
							function() {}, "Create Site Access : Save incomplete!", 'OK');

						return false;
					}
				}

			})
		},
		onDel: function(e) {
			var selectNewSite = app.siteAccessService.viewModel.get("selectNewSite");
			var selectSite = app.siteAccessService.viewModel.get("selectSite");

			
					var id = e.target.data("id");

					selectNewSite.filter({
						field: "siteId",
						operator: "eq",
						value: id
					});

					selectNewSite.fetch(function() {
						var viewNew = selectNewSite.view();
						if (viewNew.length > 0) {
							selectNewSite.pushDestroy(viewNew[0]);
						}
					});

					selectSite.filter({
						field: "siteId",
						operator: "eq",
						value: id
					});

					selectSite.fetch(function() {
						var view = selectSite.view();
						if (view.length > 0) {
							selectSite.remove(view[0]);
						}
					});
				
			selectSite.filter({});


			//$("#lvJobSiteAccess").data("kendoMobileListView");
			//lvJobSiteAccess.setDataSource(selectSite);

			app.siteAccessService.viewModel.set("selectSite", selectSite);
			app.siteAccessService.viewModel.set("selectNewSite", selectNewSite);
		},
		showLoading: function() {
			//if (this._isLoading) {
				app.application.showLoading();
				//}
		},
		hideLoading: function() {
			app.application.hideLoading();
		}

	});

	app.siteAccessService = {
		init: function() {

		},
		initAccessMaster: function() {
			app.siteAccessService.viewModel.loadSiteAccessMaster();
		},
		showAccess: function() {
			app.siteAccessService.viewModel.loadSiteAccess();
		},
		showAccessMaster: function() {
			app.siteAccessService.viewModel.loadSiteAccessMaster();
		},
		viewModel: new SiteAccessViewModel()
	};
})(window);
