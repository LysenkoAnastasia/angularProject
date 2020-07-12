import {Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {CircleLayout, CirclePaint, GeoJSONSource, Layer, MapLayerMouseEvent} from 'mapbox-gl';
import {MapService} from 'src/app/map.service';
import {fromEvent, Subscription} from 'rxjs';
import {filter, mapTo, startWith, switchMap} from 'rxjs/operators';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-marker',
  template: ''
})
export class MapInterfaceComponent implements OnChanges, OnInit, OnDestroy, Layer {
  title = 'angularProject';
  id: string;
  isLayerAdd = false;
  subscription: Subscription;
  source?: GeoJSONSource;
  type: 'circle';
  metadata?: any;
  sourceLayer?: string;
  layout: CircleLayout;
  filter: any[];

  @Output() click = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseEnter = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseLeave = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseMove = new EventEmitter<MapLayerMouseEvent>();
  @Input() paint?: CirclePaint;
  @Input() before?: string;

  constructor(private MapService: MapService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isLayerAdd) {
      return;
    }
    if (changes.paint && !changes.paint.isFirstChange()) {
      this.MapService.setLayerPaint(this.id, changes.paint.currentValue!);
    }
    // ...
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.subscription = this.MapService.mapLoaded
      .pipe(
        switchMap(() =>
          fromEvent(this.MapService.map as any, 'styledata').pipe(
            mapTo(false),
            filter(() => !this.MapService.map.getLayer(this.id)),
            startWith(true)
          )
        )
      ).subscribe((bindEvents: boolean) => this.init(bindEvents));
  }

  private init(bindEvents: boolean) {
    const layer = {
      layerOptions: {
        id: this.id,
        type: this.type,
        source: this.source,
        metadata: this.metadata,
        'source-layer': this.sourceLayer,
        minzoom: 0.1,
        maxzoom: 12,
        filter: this.filter,
        layout: this.layout,
        paint: this.paint
      },
      layerEvents: {
        click: this.click,
        mouseEnter: this.mouseEnter,
        mouseLeave: this.mouseLeave,
        mouseMove: this.mouseMove
      }
    };
    this.MapService.addLayer(layer, bindEvents, this.before);
    this.isLayerAdd = true;
  }
}
