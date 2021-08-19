import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { ToastService } from '../toasts-container/toast.service';

@Component({
  selector: 'app-write-answer',
  templateUrl: './write-answer.component.html',
  styleUrls: ['./write-answer.component.css'],
})
export class WriteAnswerComponent implements OnInit {
  ansForm: FormGroup;
  questionId: string;
  question: string;
  viewcont = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private fsService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.params['id'];
    this.fsService.fetchQuestion(this.questionId).subscribe((res: any) => {
      this.question = res.data().question;
      this.viewcont = true;
    });
    this.ansForm = this.formBuilder.group({
      ans: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  get ansControl() {
    return this.ansForm.get('ans');
  }

  onSubmit() {
    this.isLoading = true;
    this.fsService.fetchUserProfile().subscribe((data) => {
      this.isLoading = false;
      if (data.exists) {
        this.postAnswer();
      } else {
        this.showProfileErr();
        this.ansForm.reset();
        setTimeout(() => {}, 2000);
      }
    });
  }

  postAnswer() {
    this.isLoading = true;
    this.fsService
      .postAnswer(this.ansControl?.value, this.questionId)
      .subscribe(
        () => {
          this.isLoading = false;
          this.fsService.makeQuestionAnswered(this.questionId);
          this.ansForm.reset();
          this.showSuccess();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        },
        (err) => {
          this.isLoading = false;
          this.ansForm.reset();
          this.showErr();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        }
      );
  }

  showSuccess() {
    this.toastService.show('Answered Successfully!', {
      classname: 'bg-jet text-light',
      delay: 1500,
    });
  }

  showErr() {
    this.toastService.show('An Error Occured, Please try later!', {
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
