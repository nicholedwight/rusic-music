// var data = [];
// for(var i = 0; i < 50000; i++) {
// 	data[i] = Math.round(255 * Math.random());
// }
// var wave = new RIFFWAVE(data);
// wave.header.sampleRate = 220000;
// var audio = new Audio(wave.dataURI);
// audio.play();

/*
 * We used this: http://codepen.io/matt-west/pen/lAFnx
 */

rusicMusic = {
	audioContext: {},
	oscillator: {},
	gainNode: {},
	init: function() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new window.AudioContext();
	},
	play: function(e) {
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = "triangle";
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.oscillator.connect(this.gainNode);
		this.oscillator.start(0);
	},
	stop: function(event) {
		this.oscillator.stop(0);
	},
	calculateFrequency: function(frequency, gain) {
		this.oscillator.frequency.value = frequency;
		this.gainNode.gain.value = gain * 50;
	},
	convertStringToNumber: function(string) {
		var result = "";
		for(var i = 0; i < string.length; i++) {
			result += string.charCodeAt(i).toString(10);
		}
		result = parseFloat(result.substring(0, 3) + "." + result.substring(4));
		return result;
	},
	convertStringToFrequencyArray: function(string) {
		var self = this,
		    returnArray = [],
		    words = string.split(" ");
		words.forEach(function(word, index) {
			returnArray.push(self.convertStringToNumber(word));
		});
		return returnArray;
	},
	convertStringToVolumeArray: function(string) {
		var self = this,
		    returnArray = [],
		    words = string.split(" ");
		words.forEach(function(word, index) {
			returnArray.push(word.length * 50);
		});
		return returnArray;
	},
	doTheLoopDammit: function(i, frequencyArray, volumeArray) {
	 setTimeout(function() {
			console.log(i, frequencyArray[i], volumeArray[i]);
			rusicMusic.calculateFrequency(frequencyArray[i], volumeArray[i]);
			if (i === (frequencyArray.length - 1)) {
				console.log('stopping');
				rusicMusic.stop();
			}
		}, 1000 * i);
	 }
}

$('#muzak').on('click', function() {
	console.log('whut');
	rusicMusic.init();
	rusicMusic.play();

	var content = $('.list-group .list-group-item-text').eq(0);
	content = content.text();
	console.log(content);

	var frequencyArray = rusicMusic.convertStringToFrequencyArray(content);
	var volumeArray = rusicMusic.convertStringToVolumeArray(content);

	for(var i = 0; i < frequencyArray.length; i++) {
		rusicMusic.doTheLoopDammit(i, frequencyArray, volumeArray);
	}
});
