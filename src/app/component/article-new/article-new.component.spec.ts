import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNewComponent } from './article-new.component';

describe('ArticleNewComponent', () => {
  let component: ArticleNewComponent;
  let fixture: ComponentFixture<ArticleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
