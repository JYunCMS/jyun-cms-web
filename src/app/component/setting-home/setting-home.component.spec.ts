import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingHomeComponent } from './setting-home.component';

describe('SettingHomeComponent', () => {
  let component: SettingHomeComponent;
  let fixture: ComponentFixture<SettingHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
