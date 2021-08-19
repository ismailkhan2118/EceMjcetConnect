import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;
  showNavLinks = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  checkInOut() {
    if (this.isLoggedIn) {
      this.authService.signOut();
      this.isLoggedIn = false;
    }
    this.router.navigate(['auth']);
  }

  toggleNav() {
    this.showNavLinks = !this.showNavLinks;
  }
}
