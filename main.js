$(document).ready(function(){
	//dicitonary that converts key press to musical note
	const keyToNote = {65: 'C4', 83: 'D4', 68: 'E4', 70: 'F4', 71: 'G4', 72: 'A4', 74: 'B4', 75: 'C5', 76: 'D5', 87:'C#4', 69:'D#4', 84:'F#4', 89:'G#4', 85:'A#4', 79:'C#5'};  

	//dicitonary that converts number to correct synth
	const intToSynth = {4: Tone.AMSynth, 5:Tone.FMSynth, 6:Tone.MetalSynth, 7:Tone.DuoSynth, 8:Tone.MembraneSynth};

	//synth properties
	var release = .01;
	var volume = 1;

	//initial instrument is piano
	var synth = new Tone.Sampler({
		urls: {
			"C4": "C4.mp3",
			"D#4": "Ds4.mp3",
			"F#4": "Fs4.mp3",
			"A4": "A4.mp3",
		},
		release: 1,
		baseUrl: "https://tonejs.github.io/audio/salamander/",
	}).toDestination();
	
	Tone.loaded().then(() => {
		console.log('sample loaded');
	})

	const gain = new Tone.Gain(0).toDestination();
	synth.connect(gain);

	//other variables
	var on = true;

	//plays a single note
	function playNote(note){
		synth.triggerAttack(note);
	};

	//stops playing a single note, does not stop piano notes
	function stopeNote(note){
		// if(document.querySelector(".synthConverter.active").id == 's1' || document.querySelector(".synthConverter.active").id == 's2'){}
		// else{
			synth.triggerRelease(note, `+${release}`);
		
	}

	//this function changes the instrument based of off html id
	function changeSynth(new_synth){
		//Sets piano
		if(new_synth==1){
			synth = new Tone.Sampler({
				urls: {
					"C4": "C4.mp3",
					"D#4": "Ds4.mp3",
					"F#4": "Fs4.mp3",
					"A4": "A4.mp3",
				},
				release: 1,
				baseUrl: "https://tonejs.github.io/audio/salamander/",
			}).toDestination();
			
			Tone.loaded().then(() => {
				console.log('Piano loaded');
			})
			console.log(`changed to: Instrument ${new_synth}`);
			synth.connect(gain);
		}
		//sharp Synth
		else if(new_synth == 2){
			synth = new Tone.Sampler({
				urls: {
					A1: "A1.mp3",
					A2: "A2.mp3",
				},
				baseUrl: "https://tonejs.github.io/audio/casio/"
			}).toDestination();
			
			Tone.loaded().then(() => {
				console.log('Piano loaded');
			})
			console.log(`changed to: Instrument ${new_synth}`);
			synth.connect(gain);
		}
		//basic synth
		else if(new_synth == 3){
			synth = new Tone.PolySynth().toDestination();
			console.log(`changed to: Instrument ${new_synth}`);
			synth.connect(gain);
		}
		//all other synths
		else{
			synth = new Tone.PolySynth(intToSynth[new_synth]).toDestination(); 
			console.log(`changed to: Instrument ${new_synth}`);
			synth.connect(gain);
		}
		//makes correct intrument button active
		document.querySelector(".synthConverter.active").classList.remove("active");
		document.querySelector('#s'+`${new_synth}`).classList.add("active");
	}

	//on off button 
	$('.pwr-btn').on('click', function(){
		if(!on){
			on = true;
			$('.pwr-btn').addClass('on');
			console.log('Synth is on');
			return;
		}
		if(on){
			on = false;
			$('.pwr-btn').removeClass('on');
			console.log('Synth is off');
			return;
		}
	});

	//plays correct note based on key press using dictionary converter	
	$(document).keydown(function(event){
		if(!event.originalEvent.repeat){
			if(on){
				playNote(keyToNote[event.which]); 
				keyId = `${keyToNote[event.which]}`.replace('#', 'S')
				document.querySelector(`#${keyId}`).classList.add('pressed');
			}
		}
	});

	//stops correct note when key is lifted
	$(document).keyup(function() {
		if(on){stopeNote(keyToNote[event.which]);
			keyId = `${keyToNote[event.which]}`.replace('#', 'S')
			$(`#${keyId}`).removeClass('pressed');}
	});

	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

	if(isTouch)
	{
		//key pressing accounting for mouse and touchscreen presses
		$('.key').on('touchstart', function(){
			if(on){
				var key = $(this).attr('id').replace('S', '#');
				playNote(key);
				keyId = key.replace('#', 'S')
				document.querySelector(`#${keyId}`).classList.add('pressed');
			}
		});

		$('.key').on('touchend', function(){
			if(on){
				var key = $(this).attr('id').replace('S', '#');
				stopeNote(key);
				keyId = key.replace('#', 'S')
				document.querySelector(`#${keyId}`).classList.remove('pressed');
			}
		});
	}
	else
	{
		//key pressing accounting for mouse and touchscreen presses
		$('.key').on('mousedown', function(){
			if(on){
				var key = $(this).attr('id').replace('S', '#');
				playNote(key);
				keyId = key.replace('#', 'S')
				document.querySelector(`#${keyId}`).classList.add('pressed');
			}
		});

		$('.key').on('mouseup', function(){
			if(on){
				var key = $(this).attr('id').replace('S', '#');
				stopeNote(key);
				keyId = key.replace('#', 'S')
				document.querySelector(`#${keyId}`).classList.remove('pressed');
			}
		});
	}

	//sets release value
	document.querySelector('#releaseSlider').oninput = (function(){
		if((this.value)/100 > 0){release = (this.value)/100;}
		else{release = .001};
		$('#releaseT').html('Release: ' + release);
	});

	//sets volume value
	document.querySelector('#volumeSlider').oninput = (function(){
		if((this.value)/100 > 0){volume = (this.value)/100;}
		else{volume = .001};
		$('#volumeT').html('Volume: ' + volume);
		gain.gain.rampTo(volume);
	});

	//allows functionality for intruments selector buttons
	$('.synthConverter').on('click', function(){
		synth = $(this).attr('id').replace('s','')
		changeSynth(synth);
	});
});