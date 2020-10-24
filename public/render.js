

// Initialize MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoibWFoeWFyYXphZCIsImEiOiJja2Y2dHVvcWIwaHlpMnpvejQ2aHV4MjFhIn0.-r5ICGU056rxUV-x73BNQg';
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [43.116592,36.40], // starting position [lng, lat]
  zoom: 0
  });

const button = document.getElementById('submit');
if (button){
  button.addEventListener('click', async () => {
    // const iframe = document.createElement('iframe');
    // iframe.id = 'Uploading';

    const spinner = document.createElement('div');
    spinner.className = 'fancy-spinner';

    const ring = document.createElement('div');
    ring.className = 'ring';
    ring.style.height = "300px";
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.innerHTML = 'Uploading';
    dot.style.height = "300px";
    spinner.append(ring,ring.cloneNode(true),dot);
    logs = document.getElementById('h1');
    const theFirstChild = logs.firstChild
    logs.insertBefore(spinner,theFirstChild);
    const bodycolor = document.body.style.background;
    document.body.style.background = '#696969';
    //document.body.appendChild(spinner);


    // iframe.onload = function() {
    //    let domdoc = iframe.contentDocument || iframe.contentWindow.document;
    //   // domdoc.write(data_);
    //    //alert("..or..")
    //    domdoc.body.innerHTML = Date;
    // }
    let video = await document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        // video.play();
    })
    let canvas = await document.createElement('canvas');
    canvas.id = 'detection';
    canvas.width = video.width;
    canvas.height = video.height;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0,0);

    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
          const uname = '';
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mod = document.getElementById('YourMode').value;
          // Uploading to firebase
          const image64 = canvas.toDataURL("image/jpeg", 1.0);

          // const image64 = canvas.toBlob(function(blob){},'image/jpeg', 1.00);
          //console.log(image64);
          //

          const data = await {uname,lat,lon,mod,image64};
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          };

          const response = await fetch('/api',options);
          const data_ = await response.text();
          // iframe.onload = function() {
          //    let domdoc = iframe.contentDocument || iframe.contentWindow.document;
          //   // domdoc.write(data_);
          //    //alert("..or..")
          //    domdoc.body.innerHTML = data_;
          // }
          console.log(data_);
          document.body.style.background = bodycolor;
          spinner.remove();


        });

    } else {
      console.log('geolocation IS NOT available');
    }
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition( position => {
          map = map.flyTo({
              center:[position.coords.longitude, position.coords.latitude],
              zoom: 13,
              speed: 1
              //essential: true // this animation is considered essential with respect to prefers-reduced-motion
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
