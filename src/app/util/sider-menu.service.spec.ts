import { TestBed } from '@angular/core/testing';

import { SiderMenuService } from './sider-menu.service';

describe('SiderMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SiderMenuService = TestBed.get(SiderMenuService);
    expect(service).toBeTruthy();
  });
});
