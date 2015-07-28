$(document).ready(function(){

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  var source;
  var stream;
  var mute = document.querySelector('.mute');
  var analyser = audioCtx.createAnalyser();

  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;

  var distortion = audioCtx.createWaveShaper();
  var gainNode = audioCtx.createGain();
  var biquadFilter = audioCtx.createBiquadFilter();
  var convolver = audioCtx.createConvolver();


  function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };


  var soundSource, concertHallBuffer;

  // ajaxRequest = new XMLHttpRequest();
  //
  // ajaxRequest.open('GET', 'http://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg', true);
  //
  // ajaxRequest.responseType = 'arraybuffer';
  //
  //
  // ajaxRequest.onload = function() {
  //   var audioData = ajaxRequest.response;
  //
  //   audioCtx.decodeAudioData(audioData, function(buffer) {
  //       concertHallBuffer = buffer;
  //       soundSource = audioCtx.createBufferSource();
  //       soundSource.buffer = concertHallBuffer;
  //     }, function(e){"Error with decoding audio data" + e.err});
  //
  //   //soundSource.connect(audioCtx.destination);
  //   //soundSource.loop = true;
  //   //soundSource.start();
  // }
  //
  // ajaxRequest.send();


  var canvas = document.querySelector('.visualizer');
  console.log(canvas);
  var canvasCtx = canvas.getContext("2d");

  var intendedWidth = document.querySelector('.wrapper').clientWidth;

  canvas.setAttribute('width',intendedWidth);

  var visualSelect = document.getElementById("visual");

  var drawVisual;

  //main block for doing the audio recording

  if (navigator.mediaDevices.getUserMedia) {
     console.log('getUserMedia supported.');
     navigator.mediaDevices.getUserMedia (
        // constraints - only audio needed for this app
        {
           audio: true
        },

        // Success callback
        function(stream) {
           source = audioCtx.createMediaStreamSource(stream);
           source.connect(analyser);
           analyser.connect(distortion);
           distortion.connect(biquadFilter);
           biquadFilter.connect(convolver);
           convolver.connect(gainNode);
           gainNode.connect(audioCtx.destination);

           visualize();

        },

        // Error callback
        function(err) {
           console.log('The following gUM error occured: ' + err);
        }
     );
  } else {
     console.log('getUserMedia not supported on your browser!');
  }

  function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;


    var visualSetting = visualSelect.value;
    console.log(visualSetting);

      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
      var dataArray = new Uint8Array(bufferLength);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
      };

      draw();

  }


  // event listeners to change visualize and voice settings

  visualSelect.onchange = function() {
    // window.cancelAnimationFrame(drawVisual);
    visualize();
  }

});
