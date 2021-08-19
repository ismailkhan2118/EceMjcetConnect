import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Post } from 'src/app/shared/post.model';
import { QuestionsListService } from './questions-list.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css'],
})
export class QuestionsListComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  posts: Post[];
  isDataReady = false;
  loadMoreBtn = true;
  userId: string;
  isLoading = false;
  noData = false;

  constructor(
    private authService: AuthService,
    private fs: FirestoreService,
    private questionsListService: QuestionsListService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((data) => {
      this.userId = data?.localId!;
    });
    this.isLoggedIn = this.authService.isUserLoggedIn;
    this.getPostsArray();
    this.isLoading = true;
    this.questionsListService.pushUnansweredFirstBatch().subscribe(
      (d) => {
        this.isLoading = false;
        if (d.empty) {
          this.loadMoreBtn = false;
          this.noData = true;
          //showerr
        }
      },
      (err) => {
        this.loadMoreBtn = false;
        this.isLoading = false;
        this.noData = true;
        //showerr
      }
    );
  }

  loadMore() {
    this.isLoading = true;
    this.questionsListService.pushUnansweredNextBatch().subscribe(
      (d) => {
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        //showerr
      }
    );
  }

  getPostsArray() {
    this.questionsListService.isUAPostsArrayReady.subscribe((isReady) => {
      if (isReady === 'true') {
        this.posts = this.questionsListService.getUAPosts();
        this.isDataReady = true;
      } else if (isReady === 'complete') {
        this.posts = this.questionsListService.getUAPosts();
        if (this.posts.length > 0) {
          this.loadMoreBtn = false;
          this.isDataReady = true;
        }
      }
    });
  }

  deleteQuestion(docid: string) {
    this.isLoading = true;
    this.questionsListService.removeQuestion(docid).subscribe(
      (d) => {
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        //showerr
      }
    );
  }

  ngOnDestroy() {
    this.questionsListService.clearData();
  }
}
