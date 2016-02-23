(function(global) {
	app = global.app = global.app || {};

	GeolocationViewModel = kendo.data.ObservableObject.extend({
		sendLocation: function(location) {
			var that = this;

			//hostPort + 'rest-service/post-json.service?s=transaction-service&o=updateLocation.json';	  

			//var dataValue = {"token":$('#token').val(), "userId":"7478","latitude":"10.2","longitude":"61.1192","version":"2"};
			////console.log("exec send location");
			////console.log(localStorage.getItem("token"));
			if (localStorage.getItem("token") != undefined && localStorage.getItem("token") != null && localStorage.getItem("token") != "") {
				if (localStorage.getItem("profileData") != undefined && localStorage.getItem("profileData") != null && localStorage.getItem("profileData") != "") {
					////console.log("sending location");
					//location.coords.latitude
					//location.coords.longitude
					////console.log(location.latitude.toFixed(6).toString());
					////console.log(location.longitude.toFixed(6).toString());

					$.ajax({ //using jsfiddle's echo service to simulate remote data loading
						type: "POST", timeout: 180000,
						url: app.configService.serviceUrl + 'post-json.service?s=transaction-service&o=updateLocation.json',
						data: JSON.stringify({
							"token": localStorage.getItem("token"),
							"userId": JSON.parse(localStorage.getItem("profileData")).userId,
							"latitude": location.latitude.toFixed(6).toString(),
							"longitude": location.longitude.toFixed(6).toString(),
							"version": "2"
						}),
						dataType: "json",
						contentType: 'application/json',
						success: function(response) {
							//store response
							////console.log(response.status);

							if (response.status == "Success") {
								////console.log("send location success");
							} else {
								////console.log("send location fail : " + response.msg);
							}
						},
						error: function(xhr, error) {
							if (!app.ajaxHandlerService.error(xhr, error)) {
								////console.log("send location fail error : " + JSON.stringify(xhr));
							}
							return;
						}
					});
				}
			}
		}
	});

	app.geolocationService = {
		viewModel: new GeolocationViewModel()
	}
})(window);
