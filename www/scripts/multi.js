(function (global) {
	var jobViewModel,
		app = global.app = global.app || {};

	multiViewModel = kendo.data.ObservableObject.extend({
		jobMultiDataSource: null,
		jobAcceptDataSource: null,
		memberDataSource: null,
		photoAssignDataSource: null,
		photoAcceptDataSource: null,
		selectAssignId: null,
		selectAssignItem: null,
		selectAcceptId: null,
		selectAcceptItem: null,
		priority: null,
		lastupdatemulti: "-",
		rejectremark: null,
		isMulti: true,
		selected: [],
		isSearch: false,
		reportdetail: null,
		retrunurl: "",
		searchtxt: '',
		selectType: '',
		selectStatus: '',
		selectTT: '',
		jobList: function () {
			var that = this;
			var selected = that.get("selected");
			return selected.join(", ");
		},
		imageAssignSrc: function () {
			var that = app.jobService.viewModel;
			return "images/" + that.selectAssignItem.priorityName + ".png";

		},
		imageAcceptSrc: function () {
			var that = app.jobService.viewModel;
			return "images/" + that.selectAcceptItem.priorityName + ".png";

		},
		initDropdownType: function () {
			var that = this;
			var body = $(".km-pane");
			//////console.log(localStorage.getItem("teamData"));
			if (kendo.ui.DropDownList) {
				$("#ddlMulti").kendoDropDownList({
					dataBound: function () {


					},
					change: function (e) {

						if (e.sender.selectedIndex != 0) {
							var ddlStatusMultiVal = $("#ddlStatusMulti").data("kendoDropDownList").value();
							if (ddlStatusMultiVal != "" && ddlStatusMultiVal != undefined && ddlStatusMultiVal != null) {
								app.multiService.viewModel.loadMultilist();
							}
						}
						//						var valueStatus = $("#ddlStatusMulti").data("kendoDropDownList").value();
						//						var valueType = this.value();
						//
						//						console.log("### initDropdownType valueStatus >:" + valueStatus);
						//						console.log("#### initDropdownType valueType >:" + valueType);
						//
						//						if (valueType == null || valueType == undefined || valueType == "") {
						//							valueType = "N";
						//						}
						//						if (valueStatus == null || valueStatus == undefined || valueStatus == "") {
						//							valueStatus = "N";
						//						}
						//
						//						$("#lvMultiList").data("kendoMobileListView").dataSource.read({
						//							data: JSON.stringify({
						//								"token": localStorage.getItem("token"),
						//								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
						//								"priority": "",
						//								"statusId": valueStatus,
						//								"type": valueType,
						//								"version": "2"
						//							})
						//						});
						//						$("#lvSingleList").data("kendoMobileListView").dataSource.read({
						//							data: JSON.stringify({
						//								"token": localStorage.getItem("token"),
						//								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
						//								"priority": "",
						//								"statusId": valueStatus,
						//								"type": valueType,
						//								"version": "2"
						//							})
						//						});
						//***********************************************

						//if ($("#lvMultiList").data("kendoMobileListView") != null && $("#lvMultiList").data("kendoMobileListView") != undefined) {
						//$("#lvMultiList").data("kendoMobileListView").refresh();
						//}

						//if ($("#lvSingleList").data("kendoMobileListView") != null && $("#lvSingleList").data("kendoMobileListView") != undefined) {
						//$("#lvSingleList").data("kendoMobileListView").refresh();
						//}
					},
					//optionLabel: "Select a team...",
					dataTextField: "type",
					dataValueField: "type",
					optionLabel: "---Select---",
					dataSource: new kendo.data.DataSource({
						transport: {
							read: function (operation) {
								$.ajax({ //using jsfiddle's echo service to simulate remote data loading
									beforeSend: app.loginService.viewModel.checkOnline,
									type: "POST", timeout: 180000,
									url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getMultiChangeMaster.json',
									data: JSON.stringify({
										"token": localStorage.getItem("token"),
										"version": "2"
									}),
									dataType: "json",
									contentType: 'application/json',
									success: function (response) {
										//store response
										//localStorage.setItem("regionData", JSON.stringify(response));
										//pass the pass response to the DataSource

										//navigator.notification.alert(JSON.stringify(response),
										//                        function () { }, "Get Team failed", 'OK');
										operation.success(response);

										////console.log("Multi :" + JSON.stringify(response));
										////console.log("fetch Multiple job type : Complete");
									},
									error: function (xhr, error) {
										if (!app.ajaxHandlerService.error(xhr, error)) {
											////console.log("fetch Multiple job type");
											////console.log(xhr);
											////console.log(error);

											navigator.notification.alert(xhr.status + ' ' + error,
												function () { }, "get Multiple job type", 'OK');
										}
										return;
									}
								});
							}
						},
						schema: {
							data: "multiChangeMasters"
						}
					}),
					// The options are needed only for the desktop demo, remove them for mobile.
					popup: {
						appendTo: body
					},
					animation: {
						open: {
							effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down"
						}
					}
				});
			}
		},
		initDropdownStatus: function () {
			var that = this;
			var body = $(".km-pane");
			//////console.log(localStorage.getItem("teamData"));
			if (kendo.ui.DropDownList) {
				$("#ddlStatusMulti").kendoDropDownList({
					dataBound: function () {

					},
					change: function (e) {
						if (e.sender.selectedIndex != 0) {
							var ddlMultiVal = $("#ddlMulti").data("kendoDropDownList").value();
							if (ddlMultiVal != "" && ddlMultiVal != undefined && ddlMultiVal != null) {
								app.multiService.viewModel.loadMultilist();
							}
						};
                                                       
						//						var valueStatus = this.value();
						//						var valueType = $("#ddlMulti").data("kendoDropDownList").value();
						//						console.log("#### initDropdownStatus valueStatus >:" + valueStatus);
						//						console.log("### initDropdownStatus valueType >:" + valueType);
						//						//////console.log("statusId : " + );
						//
						//						if (valueType == null || valueType == undefined || valueType == "") {
						//							valueType = "N";
						//						}
						//						if (valueStatus == null || valueStatus == undefined || valueStatus == "") {
						//							valueStatus = "N";
						//						}
						//                                                       console.log("### initDropdownStatus lvMultiList >:" + $("#lvMultiList").data("kendoMobileListView"));
						//						if ($("#lvMultiList").data("kendoMobileListView") != undefined || $("#lvMultiList").data("kendoMobileListView") != null) {
						//							$("#lvMultiList").data("kendoMobileListView").dataSource.read({
						//								data: JSON.stringify({
						//									"token": localStorage.getItem("token"),
						//									"userId": JSON.parse(localStorage.getItem("profileData")).userId,
						//									"priority": "",
						//									"statusId": valueStatus,
						//									"type": valueType,
						//									"version": "2"
						//								})
						//							});
						//						}
						//                                                       
						//
						//						if ($("#lvSingleList").data("kendoMobileListView") != undefined || $("#lvSingleList").data("kendoMobileListView") == null) {
						//							$("#lvSingleList").data("kendoMobileListView").dataSource.read({
						//								data: JSON.stringify({
						//									"token": localStorage.getItem("token"),
						//									"userId": JSON.parse(localStorage.getItem("profileData")).userId,
						//									"priority": "",
						//									"statusId": valueStatus,
						//									"type": valueType,
						//									"version": "2"
						//								})
						//							});
						//						}
                        
                        
                                                       
						//*************************************

						//if ($("#lvMultiList").data("kendoMobileListView") != undefined || $("#lvMultiList").data("kendoMobileListView") == null) {
						//$("#lvMultiList").data("kendoMobileListView").refresh();
						//}

						//if ($("#lvSingleList").data("kendoMobileListView") != undefined || $("#lvSingleList").data("kendoMobileListView") == null) {
						//$("#lvSingleList").data("kendoMobileListView").refresh();
						//}
					},
					//optionLabel: "Select a team...",
					dataTextField: "status",
					dataValueField: "jbStatusId",
					optionLabel: "---Select---",
					dataSource: new kendo.data.DataSource({
						transport: {
							read: function (operation) {
								$.ajax({ //using jsfiddle's echo service to simulate remote data loading
									beforeSend: app.loginService.viewModel.checkOnline,
									type: "POST", timeout: 180000,
									url: app.configService.serviceUrl + 'post-json.service?s=master-service&o=getJobStatus.json',
									data: JSON.stringify({
										"token": localStorage.getItem("token"),
										"version": "2"
									}),
									dataType: "json",
									contentType: 'application/json',
									success: function (response) {
										//store response
										//localStorage.setItem("regionData", JSON.stringify(response));
										//pass the pass response to the DataSource

										//navigator.notification.alert(JSON.stringify(response),
										//                        function () { }, "Get Team failed", 'OK');

										////console.log("Status :" + JSON.stringify(response));

										operation.success(response);


										////console.log("fetch Status : Complete");
									},
									error: function (xhr, error) {
										if (!app.ajaxHandlerService.error(xhr, error)) {
											////console.log("fetch Status job type");
											////console.log(xhr);
											////console.log(error);

											navigator.notification.alert(xhr.status + ' ' + error,
												function () { }, "get Status", 'OK');
										}
										return;
									}
								});
							}
						},
						schema: {
							data: "jobStatus"
						},
						filter: {

							logic: "and",
							filters: [
								{ field: "jbStatusId", operator: "lt", value: "05" }
							]
						}
					}),
					// The options are needed only for the desktop demo, remove them for mobile.
					popup: {
						appendTo: body
					},
					animation: {
						open: {
							effects: body.hasClass("km-android") ? "fadeIn" : body.hasClass("km-ios") || body.hasClass("km-wp") ? "slideIn:up" : "slideIn:down"
						}
					}
				});
			}
		},
		loadMultilist: function () {
			var that = this;
			var JBs = new kendo.data.DataSource({
				transport: {
					read: function (operation) {
						var data = operation.data.data;
						if (data == null && data == undefined) {
							var valueStatus = $("#ddlStatusMulti").data("kendoDropDownList").value();
							var valueType = $("#ddlMulti").data("kendoDropDownList").value();
							//console.log("#### valueStatus>:"+valueStatus);
							//console.log("#### valueType>:"+valueType);
                                            
							if (valueType == null || valueType == undefined || valueType == "") {
								valueType = "N";
							}
							if (valueStatus == null || valueStatus == undefined || valueStatus == "") {
								valueStatus = "N";
							}

							data = JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
								"priority": "",
								"statusId": valueStatus,
								"type": valueType,
								"version": "2"
							});
						}
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
							dataType: "json",
							contentType: 'application/json',
							data: data,
							success: function (response) {
								//store response
								operation.success(response);

								////console.log(response);
								//localStorage.setItem("jbData", JSON.stringify(response));
								//console.log("##### fetch Multi jobs : Complete");
								//console.log("#### Multi jobs Data :" + JSON.stringify(response));
							},
							error: function (xhr, error) {
								if (!app.ajaxHandlerService.error(xhr, error)) {

									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
										console.log("Get Multi jobs failed");
									} else {
										console.log("Get Multi jobs from cache failed");
										console.log(xhr);
										console.log(error);
										navigator.notification.alert(xhr.status + error,
											function () { }, "Get Multi jobs failed", 'OK');

									}
								}
								return;
							},
							complete: function () {
								that.set("lastupdatemulti", format_time_date(new Date()));
								return;
							}
						});
					}
				},
				filter: {
					field: "jobId",
					operator: "neq",
					value: null,
				},
				schema: {
					data: "jobs"
				},
				model: {
					id: "jobId"
				},
				group: {
					field: "groupJob",
					aggregates: [
						{ field: "jobId", aggregate: "count" }
					]
				}
			});

			JBs.bind("error", function (e) {
				console.log("Get Multi jobs failed");
				console.log(e.status);
				console.log(e.xhr);
				navigator.notification.alert(e.status,
					function () { }, "Get Multi jobs failed", 'OK');
				return;
			});

			var tt = new kendo.data.DataSource();
			JBs.fetch(function () {
				tt.data(JBs.view());
			});

			if ($("#lvTTList").data("kendoMobileListView") == undefined || $("#lvTTList").data("kendoMobileListView") == null) {


				$("#lvTTList").kendoMobileListView({
					dataSource: tt,
					autoBind: false,
					template: $("#tt-template").html(),
					//headerTemplate: $("#header-template").html(),
					//click: that.onClick,
					style: "inset",
					pullToRefresh: true,
					click: function (e) {
						app.multiService.viewModel.gotoMultiDetail(e);
					},
				});
			} else {

				$("#lvTTList").data("kendoMobileListView").setDataSource(tt);
				tt.fetch(function () {
					app.application.view().scroller.reset();
					$("#lvTTList").data("kendoMobileListView").refresh();
				});

                                                        
                                                        
                //that.set("isMulti", true);
                kendo.bind($("#lvTTList"), app.multiService.viewModel);


			}
		},
		gotoMultiDetail: function (e) {
			app.multiService.viewModel.set("returnurl", "#TT");
			var ttid = e.target.data("ttid");
			var statusid = $("#ddlStatusMulti").data("kendoDropDownList").value();
			var typeid = $("#ddlMulti").data("kendoDropDownList").value();

			app.multiService.viewModel.set("selectType", typeid);
			app.multiService.viewModel.set("selectStatus", statusid);
			app.multiService.viewModel.set("selectTT", ttid);

			app.application.navigate(
				'#Multi'
				);
		},
		loadMultiDetail: function (e) {
			var that = this,
				JBs,
				Photo;

			var selectType = app.multiService.viewModel.get("selectType");
			var selectStatus = app.multiService.viewModel.get("selectStatus");
			var selectTT = app.multiService.viewModel.get("selectTT");
			//console.log("########## Load Multi List ###########");
			//console.log(JSON.stringify(JSON.parse(localStorage.getItem("jbData")).jobs));
			JBs = new kendo.data.DataSource({
				transport: {
					read: function (operation) {

						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
							dataType: "json",
							contentType: 'application/json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
								"priority": "",
								"statusId": selectStatus,
								"type": selectType,
								"version": "2"
							}),
							success: function (response) {
								//store response
								operation.success(response);

								////console.log(response);
								//localStorage.setItem("jbData", JSON.stringify(response));
								//console.log("##### fetch Multi jobs : Complete");
								//console.log("#### Multi jobs Data :" + JSON.stringify(response));
							},
							error: function (xhr, error) {
								if (!app.ajaxHandlerService.error(xhr, error)) {

									cache = localStorage.getItem("jbData");

									if (cache != null && cache != undefined) {
										operation.success(JSON.parse(cache));
										console.log("Get Multi jobs failed");
									} else {
										console.log("Get Multi jobs from cache failed");
										console.log(xhr);
										console.log(error);
										navigator.notification.alert(xhr.status + error,
											function () { }, "Get Multi jobs failed", 'OK');

									}
								}
								return;
							},
							complete: function () {
								that.set("lastupdatemulti", format_time_date(new Date()));
								return;
							}
						});
					}
				},
				filter: {
					field: "groupJob",
					operator: "eq",
					value: selectTT,
				},
				schema: {
					data: "jobs"
				},
				model: {
					id: "jobId"
				}
			});

			JBs.bind("error", function (e) {
				console.log("Get Multi jobs failed");
				console.log(e.status);
				console.log(e.xhr);
				navigator.notification.alert(e.status,
					function () { }, "Get Multi jobs failed", 'OK');
				return;
			});

            JBs.fetch(function () {
				if ($("#lvMultiList").data("kendoMobileListView") == undefined || $("#lvMultiList").data("kendoMobileListView") == null) {


					$("#lvMultiList").kendoMobileListView({
						dataSource: JBs.view(),
						//autoBind: false,
						template: $("#multi-template").html(),
						headerTemplate: $("#header-template").html(),
						click: that.onClick,
						//pullToRefresh: true,
						virtualViewSize: 40,
						endlessScroll: true,
					});
				} else {

					$("#lvMultiList").data("kendoMobileListView").setDataSource(JBs.view());
					//JBs.fetch(function() {
					app.application.view().scroller.reset();
					$("#lvMultiList").data("kendoMobileListView").refresh();
					//});

                                                        
                                                        
					//that.set("isMulti", true);
					//kendo.bind($("#lvMultiList"),app.multiService.viewModel);


				}
			});
                                                        
            
                                                        

			
                                                        
			//                                                        var isMulti = app.multiService.viewModel.get("isMulti");
			//                                                        var switchMulti = $("#switchMulti").data("kendoMobileSwitch")
			//                                                        
			//                                                        
			//                                                        if(isMulti){
			//                                                           console.log("########## isMulti TRUE ###########");
			//                                                           that.set("isMulti", false);
			//                                                           kendo.bind($("#lvMultiList"),app.multiService.viewModel);
			//                                                           switchMulti.check(false);
			//                                                        }else{
			//                                                            console.log("########## isMulti FALSE ###########");
			//                                                            that.set("isMulti", true);
			//                                                            kendo.bind($("#lvSingleList"),app.multiService.viewModel);
			//                                                            switchMulti.check(true);
			//                                                        }
                                                        
			//                                                        console.log("### set isMulti FALSE #####");
			//                                                        that.set("isMulti", false);

                                                       
                                                        


			that.set("jobMultiDataSource", JBs);

		},
		onClick: function (e) {
			//console.log("########## onClick ###########");
			var that = app.multiService.viewModel;
			var selected = that.get("selected");

			var lv = $(e.target).closest("li");
			var label = $(e.target).closest('li').children("label");

			if (label[0] != undefined) {
				var i = $.inArray(label[0].id, selected)

				if (i < 0) {
					lv.css("background", "#c9db31");
					selected.push(label[0].id);

					var chkall = true;
					var className = label[0].className;

					$("." + className).each(function (index, value) {
						if ($.inArray(value.id, selected)) {

						} else {
							chkall = false;
						}
					});

					if (chkall) {
						$(".chkall").prop('checked', true);
					} else {
						$(".chkall").prop('checked', false);
					}

				} else {
					lv.css("background", "");
					var className = label[0].className;
					$(".chkall").prop('checked', false);
					selected = jQuery.grep(selected, function (value) {
						return value != label[0].id;
					});


					$.each(selected, function (i, val) {
						if (val == label[0].id) {
							selected.splice(i, 1);
						}
					});
				}

				that.set("selected", selected);

			}
		},
		multireportback: function () {
			var that = app.multiService.viewModel;
			app.application.replace(
				'#Multi' //or whichever transition you like
				);
			$(".chkall").checked(false);
			that.set("selected", selected);
		},
		gotoReject: function (e) {
			//console.log("### gotoReject ###");
			app.jobService.viewModel.set("rejectremark", "");
                                                        
			//setTimeout(function () {
			var isMulti = app.multiService.viewModel.get("isMulti");
			if (isMulti) {
				app.multiService.viewModel.gotoRejectMulti(e);
			} else {
				var that = app.jobService.viewModel;
				if (e.context != undefined && e.context != null) {
					////console.log("gotoReject context: " + e.context);
					var JBs = app.multiService.viewModel.get("jobMultiDataSource");
					////console.log(JSON.stringify(JBs));

					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: e.context,
					});

					JBs.fetch(function () {
						var view = JBs.view();

						var selectItem = view[0];


						if (selectItem != undefined && selectItem != null) {

							that.set("rejectReturnUrl", "#Multi");

							////console.log("Reject selectAssignItem :" + JSON.stringify(selectItem));

							that.set("selectItem", selectItem);

							$("#MultiAssignActions").data("kendoMobileActionSheet").close();

							app.application.replace(
								'#tabstrip-reject' //or whichever transition you like
								);
						}
					});
				}
				//}, 0);
			}
		},
		gotoRejectMulti: function (e) {
			//console.log("########## gotoRejectMulti ###########");
			//setTimeout(function () {
			//var that = app.jobService.viewModel;
			//////console.log("gotoReject context: " + e.context);
			//var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			//////console.log(JSON.stringify(JBs));
			//var selectAssignItem = JBs.getByUid(e.context);

			//that.set("rejectReturnUrl", "#Multi");

			//////console.log("Reject selectAssignItem :" + JSON.stringify(selectAssignItem));

			//that.set("selectAssi", selectAssignItem);
            app.multiService.viewModel.set("rejectremark", "");

			app.application.replace(
				'#tabstrip-reject-multi' //or whichever transition you like
				);
			//}, 0);
		},
		gotoReportMulti: function (e) {
			//console.log("########## gotoReportMulti ###########");
			//setTimeout(function () {
			//var that = app.jobService.viewModel;
			//////console.log("gotoReject context: " + e.context);
			//var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			//////console.log(JSON.stringify(JBs));
			//var selectAssignItem = JBs.getByUid(e.context);

			//that.set("rejectReturnUrl", "#Multi");

			//////console.log("Reject selectAssignItem :" + JSON.stringify(selectAssignItem));

			//that.set("selectAssi", selectAssignItem);
                                                        
                                                        
            app.multiService.viewModel.set("reportdetail", "");

			var isMulti = app.multiService.viewModel.get("isMulti");

			if (!isMulti) {
				var selected = app.multiService.viewModel.get("selected");
				selected.push(e.context);
			}


			app.application.replace(
				'#tabstrip-report-multi' //or whichever transition you like
				);
			//}, 0);
		},
		loadreject: function () {
			var that = this;
			//rejectremark
			//var selectId = that.get("selectId");
			////console.log("Reject Prm => user :" + +", selectId : " + that.get("selectAssignItem.jobId"));
		},
		rejectjob: function () {
			app.jobService.viewModel.exeRejectSingle();
		},
		rejectjobMulti: function () {

			var that = this;
			var rejectremark = that.get("rejectremark");
			app.jobService.viewModel.set("rejectremark", rejectremark);
			app.jobService.viewModel.exeRejectMulti();
		},
		reportjobMulti: function () {

			var that = this;
			//var rejectremark = that.get("rejectremark");
			//app.jobService.viewModel.set("rejectremark", rejectremark);
			app.multiService.viewModel.reportJob();

		},
		acceptJob: function (e) {
			var isMulti = app.multiService.viewModel.get("isMulti");

			if (isMulti) {
				setTimeout(
					function () { this.close(); }
					, 0);
				app.multiService.viewModel.acceptJobMulti(e);
			} else {
				var that = app.jobService.viewModel;

				if (e.context != undefined && e.context != null) {

					////console.log("gotoAccept context: " + e.context);
					var JBs = app.multiService.viewModel.get("jobMultiDataSource");
					////console.log(JSON.stringify(JBs));
					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: e.context,
					});

					JBs.fetch(function () {
						var view = JBs.view();

						var selectItem = view[0];


						if (selectItem != undefined && selectItem != null) {
							that.set("selectItem", selectItem);
							that.exeAcceptJobSingle(e);
						}
					});
				}
			}

		},
		acceptJobMulti: function (e) {
			var that = app.jobService.viewModel;

			//////console.log("gotoReject context: " + e.context);
			//var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			//////console.log(JSON.stringify(JBs));

			//var selectAssignItemList = JBs.getByUid(e.context);
			//that.set("selectItem", selectItem);

			that.exeAcceptJobMulti(e);



		},
		initialJob: function (e) {
			//console.log("########## initialJob ###########");
			var isMulti = app.multiService.viewModel.get("isMulti");
			var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			if (isMulti) {
				setTimeout(
					function () { this.close(); }
					, 0);
				var allItemList = [];
				var itemList;
				var selectList = app.multiService.viewModel.get("selected");
				for (var i = 0; i < selectList.length; i++) {

					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: selectList[i]
					});

					JBs.fetch(function () {

						var view = JBs.view();

						var selectItem = view[0];
						selectItem.report = app.multiService.viewModel.get("reportdetail");

						app.jobService.viewModel.set("selectItem", selectItem);

						itemList = app.changeStatusService.createItemMulti(selectItem.jobId, "03");
						allItemList.push(itemList);

					});
				}
				var dataValue = {};
				dataValue.token = localStorage.getItem("token");
				dataValue.version = '2';
				dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

				dataValue.allItemList = allItemList;

				app.jobService.viewModel.set("returnUrl", "");

				app.jobService.viewModel.exeChangeStatusJobMulti(dataValue);

			} else {
				var that = app.jobService.viewModel;

				if (e.context != undefined && e.context != null) {

					////console.log("gotoAccept context: " + e.context);

					////console.log(JSON.stringify(JBs));
					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: e.context,
					});

					JBs.fetch(function () {
						var view = JBs.view();

						var selectItem = view[0];


						if (selectItem != undefined && selectItem != null) {
							that.set("selectItem", selectItem);
							that.exeInitJobSingle(e);
						}
					});
				}
			}
		},
		onSiteJob: function (e) {
			//console.log("########## onSiteJob ###########");
			var isMulti = app.multiService.viewModel.get("isMulti");
			var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			if (isMulti) {
				setTimeout(
					function () { this.close(); }
					, 0);
				var allItemList = [];
				var itemList;
				var selectList = app.multiService.viewModel.get("selected");
				for (var i = 0; i < selectList.length; i++) {

					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: selectList[i]
					});

					JBs.fetch(function () {

						var view = JBs.view();

						var selectItem = view[0];
						selectItem.report = app.multiService.viewModel.get("reportdetail");

						app.jobService.viewModel.set("selectItem", selectItem);

						itemList = app.changeStatusService.createItemMulti(selectItem.jobId, "04");
						allItemList.push(itemList);

					});
				}
				var dataValue = {};
				dataValue.token = localStorage.getItem("token");
				dataValue.version = '2';
				dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

				dataValue.allItemList = allItemList;

				app.jobService.viewModel.set("returnUrl", "");

				app.jobService.viewModel.exeChangeStatusJobMulti(dataValue);
			} else {
				var that = app.jobService.viewModel;
				//app.jobService.viewModel

				if (e.context != undefined && e.context != null) {

					////console.log("gotoAccept context: " + e.context);
					////console.log(JSON.stringify(JBs));
					JBs.filter({
						field: "jobId",
						operator: "eq",
						value: e.context,
					});

					JBs.fetch(function () {
						var view = JBs.view();

						var selectItem = view[0];

						if (selectItem != undefined && selectItem != null) {
							that.set("selectItem", selectItem);
							that.exeOnsiteJobSingle(e);
						}
					});
				}
			}

		},
		reportJob: function () {
			//console.log("####### reportJob #######");
			var isMulti = app.multiService.viewModel.get("isMulti");
			var JBs = app.multiService.viewModel.get("jobMultiDataSource");
			//if (isMulti) {
			var allItemList = [];
			var itemList;
			var selectList = app.multiService.viewModel.get("selected");
			for (var i = 0; i < selectList.length; i++) {

				JBs.filter({
					field: "jobId",
					operator: "eq",
					value: selectList[i]
				});

				JBs.fetch(function () {

					var view = JBs.view();

					var selectItem = view[0];
					selectItem.report = app.multiService.viewModel.get("reportdetail");

					app.jobService.viewModel.set("selectItem", selectItem);

					itemList = app.changeStatusService.createItemMulti(selectItem.jobId, "05");
					allItemList.push(itemList);

				});
			}
			var dataValue = {};
			dataValue.token = localStorage.getItem("token");
			dataValue.version = '2';
			dataValue.userId = JSON.parse(localStorage.getItem("profileData")).userId;

			dataValue.allItemList = allItemList;

            var reportDetail = app.multiService.viewModel.get("reportdetail");

            if (reportDetail == undefined || reportDetail == null || reportDetail == "") {
				navigator.notification.alert("Please fill Report Detail",
					function () { }, "Change Status Job : Save incomplete!", 'OK');

            } else {
				app.jobService.viewModel.set("returnUrl", "#TT");
				app.jobService.viewModel.exeChangeStatusJobMulti(dataValue);
            }

			
			//} else {
			//	var that = app.jobService.viewModel;

			//	if (e.context != undefined && e.context != null) {

			//		////console.log("gotoAccept context: " + e.context);
			//		////console.log(JSON.stringify(JBs));
			//		JBs.filter({
			//			field: "jobId",
			//			operator: "eq",
			//			value: e.context,
			//		});

			//		JBs.fetch(function() {
			//			var view = JBs.view();

			//			var selectItem = view[0].items[0];

			//		if (selectItem != undefined && selectItem != null) {
			//				that.set("selectItem", selectItem);
			//				that.exeReportJobSingle(e);
			//			}
			//	}
			//}
		},
		onSwitchChange: function (e) {
			var that = app.multiService.viewModel;

			var switchMulti = $("#switchMulti").data("kendoMobileSwitch")
			switchMulti.check(switchMulti.check());

            that.set("isMulti", switchMulti.check());

			//app.multiService.viewModel.set("selected", []);
                                                        
		},
		checkall: function (e) {
			var that = app.multiService.viewModel;
			var selected = that.get("selected");
			var selectTT = that.get("selectTT");
			//var groupJob = e.className.replace("chkall", "");
			//this.element.find("ul.km-listview"),
			//if (groupJob != null && groupJob != undefined && groupJob != "") {
			var classname = "." + selectTT;
			var lbls = $(classname);
			if (e.target.checked) {
				lbls.each(function (index, value) {
					$(value).closest("li").css("background-color", "#c9db31");
				});
				lbls.each(function (index, value) {
					selected.push(value.id);
				});
			} else {
				lbls.each(function (index, value) {
					$(value).closest("li").css("background-color", "");
				});

				lbls.each(function (index, value) {
					$.each(selected, function (i, val) {
						if (val == value.id) {
							selected.splice(i, 1);
						}
					});
				});
			}
			//}
			that.set("selected", selected);
		},
		onSaveChangeStatus: function (e) {
			////console.log("on Save Change Status");
			var selectList = app.multiService.viewModel.get("selected");
			if(selectList.length > 10){
				alert("Please Select Only 10 items.");

			}else if(selectList.length > 0) {
				var status = $("#ddlStatusMulti").data("kendoDropDownList").value();

				if (status == "01") {
					//assign
					$("#MultiAssignActions").data("kendoMobileActionSheet").open(e.sender.element);
				} else if (status == "02") {
					//accept
					$("#MultiAcceptActions").data("kendoMobileActionSheet").open(e.sender.element);
				} else if (status == "03") {
					//init
					$("#MultiInitialActions").data("kendoMobileActionSheet").open(e.sender.element);
				} else if (status == "04") {
					//onsite	
					$("#MultiOnsiteActions").data("kendoMobileActionSheet").open(e.sender.element);
				} else {
					//wait for report detail, request more detail
					$("#MultiReportActions").data("kendoMobileActionSheet").open(e.sender.element);
				}
			} else {
				navigator.notification.alert("Please select job",
					function () { }, "Warning", 'OK');
				return;
			}
			
		},
        setJBs: function () {
            //console.log("########## setJbs ###########");
            var that = this,
				Jobs;

            Jobs = new kendo.data.DataSource({
				transport: {
					read: function (operation) {
						$.ajax({ //using jsfiddle's echo service to simulate remote data loading
							beforeSend: app.loginService.viewModel.checkOnline,
							type: "POST", timeout: 180000,
							url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=getJobTTSME.json',
							data: JSON.stringify({
								"token": localStorage.getItem("token"),
								"userId": JSON.parse(localStorage.getItem("profileData")).userId,
								"priority": "",
								"statusId": "",
								"version": "2"
							}),
							dataType: "json",
							contentType: 'application/json',
							success: function (response) {
								//store response
								operation.success(response);
								localStorage.setItem("jbData", JSON.stringify(response));
								//console.log("##### fetch My Job : Complete");
                                                               
							},
							error: function (xhr, error) {
								if (!app.ajaxHandlerService.error(xhr, error)) {
									////console.log("Get My Job from cache failed");
									////console.log(xhr);
									////console.log(error);
									navigator.notification.alert(xhr.status + error,
										function () { }, "Get My Job failed", 'OK');
									return;
								}
							}

						});
					}
				},
				schema: {
					data: "jobs"
				},
				model: {
					id: "jobId"
				}
			});

			Jobs.bind("error", function (e) {
				////console.log("Get my jobs failed");
				////console.log(e.status);
				////console.log(e.xhr);
				navigator.notification.alert(e.status,
					function () { }, "Get Reallocate jobs failed", 'OK');
				return;
			});

            app.jobService.viewModel.set("jobDataSource", Jobs);
            app.jobService.viewModel.loadProblemAssign();
        },
        hideLoading: function () {
            app.application.hideLoading();
        },
		showLoading: function() {
 			//if (this._isLoading) {
 				app.application.showLoading();
				//}
 		},
		onSearch: function () {
			var that = this;
			that.set("isSearch", !that.get("isSearch"));
			that.set("searchtxt", "");
		},
		gotoDetail: function (e) {
			var that = app.jobService.viewModel;
			that.set("selectPage", "0");
            that.set("returnUrl", "#Multi");
			that.gotoAcceptDetail(e);

		},
		gotoAssignDetail: function (e) {
			var that = app.jobService.viewModel;
			that.set("selectPage", "0");

			that.gotoAssignDetail(e);
		},
		gotoDetailSearch: function (e) {
			var txtJob = $(e.target).closest("form").find("input[type=search]");
			var jobId = txtJob.val();

			if (jobId.length == 11) {
				var jbSearchId = jobId;

				app.jobService.viewModel.set("isSearch", false);
				txtJob.val('');
				app.jobService.viewModel.exeDetailSearch(jbSearchId);
			} else if (jobId.length < 7 && jobId.length != 0) {
				var str = jobId;
				var pad = "000000";
				var d = new Date();
				var n = d.getFullYear();
				var jbSearchId = "JB" + n.toString().substring(2, 4) + "-" + pad.substring(0, pad.length - str.length) + str;
				txtJob.val(jbSearchId);

				app.jobService.viewModel.set("isSearch", false);
				app.jobService.viewModel.set("returnUrl", app.application.view().id);
				app.jobService.viewModel.set("selectPages", 0);
				txtJob.val('');
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

		}
	});

	app.multiService = {
		showMultiDetail: function () {

			$(".chkall").prop('checked', false);
			var isOffline = app.loginService.viewModel.get("isOffline");
			if (!isOffline) {
				app.multiService.viewModel.loadMultiDetail();

			} else {
				navigator.notification.alert("offline",
					function () { }, "Internet Connection", 'OK');
			}
		},
		initMultilist: function () {

		},
		showMultilist: function () {
			//console.log("##### showMultilist ####");
			//var listviews = this.element.find("ul.km-listview");
			//var btnGroup = $("#assigngroup").data("kendoMobileButtonGroup");
			app.multiService.viewModel.set("selected", []);
			var isOffline = app.loginService.viewModel.get("isOffline");

			if (app.multiService.viewModel.get("returnurl") != "") {
				if ($("#ddlMulti").data("kendoDropDownList") != undefined && $("#ddlMulti").data("kendoDropDownList") != null) {
					$("#ddlMulti").data("kendoDropDownList").select(0);
					$("#ddlStatusMulti").data("kendoDropDownList").select(0);
				}

				if (!isOffline) {
					app.multiService.viewModel.initDropdownType();
					app.multiService.viewModel.initDropdownStatus();
					app.multiService.viewModel.loadMultilist();

					app.multiService.viewModel.setJBs();
				} else {
					navigator.notification.alert("offline",
						function () { }, "Internet Connection", 'OK');
				}

				app.multiService.viewModel.set("returnurl", "");
			} else {

				if (!isOffline) {
					app.multiService.viewModel.initDropdownType();
					app.multiService.viewModel.initDropdownStatus();
					app.multiService.viewModel.loadMultilist();

					app.multiService.viewModel.setJBs();
				} else {
					navigator.notification.alert("offline",
						function () { }, "Internet Connection", 'OK');
				}

			}


			//app.jobService.viewModel.filterassign(btnGroup.current().index());
		},
		//				showreject: function() {
		//		app.jobService.viewModel.loadreject();
		//		},
		viewModel: new multiViewModel()
	};
})(window);
