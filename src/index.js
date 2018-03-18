// import Sound from './Sound';

let context = new window.AudioContext();
let $record = document.getElementById('record');
let $play = document.getElementById("play");
let $audio = document.getElementById('audio');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.getUserMedia({audio: true})
		.then(stream => {
			let mediaRecorder = new MediaRecorder(stream);

			$record.addEventListener('mousedown', ev => {
				mediaRecorder.start();
			});

			$record.addEventListener('mouseup', ev => {
				mediaRecorder.stop();
			});

			let chunks = [];
			mediaRecorder.addEventListener('dataavailable', ev => {
				chunks.push(ev.data);
			});

			mediaRecorder.addEventListener("stop", ev => {
				let blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
				
				let audioBuffer;
				let arrayBuffer;
				let fileReader = new FileReader();
				fileReader.addEventListener('load', ev => {
					arrayBuffer = ev.target.result;
					
					context.decodeAudioData(arrayBuffer, audioBuffer => {
						$play.addEventListener("click", ev => {
							let source = context.createBufferSource();
							source.buffer = audioBuffer;

							let biquadFilter = audioCtx.createBiquadFilter();
							
							source.connect(biquadFilter);
							biquadFilter.connect(context.destination);
							source.start();
						});
					}, err => console.error);
				});
				fileReader.readAsArrayBuffer(blob);

				// let audioUrl = window.URL.createObjectURL(blob);
				// audio.src = audioUrl;
			});
		})
		.catch(err => console.error)
}