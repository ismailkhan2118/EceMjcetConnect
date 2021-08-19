import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Post } from 'src/app/shared/post.model';
import { Question } from 'src/app/shared/question.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  posts: Post[];
  isPostsArrayReady = new BehaviorSubject<string>('');

  constructor(private fsService: FirestoreService) {}

  public pushAnsweredNextBatch() {
    return this.fsService.fetchAnsweredNextBatch().pipe(
      tap((data) => {
        if (data.empty) {
          this.isPostsArrayReady.next('complete');
          return;
        }
        const newArr: Post[] = data.docs.map((d: any) => {
          const obj: Question = d.data();
          const docid: string = d.id;
          return { ...obj, docid: docid };
        });
        this.posts.push(...newArr);
        this.isPostsArrayReady.next('true');
        const lastDocIdx = data.docs.length - 1;
        this.fsService.latestQuestionDoc = data.docs[lastDocIdx];
      })
    );
  }

  pushAnsweredFirstBatch() {
    return this.fsService.fetchAnsweredFirstBatch().pipe(
      tap((data) => {
        const newArr: Post[] = data.docs.map((d: any) => {
          const obj: Question = d.data();
          const docid: string = d.id;
          return { ...obj, docid: docid };
        });
        this.posts = [...newArr];
        this.isPostsArrayReady.next('true');
        const lastDocIdx = data.docs.length - 1;
        this.fsService.latestQuestionDoc = data.docs[lastDocIdx];
      })
    );
  }

  public getPosts() {
    return this.posts;
  }
}
