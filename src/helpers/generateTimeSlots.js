let generateTimeSlots = function(start, end, interval, date) {
	let value = start;
	let slots = [];
	let overflow = 0;

	while (value <= (end + 1 - interval)) {
		slots.push(value);

		value += interval;
		overflow = parseInt((value % 100) / 60);
		value = value - (overflow * 60) + (overflow * 100);
	}

	// If booking date is today, do not show past times.
	if (date.setHours(0, 0, 0, 0) == (new Date()).setHours(0, 0, 0, 0)) {
		// Get current time and convert it to hhmm format
		let currentTime = ((new Date()).getHours())*100 + (new Date()).getMinutes();
		// remove array element from timeSlots which are less than current time
		slots = slots.filter(x => x > currentTime);
	}

	return slots
}

export default generateTimeSlots;
