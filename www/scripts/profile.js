(function (global) {
    var ProfileViewModel,
        app = global.app = global.app || {};

    ProfileViewModel = kendo.data.ObservableObject.extend({
        profileDataSource: null,

        loadData: function () {
            var that = this,
                dataSource;

            

            dataSource = JSON.parse(localStorage.getItem("profileData"));
            ////console.log(dataSource.profiles[0]);
            that.set("profileDataSource", dataSource.profiles[0]);
        }
    });

    app.profileService = {
        init: function () {
            //app.profileService.viewModel.init();
            //kendo.bind($("#Profile"), app.profileService.viewModel);
            
        },
        show: function(){
            app.profileService.viewModel.loadData();
        },
        viewModel: new ProfileViewModel()
    };
})(window);