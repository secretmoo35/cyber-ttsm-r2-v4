//MULTI_CAUSE_ID	
//MULTI_CAUSE_DESCRIPTION	
//MULTI_CAUSE_STATUS	
//MULTI_CAUSE_LEVEL	
//MULTI_CAUSE_GROUP	
//MULTI_CAUSE_GROUP_PARENT

(function(global) {
	var ProblemCauseMultiViewModel,
		app = global.app = global.app || {};


	ProblemCauseMultiViewModel = kendo.data.ObservableObject.extend({
		_isLoading: true,
		groupParent: 0,
		multiCauseIds: [],
		multiCauseLevels: [],
		multiCauseDescs: [],
		userId: function() {
			var cache = localStorage.getItem("profileData");
			if (cache == null || cache == undefined) {
				return null;
			} else {
				return JSON.parse(cache).userId;
			}
		},
		initProblemCauseMultiMaster: function() {
			var that = this;

			var ProblemCauseMulti = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						operation.success(JSON.parse(localStorage.getItem("problemCauseMultiData")));
					}
				},
				schema: {
					data: "problemCauseMultis"
				},
				filter: {
					field: "groupParent",
					operator: "eq",
					value: that.get("groupParent")
				}
			});


			$("#lvProblemCauseMultiMaster").kendoMobileListView({
				dataSource: ProblemCauseMulti,
				click: function(e) {
					app.problemCauseMultiService.viewModel.selectPbCM(e);
				},
				template: $("#problem-cause-multi-master-template").html(),
				filterable: {
					field: "description",
					ignoreCase: true
				}
			});

		},
         onBack: function(){
            //console.log('##### onBack #####');
            app.problemCauseMultiService.viewModel.set("multiCauseIds",[]);
            app.problemCauseMultiService.viewModel.set("multiCauseLevels",[]);
            app.problemCauseMultiService.viewModel.set("multiCauseDescs",[]);  
              
        },
		loadProblemCauseMultiMaster: function() {
			var that = this;

			var ProblemCauseMulti = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						operation.success(JSON.parse(localStorage.getItem("problemCauseMultiData")));
					}
				},
				schema: {
					data: "problemCauseMultis"
				},
				filter: {
					field: "groupParent",
					operator: "eq",
					value: that.get("groupParent")
				}
			});

			var lvProblemCauseMultiMaster = $("#lvProblemCauseMultiMaster").data("kendoMobileListView");

			lvProblemCauseMultiMaster.setDataSource(ProblemCauseMulti);

            //console.log('####### load lv Problem cause multi Master Loaded #######');

		},
		selectPbCM: function(e) {
            //console.log('####### selectPbCM #######');
			var that = app.jobService.viewModel;
			var multiCauseIds = app.problemCauseMultiService.viewModel.get("multiCauseIds");
			var multiCauseLevels = app.problemCauseMultiService.viewModel.get("multiCauseLevels");
			var multiCauseDescs = app.problemCauseMultiService.viewModel.get("multiCauseDescs");
			var selectItem = that.get("selectItem");

			var checkDatasource = new kendo.data.DataSource({
				transport: {
					read: function(operation) {
						operation.success(JSON.parse(localStorage.getItem("problemCauseMultiData")));
					}
				},
				schema: {
					data: "problemCauseMultis"
				},
				filter: {
					field: "groupParent",
					operator: "eq",
					value: e.dataItem.group
				}
			});

			checkDatasource.fetch(function() {

				var data = checkDatasource.view();

                                  var flagDup = false;

                multiCauseIds.push(e.dataItem.id);
				multiCauseLevels.push(e.dataItem.level);
				multiCauseDescs.push(e.dataItem.description);

				if (data.length) {
					var lvProblemCauseMultiMaster = $("#lvProblemCauseMultiMaster").data("kendoMobileListView");
					lvProblemCauseMultiMaster.setDataSource(checkDatasource);
					lvProblemCauseMultiMaster.refresh();
				} else {
					var selectProblemCM = app.jobService.viewModel.get("selectProblemCM");

					if (selectProblemCM != undefined && selectProblemCM != null) {
						var data = selectProblemCM.data();
						for (var i = 0; i < data.length; i++) {
							if (data[i].multiCauseIds == multiCauseIds.join("|") ) {
								navigator.notification.alert("Duplicate problem cause.",
                                function() {
                                  app.problemCauseMultiService.viewModel.set("multiCauseIds",[]);
                                  app.problemCauseMultiService.viewModel.set("multiCauseLevels",[]);
                                  app.problemCauseMultiService.viewModel.set("multiCauseDescs",[]);
                                  app.application.navigate(
                                                           '#job-problem-cause-multi'
                                                           );
                                  }, "Error", 'OK');
								flagDup = true;
                                                                    //return false;
							}
						}
					}else{
						selectProblemCM=new kendo.data.DataSource();
					}

					if (!flagDup) {
						selectItem.cntProblemCause++;
						
						var pbcm = {
							//"ids": e.dataItem.id,
							"jobId": selectItem.jobId,
							"seqId": null,
                            "multiCauseIds": multiCauseIds.join("|"),
							"multiCauseLevels": multiCauseLevels.join("|"),
							"maxLevel": e.dataItem.level,
							"multiCauseDescs": multiCauseDescs.join(" => ")
						}
                            selectProblemCM.pushCreate(pbcm);


						that.set("selectProblemCM", selectProblemCM);
                                  
						app.application.navigate(
							'#job-problem-cause-multi'
						);
					} else {
                                  //navigator.notification.alert("Problem cause duplicate",
                                  //function() {}, "Error", 'OK');
                                  ////console.log("Problem cause duplicate");
					}
                                  app.problemCauseMultiService.viewModel.set("multiCauseIds",[]);
                                  app.problemCauseMultiService.viewModel.set("multiCauseLevels",[]);
                                  app.problemCauseMultiService.viewModel.set("multiCauseDescs",[]);
                                  
				}
				//lvProblemCauseMultiMaster
                                  
			});

			//MULTI_CAUSE_ID
			//MULTI_CAUSE_DESCRIPTION
			//MULTI_CAUSE_STATUS
			//MULTI_CAUSE_LEVEL	
			//MULTI_CAUSE_GROUP	
			//MULTI_CAUSE_GROUP_PARENT

			//that.set("selectPage", 2);
                                                                   

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

	app.problemCauseMultiService = {
		init: function() {
			////console.log("problemCauseMulti init start");
			app.problemCauseMultiService.viewModel.initProblemCauseMultiMaster();
			////console.log("problemCauseMulti init end");
		},
		show: function() {
            //console.log("##### problemCauseMulti show start #####");
			//app.problemCauseMultiService.viewModel.showLoading();
			app.problemCauseMultiService.viewModel.loadProblemCauseMultiMaster();
			//app.myService.viewModel.hideLoading(////console.logle.debug("myteam hide hide");
        
		},
		hide: function() {
			////console.log("problemCauseMulti hide start");
			//app.myService.viewModel.hideLoading();
			////console.log("problemCauseMulti hide hide");
		},
		viewModel: new ProblemCauseMultiViewModel()
	}
})(window);
