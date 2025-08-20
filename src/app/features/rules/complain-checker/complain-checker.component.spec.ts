import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainCheckerComponent } from './complain-checker.component';

describe('ComplainCheckerComponent', () => {
  let component: ComplainCheckerComponent;
  let fixture: ComponentFixture<ComplainCheckerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplainCheckerComponent]
    });
    fixture = TestBed.createComponent(ComplainCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
