import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  latestQuestionDoc: any;
  latestAnswerDoc: any;
  latestUnAnswerDoc: any; //not answered question
  user: CurrentUser | null;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
      } else {
        user = null;
      }
    });
  }

  public fetchAnsweredFirstBatch() {
    return this.firestore
      .collection('questions', (ref) =>
        ref.orderBy('askedOn', 'desc').limit(10).where('anse', '==', true)
      )
      .get();
  }

  public fetchAnsweredNextBatch() {
    return this.firestore
      .collection('questions', (ref) =>
        ref
          .orderBy('askedOn', 'desc')
          .startAfter(this.latestQuestionDoc)
          .limit(10)
          .where('anse', '==', true)
      )
      .get();
  }

  public fetchUnansweredFirstBatch() {
    return this.firestore
      .collection('questions', (ref) =>
        ref.orderBy('askedOn', 'desc').limit(10).where('anse', '==', false)
      )
      .get();
  }

  public fetchUnansweredNextBatch() {
    return this.firestore
      .collection('questions', (ref) =>
        ref
          .orderBy('askedOn', 'desc')
          .startAfter(this.latestUnAnswerDoc)
          .limit(10)
          .where('anse', '==', false)
      )
      .get();
  }

  public postQuestion(question: string) {
    let setData: any = {
      question: question,
      userid: this.user?.localId,
      askedOn: firebase.firestore.FieldValue.serverTimestamp(),
      anse: false,
    };
    return from(this.firestore.collection('questions').add(setData));
  }

  public deleteQuestion(docid: string) {
    return from(this.firestore.collection('questions').doc(docid).delete());
  }
  public deleteAnswer(quesId: string, userid: string) {
    return from(
      this.firestore
        .collection('questions')
        .doc(quesId)
        .collection('answers')
        .doc(userid)
        .delete()
    ).pipe(
      tap((res) => {
        this.checkQuestionHasNoAnswers(quesId);
      })
    );
  }

  public checkQuestionHasNoAnswers(quesId: string) {
    this.firestore
      .collection('questions')
      .doc(quesId)
      .collection('answers', (ref) =>
        ref.orderBy('answeredOn', 'desc').limit(1)
      )
      .get()
      .subscribe((d) => {
        if (d.empty) {
          this.makeQuestionUnanswered(quesId);
        }
      });
  }

  public makeQuestionUnanswered(questionId: string) {
    this.firestore
      .collection('questions')
      .doc(questionId)
      .update({ anse: false });
  }

  public postAnswer(answer: string, quesid: string) {
    return from(
      this.firestore
        .collection('questions')
        .doc(quesid)
        .collection('answers')
        .doc(this.user?.localId)
        .set({
          answer: answer,
          answeredOn: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );
  }
  public fetchQuestion(docid: string) {
    return this.firestore.collection('questions').doc(docid).get();
  }

  public makeQuestionAnswered(questionId: string) {
    this.firestore
      .collection('questions')
      .doc(questionId)
      .update({ anse: true });
  }

  public fetchAnswersFirstBatch(docid: string) {
    return this.firestore
      .collection('questions')
      .doc(docid)
      .collection('answers', (ref) =>
        ref.orderBy('answeredOn', 'desc').limit(3)
      )
      .get();
  }

  public fetchAnswersNextBatch(docid: string) {
    return this.firestore
      .collection('questions')
      .doc(docid)
      .collection('answers', (ref) =>
        ref
          .orderBy('answeredOn', 'desc')
          .startAfter(this.latestAnswerDoc)
          .limit(5)
      )
      .get();
  }

  //profiles
  public createProfile(
    name: string,
    bio: string,
    gradYear: string,
    photoUrl: string
  ) {
    return from(
      this.firestore
        .collection('profiles')
        .doc(this.user?.localId)
        .set({ name: name, bio: bio, gradYear: gradYear, photoUrl: photoUrl })
    );
  }

  public fetchUserProfile() {
    return this.firestore.collection('profiles').doc(this.user?.localId).get();
  }

  public fetchProfile(userid: string) {
    return this.firestore.collection('profiles').doc(userid).get();
  }
}
