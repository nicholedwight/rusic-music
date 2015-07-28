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
	calculateNote: function(value) {
		return value; 
	},
	calculateVolume: function(value) {
		return value;
	},
	calculateFrequency: function(frequency, gain) {
		this.oscillator.frequency.value = this.calculateNote(frequency);
		this.gainNode.gain.value = this.calculateVolume(gain);
	},
	convertStringToNumber: function(string) {
		var result = "";
		for(var i = 0; i < string.length; i++) {
			result += string.charCodeAt(i).toString(10);
		}
		result = parseFloat(result.substring(0, 3) + "." + result.substring(4));
		return result;
	},
	convertStringToArray: function(string) {
		var self = this,
		    returnArray = [],
		    words = string.split(" "); // Simple word-splitting
		words.forEach(function(word, index) {
			returnArray.push(self.convertStringToNumber(word));
		});
		return returnArray;
	}
}

window.onload = function() {
	rusicMusic.init();
	rusicMusic.play();
	var frequencyArray = rusicMusic.convertStringToArray("This is really happening.");
	for(var i = 0; i < frequencyArray.length; i++) {
		setTimeout(function() {
			console.log(i, frequencyArray[i], 100);
			rusicMusic.calculateFrequency(frequencyArray[i], 100);
		}, 100 * i);
	}
}