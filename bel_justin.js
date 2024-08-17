//testing pattern (justin)
function assignment(back) {
	back = back ? back : () => { layout.dashboard(); };

	// initialize
	const mode = 'bel_justin';
	let a = 0, callbacks = [], options = [];

	// Loudness Levels
	options.push('Beginning Sound Check');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.protocol = id;
		gui.loudness(false,880);
	}.bind(null,mode+'.'+a++));
	
	// Pitch Resolution for Piano Notes (A2, A3, A4)
	//first
	options.push('Piano Notes High Pitch(A2, A3, A4)');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'musescore';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		// const range = [[39,51],[51,63],[63,75]], f0 = [110,220,440];
		const range = [[79,83],[91,95],[103,107]], f0 = [110,220,440];
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
	
	// Pitch Resolution for Piano Notes (A2, A3, A4)
	//second
	options.push('Perfect Fifth Trainer(A2, A3, A4)');
	callbacks.push(function(id){
		protocol = new Protocol();
		protocol.activity = 'musescore';
		protocol.callback = () => { assignment(); };
		protocol.protocol = id;
		// const range = [[39,51],[51,63],[63,75]], f0 = [110,220,440];
		const range = [[48, 55], [60, 67], [72, 79]],f0 = [130.81, 261.63, 523.25];
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
	layout.study('Piano Music Tester',options,callbacks,{},mode,back);
}