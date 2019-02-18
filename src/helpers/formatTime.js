let formatTime = function(time, date, returnHHMM) {
	let padZero = function(value) {
		let str = "0" + value;
		return str.substr(str.length - 2)
	}

	// if time is in Date format instead of hhmm format
	if (date) {
		let hours = (new Date(time)).getHours();
		let mins = (new Date(time)).getMinutes();

		var hhmm = parseInt(hours) * 100 + parseInt(mins);
	} else {
		var hhmm = time;
	}

	if(returnHHMM) return hhmm;

	hhmm = parseInt(hhmm);
	if (hhmm != 0 && !hhmm) return null
	else if (hhmm < 100) return '12:' + padZero(hhmm) + ' AM';
	else if (hhmm < 1200) return (padZero(parseInt(hhmm / 100)) + ':' + padZero(hhmm % 100) + ' AM');
	else if (hhmm >= 1200 && hhmm < 1300) return '12:' + padZero(hhmm % 100) + ' PM';
	else return (padZero(parseInt(hhmm / 100) - 12) + ':' + padZero(hhmm % 100) + ' PM');
};

export default formatTime;
