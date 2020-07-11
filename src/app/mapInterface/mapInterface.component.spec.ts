import { TestBed, async } from '@angular/core/testing';
import {MapInterfaceComponent} from './mapInterface.component';

describe('MapInterface', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapInterfaceComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MapInterfaceComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angularProject'`, () => {
    const fixture = TestBed.createComponent(MapInterfaceComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('angularProject');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(MapInterfaceComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('angularProject app is running!');
  });
});
