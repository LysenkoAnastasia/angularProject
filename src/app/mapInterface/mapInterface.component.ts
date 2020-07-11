import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Layer} from 'mapbox-gl';
import {MapService} from '../map.service';
import {fromEvent, Subscription} from 'rxjs';

@Component({
  selector: 'app-marker',
  template: ''
})
export class MapInterfaceComponent implements OnChanges, OnInit, OnDestroy, Layer{
  title = 'angularProject';
  id: string;
  isLayerAdd = false;
  subscription = Subscription;
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isLayerAdd) {
      return;
    }
    // ...
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    // this.subscription = MapService.mapLoaded
    //   .pipe(
    //     switchMap(() =>
    //       fromEvent(<any> this.MapService.mapInstance, 'styledata').pipe(
    //         mapTo(false),
    //         filter(() => !this.MapService.mapInstance.getLayer(this.id)),
    //         startWith(true)
    //       )
    //     )
    //   )._subscribe()
  }
}
