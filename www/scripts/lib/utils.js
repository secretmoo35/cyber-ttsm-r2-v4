var times = (Math.floor(+new Date()));
//-------------- count down -------------------

var pad = function (value) {
	return (value.toString().length < 2) ? '0' + value : value;
}

function fn_countDown() {

	var countDown = $("[class^='run_countDown']")

	$.each(countDown, function (index, value) {

		var cd = "";

		var finishtime = parseInt(value.className.replace("run_countDown", ""));

		var a = moment(finishtime);
		var b = moment();



		var y = a.diff(b, 'years');
		var m = a.diff(b.add("years", y), 'months');
		var d = a.diff(b.add("months", m), 'days');
		var hours = a.diff(b.add("days", d), 'hours');
		var minutes = a.diff(b.add("hours", hours), 'minutes');
		var seconds = a.diff(b.add("minutes", minutes), 'seconds');
		//console.log(hours);
		//console.log(minutes);
		//console.log(seconds);

		if (timeout >= 360) {
			cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
			((m == 0) ? "" : Math.abs(m) + " month ") +
			((d == 0) ? "" : Math.abs(d) + " day ") +
			pad(Math.abs(hours)) + " hour";

		} else if (timeout >= 60) {
			cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
			((m == 0) ? "" : Math.abs(m) + " month ") +
			((d == 0) ? "" : Math.abs(d) + " day ") +
			pad(Math.abs(hours)) + ":" + pad(Math.abs(minutes));
		} else {
			cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
			((m == 0) ? "" : Math.abs(m) + " month ") +
			((d == 0) ? "" : Math.abs(d) + " day ") +
			pad(Math.abs(hours)) + ":" + pad(Math.abs(minutes)) + ":" + pad(Math.abs(seconds));

		}


		if (a.diff(b) > 0) {
			$("[class='checkCountdown" + finishtime + "']").css("color", "#BFD22B");
		} else {
			$("[class='checkCountdown" + finishtime + "']").css("color", "red");
			cd = "-" + cd;
		}

		value.innerHTML = cd;



	});
	var Mili = 60000;

	var cache = localStorage.getItem("profileData");
	if (cache == null || cache == undefined) {
		timeout = 60;
	} else {
		if (JSON.parse(cache).profiles[0].countDown == null || JSON.parse(cache).profiles[0].countDown == undefined) {
			timeout = 60;
		}else{
			timeout = JSON.parse(cache).profiles[0].countDown;
			Mili = JSON.parse(cache).profiles[0].countDown * 1000;
		}
	}

	//timeout = 1000;
	
	setTimeout(function () {
		fn_countDown();
	}
		, Mili);
	//return cd;

}

function setCountDown(finishtime) {
	var a = moment(finishtime);
	var b = moment();

	var cd = "";

	var cache = localStorage.getItem("profileData");
	if (cache == null || cache == undefined) {
		timeout = 60;
	} else {
		if (JSON.parse(cache).profiles[0].countDown == null || JSON.parse(cache).profiles[0].countDown == undefined) {
			timeout = 60;
		} else {
			timeout = JSON.parse(cache).profiles[0].countDown;
		}
	}

	var y = a.diff(b, 'years');
	var m = a.diff(b.add("years", y), 'months');
	var d = a.diff(b.add("months", m), 'days');
	var hours = a.diff(b.add("days", d), 'hours');
	var minutes = a.diff(b.add("hours", hours), 'minutes');
	var seconds = a.diff(b.add("minutes", minutes), 'seconds');

	if (timeout >= 360) {
		cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
		((m == 0) ? "" : Math.abs(m) + " month ") +
		((d == 0) ? "" : Math.abs(d) + " day ") +
		pad(Math.abs(hours)) + " hour";

	} else if (timeout >= 60) {
		cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
		((m == 0) ? "" : Math.abs(m) + " month ") +
		((d == 0) ? "" : Math.abs(d) + " day ") +
		pad(Math.abs(hours)) + ":" + pad(Math.abs(minutes));
	} else {
		cd = ((y == 0) ? "" : Math.abs(y) + " year ") +
		((m == 0) ? "" : Math.abs(m) + " month ") +
		((d == 0) ? "" : Math.abs(d) + " day ") +
		pad(Math.abs(hours)) + ":" + pad(Math.abs(minutes)) + ":" + pad(Math.abs(seconds));

	}

	if (a.diff(b) > 0) {
		$("[class='checkCountdown" + finishtime + "']").css("color", "#BFD22B");
	} else {
		$("[class='checkCountdown" + finishtime + "']").css("color", "red");
		cd = "-" + cd;
	}

	return cd;
}

function fn_checkCountdown(end) {
	var a = moment(end);
	var b = moment();
	if (a.diff(b) > 0) {
		return "#BFD22B";
	} else {
		return "red";
	}
}
//-------------- cover timestamp --------------start

function formatTime(unixTimestamp) {
	var dt = new Date(unixTimestamp);
	var hours = dt.getHours();
	var minutes = dt.getMinutes();
	var seconds = dt.getSeconds();
	if (hours < 10)
		hours = '0' + hours;
	if (minutes < 10)
		minutes = '0' + minutes;
	if (seconds < 10)
		seconds = '0' + seconds;
	return hours + ":" + minutes + ":" + seconds;
}

function format_time_date(ts) {
    return moment.unix((ts / 1000)).zone('+0700').format("DD-MMMM-YYYY HH:mm:ss");
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
    //alert("woke up!");
}