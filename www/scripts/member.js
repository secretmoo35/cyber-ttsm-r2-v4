(function (global) {
    var MemberViewModel,
        app = global.app = global.app || {};

    MemberViewModel = kendo.data.ObservableObject.extend({
        memberDataSource: null,
		_isLoading: true,
        loadData: function () {
            var that = this,
                Members;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            //dataSource = JSON.parse(localStorage.getItem("reallocateData"));
            //var JBs = null;
			////console.log(JSON.stringify(localStorage.getItem("memberData")));
            Members = JSON.parse(localStorage.getItem("memberData"));

            that.set("memberDataSource", Members);
			app.memberService.viewModel.hideLoading();
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

    app.memberService = {
        init: function () {
            //app.profileService.viewModel.init();
            //kendo.bind($("#Profile"), app.profileService.viewModel);
        },
        show: function (){
			app.memberService.viewModel.showLoading();
            app.profileService.viewModel.loadData();
        },
        viewModel: new MemberViewModel()
    };
})(window);