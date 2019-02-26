import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCommonComponent } from './setting-common.component';

describe('SettingCommonComponent', () => {
  let component: SettingCommonComponent;
  let fixture: ComponentFixture<SettingCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
