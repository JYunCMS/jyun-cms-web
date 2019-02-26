import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAllComponent } from './resource-all.component';

describe('ResourceAllComponent', () => {
  let component: ResourceAllComponent;
  let fixture: ComponentFixture<ResourceAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
