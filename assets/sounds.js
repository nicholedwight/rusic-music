/*
 * With snippets o' this: http://codepen.io/matt-west/pen/lAFnx
 */

rusicMusic = {
	audioContext: {},
	oscillator: {},
	gainNode: {},
	init: function() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new window.AudioContext();
		this.oscillator = this.audioContext.createOscillator();
		this.oscillator.type = "sine";
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.oscillator.connect(this.gainNode);
		this.oscillator.start(0);
		this.silence();
	},
	play: function() {
		this.audioContext.resume();
	},
	stop: function() {
		this.audioContext.suspend();
	},
	silence: function() {
		this.oscillator.frequency.value = 0;
		this.gainNode.gain.value = 0;
	},
	calculateFrequency: function(frequency, gain) {
		this.oscillator.frequency.value = frequency;
		this.gainNode.gain.value = gain;
		console.log(frequency, gain);
	},
	convertStringToNumber: function(string) {
		var result = 0;
		for(var i = 0; i < string.length; i++) {
			result = result + parseInt(string.charCodeAt(i).toString(10));
		}
		result = ((parseFloat(result) / 1000.000) * 800) + 200; // 1000 (nice limit); 800 (Hertz range); 200 (Hertz offset)
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
			returnArray.push(word.length / 10);
		});
		return returnArray;
	},
	doTheLoopDammit: function(i, frequencyArray, volumeArray) {
	 audioLoop = setTimeout(function() {
			rusicMusic.calculateFrequency(frequencyArray[i], volumeArray[i]);
			if (i === (frequencyArray.length - 1)) {
				setTimeout(function() {
					rusicMusic.silence();
				}, 500);
			}
		}, 500 * i);
	 }
}

rusicMusic.init();
rusicMusic.play();


$(document).on("click", "[data-play-that-funky-music-white-boy]", function(e) {
	e.preventDefault();

	var content = $(this).closest(".card").find(".list-group-item-text").text();

	var frequencyArray = rusicMusic.convertStringToFrequencyArray(content);
	var volumeArray = rusicMusic.convertStringToVolumeArray(content);

	for(var i = 0; i < frequencyArray.length; i++) {
		rusicMusic.doTheLoopDammit(i, frequencyArray, volumeArray);
	}
});