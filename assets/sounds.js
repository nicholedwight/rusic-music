
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
		result = result.substring(0, 3) + "." + result.substring(4);
		return result;
	},
	convertStringToArray: function(string) {
		var self = this,
		    returnArray = [],
		    words = string.split(" "); // Simple word-splitting
		words.forEach(function(word, index) {
			returnArray.push(self.convertStringToNumber(word));
		});
	},
	convertArrayToMUSIC: function(array) {
		var values = [];

	}
}

window.onload = function() {
	rusicMusic.init();
	rusicMusic.play();
	for(var i = 0; i < 20; i++) {
		setTimeout(function() {
			var freq = (255 * Math.random());
			var gain = (100 * Math.random());
			rusicMusic.calculateFrequency(freq, 100);
			console.log(freq, 100);
		}, 100 * i);
	}
}