import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteQuestionComponent } from './write-question.component';

describe('WriteQuestionComponent', () => {
  let component: WriteQuestionComponent;
  let fixture: ComponentFixture<WriteQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
