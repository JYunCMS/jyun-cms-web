import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationCategoryComponent } from './navigation-category.component';

describe('NavigationCategoryComponent', () => {
  let component: NavigationCategoryComponent;
  let fixture: ComponentFixture<NavigationCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
