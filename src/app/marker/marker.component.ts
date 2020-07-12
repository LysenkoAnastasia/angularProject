import {Component, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-marker',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MarkerComponent implements OnChanges{
  title = 'angularProject';

  ngOnChanges(changes: SimpleChanges): void {
  }
}
