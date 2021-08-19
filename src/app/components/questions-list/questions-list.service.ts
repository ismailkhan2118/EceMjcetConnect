import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Post } from 'src/app/shared/post.model';
import { Question } from 'src/app/shared/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionsListService {
  UnansweredPosts: Post[];
  isUAPostsArrayReady = new BehaviorSubject<string>('');

  constructor(private fsService: FirestoreService) {}

  public pushUnansweredNextBatch() {
    return this.fsService.fetchUnansweredNextBatch().pipe(
      tap((data) => {
        if (data.empty) {
          this.isUAPostsArrayReady.next('complete');
          return;
        }
        const newArr: Post[] = data.docs.map((d: any) => {
          const obj: Question = d.data();
          const docid: string = d.id;
          return { ...obj, docid: docid };
        });
        this.UnansweredPosts.push(...newArr);
        this.isUAPostsArrayReady.next('true');
        const lastDocIdx = data.docs.length - 1;
        this.fsService.latestUnAnswerDoc = data.docs[lastDocIdx];
      })
    );
  }

  pushUnansweredFirstBatch() {
    return this.fsService.fetchUnansweredFirstBatch().pipe(
      tap((data) => {
        const newArr: Post[] = data.docs.map((d: any) => {
          const obj: Question = d.data();
          const docid: string = d.id;
          return { ...obj, docid: docid };
        });
        this.UnansweredPosts = [...newArr];
        this.isUAPostsArrayReady.next('true');
        const lastDocIdx = data.docs.length - 1;
        this.fsService.latestUnAnswerDoc = data.docs[lastDocIdx];
      })
    );
  }

  removeQuestion(docid: string) {
    return this.fsService.deleteQuestion(docid).pipe(
      tap((d) => {
        this.UnansweredPosts = this.UnansweredPosts.filter((item) => {
          return item.docid != docid;
        });
        this.isUAPostsArrayReady.next('true');
      })
    );
  }

  public getUAPosts() {
    return this.UnansweredPosts;
  }

  public clearData() {
    this.UnansweredPosts = [];
  }
}
