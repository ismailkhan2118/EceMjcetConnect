import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { CurrentUser } from './current-user';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<CurrentUser | null>(null);
  constructor(private angularFireAuth: AngularFireAuth) {}
  isUserLoggedIn = false;

  signIn() {
    return from(
      this.angularFireAuth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      )
    ).pipe(
      tap((res) => {
        const user = new CurrentUser(
          res.user?.displayName!,
          res.user?.uid!,
          res.user?.email!,
          res.user?.photoURL!,
          res.additionalUserInfo?.isNewUser!
        );
        this.isUserLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.next(user);
      })
    );
  }

  signOut() {
    this.currentUser.next(null);
    localStorage.removeItem('user');
    this.isUserLoggedIn = false;
    return from(this.angularFireAuth.signOut());
  }
}
