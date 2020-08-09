const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/shards'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/shards'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/shards'),
  faceapi.nets.faceExpressionNet.loadFromUri('/shards'),
  faceapi.nets.ageGenderNet.loadFromUri('/shards')
]).then(getMedia());

function getMedia(){
  // let stream = null;
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
      video.srcObject = stream;
      video.play();
  })
  .catch(function(err) {
      console.log("An error occurred: " + err);
  });
}

video.addEventListener('play', () => {
  const canvas = document.querySelector('canvas')
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    resizedDetections.forEach( detections => {
      const box = detections.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detections.age) + " year old " + detections.gender })
      drawBox.draw(canvas)
    })

  }, 100);

})
