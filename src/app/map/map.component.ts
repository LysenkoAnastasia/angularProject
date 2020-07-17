import { environment } from 'src/environments/environment';
import {Component, OnInit, ChangeDetectorRef, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// import MarkerOptions from "./src/nt-web-leaflet-map-interface";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from 'mapbox-gl-draw-circle';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw';
import doubleClickZoom from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import circle from '@turf/circle';

import {convertUpdateArguments} from '@angular/compiler/src/compiler_util/expression_converter';
import {from} from 'rxjs';
import {getLocaleDateTimeFormat} from '@angular/common';
import {DataStore} from 'js-data';
import {Data} from '@angular/router';
// import {MapService} from 'src/app/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements MarkerOptions, OnInit, Point {


  constructor() {
  }

  idField: string;
  selectedMarkerColour: string;
  comparePoints: (pointAId: string, pointBId: string) => 0 | 1 | -1;
  noTrajectory: (pointAId: string, pointBId: string) => boolean;
  getPathSequences: (points: string[][]) => any;
  maxClusterRadius: number;
  defaultMarkerImage: string;
  getMarkerColour: (point: Point) => string;
  getCustomPopupContent: (point: Point, isCluster: boolean) => string;
  maxMarkersInClusterToSpiderfy: any;
  singleMarkerMode: boolean;
  centerMapOnAddPoints: boolean;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 55.7;
  lng = 37.61;

  id: string;
  azimut: number;
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




  // userProperties has to be enabled
  // draw = new MapboxDraw({
  //   displayControlsDefault: false,
  //   userProperties: true,
  //   defaultMode: 'draw_circle',
  //   clickBuffer: 10,
  //   touchBuffer: 10,
  //   modes: {
  //     ...MapboxDraw.modes,
  //     draw_circle: CircleMode,
  //     direct_select: DirectMode,
  //     simple_select: SimpleSelectMode,
  //     drag_circle: DragCircleMode
  //   }
  // });
//
//   what = e => {
//     console.log(this.draw.getAll().features);
//     setTimeout(this.what, 2000);
//   }.bind(this);
// }
//
//   onMapLoaded = map => {
//     map.addControl(this.draw);
//     this.what();
//
//     const notifyParent = (features) => this.props.onFeaturesUpdated(features);
//     map.on('draw.create', e => notifyParent(e.features));
//     map.on('draw.update', e => notifyParent(e.features));
//     map.on('draw.delete', e => notifyParent(e.features));
//
//   };




p2: {
    id: 'id_1';
    azimut: 7;
    latitude: 37.3;
    longitude: 55.9;
    markerColour: '#880977';
    markerImage: 'monument';
    radius: 0.3;
  };


ngOnInit() {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.accessToken);
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    // const draw = new MapboxDraw({
    // defaultMode: 'draw_circle',
    // userProperties: true,
    // clickBuffer: 10,
    // touchBuffer: 10,
    // });
  // userProperties has to be enabled
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

    console.log(l.getCenter());
    // });

    const pol = this.map.addSource('maine', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [37.61, 56.3],
              [38.61, 55.3],
              [37.61, 54.3],
              [36.61, 55.3]
            ]
          ]
        }
      }
    });
    const pol1 = this.map.addLayer({
      id: 'maine',
      type: 'fill',
      source: 'maine',
      layout: {},
      paint: {
        'fill-color': '#088',
        'fill-opacity': 0.8
      }
    });


    console.log(pol1.getCenter());
  });

    // draw.changeMode('draw_circle', { initialRadiusInKm: 0.5 });


  //   console.log(draw);



    this.map.on('style.load', ev =>  {
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
    this.map.addSource('markers', {
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
        source: 'markers',
        type: 'circle',
        metadata: '16:15',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf',
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
    console.log('layer = ' + (layer1.getLayer('circles1').metadata < layer2.getLayer('circles2').metadata));
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

    // this.comparePoints(marker1.getElement().id, 'id_2');

    // });
  }
}

