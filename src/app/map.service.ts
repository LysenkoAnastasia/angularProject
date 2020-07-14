import {EventEmitter, Injectable, NgZone} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {Observable, AsyncSubject} from 'rxjs';
//

// @Injectable({
//   providedIn: 'root'
// })


export interface SetupLayer {
  layerOptions: mapboxgl.Layer;
  layerEvents: {
    click: EventEmitter<mapboxgl.MapMouseEvent>;
    mouseEnter: EventEmitter<mapboxgl.MapMouseEvent>;
    mouseLeave: EventEmitter<mapboxgl.MapMouseEvent>;
    mouseMove: EventEmitter<mapboxgl.MapMouseEvent>;
  };
}

export class MapService {
  map: mapboxgl.Map;
  mapCreated: Observable<void>;
  mapLoaded: Observable<void>;

  private mapLoad = new AsyncSubject<void>();
  private mapCreate = new AsyncSubject<void>();
  private zone: NgZone;

  constructor() {
    this.mapLoaded = this.mapLoad.asObservable();
    this.mapCreated = this.mapCreate.asObservable();
  }


  // setLayerPaint(
  //   layerId: string,
  //   paint: mapboxgl.CirclePaint
  // ) {
  //   return this.zone.runOutsideAngular(() => {
  //     Object.keys(paint).forEach((key) => {
  //       this.map.setPaintProperty(layerId, key, (paint as any)[key]);
  //     });
  //   });
  // }
  // addLayer(layer: SetupLayer, bindEvents: boolean, before?: string) {
  //   this.zone.runOutsideAngular(() => {
  //     Object.keys(layer.layerOptions).forEach((key: string) => {
  //       const tkey = key as keyof mapboxgl.Layer;
  //       if (layer.layerOptions[tkey] === undefined) {
  //         delete layer.layerOptions[tkey];
  //       }
  //     });
  //     this.map.addLayer(layer.layerOptions, before);
  //     if (bindEvents) {
  //       if (layer.layerEvents.click.observers.length) {
  //         this.map.on('click', layer.layerOptions.id, (evt: mapboxgl.MapMouseEvent) => {
  //           this.zone.run(() => {
  //             layer.layerEvents.click.emit(evt);
  //           });
  //         });
  //       }
  //       if (layer.layerEvents.mouseEnter.observers.length) {
  //         this.map.on('mouseenter', layer.layerOptions.id, (evt: mapboxgl.MapMouseEvent) => {
  //           this.zone.run(() => {
  //             layer.layerEvents.mouseEnter.emit(evt);
  //           });
  //         });
  //       }
  //       if (layer.layerEvents.mouseLeave.observers.length) {
  //         this.map.on('mouseleave', layer.layerOptions.id, (evt: mapboxgl.MapMouseEvent) => {
  //           this.zone.run(() => {
  //             layer.layerEvents.mouseLeave.emit(evt);
  //           });
  //         });
  //       }
  //       if (layer.layerEvents.mouseMove.observers.length) {
  //         this.map.on('mousemove', layer.layerOptions.id, (evt: mapboxgl.MapMouseEvent) => {
  //           this.zone.run(() => {
  //             layer.layerEvents.mouseMove.emit(evt);
  //           });
  //         });
  //       }
  //     }
  //   });
  // }
}
