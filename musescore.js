// AFC instance
function musescore(settings) {
	settings = settings ? settings : {};

	// defaults based on mode
	let defaults, mode = 'mode' in settings ? settings.mode : 0;
	switch (mode) {
		case 2: // melodic contour identification
			defaults = {
				adaptive: false,
				method: 'identification',
				trials: 18
			};
			break;
		case 6: // major/minor arpeggios and chords
			defaults = {
				method: 'oddball',
				trials: 20
			};
			break;
		default:
			defaults = {
				adaptive: true,
				method: 'oddball'
			};
	}
	
	// overrides
	for (let key in defaults) {
		if (!(key in settings)) {
			settings[key] = defaults[key]; 
		}
	}

	// initialize activity
	activity = new AFC(settings);
	activity.material = new Musescore(settings);
	activity.init();
}
function Musescore(settings) {

	// RG: some of these properties are obsolete
	this.ID = 'musescore';
	this.count = [3/4,1/4,1,1,1,2,3/4,1/4,1,1,1,2,3/4,1/4,1]; // just for happy birthday
	this.difference = 31;
	this.differenceList = [];
	this.evenlyPitchShifted = 0;
	this.filetype = '.mp4';
	this.image = [];
	this.instruments = ['piano','guitar']; //,,'violin','tenorsax','guitar'
	this.instrument = 0;
	this.instrumentList = [];
	this.loudness = [1,2,3,4,5]; // RG: not used, but we need a way to rove loudness
	this.mode = 0; // 0: pitch, 1: timbre, 2: mci, 3: mci adaptive, 4: octave, 5: happy octave, 6: major/minor arpeggio
	this.note = 0;
	this.notes = [];
	this.notePattern = [0,0,2,0,5,4,0,0,2,0,7,5,0,0,12]; // just for happy birthday
	this.path = 'data/musescore/library/';
	this.period = 0.5; // time between notes in instrument and melodic contour identification and tonal training
	this.practice = 0;
	this.range = [45,47]; // [45,45]; // for mode = 4 and 5, range must include at least one octave
	this.resolved = false;
	this.root = 57; // root note as midi number
	this.roots = [];
	this.sequence = [0,2,4,2,0];
	this.spacing = 2; // 1,2,4
	this.spacings = [];
	this.startmessage = 'Which note was higher in pitch?';
	this.stimuli = [];
	this.stimuli2 = [];
	this.tempo = 120;
	this.timbreMode = 0; // 0:piano, 1:each pair of notes is the same instrument, 2:randomize instrument for each pair of notes
	this.title = 'Musescore';

	// overrides
	for (let key in settings) {
		if (key in this) {
			this[key] = settings[key];
		}
	}

	// settings based on mode
	switch (this.mode) {
		case 0: // pitch resolution
			
			// settings
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.resolved = true;
			activity.message = 'Which note was higher in pitch?';
			
			break;
		case 1: // instrument identification
			
			// settings
			this.instruments = ['piano','tenor sax'];
			this.resolved = false;
			this.words = this.instruments;
			activity.message = 'Identify which instrument was played';
			activity.method = 'identification';
			
			break;
		case 2: // melodic contour identification
			
			// settings
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.resolved = false;
			this.startmessage = 'Identify the melodic contour of the five-note sequence.';
			this.words = [
				'Rising','Rising-Flat','Rising-Falling',
				'Flat-Rising','Flat','Flat-Falling',
				'Falling-Rising','Falling-Flat','Falling'
			];
			activity.alternatives = 9;
			activity.message = 'Identify the melodic contour of the five-note sequence.';
			activity.method = 'identification';
			
			break;
		case 3: // adaptive mci
			
			// settings
			this.difference = 31;
			this.evenlyPitchShifted = 1;
			this.instruments = ['piano'];
			this.patternImg = 1;
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.resolved = true;
			this.startmessage = 'Identify the melodic contour of the five-note sequence.'
			this.words = [
				'Rising','Rising-Flat','Rising-Falling',
				'Flat-Rising','Flat','Flat-Falling',
				'Falling-Rising','Falling-Flat','Falling'
			];
			activity.alternatives = 9;
			activity.message = 'Identify the melodic contour of the five-note sequence.';
			activity.method = 'identification';
			
			break;
		case 4: // octave matching
			
			// settings
			this.difference = 31;
			this.evenlyPitchShifted = 1;
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.resolved = true;
			this.startmessage = 'Identify if the octave is sharp or flat.'
			this.words = ['Sharp','Flat'];
			activity.alternatives = 2;
			activity.message = 'Identify if the octave is sharp or flat.';
			activity.method = 'identification';
			
			break;
		case 5: // happy octave
			
			// settings
			this.difference = 31;
			this.evenlyPitchShifted = 1;
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.resolved = true;
			this.startmessage = 'Identify if the octave is sharp or flat.'
			this.words = ['Sharp','Flat'];
			activity.alternatives = 2;
			activity.message = 'Identify if the last note is sharp or flat.';
			activity.method = 'identification';
			
			break;
		case 6: // majorMinor arpeggio
			
			// settings
			this.difference = 4;
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.period = 0.4;
			this.resolved = true;
			this.startmessage = 'Which arpeggio is a major triad?';
			activity.chances = Infinity;
			activity.duration = 4 * this.period;
			activity.message = 'Which arpeggio was a major triad?';
			activity.method = 'oddball';
			activity.pause = this.period;
			activity.trials = 20;
			
			break;
		case 7: // majorMinor arpeggio
			
			// settings
			this.difference = 4; // semitones
			this.instruments = ['piano'];
			this.path = 'data/musescore/library/piano/pitchshifted/';
			this.period = 0;
			this.startmessage = 'Which harmonic dyad is a major third?';
			activity.chances = Infinity;
			activity.duration = 1;
			activity.message = 'Which harmonic dyad is a major third?';
			activity.method = 'oddball';
			activity.pause = this.period;
			activity.trials = 20;
	}
	
	// overrides (in case settings override defaults based on mode)
	for (let key in settings) {
		if (key in this) {
			this[key] = settings[key];
		}
	}
}
Musescore.prototype.adapt = function () {
	// adaptive difference based on mode
	switch (this.mode) {
		case 0:
			if (activity.correct) {
				this.difference = Math.max(this.difference-1,4);
			} else {
				this.difference = Math.min(this.difference+3,34);
			}
			break;
		case 3:
		case 4:
		case 5:
			if (activity.correct) {
				this.difference = Math.max(this.difference-1,4);
			} else {
				this.difference = Math.min(this.difference+3,34);
			}
			break;
		case 6:
		case 7:
			if (activity.correct) {
				this.difference = Math.max(this.difference-1,1);
			} else {
				this.difference = Math.min(this.difference+3,16);
			}
			break;
		default:
			if (activity.correct) {
				this.difference = Math.max(this.difference - 1,1);
			} else {
				this.difference = Math.min(this.difference + 3,37);
			}
	}

	//
	switch (this.mode) {
		case 0: // pitch resolution
			message = 'Pitch Resolution: ' + Math.pow(2,((this.difference-25)/3)).toPrecision(2) + ' semitones';
			document.getElementById('score').innerHTML = message;
			break;
		case 2: // MCI
			message = 'Pitch Resolution: ' + this.spacing + ' semitones';
			document.getElementById('score').innerHTML = message;
			break;
		case 3: // adaptive MCI
			message = 'Pitch Resolution: ' + Math.pow(2,((this.difference-25)/3)).toPrecision(2) + ' semitones';
			document.getElementById('score').innerHTML = message;
			break;
		case 4: // octave
		case 5: // happy octave
			message = 'Octave is ' + Math.pow(2,((this.difference-25)/3)).toPrecision(2) + ' semitones out of tune';
			document.getElementById('score').innerHTML = message;
			break;
		// case 6: // major/minor arpeggios & chords
		// 	if (activity.calls.length == 0 ) {
		// 		message = 'Tonal Training';
		// 	} else {
		// 		message = percentCorrect(activity.calls,activity.responses).toPrecision(3) + '% correct';
		// 	}
		// 	document.getElementById('score').innerHTML = message;
	}
};
Musescore.prototype.check = function () {
	conosole.log('check')
	let dialog = layout.message(this.title,
		'In this exercise, determine which instrument is playing.'
		+'</br>Before starting, you can listen to examples '
		+'by pressing the buttons below.',
		{
			Piano: () => {
				this.note = this.range[0] + Math.floor((this.range[1]-this.range[0]-2)*Math.random());
				this.notes[0] = this.stimuli[0][this.note-this.range[0]];
				this.stimulus();
			},
			TenorSax: () => {
				this.note = this.range[0] + Math.floor((this.range[1]-this.range[0]-2)*Math.random());
				this.notes[0] = this.stimuli[1][this.note-this.range[0]];
				this.stimulus();
			},
			Okay: function () {
				jQuery(this).dialog('destroy').remove();
				activity.disabled = false;
			}
		}
	);
};
Musescore.prototype.images = function () {
	//
	if ((this.mode==2)||(this.mode==3)){
		
		//
		const spacing = 4;//typeof this.spacing == 'object' ? 4 : this.spacing;
		
		//
		let img = document.createElement('img');
		
		//
		img.style.height = 0.6 * document.getElementById('afc0').clientHeight + 'px';
		
		//
		for (let a = 0, length = this.words.length; a < length; a++) {
			img = img.cloneNode();
			img.src = 'data/musanim/MCI Piano/spacing ' + spacing + ' pattern ' + String(a+1) + '.png';
			document.getElementById('afc'+a).style.fontSize = '80%';
			document.getElementById('afc'+a).appendChild(img);
		}
	}
};
Musescore.prototype.levels = function (level) {
	
	switch (this.mode) {
		case 6:
		case 7:
			if (level < 10) {
				activity.message = activity.message + '<br>(the one that was different)';
			}
	
			//
			let range = level < 19 ? 2 : 4;
			let root = [45,57,69][(level-1)%3];
	
			//
			activity.alternatives = level < 10 ? 3 : 2;
			activity.intervals = level < 10 ? 3 : 2;
			this.range = [root-range,root+range];
			this.timbreMode = (level - 1) % 9 < 3 ? 1 : (level - 1) % 9 < 6 ? 2 : 3;
	}
}
Musescore.prototype.melody = function (count, notes, tempo) {
	let timeout = 0;

	//
	for (let a = 0; a < count.length; a++) {
		timeout = a == 0 ? a : timeout + 60/tempo*count[a-1]*1e3;
		setTimeout(()=>{processor.signal(this.notes[a])},timeout);
	}
};
Musescore.prototype.message = function (result) {
	
	switch (this.mode) {
		case 6:
			// 
			if (activity.calls.length == 0 ) { 
				message = 'Tonal Training';
			} else {
				message = activity.score.percentCorrect().toPrecision(3) + '% correct';
			}
			document.getElementById('score').innerHTML = message;
	}
	
	// message depends on activity
	return message;
};
Musescore.prototype.next = function () {
	let that = this; // extended scope

	// stimulus
	switch (this.mode) {
		case 0: // pitch resolution
			
			// roving (randomly select MIDI note from the range)
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());

			// define reference and target
			for (let a = 0; a < activity.intervals; a++) {
				
				//
				if (a == activity.call) {
					this.notes[a] = this.stimuli2[0][this.root-this.range[0]][37+this.difference];
				} else {
					this.notes[a] = this.stimuli2[0][this.root-this.range[0]][37];
				}
			}

			// RG: save the root notes to database
			this.roots.push(this.root);
			this.differenceList.push(this.difference);

			break;
		case 1: // instrument identification
			
			//
			this.note = this.range[0]+Math.floor((this.range[1]-this.range[0]-2)*Math.random());
			this.roots.push(this.note);
			this.instrument = activity.call;
			this.instrumentList.push(this.instrument);
			this.notes[0] = this.stimuli[this.instrument][this.note-this.range[0]];

			break;
		case 2: // melodic contour identification
			
			// root note
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());
			this.roots.push(this.root);
			
			// sequence
			switch (activity.call) {
				case 0: this.sequence = [-2,-1,0,1,2].map(x => x*this.spacing); break;
				case 1: this.sequence = [-2,-1,0,0,0].map(x => x*this.spacing); break;
				case 2: this.sequence = [-2,-1,0,-1,-2].map(x => x*this.spacing); break;
				case 3: this.sequence = [0,0,0,1,2].map(x => x*this.spacing); break;
				case 4: this.sequence = [0,0,0,0,0].map(x => x*this.spacing); break;
				case 5: this.sequence = [0,0,0,-1,-2].map(x => x*this.spacing); break;
				case 6: this.sequence = [2,1,0,1,2].map(x => x*this.spacing); break;
				case 7: this.sequence = [2,1,0,0,0].map(x => x*this.spacing); break;
				case 8: this.sequence = [2,1,0,-1,-2].map(x => x*this.spacing);
			}
			
			// notes
			for (let a = 0; a < 5; a++) {
				this.notes[a] = this.stimuli[0][this.root+this.sequence[a]-this.range[0]+8];
			}
			
			break;
		case 3: // adaptive mci
			
			// randomize the root note
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());
			
			// keep track of it
			this.roots.push(this.root);
			
			// keep track of the adaptive difference
			this.differenceList.push(this.difference);
			
			// sequence
			switch (activity.call) {
				case 0: this.sequence = [-2,-1,0,1,2]; break;
				case 1: this.sequence = [-2,-1,0,0,0]; break;
				case 2: this.sequence = [-2,-1,0,-1,-2]; break;
				case 3: this.sequence = [0,0,0,1,2]; break;
				case 4: this.sequence = [0,0,0,0,0]; break;
				case 5: this.sequence = [0,0,0,-1,-2]; break;
				case 6: this.sequence = [2,1,0,1,2]; break;
				case 7: this.sequence = [2,1,0,0,0]; break;
				case 8: this.sequence = [2,1,0,-1,-2];
			}
			
			// notes
			for (let a = 0; a < 5; a++) {
				if ( this.sequence[a] < 0 ) {
					this.notes[a] = this.stimuli2[0][this.root-this.range[0]][37-this.difference-(3*(Math.abs(this.sequence[a])-1))];
				} else if (this.sequence[a]==0) {
					this.notes[a] = this.stimuli2[0][this.root-this.range[0]][37];
				} else {
					this.notes[a] = this.stimuli2[0][this.root-this.range[0]][37+this.difference+(3*(Math.abs(this.sequence[a])-1))];
				}
			}
			
			break;
		case 4: // octave matching
			
			// randomize the root note
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());
			
			// keep track of root note
			this.roots.push(this.root);
						
			// keep track of the adaptive difference
			this.differenceList.push(this.difference);

			// the root note
			this.notes[0] = this.stimuli[0][this.root-this.range[0]];
			
			// the comparison note
			if (activity.call == 0) {
				this.notes[1] = this.stimuli2[0][this.root-this.range[0]][37+this.difference]
			} else {
				this.notes[1] = this.stimuli2[0][this.root-this.range[0]][37-this.difference]
			}

			break;
		case 5: // happy octave
			
			// randomize the root note
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());
			this.roots.push(this.root);

			//
			this.differenceList.push(this.difference);
			
			//
			for (let a = 0; a < this.notePattern.length; a++) {
				if (this.notePattern[a] == 12) {
					if (activity.call == 0) {
						this.notes[a] = this.stimuli2[0][this.root - this.range[0]][37+this.difference];
					} else {
						this.notes[a] = this.stimuli2[0][this.root - this.range[0]][37-this.difference];
					}
				} else {
					this.notes[a] = this.stimuli[0][this.root - this.range[0] + this.notePattern[a]];
				}
			}
			
			break;
		case 6: // majorMinor
		case 7:
			
			// This mode is an oddball procedure in that the listener hears n intervals with one 
			// of the intervals being the correct answer.
			
			// root note
			this.root = this.range[0] + Math.round((this.range[1]-this.range[0]) * Math.random());
			this.roots.push(this.root);
			
			// adjust for extended note range
			let root = this.root + 12;
			
			//
			let direction;
			switch (this.timbreMode) {
				case 1: direction = 1; break;
				case 2: direction =-1; break;
				case 3: direction = 2 * Math.round(Math.random()) - 1;
			}
						
			// notes
			for (let a = 0; a < activity.intervals; a++) {
				
				// initialize
				this.notes[a] = [];
				
				// build notes into array
				if (a == activity.call) {
					
					// major
					this.notes[a][0] = this.stimuli[0][root-this.range[0]];
					this.notes[a][1] = this.stimuli[0][root-this.range[0]+4];
					this.notes[a][2] = this.stimuli[0][root-this.range[0]+7];
					
				} else {
					
					// other
					this.notes[a][0] = this.stimuli[0][root-this.range[0]];
					this.notes[a][1] = this.stimuli[0][root-this.range[0]+4+direction*this.difference];
					this.notes[a][2] = this.stimuli[0][root-this.range[0]+7];
					
				}
			}
	}
};
Musescore.prototype.octave = function () {
	let that = this; // extended scope

	let dialog = layout.message(this.title,
		'In this exercise, determine if the octave is sharp or flat.'
		+'</br>Before starting, you can listen to examples '
		+'by pressing the buttons below.',
		{
			Octave: ()=>{
				this.notes[0] = this.stimuli[0][0];
				this.notes[1] = this.stimuli2[0][0][37]
				this.stimulus();
			},
			Sharp: ()=>{
				let jitter = Math.floor(Math.random()*12);
				this.notes[0] = this.stimuli[0][0];
				this.notes[1] = this.stimuli2[0][0][37+(jitter+22)]
				this.stimulus();
			},
			Flat: ()=>{
				let jitter = Math.floor(Math.random()*12);
				this.notes[0] = this.stimuli[0][0];
				this.notes[1] = this.stimuli2[0][0][37-(jitter+22)]
				this.stimulus();
			},
			Okay: function () {
				jQuery(this).dialog('destroy').remove();
				activity.disabled = false;
			}
		}
	);
};
Musescore.prototype.preload = function () {
	let that = this; // extended scope

	//
	activity.ready++;

	// disable start
	jQuery(".ui-dialog-buttonpane button:contains('Okay')").button('disable');
	jQuery(".ui-dialog-content button:contains('+')").button('disable');
	jQuery(".ui-dialog-content button:contains('-')").button('disable');
	jQuery(".ui-dialog-buttonpane #message").html('Please wait, preparing test...&nbsp;');

	// load audio function
	let counter = 0;
	function loadAudio(a,b,c,d,root) {

		// initialize request
		let request = new XMLHttpRequest(), url;

		// audio url 
		url = that.path + that.instruments[a] + '_' + root + '_' + c + d + that.filetype;
		
		// request audio
		request.a = a; request.b = b; request.c = c; // extended scope
		request.open('GET',url,true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			
			// decode audio
			audio.decodeAudioData(request.response, function (incomingBuffer) {

				// dimension of stimuli array depends on mode
				that.stimuli[request.a][request.b] = incomingBuffer;

				// check if ready
				if (++counter == (that.range[1]-that.range[0]+1)*that.instruments.length) {
					activity.ready--;
					if (activity.ready == 0) {
						
						// load stimuli into notes array
						for (let a = 0; a < activity.intervals; a++) {
							that.notes[a] = that.stimuli[0][0];
						}
						
						// enable controls
						jQuery('.ui-dialog-buttonpane #message').html('Ready.&nbsp;');
						jQuery(".ui-dialog-buttonpane button:contains('Okay')").button('enable');
						jQuery(".ui-dialog-content button:contains('+')").button('enable');
						jQuery(".ui-dialog-content button:contains('-')").button('enable');
					}
				}
			});
		};
		request.send();
	}

	// preloading microtones
	function loadAudio2(a,b,c,d,root) {

		// initialize request
		let request = new XMLHttpRequest(), url;

		// audio url 
		url = that.path + that.instruments[a] + '_' + root + '_' + Math.abs(c-37) + d + that.filetype;
		
		// request audio
		request.a = a; request.b = b; request.c = c; // extended scope
		request.open('GET',url,true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			
			// decode audio
			audio.decodeAudioData(request.response, function (incomingBuffer) {
				
				// dimension of stimuli array depends on mode
				that.stimuli2[request.a][request.b][request.c] = incomingBuffer;
				
				// check if ready
				if (++counter == ((that.range[1]-that.range[0]+1)+(that.instruments.length*37*2))) {
					//
					activity.ready--;
					if (activity.ready == 0) {
						for (let a = 0; a < activity.intervals; a++) {
							
							// load stimuli into notes array
							that.notes[a] = that.stimuli2[0][0][0];
							
							// enable controls
							jQuery('.ui-dialog-buttonpane #message').html('Ready.&nbsp;');
							jQuery(".ui-dialog-buttonpane button:contains('Okay')").button('enable');
							jQuery(".ui-dialog-content button:contains('+')").button('enable');
							jQuery(".ui-dialog-content button:contains('-')").button('enable');
						}
					}
				}
			});
		};
		request.send();
	}

	// load audio
	let extraNotes1 = 0;
	let extraNotes2 = 0;
	if (this.mode == 2) {
		extraNotes1 = 8;
		extraNotes2 = 8;
	} else if (this.mode == 5) {
		extraNotes2 = 12;
	} else if (this.mode == 6) {
		extraNotes1 = 12;
		extraNotes2 = 19;
	}
	let B0 = this.range[0] - extraNotes1;
	let B1 = this.range[1] + extraNotes2;
	
	// loop through instruments
	for (let a = 0; a < this.instruments.length; a++) {
		
		// initialize stimuli
		this.stimuli[a] = [];
		this.stimuli2[a] = [];
		
		// loop through pitch range
		for (let b = 0; b <= (B1-B0); b++) {
			
			// root note
			let root = B0 + b;
			
			// load audio
			switch (this.mode) {
				case 0: // pitch resolution
					
					//
					this.stimuli2[a][b] = [];
					
					//
					for (let c = 0; c <= 74; c++) {
						
						//
						//this.stimuli2[a][b][c] = [];
						
						//
						let dir = '';
						if (c < 37) { dir = '_n' };
						loadAudio2(a,b,c,dir,root);
					}

					break;
				case 1: // timbre
					loadAudio(a,b,undefined,undefined,root,0);
					break;
				case 2: // mci
					this.stimuli[a][b] = [];
					loadAudio(a,b,0,'',root);
					break;
				case 3: // mci adaptive
					this.stimuli2[a][b] = [];
					for (let c = 0; c <= 74; c++) {
						this.stimuli2[a][b][c] = [];
						let dir = '';
						if (c<36) {dir = '_n'};
						loadAudio2(a,b,c,dir,root);
					}		
					break;
				case 4: // octave
					this.stimuli[a][b] = [];
					this.stimuli2[a][b] = [];
					loadAudio(a,b,0,'',root);
					
					for (let c = 0; c <= 74; c++) {
						this.stimuli2[a][b][c] = [];
						let dir = '';
						if (c<36) {dir = '_n'};
						loadAudio2(a,b,c,dir,root+12);
					}		
					
					break;
				case 5: // happy octave
					this.stimuli[a][b] = [];
					this.stimuli2[a][b] = [];
					loadAudio(a,b,0,'',root);
					
					for (let c = 0; c <= 74; c++) {
						this.stimuli2[a][b][c] = [];
						let dir = '';
						if (c<36) {dir = '_n'};
						loadAudio2(a,b,c,dir,root+12);
					}		

					break;
				case 6: // major minor arpeggio
				case 7:
					this.stimuli[a][b] = [];	
					loadAudio(a,b,0,'',root);
			}
		}
	}
	
	// store globally
	materials.musescore = this.stimuli;
	materials.musescore2 = this.stimuli2;
};
Musescore.prototype.protocols = function (options, callbacks, messages) {
	let that = this; // extended scope

	// protocols based on activity
	switch (this.mode) {
		case 0://pitch resolution
			options.push(
				'Pitch Resolution from A2 to A4', // 110 to 440 Hz
				'Pitch Resolution from A5 to A7' // 880 to 3520 Hz
			);
			callbacks.push(
				() => {
					protocol.activity = this.ID;
					protocol.random = false;
					protocol.settings = [];
					const range = [[43,47],[55,59],[67,71]];
					for (let a = 0; a < range.length; a++) {
						protocol.settings.push({
							range: range[a],
							volume: true
						});
					}
					protocol.start();
				},
				//this is the one i made to make the pitches higher 
				() => {
					protocol.activity = this.ID;
					protocol.random = false;
					protocol.settings = [];
					const range = [[79,83],[91,95],[103,107]];
					for (let a = 0; a < range.length; a++) {
						protocol.settings.push({
							range: range[a],
							volume: true
						});
					}
					protocol.start();
				}
			);
			break;

	    case 5: // perfect fifth major intervals
	        options.push(
	            'Perfect Fifth Interval from C3 to C5' // 130.81 to 523.25 Hz
	        );
	        callbacks.push(
	            () => {
	                protocol.activity = this.ID;
	                protocol.random = false;
	                protocol.settings = [];
	                const range = [[48, 55], [60, 67], [72, 79]]; // MIDI numbers for perfect fifths
	                for (let a = 0; a < range.length; a++) {
	                    protocol.settings.push({
	                        range: range[a],
	                        volume: true
	                    });
	                }
	                protocol.start();
	            }
	        );
	        break;
		case 1://frequency discrimination
			options.push(
				'Frequency Discrimination between 2 and 5 kHz'
			);
			callbacks.push(
				function () {
					protocol = new Protocol();
					protocol.activity = 'percept';
					protocol.callback = () => { activity.menu(); };
					protocol.ID = 'percept.0';
					const f1 = [2e3,3e3,4e3,5e3];
					for (let a = 0; a < f1.length; a++) {
						protocol.settings.push({
							activity: 1,
							f1: f1[a],
							volume: true
						});
					}
					protocol.random = false;
					protocol.start();
				}
			);
			break;
		case 2://f0 discrimination
			options.push(
				'F0 Discrimination at 110, 220, 440 Hz'
			);
			callbacks.push(
				function () {
					protocol.activity = 'percept';
					protocol.settings = [];
					var f0 = [110,220,440];
					for (var a = 0; a < f0.length; a++) {
						protocol.settings[a] = {
							material: new Percept({
								activity: that.activity,
								f0: f0[a],
								f1: 1000,
								mode: that.mode
							}),
						};
					}
					protocol.start(3);
				}
			);
			messages.push('');
			break;
		case 3://intensity discrimination
			options.push(
				that.mode == 0
				? 'Loudness Discrimination at 500, 1000, 2000 Hz'
				: 'Loudness Discrimination at 110, 220, 440 Hz'
			);
			callbacks.push(
				function () {
					var f0 = that.mode == 0 ? [0] : [110,220,440],
						f1 = that.mode == 0 ? [500,1000,2000] : [1000],
						i = 0;

					protocol.activity = 'percept';
					protocol.settings = [];
					for (var a = 0; a < f0.length; a++) {
						for (var b = 0; b < f1.length; b++) {
							protocol.settings[i++] = {
								material: new Percept({
									activity: that.activity,
									f0: f0[a],
									f1: f1[b],
									mode: that.mode
								}),
							};
						}
					}
					protocol.start();
				}
			);
			messages.push('');
			break;
		case 4://modulation detection
			options.push(
				'Modulation Detection at 10, 110, 220, 440 Hz'
			);
			callbacks.push(
				function() {
					protocol.activity = 'percept';
					protocol.random = false;
					protocol.settings = [];
					var f0 = [10,110,220,440];
					for (var a = 0; a < f0.length; a++) {
						protocol.settings[a] = {
							alternatives: 3,
							material: new Percept({
								activity: that.activity,
								f0: f0[a],
								f1: 1000,
								mode: 0
							})
						};
					}
					protocol.start();
				}
			);
			messages.push('');
	}
	return [options,callbacks,messages];
};
Musescore.prototype.results = function (data) {

	// parse results
	results = jQuery.parseJSON(data);
	results.sort(compare);
	
	// no results
	if (results.length == 0) {
		main.insertAdjacentHTML('beforeend','No results.');
		return;
	}

	// summary chart
	var resultsSorted = [];
	var summary = document.createElement('div');
	summary.style.height = '50%';
	main.appendChild(summary);

	// details
	main.insertAdjacentHTML('beforeend','<h3>History</h3>');

	// horizontal rule
	main.insertAdjacentHTML('beforeend','<hr class=\'ui-widget-header\'>');

	// accordion (init)
	var accordion = document.createElement('div');
	accordion.id = 'results';
	main.appendChild(accordion);

	// accordion (content)
	var scaleType = (this.difference.rule == 'linear') ? 'linear' : 'log';
	for (let item = 0, items = results.length; item < items; item++) {
		var result = results[item];
		
		//
		if(!result.differenceList){continue}

		// threshold
		var series = result.differenceList.split(','),
			threshold = Number(series[series.length-1]);//last value
		result.difference = threshold;

		// condition
		var condition = [2,4].indexOf(this.activity) > -1 ? result.f0 : result.f1;

		// heading
		var heading = document.createElement('h3');
		heading.innerHTML = this.message(result);
		accordion.appendChild(heading);

		// container
		var container = document.createElement('div');
		accordion.appendChild(container);

		// information
		container.insertAdjacentHTML('beforeend','Hello ' + result['subuser'] +'! Here is your adaptive track for this run:');

		for (var key in result) {
			//container.insertAdjacentHTML('beforeend',key+': '+result[key]+'<br>');
		}
		container.setAttribute('unselectable','off');

		// chart into container
		var chart_div = document.createElement('div');
		chart_div.style.width = '80%';
		container.appendChild(chart_div);

		// adaptive track
		var data = [];
		data[0] = ['Trial','Adaptive Variable'];
		var series = result.differenceList.split(',');
		for (var a = 1; a <= series.length; a++) {
			data[a] = [a, Number(series[a-1])];
		}

		// adaptive variable versus trial
		var chart = new google.visualization.LineChart(chart_div),
			data = google.visualization.arrayToDataTable(data);
		chart.draw(data, {
				chartArea: {height: '50%', width: '70%'},
				hAxis: {title: 'Trial'},
				legend: {position: 'none'},
				title: 'Adaptive Series',
				vAxis: {scaleType: 'linear', title: 'Adaptive Variable'}
		});

		// sort results for summary plot
		resultsSorted.push([Number(condition),Number(threshold)]);
	}

	// accordion (activate)
	jQuery(accordion).accordion({
		active: false,
		collapsible: true,
		heightStyle: 'content'
	});

	// summary chart
	var data = [],
		title = 'Detection Thresholds',
		xdata = 'Frequency',
		xlabel = 'Frequency (Hz)',
		ydata = 'Detection Threshold',
		ylabel = 'Detection Threshold (dB)',
		yscale = 'linear';

	//
	switch (this.activity) {
		case 1:	
			title = 'Frequency Resolution';
			ydata = 'Discrimination Threshold';
			ylabel = ydata + ' (%)';
			break;
		case 2:
		case 5:
			title = 'F0 Resolution';
			ydata = 'Discrimination Threshold';
			ylabel = ydata + ' (%)';
			break;
		case 3:
			title = 'Intensity Discrimination';
			ydata = 'Discrimination Threshold';
			ylabel = ydata + '(dB)';
			break;
		case 4:
			title = 'Modulation Detection';
			ylabel = 'Detection Thresholds (%)';
	}

	// activity configuration
	var vAxis = (this.activity == 0)
		? {
			maxValue: 60,
			minValue: -20,
			scaleType: yscale,
			ticks: [-20,0,20,40,60],
			title: ylabel,
			viewWindow: {
				max: 60,
				min: -20
			}
		} : {
			scaleType: yscale,
			title: ylabel,
		};

	// draw the chart
	var data; data[0] = [xdata,ydata];
	for (let a = 0; a < resultsSorted.length; a++) { data.push(resultsSorted[a]); }
	var data = google.visualization.arrayToDataTable(data);
	var chart = new google.visualization.ScatterChart(summary);
	chart.draw(data,{
		chartArea: {width:'80%'},
		hAxis: {
			logScale: false,
			maxValue: 16000,
			minValue: 100,
			textStyle : {
				fontSize: 24 // or the number you want
			},
			ticks: [
				{v:125, f:''},
				{v:250, f:'250'},
				{v:500, f:''},
				{v:1000, f:'1000'},
				{v:2000, f:''},
				{v:4000, f:'4000'},
				{v:8000, f:''},
				{v:16000, f:'16000'}
			],
			title: 'Frequency (Hz)',
			titleTextStyle: {
				fontSize: 48
			}
		},
		legend: {position: 'none'},
		title: title,
		vAxis: vAxis
	});
};
Musescore.prototype.save = function (data) {
	data.roots = this.roots.join(',');
	data.instrumentList = this.instrumentList.join(',');
	data.differenceList = this.differenceList.join(',');
	data.mode = this.mode;
	data.spacings = this.spacings.join(',');
	return data;
};
Musescore.prototype.select = function () {
	if (this.mode == 2) {
		if (typeof this.available === 'undefined' || this.available.length == 0) {
			this.available = [];
			this.available.sequence(this.words.length);
			this.available.shuffle();
		}
		return this.available.pop();
	} else {
		return Math.floor(activity.alternatives*Math.random());
	}
};
Musescore.prototype.settings = function() {
	let that = this;

	// main
	let main = layout.main(
		'Settings',
		() => { this.menu(); },
		{ Test: () => { loadrunner('musescore'); } }
	);

	// settings table
	var table = document.createElement('table');
	table.className = 'ui-widget-content';
	table.style.fontSize = '80%';
	table.style.width = '100%';
	main.appendChild(table);
	var rowIndex = -1;

	// stimulus mode
	var row = table.insertRow(++rowIndex);
	row.style.width = '100%';
	var cell = row.insertCell(0);
	cell.innerHTML = 'Stimulus mode:';
	cell.style.textAlign = 'right';
	cell.style.width = '40%';
	var cell = row.insertCell(1);
	cell.style.width = '40%';
	var select = layout.select(['Pitch Discrimination','Instrument Identification','Melodic Contour Identification','Adaptive Melodic Contour Identification','Octave Matching Without Preceding Melody','Octave Matching With Preceding Melody','Major Minor Arpeggio']);
	select.onchange = function () {
		that.mode = this.selectedIndex;
	};
	cell.appendChild(select)
	if (widgetUI) { jQuery(select).selectmenu({change:select.onchange}); }
	var cell = row.insertCell(2);
	cell.style.width = '20%';

	// notes
	var row = table.insertRow(++rowIndex);
	row.style.width = '100%';
	var cell = row.insertCell(0);
	cell.innerHTML = 'Notes:';
	cell.style.textAlign = 'right';
	cell.style.width = '40%';
	var cell = row.insertCell(1);
	cell.style.width = '40%';
	var input = document.createElement('input');
	input.onblur = function () { that.notes = this.value; };
	input.style.width = '100%';
	if (widgetUI) {
		input.style.textAlign = 'left';
		jQuery(input).button();
	}
	cell.appendChild(input);
	var cell = row.insertCell(2);
	cell.style.width = '20%';

	// practice mode
	var row = table.insertRow(++rowIndex);
	row.style.width = '100%';
	var cell = row.insertCell(0);
	cell.innerHTML = 'Practice mode:';
	cell.style.textAlign = 'right';
	cell.style.width = '40%';
	var cell = row.insertCell(1);
	cell.style.width = '40%';
	var select = layout.select(['Off','On']);
	select.onchange = function () { that.practice = this.value == 'On'; };
	select.value = this.practice ? 'On' : 'Off';
	cell.appendChild(select);
	if (widgetUI) { jQuery(select).selectmenu({change:select.onchange}); }
	var cell = row.insertCell(2);
	cell.style.width = '20%';

	/*

	// instrument
	var row = table.insertRow(++rowIndex);
	row.style.width = '100%';
	var cell = row.insertCell(0);
	cell.innerHTML = 'Instrument:';
	cell.style.textAlign = 'right';
	cell.style.width = '40%';
	var cell = row.insertCell(1);
	cell.style.width = '40%';
	var select = layout.select(['Piano','Guitar','Violin','Tenor Sax']);
	select.onchange = function () {
		that.instrument = that.instruments.indexOf(this.value)
	};
	//select.value = this.instrument;
	cell.appendChild(select);
	if (widgetUI) { jQuery(select).selectmenu({change:select.onchange}); }
	var cell = row.insertCell(2);
	cell.style.width = '20%';

	// help message
	help = layout.help(
		'Practice Mode',
		'Practice mode allows the user to practice after missing an item.'
	);
	cell.appendChild(help);

	// Intervals
	var input = layout.input(this.intervals);
	input.onblur = function() {
		var values = this.value.split(',');
		for( let a = 0; a < values.length; a++) {
			values[a] = Number(values[a]);
		}
		that.intervals = values;
	};
	layoutTableRow(table,++rowIndex,'Intervals:',input,'semitones');

	*/

	// footer
	layout.footer();
};
Musescore.prototype.special = function () {
	let that = this;
	
	// // special method called by AFC before test
	// switch (this.mode) {
	// 	case 1: this.check(); break;
	// 	case 4: this.octave(); break;
	// 	case 6:
	// 		// check database for highest level
	// 		jQuery.ajax({
	// 			data: {
	// 				method: 'highscore',
	// 				subuser: subuser.ID,
	// 				user: user.ID
	// 			},
	// 			error: function (jqXHR, textStatus, errorThrown) {
	// 				alert(errorThrown);
	// 				that.level = 0;
	// 				that.test();
	// 			},
	// 			success: function (data, status) {
	// 				data = jQuery.parseJSON(data);
	// 				that.level =  data.length == 0 ? 0 : data[0].level+1;
	// 				that.test();
	// 				jQuery(dialog).dialog('destroy').remove();
	// 			},
	// 			type: 'GET',
	// 			url: 'version/'+version+'/php/musescore.php'
	// 		});
	// }
};
Musescore.prototype.stimulus = function(index, init) {
	index = index ? index : 0;

	// stimulus based on mode
	switch (this.mode) {
		case 0: // pitch	
			//
			if (typeof init == 'undefined') {
				processor.signal(this.stimuli2[0][0][0])
			} else {
				processor.signal(this.notes[index])
			};
			
			break;
		case 1: // timbre		
			//
			processor.signal(this.notes[index])
			
			break;
		case 2: // mci		
			//
			if (typeof init == 'undefined'){
				processor.signal(this.stimuli[0][0])
			} else {
				for (let a = 0; a < 5; a++) {
					setTimeout(()=>{processor.signal(this.notes[a])},(1e3*a*this.period));
				}
			}
			
			break;
		case 3: // mci adaptive	
			//
			if (typeof init == 'undefined'){
				for (let a = 0; a < 5; a++) {
					setTimeout(()=>{processor.signal(this.stimuli2[0][0][0])},(1e3*a*this.period));
				}
			} else {
				for (let a = 0; a < 5; a++) {
					setTimeout(()=>{processor.signal(this.notes[a])},(1e3*a*this.period));
				}
			}

			break;
		case 4: // octave	
			//
			for (let a = 0; a < activity.intervals; a++) {
				setTimeout(()=>{processor.signal(this.notes[a])},(1e3*a*this.period));
			}
			
			break;
		case 5: // happy octave	

			if (typeof init == 'undefined') {
				processor.signal(this.stimuli[0][0])
			} else {
				this.melody(this.count,this.notes,this.tempo)
			}
			
			break;
		case 6: // major vs minor arpeggios
			//
			if (typeof init == 'undefined') {
				processor.signal(this.stimuli[0][0])
			} else {
				processor.signal(this.notes[index][0])
				setTimeout(()=>{processor.signal(this.notes[index][1],undefined,undefined,0)},this.period*1e3);
				setTimeout(()=>{processor.signal(this.notes[index][2],undefined,undefined,0)},2*this.period*1e3);
			}
			
			break;
		case 7: // major vs minor arpeggios
			//
			if (typeof init == 'undefined') {
				processor.signal(this.stimuli[0][0])
			} else {
				processor.signal(this.notes[index][0])
				setTimeout(()=>{processor.signal(this.notes[index][1],undefined,undefined,0)},this.period*1e3);
				// setTimeout(()=>{processor.signal(this.notes[index][2],undefined,undefined,0)},2*this.period*1e3);
			}
	}
};