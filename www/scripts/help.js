(function(global) {
    app = global.app = global.app || {};

    HelpViewModel = kendo.data.ObservableObject.extend({
        showInitHelp: function(e) {
            //that = this;
            var listviews = e.view.element.find("ul.km-listview");

            $("#helpGroup").kendoMobileButtonGroup({
                select: function(e) {
                    listviews.hide()
                        .eq(this.current().index())
                        .show();

                },
                index: 0
            });
            console.log("showInitHelp");
        },
        setHelp: function(e) {
            var listviews = e.view.element.find("ul.km-listview");
            
            console.log($("#hd_help").val());
            if($("#hd_help").val() == "2")
            {
                $("#helpGroup").data("kendoMobileButtonGroup").select(2);
                $("#hd_help").val("0");
            }
            else{
                 $("#helpGroup").data("kendoMobileButtonGroup").select(0);
            }

            listviews.hide()
                .eq($("#helpGroup").data("kendoMobileButtonGroup").current().index())
                .show();

            
        },
        showMapHelp: function(idx) {


            var btg = $("#helpGroup").data("kendoMobileButtonGroup");
            // console.log(btg);
            if (typeof btg === "undefined") {
                console.log("button group undefind");
                
            } else {
                $("#helpGroup").data("kendoMobileButtonGroup").select(2);
            }

        }
    });

    app.helpService = {
        init: function(e) {
            app.helpService.viewModel.showInitHelp(e);
        },
        show: function(e) {
            app.helpService.viewModel.setHelp(e);
        },
        viewModel: new HelpViewModel()
    }
})(window);