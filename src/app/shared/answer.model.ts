import firebase from 'firebase';

export interface Answer {
  answer: string;
  answeredOn: firebase.firestore.Timestamp;
}
