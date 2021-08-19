import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Answer } from 'src/app/shared/answer.model';
import { AuthService } from 'src/app/shared/auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Injectable({ providedIn: 'root' })
export class ViewQuestionService {
  answers: {
    answer: string;
    answeredOn: firebase.firestore.Timestamp;
    docid: string;
    name: string;
    bio: string;
    gradYear: string;
    photoUrl: string;
  }[];
  userId: string;
  isAnsArrayReady = new BehaviorSubject<string>('false');
  loader = new Subject<boolean>();

  constructor(
    private fsService: FirestoreService,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe((data) => {
      this.userId = data?.localId!;
    });
  }

  public pushAnswersFirstBatch(questionId: string) {
    this.loader.next(true);
    let latestAnswerDoc: any;
    let newArr: any;
    let observables: Observable<any>[];
    let source: any;
    this.fsService
      .fetchAnswersFirstBatch(questionId)
      .pipe(
        switchMap((data) => {
          latestAnswerDoc = data.docs[data.docs.length - 1];
          newArr = data.docs.map((d: any) => {
            const obj: Answer = d.data();
            const docid: string = d.id;
            return {
              ...obj,
              docid: docid.trim(),
              name: '',
              bio: '',
              gradYear: '',
              photoUrl: '',
            };
          });
          observables = newArr.map((res: any) => {
            return this.fsService.fetchProfile(res.docid);
          });
          source = forkJoin(observables);
          return source;
        })
      )
      .subscribe(
        (profiles: any) => {
          this.loader.next(false);
          profiles.forEach((profile: any) => {
            newArr.forEach((element: any) => {
              if (element.docid === profile.id) {
                element.name = profile.data().name;
                element.bio = profile.data().bio;
                element.gradYear = profile.data().gradYear;
                element.answeredOn = this.prettyDate(
                  element.answeredOn.toDate()
                );
                element.photoUrl = profile.data().photoUrl;
              }
            });
          });
          this.answers = [...newArr];
          this.isAnsArrayReady.next('true');
          this.fsService.latestAnswerDoc = latestAnswerDoc;
        },
        (err) => {
          this.loader.next(false);
        }
      );
  }

  public pushAnswersNextBatch(questionId: string) {
    this.loader.next(true);
    let latestAnswerDoc: any;
    let newArr: any;
    let observables: Observable<any>[];
    let source: any;
    this.fsService
      .fetchAnswersNextBatch(questionId)
      .pipe(
        switchMap((data) => {
          if (data.empty) {
            this.isAnsArrayReady.next('complete');
            return of(null);
          }
          const lastIdx = data.docs.length - 1;
          latestAnswerDoc = data.docs[lastIdx];
          newArr = data.docs.map((d: any) => {
            const obj: Answer = d.data();
            const docid: string = d.id;
            return {
              ...obj,
              docid: docid.trim(), //trim for typos
              name: '',
              bio: '',
              gradYear: '',
            };
          });
          observables = newArr.map((res: any) => {
            return this.fsService.fetchProfile(res.docid);
          });
          source = forkJoin(observables);
          return source;
        })
      )
      .subscribe(
        (profiles: any) => {
          this.loader.next(false);
          if (profiles === null) {
            return;
          }
          profiles.forEach((profile: any) => {
            newArr.forEach((element: any) => {
              if (element.docid === profile.id) {
                element.name = profile.data().name;
                element.bio = profile.data().bio;
                element.gradYear = profile.data().gradYear;
                element.answeredOn = this.prettyDate(
                  element.answeredOn.toDate()
                );
              }
            });
          });
          this.answers.push(...newArr);
          this.isAnsArrayReady.next('true');
          this.fsService.latestAnswerDoc = latestAnswerDoc;
        },
        (err) => {
          this.loader.next(false);
        }
      );
  }

  public getAnswers() {
    return this.answers;
  }

  public getQustion(id: string) {
    return this.fsService.fetchQuestion(id);
  }

  public removeAnswer(quesId: string) {
    this.loader.next(true);
    this.fsService.deleteAnswer(quesId, this.userId).subscribe(
      (d) => {
        this.loader.next(false);
        this.answers = this.answers.filter((item) => {
          return item.docid != this.userId;
        });
        this.isAnsArrayReady.next('true');
      },
      (err) => {
        this.loader.next(false);
      }
    );
  }

  prettyDate(rawDate: Date) {
    let months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let date = rawDate.getDate();
    let month = months[rawDate.getMonth()];
    let year = rawDate.getFullYear();
    let pretDate = `${month} ${date} ${year}`;
    return pretDate;
  }

  clearAns() {
    this.answers = [];
  }
}
