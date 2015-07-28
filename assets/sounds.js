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
	}
}

window.onload = function() {
	rusicMusic.init();
	rusicMusic.play();

	var string = "This is really happening.";
	var words = string.split(" ");
	var frequencyArray = rusicMusic.convertStringToFrequencyArray(string);
	var volumeArray = rusicMusic.convertStringToVolumeArray(string);
	for(var i = 0; i < words.length; i++) {
		setTimeout(function() {
			console.log(i, frequencyArray[i], 100);
			rusicMusic.calculateFrequency(frequencyArray[i], 100);
		}, 100 * i);
	}
}