import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {Observable, AsyncSubject} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
export class MapService {
  mapInstance: mapboxgl.Map;
  mapCreated: Observable<void>;
  mapLoaded: Observable<void>;

  private mapLoad = new AsyncSubject<void>();
  private mapCreate = new AsyncSubject<void>();

  constructor() {
    this.mapLoaded = this.mapLoad.asObservable();
    this.mapCreated = this.mapCreate.asObservable();
  }
}
