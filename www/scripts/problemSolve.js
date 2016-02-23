//MULTI_CAUSE_ID	
//MULTI_CAUSE_DESCRIPTION	
//MULTI_CAUSE_STATUS	
//MULTI_CAUSE_LEVEL	
//MULTI_CAUSE_GROUP	
//MULTI_CAUSE_GROUP_PARENT

(function(global) {
	var ProblemSolveViewModel,
		app = global.app = global.app || {};


	ProblemSolveViewModel = kendo.data.ObservableObject.extend({
		_isLoading: true,
		userId: function() {
			var cache = localStorage.getItem("profileData");
			if (cache == null || cache == undefined) {
				return null;
			} else {
				return JSON.parse(cache).userId;
			}
		},
		initProblemSolveMaster: function() {
			var that = app.jobService.viewModel;;

			var selectProblemC = that.get("selectProblemC");
			var selectProblemCM = that.get("selectProblemCM");

			var problemSolveData = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						operation.success(JSON.parse(localStorage.getItem("problemSolveData")));
					}
				},
				schema: {
					data: "problemSolves"
				}
			});

			var filter = {
				logic: "or",
				filters: []
			}

			if (selectProblemC != undefined && selectProblemC != null) {

				var data = selectProblemC.data();
				for (var i = 0; i < data.length; i++) {
					var filters = {
						field: "subproblemCauseId",
						operator: "eq",
						value: data[i].problemCauseSubId
					};

					filter.filters.push(filters);

				}

			}

			if (selectProblemCM != undefined && selectProblemCM != null) {

				var data = selectProblemCM.data();
				for (var i = 0; i < data.length; i++) {
					var filters = {
						field: "subproblemCauseId",
						operator: "eq",
						value: data[i].problemCauseSubId
					};

					filter.filters.push(filters);

				}

			}

			if ((selectProblemC != undefined && selectProblemC != null) || (selectProblemCM != undefined && selectProblemCM != null)) {

				problemSolveData.filter(filter);


				////console.log(JSON.stringify(problemSolveData));

				problemSolveData.fetch(function() {

					$("#lvProblemSolveMaster").kendoMobileListView({
						dataSource: {
							transport: {
								read: function(operation) {
									operation.success(problemSolveData.view());
								}
							},
							filter: [{
								field: "description",
								operator: "neq",
								value: "Permanent"

							}, {
								field: "description",
								operator: "neq",
								value: "Temporary"
							}]
						},
						template: $("#problem-solve-master-template").html(),
						click: function(e) {
							app.problemSolveService.viewModel.selectPbS(e);
						},
						filterable: {
							field: "description",
							ignoreCase: true
						}
					});
				});
			}
			////console.log('lv Problem solve Master Loaded');

		},
		loadProblemSolveMaster: function() {
                                                               //console.log("### loadProblemSolveMaster ###");
			var that = app.jobService.viewModel;
			var selectItem = that.get("selectItem");

			var selectProblemC = that.get("selectProblemC");
			var selectProblemCM = that.get("selectProblemCM");

			if (selectItem.cntProblemCause > 0) {

				var problemSolveData = new kendo.data.DataSource({
					transport: {
						read: function(operation) {
							operation.success(JSON.parse(localStorage.getItem("problemSolveData")));
						}
					},
					schema: {
						data: "problemSolves"
					}
				});

				var filter = {
					logic: "or",
					filters: []
				}

				if (selectProblemC != undefined && selectProblemC != null) {

					var data = selectProblemC.data();
					for (var i = 0; i < data.length; i++) {
						var filters = {
							field: "subproblemCauseId",
							operator: "eq",
							value: data[i].problemCauseSubId
						};

						filter.filters.push(filters);

					}

				}

				if (selectProblemCM != undefined && selectProblemCM != null) {

					var data = selectProblemCM.data();
					for (var i = 0; i < data.length; i++) {
						var filters = {
							field: "subproblemCauseId",
							operator: "eq",
							value: data[i].problemCauseSubId
						};

						filter.filters.push(filters);

					}

				}

				if ((selectProblemC != undefined && selectProblemC != null) || (selectProblemCM != undefined && selectProblemCM != null)) {

					problemSolveData.filter(filter);


					////console.log(JSON.stringify(problemSolveData));

					problemSolveData.fetch(function() {

						if ($("#lvProblemSolveMaster").data("kendoMobileListView") != undefined && $("#lvProblemSolveMaster").data("kendoMobileListView") != null) {
							var lvProblemSolveMaster = $("#lvProblemSolveMaster").data("kendoMobileListView");

							var ds = new kendo.data.DataSource({
								data: problemSolveData.view(),
								filter: [{
									field: "description",
									operator: "neq",
									value: "Permanent"

								}, {
									field: "description",
									operator: "neq",
									value: "Temporary"
								}]

							});
							ds.fetch(function() {
								lvProblemSolveMaster.setDataSource(ds.view());
								lvProblemSolveMaster.refresh();
								lvProblemSolveMaster.reset();
							});

						} else {

							$("#lvProblemSolveMaster").kendoMobileListView({
								dataSource: {
									transport: {
										read: function(operation) {
											operation.success(problemSolveData.view());
										}
									},
									filter: [{
										field: "description",
										operator: "neq",
										value: "Permanent"

									}, {
										field: "description",
										operator: "neq",
										value: "Temporary"
									}]
								},
								template: $("#problem-solve-master-template").html(),
								click: function(e) {
									app.problemSolveService.viewModel.selectPbS(e);
								},
								filterable: {
									field: "description",
									ignoreCase: true
								}

							});
						}
					});
				} 
				////console.log('lv Problem solve Master Loaded');
			}

		},
		selectPbS: function(e) {
                                                               //console.log("##### selectPbS ########");
                                                               
			var that = app.jobService.viewModel;

			var selectItem = that.get("selectItem");

			var selectProblemS = that.get("selectProblemS");

			var flag = true;

			//var pbc = [{"jobId": selectItem.jobId,
			//			"problemCauseMainId": e.problemCauseId,
			//			"problemCauseDesc": e.problemCauseDescription,
			//			"problemCauseSubId": e.subproCauseId,
			//			"problemCauseSubDesc": e.subproCauseDescription,
			//			"seqId":null,
			//			"levelCause":null,
			//			"problemCauseId":null
			//			}]

			if (selectProblemS != undefined && selectProblemS != null) {
				var data = selectProblemS.data();
				for (var i = 0; i < data.length; i++) {
					if (data[i].problemSolveId == e.dataItem.id) {
						flag = false;
						e.preventDefault();
                        navigator.notification.alert("Duplicate problem solve.",
                                                  function() {}, "Error", 'OK');
						i = data.length;
					}
				}
			}else{
				
				selectProblemS=new kendo.data.DataSource();
			}

			if (flag) {

				selectItem.cntProblemSolve++;

				var pbs = {
					"jobId": selectItem.jobId,
					"problemSolveId": e.dataItem.id,
					"problemSolveDesc": e.dataItem.subProblemCauseDesc + "-" + e.dataItem.description,
					"processDesc": "",
					"subProblemCauseId": e.dataItem.subproblemCauseId,
					"process": e.dataItem.process
				};
				selectProblemS.pushCreate(pbs);


				//SUBPRO_CAUSE_ID	
				//SUBPRO_CAUSE_DESCRIPTION	
				//SUBPRO_CAUSE_STATUS	
				//SUBPRO_CAUSE_PRO_CAUSE_ID	
				//PROBLEM_CAUSE_ID	
				//PROBLEM_CAUSE_DESCRIPTION
				that.set("selectProblemS", selectProblemS);

				that.set("selectItem", selectItem);
				//that.set("selectPage", 2);
				app.application.navigate(
					'#job-problem-solve'
				);
			} else {
//				navigator.notification.alert("Problem solve duplicate",
//					function() {}, "Error", 'OK');
			}
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

	app.problemSolveService = {
		init: function() {
			////console.log("problem solve init start");
			//app.problemSolveService.viewModel.initProblemSolveMaster();
			////console.log("myteam init end");
		},
		show: function() {
			////console.log("problem solve show start");
			//app.problemSolveService.viewModel.showLoading();
			app.problemSolveService.viewModel.loadProblemSolveMaster();
			//app.myService.viewModel.hideLoading(////console.logle.debug("myteam hide hide");
		},
		hide: function() {
			////console.log("problem solve hide start");
			//app.myService.viewModel.hideLoading();
			////console.log("problem solve hide hide");
		},
		viewModel: new ProblemSolveViewModel()
	}
})(window);
