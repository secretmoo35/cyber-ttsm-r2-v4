(function(global) {
	var app = global.app = global.app || {};

	app.cryptographyService = {
		decrypt: function() {
			var flag = false;
			var rp = {};
			/*** decrypt */
			json_sjcl = localStorage.getItem("enc_otp");
			////console.log(json_sjcl);
			var userId = app.loginService.viewModel.get("username");
			var Passphrase = app.loginService.viewModel.get("password");
			var otp = app.loginService.viewModel.get("OTP");

			var dec_otp = sjcl.decrypt(Passphrase, json_sjcl, {}, rp);
			
			////console.log("dec_otp : " + dec_otp);

			//////console.log("profileData : " + JSON.parse(localStorage.getItem("profileData")).profiles[0].userName);

			if (localStorage.getItem("profileData") == undefined || localStorage.getItem("profileData") == null){
				////console.log("profileData undefined");
				
				flag = false;
				
			}else{

			var tmpUserId = JSON.parse(localStorage.getItem("profileData")).profiles[0].userName;
			
			////console.log("tmpUserId : " + tmpUserId);
			
			////console.log("userId : " + userId);

			//if (tmpUserId == userId) {
				////console.log("user match");
				if (dec_otp == otp) {
					////console.log("otp match");
					flag = true;
				}
				//}
			////console.log("decrypt complete");
			}
			return flag;
		},
		encrypt: function() {
			var p, rp = {};
			p = {
				mode: "ccm",
				ks: 128
			};

			var Passphrase = app.loginService.viewModel.get("password");
			var otp = app.loginService.viewModel.get("OTP");

			/*** encrypt */
			var json_sjcl = sjcl.encrypt(Passphrase, otp, p, rp);
			//var jsObject = eval("(" + json_sjcl + ")");  
			//var ciphertext = jsObject.ct;  

			localStorage.setItem("enc_otp", json_sjcl);
			
			////console.log("encrypt complete : " + json_sjcl);
			
			return;

		}
	};
})(window);
