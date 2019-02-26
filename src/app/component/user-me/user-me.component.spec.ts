import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMeComponent } from './user-me.component';

describe('UserMeComponent', () => {
  let component: UserMeComponent;
  let fixture: ComponentFixture<UserMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
