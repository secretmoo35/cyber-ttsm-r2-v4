(function(global) {
	var MoreViewModel,
		app = global.app = global.app || {};

	MoreViewModel = kendo.data.ObservableObject.extend({
		isWF: function() {
			var userRole = app.masterService.viewModel.get("userRole");

			if (userRole == "02") {
				return false;
			} else {
				return true;
			}
		},

		

		gotoMulti: function() {

			app.multiService.viewModel.set("returnurl", "Y");
			app.application.navigate(
				'#TT'
			);


		},

		gotoPserach: function(){
           app.powerSearchService.viewModel.set("titletxt", "Power Search");
           app.powerSearchService.viewModel.set("paramsSearch", "P");
           app.application.navigate('#powerSearch');
           },

		logout: function() {
			var that = this;
			//setTimeout(function() {
				that.showLoading();
				//}, 0);
			app.loginService.viewModel.onLogout();
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

	app.moreService = {
		Show: function() {
			kendo.bind($(".Multi"), app.moreService.viewModel);
		},
		viewModel: new MoreViewModel()
	};
})(window);
