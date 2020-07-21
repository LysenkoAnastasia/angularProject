import { environment } from 'src/environments/environment';
import {Component, OnInit, ChangeDetectorRef, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import circle from '@turf/circle';
// import MapboxDirections;

import {MarkerOptions, Point} from 'src/nt-web-leaflet-map-interface';

function comparePoints(pointAId: mapboxgl.Layer, pointBId: mapboxgl.Layer) {
  if (pointAId.metadata < pointBId.metadata) {
    return 1;
  }
  if (pointAId.metadata === pointBId.metadata) {
    return 0;
  }
  return -1;
}


function Trajectory(pointAId: mapboxgl.Layer, pointBId: mapboxgl.Layer) {
  return comparePoints(pointAId, pointBId) !== 1;

}

function getPathSequences(points: mapboxgl.Layer[]) {
  for (let i = 0; i < points.length - 1; i ++) {
    if (!Trajectory(points[i], points[i + 1])) {
      this.mapboxDirections.setOrigin(points[i]);
      this.mapboxDirections.setDestination(points[i + 1]);
    }
  }
}

function getCustomPopupContent() {
    this.map.on('mouseenter', 'places', e => {
    this.map.getCanvas().style.cursor = 'pointer';

    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    this.popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(this.map);
  });

    this.map.on('mouseleave', 'places', e => {
    this.map.getCanvas().style.cursor = '';
    this.popup.remove();
  });
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],

})
export class MapComponent implements OnInit, Point {

  includeGeometry: true;
  constructor() {
  }

  // idField: string;
  // selectedMarkerColour: string;
  // comparePoints: (pointAId: mapboxgl.Layer, pointBId: mapboxgl.Layer) => 1 | 0 | -1
  // noTrajectory: (pointAId: string, pointBId: string) => boolean;
  // getPathSequences: (points: string[][]) => any;
  // maxClusterRadius: number;
  // defaultMarkerImage: string;
  // getMarkerColour: (point: Point) => string;
  // getCustomPopupContent: (point: Point, isCluster: boolean) => string;
  // maxMarkersInClusterToSpiderfy: any;
  // singleMarkerMode: boolean;
  // centerMapOnAddPoints: boolean;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 55.7;
  lng = 37.61;

  azimut: number;
  id: string;
  latitude: number;
  longitude: number;
  markerColour: string;
  markerImage: string;
  radius: number;

  p1: {
    id: 'id_1';
    azimut: 7;
    latitude: 37.5;
    longitude: 55.6;
    markerColour: '#880977';
    markerImage: '';
    radius: 1;

  };


p2: {
    id: 'id_1';
    azimut: 7;
    latitude: 37.3;
    longitude: 55.9;
    markerColour: '#880977';
    markerImage: 'monument';
    radius: 0.3;
  };
  popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});


ngOnInit() {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.accessToken);
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    const draw = new MapboxDraw();
    this.map.addControl(draw, 'top-left');


    this.map.on('load', (event) => {
    this.map.addSource('points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                -77.03238901390978,
                38.913188059745586
              ]
            },
            properties: {
              title: 'Mapbox DC',
              icon: 'monument'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-122.414, 37.776]
            },
            properties: {
              title: 'Mapbox SF',
              icon: 'harbor'
            }
          }
        ]
      }
    });
    const l = this.map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {

        'icon-image': ['concat', ['get', 'icon'], '-15'],
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top'
      }
    });

  });




    this.map.on('style.load', ev =>  {
      this.map.addSource('earthquakes', {
        type: 'geojson',
        data:
          'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
      });



      this.map.addLayer(
        {
          id: 'earthquakes-heat',
          type: 'heatmap',
          source: 'earthquakes',
          maxzoom: 9,
          paint: {
// Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1
            ],
// Increase the heatmap color weight weight by zoom level
// heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3
            ],
// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
// Begin color ramp at 0-stop with a 0-transparancy color
// to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
// Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
// Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
            ]
          }
        },
        'waterway-label'
      );

      this.map.addLayer(
        {
          id: 'earthquakes-point',
          type: 'circle',
          source: 'earthquakes',
          minzoom: 7,
          paint: {
// Size circle radius by earthquake magnitude and zoom level
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
              16,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
            ],
// Color circle by earthquake magnitude
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              'rgba(33,102,172,0)',
              2,
              'rgb(103,169,207)',
              3,
              'rgb(209,229,240)',
              4,
              'rgb(253,219,199)',
              5,
              'rgb(239,138,98)',
              6,
              'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
// Transition from heatmap to circle layer by zoom level
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              0,
              8,
              1
            ]
          }
        },
        'waterway-label'
      );

      this.map.addSource('museums', {
      type: 'vector',
      url: 'mapbox://mapbox.2opop9hr'
    });
      this.map.addLayer({
      id: 'museums',
      type: 'circle',
      source: 'museums',
      paint: {
        'circle-radius': 8,
        'circle-color': 'rgba(55,148,179,1)'
      },
      'source-layer': 'museum-cusco'
    });

      this.map.addSource('contours', {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-terrain-v2'
    });
      this.map.addLayer({
      id: 'contours',
      type: 'line',
      source: 'contours',
      'source-layer': 'contour',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#877b59',
        'line-width': 1
      }
    });
      const sourse1 = this.map.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-77.03238901390978, 38.913188059745586]
            },
            properties: {
              modelId: 1,
            },
          }, {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-122.414, 37.776]
            },
            properties: {
              modelId: 2,
            },
          }]
        }
      });
      const layer1 = this.map.addLayer({
        id: 'circles1',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [38.1, 55.3]
              },
              properties: {
                modelId: 1,
              },
            }]
          }
        },
        type: 'circle',
        metadata: '16:15',
        paint: {
          'circle-radius': 18,
          'circle-color': '#111234',
          'circle-opacity': 0.5,
          'circle-stroke-width': 0,
        },
        filter: ['==', 'modelId', 1],
      });

      const layer2 = this.map.addLayer({
        id: 'circles2',
        source: 'markers',
        type: 'circle',
        metadata: '16:29',
        paint: {
          'circle-radius': 20,
          'circle-opacity': 0,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#00bf7c',
          'circle-stroke-opacity': 1,
        },
        filter: ['==', 'modelId', 2],
      });
      console.log(comparePoints(layer1.getLayer('circles1'), layer2.getLayer('circles2')));
      console.log(Trajectory(layer2.getLayer('circles2'), layer1.getLayer('circles1')));
      const arr = [layer1.getLayer('circles1'), layer2.getLayer('circles2')];
      // getCustomPopupContent();
      // getPathSequences(arr);

  });


    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.FullscreenControl());

    const marker = new mapboxgl.Marker()
      .setLngLat([37.61, 55.3])
      .setLngLat([37.61, 55.7])
      .addTo(this.map);

    const marker1 = new mapboxgl.Marker()
      .setLngLat([37.55, 55.7])
      .addTo(this.map);

    this.map.on('load', ee => {
    this.map.addSource('places', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              description:
                '<strong>Name</strong><p>Тут должно быть описание</p>',
              icon: 'theatre'
            },
            geometry: {
              type: 'Point',
              coordinates: [38.1, 55.3]
            }
          },
        ]
      }
    });
// Add a layer showing the places.
    this.map.addLayer({
      id: 'places',
      type: 'symbol',
      source: 'places',
      layout: {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true
      }
    });

    this.map.on('click', 'places', e => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(this.map);
    });

    this.map.on('mouseenter', 'places', function() {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'places', еее => {
      this.map.getCanvas().style.cursor = '';
    });
  });

  }
}






