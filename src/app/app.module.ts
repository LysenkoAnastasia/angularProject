import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
// import {MarkerComponent} from './marker/marker.component';
import {MapInterfaceComponent} from './mapInterface/mapInterface.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    // MarkerComponent,
    MapInterfaceComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
