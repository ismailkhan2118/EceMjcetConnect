import firebase from 'firebase';

export interface Question {
  userid: string;
  question: string;
  askedOn: firebase.firestore.Timestamp;
  anse: boolean;
}
