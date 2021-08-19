import firebase from 'firebase';

export interface Post {
  docid: string;
  userid: string;
  askedOn: firebase.firestore.Timestamp;
  question: string;
  anse: boolean;
}
