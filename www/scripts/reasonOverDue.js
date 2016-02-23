(function(global) {
	var ReasonOverDueViewModel,
		app = global.app = global.app || {};

	ReasonOverDueViewModel = kendo.data.ObservableObject.extend({

		loadReasonOverDue: function() {
			console.debug("loadReasonOverDue");
			var that = this;
			var selectItem = app.jobService.viewModel.get("selectItem");
			$("#lvReasonOverDue").kendoMobileListView({
				dataSource: {
					data: JSON.parse(localStorage.getItem("reasonOverDueData")),
					schema: {
						data: "reasonOverdues"
					}
				},
				style: "inset",
				template: $("#reason-over-due-template").html(),
				click: function(e) {
					app.reasonOverDueService.viewModel.setReasonOverDue(e);
				},
				databound: function() {
					that.hideLoading();
				}

			});


		},

		setReasonOverDue: function(e) {
			var that = this;
			var selectItem = app.jobService.viewModel.get("selectItem");

			console.debug("Set Reason Over Due  selectId : " + e.dataItem.id + " , " + e.dataItem.description);

			selectItem.reasonOverdueId = e.dataItem.id;
			selectItem.reasonOverdueDesc = e.dataItem.description;

			app.jobService.viewModel.set("selectItem", selectItem);
			app.application.navigate('#tabstrip-edit');
			kendo.bind($(".job-bind"), app.jobService.viewModel);


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

	app.reasonOverDueService = {
		init: function() {
			app.reasonOverDueService.viewModel.loadReasonOverDue();
		},
		show: function() {

		},
		viewModel: new ReasonOverDueViewModel()
	};
})(window);
