import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTagComponent } from './navigation-tag.component';

describe('NavigationTagComponent', () => {
  let component: NavigationTagComponent;
  let fixture: ComponentFixture<NavigationTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
