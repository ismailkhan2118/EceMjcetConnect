import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewQuestionService } from './view-question.service';
import firebase from 'firebase';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css'],
})
export class ViewQuestionComponent implements OnInit, OnDestroy {
  selectedQuesId: string;
  selectedQues: string;
  loadMoreBtn = true;
  isDataReady = false;
  isLoggedIn = false;
  isLoading = false;
  userId: string;
  answers: {
    answer: string;
    answeredOn: firebase.firestore.Timestamp;
    docid: string;
    name: string;
    bio: string;
    gradYear: string;
    photoUrl: string;
  }[];

  constructor(
    private route: ActivatedRoute,
    private viewQuesService: ViewQuestionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.viewQuesService.loader.subscribe((d) => {
      this.isLoading = d;
    });
    this.authService.currentUser.subscribe((data) => {
      this.userId = data?.localId!;
    });

    this.isLoggedIn = this.authService.isUserLoggedIn;
    this.selectedQuesId = this.route.snapshot.params.id;

    this.viewQuesService
      .getQustion(this.selectedQuesId)
      .subscribe((res: any) => {
        this.selectedQues = res.data().question;
        this.viewQuesService.pushAnswersFirstBatch(this.selectedQuesId);
      });
    this.viewQuesService.pushAnswersFirstBatch(this.selectedQuesId);

    this.viewQuesService.isAnsArrayReady.subscribe((res) => {
      if (res === 'true') {
        const ans = this.viewQuesService.getAnswers();
        if (ans.length > 0) {
          this.answers = [...ans];
          this.isDataReady = true;
        }
      } else if (res === 'complete') {
        this.loadMoreBtn = false;
      }
    });
  }

  onLoadMore() {
    this.viewQuesService.pushAnswersNextBatch(this.selectedQuesId);
  }

  deleteAnswer() {
    this.viewQuesService.removeAnswer(this.selectedQuesId);
  }

  ngOnDestroy() {
    this.viewQuesService.clearAns();
  }
}
