

let handlesSlider = document.getElementById('time-slider');

let formatter = {
	from: timeStrToMin, 
	to: (val) => {
		let timeStr = new Date(val * 60000 % (24 * 60 * 60000)).toISOString().substr(11, 5);
		return (timeStr === '00:00' && val === 1440) ? '24:00' : timeStr;
	}
};

noUiSlider.create(handlesSlider, {
	start: [ '06:00', '10:00' ],
	range: {
		'min': [ 0 ],
		'max': [ 1440 ]
	},
	format: formatter,
	connect: true,
	tooltips: true,
	pips: {
		mode: 'steps',
		format: formatter,
		filter: (value, type) => 1,
		density: 4.166666666666667
	}
});

handlesSlider.noUiSlider.on('end', () => update());

