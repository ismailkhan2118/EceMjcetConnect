import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  errMsg = '';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.authService.signIn().subscribe(
      (res) => {
        this.errMsg = '';
        if (res.additionalUserInfo?.isNewUser) {
          this.router.navigate(['profile']);
        } else {
          this.router.navigate(['']);
        }
      },
      (err) => {
        this.authService.isUserLoggedIn = false;
        this.errMsg = 'An Unknown Error has Occured Please try later :(';
        setTimeout(() => {
          this.errMsg = '';
        }, 1500);
      }
    );
  }

  ngOnDestroy() {}
}
