//https://docs.mapbox.com/mapbox-gl-js/example/add-image/
mapboxgl.accessToken = 'pk.eyJ1IjoiYXphcmFzaGkiLCJhIjoiY2t0YmdibXczMXZwbzJubzBnZHI4Ym4zMCJ9.1C3RNiQqSioL1NkDSFE5Xg';
    
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/azarashi/cleiljshs001f01nv27qq5mn4',
    center: [139.6670516, 35.3811673],//仮数値
    zoom: 3,//仮数値
    //pitch: 70,
    //bounds:addpoint(),
    customAttribution: ['<a href="https://www.jma.go.jp/jma/index.html">震度情報:©︎気象庁</a>', '<a href="https://nlftp.mlit.go.jp/index.html">国土数値情報:©︎国土交通省</a>','<a href="https://twitter.com/nyaonearthquake?s=21">編集:©︎nyaonearthquake</a>']
});

// コントロール関係表示
map.addControl(new mapboxgl.NavigationControl());

var url = 'https://azarashiha.github.io/weather_map/data/output.json';

fetch(url)
  .then(function(response) {
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    map.on('load', function() {
      map.addLayer({
        'id': 'line-layer-p',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': data
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'white',
          'line-width': 2
        },
        'filter':["==",'type','等圧線']
      });
      map.addLayer({
        'id': 'line-layer-w',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': data
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'red',
          'line-width': 4
        },
        'filter':["==",'type','温暖前線']
      });
      map.addLayer({
        'id': 'line-layer-c',
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': data
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'blue',
          'line-width': 4
        },
        'filter':["==",'type','寒冷前線']
      });
      map.addLayer({
        "id": "low-pressure",
        "type": "symbol",
        'source': {
            'type': 'geojson',
            'data': data
          },
        "filter": ["==", "type", "低気圧"],
        "layout": {
            "text-field": "L",
            "text-writing-mode": ["vertical", "horizontal"]
        },
        'paint': {
           'text-color':'#67a8dd',
           
           
          },
      });
      map.addLayer({
        "id": "h-pressure",
        "type": "symbol",
        'source': {
            'type': 'geojson',
            'data': data
          },
        "filter": ["==", "type", "高気圧"],
        "layout": {
            "text-field": "H",
            "text-writing-mode": ["vertical", "horizontal"]
        },
        'paint': {
           'text-color':'red',
           
           
          },
      });
      
    });
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ', error.message);
  });