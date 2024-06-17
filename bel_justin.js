//testing pattern (justin)
function assignment(back) {
	back = back ? back : () => { layout.dashboard(); };

	// initialize
	const mode = 'bel_justin';
	let a = 0, callbacks = [], options = [];

	// Loudness Levels
	options.push('Beginning Drum Test');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.protocol = id;
		gui.loudness(false,880);
	}.bind(null,mode+'.'+a++));

	// Detection Thresholds (110 to 3520 Hz)
	options.push('Detection Thresholds (110 to 3520 Hz)');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'percept';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		protocol.random = false;
		const f1 = [110,220,440,880,1760,3520];
		for (let a = 0; a < f1.length; a++) {
			protocol.settings.push({
				alternatives: 3,
				f1: f1[a]
			})
		}
		protocol.start();
	}.bind(null,mode+'.'+a++));

	// Major/Minor Melodies
	options.push('Melodies to Distinguish');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'majorMinor';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		protocol.settings.push({
			practice: false,
			stimulusMode: 0,
			volume: true
		});
		protocol.start(3);
	}.bind(null,mode+'.'+a++));


	// Frequency Resolution (110 to 3520 Hz)
	options.push('Frequency Discrimination (110 to 3520 Hz)');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'percept';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		const f1 = [110,220,440,880,1760,3520];
		for (let a = 0; a < f1.length; a++) {
			protocol.settings.push({
				activity: 1,
				f1: f1[a]
			});
		}
		protocol.start(2);
	}.bind(null,mode+'.'+a++));

	// Pitch Resolution for Piano Notes (A2, A3, A4)
	options.push('Pitch Resolution for Piano Notes (A2, A3, A4)');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'musescore';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		const range = [[39,51],[51,63],[63,75]], f0 = [110,220,440];
		const instruments = ['piano'];
		for (let a = 0; a < range.length; a++) {
			protocol.settings.push({
				f0: f0[a],
				instruments: instruments,
				mode: 0,
				range: range[a],
				timbreMode: 0
			});
		}
		protocol.start(2);
	}.bind(null,mode+'.'+a++));

	// Melodic Contour
	options.push('Melodic Contour Identification');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'musescore';
		protocol.protocol = id;
		protocol.random = false;
		const range = [[43,47],[55,59],[67,71]];
		for (let a = 0; a < range.length; a++) {
			protocol.settings.push({
				chances: Infinity,
				mode: 3,
				range: range[a],
				trials: 36
			});
		}
		protocol.start();
	}.bind(null,mode+'.'+a++));

	// layout study
	layout.study('Pitch Benchmark',options,callbacks,{},mode,back);
}