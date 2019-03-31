import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleResourceComponent } from './article-resource.component';

describe('ArticleResourceComponent', () => {
  let component: ArticleResourceComponent;
  let fixture: ComponentFixture<ArticleResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
