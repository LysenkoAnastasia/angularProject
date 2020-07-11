import { environment } from 'src/environments/environment';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from 'src/app/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 55.7;
  lng = 37.61;
  zoom: 12;

  constructor() {
  }

  ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }

  ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.');
    }

  get mapInstance(): any {
    return this.mapInstance();
  }

  ngOnInit() {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.accessToken);
    // mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      // accessToken: 'pk.eyJ1IjoiYW5hc3Rhc2lhMCIsImEiOiJja2NkMGRjdmMwOXgxMnNwOWhmdXNmbG92In0.9tbEWkSvlsFcehw0tSO9ZQ',
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }



}
