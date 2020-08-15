const button = document.getElementById('submit');
if (button){
  button.addEventListener('click', () => {
    let video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        // video.play();
    })
    let canvas = document.createElement('canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0,0);
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mod = document.getElementById('YourMode').value;
          const image64 = canvas.toDataURL();      
          const data = {lat,lon,mod,image64};
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          };
          const response = await fetch('/api',options);
          const data_ = response.text();
          console.log(data_);
          mapboxgl.accessToken = 'pk.eyJ1IjoibWFoeWFyYXphZCIsImEiOiJjazhzaG9pNjIwYzJ4M2VyczJlNnNndzF6In0.ZFGc5daAFPaXObvBKA20CA';
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [position.coords.longitude, position.coords.latitude], // starting position [lng, lat]
            zoom: 14
            });
          let marker = new mapboxgl.Marker()
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .addTo(map);
          document.getElementById("location-lat").textContent = 'Lat: ' + position.coords.latitude +'°' ;
          document.getElementById("location-lon").textContent = 'Lon: ' + position.coords.longitude + '°' ;
          document.getElementById("YourMode").value = '';
        });

      } else {
        console.log('geolocation IS NOT available');
      }

    },false);
  }
