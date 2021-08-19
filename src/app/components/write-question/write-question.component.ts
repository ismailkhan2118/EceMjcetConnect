import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { ToastService } from '../toasts-container/toast.service';

@Component({
  selector: 'app-write-question',
  templateUrl: './write-question.component.html',
  styleUrls: ['./write-question.component.css'],
})
export class WriteQuestionComponent implements OnInit {
  quesForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private fsService: FirestoreService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.quesForm = this.formBuilder.group({
      ques: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get quesControl() {
    return this.quesForm.get('ques');
  }

  onSubmit() {
    this.isLoading = true;
    this.fsService.fetchUserProfile().subscribe((data) => {
      this.isLoading = false;
      if (data.exists) {
        this.postQuestion();
      } else {
        this.showProfileErr();
        this.quesForm.reset();
        setTimeout(() => {}, 2000);
      }
    });
  }

  postQuestion() {
    this.isLoading = true;
    this.fsService.postQuestion(this.quesControl?.value).subscribe(
      () => {
        this.isLoading = false;
        this.quesForm.reset();
        this.showSuccess();
        setTimeout(() => {
          this.router.navigate(['questions']);
        }, 2000);
      },
      (err) => {
        this.isLoading = false;
        this.quesForm.reset();
        this.showErr();
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      }
    );
  }

  showErr() {
    this.toastService.show('An Error Occured, Please try later!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }
  showSuccess() {
    this.toastService.show('Successfully Submitted your Question!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }

  showProfileErr() {
    this.toastService.show('Please Create Your Profile First!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }
}
